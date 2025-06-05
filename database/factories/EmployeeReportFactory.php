<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\EmployeeReport;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployeeReport>
 */
class EmployeeReportFactory extends Factory
{
    protected $model = EmployeeReport::class;

    public function definition(): array
    {
        $employee = User::where('role_id', 4)->inRandomOrder()->first();
        $submitter = User::where('role_id', 2)->inRandomOrder()->first();

        return [
            'user_id' => $employee?->id,
            'submitted_by' => $submitter?->id,
            'report_date' => $this->faker->date(),
            'subject' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['submitted', 'reviewed', 'rejected']),
        ];
    }
}
