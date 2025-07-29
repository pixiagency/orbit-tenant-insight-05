<?php

namespace Database\Seeders\tenant;

use App\Models\User;
use Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'first_name' => 'abood',
            'last_name' => 'Admin',
            'email' => 'abood@gamil.com',
            'password' => Hash::make(123456),
            'phone' => '01010101010',
        ]);
        $user->assignRole('admin');

        User::factory()->count(10)->create();
    }
}
