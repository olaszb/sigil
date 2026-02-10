<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\VenueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/register', [RegisterController::class, 'register'])->name('register');
Route::get('/events', [EventController::class, 'index'])->name('events.index');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
    return $request->user();
    });
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/venues', [VenueController::class, 'getVenues'])->name('venues.index');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});