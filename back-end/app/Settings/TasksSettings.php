<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class TasksSettings extends Settings
{
    public bool $enable_escalation;
    public int $escalation_time_hours;

    public static function group(): string
    {
        return 'tasks_settings';
    }

    public static function defaults(): array
    {
        return [
            'enable_escalation' => true,
            'escalation_time_hours' => 24,
        ];
    }
}