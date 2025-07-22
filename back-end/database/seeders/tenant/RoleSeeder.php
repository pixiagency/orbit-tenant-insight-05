<?php

namespace Database\Seeders\tenant;

use App\Enums\UserType;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' => UserType::ADMIN->value]);
        Role::create(['name' => UserType::LEADER->value]);
        Role::create(['name' => UserType::SALES->value]);
    }
}
