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
        'type',
        'status_id',
    ];

    public function deals()
    {
        return $this->belongsToMany(Deal::class, 'deal_items', 'item_id', 'deal_id');
    }
}
