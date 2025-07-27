<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Deal;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DealController extends Controller
{

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->validate([
                'deal_type' => 'required|string|max:255',
                'deal_name' => 'required|string|max:255',
                'contact_id' => 'required|exists:contacts,id',
                'sale_date' => 'required|date',
                'discount_type' => 'required|string|max:255',
                'discount_value' => 'required|numeric',
                'tax_rate' => 'required|numeric',
                'assigned_to_id' => 'required|exists:users,id',
                'payment_status' => ['required', Rule::in(['paid', 'unpaid', 'partial'])],
                'payment_method_id' => 'required|exists:payment_methods,id',
                'notes' => 'nullable|string|max:255',
            ]);
            Deal::create($data);

            return ApiResponse(message: 'Deal created successfully', code: 201);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
