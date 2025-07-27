<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActivationStatus;
use App\Http\Controllers\Controller;
use App\Models\Tenant\Lead;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OpportunityController extends Controller
{

    public function store(Request $request)
    {
        try {
            // dd($request->all());
            DB::beginTransaction();
            $data = $request->validate([
                'opportunity_name' => 'required|string|max:255',
                'company' => 'required|string|max:255',
                'contact_id' => 'required|exists:contacts,id',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:255',
                'source_id' => 'required|exists:sources,id',
                'city_id' => 'required|exists:cities,id',
                'status' => ['required', Rule::in(ActivationStatus::values())],
                'stage_id' => 'required|exists:stages,id',
                'deal_value' => 'required|numeric',
                'win_probability' => 'required|numeric',
                'expected_close_date' => 'required|date',
                'assigned_to_id' => 'required|exists:users,id',
                'notes' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:255',
            ]);
            // dd($data);
            $lead = Lead::create($data);
            dd($lead->toArray());
            return ApiResponse(message: 'Opportunity created successfully', code: 201);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
