<?php

namespace App\Models\Tenant;

use App\Models\TaskReminder;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'task_title',
        'description',
        'task_type',
        'status',
        'priority_id',
        'due_date',
        'due_time',
        'assigned_to_id',
        'reminder_time',
        'lead_id',
        'tags',
        'Additional Notes'
    ];

    public function leads()
    {
        return $this->belongsToMany(Lead::class)->withPivot('weight');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'tasks_followers', 'task_id', 'follower_id');
    }

    /**
     * Get the reminders for the task.
     */
    public function reminders()
    {
        return $this->belongsToMany(Reminder::class, 'task_reminders')
            ->withPivot(['reminder_at', 'is_sent', 'sent_at'])
            ->withTimestamps();
    }

    /**
     * Get the task reminders pivot records.
     */
    public function taskReminders()
    {
        return $this->hasMany(TaskReminder::class);
    }

    /**
     * Add a reminder to the task.
     */
    public function addReminder(Reminder $reminder, $reminderAt = null)
    {
        $reminderAt = $reminderAt ?? $this->calculateReminderTime($reminder);
        
        return $this->reminders()->attach($reminder->id, [
            'reminder_at' => $reminderAt,
            'is_sent' => false,
        ]);
    }

    /**
     * Calculate reminder time based on task due date and reminder settings.
     */
    private function calculateReminderTime(Reminder $reminder)
    {
        if ($reminder->time_unit === 'on_time') {
            return $this->due_date . ' ' . $this->due_time;
        }

        $dueDateTime = \Carbon\Carbon::parse($this->due_date . ' ' . $this->due_time);
        
        switch ($reminder->time_unit) {
            case 'minutes':
                return $dueDateTime->subMinutes($reminder->time_value);
            case 'hours':
                return $dueDateTime->subHours($reminder->time_value);
            case 'days':
                return $dueDateTime->subDays($reminder->time_value);
            case 'weeks':
                return $dueDateTime->subWeeks($reminder->time_value);
            default:
                return $dueDateTime;
        }
    }
}
