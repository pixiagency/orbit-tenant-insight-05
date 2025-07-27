<?php

namespace App\Http\Resources;

use App\Http\Resources\landloardLocation\CityResource;
use App\Http\Resources\landloardLocation\CountryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'business_phone' => $this->business_phone,
            'mobile_phone' => $this->mobile_phone,
            'job_title' => $this->job_title,
            'department' => $this->department,
            'status' => $this->status,
            'source_id' => $this->source_id,
            'contact_method' => $this->contact_method,
            'email_permission' => $this->email_permission,
            'phone_permission' => $this->phone_permission,
            'whatsapp_permission' => $this->whatsapp_permission,
            'company_name' => $this->company_name,
            'website' => $this->website,
            'industry' => $this->industry,
            'company_size' => $this->company_size,
            'address' => $this->address,
            'country' => $this->whenLoaded('country', fn() => new CountryResource($this->country)),
            'city' => $this->whenLoaded('city', fn() => new CityResource($this->city)),
            'state' => $this->state,
            'zip_code' => $this->zip_code,
            'user' => $this->whenLoaded('user', fn() => new UserResource($this->user)),
            'tags' => json_decode($this->tags, true),
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
