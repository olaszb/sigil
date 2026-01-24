<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('Test1234'),
        ]);

        Venue::factory()->create([
            'name' => 'Grand Hall',
            'address' => '123 Main St',
            'city' => 'Metropolis',
            'country' => 'Freedonia',
            'postal_code' => '12345',
            'capacity' => 500,
        ]);

        Event::factory()->create([
            'venue_id' => 1,
            'organizer_id' => 1,
            'title' => 'Spring Festival',
            'description' => 'A celebration of spring with music and food.',
            'start_time' => now()->addMonths(2),
        ]);
    }
}
