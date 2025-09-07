<?php

namespace App\DTO\Tenant;

use App\DTO\BaseDTO;
use Illuminate\Support\Arr;

class TaskDTO extends BaseDTO
{
    public function __construct(
        public string $title,
        public ?string $description = null,
        public ?int $task_type_id = null,
        public ?string $status = null,
        public ?int $priority_id = null,
        public ?string $due_date = null,
        public ?string $due_time = null,
        public ?int $assigned_to_id = null,
        public ?int $lead_id = null,
        public ?array $tags = null,
        public ?string $additional_notes = null,
        public ?array $followers = null,
    ) {}

    public static function fromRequest($request): BaseDTO
    {
        return new self(
            title: $request->input('title'),
            description: $request->input('description'),
            task_type_id: $request->input('task_type_id'),
            status: $request->input('status'),
            priority_id: $request->input('priority_id'),
            due_date: $request->input('due_date'),
            due_time: $request->input('due_time'),
            assigned_to_id: $request->input('assigned_to_id'),
            lead_id: $request->input('lead_id'),
            tags: $request->input('tags'),
            additional_notes: $request->input('Additional Notes'),
            followers: $request->input('followers'),
        );
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'task_type_id' => $this->task_type_id,
            'status' => $this->status,
            'priority_id' => $this->priority_id,
            'due_date' => $this->due_date,
            'due_time' => $this->due_time,
            'assigned_to_id' => $this->assigned_to_id,
            'lead_id' => $this->lead_id,
            'tags' => $this->tags,
            'Additional Notes' => $this->additional_notes,
        ];
    }

    public static function fromArray(array $data): self
    {
        return new self(
            title: Arr::get($data, 'title'),
            description: Arr::get($data, 'description'),
            task_type_id: Arr::get($data, 'task_type_id'),
            status: Arr::get($data, 'status'),
            priority_id: Arr::get($data, 'priority_id'),
            due_date: Arr::get($data, 'due_date'),
            due_time: Arr::get($data, 'due_time'),
            assigned_to_id: Arr::get($data, 'assigned_to_id'),
            lead_id: Arr::get($data, 'lead_id'),
            tags: Arr::get($data, 'tags'),
            additional_notes: Arr::get($data, 'Additional Notes'),
            followers: Arr::get($data, 'followers'),
        );
    }
} 