import React from "react";
import { cn } from "@/lib/utils";

interface WorldClassPageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function WorldClassPageHeader({
  title,
  description,
  icon,
  actions,
  className,
}: WorldClassPageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start justify-between gap-3", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {actions && <div className="flex-shrink-0 flex gap-2">{actions}</div>}
    </div>
  );
}