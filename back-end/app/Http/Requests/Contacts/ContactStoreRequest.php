<?php

namespace App\Http\Requests\Contacts;

use App\Enums\CompanySizes;
use App\Enums\ContactMethods;
use App\Enums\ContactStatus;
use App\Enums\IndustryStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'email' => 'required|email|unique:contacts,email',
            'business_phone' => 'required|string|max:20',
            'mobile_phone' => 'required|string|max:20',
            'job_title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'status' => ['required', Rule::enum(ContactStatus::class)],
            'source_id' => 'required|exists:sources,id',

            // communication preferences
            'contact_method' => ['required', Rule::enum(ContactMethods::class)],
            'email_permission' => 'required|boolean',
            'phone_permission' => 'required|boolean',
            'whatsapp_permission' => 'required|boolean',

            // company info
            'company_name' => 'required|string|max:255',
            'website' => 'required|string|max:255',
            'industry' => ['required', Rule::enum(IndustryStatus::class)],
            'company_size' => ['required', Rule::enum(CompanySizes::class)],

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
