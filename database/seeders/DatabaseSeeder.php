<?php

namespace Database\Seeders;

use App\Models\TaskUser;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run() {
    $this->call([
        RoleSeeder::class,
        UserSeeder::class,
        ClientSeeder::class,
        ProjectSeeder::class,
        TaskSeeder::class,
        ProjectCrewMemberSeeder::class,
        TaskUserSeeder::class,
        ProjectUserSeeder::class,
        EmployeeReportSeeder::class
    ]);
}
}
