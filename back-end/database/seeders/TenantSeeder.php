<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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


        if (config('app.env') == 'local') {

            $databaseName = 'acme_production_db';

            // check if database already exists
            $exists = DB::select("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", [$databaseName]);
            $acmeTenant = Tenant::create([
                'id' => 'acme',
                'name' => 'acme',
                'tenancy_db_name' => $databaseName,
                'tenancy_create_database' => ! $exists, // only create if not exists
            ]);

            $acmeTenant->createDomain([
                'domain' => 'acme',
            ]);

            // $tenant = Tenant::create(
            //     [
            //         'name' => 'pixicrm'
            //     ]
            // );

            // $tenant->createDomain([
            //     'domain' => 'pixicrm',
            // ]);
        }
    }
}
