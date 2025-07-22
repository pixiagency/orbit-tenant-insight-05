<?php

namespace Database\Seeders;

use App\Models\User;
use Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'superadmin',
            'last_name' => 'demo',
            'email' => 'superadmin@demo.com',
            'password' => Hash::make('123456'),
        ]);
    }
}
