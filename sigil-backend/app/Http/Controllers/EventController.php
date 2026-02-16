<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::orderBy('start_time', 'asc')->paginate(10);
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
        ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {  
       $event = Event::with('venue')->where('slug', $slug)->firstOrFail();
       
       return response()->json([
        'event' => $event,
        'venue' => $event->venue
       ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        Gate::authorize('update', $event);
        $data = $request->validated();

        if($request->hasFile('image_url')){
            if($event->image_url){
                Storage::disk('public')->delete($event->image_url);
            }
            $data['image_url'] = $request->file('image_url')->store('event_images', 'public');
        }
        if($event->title !== $data['title']){
            $data['slug'] = Str::slug($data['title']) . '-' . $event->id;
        }

        $event->update($data);

        return response()->json([
            'message' => 'Event updated successfully!',
            'event' => $event,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
    }
}
