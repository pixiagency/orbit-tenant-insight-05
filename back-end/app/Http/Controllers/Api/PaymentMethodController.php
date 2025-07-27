<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\GeneralException;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Tenant\PaymentMethod;
use App\Services\ContactService;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function __construct(public ContactService $contactService) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            DB::beginTransaction();
            $data = $request->validate([
                'name' => 'required|string|max:255',
            ]);
            PaymentMethod::create($data);
            DB::commit();
            return ApiResponse(message: 'payment method created successfully', code: 201);
        } catch (GeneralException $e) {
            return ApiResponse(message: $e->getMessage(), code: $e->getCode());
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
