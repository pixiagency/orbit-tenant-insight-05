<?php

namespace App\Http\Resources;

use App\Http\Resources\landloardLocation\CityResource;
use App\Http\Resources\landloardLocation\CountryResource;
use App\Http\Resources\Tenant\ItemCategory\ItemCategoryDDLResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'price' => number_format($this->price, 2),
            'stock' => $this->stock,
            'attributes' => $this->attributeValues->mapWithKeys(function ($attributeValue) {
                return [$attributeValue->attribute->name => [
                    'name' => $attributeValue->attribute->name,
                    'value' => $attributeValue->value,
                ]];
            }),
            'attributes_display' => $this->attributeValues
                ->map(fn($av) => $av->attribute->name . ': ' . $av->value)
                ->join(', '),
            'product' => $this->when($this->relationLoaded('item'), [
                'id' => $this->item->id,
                'name' => $this->item->name,
                'base_sku' => $this->item->base_sku
            ]),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s')
        ];
    }
}
