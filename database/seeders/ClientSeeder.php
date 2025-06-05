<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::whereHas('role', fn($q) => $q->where('name', 'Client'))
    ->each(fn($user) => Client::factory()->create(['user_id' => $user->id]));
    }
}
