<?php

namespace App\Http\Requests\Contacts;

use App\Enums\ContactMethods;
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
            'email' => 'sometimes|email|unique:clients,email',
            'business_phone' => 'sometimes|string|max:20',
            'mobile_phone' => 'sometimes|string|max:20',
            'job_title' => 'sometimes|string|max:255',
            'department' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|max:255',
            'source_id' => 'sometimes|exists:sources,id',

            // communication preferences
            'contact_method' => [Rule::enum(ContactMethods::class)],
            'email_permission' => 'sometimes|boolean',
            'phone_permission' => 'sometimes|boolean',
            'whatsapp_permission' => 'sometimes|boolean',

            // company info
            'company_name' => 'sometimes|string|max:255',
            'website' => 'sometimes|string|max:255',
            'industry' => 'sometimes|string|max:255',
            'company_size' => 'sometimes|numeric|min:1',

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
