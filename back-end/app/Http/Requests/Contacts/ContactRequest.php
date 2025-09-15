<?php

namespace App\Http\Requests\Contacts;

use App\Enums\CompanySizes;
use App\Enums\ContactMethods;
use App\Enums\ContactStatus;
use App\Enums\IndustryStatus;
use App\Rules\Tenant\MaxContactPhonesRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactRequest extends FormRequest
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
        dd($this->route('contact'));
        $isCreate   = $this->isMethod('post');          // POST vs PUT/PATCH
        $min        = $isCreate ? 1 : 0;
        $presence   = $isCreate ? 'required' : 'sometimes'; // or 'present' if key must exist
        return [
            'first_name' => [Rule::requiredIf($this->isMethod('PUT')), 'string', 'max:255'],
            'last_name' => 'nullable|string|max:255',
            'email' => [Rule::requiredIf($this->isMethod('PUT')), 'email', Rule::unique('contacts', 'email')->ignore($this->route('contact'))],
            'contact_phones' => [$presence, 'array', 'min:' . $min],
            'contact_phones.*' => [$presence, 'string', 'max:20', Rule::unique('contact_phones', 'phone')->ignore($this->route('contact'))],
            // 'contact_phones' => ['required', 'array', new MaxContactPhonesRule($this->route('contact'), $this->contact_phones ?? [], $this->isMethod('POST'))],
            // 'contact_phones.*' => ['required', 'string', 'max:20', Rule::unique('contact_phones', 'phone')->ignore($this->route('contact'))],
            'job_title' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'status' => ['nullable', Rule::enum(ContactStatus::class)],
            'source_id' => 'nullable|exists:sources,id',

            // communication preferences
            'contact_method' => ['nullable', Rule::enum(ContactMethods::class)],
            'email_permission' => 'nullable|boolean',
            'phone_permission' => 'nullable|boolean',
            'whatsapp_permission' => 'nullable|boolean',

            // company info
            'company_name' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'industry' => ['nullable', Rule::enum(IndustryStatus::class)],
            'company_size' => ['nullable', Rule::enum(CompanySizes::class)],

            // address info
            'address' => 'nullable|string|max:255',
            'country_id' => 'nullable|exists:countries,id',
            'city_id' => 'nullable|exists:cities,id',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:255',

            // system fields
            'user_id' => 'nullable|exists:users,id',

            // tags
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:255',

            // notes
            'notes' => 'nullable|string|max:255',
        ];
    }
}
