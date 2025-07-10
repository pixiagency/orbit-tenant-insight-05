
import React from 'react';

export const togglePackageSelection = (packageId: string, selectedPackages: string[], setSelectedPackages: (packages: string[]) => void, form: any) => {
  const currentPackages = form.getValues('packageIds') || [];
  const updatedPackages = currentPackages.includes(packageId)
    ? currentPackages.filter((id: string) => id !== packageId)
    : [...currentPackages, packageId];
  
  setSelectedPackages(updatedPackages);
  form.setValue('packageIds', updatedPackages);
};

export const toggleSourceSelection = (source: string, selectedSources: string[], setSelectedSources: (sources: string[]) => void, form: any) => {
  const currentSources = form.getValues('sources') || [];
  const updatedSources = currentSources.includes(source)
    ? currentSources.filter((s: string) => s !== source)
    : [...currentSources, source];
  
  setSelectedSources(updatedSources);
  form.setValue('sources', updatedSources);
};

export const toggleIntegrationSelection = (integration: string, selectedIntegrations: string[], setSelectedIntegrations: (integrations: string[]) => void, form: any) => {
  const currentIntegrations = form.getValues('integrations') || [];
  const updatedIntegrations = currentIntegrations.includes(integration)
    ? currentIntegrations.filter((i: string) => i !== integration)
    : [...currentIntegrations, integration];
  
  setSelectedIntegrations(updatedIntegrations);
  form.setValue('integrations', updatedIntegrations);
};

export const selectAllPackages = (packages: any[], setSelectedPackages: (packages: string[]) => void, form: any) => {
  const allPackageIds = packages.map(pkg => pkg.id);
  setSelectedPackages(allPackageIds);
  form.setValue('packageIds', allPackageIds);
};

export const deselectAllPackages = (setSelectedPackages: (packages: string[]) => void, form: any) => {
  setSelectedPackages([]);
  form.setValue('packageIds', []);
};

export const selectAllSources = (sources: string[], setSelectedSources: (sources: string[]) => void, form: any) => {
  setSelectedSources(sources);
  form.setValue('sources', sources);
};

export const deselectAllSources = (setSelectedSources: (sources: string[]) => void, form: any) => {
  setSelectedSources([]);
  form.setValue('sources', []);
};
