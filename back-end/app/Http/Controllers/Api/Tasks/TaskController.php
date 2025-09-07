<?php

namespace App\Http\Controllers\Api\Tasks;

use App\DTO\Tenant\TaskDTO;
use App\Exceptions\GeneralException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\TaskRequest;
use App\Http\Resources\Tenant\Tasks\TaskResource;
use App\Http\Resources\Tenant\Tasks\TaskShowResource;
use App\Models\Tenant\Task;
use App\Services\Tenant\TaskService;
use DB;
use Exception;
use Request;

class TaskController extends Controller
{
    public function __construct(public TaskService $taskService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $tasks = $this->taskService->queryGet([], [
                'assignedTo.roles',
                'priority.color'
            ])->get();
            $data = TaskResource::collection($tasks);
            return apiResponse( $data, trans('app.data displayed successfully'));
        } catch (Exception $e) {
            return apiResponse(message: $e->getMessage(), code: 500);
        }
    }
    public function store(TaskRequest $request)
    {
        try {
            DB::beginTransaction();
            $taskDTO = TaskDTO::fromRequest($request);
            $data = $this->taskService->store($taskDTO);
            DB::commit();
            return apiResponse(new TaskResource($data), trans('app.data created successfully'), code: 201);
        } catch (GeneralException $e) {
            DB::rollBack();
            return apiResponse(message: $e->getMessage(), code: 400);
        } catch (Exception $e) {
            DB::rollBack();
            return apiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $task = $this->taskService->getModel()->with([
                'assignedTo.roles',
                'priority.color',
                'followers.roles',
                'reminders'
            ])->find($id);
            if (!$task) {
                return apiResponse(message: trans('app.data not found'), code: 404);
            }
            $data = new TaskShowResource($task);
            return apiResponse($data, trans('app.data displayed successfully'));
        } catch (Exception $e) {
            return apiResponse(message: $e->getMessage(), code: 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $this->taskService->destroy($id);
            DB::commit();
            return apiResponse(message: trans('app.data deleted successfully'));
        } catch (GeneralException $e) {
            DB::rollBack();
            return apiResponse(message: $e->getMessage(), code: 400);
        } catch (Exception $e) {
            DB::rollBack();
            return apiResponse(message: $e->getMessage(), code: 500);
        }
    }

 
}
