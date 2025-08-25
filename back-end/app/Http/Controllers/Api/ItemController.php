<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Deal\StoreDealRequest;
use App\Models\Tenant\Deal;
use App\Models\Tenant\Item;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{

    public function index(Request $request)
    {
        $query = Deal::query();

        // Search by deal name
        if ($request->filled('search')) {
            $query->where('deal_name', 'like', '%' . $request->search . '%');
        }
        // Filter by stage
        if ($request->filled('stage_id')) {
            $query->where('stage_id', $request->stage_id);
        }

        // Filter by deal type
        if ($request->filled('assigned_to_id')) {
            $query->where('assigned_to_id', $request->assigned_to_id);
        }

        // Filter by deal type
        if ($request->filled('assigned_to_id')) {
            $query->where('assigned_to_id', $request->assigned_to_id);
        }





        $deals = $query->paginate($request->per_page ?? 10);
        return ApiResponse(message: 'Deals retrieved successfully', code: 200, data: $deals);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->validate(
                [
                    'name' => 'required|string|max:255',
                    'description' => 'nullable|string|max:255',
                    'price' => 'required|numeric',
                    'quantity' => 'required|integer',
                    'category_id' => 'required|exists:item_categories,id',
                    'unit' => 'required|string|max:255',
                    'image' => 'nullable|string|max:255',
                    'status' => 'required|string|max:255',
                ]
            );
            Item::create($data);
            DB::commit();
            return ApiResponse(message: 'Item created successfully', code: 201);
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
