<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    public function getMyTickets(Request $request)
    {
        $user = $request->user();
        $tickets = Ticket::with(['event' => function($query) {
            $query->withTrashed();
        }])->where('user_id', $user->id)->latest()->get();

        return response()->json($tickets);
    }

    public function downloadPDF(Request $request, Ticket  $ticket){
        if ($ticket->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $ticket->load(['event' => function ($query) {
            $query->withTrashed()->with('venue'); 
        }, 'ticketType']);

        $svg = QrCode::format('svg')->size(200)->margin(0)->generate($ticket->ticket_code);
        $qrCode = base64_encode($svg);

        $pdf = Pdf::loadView('ticket', compact('ticket', 'qrCode'));

        return $pdf->download("Sigil-Ticket-{$ticket->ticket_code}.pdf");
    }
}
