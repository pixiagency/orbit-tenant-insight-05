<?php

namespace App\Http\Requests\Deal;

use App\Enums\DealTypeEnum;
use App\Enums\DiscountTypeEnum;
use App\Enums\PaymentStatusEnum;
use App\Settings\DealsSettings;
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
            'deal_type' => ['required', Rule::in(DealTypeEnum::values())],
            'deal_name' => 'required|string|max:255',
            'contact_id' => 'required|exists:contacts,id',
            'sale_date' => 'required|date',
            'discount_type' => ['nullable', Rule::in(DiscountTypeEnum::values())],
            'discount_value' => 'nullable|numeric',
            'tax_rate' => 'required|numeric',
            'assigned_to_id' => 'required|exists:users,id',
            'payment_status' => ['required', Rule::in(PaymentStatusEnum::values())],
            'payment_method_id' => 'required|exists:payment_methods,id',
            'notes' => 'nullable|string|max:255',
            'stage_id' => 'required|exists:stages,id',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'sometimes|integer',
            'items.*.price' => 'required|numeric',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:png,jpg,jpeg,pdf,doc,docx|max:' . $this->getMaxAttachmentSize(),
        ];
    }

    /**
     * Get the maximum attachment size from settings
     */
    private function getMaxAttachmentSize(): int
    {
        $settings = app(DealsSettings::class);
        return $settings->attachment_size_limit_mb * 1024; // Convert MB to KB
    }
}
