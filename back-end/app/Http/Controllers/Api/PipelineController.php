<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\PipelineCollection;
use Illuminate\Http\Request;
use App\DTO\Pipeline\PipelineDTO;
use App\Services\PipelineService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

use App\Http\Requests\Pipeline\PipelineStoreRequest;
use App\Http\Requests\Pipeline\PipelineUpdateRequest;
use App\Http\Resources\PipelineResource;
use Exception;
use Illuminate\Http\JsonResponse;

class PipelineController extends Controller
{
    public function __construct(public PipelineService $pipelineService)
    {
        //        $this->middleware('permission:view pipelines', ['only' => ['index','show']]);
        //        $this->middleware('permission:edit pipelines', ['only' => ['edit', 'update']]);
        //        $this->middleware('permission:create pipelines', ['only' => ['create', 'store']]);
        //        $this->middleware('permission:delete pipelines', ['only' => ['destroy']]);
    }
    /**
     * Display a listing of the pipeline.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->query('per_page');
            $filters = array_filter($request->get('filters', []), function ($value) {
                return ($value !== null && $value !== false && $value !== '');
            });
            $withRelations = ['stages'];
            $pipelines = $this->pipelineService->index($filters, $withRelations, $perPage);
            return ApiResponse(new PipelineCollection($pipelines), 'Pipelines retrieved successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
    /**
     * Store a newly created pipline in storage.
     */
    public function store(PipelineStoreRequest $request): JsonResponse
    {
        try {
            // Create pipelineDTO from the request
            $pipelineDTO = PipelineDTO::fromRequest($request);
            // Store the pipline using the service
            $pipeline = $this->pipelineService->store($pipelineDTO);
            return ApiResponse(new PipelineResource($pipeline), 'Pipeline created successfully');
        } catch (Exception $e) {
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Display the specified pipline.
     */
    public function show(Pipline $pipline)
    {
        return view('layouts.dashboard.pipline.show', compact('pipline'));
    }

    /**
     * Show the form for editing the specified pipline.
     */
    public function edit(Pipline $pipline)
    {
        return view('layouts.dashboard.pipline.edit', compact('pipline'));
    }

    /**
     * Update the specified pipline in storage.
     */
    public function update(PipelineUpdateRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            // Retrieve the pipline by ID
            $pipline = Pipline::findOrFail($id); // Fetch the Pipline model

            // Create piplineDTO from the request
            $piplineDTO = PipelineDTO::fromRequest($request);

            // Update the pipline using the pipline model
            $pipline = $this->piplineService->update($pipline, $piplineDTO); // Pass the model instead of the ID

            // Success message
            $toast = [
                'type' => 'success',
                'title' => 'Success',
                'message' => trans('app.pipline_updated_successfully')
            ];

            DB::commit();
            return to_route('piplines.index')->with('toast', $toast);
        } catch (\Exception $e) {
            DB::rollBack();
            // Error message
            $toast = [
                'type' => 'error',
                'title' => 'Error',
                'message' => $e->getMessage()
            ];
            return back()->with('toast', $toast);
        }
    }



    /**
     * Remove the specified pipline from storage.
     */
    public function destroy(int $id)
    {
        try {
            $this->piplineService->delete($id);
            $toast = [
                'type' => 'success',
                'title' => 'success',
                'message' => trans('app.pipline_deleted_successfully')
            ];
            return to_route('piplines.index')->with('toast', $toast);
        } catch (\Exception $e) {
            $toast = [
                'type' => 'error',
                'title' => 'error',
                'message' => trans('app.there_is_an_error')
            ];
            return back()->with('toast', $toast);
        }
    }
}
