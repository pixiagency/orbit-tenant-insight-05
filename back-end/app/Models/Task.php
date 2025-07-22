<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'status', 'due_date'];

    public function leads()
    {
        return $this->belongsToMany(Lead::class)->withPivot('weight');
    }
}
