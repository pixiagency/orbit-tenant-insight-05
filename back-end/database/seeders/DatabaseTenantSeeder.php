<?php

namespace Database\Seeders;

use Database\Seeders\Tenant\AppSettingsSeeder;
use Database\Seeders\tenant\ContactSeeder;
use Database\Seeders\tenant\ItemCategorySeeder;
use Database\Seeders\tenant\ItemStatusSeeder;
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
            // RolesAndPermissionsSeeder::class,
            // CountriesWithCitiesSeeder::class,
            // UserSeeder::class,
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
