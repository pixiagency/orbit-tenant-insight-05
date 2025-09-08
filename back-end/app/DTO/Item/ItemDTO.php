<?php

namespace App\DTO\Item;

use App\DTO\BaseDTO;
use Illuminate\Support\Arr;

class ItemDTO extends BaseDTO
{

    /**
     * @param string $name,
     * @param string $description,
     * @param float $price,
     * @param string $duration,
     * @param string $sku,
     * @param int $category_id,
     */
    public function __construct(
        protected string $name,
        protected ?string $description,
        protected ?string $sku,
        protected int $category_id,
        protected float $price,
        protected ?string $duration,
    ) {}

    public static function fromRequest($request): BaseDTO
    {
        return new self(
            name: $request->name,
            description: $request->description,
            price: $request->price,
            duration: $request->duration,
            sku: $request->sku,
            category_id: $request->category_id,
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
            description: Arr::get($data, 'description'),
            price: Arr::get($data, 'price'),
            duration: Arr::get($data, 'duration'),
            sku: Arr::get($data, 'sku'),
            category_id: Arr::get($data, 'category_id'),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'duration' => $this->duration,
            'sku' => $this->sku,
            'category_id' => $this->category_id
        ];
    }
}
