<?php

namespace App\Http\Controllers\Central\Api;

use App\Http\Controllers\Controller;
use App\Models\Tier;
use App\Http\Requests\StoreTierRequest;
use App\Http\Requests\Tier\BuyTierRequest;
use App\Http\Requests\UpdateTierRequest;
use App\Http\Resources\TierCollection;
use App\Http\Resources\TierResource;
use App\Models\Tenant;
use Exception;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
        // $this->middleware('permission:tiers.add')->only(['store']);
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Tier::query();

            // Filter by price range
            if ($request->filled('price')) {
                $query->where('price', '<=', $request->price);
            }

            // Filter by duration unit
            if ($request->filled('duration_unit')) {
                $query->where('duration_unit', $request->duration_unit);
            }

            // Filter by status
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Search by package name
            if ($request->filled('search')) {
                $query->where('package_name', 'like', '%' . $request->search . '%');
            }

            // Filter by max users
            if ($request->filled('max_users')) {
                $query->where('max_users', '<=', $request->max_users);
            }

            // Filter by min users
            if ($request->filled('min_users')) {
                $query->where('max_users', '>=', $request->min_users);
            }

            // Filter by visibility
            if ($request->filled('visibility')) {
                $query->where('visibility', $request->visibility);
            }

            // Filter by after date
            if ($request->filled('after_date')) {
                $query->where('created_at', '>=', $request->after_date);
            }

            // Filter by before date
            if ($request->filled('before_date')) {
                $query->where('created_at', '<=', $request->before_date);
            }

            // Filter by modules dropdown filter
            if ($request->filled('modules')) {
                $query->where('modules', 'like', '%' . $request->modules . '%');
            }

            // Get pagination per page from request or default to 10
            $perPage = $request->get('per_page', 10);

            // Paginate the results
            $tiers = $query->paginate($perPage);

            return ApiResponse(new TierCollection($tiers), 'Packages retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTierRequest $request)
    {
        try {

            // $this->authorize('user.create');
            $data = $request->validated();
            $tier = Tier::create($data);
            return ApiResponse(new TierResource($tier), 'Tier created successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function buy(BuyTierRequest $request)
    {
        try {
            // $this->authorize('buy', $tier);
            $tier = Tier::where('activation_code', $request->activation_code)->first(); // Assuming the activation code has a relationship with the tier
            if (!$tier) {
                return ApiResponse(message: 'Tier not found for the provided activation code', code: 404);
            }
            $tenant = Tenant::find($request->tenant_id);
            $tenant->tiers()->attach($tier->id, [
                'user_id' => auth()->id(),
                'activated_at' => now(),
            ]);

            return ApiResponse(message: 'Tier purchased successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Tier $tier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTierRequest $request, Tier $tier)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tier $tier)
    {
        //
    }
}
