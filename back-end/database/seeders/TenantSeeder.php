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
        // Tenant::create([
        //     'name' => 'pixicrm', // unique ID
        //     'domains' => ['pixicrm'], // subdomain,
        // ]);

        $tenant = Tenant::create(
            [
                'name' => 'pixicrm'
            ]
        );

        $tenant->createDomain([
            'domain' => 'pixicrm',
        ]);
    }
}
