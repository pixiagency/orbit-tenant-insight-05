<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Opportunity\StoreOpportunityRequest;
use App\Http\Resources\Opportunity\OpportunityResource;
use App\Models\Tenant\Lead;
use DB;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OpportunityController extends Controller
{

    public function index()
    {
        $opportunities = Lead::with('contact', 'city', 'stage')->get();
        return ApiResponse(OpportunityResource::collection($opportunities), 'Opportunities retrieved successfully');
    }

    public function store(StoreOpportunityRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->validated();
            Lead::create([
                'opportunity_name' => $data['opportunity_name'],
                'company' => $data['company'],
                'contact_id' => $data['contact_id'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'source_id' => $data['source_id'],
                'city_id' => $data['city_id'],
                'status' => $data['status'],
                'stage_id' => $data['stage_id'],
                'deal_value' => $data['deal_value'],
                'win_probability' => $data['win_probability'],
                'expected_close_date' => $data['expected_close_date'],
                'assigned_to_id' => $data['assigned_to_id'],
                'notes' => $data['notes'],
            ]);
            DB::commit();
            return ApiResponse(message: 'Opportunity created successfully', code: 201);
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function show($id)
    {
        try {
            $opportunity = Lead::with('contact', 'city', 'stage')->findOrFail($id);
            return ApiResponse(new OpportunityResource($opportunity), 'Opportunity retrieved successfully');
        } catch (ModelNotFoundException $e) {
            return ApiResponse(message: 'Opportunity not found', code: 404);
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function update(StoreOpportunityRequest $request, $id)
    {
        try {
            $opportunity = Lead::with('contact', 'city', 'stage')->findOrFail($id);
            $opportunity->update($request->validated());
            return ApiResponse(message: 'Opportunity updated successfully', code: 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse(message: 'Opportunity not found', code: 404);
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function destroy($id)
    {
        try {
            $opportunity = Lead::findOrFail($id);
            $opportunity->delete();
            return ApiResponse(message: 'Opportunity deleted successfully', code: 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse(message: 'Opportunity not found', code: 404);
        }
    }
}
