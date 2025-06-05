<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskUser>
 */
class TaskUserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(){
        $task = Task::with('project.crewMembers')
        ->get()
        ->filter(fn($t) => $t->project && $t->project->crewMembers->isNotEmpty())
        ->random();

    $user = $task->project->crewMembers->random();

    return [
        'task_id' => $task->id,
        'user_id' => $user->id,
    ];
    }
}
