<?php

namespace Database\Seeders;

use App\Settings\TasksSettings;
use Illuminate\Database\Seeder;

class TasksSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasksSettings = new TasksSettings();
        
        // Set default values
        $tasksSettings->enable_escalation = true;
        $tasksSettings->escalation_time_hours = 24;
        $tasksSettings->default_notified_users = [1,2,3];
        $tasksSettings->notify_manager = true;
        
        // Save the settings
        $tasksSettings->save();
    }
}