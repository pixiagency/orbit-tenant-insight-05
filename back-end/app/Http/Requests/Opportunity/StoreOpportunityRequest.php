<?php

namespace App\Http\Requests\Opportunity;

use App\Enums\ActivationStatus;
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
            'opportunity_name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'contact_id' => 'required|exists:contacts,id',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'source_id' => 'required|exists:sources,id',
            'city_id' => 'required|exists:cities,id',
            'status' => ['required', Rule::in(ActivationStatus::values())],
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
