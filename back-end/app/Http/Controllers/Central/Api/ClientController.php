<?php

namespace App\Http\Controllers\Central\Api;

use App\Enums\ActivationStatus;
use App\Enums\CompanySizes;
use App\Http\Controllers\Controller;
use App\Models\Tier;
use App\Http\Requests\StoreTierRequest;
use App\Http\Requests\Tier\BuyTierRequest;
use App\Http\Requests\UpdateTierRequest;
use App\Http\Resources\ClientCollection;
use App\Http\Resources\ClientResource;
use App\Http\Resources\TierCollection;
use App\Http\Resources\TierResource;
use App\Models\Client;
use App\Models\Setting;
use App\Models\Tenant;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClientController extends Controller
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
            $query = Client::query();

            // Get pagination per page from request or default to 10
            $perPage = $request->get('per_page', 10);

            // Paginate the results
            $clients = $query->paginate($perPage);

            return ApiResponse(new ClientCollection($clients), 'Clients retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $setting = Setting::first();
            $allowedIndustries = json_decode($setting?->industries ?? '[]', true);

            $validatedData = $request->validate([
                'company_name' => 'required|string|unique:clients',
                'subdomain' => 'required|string|unique:clients',
                'contact_name' => 'nullable|string|unique:clients',
                'contact_email' => 'required|email|unique:clients',
                'contact_phone' => 'required|string|unique:clients',
                'job_title' => 'nullable|string',
                'website' => 'nullable|string',
                'company_size' => ['nullable', Rule::in(CompanySizes::values())],
                'industry' => ['nullable', Rule::in($allowedIndustries)],
                'city_id' => 'nullable|exists:cities,id',
                'postal_code' => 'nullable|string',
                'address' => 'nullable|string',
                'status' => ['nullable', Rule::in(ActivationStatus::values())],
            ]);
            $client = Client::create($validatedData);
            return ApiResponse(new ClientResource($client), 'Client created successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
