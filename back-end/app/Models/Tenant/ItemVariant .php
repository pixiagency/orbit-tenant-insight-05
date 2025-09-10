<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class ItemVariant extends Model
{
    protected $fillable = ['item_id', 'sku', 'price', 'stock'];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function attributeValues()
    {
        return $this->belongsToMany(ItemAttributeValue::class, 'item_variants_attribute_values')
            ->withPivot('attribute_id');
    }

    public function getAttributesArray()
    {
        return $this->attributeValues()
            ->with('attribute')
            ->get()
            ->mapWithKeys(function ($attributeValue) {
                return [$attributeValue->attribute->slug => $attributeValue->value];
            });
    }
}
