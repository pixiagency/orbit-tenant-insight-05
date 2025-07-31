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
        if (User::count() == 0) {
            User::create([
                'first_name' => 'abood',
                'last_name' => 'elnakoury',
                'email' => 'abood@gmail.com',
                'password' => Hash::make('123456'),
            ]);
            $this->command->info('UserSeeder: Created default user.');
        }

        User::factory(10)->create();
    }
}
