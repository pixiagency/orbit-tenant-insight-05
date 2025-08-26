<?php

namespace Database\Seeders\tenant;

use App\Models\Tenant\ItemCategory;
use Illuminate\Database\Seeder;

class ItemCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ItemCategory::factory()->count(10)->create();
    }
}
