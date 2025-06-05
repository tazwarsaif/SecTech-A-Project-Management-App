<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\TaskUser;

class TaskUserSeeder extends Seeder
{
    public function run(): void
    {
        // Load all projects with their tasks and crew members
        $projects = Project::with(['tasks', 'crewMembers'])->get();

    foreach ($projects as $project) {
        // Skip projects with no crew members
        if ($project->crewMembers->isEmpty()) {
            continue;
        }

        foreach ($project->tasks as $task) {
            // Randomly select 1–3 crew members
            $crewMembers = $project->crewMembers->random(
                min(1, $project->crewMembers->count())
            );

            foreach ($crewMembers as $user) {
                TaskUser::firstOrCreate([
                    'task_id' => $task->id,
                    'user_id' => $user->id,
                ]);
            }
        }
    }
    }
}
