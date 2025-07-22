<?php

namespace App\Http\Requests\Pipeline;

use App\DTO\Pipeline\PipelineDTO;
use Illuminate\Foundation\Http\FormRequest;

class PipelineStoreRequest extends FormRequest
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
            'name' => 'required|string',
            'stages' => 'required|array',
            'stages.*.name' => 'required|string',
        ];
    }



    public function toPipelineDTO(): PipelineDTO
    {
        return new PipelineDTO(
            name: $this->input('name'),
            stages: $this->input('stages', [])
        );
    }

}
