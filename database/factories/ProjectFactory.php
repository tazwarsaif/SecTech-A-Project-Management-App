<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'name' => $this->faker->catchPhrase,
        'description' => $this->faker->paragraph,
        'client_id' => Client::inRandomOrder()->first()->id,
        'manager_id' => User::whereHas('role', fn($q) => $q->where('name', 'ProjectManager'))->inRandomOrder()->first()->id,
        'start_date' => $this->faker->date,
        'end_date' => $this->faker->date('+1 year'),
        'status' => $this->faker->randomElement(['active', 'completed', 'on_hold', 'cancelled']),
    ];
    }
}
