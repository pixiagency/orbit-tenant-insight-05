<?php

namespace App\Models\Tenant;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;

class ItemCategory extends Model
{
    use Filterable;
    protected $fillable =
    [
        'name',
    ];

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
