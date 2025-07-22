<?php

namespace App\DTO\Contact;

use App\DTO\BaseDTO;
use Illuminate\Support\Arr;

class ContactDTO extends BaseDTO
{
    public function __construct(
        public string $name,
        public string $phone,
        public string $email,
        public string $address,
        public ?int $city_id = null,
        public int $resource_id
    ) {}

    public static function fromRequest($request): BaseDTO
    {
        return new self(
            name: $request->input('name'),
            phone: $request->input('phone'),
            email: $request->input('email'),
            address: $request->input('address'),
            city_id: $request->input('city_id'),
            resource_id: $request->input('resource_id')
        );
    }


    /**
     * @param array $data
     * @return $this
     */
    public static function fromArray(array $data): BaseDTO
    {
        return new self(
            name: Arr::get($data, 'name'),
            phone: Arr::get($data, 'phone'),
            email: Arr::get($data, 'email'),
            address: Arr::get($data, 'address'),
            city_id: Arr::get($data, 'city_id'),
            resource_id: Arr::get($data, 'resource_id'),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'city_id' => $this->city_id,
            'resource_id' => $this->resource_id,
        ];
    }
}
