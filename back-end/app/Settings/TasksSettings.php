<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class TasksSettings extends Settings
{
    public bool $enable_escalation;
    public int $escalation_time_hours;
    public ?array $default_notified_users;
    public int $notify_manager;

    public static function group(): string
    {
        return 'tasks_settings';
    }

    public static function defaults(): array
    {
        return [
            'enable_escalation' => true,
            'escalation_time_hours' => 24,
            'default_notified_users' => [1,2,3],
            'notify_manager' => false,
        ];
    }

}