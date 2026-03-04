<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function index($eventId)
    {
        $comments = Comment::where('event_id', $eventId)->with('user:id,name')->latest()->get();
        return response()->json($comments);
    }
    public function store(Request $request, $eventId)
    {
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
