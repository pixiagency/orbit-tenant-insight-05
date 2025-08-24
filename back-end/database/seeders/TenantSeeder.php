<?php

namespace Database\Seeders;

use App\Models\Source;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tenant::create([
            'name' => 'test tenant',
            'plan' => 'free',
        ]);
    }
}
