<?php

namespace App\Http\Controllers\Api;

use App\DTO\Item\ItemDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Item\ItemStoreRequest;
use App\Http\Resources\ItemResource;
use App\Services\Tenant\ItemService;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ItemController extends Controller
{
    public function __construct(public ItemService $itemService) {}

    public function index(Request $request)
    {
        $filters = array_filter(request()->query(), function ($value) {
            return $value !== null && $value !== '';
        });

        if ($request->has('ddl')) {
            $items = $this->itemService->index($filters);
            $data = ItemResource::collection($items);
        } else {
            $items = $this->itemService->index($filters, perPage: $filters['per_page'] ?? 10);
            $data = ItemResource::collection($items)->response()->getData(true);
        }

        return ApiResponse(message: 'Items retrieved successfully', code: 200, data: $data);
    }

    public function store(ItemStoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $itemDTO = ItemDTO::fromRequest($request);
            $response = $this->itemService->store($itemDTO);
            DB::commit();
            return ApiResponse(message: 'Item created successfully', code: Response::HTTP_CREATED, data: new ItemResource($response));
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
////////
    public function getAttributes()
    {
        $attributes = $this->itemService->getAttributes();
        return ApiResponse(message: 'Attributes retrieved successfully', code: 200, data: $attributes);
    }

    public function getAttribute(string $attribute)
    {
        $attribute = $this->itemService->getAttribute($attribute);
        return ApiResponse(message: 'Attribute retrieved successfully', code: 200, data: $attribute);
    }

    public function storeAttributes(Request $request)
    {
        $attributes = $this->itemService->storeAttributes($request);
        return ApiResponse(message: 'Attributes stored successfully', code: 200, data: $attributes);
    }
/////////
    public function destroy(int $id)
    {
        try {
            DB::beginTransaction();
            $this->itemService->destroy($id);
            DB::commit();
            return ApiResponse(message: 'Item deleted successfully', code: Response::HTTP_OK);
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
