<?php

namespace Database\Seeders\tenant;

use App\Models\Tenant\Pipeline;
use Illuminate\Database\Seeder;

class PipelineSeeder extends Seeder
{
    public function run()
    {
        $pipeline = Pipeline::create([
            'name' => 'Default',
        ]);

        $pipeline->stages()->create([
            'name' => 'Stage 1',
            'seq_number' => 1,
        ]);
        $pipeline->stages()->create([
            'name' => 'Stage 2',
            'seq_number' => 2,
        ]);
        $pipeline->stages()->create([
            'name' => 'Stage 3',
            'seq_number' => 3,
        ]);
        $pipeline->stages()->create([
            'name' => 'Stage 4',
            'seq_number' => 4,
        ]);
    }
}
