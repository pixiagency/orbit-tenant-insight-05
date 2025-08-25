<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Opportunity\StoreOpportunityRequest;
use App\Http\Requests\Opportunity\UpdateOpportunityRequest;
use App\Http\Resources\Opportunity\OpportunityResource;
use App\Models\Tenant\Contact;
use App\Models\Tenant\Lead;
use DB;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class OpportunityController extends Controller
{

    public function statistics()
    {
        $opportunities = Lead::count();
        $opportunities_deals_value = Lead::sum('deal_value');
        $opportunities_win_probability = Lead::avg('win_probability');
        return ApiResponse(message: 'Opportunities statistics retrieved successfully', code: 200, data: [
            'opportunities' => $opportunities,
            'opportunities_deals_value' => $opportunities_deals_value,
            'opportunities_win_probability' => $opportunities_win_probability,
        ]);
    }

    public function index(Request $request)
    {
        $query = Lead::query();

        // Search by package name
        if ($request->filled('search')) {
            $query->where('opportunity_name', 'like', '%' . $request->search . '%');
        }

        // Filter by stage_id
        if ($request->filled('stage_id')) {
            $query->where('stage_id', $request->stage_id);
        }

        // Filter by assigned_to_id
        if ($request->filled('assigned_to_id')) {
            $query->where('assigned_to_id', $request->assigned_to_id);
        }

        // Filter by source_id
        if ($request->filled('source_id')) {
            $query->where('source_id', $request->source_id);
        }

        // Filter by pipeline_id
        if ($request->filled('pipeline_id')) {
            $query->whereHas('stage', function ($stageQuery) use ($request) {
                $stageQuery->where('pipeline_id', $request->pipeline_id);
            });
        }


        // Get pagination per page from request or default to 10
        $perPage = $request->get('per_page', 10);

        // Paginate the results
        $opportunities = $query->with('contact', 'city', 'stage')->paginate($perPage);

        // $opportunities = Lead::with('contact', 'city', 'stage')->get();
        return ApiResponse(OpportunityResource::collection($opportunities), 'Opportunities retrieved successfully');
    }

    public function store(StoreOpportunityRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->validated();

            $contact = Contact::find($data['contact_id']);

            if ($contact->activeLead) {
                return ApiResponse(message: 'Contact already has an active lead', code: 400);
            }

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

    public function update(UpdateOpportunityRequest $request, $id)
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
