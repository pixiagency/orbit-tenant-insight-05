<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\ItemStoreRequest;
use App\Http\Resources\ItemResource;
use App\Models\Tenant\Item;
use App\Services\Tenant\ItemService;
use DB;
use Exception;
use Illuminate\Http\Request;

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
            $data = $request->validated();

            Item::create($data);
            DB::commit();
            return ApiResponse(message: 'Item created successfully', code: 201);
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
