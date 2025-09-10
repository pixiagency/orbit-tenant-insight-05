<?php

namespace App\Http\Requests\Item;

use App\Enums\ItemType;
use App\Enums\ServiceDuration;
use App\Http\Requests\BaseRequest;
use App\Rules\Tenant\ItemCategoryRule;
use Illuminate\Validation\Rule;

class ItemStoreRequest extends BaseRequest
{
    /**
     * Determine if the industry is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return string[]
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:items,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'sku' => 'nullable|string',
            'quantity' => 'requiredIf:type,product|integer',
            'category_id' => ['required', new ItemCategoryRule($this->type)],
            'duration' => ['requiredIf:type,service', Rule::in(ServiceDuration::values())],
            'type' => ['required', Rule::in(ItemType::values())],

            'variants' => 'requiredIf:type,product|array|min:1',
            'variants.*.attributes' => 'required|array',
            'variants.*.attributes.*' => 'required|string|max:100',
            'variants.*.price' => 'required|numeric|min:0|max:999999.99',
            'variants.*.quantity' => 'required|integer|min:0|max:999999',
        ];
    }

    public function messages()
    {
        return [
            'variants.requiredIf' => 'At least one variant is required.',
            'variants.*.attributes.required' => 'Each variant must have attributes.',
            'variants.*.price.required' => 'Each variant must have a price.',
            'variants.*.quantity.required' => 'Each variant must have a quantity.',
        ];
    }
}
