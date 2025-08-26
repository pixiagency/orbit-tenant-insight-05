<?php

namespace Database\Factories\Tenant;

use App\Models\Tenant\ItemCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant\ItemStatus>
 */
class ItemCategoryFactory extends Factory
{
    protected $model = ItemCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'description' => fake()->sentence(),
            'color' => fake()->colorName(),
        ];
    }
}
