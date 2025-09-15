<?php

namespace Database\Seeders\tenant;

use App\Enums\RolesEnum;
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
        $roles = [
            ['name' => RolesEnum::ADMIN->value, 'guard_name' => 'api','created_at'=> now(),'updated_at'=> now()],
            ['name' => RolesEnum::MANAGER->value, 'guard_name' => 'api','created_at'=> now(),'updated_at'=> now()],
            ['name' => RolesEnum::AGENT->value, 'guard_name' => 'api','created_at'=> now(),'updated_at'=> now()],
        ];

        Role::insert($roles);
    }
}
