<?php

namespace App\Http\Requests\Users;

use App\DTO\User\UserDTO;
use App\Enums\RolesEnum;
use App\Enums\UserType;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class AddUserRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'required|numeric|unique:users,phone',
            'role' => ['required', Rule::in(RolesEnum::cases())],
        ];
    }

    public function toUserDTO(): \App\DTO\BaseDTO
    {
        return UserDTO::fromRequest($this);
    }
}
