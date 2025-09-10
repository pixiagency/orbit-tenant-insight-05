<?php

namespace App\Http\Requests\Item\Attribute;

use App\Http\Requests\BaseRequest;

class AttributeStoreRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:item_attributes,name',
            'value' => 'required|array',
            'value.*' => 'required|string|max:100',
        ];
    }
}
