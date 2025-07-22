<?php

namespace App\DTO\User;

use App\DTO\BaseDTO;
use Illuminate\Support\Arr;

class UserDTO extends BaseDTO
{

    /**
     * @param string $name',
     * @param string $email',
     * @param ?string $password',
     * @param string $phone',
     * @param ?string $type',
     * @param ?bool $status',
     * @param ?int $company_id',
     * @param ?int $branch_id',
     * @param ?int $department_id',
     * @param ?string $notes',
     * @param ?int $city_id',
     * @param ?int $area_id',
     * @param ?string $address',
     * @param int $role',
     * @param ?array $service_location_ids',
     * @param ?int $office_id',
     * @param ?string $geid',
     *
     */
    public function __construct(
        protected string $name,
        protected string $email,
        protected ?string $password,
        protected string $phone,
        protected ?string $type,
        protected ?bool $status,
        protected ?int $company_id,
        protected ?int $branch_id,
        protected ?int $department_id,
        protected ?string $notes,
        protected ?int $city_id,
        protected ?int $area_id,
        protected ?string $address,
        protected ?array $permissions,
        protected ?array $service_location_ids,
        public int $role,
        protected $profile_image,
        protected ?int $office_id,
    ) {}

    public static function fromRequest($request): UserDTO
    {
        return new self(
            name: $request->name,
            email: $request->email,
            password: isset($request->password) ? bcrypt($request->password) : null,
            phone: $request->phone,
            type: $request->type,
            status: isset($request->status),
            company_id: $request->company_id,
            branch_id: $request->branch_id,
            department_id: $request->department_id,
            notes: $request->notes,
            city_id: $request->city_id,
            area_id: $request->area_id,
            address: $request->address,
            permissions: $request->permissions,
            service_location_ids: $request->service_location_ids,
            role: $request->role,
            profile_image: $request->profile_image,
            office_id: $request->office_id,
        );
    }


    /**
     * @param array $data
     * @return $this
     */
    public static function fromArray(array $data): UserDTO
    {
        return new self(
            name: Arr::get($data, 'name'),
            email: Arr::get($data, 'email'),
            password: Arr::get($data, 'password'),
            phone: Arr::get($data, 'phone'),
            type: Arr::get($data, 'type'),
            status: Arr::get($data, 'status'),
            company_id: Arr::get($data, 'company_id'),
            branch_id: Arr::get($data, 'branch_id'),
            department_id: Arr::get($data, 'department_id'),
            notes: Arr::get($data, 'notes'),
            city_id: Arr::get($data, 'city_id'),
            area_id: Arr::get($data, 'area_id'),
            address: Arr::get($data, 'address'),
            permissions: Arr::get($data, 'permissions'),
            service_location_ids: Arr::get($data, 'service_location_ids'),
            role: Arr::get($data, 'role'),
            profile_image: Arr::get($data, 'profile_image'),
            office_id: Arr::get($data, 'office_id'),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'type' => $this->type,
            'status' => $this->status,
            'company_id' => $this->company_id,
            'branch_id' => $this->branch_id,
            'department_id' => $this->department_id,
            'notes' => $this->notes,
            'city_id' => $this->city_id,
            'area_id' => $this->area_id,
            'address' => $this->address,
            'permissions' => $this->permissions,
            'role' => $this->role,
            'profile_image' => $this->profile_image,
            'service_location_ids' => $this->service_location_ids,
            'head_offices_id' => $this->office_id,
        ];
    }
}
