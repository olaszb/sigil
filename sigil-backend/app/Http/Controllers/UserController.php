<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUserEvents(Request $request)
    {
        $status = $request->query('status');
        $events = $request->user()->events()
        ->wherePivot('status', $status)
        ->with('venue')
        ->get();

        return response()->json($events);
    }
}
