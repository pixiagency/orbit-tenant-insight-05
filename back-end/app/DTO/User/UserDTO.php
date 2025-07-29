<?php

namespace App\DTO\User;

use App\DTO\BaseDTO;
use Illuminate\Support\Arr;

class UserDTO extends BaseDTO
{
    /**
     * @param string $first_name',
     * @param string $last_name',
     * @param string $email',
     * @param ?string $password',
     * @param string $phone',
     * @param ?string $role',
     */
    
    public function __construct(
        public readonly string $first_name,
        public readonly string $last_name,
        public readonly string $email,
        public readonly ?string $password,
        public readonly string $phone,
        public readonly ?string $role,
    ) {}

    public static function fromRequest($request): UserDTO
    {
        return new self(
            first_name: $request->first_name,
            last_name: $request->last_name,
            email: $request->email,
            password: $request->password,
            phone: $request->phone,
            role: $request->role
        );
    }

    /**
     * @param array $data
     * @return $this
     */
    public static function fromArray(array $data): UserDTO
    {
        return new self(
            first_name: Arr::get($data, 'first_name'),
            last_name: Arr::get($data, 'last_name'),
            email: Arr::get($data, 'email'),
            password: Arr::get($data, 'password'),
            phone: Arr::get($data, 'phone'),
            role: Arr::get($data, 'role')
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'role' => $this->role
        ];
    }
}
