<?php

namespace Database\Seeders;


use Database\Seeders\tenant\ContactSeeder;
use Database\Seeders\tenant\ItemCategorySeeder;
use Database\Seeders\tenant\ItemSeeder;
use Database\Seeders\tenant\OpportunitySeeder;
use Database\Seeders\tenant\PipelineSeeder;
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
            CountriesWithCitiesSeeder::class,
            UserSeeder::class,
            SourceSeeder::class,
            PipelineSeeder::class,
            ContactSeeder::class,
            OpportunitySeeder::class,
            ItemCategorySeeder::class,
            ItemSeeder::class,
            // PaymentMethodSeeder::class,
            // ItemStatusSeeder::class,
            // ItemCategorySeeder::class,
            // AppSettingsSeeder::class,
        ]);
    }
}
