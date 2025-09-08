<?php

namespace Database\Seeders\tenant;

use App\Enums\OpportunityStatus;
use App\Models\Tenant\Lead;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OpportunitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Lead::updateOrCreate(
            ['contact_id' => 1],
            [
                'status' => OpportunityStatus::ACTIVE,
                'stage_id' => 1,
                'deal_value' => 1000,
                'win_probability' => 10,
                'expected_close_date' => Carbon::now()->addDays(10),
                'assigned_to_id' => 1,
                'notes' => 'Notes',
                'description' => 'Description',
            ]
        );
    }
}
