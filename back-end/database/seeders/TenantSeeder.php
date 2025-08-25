<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenant1 = Tenant::create([
            'name' => 'tenant1', // unique ID
            'domains' => ['tenant1'], // subdomain,
        ]);
    }
}
