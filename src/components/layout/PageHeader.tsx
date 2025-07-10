import React from 'react';
import { ChevronRight, Plus, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  showExportButton?: boolean;
  onExportClick?: () => void;
  showImportButton?: boolean;
  onImportClick?: () => void;
  badge?: string;
  description?: string;
  children?: React.ReactNode;
  additionalActions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs = [],
  showAddButton = true,
  addButtonText = 'Add New',
  onAddClick,
  showExportButton = false,
  onExportClick,
  showImportButton = false,
  onImportClick,
  badge,
  description,
  children,
  additionalActions,
}) => {
  const { isRTL, translate } = useLanguage();
  return (
    <div
      className={`bg-white border-b border-gray-200 px-4 sm:px-6 py-4 ${isRTL ? 'text-end' : 'text-start'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className={`flex items-center mb-2 overflow-x-auto text-sm text-gray-500 ${isRTL ? 'flex-row-reverse space-x-reverse space-x-1' : 'space-x-1'}`}>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <ChevronRight className={`h-3 w-3 mx-1 ${isRTL ? 'rotate-180' : ''}`} />
              )}
              {item.href ? (
                <a href={item.href} className="hover:text-gray-700">
                  {translate(item.label)}
                </a>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                  {translate(item.label)}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
        {/* Actions (RTL: right, LTR: left) */}
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${isRTL ? 'sm:flex-row-reverse order-2 lg:order-1' : 'order-2 lg:order-2'}`}>
          {showAddButton && (
            <Button size="default" onClick={onAddClick} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
              <Plus className="h-6 w-4 mr-2" />
              {translate(addButtonText)}
            </Button>
          )}
          {showExportButton && (
            <Button variant="outline" size="sm" onClick={onExportClick} className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{translate('Export')}</span>
            </Button>
          )}
          {showImportButton && (
            <Button variant="outline" size="sm" onClick={onImportClick} className="flex-1 sm:flex-none">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{translate('Import')}</span>
            </Button>
          )}
          {additionalActions && additionalActions}
          {children && (
            <div className="flex items-center gap-2">
              {children}
            </div>
          )}
        </div>

        {/* Title, Badge, Description (RTL: left, LTR: right) */}
        <div className={`flex-1 min-w-0 ${isRTL ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}`}>
          <div className={`flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 ${isRTL ? 'sm:flex-row-reverse sm:space-x-reverse' : ''}`}>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{translate(title)}</h1>
            {badge && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 w-fit">
                {translate(badge)}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-gray-600 mt-1 text-sm sm:text-base">{translate(description)}</p>
          )}
        </div>
      </div>
    </div>
  );
};
