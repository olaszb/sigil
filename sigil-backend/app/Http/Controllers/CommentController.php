<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function index($eventId)
    {
        $comments = Comment::where('event_id', $eventId)->with('user:id,name,image_url')->latest()->get();
        return response()->json($comments);
    }

    public function store(Request $request, $eventId)
    {
        $event = Event::findOrFail($eventId);
        if($event->trashed()){
            return response()->json(['message' => 'Cannot comment on an archived event'], 403);
        }

        $data = $request->validate([
            'comment' => 'required|string|max:255',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'event_id' => $eventId,
            'comment' => $data['comment'],
        ]);

        return response()->json($comment, 201);
    }

    public function update(Request $request, Comment $comment)
    {
        Gate::authorize('update', $comment);

        $data = $request->validate([
            'comment' => 'required|string|max:255',
        ]);

        $comment->update(['comment' => $data['comment']]);

        return response()->json($comment);
    }

    public function destroy(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        Gate::authorize('delete', $comment);

        // Ensure the user is the owner of the comment or an admin
        if ($request->user()->id !== $comment->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }


}
