<?php

namespace App\Models;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    use Filterable;
    protected $fillable=
    [
        'name',
        'phone',
        'email',
        'address',
        'city_id',
        'source_id',
    ];

    public function city()
    {
        return $this->belongsTo(Location::class, 'city_id');
    }

    // Contact belongs to a resource
    public function source(): BelongsTo
    {
        return $this->belongsTo(Source::class, 'source_id');
    }

    // Contact has many leads
    public function leads()
    {
        return $this->hasMany(Lead::class,'contact_id');
    }
}
