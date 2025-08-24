<?php

namespace App\Http\Requests\Tasks;

use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
        ];
    }
}
