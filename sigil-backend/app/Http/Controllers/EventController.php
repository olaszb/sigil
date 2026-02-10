<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::orderBy('start_time', 'desc')->paginate(10);
        return response()->json($events);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateEventRequest $request)
    {
        Gate::authorize('create', Event::class);
        $data = $request->validated();

        if($request->hasFile('image_url')) {
            $data['image_url'] = $request->file('image_url')->store('event_images', 'public');
        }

        // $data['organizer_id'] = $request->user()->id;
        $event_id = Event::max('id') + 1; 
        $data['slug'] = Str::slug($data['title']) . '-' . $event_id;

        $event = Event::create($data);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event,
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
    }
}
