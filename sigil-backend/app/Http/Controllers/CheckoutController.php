<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCheckoutSessionRequest;
use App\Models\CheckoutSession;
use App\Models\Event;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Stripe\Checkout\Session as StripeCheckoutSession;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class CheckoutController extends Controller
{
    public function createSession(CreateCheckoutSessionRequest $request){
        $user = $request->user();
        $validated = $request->validated();

        $event = Event::with(['ticketTypes', 'venue'])->findOrFail($validated['event_id']);
        $ticketTypes = $event->ticketTypes->keyBy('id');
        $sections = collect($event->venue->layout['sections'] ?? [])->keyBy('name');
        
        $lineItems = [];
        $normalizedSelections = [];
        $amountTotal = 0;

        foreach ($validated['selections'] as $selection){
            $ticketTypeId = (int) $selection['ticket_type_id'];
            $qty = (int) $selection['quantity'];
            $seats = $selection['seats'] ?? [];

            $ticketType = $ticketTypes->get($ticketTypeId);
            if (!$ticketType) {
                return response()->json(['error' => 'Invalid ticket type selected.'], 400);
            }

            if ($ticketType->quantity_available !== null && $qty > $ticketType->quantity_available) {
                return response()->json(['error' => 'Not enough tickets available for the selected type.'], 400);
            }

            $sectionDef = $sections->get($ticketType->section_name);
            $isSeated = ($sectionDef['type'] ?? null) === 'seated';

            if ($isSeated && count($seats) !== $qty) {
                return response()->json(['error' => 'Number of seats must match the quantity for seated tickets.'], 400);
            }

            if (! $isSeated && count($seats) > 0) {
                return response()->json(['error' => 'Seats should not be selected for non-seated tickets.'], 400);
            }

            //HUF is zero decimal in Stripe

            $unitAmount = (int) round((float) $ticketType->price);
            if ($unitAmount <= 0) {
                return response()->json(['error' => 'Invalid ticket price.'], 400);
            }

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'huf',
                    'unit_amount' => $unitAmount,
                    'product_data' => [
                        'name' => "{$event->title} - {$ticketType->name}",
                    ],
                ],
                'quantity' => $qty,
            ];

            $amountTotal += $unitAmount * $qty;

            $normalizedSelections[] = [
                'ticket_type_id' => $ticketTypeId,
                'quantity' => $qty,
                'seats' => $seats,
            ];
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:5174'), '/');

        $stripeSession = StripeCheckoutSession::create([
            'mode' => 'payment',
            'line_items' => $lineItems,
            'success_url' => $frontend . '/checkout?status=success&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $frontend . '/checkout?status=cancel&event=' . $event->slug,
            'client_reference_id' => (string) $user->id,
            'metadata' => [
                'event_id' => (string) $event->id,
                'user_id' => (string) $user->id,
            ],
            'managed_payments' => [
                'enabled' => false,
            ],
        ]);

        CheckoutSession::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'stripe_session_id' => $stripeSession->id,
            'selections' => $normalizedSelections,
            'amount_total' => $amountTotal,
            'currency' => 'huf',
            'status' => 'created',
        ]);

        return response()->json([
            'checkout_url' => $stripeSession->url,
        ]);
    }

    public function showSession(string $stripeSessionId, Request $request){
        $checkout = CheckoutSession::where('stripe_session_id', $stripeSessionId)
            ->where('user_id', $request->user()->id)->firstOrFail();

        $tickets = Ticket::with('ticketType:id,name')
            ->where('stripe_session_id', $stripeSessionId)
            ->where('user_id', $request->user()->id)
            ->get();
        
        return response()->json([
            'status' => $checkout->status,
            'event_id' => $checkout->event_id,
            'currency' => $checkout->currency,
            'amount_total' => $checkout->amount_total,
            'tickets' => $tickets,
        ]);
    }

    public function webhook(Request $request){
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        if ($event->type === 'checkout.session.completed'){
            $this->fulfillCheckout($event->data->object);
        }

        if ($event->type === 'checkout.session.expired'){
            CheckoutSession::where('stripe_session_id', $event->data->object->id)
                ->where('status', 'created')
                ->update(['status' => 'expired']);
        }

        return response()->json(['received' => true]);
    }

    private function fulfillCheckout(object $stripeSession): void{
        DB::transaction(function () use ($stripeSession) {
            $checkout = CheckoutSession::where('stripe_session_id', $stripeSession->id)
                ->lockForUpdate()
                ->first();

            if (! $checkout || $checkout->status === 'paid'){
                return;
            }

            $event = Event::with(['ticketTypes', 'venue'])->findOrFail($checkout->event_id);
            $ticketTypes = $event->ticketTypes->keyBy('id');

            $seenSeats = [];

            foreach($checkout->selections as $selection){
                $ticketType = $ticketTypes->get((int) $selection['ticket_type_id']);
                $qty = (int) $selection['quantity'];
                $seats = $selection['seats'] ?? [];

                if (! $ticketType){
                    return response()->json(['error' => 'Invalid ticket type'], 400);
                }

                if ($ticketType->quantity_available !== null && $ticketType->quantity_available < $qty){
                    return response()->json(['error' => 'Not enough tickets available'], 400);
                }

                foreach ($seats as $seat){
                    if (isset($seenSeats[$seat])){
                        return response()->json(['error' => 'Duplicate seat selection'], 400);
                    }
                    $seenSeats[$seat] = true;

                    [$row, $column] = explode('-', $seat);

                    $alreadyTaken = Ticket::where('event_id', $event->id)
                        ->where('section', $ticketType->section_name)
                        ->where('row', $row)
                        ->where('column', $column)
                        ->whereIn('status', ['sold', 'held'])
                        ->exists();

                    if ($alreadyTaken){
                        return response()->json(['error' => 'Seat already taken: ' . $seat], 400);
                    }
                }
            }

            foreach ($checkout->selections as $selection){
                $ticketType = $ticketTypes->get((int) $selection['ticket_type_id']);
                $qty = (int) $selection['quantity'];
                $seats = $selection['seats'] ?? [];

                if ($ticketType->quantity_available !== null) {
                    $ticketType->decrement('quantity_available', $qty);
                }

                if (count($seats) > 0){
                    foreach ($seats as $seat){
                        [$row, $column] = explode('-', $seat);

                        Ticket::create([
                            'user_id' => $checkout->user_id,
                            'event_id' => $event->id,
                            'ticket_type_id' => $ticketType->id,
                            'section' => $ticketType->section_name,
                            'row' => $row,
                            'column' => $column,
                            'ticket_code' => $this->generateTicketCode(),
                            'status' => 'sold',
                            'stripe_session_id' => $checkout->stripe_session_id,
                            'paid_amount' => (int) round((float) $ticketType->price),
                            'currency' => 'huf',
                        ]);
                    }
                } else {
                    for ($i = 0; $i < $qty; $i++){
                        Ticket::create([
                            'user_id' => $checkout->user_id,
                            'event_id' => $event->id,
                            'ticket_type_id' => $ticketType->id,
                            'section' => $ticketType->section_name,
                            'ticket_code' => $this->generateTicketCode(),
                            'status' => 'sold',
                            'stripe_session_id' => $checkout->stripe_session_id,
                            'paid_amount' => (int) round((float) $ticketType->price),
                            'currency' => 'huf',
                        ]);
                    }
                }
            }

            $checkout->update([
                'status' => 'paid',
                'stripe_payment_intent_id' => $stripeSession->payment_intent ?? null,
                'completed_at' => Carbon::now(),
            ]);
        });
    }

    private function generateTicketCode(): string{
        do {
            $code = 'SIG-' . Str::upper(Str::random(12));
        } while (Ticket::where('ticket_code', $code)->exists());
        
        return $code;
    }
}
