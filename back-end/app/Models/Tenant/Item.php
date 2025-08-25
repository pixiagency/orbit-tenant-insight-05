<?php

namespace App\Models\Tenant;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use Filterable;
    protected $fillable =
    [
        'name',
        'description',
        'price',
        'quantity',
        'category_id',
        'unit',
        'image',
        'status',
    ];
}
