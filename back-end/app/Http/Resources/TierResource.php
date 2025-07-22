<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TierResource extends JsonResource
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
            'package_name' => $this->package_name,
            'description' => $this->description,
            'availability' => $this->availability,
            'price' => $this->price,
            'duration' => $this->duration,
            'duration_unit' => $this->duration_unit,
            'max_users' => $this->max_users,
            'storage_limit' => $this->storage_limit,
            'modules' => $this->modules->map(fn($module) => [
                'value' => $module->value,
                'label' => $module->label(),
            ]),
            'status' => $this->status,
        ];
    }
}
