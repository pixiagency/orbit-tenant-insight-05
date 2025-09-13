<?php

namespace App\Http\Requests\Item;

use App\Enums\ItemType;
use App\Enums\ServiceDuration;
use App\Enums\ServiceType;
use App\Http\Requests\BaseRequest;
use App\Rules\Tenant\ItemCategoryRule;
use Illuminate\Validation\Rule;

class ItemStoreRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:items,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'sku' => 'nullable|string|unique:items,sku',
            'quantity' => 'requiredIf:type,product|integer',
            'category_id' => ['required', new ItemCategoryRule($this->type)],
            'duration' => ['requiredIf:type,service', Rule::in(ServiceDuration::values())],
            'type' => ['required', Rule::in(ItemType::values())],
            'service_type' => ['nullable', Rule::in(ServiceType::values())],
        ];
    }
}
