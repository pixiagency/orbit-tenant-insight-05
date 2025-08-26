<?php

namespace App\Http\Requests\Item;

use App\Enums\DealType;
use App\Http\Requests\BaseRequest;
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
            'quantity' => 'required|integer',
            'category_id' => 'required|exists:item_categories,id',
            'unit' => 'required|string',
            'image' => 'nullable|string',
            'status_id' => 'required|exists:item_statuses,id',
            'type' => ['required', Rule::in(DealType::values())],
        ];
    }
}
