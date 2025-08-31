<?php

namespace App\Http\Requests\Opportunity;

use App\Enums\OpportunityStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contact_id' => 'required|exists:contacts,id',
            'status' => ['required', Rule::in(OpportunityStatus::values())],
            'stage_id' => 'required|exists:stages,id',
            'deal_value' => 'required|numeric',
            'win_probability' => 'required|numeric',
            'expected_close_date' => 'required|date',
            'assigned_to_id' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',

        ];
    }
}
