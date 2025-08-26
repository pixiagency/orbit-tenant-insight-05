<?php

namespace App\Http\Requests\Deal;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDealRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'deal_type' => ['required', Rule::in(['product_sale', 'service_sale', 'subscription'])],
            'deal_name' => 'required|string|max:255',
            'contact_id' => 'required|exists:contacts,id',
            'sale_date' => 'required|date',
            'discount_type' => 'required|string|max:255',
            'discount_value' => 'required|numeric',
            'tax_rate' => 'required|numeric',
            'assigned_to_id' => 'required|exists:users,id',
            'payment_status' => ['required', Rule::in(['paid', 'unpaid', 'partial'])],
            'payment_method_id' => 'required|exists:payment_methods,id',
            'notes' => 'nullable|string|max:255',
            'stage_id' => 'required|exists:stages,id',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'sometimes|integer',
            'items.*.price' => 'required|numeric',
        ];
    }
}
