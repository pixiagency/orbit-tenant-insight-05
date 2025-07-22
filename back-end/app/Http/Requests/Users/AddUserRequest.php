<?php

namespace App\Http\Requests\Users;

use App\DTO\User\UserDTO;
use App\Enums\UserType;
use App\Http\Requests\BaseRequest;

class AddUserRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'type' => $this->determineType(),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'required|numeric|unique:users,phone',
            'role' => 'required|integer|exists:roles,id',
        ];
    }

    public function toUserDTO(): \App\DTO\BaseDTO
    {
        return UserDTO::fromRequest($this);
    }

    protected function determineType(): string
    {
        return match ($this->role) {
            1 => UserType::ADMIN->value,
            2 => UserType::LEADER->value,
            default => UserType::SALES->value,
        };
    }
}
