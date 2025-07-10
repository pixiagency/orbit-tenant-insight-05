import React, { useState } from 'react';
import { AdvancedFilters } from '../shared/AdvancedFilters';
import { clientFilterConfig } from '../shared/FilterConfigs';
import { filterClients } from '../shared/FilterUtils';
import { Client } from '../../types/superadmin';

interface ClientFiltersRefactoredProps {
  clients: Client[];
  onFilteredClientsChange: (filteredClients: Client[]) => void;
  className?: string;
}

export const ClientFiltersRefactored: React.FC<ClientFiltersRefactoredProps> = ({
  clients,
  onFilteredClientsChange,
  className = ""
}) => {
  const [filters, setFilters] = useState(clientFilterConfig.defaultFilters);

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    
    // Apply filters to clients
    const filteredClients = filterClients(clients, newFilters);
    onFilteredClientsChange(filteredClients);
  };

  return (
    <AdvancedFilters
      config={clientFilterConfig}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      title="Client Filters"
      className={className}
    />
  );
};
