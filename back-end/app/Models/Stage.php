<?php

namespace App\Models;

use App\Models\Tenant\Pipeline;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    use Filterable;
    protected $fillable = ['name', 'seq_number', 'pipeline_id'];

    public function pipeline()
    {
        return $this->belongsTo(Pipeline::class);
    }
    public function leads()
    {
        return $this->belongsToMany(Lead::class, 'lead_stage')
            ->withPivot('start_date', 'exit_date', 'pipeline_id')
            ->withTimestamps();
    }
}
