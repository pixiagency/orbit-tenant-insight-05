<?php

namespace App\Http\Requests\Contacts;

use App\Enums\CompanySizes;
use App\Enums\ContactMethods;
use App\Enums\ContactStatus;
use App\Enums\IndustryStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('contacts', 'email')->ignore($this->route('contact'))],
            'contact_phones' => 'sometimes|array',
            'contact_phones.*' => ['sometimes', 'string', Rule::unique('contact_phones', 'phone')->ignore($this->route('contact'))],
            'job_title' => 'sometimes|string|max:255',
            'department' => 'sometimes|string|max:255',
            'status' => ['sometimes', Rule::enum(ContactStatus::class)],
            'source_id' => 'sometimes|exists:sources,id',

            // communication preferences
            'contact_method' => ['sometimes', Rule::enum(ContactMethods::class)],
            'email_permission' => 'sometimes|boolean',
            'phone_permission' => 'sometimes|boolean',
            'whatsapp_permission' => 'sometimes|boolean',

            // company info
            'company_name' => 'sometimes|string|max:255',
            'website' => 'sometimes|string|max:255',
            'industry' => ['sometimes', Rule::enum(IndustryStatus::class)],
            'company_size' => ['sometimes', Rule::enum(CompanySizes::class)],

            // address info
            'address' => 'sometimes|string|max:255',
            'country_id' => 'sometimes|exists:countries,id',
            'city_id' => 'sometimes|exists:cities,id',
            'state' => 'sometimes|string|max:255',
            'zip_code' => 'sometimes|string|max:255',

            // system fields
            'user_id' => 'sometimes|exists:users,id',

            // tags
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:255',

            // notes
            'notes' => 'nullable|string|max:255',
        ];
    }
}
