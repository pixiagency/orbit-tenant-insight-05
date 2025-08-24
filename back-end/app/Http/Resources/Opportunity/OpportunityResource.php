<?php

namespace App\Http\Resources\Opportunity;

use App\Http\Resources\ContactResource;
use App\Http\Resources\landloardLocation\CityResource;
use App\Http\Resources\StageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OpportunityResource extends JsonResource
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
            'opportunity_name' => $this->opportunity_name,
            'company' => $this->company,
            'contact_id' => $this->contact_id,
            'email' => $this->email,
            'phone' => $this->phone,
            'source_id' => $this->source_id,
            'status' => $this->status,
            'deal_value' => $this->deal_value,
            'win_probability' => $this->win_probability,
            'expected_close_date' => $this->expected_close_date,
            'assigned_to_id' => $this->assigned_to_id,
            'notes' => $this->notes,
            'description' => $this->description,
            'contact' => $this->whenLoaded('contact', fn() => new ContactResource($this->contact)),
            'city' => $this->whenLoaded('city', fn() => new CityResource($this->city)),
            'stage' => $this->whenLoaded('stage', fn() => new StageResource($this->stage)),
        ];
    }
}
