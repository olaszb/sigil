<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VenueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/register', [RegisterController::class, 'register'])->name('register');

//get events
Route::get('/events', [EventController::class, 'index'])->name('events.index');

//get single event
Route::get('/events/{slug}', [EventController::class, 'show'])->name('event.show');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
    return $request->user();
    });
    //logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    
    //create event
    Route::post('/events', [EventController::class, 'store'])->name('event.store');
    
    //update event
    Route::put('/events/{event}', [EventController::class, 'update'])->name('event.update');
    
    //get venues
    Route::get('/venues', [VenueController::class, 'index'])->name('venues.index');
    
    //delete event
    Route::delete('/events/{event}' , [EventController::class, 'destroy'])->name('event.destroy');

    //create venue
    Route::post('/venues', [VenueController::class, 'store'])->name('venue.store');
    
    //delete venue
    Route::delete('/venues/{venue}', [VenueController::class, 'destroy'])->name('venue.destroy');

    //get archived events
    Route::get('/archived-events', [EventController::class, 'archived'])->name('archived.index');

    //get past events
    Route::get('/past-events', [EventController::class, 'pastEvents'])->name('past.index');

    //force delete event
    Route::delete('/events/{id}/force', [EventController::class, 'forceDelete'])->name('event.force');

    //restore event
    Route::post('/events/{id}/restore', [EventController::class, 'restore'])->name('event.restore');

    //get archived event
    Route::get('/archived-events/{slug}', [EventController::class, 'showArchived'])->name('archived.show');

    //get event status
    Route::get('/events/{event}/status', [EventController::class, 'getUserStatus'])->name('user.event.getStatus');

    //change event status
    Route::post('/events/{event}/status', [EventController::class, 'changeStatus'])->name('user.event.changeStatus');

    //get user events
    Route::get('/user/events', [UserController::class, 'getUserEvents'])->name('user.events');

    //get event comments
    Route::get('/events/{eventId}/comments', [CommentController::class, 'index'])->name('event.comments');

    //post event comment
    Route::post('/events/{eventId}/comments', [CommentController::class, 'store'])->name('event.comment.store');

    //delete event comment
    Route::delete('/comments/{commentId}', [CommentController::class, 'destroy'])->name('event.comment.destroy');

    //get user comments 
    Route::get('/users/{userId}/comments', [CommentController::class, 'getUserComments'])->name('user.comments');
});