<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('tasks_settings.enable_escalation', true);
        $this->migrator->add('tasks_settings.escalation_time_hours', 24);
    }
};
