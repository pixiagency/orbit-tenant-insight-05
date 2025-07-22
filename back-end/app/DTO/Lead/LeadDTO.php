<?php

namespace App\DTO\Lead;

use App\DTO\BaseDTO;
use Illuminate\Support\Arr;

class LeadDTO extends BaseDTO
{
    public function __construct(
        public ?int $contact_id,
        public ?int $reason_id,
        public ?int $stage_id,
        public ?int $user_id,
        public ?float $value,
        public ?string $status,
        public ?array $industries = null,
        public ?array $services = null,
        public ?array $serviceCategories = null,
        public ?array $customFields = null,
    ) {}

    public static function fromRequest($request): BaseDTO
    {
        $services = $request->input('services', []);

        // This collects the service_id => category_id pairs out of the nested array
        $serviceCategories = [];
        foreach ($services as $serviceId => $nestedData) {
            $serviceCategories[$serviceId] = $nestedData['category_id'] ?? null;
        }
        return new self(
            contact_id: $request->contact_id,
            reason_id: $request->reason_id,
            user_id: $request->user_id,
            stage_id: $request->stage_id,
            value: $request->value,
            status: $request->status,
            industries: $request->input('industry'),
            services: array_keys($services),  // Extract only the IDs
            serviceCategories: $serviceCategories,
            customFields: $request->input('custom_fields'),

        );
    }

    public function toArray(): array
    {
        return [
            'contact_id' => $this->contact_id,
            'reason_id' => $this->reason_id,
            'user_id' => $this->user_id,
            'stage_id' => $this->stage_id,
            'value' => $this->value,
            'status' => $this->status,
            'industries' => $this->industries,
            'services' => $this->services,
            'serviceCategories'=> $this->serviceCategories,
            'customFields' => $this->customFields,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            contact_id: Arr::get($data, 'contact_id'),
            reason_id: Arr::get($data, 'reason_id'),
            stage_id: Arr::get($data, 'stage_id'),
            user_id: Arr::get($data, 'user_id'),
            value: Arr::get($data, 'addrvalueess'),
            status: Arr::get($data, 'status'),
            industries: Arr::get($data, 'industries'),
            services: Arr::get($data, 'services'),
            customFields: Arr::get($data, 'customFields'),
        );
    }
}
