<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateVenueRequest;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class VenueController extends Controller
{
    protected $pagination_limit = 15;
    public function index()
    {
        $venues = Venue::paginate($this->pagination_limit);
        return response()->json($venues);
    }
    public function getAll(){
        $venues = Venue::all();
        return response()->json($venues);
    }

    public function store(CreateVenueRequest $request){
        Gate::authorize('create', Venue::class);
        $data = $request->validated();

        $venue = Venue::create($data);

        return response()->json([
            'venue' => $venue,
            'message' => "Venue created successfully"
        ], 201);
    }

    public function destroy(Venue $venue){
        Gate::authorize('delete', $venue);
        $venue->delete();
        return response()->json(['message' => 'Venue deleted successfully']);
    }
}
