<?php

namespace App\Http\Requests\Opportunity;

use App\Enums\OpportunityStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('put') ? 'sometimes' : 'required';
        return [
            'contact_id' => $required . '|exists:contacts,id',
            'status' => [$required, Rule::in(OpportunityStatus::values())],
            'stage_id' => $required . '|exists:stages,id',
            'deal_value' => $required . '|numeric',
            'win_probability' => $required . '|numeric',
            'expected_close_date' => $required . '|date',
            'assigned_to_id' => $required . '|exists:users,id',
            'notes' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'items' => $required . '|array',
            'items.*.id' => 'required|exists:items,id',
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => 'nullable|numeric',
        ];
    }
}
