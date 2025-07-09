import AdaptiveLink from "@/components/AdaptiveLink";
import { Link } from "wouter";
import React from "react";

/**
 * Create an adaptive navigation link that learns from user interactions
 */
export function createAdaptiveLink(
  path: string,
  name: string,
  children: React.ReactNode,
  onClick?: () => void,
  className?: string
): React.ReactElement {
  return (
    <AdaptiveLink 
      href={path} 
      name={name}
      className={className}
      onClick={onClick}
    >
      {children}
    </AdaptiveLink>
  );
}

/**
 * Create a regular navigation link without tracking
 */
export function createRegularLink(
  path: string,
  children: React.ReactNode,
  onClick?: () => void,
  className?: string
): React.ReactElement {
  return (
    <Link 
      href={path} 
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}