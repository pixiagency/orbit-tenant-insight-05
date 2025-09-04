<?php

namespace Database\Seeders;

use Database\Seeders\tenant\RolesAndPermissionsSeeder;
use Illuminate\Database\Seeder;

class DatabaseTenantSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            // CountriesWithCitiesSeeder::class,
             UserSeeder::class,
            // SourceSeeder::class,
            // PaymentMethodSeeder::class,
            // PipelineSeeder::class,
            // ContactSeeder::class,
            // ItemStatusSeeder::class,
            // ItemCategorySeeder::class,
            // AppSettingsSeeder::class,
        ]);
    }
}
