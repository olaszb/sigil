<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Event;
use Date;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class EventController extends Controller
{
    protected $pagination_limit = 10;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::where('start_time', '>=' , Date::now())->orderBy('start_time', 'asc')->paginate($this->pagination_limit);
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

    
    public function destroy(Event $event)
    {
        Gate::authorize('delete', $event);
        $event->delete();
        return response()->json(['message' => 'Event archived successfully!']);
    }

    public function archived(Request $request){
        Gate::authorize('viewAny', Event::class);
        $user = $request->user();

        $query = Event::onlyTrashed();

        if (!$user->isAdmin()){
            $query->where('organizer_id', $user->id);
        }

        $events = $query->latest('deleted_at')->paginate($this->pagination_limit);

        return response()->json($events);
    }

    public function pastEvents(){
        $events = Event::where('start_time', '<', now())
            ->orderBy('start_time', 'desc')
            ->paginate($this->pagination_limit);

        return response()->json($events);
    }
}
