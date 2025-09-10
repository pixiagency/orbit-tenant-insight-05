<?php

namespace Database\Seeders\tenant;

use App\Enums\ItemType;
use App\Models\Tenant\ItemCategory;
use Illuminate\Database\Seeder;

class ItemCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ItemCategory::updateOrCreate([
            'name' => 'Electronics',
            'type' => ItemType::PRODUCT->value,
            'parent_id' => null,
        ]);
        ItemCategory::updateOrCreate([
            'name' => 'Electronics2',
            'type' => ItemType::PRODUCT->value,
            'parent_id' => null,
        ]);
        ItemCategory::updateOrCreate([
            'name' => 'Software',
            'type' => ItemType::SERVICE->value,
            'parent_id' => null,
        ]);
        ItemCategory::updateOrCreate([
            'name' => 'Software2',
            'type' => ItemType::SERVICE->value,
            'parent_id' => null,
        ]);
        ItemCategory::factory()->count(10)->create();
    }
}
