<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Deal\StoreDealRequest;
use App\Models\Tenant\Deal;
use App\Models\Tenant\ItemCategory;
use DB;
use Exception;
use Illuminate\Http\Request;

class ItemCategoryController extends Controller
{

    public function index(Request $request)
    {
        $query = ItemCategory::query();

        $itemCategories = $query->paginate($request->per_page ?? 10);
        return ApiResponse(message: 'Item categories retrieved successfully', code: 200, data: $itemCategories);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->validate(
                [
                    'name' => 'required|string|max:255|unique:item_categories,name',
                ]
            );
            ItemCategory::create($data);
            DB::commit();
            return ApiResponse(message: 'Item category created successfully', code: 201);
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
