<?php

namespace Database\Seeders\tenant;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions if they don't exist
        $permissions = [
            'admin',
            'sales',
            'leader',
        ];

        foreach ($permissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName]);
        }

        // update cache to know about the newly created permissions (required if using WithoutModelEvents in seeders)
        app()[PermissionRegistrar::class]->forgetCachedPermissions();


        // Create roles if they don't exist
        $roles = [
            'super-admin',
            'admin',
            'sales',
            'leader',
        ];

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            // Assign all existing permissions to this role
            $role->syncPermissions(Permission::all());
        }
    }
}
