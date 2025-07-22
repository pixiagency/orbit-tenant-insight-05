<?php

namespace App\DTO\Pipeline;

use App\DTO\BaseDTO;
use Illuminate\Support\Arr;

class PipelineDTO extends BaseDTO
{

    /**
     * @param string $name
     * @param array $stages
     */
    public function __construct(
        public string $name,
        public array $stages,
    ) {}

    public static function fromRequest($request): PipelineDTO
    {
        return new self(
            name: $request->name,
            stages: $request->stages,
        );
    }


    /**
     * @param array $data
     * @return $this
     */
    public static function fromArray(array $data): PipelineDTO
    {
        return new self(
            name: Arr::get($data, 'name'),
            stages: Arr::get($data, 'stages', []),
        );
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'stages' => $this->stages,
        ];
    }
}
