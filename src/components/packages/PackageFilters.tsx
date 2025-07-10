import React, { useState } from 'react';
import { AdvancedFilters } from '../shared/AdvancedFilters';
import { packageFilterConfig } from '../shared/FilterConfigs';
import { filterPackages } from '../shared/FilterUtils';
import { Package } from '../../types/packages';

interface PackageFiltersProps {
  packages: Package[];
  onFilteredPackagesChange: (filteredPackages: Package[]) => void;
  className?: string;
}

export const PackageFilters: React.FC<PackageFiltersProps> = ({
  packages,
  onFilteredPackagesChange,
  className = ""
}) => {
  const [filters, setFilters] = useState(packageFilterConfig.defaultFilters);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>(packages);

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    
    // Apply filters to packages
    const filtered = filterPackages(packages, newFilters);
    setFilteredPackages(filtered);
    onFilteredPackagesChange(filtered);
  };

  return (
    <AdvancedFilters
      config={packageFilterConfig}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      title="Package Filters"
      className={className}
      filteredCount={filteredPackages.length}
    />
  );
}; 