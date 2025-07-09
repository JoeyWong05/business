import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useUserRole } from "@/contexts/UserRoleContext";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  LayoutDashboard,
  Search,
  Shield,
  FileText,
  ScrollText,
  Bookmark,
  CircleDollarSign,
  BarChart4,
  LineChart,
  BarChart2,
  TrendingUp,
  Workflow,
  BookOpen,
  Activity,
  Plug,
  Megaphone,
  Globe,
  BadgeDollarSign,
  BarChart,
  Share2,
  Users,
  Store,
  PieChart,
  Target,
  GanttChart,
  Award,
  Building,
  HelpCircle,
  Settings,
  Lock,
  Sparkles,
  Shirt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMediaQuery } from "@/hooks/use-media-query";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  submenu?: NavSubItem[];
  badge?: string | null;
  restricted?: boolean;
}

interface NavSubItem {
  name: string;
  path: string;
  badge?: string | null;
}

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  expanded: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function SidebarItem({ item, isActive, expanded, isOpen, onToggle }: SidebarItemProps) {
  // Check if any submenu item is active
  const [location] = useLocation();
  const hasActiveChild = item.submenu && item.submenu.some(subItem => location === subItem.path);
  const isActiveSection = isActive || hasActiveChild;
  
  // If no submenu, render a simple item
  if (!item.submenu) {
    return expanded ? (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-11 px-3 my-1 rounded-md transition-all",
          isActive 
            ? "bg-primary/10 font-medium text-primary border-l-4 border-primary pl-2" 
            : "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:border-l-4 hover:border-primary/40 hover:pl-2"
        )}
        asChild
      >
        <Link href={item.path} className="flex items-center">
          <div className={cn(
            "mr-2 h-5 w-5",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground"
          )}>
            {React.cloneElement(item.icon as React.ReactElement, { className: "h-[1.1rem] w-[1.1rem]" })}
          </div>
          <span className={cn(
            "flex-1 truncate text-sm font-medium",
            isActive ? "text-primary" : ""
          )}>{item.name}</span>
          {item.badge && (
            <Badge 
              variant={isActive ? "default" : "outline"}
              className={cn(
                "ml-auto text-xs py-0 px-1.5 h-5 min-w-5 font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground border-transparent" 
                  : "bg-muted/70"
              )}
            >
              {item.badge}
            </Badge>
          )}
          {item.restricted && (
            <span className="inline-flex ml-1">
              <Lock className="h-3 w-3 text-muted-foreground" />
            </span>
          )}
        </Link>
      </Button>
    ) : (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full p-0 flex justify-center h-11 my-1 rounded-md transition-all",
                isActive 
                  ? "bg-primary/10 text-primary border-l-4 border-primary" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground hover:border-l-4 hover:border-primary/40"
              )}
              asChild
            >
              <Link href={item.path} className="flex items-center justify-center relative">
                <div className={cn(
                  "h-5 w-5 flex items-center justify-center",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  {React.cloneElement(item.icon as React.ReactElement, { className: "h-[1.1rem] w-[1.1rem]" })}
                </div>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]",
                      isActive 
                        ? "bg-primary text-primary-foreground border-transparent" 
                        : "bg-muted/70 text-foreground"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            <p>{item.name}</p>
            {item.restricted && <p className="text-xs text-muted-foreground">Restricted Access</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // For items with submenu, render a collapsible section
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={onToggle}
      className={cn(
        "transition-all",
        expanded ? "w-full" : "w-12"
      )}
    >
      <CollapsibleTrigger asChild>
        {expanded ? (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-11 px-3 my-1 rounded-md transition-all",
              (isActiveSection || isOpen) 
                ? "bg-primary/10 font-medium text-primary border-l-4 border-primary pl-2" 
                : "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:border-l-4 hover:border-primary/40 hover:pl-2"
            )}
          >
            <div className="flex items-center w-full">
              <div className={cn(
                "mr-2 h-5 w-5",
                (isActiveSection || isOpen) 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}>
                {React.cloneElement(item.icon as React.ReactElement, { className: "h-[1.1rem] w-[1.1rem]" })}
              </div>
              <span className={cn(
                "flex-1 truncate text-sm font-medium",
                (isActiveSection || isOpen) ? "text-primary" : ""
              )}>
                {item.name}
              </span>
              {item.badge && (
                <Badge 
                  variant={(isActiveSection || isOpen) ? "default" : "outline"}
                  className={cn(
                    "mr-1.5 text-xs py-0 px-1.5 h-5 min-w-5 font-medium",
                    (isActiveSection || isOpen)
                      ? "bg-primary text-primary-foreground border-transparent" 
                      : "bg-muted/70"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              {item.restricted && (
                <span className="inline-flex mr-1.5">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </span>
              )}
              <div className={cn(
                "h-4 w-4 flex items-center justify-center",
                (isActiveSection || isOpen) ? "text-primary" : "text-muted-foreground"
              )}>
                {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </div>
            </div>
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full p-0 flex justify-center h-11 my-1 rounded-md transition-all",
                    (isActiveSection || isOpen)
                      ? "bg-primary/10 text-primary border-l-4 border-primary" 
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground hover:border-l-4 hover:border-primary/40"
                  )}
                >
                  <div className="relative flex items-center justify-center">
                    <div className={cn(
                      "h-5 w-5 flex items-center justify-center",
                      (isActiveSection || isOpen)
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}>
                      {React.cloneElement(item.icon as React.ReactElement, { className: "h-[1.1rem] w-[1.1rem]" })}
                    </div>
                    {item.badge && (
                      <Badge 
                        variant={(isActiveSection || isOpen) ? "default" : "outline"}
                        className={cn(
                          "absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]",
                          (isActiveSection || isOpen)
                            ? "bg-primary text-primary-foreground border-transparent" 
                            : "bg-muted/70 text-foreground"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                <p>{item.name}</p>
                {item.restricted && <p className="text-xs text-muted-foreground">Restricted Access</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CollapsibleTrigger>
      
      {expanded && (
        <CollapsibleContent className="pl-9 space-y-1 mx-1">
          {item.submenu?.map((subItem) => (
            <SubMenuItem
              key={subItem.path}
              item={subItem}
              isActive={location === subItem.path}
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

function SubMenuItem({ item, isActive }: { item: NavSubItem; isActive: boolean }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start text-sm h-9 px-2 rounded-md transition-all",
        isActive 
          ? "bg-primary/5 font-medium text-primary border-l-2 border-primary pl-2.5" 
          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground hover:border-l-2 hover:border-primary/30 hover:pl-2.5"
      )}
      asChild
    >
      <Link href={item.path} className="flex items-center">
        <ChevronRight className={cn("mr-1.5 h-3 w-3", isActive ? "text-primary" : "opacity-70")} />
        <span className={cn("flex-1 truncate", isActive ? "text-primary" : "")}>{item.name}</span>
        {item.badge && (
          <Badge 
            variant={isActive ? "default" : "outline"} 
            className={cn(
              "ml-auto h-4 text-[10px] min-w-4 px-1",
              isActive ? "bg-primary text-white" : "bg-muted/50"
            )}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

interface SaasSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function SaasSidebar({ expanded, onToggle }: SaasSidebarProps) {
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation structure based on the requirements
  const navigation: NavItem[] = [
    // Dashboard - main view
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard />,
    },
    
    // Business Entities section
    {
      name: 'Business Entities',
      path: '/entity-dashboards',
      icon: <Building />,
      submenu: [
        { name: 'Digital Merch Pros', path: '/entity-dashboards?entity=dmp' },
        { name: 'Mystery Hype', path: '/entity-dashboards?entity=mystery-hype' },
        { name: 'Lone Star Custom Clothing', path: '/entity-dashboards?entity=lone-star' },
        { name: 'Alcoeaze', path: '/entity-dashboards?entity=alcoeaze' },
        { name: 'Hide Cafe Bar', path: '/entity-dashboards?entity=hide-cafe' },
      ]
    },
    
    // Finance section
    {
      name: 'Finance',
      path: '/financial-overview',
      icon: <CircleDollarSign />,
      submenu: [
        { name: 'Financial Overview', path: '/financial-overview' },
        { name: 'Business Valuation', path: '/business-valuation', badge: 'New' },
      ]
    },
    
    // HR & Hiring section
    {
      name: 'Human Resources',
      path: '/hr-dashboard',
      icon: <Users />,
      submenu: [
        { name: 'HR Dashboard', path: '/hr-dashboard', badge: 'New' },
        { name: 'Hiring Center', path: '/hiring', badge: 'New' },
        { name: 'Freelancer Management', path: '/freelancers', badge: 'New' },
        { name: 'Onboarding', path: '/employee-onboarding' },
        { name: 'Training Hub', path: '/training-hub' },
      ]
    },
    
    // Operations section
    {
      name: 'Operations',
      path: '/operations-dashboard',
      icon: <Workflow />,
      submenu: [
        { name: 'Operations Dashboard', path: '/operations-dashboard', badge: 'New' },
        { name: 'Ops Insights', path: '/ops-insights' },
        { name: 'Standard Operating Procedures', path: '/generate-sop' },
        { name: 'Tool Management', path: '/tool-management' },
        { name: 'Project Management', path: '/projects', badge: 'New' },
        { name: 'VA Command Center', path: '/va-center', badge: 'New' },
        { name: 'Automation Score 2.0', path: '/automation-score', badge: 'New' },
        { name: 'Weekly Digest', path: '/weekly-digest', badge: 'New' },
      ]
    },
    
    // Marketing section
    {
      name: 'Marketing',
      path: '/campaigns',
      icon: <Megaphone />,
      submenu: [
        { name: 'Campaigns', path: '/campaigns' },
        { name: 'Marketing Analytics', path: '/marketing-analytics', badge: 'New' },
        { name: 'SEO Intelligence', path: '/seo-intelligence', badge: 'Pro' },
        { name: 'Email Marketing Hub', path: '/email-marketing', badge: 'New' },
        { name: 'Asset Library', path: '/assets' },
      ]
    },
    
    // Sales section
    {
      name: 'Sales',
      path: '/sales-dashboard',
      icon: <LineChart />,
      badge: '5',
      submenu: [
        { name: 'Pipeline', path: '/sales-dashboard' },
        { name: 'Sales Metrics', path: '/sales-metrics', badge: 'New' },
        { name: 'Omni-Channel Sales', path: '/omni-channel-sales', badge: 'New' },
      ]
    },
    
    // Customer section
    {
      name: 'Customer',
      path: '/client-management',
      icon: <Users />,
      badge: '3',
      submenu: [
        { name: 'CRM', path: '/client-management' },
        { name: 'Customer Health', path: '/customer-health', badge: 'New' },
        { name: 'Support Tickets', path: '/customer-service', badge: '5' },
      ]
    },
    
    // Strategy section
    {
      name: 'Strategy',
      path: '/strategy-dashboard',
      icon: <Target />,
      submenu: [
        { name: 'Strategy Dashboard', path: '/strategy-dashboard', badge: 'New' },
      ]
    },
    
    // Human Resources section
    {
      name: 'HR',
      path: '/hr-dashboard',
      icon: <Users />,
      badge: 'New',
      submenu: [
        { name: 'HR Dashboard', path: '/hr-dashboard' },
        { name: 'Hiring Center', path: '/hiring-center' },
        { name: 'Training Hub', path: '/training-hub' },
        { name: 'Employee Directory', path: '/employee-directory' },
      ]
    },
    
    // Legal & Compliance section
    {
      name: 'Legal',
      path: '/legal-compliance',
      icon: <Shield />,
      submenu: [
        { name: 'Legal Compliance', path: '/legal-compliance' },
        { name: 'Document Center', path: '/legal-documents' },
        { name: 'Compliance Checklist', path: '/compliance-checklist' },
      ]
    },
    
    // Partner/Investor Portal
    {
      name: 'Partner Portal',
      path: '/partner-portal',
      icon: <Building />,
      badge: 'Premium',
      restricted: true,
      submenu: [
        { name: 'Investor View', path: '/partner-portal' },
      ]
    },
    
    // Print on Demand Section
    {
      name: 'Print on Demand',
      path: '/print-on-demand',
      icon: <Shirt />,
      badge: 'New',
      submenu: [
        { name: 'Product Catalog', path: '/print-on-demand?tab=catalog' },
        { name: 'My Store', path: '/print-on-demand?tab=store' },
        { name: 'My Designs', path: '/print-on-demand?tab=designs' },
        { name: 'Orders', path: '/print-on-demand?tab=orders' },
      ]
    },
    
    // Agency Killer Section
    {
      name: 'Agency Killer',
      path: '/agency-killer',
      icon: <Sparkles />,
      badge: 'New',
      submenu: [
        { name: 'AI Copy Generator', path: '/agency-killer?tool=copy-generator' },
        { name: 'SEO Toolkit', path: '/agency-killer?tool=seo-toolkit' },
        { name: 'Ad Campaign Builder', path: '/agency-killer?tool=ad-campaign-builder' },
        { name: 'Marketing Funnel Builder', path: '/agency-killer?tool=funnel-builder' },
        { name: 'Performance Simulator', path: '/agency-killer?tool=performance-simulator' },
      ]
    },
    
    // Intelligence Section
    {
      name: 'Intelligence',
      path: '/personalization',
      icon: <TrendingUp />,
      badge: 'New',
      submenu: [
        { name: 'Personalization', path: '/personalization' },
        { name: 'Smart Recommendations', path: '/recommendations' },
        { name: 'Predictive Insights', path: '/predictive-insights' },
        { name: 'Intelligence Settings', path: '/intelligence-settings' },
      ]
    },
    
    // Settings and Help at the bottom
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings />,
    },
    {
      name: 'Help & Support',
      path: '/help',
      icon: <HelpCircle />,
    },
  ];
  
  // Toggle a section open/closed
  const toggleSection = (sectionName: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };
  
  // Auto-open the section that contains the current page
  useEffect(() => {
    navigation.forEach(item => {
      if (item.submenu && (location === item.path || item.submenu.some(subItem => location === subItem.path))) {
        setOpenSections(prev => ({
          ...prev,
          [item.name]: true
        }));
      }
    });
  }, [location]);
  
  // Filter navigation items based on search
  const filteredNavigation = searchQuery
    ? navigation.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submenu?.some(subItem => 
          subItem.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : navigation;

  return (
    <div 
      className={cn(
        "h-screen flex-shrink-0 border-r bg-background z-20 fixed left-0 top-0 pt-16 transition-all duration-300 ease-in-out",
        expanded ? "w-60" : "w-14",
        isMobile && "hidden" // Hide completely on mobile (will use Sheet instead)
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header with toggle button */}
        <div className="p-2 border-b">
          {expanded && (
            <div className="px-2 pb-1.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search navigation..."
                  className="pl-8 h-8 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full flex items-center justify-center h-7 rounded-md"
          >
            <ChevronLeft className={cn(
              "h-5 w-5 transition-transform",
              !expanded && "rotate-180"
            )} />
            {expanded && <span className="ml-1 text-xs font-medium">Collapse</span>}
          </Button>
        </div>
        
        {/* Scrollable navigation area */}
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-1 pb-16">
            {filteredNavigation.map((item) => (
              <SidebarItem
                key={item.path}
                item={item}
                isActive={location === item.path}
                expanded={expanded}
                isOpen={!!openSections[item.name]}
                onToggle={() => toggleSection(item.name)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}