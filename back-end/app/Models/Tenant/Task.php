<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['task_title', 'description', 'task_type', 'status', 'priority', 'due_date', 'due_time', 'assigned_to_id', 'reminder_time', 'lead_id', 'tags', 'Additional Notes'];

    public function leads()
    {
        return $this->belongsToMany(Lead::class)->withPivot('weight');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'tasks_followers', 'task_id', 'follower_id');
    }
}
