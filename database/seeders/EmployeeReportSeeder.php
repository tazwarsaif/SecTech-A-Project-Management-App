<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EmployeeReport;

class EmployeeReportSeeder extends Seeder
{
    public function run(): void
    {
        EmployeeReport::factory()->count(30)->create();
    }
}

