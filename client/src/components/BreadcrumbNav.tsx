import React from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export default function BreadcrumbNav() {
  const [location] = useLocation();
  
  // Return nothing on home page
  if (location === '/') {
    return null;
  }
  
  // Generate breadcrumb items based on current location
  const breadcrumbs = getBreadcrumbsFromPath(location);
  
  return (
    <div className="bg-background border-b py-2 px-4 md:px-6">
      <nav className="flex items-center overflow-x-auto pb-1 md:pb-0" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 md:space-x-2 flex-nowrap min-w-0">
          <li className="flex items-center">
            <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={`group-${item.href}-${index}`}>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </li>
              <li className="min-w-0">
                {item.isActive ? (
                  <span className="truncate text-foreground font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href}
                    className={cn(
                      "truncate hover:text-foreground inline-flex items-center",
                      "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
}

function getBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean);
  
  // Map of URL segments to more human-readable names
  const segmentLabels: Record<string, string> = {
    // Finance
    'financial-health': 'Financial Health',
    'business-valuation': 'Business Valuation',
    'business-forecast': 'Financial Forecast',
    'profit-loss': 'Profit & Loss',
    
    // Operations
    'department-automation': 'Automation Score',
    'generate-sop': 'SOP Library',
    'activity-log': 'Activity Log',
    'integrations': 'Integrations',
    
    // Marketing
    'campaigns': 'Campaigns',
    'seo-intelligence': 'SEO Intelligence',
    'advertising': 'Advertising',
    'social-media': 'Social Media',
    
    // Sales
    'sales-dashboard': 'Sales Dashboard',
    'omni-channel-sales': 'Omni-Channel Sales',
    'sales-funnel': 'Sales Funnel',
    'orders': 'Orders',
    
    // Customer
    'client-management': 'Client Management',
    'customer-segments': 'Customer Segments',
    'customer-feedback': 'Customer Feedback',
    'customer-service': 'Support Tickets',
    
    // Legal
    'legal-compliance': 'Legal Compliance',
    'legal-documents': 'Document Center',
    'compliance-checklist': 'Compliance Checklist',
    'trademarks': 'Trademarks & Licensing',
    
    // Strategy
    'business-strategy': 'Business Strategy',
    'north-star-metrics': 'North Star Metrics',
    'growth-tracker': 'Growth Tracker',
    'weekly-digest': 'Weekly Digest',
    
    // Partner Portal
    'partner-portal': 'Partner Portal',
    'partner-documents': 'Partner Documents',
    
    // Others
    'settings': 'Settings',
    'help': 'Help & Support',
  };
  
  // Handle parent paths for certain sections
  const parentPaths: Record<string, string> = {
    // Finance
    'business-valuation': 'finance',
    'business-forecast': 'finance',
    'profit-loss': 'finance',
    'financial-health': 'finance',
    
    // Operations
    'department-automation': 'operations',
    'generate-sop': 'operations',
    'activity-log': 'operations',
    'integrations': 'operations',
    
    // Marketing
    'campaigns': 'marketing',
    'seo-intelligence': 'marketing',
    'advertising': 'marketing',
    'social-media': 'marketing',
    
    // Sales
    'sales-dashboard': 'sales',
    'omni-channel-sales': 'sales',
    'sales-funnel': 'sales',
    'orders': 'sales',
    
    // Customer
    'client-management': 'customer',
    'customer-segments': 'customer',
    'customer-feedback': 'customer',
    'customer-service': 'customer',
    
    // Legal
    'legal-compliance': 'legal',
    'legal-documents': 'legal',
    'compliance-checklist': 'legal',
    'trademarks': 'legal',
    
    // Strategy
    'business-strategy': 'strategy',
    'north-star-metrics': 'strategy',
    'growth-tracker': 'strategy',
    'weekly-digest': 'strategy',
    
    // Partner Portal
    'partner-portal': 'partner',
    'partner-documents': 'partner',
  };
  
  // Parent section labels
  const parentLabels: Record<string, string> = {
    'finance': 'Finance',
    'operations': 'Operations',
    'marketing': 'Marketing',
    'sales': 'Sales',
    'customer': 'Customer',
    'legal': 'Legal',
    'strategy': 'Strategy',
    'partner': 'Partner Portal',
  };
  
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Handle special case: If the path is just a parent section
  if (segments.length === 1 && Object.values(parentLabels).includes(segmentLabels[segments[0]])) {
    return [
      {
        label: segmentLabels[segments[0]] || formatLabel(segments[0]),
        href: `/${segments[0]}`,
        isActive: true,
      },
    ];
  }
  
  // For pages with potential parent sections
  if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];
    const parentPath = parentPaths[lastSegment];
    
    // Add parent section if applicable
    if (parentPath) {
      breadcrumbs.push({
        label: parentLabels[parentPath] || formatLabel(parentPath),
        href: `/${parentPath}`,
      });
    }
    
    // Add current page
    breadcrumbs.push({
      label: segmentLabels[lastSegment] || formatLabel(lastSegment),
      href: `/${lastSegment}`,
      isActive: true,
    });
  }
  
  return breadcrumbs;
}

function formatLabel(segment: string): string {
  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}