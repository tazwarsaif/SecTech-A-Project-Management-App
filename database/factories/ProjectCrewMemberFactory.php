<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ProjectCrewMember;
use App\Models\Project;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectCrewMember>
 */
class ProjectCrewMemberFactory extends Factory
{

    public function definition()
    {
        $project = Project::inRandomOrder()->first();
        $employee = User::where('role_id', 4)->inRandomOrder()->first();

        return [
            'project_id' => $project?->id,
            'user_id' => $employee?->id,
        ];
    }
}
