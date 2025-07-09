import React, { useState } from 'react';
import { Menu, X, Home, Building, LayoutDashboard, DollarSign, BarChart2, Target, Users, FileText, Grid2x2, Shirt, Star, Rocket, Activity } from 'lucide-react';
import { Link } from 'wouter';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Navigation items with categories and submenus - following FOMSC order:
// Finance, Operations, Marketing, Sales, Customer
const navigationItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: Home 
  },
  {
    name: "Founder's Hub",
    path: '/founders-hub',
    icon: Star,
    badge: 'New'
  },
  {
    name: 'Product R&D',
    path: '/product-rnd',
    icon: Rocket,
    badge: 'New'
  },
  {
    name: 'Team Pulse',
    path: '/team-pulse',
    icon: Activity,
    badge: 'New'
  },
  { 
    name: 'Business Entities', 
    path: '/entity-dashboards', 
    icon: Building,
    submenu: [
      { name: 'Digital Merch Pros', path: '/entity-dashboards?entity=dmp' },
      { name: 'Mystery Hype', path: '/entity-dashboards?entity=mystery-hype' },
      { name: 'Lone Star Custom Clothing', path: '/entity-dashboards?entity=lone-star' },
      { name: 'Alcoeaze', path: '/entity-dashboards?entity=alcoeaze' },
      { name: 'Hide Cafe Bar', path: '/entity-dashboards?entity=hide-cafe' },
    ]
  },
  { 
    name: 'Finance', 
    path: '/financial-overview', 
    icon: DollarSign,
    submenu: [
      { name: 'Financial Overview', path: '/financial-overview' },
      { name: 'Business Valuation', path: '/business-valuation', badge: 'New' },
    ]
  },
  { 
    name: 'Operations', 
    path: '/operations-dashboard', 
    icon: LayoutDashboard,
    submenu: [
      { name: 'Operations Dashboard', path: '/operations-dashboard' },
      { name: 'Standard Operating Procedures', path: '/generate-sop' },
      { name: 'Tool Management', path: '/tool-management' },
      { name: 'Automation Score 2.0', path: '/automation-score', badge: 'New' },
      { name: 'Project Management', path: '/projects', badge: 'New' },
      { name: 'VA Command Center', path: '/va-center', badge: 'New' },
      { name: 'Weekly Digest', path: '/weekly-digest', badge: 'New' },
      { name: 'Launch Library', path: '/launch-templates', badge: 'New' },
    ]
  },
  { 
    name: 'Marketing', 
    path: '/campaigns', 
    icon: Target,
    submenu: [
      { name: 'Campaigns', path: '/campaigns' },
      { name: 'Marketing Analytics', path: '/marketing-analytics', badge: 'New' },
      { name: 'Asset Library', path: '/assets' },
      { name: 'Brand Asset Hub', path: '/brand-assets', badge: 'New' },
      { name: 'Launch Library', path: '/launch-templates', badge: 'New' },
    ]
  },
  { 
    name: 'Sales', 
    path: '/sales-dashboard', 
    icon: BarChart2,
    submenu: [
      { name: 'Pipeline', path: '/sales-dashboard' },
      { name: 'Sales Metrics', path: '/sales-metrics', badge: 'New' },
      { name: 'Omni-Channel Sales', path: '/omni-channel-sales', badge: 'New' }
    ]
  },
  { 
    name: 'Customer', 
    path: '/client-management', 
    icon: Users,
    badge: '3',
    submenu: [
      { name: 'CRM', path: '/client-management' },
      { name: 'Customer Health', path: '/customer-health', badge: 'New' },
      { name: 'Support Tickets', path: '/customer-service', badge: '5' },
    ]
  },
  { 
    name: 'Strategy', 
    path: '/strategy-dashboard', 
    icon: Target,
    submenu: [
      { name: 'Strategy Dashboard', path: '/strategy-dashboard', badge: 'New' },
    ]
  },
  { 
    name: 'HR', 
    path: '/hr-dashboard', 
    icon: Users,
    badge: 'New',
    submenu: [
      { name: 'HR Dashboard', path: '/hr-dashboard' },
      { name: 'Hiring Center', path: '/hiring-center' },
      { name: 'Training Hub', path: '/training-hub' },
      { name: 'Employee Directory', path: '/employee-directory' },
    ]
  },
  { 
    name: 'Legal', 
    path: '/legal-compliance', 
    icon: FileText,
    submenu: [
      { name: 'Legal Compliance', path: '/legal-compliance' },
      { name: 'Document Center', path: '/legal-documents' },
      { name: 'Compliance Checklist', path: '/compliance-checklist' },
    ]
  },
  { 
    name: 'Partner Portal', 
    path: '/partner-portal', 
    icon: Building,
    badge: 'Premium',
    submenu: [
      { name: 'Investor View', path: '/partner-portal' },
    ]
  },
  { 
    name: 'Print on Demand', 
    path: '/print-on-demand', 
    icon: Shirt,
    badge: 'New',
    submenu: [
      { name: 'Product Catalog', path: '/print-on-demand?tab=catalog' },
      { name: 'My Store', path: '/print-on-demand?tab=store' },
      { name: 'My Designs', path: '/print-on-demand?tab=designs' },
      { name: 'Orders', path: '/print-on-demand?tab=orders' },
    ]
  },
  { 
    name: 'Agency Killer', 
    path: '/agency-killer', 
    icon: Grid2x2,
    badge: 'New',
    submenu: [
      { name: 'AI Copy Generator', path: '/agency-killer?tool=copy-generator' },
      { name: 'SEO Toolkit', path: '/agency-killer?tool=seo-toolkit' },
      { name: 'Ad Campaign Builder', path: '/agency-killer?tool=ad-campaign-builder' },
      { name: 'Marketing Funnel Builder', path: '/agency-killer?tool=funnel-builder' },
      { name: 'Performance Simulator', path: '/agency-killer?tool=performance-simulator' },
    ]
  },
  { 
    name: 'Intelligence', 
    path: '/personalization', 
    icon: Target,
    badge: 'New',
    submenu: [
      { name: 'Personalization', path: '/personalization' },
      { name: 'Smart Recommendations', path: '/recommendations' },
      { name: 'Predictive Insights', path: '/predictive-insights' },
      { name: 'Intelligence Settings', path: '/intelligence-settings' },
    ]
  },
];

/**
 * A mobile menu button fixed to the top left corner of the screen
 * This component uses direct DOM/CSS styling to ensure maximum visibility on all devices
 */
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  // Toggle expanded state for an item
  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  return (
    <>
      {/* Fixed position button - always visible */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0284c7', // Sky blue color
          border: '3px solid white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={32} color="white" />
      </div>

      {/* Sheet component for navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-full max-w-[350px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">DMPHQ Navigation</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <Separator className="my-3" />
          
          <nav className="space-y-1 mt-4">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedItems[index];
              
              return (
                <div key={index} className="py-1">
                  <div 
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                    onClick={() => hasSubmenu ? toggleExpanded(index) : null}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      <Link href={hasSubmenu ? '#' : item.path}>
                        <span className="cursor-pointer">{item.name}</span>
                      </Link>
                    </div>
                    
                    <div className="flex items-center">
                      {item.badge && (
                        <Badge variant={item.badge === 'Premium' ? 'outline' : 'default'} className="ml-2">
                          {item.badge}
                        </Badge>
                      )}
                      
                      {hasSubmenu && (
                        <div className="ml-2 text-muted-foreground">
                          {isExpanded ? '▼' : '▶'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Submenu items */}
                  {hasSubmenu && isExpanded && (
                    <div className="pl-8 pr-3 mt-1 mb-2 space-y-1">
                      {item.submenu!.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.path}>
                          <div className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                            <span>{subItem.name}</span>
                            {subItem.badge && (
                              <Badge 
                                variant={subItem.badge === 'Premium' ? 'outline' : 'default'} 
                                className="ml-2 text-xs"
                              >
                                {subItem.badge}
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}