<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use App\Models\Venue;
use App\Models\TicketType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $organizer = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('Test1234'),
            'role' => 'organizer',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('Test1234'),
            'role' => 'admin',
        ]);

        $venues = Venue::all();
        if ($venues->isEmpty()) {
            $venues = collect([
                Venue::create([
                    'name' => 'Analog Music Hall',
                    'address' => 'Kondorfa u. 8',
                    'city' => 'Budapest',
                    'country' => 'Hungary',
                    'postal_code' => '1116',
                    'capacity' => 550,
                    'layout' => [
                        'sections' => [
                            [
                                'name' => 'Main Floor',
                                'type' => 'standing',
                                'capacity' => 550
                            ]
                        ]
                    ]
                ]),
                Venue::create([
                    'name' => 'A38 Ship',
                    'address' => 'Petőfi híd, budai hídfő',
                    'city' => 'Budapest',
                    'country' => 'Hungary',
                    'postal_code' => '1117',
                    'capacity' => 646,
                    'layout' => [
                        'sections' => [
                            [
                                'name' => 'Main Deck',
                                'type' => 'standing',
                                'capacity' => 550
                            ],
                            [
                                'name' => 'Bow Balcony',
                                'type' => 'seated',
                                'rows' => 5,
                                'columns' => 20,
                                'void_seats' => ['0-0', '0-19', '1-0', '1-19']
                            ]
                        ]
                    ]
                ]),
                Venue::create([
                    'name' => 'Barba Negra',
                    'address' => 'Szállító u. 3',
                    'city' => 'Budapest',
                    'country' => 'Hungary',
                    'postal_code' => '1211',
                    'capacity' => 1000,
                    'layout' => [
                        'sections' => [
                            ['name' => 'Front Pit', 'type' => 'standing', 'capacity' => 400],
                            ['name' => 'General Admission', 'type' => 'standing', 'capacity' => 500],
                            ['name' => 'VIP Tribune', 'type' => 'seated', 'rows' => 4, 'columns' => 25, 'void_seats' => []] 
                        ]
                    ]
                ]),
            ]);
        }

        Storage::disk('public')->makeDirectory('event_images');

        $imagePool = [
            'event_images/nokubura.jpeg',
            'event_images/currents.jpeg',
            'event_images/abstracts.jpeg',
            'event_images/soi.jpg',
            'event_images/slothreat.jpeg',
        ];

        for ($i = 0; $i < 10; $i++) {
            $venue = $venues->random();

            $event = Event::factory()->create([
                'organizer_id' => $organizer->id,
                'venue_id' => $venue->id,
                'image_url' => $imagePool[$i % count($imagePool)],
            ]);

            foreach ($venue->layout['sections'] as $section){
                $quantity = 0;
                $ticketName = 'General Admission';
                $price = rand(60, 100) * 100;

                if($section['type'] === 'standing'){
                    $quantity = $section['capacity'];
                } else {
                    $ticketName = 'Reserved Seat';
                    $price += 3000;
                    $totalSeats = $section['rows'] * $section['columns'];
                    $voidCount = count($section['void_seats'] ?? []);
                    $quantity = $totalSeats - $voidCount;
                }

                TicketType::create([
                    'event_id' => $event->id,
                    'name' => $ticketName,
                    'section_name' => $section['name'],
                    'price' => $price,
                    'quantity_available' => $quantity,
                ]);
            }
        }
    }
}
