<?php

namespace App\Http\Requests\Contacts;

use Illuminate\Foundation\Http\FormRequest;

class ContactStoreRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'business_phone' => 'required|string|max:20',
            'mobile_phone' => 'required|string|max:20',
            'job_title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'source_id' => 'required|exists:sources,id',

            // communication preferences
            'contact_method' => 'required|string|max:255',
            'email_permission' => 'required|boolean',
            'phone_permission' => 'required|boolean',
            'whatsapp_permission' => 'required|boolean',

            // company info
            'company_name' => 'required|string|max:255',
            'website' => 'required|string|max:255',
            'industry' => 'required|string|max:255',
            'company_size' => 'required|string|max:255',

            // address info
            'address' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:255',

            // system fields
            'user_id' => 'required|exists:users,id',

            // tags
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:255',

            // notes
            'notes' => 'nullable|string|max:255',
        ];
    }
}
