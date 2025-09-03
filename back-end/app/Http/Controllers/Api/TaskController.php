<?php

namespace App\Http\Controllers\Api;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tasks\StoreTaskRequest;
use App\Models\Tanant\TaskType;
use App\Models\Tenant\Task;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{

    public function store(StoreTaskRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->validated();
            Task::create($data);

            return ApiResponse(message: 'Task created successfully', code: 201);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }

    public function taskTypes()
    {
        try {
            $data = TaskType::all();

            return ApiResponse(message: trans('app.data displayed successfully'), code: 200);
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
