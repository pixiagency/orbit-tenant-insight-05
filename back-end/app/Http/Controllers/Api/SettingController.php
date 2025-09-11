<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Settings\DealsSettings;
use App\Settings\TasksSettings;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function __construct() {}

    /**
     * Handle switcher action - toggle boolean settings
     */
    public function switcher(Request $request): JsonResponse
    {

        $request->validate([
            'setting' => 'required|string',
            'group' => 'nullable|string'
        ]);

        try {
            $setting = $request->input('setting');
            $group = $request->input('group', 'tasks_settings');

            // Get the appropriate settings class based on group
            $settingsClass = $this->getSettingsClass($group);

            if (!$settingsClass) {
                return apiResponse(message: 'Invalid settings group',code:400);
            }

            // Get current setting value and toggle it
            $settings = app($settingsClass);
            $currentValue = $settings->$setting;
            $newValue = $currentValue ? false : true; // Toggle

            // Update the setting with the toggled value
            $settings->$setting = $newValue;
            $settings->save();
            $data = [
                'setting' => $setting,
                'previous_value' => $currentValue,
                'new_value' => $newValue
            ];
            return apiResponse($data, trans('app.data changed successfully'));
        } catch (\Exception $e) {
            return apiResponse(message: 'Failed to update setting value: ' . $e->getMessage(),code:500);
        }
    }

    /**
     * Handle change-value action - update any setting value
     */
    public function changeValue(Request $request): JsonResponse
    {
        $request->validate([
            'setting' => 'required|string',
            'value' => 'required',
            'group' => 'nullable|string'
        ]);

        try {
            $setting = $request->input('setting');
            $value = $request->input('value');
            $group = $request->input('group', 'tasks_settings');

            // Get the appropriate settings class based on group
            $settingsClass = $this->getSettingsClass($group);

            if (!$settingsClass) {
                return apiResponse(message: 'Invalid settings group',code:400);
            }

            // Update the setting
            $settings = app($settingsClass);
            $settings->$setting = $value;
            $settings->save();
            $data =[
                'setting' => $setting,
                'value' => $value
            ];
            return apiResponse($data, trans('app.data changed successfully'));
        } catch (\Exception $e) {
            return apiResponse(message: 'Failed to update setting value: ' . $e->getMessage(),code:500);
        }
    }

    /**
     * Get settings by group from request
     */
    public function getSettingsByGroup(Request $request): JsonResponse
    {
        $request->validate([
            'group' => 'required|string'
        ]);

        try {
            $group = $request->input('group', 'tasks_settings');

            // Get the appropriate settings class based on group
            $settingsClass = $this->getSettingsClass($group);

            if (!$settingsClass) {
                return apiResponse(message: 'Invalid settings group',code:400);
            }

            // Get all settings from the group
            $settings = app($settingsClass);
            $settingsData = $settings->toArray();
            return apiResponse($settingsData, trans('app.data displayed successfully'));
        } catch (\Exception $e) {
            return apiResponse(message: 'Failed to update setting value: ' . $e->getMessage(),code:500);

        }
    }

    /**
     * Get the appropriate settings class based on group
     */
    private function getSettingsClass(string $group): ?string
    {
        $settingsMap = [
            'tasks_settings' => TasksSettings::class,
            'deals_settings' => DealsSettings::class,
            // Add more settings groups as needed
        ];

        return $settingsMap[$group] ?? null;
    }
}
