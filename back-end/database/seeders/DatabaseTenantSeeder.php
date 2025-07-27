<?php

namespace Database\Seeders;

use Database\Seeders\tenant\ContactSeeder;
use Database\Seeders\tenant\PaymentMethodSeeder;
use Database\Seeders\tenant\PipelineSeeder;
use Database\Seeders\tenant\UserSeeder;
use Database\Seeders\tenant\RolesAndPermissionsSeeder;
use Database\Seeders\tenant\SourceSeeder;
use Illuminate\Database\Seeder;

class DatabaseTenantSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SourceSeeder::class,
            RolesAndPermissionsSeeder::class,
            UserSeeder::class,
            CountriesWithCitiesSeeder::class,
            PaymentMethodSeeder::class,
            PipelineSeeder::class,
            ContactSeeder::class,
        ]);
    }
}
