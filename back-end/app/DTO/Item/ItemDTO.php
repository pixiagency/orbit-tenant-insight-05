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
     * @param string $quantity,
     * @param string $sku,
     * @param int $category_id,
     * @param string $type,
     * @param string $duration,
     * @param array $variants,
     */
    public function __construct(
        public string $name,
        public ?string $description,
        public float $price,
        public ?string $sku,
        public int $category_id,
        public string $type,
        public ?string $duration,
        public ?int $quantity,
        public ?array $variants,
    ) {}

    public static function fromRequest($request): BaseDTO
    {
        return new self(
            name: $request->name,
            description: $request->description,
            price: $request->price,
            sku: $request->sku,
            category_id: $request->category_id,
            type: $request->type,
            duration: $request->duration,
            quantity: $request->quantity,
            variants: $request->variants,
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
            sku: Arr::get($data, 'sku'),
            category_id: Arr::get($data, 'category_id'),
            type: Arr::get($data, 'type'),
            duration: Arr::get($data, 'duration'),
            quantity: Arr::get($data, 'quantity'),
            variants: Arr::get($data, 'variants'),
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
            'sku' => $this->sku,
            'category_id' => $this->category_id,
            'type' => $this->type,
            'duration' => $this->duration,
            'quantity' => $this->quantity,
        ];
    }
}
