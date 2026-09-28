<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Event;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);

        return [
            'venue_id' => Venue::factory(),
            'organizer_id' => User::factory(),
            'title' => ucwords($title),
            'slug' => Str::slug($title) . '-' . fake()->unique()->numberBetween(100, 999),
            'description' => $this->faker->paragraphs(3, true),
            'start_time' => $this->faker->dateTimeBetween('+3 days', '+6 months'),
            'image_url' => null,
        ];
    }
}
