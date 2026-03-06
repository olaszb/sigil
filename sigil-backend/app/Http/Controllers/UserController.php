<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(User $user){
        return response()->json($user);
    }

    public function update(Request $request, User $user){
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        if($request->hasFile('image')) {
            $data['image_url'] = $request->file('image_url')->store('profile_images', 'public');
        }

        $user->update($data);

        return response()->json($user);
    }

    public function getUserEvents(Request $request, ?User $user = null){
        $status = $request->query('status');

        $targetUser = $user ?? $request->user();
        
        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $events = $targetUser->events()
        ->wherePivot('status', $status)
        ->with('venue')
        ->get();

        return response()->json($events);
    }

    public function getUserComments(Request $request, ?User $user = null)
{
    $targetUser = $user ?? $request->user();

    if (!$targetUser) {
        return response()->json(['message' => 'No whispers found for this entity.'], 404);
    }

    $comments = $targetUser->comments()
        ->with('event:id,title,slug') 
        ->latest()
        ->get();
        
    return response()->json($comments);
}
}
