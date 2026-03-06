<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show(User $user){
        return response()->json($user);
    }

    public function update(Request $request, User $user){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
            'image_url' => 'nullable|image|max:2048|mimes:jpeg,png,jpg,gif,svg',
        ]); 

        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);


        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }

        if($request->file('image_url')) {
            if ($user->image_url) {
                Storage::disk('public')->delete($user->image_url);
            }
            $user->image_url = $request->file('image_url')->store('profile_images', 'public');
        }

        $user->save();

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
