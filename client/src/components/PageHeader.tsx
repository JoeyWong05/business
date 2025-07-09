import React, { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
}) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      <div className="h-px bg-border w-full" />
    </div>
  );
};

export default PageHeader;