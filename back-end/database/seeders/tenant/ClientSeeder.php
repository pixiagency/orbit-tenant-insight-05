<?php

namespace Database\Seeders\tenant;

use App\Models\Client;
use App\Models\Source;
use App\Models\Location;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have sources and locations, if not create some basic ones
        if (Source::count() === 0) {
            // Create some basic sources for tenant
            $sources = [
                'Website',
                'Social Media',
                'Referral',
                'Cold Call',
                'Trade Show',
                'Advertisement',
                'Partner',
                'Online Directory',
                'Email Campaign',
                'Direct Mail'
            ];

            foreach ($sources as $sourceName) {
                Source::create(['name' => $sourceName]);
            }
        }

        if (Location::count() === 0) {
            // Create some basic locations for tenant
            $locations = [
                'Downtown',
                'Business District',
                'Industrial Area',
                'Residential Area',
                'Shopping Center',
                'Office Park',
                'Technology Hub',
                'Financial District',
                'Creative Quarter',
                'University Area'
            ];

            foreach ($locations as $locationName) {
                Location::create([
                    'title' => $locationName,
                    'status' => 'active'
                ]);
            }
        }

        // Create 15 clients using the factory for tenant
        Client::factory()->count(15)->create();

        // Create some clients with specific sources and areas for variety
        $sources = Source::all();
        $areas = Location::where('status', 'active')->get();

        if ($sources->count() > 0 && $areas->count() > 0) {
            // Create 3 clients with specific sources
            foreach ($sources->take(3) as $source) {
                Client::factory()
                    ->withSource($source)
                    ->count(1)
                    ->create();
            }

            // Create 3 clients with specific areas
            foreach ($areas->take(3) as $area) {
                Client::factory()
                    ->withArea($area)
                    ->count(1)
                    ->create();
            }
        }
    }
}
