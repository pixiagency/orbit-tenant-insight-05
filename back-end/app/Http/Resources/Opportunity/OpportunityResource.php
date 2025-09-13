<?php

namespace App\Http\Resources\Opportunity;

use App\Http\Resources\ContactResource;
use App\Http\Resources\ItemResource;
use App\Http\Resources\landloardLocation\CityResource;
use App\Http\Resources\StageResource;
use App\Http\Resources\Tenant\Items\ItemPovitResource;
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
        // dd($this);
        return [
            'id' => $this->id,
            // 'company' => $this->contact->company_name,
            // 'contact_id' => $this->contact->id,
            // 'email' => $this->contact->email,
            // 'phone' => $this->contact->business_phone,
            // 'source_id' => $this->sourceContact,
            'status' => $this->status,
            'deal_value' => $this->deal_value,
            'win_probability' => $this->win_probability,
            'expected_close_date' => $this->expected_close_date,
            'assigned_to_id' => $this->assigned_to_id,
            'notes' => $this->notes,
            'description' => $this->description,
            'contact' => $this->whenLoaded('contact', fn() => new ContactResource($this->contact)),
            'stage' => $this->whenLoaded('stage', fn() => new StageResource($this->stage)),
            'items' => $this->whenLoaded('items', fn() => ItemPovitResource::collection($this->items)),
        ];
    }
}
