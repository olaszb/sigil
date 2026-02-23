<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\EventController;
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
    Route::get('/archived-events', [VenueController::class, 'archived'])->name('archived.index');
});