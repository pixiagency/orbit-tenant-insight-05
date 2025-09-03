<?php

namespace Database\Seeders\tenant;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        $types = [
            ['title' => 'Call', 'icon' => 'phone', 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Meeting', 'icon' => null, 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Email', 'icon' => 'mail', 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Follow-up', 'icon' => null, 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Presentation', 'icon' => null, 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Demo', 'icon' => null, 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Other', 'icon' => null, 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('task_types')->upsert(
            $types,
            ['title'],                 // unique-by
            ['icon', 'updated_at']     // columns to update on conflict
        );
    }
}