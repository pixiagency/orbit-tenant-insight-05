<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActivationStatus;
use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Models\Tenant\Task;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            // dd($request->all());
            $data = $request->validate([
                'task_title' => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'task_type' => 'required|string|max:255',
                'status' => ['required', Rule::in(TaskStatus::values())],
                'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
                'due_date' => 'required|date',
                'due_time' => 'required|date_format:H:i',
                'assigned_to_id' => 'required|exists:users,id',
                'reminder_time' => 'required|integer',
                'lead_id' => 'required|exists:leads,id',
                'tags' => 'nullable|array',
                'tags.*' => 'nullable|string|max:255',
                'additional_notes' => 'nullable|string|max:255',
            ]);
            // dd($data);
            Task::create($data);

            return ApiResponse(message: 'Task created successfully', code: 201);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return ApiResponse(message: $e->getMessage(), code: 500);
        }
    }
}
