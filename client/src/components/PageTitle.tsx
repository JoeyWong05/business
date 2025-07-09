import React from "react";

export interface PageTitleProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  action?: React.ReactNode; // For backward compatibility
}

export function PageTitle({ title, description, subtitle, icon, actions, action }: PageTitleProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center p-2 bg-primary/10 rounded-md text-primary">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-lg max-w-3xl">{subtitle}</p>
          )}
          {description && (
            <p className="text-muted-foreground mt-1 max-w-3xl">{description}</p>
          )}
        </div>
      </div>
      {(actions || action) && <div className="flex items-center gap-2">{actions || action}</div>}
    </div>
  );
}