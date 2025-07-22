<?php

namespace Database\Seeders\tenant;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $defaultPassword = Hash::make('123456');

        // Create or get leader user
        $leader = User::firstOrCreate(
            ['email' => 'leader@gmail.com'],
            [
                'first_name' => 'leader',
                'last_name' => 'leader',
                'email_verified_at' => now(),
                'type' => UserType::LEADER->value,
                'password' => $defaultPassword,
                'remember_token' => Str::random(10),
            ]
        );
        $leader->assignRole('leader');

        // Create or get sales user
        $sales = User::firstOrCreate(
            ['email' => 'sales@gmail.com'],
            [
                'first_name' => 'sales',
                'last_name' => 'sales',
                'email_verified_at' => now(),
                'type' => UserType::SALES->value,
                'password' => $defaultPassword,
                'remember_token' => Str::random(10),
            ]
        );
        $sales->assignRole('sales');

        // Create or get admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'first_name' => 'admin',
                'last_name' => 'admin',
                'email_verified_at' => now(),
                'type' => UserType::ADMIN->value,
                'password' => $defaultPassword,
                'remember_token' => Str::random(10),
            ]
        );
        $admin->assignRole('admin');

        // Seed additional users (if needed)
        User::factory()->count(10)->create();
    }
}