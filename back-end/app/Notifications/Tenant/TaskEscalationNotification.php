<?php

namespace App\Notifications\Tenant;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskEscalationNotification extends Notification
{
    use Queueable;

    public $task;


    /**
     * Create a new notification instance.
     */
    public function __construct($task)
    {
        $this->task = $task;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $dueDateTime = Carbon::parse($this->task->due_date . ' ' . $this->task->due_time);
        $hoursOverdue = Carbon::now()->diffInHours($dueDateTime);
        
        return (new MailMessage)
                    ->subject('Task Escalation: ' . $this->task->title)
                    ->greeting('Hello ' . $notifiable->first_name . ',')
                    ->line('This is an escalation notification for a task that is overdue.')
                    ->line('**Task Details:**')
                    ->line('• **Title:** ' . $this->task->title)
                    ->line('• **Description:** ' . $this->task->description)
                    ->line('• **Due Date:** ' . $dueDateTime->format('M d, Y \a\t g:i A'))
                    ->line('• **Hours Overdue:** ' . $hoursOverdue . ' hours')
                    ->line('• **Priority:** ' . ($this->task->priority->name ?? 'Not specified'))
                    ->line('• **Assigned To:** ' . ($this->task->assignedTo->first_name . ' ' . $this->task->assignedTo->last_name ?? 'Not assigned'))
                    ->line('Please take immediate action to complete this task.')
                    ->action('View Task', url('/tasks/' . $this->task->id))
                    ->line('Thank you for your attention to this matter.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $dueDateTime = Carbon::parse($this->task->due_date . ' ' . $this->task->due_time);
        $hoursOverdue = Carbon::now()->diffInHours($dueDateTime);
        
        return [
            'task_id' => $this->task->id,
            'task_title' => $this->task->title,
            'task_description' => $this->task->description,
            'due_date' => $dueDateTime->format('M d, Y \a\t g:i A'),
            'hours_overdue' => $hoursOverdue,
            'priority' => $this->task->priority->name ?? 'Not specified',
            'assigned_to' => $this->task->assignedTo ? 
                $this->task->assignedTo->first_name . ' ' . $this->task->assignedTo->last_name : 
                'Not assigned',
            'message' => 'Task "' . $this->task->title . '" is ' . $hoursOverdue . ' hours overdue and requires immediate attention.',
            'type' => 'task_escalation',
            'action_url' => '/tasks/' . $this->task->id
        ];
    }
}
