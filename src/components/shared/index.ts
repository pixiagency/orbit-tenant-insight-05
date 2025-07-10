
// Export the main AdvancedFilters component
export { AdvancedFilters } from './AdvancedFilters';
export type { FilterConfig, FilterField, FilterOption, AdvancedFiltersProps } from './AdvancedFilters';

// Export filter configurations - corrected export names
export {
  clientFilterConfig as clientFiltersConfig,
  packageFilterConfig as packageFiltersConfig,
  subscriptionFilterConfig as subscriptionFiltersConfig,
  contactFilterConfig as contactFiltersConfig,
  userFilterConfig as userFiltersConfig,
  taskFilterConfig as taskFiltersConfig,
  dealFilterConfig as dealFiltersConfig
} from './FilterConfigs';

// Export filter utilities
export { FilterUtils, CustomFilters } from './FilterUtils';
export type { FilterUtils as FilterUtilsType } from './FilterUtils';
