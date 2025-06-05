<?php

namespace Database\Seeders;

use App\Models\ProjectUser;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         ProjectUser::factory()->count(10)->create();
    }
}
