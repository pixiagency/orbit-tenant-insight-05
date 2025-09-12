<?php

namespace App\Http\Controllers\Api;

use App\DTO\Tenant\DealDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Deal\StoreDealRequest;
use App\Http\Resources\DealResource;
use App\Http\Resources\Tenant\Deals\DealListResource;
use App\Services\DealService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DealController extends Controller
{

    public function __construct(public DealService $dealService) {}

    public function index(Request $request)
    {
        $deals = $this->dealService->paginate($request);
        return apiResponse(data: DealListResource::collection($deals)->response()->getData(true), message: 'Deals retrieved successfully', code: 200);
    }

    public function store(StoreDealRequest $request)
    {
        try {
            $dealDTO = DealDTO::fromRequest($request);
            $deal = $this->dealService->create($dealDTO);
            return apiResponse(
                data: new DealResource($deal),
                message: 'Deal created successfully',
                code: 201
            );
        } catch (ValidationException $e) {
            return apiResponse(
                message: $e->errors(),
                code: 422
            );
        } catch (\Exception $e) {
            return apiResponse(
                message: $e->getMessage(),
                code: 500
            );
        }
    }
}
