<?php

namespace App\Http\Resources\Tenant\Tasks;

use Illuminate\Http\Request;

class TaskShowResource extends TaskResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        
        // Add remaining fields for show resource
        $data['task_type_id'] = $this->task_type_id;
        $data['tags'] = $this->tags;
        $data['additional_notes'] = $this->additional_notes;
        
        // Add related lead information
        // $data['related_to'] = [
        //     'type' => $this->lead_id ? 'lead' : null,
        //     'id' => $this->lead_id,
        //     'name' => $this->leads?->first()?->name ?? null,
        // ];
        
        // Add followers information
        $data['followers'] = $this->followers->pluck('id');
        
        // Add reminders information
        $data['reminders'] = $this->reminders->pluck('id');
        
        return $data;
    }
} 