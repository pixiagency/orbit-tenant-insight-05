<?php

namespace App\Http\Requests\Opportunity;

use App\Enums\OpportunityStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contact_id' => 'sometimes|exists:contacts,id',
            'status' => ['sometimes', Rule::in(OpportunityStatus::values())],
            'stage_id' => 'sometimes|exists:stages,id',
            'deal_value' => 'sometimes|numeric',
            'win_probability' => 'sometimes|numeric',
            'expected_close_date' => 'sometimes|date',
            'assigned_to_id' => 'sometimes|exists:users,id',
            'notes' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
        ];
    }
}
