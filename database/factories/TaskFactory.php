<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array

    {
        $project = Project::inRandomOrder()->first();

        return [
            'project_id' => $project->id,
        'title' => $this->faker->sentence,
        'description' => $this->faker->paragraph,
        'progress' => $this->faker->randomElement([0, 25, 50, 75, 100]),
        'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
        'status' => $this->faker->randomElement(['completed', 'in_progress', 'pending']),
        'deadline' => $this->faker->dateTimeBetween('-2 week', '+1 month'),
        'created_by' => $project->manager_id, // Assuming the task is created by the project manager
        ];
    }
}
// 'progress' => $this->faker->randomElement([0, 25, 50, 75, 100]),
//         'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
