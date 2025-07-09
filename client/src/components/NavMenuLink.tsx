import React from "react";
import AdaptiveLink from "@/components/AdaptiveLink";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavMenuLinkProps {
  path: string;
  name: string;
  icon?: React.ReactNode;
  badge?: string | null;
  isActive?: boolean;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  adaptive?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * NavMenuLink component for navigation that can optionally adapt to user patterns
 */
export default function NavMenuLink({
  path,
  name,
  icon,
  badge,
  isActive,
  variant = "ghost",
  adaptive = true, // Default to adaptive
  onClick,
  className,
  size = "default"
}: NavMenuLinkProps) {
  const [location] = useLocation();
  const active = isActive !== undefined ? isActive : location === path;
  
  // The actual button content
  const buttonContent = (
    <Button
      variant={active ? "default" : variant}
      className={cn("w-full justify-start gap-2", className)}
      size={size}
    >
      <div className="flex items-center gap-2 flex-1">
        {icon && <div className="bg-primary/10 p-1.5 rounded-md">{icon}</div>}
        <span className="font-medium">{name}</span>
      </div>
      {badge && (
        <Badge variant="secondary" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Button>
  );
  
  // Choose whether to use adaptive tracking or standard link based on prop
  if (adaptive) {
    return (
      <AdaptiveLink href={path} name={name} onClick={onClick}>
        {buttonContent}
      </AdaptiveLink>
    );
  }
  
  return (
    <Link href={path} onClick={onClick}>
      {buttonContent}
    </Link>
  );
}