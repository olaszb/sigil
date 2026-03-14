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
    public function index(Request $request)
    {
        $query = Event::with("venue:id,name")->where('start_time', '>=', Date::now());

        if($request->filled('search')){
            $searchTerm = $request->query('search');
            $query->where('title', 'ILIKE', "%{$searchTerm}%");
        }

        if($request->filled('month')){
            $query->whereMonth('start_time', $request->query('month'));
        }
        $events = $query->orderBy('start_time', 'asc')->paginate($this->pagination_limit);
        return response()->json($events);
    }

    public function getActiveMonths(){
        $months = Event::where('start_time', '>=', Date::now())
            ->selectRaw('DISTINCT EXTRACT(MONTH FROM start_time) as month')
            ->orderBy('month', 'desc')
            ->pluck('month');
        return response()->json($months);
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
       $event = Event::with('venue')
       ->withCount([
            'users as interested_count' => fn($q) => $q->where('status', 'interested'),
            'users as going_count' => fn($q) => $q->where('status', 'going')
       ])
       ->where('slug', $slug)->firstOrFail();

        if ($event->start_time < now()) {
            return response()->json(['message' => 'This ritual has passed into the archives.'], 404);
        }
       
       return response()->json([
        'event' => $event,
        'venue' => $event->venue
       ]);
    }

    public function showPast($slug)
    {
        $event = Event::with('venue')
            ->withCount([
                'users as interested_count' => fn($q) => $q->where('status', 'interested'),
                'users as going_count' => fn($q) => $q->where('status', 'going')
            ])
            ->where('slug', $slug)->firstOrFail();

        if ($event->start_time >= now()) {
            return response()->json(['message' => 'This ritual has not yet manifested.'], 404);
        }

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

    public function forceDelete($id) {
        $event = Event::withTrashed()->findOrFail($id);
        Gate::authorize('forceDelete', $event);

        if($event->image_url){
            Storage::disk('public')->delete($event->image_url);
        }
        $event->forceDelete();

        return response()->json(['message' => 'Event permanently deleted!']);
    }

    public function restore($id){
        $event = Event::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $event);

        $event->restore();

        return response()->json(['message' => 'Event restored successfully!']);
    }

    public function showArchived($slug, Request $request){
        $event = Event::withTrashed()->where('slug', $slug)->firstOrFail();
        Gate::authorize('view', $event);

        return response()->json([
            'event' => $event,
            'venue' => $event->venue
        ]);
    }

    public function getUserStatus(Event $event){
        $record = auth()->user()->events()->where('event_id', $event->id)->first();

        return response()->json([
            'status' => $record ? $record->pivot->status : null
        ]);
    }

    public function changeStatus(Request $request, Event $event){
        Gate::authorize('changeStatus', $event);
        $request->validate([
            'status' => 'nullable|in:interested,going'
        ]);

        $user = $request->user();
        $newStatus = $request->status;

        $existing = $user->events()->where('event_id', $event->id)->first();

        if($existing && $existing->pivot->status === $newStatus){
            $user->events()->detach($event->id);
            $message = "Bond severed.";
            $currentStatus = null;
        }else{
            $user->events()->syncWithoutDetaching([
                $event->id => ['status' => $newStatus]
            ]);
            $message = "Ritual status updated to: {$newStatus}";
            $currentStatus = $newStatus;
        }

        return response()->json([
            'message' => $message,
            'status' => $currentStatus
        ]);
    }

    public function featured(){
        $events = Event::with('venue')
        ->withCount([
            'users as interested_count' => fn($q) => $q->where('status', 'interested'),
            'users as going_count' => fn($q) => $q->where('status', 'going')
       ])
        ->where('start_time', '>=', now())->get()
        ->sortByDesc(function($event){
            return $event->interested_count + $event->going_count;
        })->take(5)->values();

        return response()->json($events);
    }

    public function upcoming(){
        $events = Event::with('venue')->where('start_time', '>=', now())->orderBy('start_time', 'asc')->take(3)->get();

        return response()->json($events);
    }
}
