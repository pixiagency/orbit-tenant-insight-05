<?php

namespace App\Http\Controllers\Api;

use App\Enums\DealType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Deal\StoreDealRequest;
use App\Http\Resources\DealResource;
use App\Models\Tenant\Deal;
use App\Models\Tenant\Item;
use App\Services\DealService;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DealController extends Controller
{

    public function __construct(public DealService $dealService) {}

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

        $query->with('items', 'stage.pipeline');

        $deals = $query->paginate($request->per_page ?? 10);
        return ApiResponse(message: 'Deals retrieved successfully', code: 200, data: DealResource::collection($deals));
    }

    public function store(StoreDealRequest $request)
    {
        try {
            $deal = $this->dealService->create($request->validated());
            return ApiResponse(
                message: 'Deal created successfully',
                data: new DealResource($deal),
                code: 201
            );
        } catch (ValidationException $e) {
            return ApiResponse(
                message: $e->errors(),
                code: 422
            );
        } catch (\Exception $e) {
            return ApiResponse(
                message: $e->getMessage(),
                code: 500
            );
        }
    }
}
