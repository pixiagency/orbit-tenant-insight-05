<?php

namespace App\Http\Requests\Item;

use App\Enums\DealType;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class ItemUpdateRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sametime|string|unique:items,name',
            'description' => 'nullable|string',
            'price' => 'sametime|numeric',
            'quantity' => 'sametime|integer',
            'category_id' => 'sametime|exists:item_categories,id',
            'unit' => 'sametime|string',
            'image' => 'nullable|string',
            'status' => 'sametime|exists:item_statuses,id',
            'type' => ['sametime', Rule::in(DealType::values())],
        ];
    }
}
