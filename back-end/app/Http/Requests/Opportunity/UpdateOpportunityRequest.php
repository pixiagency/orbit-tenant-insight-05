<?php

namespace App\Http\Requests\Opportunity;

use App\Enums\ActivationStatus;
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
            'opportunity_name' => 'sometimes|string|max:255',
            'company' => 'sometimes|string|max:255',
            'contact_id' => 'sometimes|exists:contacts,id',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:255',
            'source_id' => 'sometimes|exists:sources,id',
            'city_id' => 'sometimes|exists:cities,id',
            'status' => ['sometimes', Rule::in(ActivationStatus::values())],
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
