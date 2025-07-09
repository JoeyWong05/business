import React from 'react';
import { Link, useLocation } from 'wouter';
import { useMenuAdaptivity } from '@/contexts/MenuAdaptivityContext';

type AdaptiveLinkProps = {
  href: string;
  name: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function AdaptiveLink({ 
  href, 
  name, 
  children, 
  className,
  onClick 
}: AdaptiveLinkProps) {
  const [location] = useLocation();
  const { trackMenuItemClick } = useMenuAdaptivity();
  
  const handleClick = () => {
    // Track the click for learning user patterns
    trackMenuItemClick(href, name);
    
    // Execute any additional onClick handlers passed as props
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

export default AdaptiveLink;