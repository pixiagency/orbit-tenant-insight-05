<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\ItemStoreRequest;
use App\Http\Resources\ItemResource;
use App\Models\Tenant\Item;
use DB;
use Exception;
use Illuminate\Http\Request;

class ItemController extends Controller
{

    public function index(Request $request)
    {
        $query = Item::query();

        // Search by deal name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status_id')) {
            $query->where('status_id', $request->status_id);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }


        $items = $query->paginate($request->per_page ?? 10);
        return ApiResponse(message: 'Items retrieved successfully', code: 200, data: ItemResource::collection($items));
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
