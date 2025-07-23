
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SignupForm } from "./components/auth/SignupForm";
import { ComprehensiveDashboardLayout } from "./components/layout/ComprehensiveDashboardLayout";
import { EnhancedSuperAdminDashboard } from "./pages/superadmin/EnhancedSuperAdminDashboard";
import { PackagesPage } from "./pages/superadmin/PackagesPage";
import { ClientsPage } from "./pages/superadmin/ClientsPage";
import { ClientProfilePage } from "./pages/superadmin/ClientProfilePage";
import { SubscriptionsPage } from "./pages/superadmin/SubscriptionsPage";
import { ActivationCodesPage } from "./pages/superadmin/ActivationCodesPage";
import { DiscountCodesPage } from "./pages/superadmin/DiscountCodesPage";
import { BillingLogsPage } from "./pages/superadmin/BillingLogsPage";
import { SystemSettingsPage } from "./pages/superadmin/SystemSettingsPage";
import { EnhancedModernAdminDashboard } from "./pages/admin/EnhancedModernAdminDashboard";
import { ModernAdminDashboard } from "./pages/admin/ModernAdminDashboard";
import { TeamLeaderDashboard } from "./pages/admin/TeamLeaderDashboard";
import { SalesAgentDashboard } from "./pages/admin/SalesAgentDashboard";
import { LeadsPage } from "./pages/admin/LeadsPage";
import { ContactsPage } from "./pages/admin/ContactsPage";
import { OpportunitiesPage } from "./pages/admin/OpportunitiesPage";
import { SettingsPage } from "./pages/admin/settings/SettingsPage";
import NotFound from "./pages/NotFound";
import { UsersManagementPage } from "./pages/superadmin/UsersManagementPage";
import { AuthPage } from "./pages/AuthPage";
import { LeadsImportPage } from './pages/admin/LeadsImportPage';
import DealsPage from "./pages/admin/DealsPage";
import TasksPage from "./pages/admin/TasksPage";
import ImportExportPage from "./pages/admin/ImportExportPage";
import CalendarPage from "./pages/admin/CalendarPage";
import { InboxPage } from "./pages/admin/InboxPage";
import { CallLogsPage } from "./pages/admin/CallLogsPage";
import AdsAIPage from "./pages/admin/AdsAIPage";
import AutomationPage from "./pages/admin/AutomationPage";
import { FormsPage } from "./pages/admin/settings/FormsPage";
import { FormPublicPage } from "./components/forms/FormPublicPage";
import { AIAssistantPage } from "./pages/admin/AIAssistantPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { NotificationsPage } from "./pages/admin/NotificationsPage";
import { PRSRPage } from "./pages/admin/PRSRPage";
import Index from "./pages/Index";

// Website Pages
import { WebsiteLayout } from "./components/website/WebsiteLayout";
import { HomePage } from "./pages/website/HomePage";
import { FeaturesPage } from "./pages/website/FeaturesPage";
import { PricingPage } from "./pages/website/PricingPage";
import { AboutPage } from "./pages/website/AboutPage";


// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <Routes>
                {/* Root route */}
                <Route path="/" element={<Index />} />
                
                {/* Auth route */}
                <Route path="/auth" element={<AuthPage />} />

                {/* Website Routes */}
                <Route path="/website/*" element={
                  <WebsiteLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      
                    </Routes>
                  </WebsiteLayout>
                } />
                
                {/* Public Routes */}
                <Route path="/signup" element={<SignupForm onSuccess={() => {}} />} />
                <Route path="/forms/:formId" element={<FormPublicPage />} />
                
                {/* Super Admin Routes */}
                <Route path="/super-admin/*" element={
                  <ProtectedRoute requiredRole="super-admin">
                    <ComprehensiveDashboardLayout>
                      <Routes>
                        <Route path="/" element={<EnhancedSuperAdminDashboard />} />
                        <Route path="/packages" element={<PackagesPage />} />
                        <Route path="/clients" element={<ClientsPage />} />
                        <Route path="/clients/:clientId" element={<ClientProfilePage />} />
                        <Route path="/subscriptions" element={<SubscriptionsPage />} />
                        <Route path="/activation-codes" element={<ActivationCodesPage />} />
                        <Route path="/discount-codes" element={<DiscountCodesPage />} />
                        <Route path="/billing" element={<BillingLogsPage />} />
                        <Route path="/users" element={<UsersManagementPage />} />
                        <Route path="/settings" element={<SystemSettingsPage />} />
                      </Routes>
                    </ComprehensiveDashboardLayout>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ComprehensiveDashboardLayout>
                        <Routes>
                          <Route index element={<ModernAdminDashboard />} />
                          <Route path="team-leader" element={<TeamLeaderDashboard />} />
                          <Route path="sales-agent" element={<SalesAgentDashboard />} />
                          <Route path="leads" element={<LeadsPage />} />
                          <Route path="leads/import" element={<LeadsImportPage />} />
                          <Route path="contacts" element={<ContactsPage />} />
                          <Route path="opportunities" element={<OpportunitiesPage />} />
                          <Route path="deals" element={<DealsPage />} />
                          <Route path="tasks" element={<TasksPage />} />
                          <Route path="import-export" element={<ImportExportPage />} />
                          <Route path="calendar" element={<CalendarPage />} />
                          <Route path="inbox" element={<InboxPage />} />
                          <Route path="calls" element={<CallLogsPage />} />
                          <Route path="ads-ai/*" element={<AdsAIPage />} />
                          <Route path="automation" element={<AutomationPage />} />
                          <Route path="forms" element={<FormsPage />} />
                          <Route path="ai-assistant" element={<AIAssistantPage />} />
                          <Route path="reports" element={<ReportsPage />} />
                          <Route path="notifications" element={<NotificationsPage />} />
                          <Route path="pr-sr" element={<PRSRPage />} />
                          <Route path="settings/*" element={<SettingsPage />} />
                        </Routes>
                      </ComprehensiveDashboardLayout>
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
