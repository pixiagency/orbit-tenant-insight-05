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
        $data['created_at'] = $this->created_at;
        $data['updated_at'] = $this->updated_at;
        
        // Add related lead information
        // $data['related_to'] = [
        //     'type' => $this->lead_id ? 'lead' : null,
        //     'id' => $this->lead_id,
        //     'name' => $this->leads?->first()?->name ?? null,
        // ];
        
        // Add followers information
        $data['followers'] = $this->followers->map(function ($follower) {
            return [
                'id' => $follower->id,
                'name' => $follower->name,
                'role' => $follower->roles?->first()?->name,
            ];
        });
        
        // Add reminders information
        $data['reminders'] = $this->reminders->map(function ($reminder) {
            return [
                'id' => $reminder->id,
                'name' => $reminder->name,
                'reminder_at' => $reminder->pivot->reminder_at,
                'is_sent' => $reminder->pivot->is_sent,
                'sent_at' => $reminder->pivot->sent_at,
            ];
        });
        
        return $data;
    }
} 