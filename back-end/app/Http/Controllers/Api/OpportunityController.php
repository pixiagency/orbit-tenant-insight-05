<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Opportunity\StoreOpportunityRequest;
use App\Http\Requests\Opportunity\UpdateOpportunityRequest;
use App\Http\Resources\AuditOpportunityResource;
use App\Http\Resources\Opportunity\OpportunityResource;
use App\Models\Filters\OpportunityFilter;
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
        try {
            $query = Lead::query();

            // Apply filters using TierFilter
            $filters = $request->only([
                'stage_id',
                'assigned_to_id',
                'source_id',
                'pipeline_id',
            ]);

            // Remove empty values
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            $opportunityFilter = new OpportunityFilter($filters);
            $query = $opportunityFilter->apply($query);

            $opportunities = $query->with('contact', 'city', 'stage')->paginate(per_page());

            $data = OpportunityResource::collection($opportunities)->response()->getdata(true);

            return ApiResponse($data,  __('app.data retrieved successfully'));
        } catch (\Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
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
                'contact_id' => $data['contact_id'],
                'stage_id' => $data['stage_id'],
                'status' => $data['status'],
                'deal_value' => $data['deal_value'],
                'win_probability' => $data['win_probability'],
                'expected_close_date' => $data['expected_close_date'],
                'assigned_to_id' => $data['assigned_to_id'],
                'notes' => $data['notes'],
                'description' => $data['description'],
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
            // dd($request->all());
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

    public function changeStage(Request $request, int $opportunity)
    {
        try {
            DB::beginTransaction();
            $opportunity = Lead::findOrFail($opportunity);
            $validated = $request->validate([
                'stage_id' => 'required|exists:stages,id',
            ]);
            $opportunity->update($validated);
            DB::commit();
            return ApiResponse(message: 'Opportunity stage changed successfully', code: 200);
        } catch (ModelNotFoundException $e) {
            return ApiResponse(message: 'Opportunity not found', code: 404);
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function getActivitiesList($id)
    {
        $opportunity = Lead::findOrFail($id);
        // Get all associated Audits
        // $all = $opportunity->audits()->with('user')->get();
        // dd($all[0]->user);

        $audits = $opportunity->audits()->with('user')->latest()->get();
        return ApiResponse(message: 'Opportunity activity list retrieved successfully', code: 200, data: AuditOpportunityResource::collection($audits));
    }
}
