<?php

namespace App\Http\Controllers\Central\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivationCodeRequest;
use App\Http\Resources\ActivationCodeCollection;
use App\Services\Central\ActivationCodeService;
use Illuminate\Http\Request;

class ActivationCodeController extends Controller
{
    public function __construct(
        public ActivationCodeService $activationCodeService
    ) {}

    public function index(Request $request)
    {
        $filter['using_state'] = $request->query('using_state', 'all');
        $activationCodes = $this->activationCodeService->index(
            filters: $filter,
            withRelations: ['tier', 'createBy']
        );
        return apiResponse(new ActivationCodeCollection($activationCodes), 'Activation codes retrieved successfully.');
    }

    public function store(StoreActivationCodeRequest $request)
    {
        $data = $request->validated();
        $message = $this->activationCodeService->store($data);
        return apiResponse($message, 'Operation completed successfully.');
    }

    public function statistics()
    {
        $statistics = $this->activationCodeService->statistics();
        return apiResponse($statistics, 'Statistics retrieved successfully.');
    }
}
