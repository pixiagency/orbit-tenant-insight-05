<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class ItemAttribute extends Model
{
    public $fillable = [
        'name',
        'value'
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('name', 'asc');
    }
}
