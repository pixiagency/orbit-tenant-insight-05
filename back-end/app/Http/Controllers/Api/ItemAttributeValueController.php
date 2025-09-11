<?php
// app/Http/Controllers/AttributeValueController.php

namespace App\Http\Controllers\Api;

use App\Models\Tenant\ItemAttribute;
use App\Models\Tenant\ItemAttributeValue;
use App\Http\Requests\Item\Attribute\CreateAttributeValueRequest;
use App\Http\Resources\Tenant\Items\Attribute\ItemAttributeValueResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class ItemAttributeValueController extends Controller
{
    public function store(CreateAttributeValueRequest $request, ItemAttribute $attribute)
    {
        $attributeValue = $attribute->values()->create($request->validated());
        return ApiResponse(message: 'Attribute value created successfully', data: new ItemAttributeValueResource($attributeValue), code: Response::HTTP_CREATED);
    }

    public function update(CreateAttributeValueRequest $request, ItemAttribute $attribute, ItemAttributeValue $value)
    {
        $value->update($request->validated());
        return ApiResponse(message: 'Attribute value updated successfully', data: new ItemAttributeValueResource($value), code: Response::HTTP_OK);
    }

    public function destroy(ItemAttribute $attribute, ItemAttributeValue $value)
    {
        $value->delete();
        return ApiResponse(message: 'Attribute value deleted successfully', code: Response::HTTP_OK);
    }
}
