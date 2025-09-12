<?php

namespace App\Services\Tenant\Tasks;

use App\Models\Tenant\Reminder;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class ReminderService
{

    public function __construct(
        public Reminder $model,
    ) {}

    public function getModel(): Reminder
    {
        return $this->model;
    }

    public function getAll(array $filters = [])
    {
        return $this->queryGet($filters)->get();
    }

    public function getTableName(): string
    {
        return $this->getModel()->getTable();
    }

    public function listing(array $filters = [], array $withRelations = [], $perPage = 5): \Illuminate\Contracts\Pagination\CursorPaginator
    {
        return $this->queryGet(filters: $filters, withRelations: $withRelations)->cursorPaginate($perPage);
    }

    public function queryGet(array $filters = [], array $withRelations = []): Builder
    {
        $data = $this->model->with($withRelations)->ordered();
        return $data;
    }


    /**
     * Get reminder by ID
     */
    public function getReminderById(int $id): ?Reminder
    {
        return Reminder::find($id);
    }

    /**
     * Calculate reminder time for a given task due date
     */
    public function calculateReminderTime(Carbon $taskDueDate, Reminder $reminder): Carbon
    {
        if ($reminder->time_unit === 'on_time') {
            return $taskDueDate;
        }

        return $taskDueDate->subMinutes($reminder->total_minutes);
    }

    /**
     * Get reminders that should be triggered for tasks due within a specific time range
     */
    public function getRemindersForTimeRange(Carbon $startTime, Carbon $endTime)
    {
        $reminders = $this->getAll();
        $applicableReminders = [];

        foreach ($reminders as $reminder) {
            if ($reminder->time_unit === 'on_time') {
                // For "on time" reminders, check if current time is within the range
                if ($startTime->lte(now()) && $endTime->gte(now())) {
                    $applicableReminders[] = $reminder;
                }
            } else {
                // For other reminders, check if the reminder time falls within the range
                $reminderTime = now()->addMinutes($reminder->total_minutes);
                if ($reminderTime->between($startTime, $endTime)) {
                    $applicableReminders[] = $reminder;
                }
            }
        }

        return $applicableReminders;
    }

    /**
     * Get tasks that need reminders based on reminder settings
     */
    public function getTasksForReminder(Reminder $reminder)
    {
        // This method should be implemented based on your Task model structure
        // For now, returning empty collection as placeholder
        return collect();
    }

    /**
     * Send reminder notification
     */
    public function sendReminderNotification($task, Reminder $reminder)
    {
        // This method should implement the actual notification logic
        // Could send email, push notification, SMS, etc.
        // For now, just logging as placeholder
        \Log::info("Sending reminder for task {$task->id} with reminder: {$reminder->display_name}");
    }

    /**
     * Process all pending reminders
     */
    public function processPendingReminders()
    {
        $now = now();
        $nextHour = $now->copy()->addHour();
        
        $reminders = $this->getRemindersForTimeRange($now, $nextHour);
        
        foreach ($reminders as $reminder) {
            $tasks = $this->getTasksForReminder($reminder);
            
            foreach ($tasks as $task) {
                $this->sendReminderNotification($task, $reminder);
            }
        }
    }

    /**
     * Get reminder statistics for dashboard
     */
    public function getReminderStats()
    {
        return [
            'total_reminders' => Reminder::count(),
            'reminders_by_unit' => Reminder::selectRaw('time_unit, COUNT(*) as count')
                ->groupBy('time_unit')
                ->get()
                ->pluck('count', 'time_unit')
                ->toArray(),
        ];
    }
}