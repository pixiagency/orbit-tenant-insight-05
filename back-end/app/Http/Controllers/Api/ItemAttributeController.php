<?php
// app/Http/Controllers/AttributeController.php

namespace App\Http\Controllers\Api;

// use App\Http\Requests\CreateAttributeRequest;
// use App\Http\Requests\UpdateAttributeRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\Item\Attribute\CreateAttributeRequest;
use App\Http\Resources\Tenant\Items\Attribute\ItemAttributeResource;
use App\Models\Tenant\ItemAttribute;
use Exception;
use Illuminate\Http\Response;

class ItemAttributeController extends Controller
{
    public function index()
    {
        $attributes = ItemAttribute::with('values')->orderBy('id', 'desc')->get();

        return ApiResponse(message: 'Attributes retrieved successfully', data: ItemAttributeResource::collection($attributes), code: Response::HTTP_OK);
    }

    public function store(CreateAttributeRequest $request)
    {
        $attribute = ItemAttribute::create($request->validated());
        return ApiResponse(message: 'Attribute created successfully', data: new ItemAttributeResource($attribute), code: Response::HTTP_CREATED);
    }

    public function show(ItemAttribute $attribute)
    {
        $attribute->load('values');
        return ApiResponse(message: 'Attribute retrieved successfully', data: new ItemAttributeResource($attribute), code: Response::HTTP_OK);
    }

    public function update(CreateAttributeRequest $request, ItemAttribute $attribute)
    {
        $attribute->update($request->validated());
        return ApiResponse(message: 'Attribute updated successfully', data: new ItemAttributeResource($attribute), code: Response::HTTP_OK);
    }

    public function destroy(ItemAttribute $attribute)
    {
        $attribute->delete();
        return ApiResponse(message: 'Attribute deleted successfully', code: Response::HTTP_OK);
    }
}
