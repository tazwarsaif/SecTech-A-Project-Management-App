<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\User;
use App\Models\ProjectCrewMember;

class ProjectCrewMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = Project::all();
        $employees = User::where('role_id', 4)->get();

        foreach ($projects as $project) {
            $crewMembers = $employees->random(rand(2, 5));

            foreach ($crewMembers as $member) {
                ProjectCrewMember::firstOrCreate([
                    'project_id' => $project->id,
                    'user_id' => $member->id,
                ]);
            }
        }
    }
}
