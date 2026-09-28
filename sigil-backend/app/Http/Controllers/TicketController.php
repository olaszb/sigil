<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

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
}
