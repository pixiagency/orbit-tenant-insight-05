<?php

namespace App\Models\Tenant;

use App\Enums\ItemType;
use App\Enums\ServiceDuration;
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
        'sku',
        'quantity',
        'category_id',
        'duration',
        'type',
        'attributes',
    ];

    protected $casts = [
        'attributes' => 'array',
        'duration' => ServiceDuration::class,
        'type' => ItemType::class,
        'price' => 'decimal:2'
    ];

    // Generate SKU for variant
    public static function generateVariantSku($sku, $attributes = [])
    {
        if (empty($attributes)) {
            return $sku;
        }

        $suffix = collect($attributes)
            ->map(fn($value, $key) => strtoupper(substr($key, 0, 1)) . strtoupper(substr($value, 0, 2)))
            ->join('-');

        return $sku . '-' . $suffix;
    }

    public function deals()
    {
        return $this->belongsToMany(Deal::class, 'deal_items', 'item_id', 'deal_id');
    }

    public function opportunities()
    {
        return $this->belongsToMany(Lead::class, 'lead_items', 'item_id', 'lead_id');
    }

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('created_at', 'asc');
    }
}
