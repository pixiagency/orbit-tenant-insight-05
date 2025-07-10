import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GeneralSettingsPage } from './GeneralSettingsPage';
import { UserRoleManagementPage } from './UserRoleManagementPage';
import { TeamsManagementPage } from './TeamsManagementPage';
import { CustomFieldsPage } from './CustomFieldsPage';
import { PipelinesPage } from './PipelinesPage';
import { ClockInOutPage } from './ClockInOutPage';
import { IntegrationsPage } from './IntegrationsPage';
import { NotificationsPage } from './NotificationsPage';
import { AutomationPage } from './AutomationPage';
import { FormsPage } from './FormsPage';
import { ReportingAIPage } from './ReportingAIPage';
import { AIModulePage } from './AIModulePage';
import { CallLogsSettingsPage } from './CallLogsSettingsPage';

export const SettingsPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/settings/general" replace />} />
        <Route path="/general" element={<GeneralSettingsPage />} />
        <Route path="/users" element={<UserRoleManagementPage />} />
        <Route path="/teams" element={<TeamsManagementPage />} />
        <Route path="/fields" element={<CustomFieldsPage />} />
        <Route path="/pipelines" element={<PipelinesPage />} />
        <Route path="/clock" element={<ClockInOutPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/automation" element={<AutomationPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/ai-module" element={<AIModulePage />} />
        <Route path="/reporting" element={<ReportingAIPage />} />
        <Route path="/calls" element={<CallLogsSettingsPage />} />
      </Routes>
    </div>
  );
};
