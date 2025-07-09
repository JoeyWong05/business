import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useUserRole } from "@/contexts/UserRoleContext";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Building,
  LayoutDashboard,
  PieChart,
  DollarSign,
  BarChart2,
  Target,
  Users,
  Cpu,
  Crosshair,
  Settings,
  Scale,
  Zap,
  UserPlus,
  Heart,
  HelpCircle,
  LogOut,
  CreditCard,
  FileText,
  PanelRightOpen,
  CalendarDays,
  BarChartHorizontal,
  ShoppingCart,
  CircleDollarSign,
  BarChart,
  LineChart,
  UserCircle,
  ShoppingBag,
  Network,
  GraduationCap,
  Briefcase,
  ClipboardList,
  Search,
  Search as SearchIcon,
  ScrollText,
  Globe,
  Megaphone,
  Mail,
  PieChart as PieChartIcon,
  BookOpen,
  Rocket,
  Star,
  SquareStack,
  Wrench,
  Moon,
  Sun,
  Bell,
  ChevronUp,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

interface SidebarItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  isActive: boolean;
  expanded: boolean;
  badge?: string | null;
  onClick?: () => void;
}

function SidebarItem({ name, path, icon, isActive, expanded, badge, onClick }: SidebarItemProps) {
  return expanded ? (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-12 px-3 mb-2 rounded-md transition-all",
        isActive 
          ? "bg-primary/10 font-medium text-primary border-l-4 border-primary" 
          : "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:border-l-4 hover:border-primary/40"
      )}
      asChild
      onClick={onClick}
    >
      <Link href={path} className="flex items-center">
        <div className={cn(
          "mr-3 h-7 w-7 rounded-md flex items-center justify-center",
          isActive 
            ? "text-primary" 
            : "text-muted-foreground"
        )}>
          {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
        </div>
        <span className={cn(
          "flex-1 truncate font-medium text-base",
          isActive ? "text-primary" : ""
        )}>{name}</span>
        {badge && (
          <Badge 
            variant={isActive ? "default" : "outline"}
            className={cn(
              "ml-auto text-xs h-5 px-2 font-medium",
              isActive 
                ? "bg-primary text-white border-transparent" 
                : "bg-muted/70"
            )}
          >
            {badge}
          </Badge>
        )}
      </Link>
    </Button>
  ) : (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full p-0 flex justify-center h-12 mb-2 rounded-md transition-all",
              isActive 
                ? "bg-primary/10 text-primary border-l-4 border-primary" 
                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground hover:border-l-4 hover:border-primary/40"
            )}
            asChild
          >
            <Link href={path} className="flex items-center justify-center relative">
              <div className={cn(
                "h-7 w-7 flex items-center justify-center rounded-md",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}>
                {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
              </div>
              {badge && (
                <Badge 
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    "absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]",
                    isActive 
                      ? "bg-primary text-white border-transparent" 
                      : "bg-muted/70 text-foreground"
                  )}
                >
                  {badge}
                </Badge>
              )}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-background border border-border text-foreground">
          <p className="text-base font-medium">{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SidebarSubmenuItem({
  name,
  path,
  isActive,
  badge,
  expanded
}: {
  name: string;
  path: string;
  isActive: boolean;
  expanded: boolean;
  badge?: string;
}) {
  if (!expanded) return null;
  
  return (
    <Button
      variant="ghost"
      size="default"
      className={cn(
        "w-full justify-start text-base h-10 px-3 mb-1 rounded-md transition-all",
        isActive 
          ? "bg-primary/5 font-medium text-primary border-l-2 border-primary" 
          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground hover:border-l-2 hover:border-primary/30"
      )}
      asChild
    >
      <Link href={path} className="flex items-center">
        <ChevronRight className={cn("mr-2 h-4 w-4", isActive ? "text-primary" : "opacity-70")} />
        <span className={cn("flex-1 truncate", isActive ? "text-primary" : "")}>{name}</span>
        {badge && (
          <Badge 
            variant={isActive ? "default" : "outline"} 
            className={cn(
              "ml-auto h-5 text-[11px] min-w-5 px-1.5",
              isActive ? "bg-primary text-white" : "bg-muted/50"
            )}
          >
            {badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

interface SubmenuProps {
  item: any;
  expanded: boolean;
  location: string;
  isOpen: boolean;
  onToggle: () => void;
}

function Submenu({ item, expanded, location, isOpen, onToggle }: SubmenuProps) {
  const isActive = location === item.path;
  const hasActiveChild = item.submenu && item.submenu.some((subItem: any) => location === subItem.path);
  
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-12 px-3 mb-1 rounded-md transition-all",
            (isActive || hasActiveChild || isOpen) 
              ? "bg-primary/10 font-medium text-primary border-l-4 border-primary" 
              : "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:border-l-4 hover:border-primary/40",
            !expanded && "p-0 flex justify-center"
          )}
        >
          <div className="flex items-center w-full">
            {expanded ? (
              <>
                <div className={cn(
                  "mr-3 h-7 w-7 rounded-md flex items-center justify-center",
                  (isActive || hasActiveChild || isOpen) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}
                </div>
                <span className={cn(
                  "flex-1 truncate font-medium text-base",
                  (isActive || hasActiveChild || isOpen) ? "text-primary" : ""
                )}>
                  {item.name}
                </span>
                {item.badge && (
                  <Badge 
                    variant={(isActive || hasActiveChild || isOpen) ? "default" : "outline"} 
                    className={cn(
                      "ml-auto mr-2 text-xs h-5 px-2",
                      (isActive || hasActiveChild || isOpen)
                        ? "bg-primary text-white border-transparent" 
                        : "bg-muted/70"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                <div className={cn(
                  "h-5 w-5 flex items-center justify-center",
                  (isActive || hasActiveChild || isOpen) ? "text-primary" : "text-muted-foreground"
                )}>
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className={cn(
                  "h-7 w-7 flex items-center justify-center rounded-md",
                  (isActive || hasActiveChild || isOpen) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}
                </div>
                {item.badge && (
                  <Badge 
                    variant={(isActive || hasActiveChild || isOpen) ? "default" : "outline"} 
                    className={cn(
                      "absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]",
                      (isActive || hasActiveChild || isOpen) 
                        ? "bg-primary text-white border-transparent" 
                        : "bg-muted/70 text-foreground"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      
      {expanded && (
        <CollapsibleContent className="ml-9 space-y-1 border-l border-primary/20 pl-2">
          {item.submenu?.map((subItem: any) => (
            <SidebarSubmenuItem
              key={subItem.path}
              name={subItem.name}
              path={subItem.path}
              isActive={location === subItem.path}
              badge={subItem.badge}
              expanded={expanded}
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

interface WorldClassSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function NewWorldClassSidebar({ expanded, onToggle }: WorldClassSidebarProps) {
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const { theme } = useTheme();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  
  // Reorganized Menu Structure - Using FOMSC organization
  const navigation = [
    // Main Dashboard - Daily Starting Point
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      emoji: '📊',
      roles: ['admin', 'manager', 'employee', 'customer'],
      badge: null,
      section: 'core'
    },
    
    // Founder's Hub - Executive Overview
    {
      name: 'Founder\'s Hub',
      path: '/founders-hub',
      icon: <Star className="h-5 w-5" />,
      emoji: '✨',
      roles: ['admin', 'manager'],
      badge: 'New',
      section: 'founders'
    },
    
    // Finance - Money Management
    {
      name: 'Finance',
      path: '/financial-health',
      icon: <DollarSign className="h-5 w-5" />,
      emoji: '💰',
      roles: ['admin', 'manager'],
      badge: null,
      section: 'finance',
      submenu: [
        { name: 'Financial Health', path: '/financial-health', emoji: '📈' },
        { name: 'Cost Overview', path: '/cost-overview', emoji: '💵' },
        { name: 'Cost Analysis', path: '/cost-analysis', emoji: '🔍' },
        { name: 'Expense Tracking', path: '/expense-tracking', emoji: '📝' },
      ]
    },
    
    // Operations - Internal Management
    {
      name: 'Operations',
      path: '/business-operations',
      icon: <Cpu className="h-5 w-5" />,
      emoji: '⚙️',
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      section: 'operations',
      submenu: [
        { name: 'Business Overview', path: '/business-operations', emoji: '🔎' },
        { name: 'Automation', path: '/department-automation', emoji: '✨' },
        { name: 'SOPs', path: '/generate-sop', emoji: '📄' },
        { name: 'Password Vault', path: '/password-vault', emoji: '🔒' },
      ]
    },
    
    // Marketing - Creating Demand
    {
      name: 'Marketing',
      path: '/social-media',
      icon: <BarChart className="h-5 w-5" />,
      emoji: '📣',
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      section: 'marketing',
      submenu: [
        { name: 'Social Media', path: '/social-media', emoji: '📱' },
        { name: 'Email Marketing', path: '/email-marketing', emoji: '📧' },
        { name: 'Campaigns', path: '/campaigns', emoji: '🚀' },
        { name: 'Advertising', path: '/advertising', emoji: '📢' },
      ]
    },
    
    // Brand Assets - All visual and brand materials
    {
      name: 'Brand Assets',
      path: '/brand-assets',
      icon: <FileText className="h-5 w-5" />,
      emoji: '🖼️',
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      section: 'marketing',
    },
    
    // Sales - Revenue Generation
    {
      name: 'Sales',
      path: '/sales-dashboard',
      icon: <LineChart className="h-5 w-5" />,
      emoji: '📈',
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      section: 'sales',
      submenu: [
        { name: 'Sales Dashboard', path: '/sales-dashboard', emoji: '📊' },
        { name: 'Deals Pipeline', path: '/sales-dashboard?tab=pipeline', emoji: '🚶' },
        { name: 'Sales Forecast', path: '/sales-dashboard?tab=forecast', emoji: '🔮' },
        { name: 'Customer Inquiries', path: '/customer-inquiries', badge: '3', emoji: '💬' },
      ]
    },
    
    // Customers - Client Relationships
    {
      name: 'Customers',
      path: '/client-management',
      icon: <Heart className="h-5 w-5" />,
      emoji: '🤝',
      roles: ['admin', 'manager', 'employee', 'customer'],
      badge: '3',
      section: 'customers',
      submenu: [
        { name: 'Client Management', path: '/client-management', emoji: '👥' },
        { name: 'Support Tickets', path: '/customer-service', badge: '5', emoji: '🎫' },
        { name: 'Orders', path: '/orders', badge: '2', emoji: '🛒' },
        { name: 'WhatsApp Integration', path: '/whatsapp-settings', emoji: '📱' },
      ]
    },
    
    // Products & Inventory 
    {
      name: 'Inventory',
      path: '/inventory-management',
      icon: <ShoppingBag className="h-5 w-5" />,
      emoji: '📦',
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      section: 'products',
    },
    
    // Team & People
    {
      name: 'Team',
      path: '/team',
      icon: <Users className="h-5 w-5" />,
      emoji: '👥',
      roles: ['admin', 'manager'],
      badge: null,
      section: 'people',
      submenu: [
        { name: 'Team Members', path: '/team', emoji: '👤' },
        { name: 'Meetings', path: '/meetings', badge: '1', emoji: '🗓️' },
        { name: 'Organization Chart', path: '/organization-chart', emoji: '📊' },
        { name: 'Training Academy', path: '/academy', emoji: '🎓', badge: 'New' },
      ]
    },
    
    // Projects & Tasks - Work Management
    {
      name: 'Projects',
      path: '/project-management',
      icon: <Briefcase className="h-5 w-5" />,
      emoji: '📋',
      roles: ['admin', 'manager', 'employee'],
      badge: 'New',
      section: 'people',
    },
    
    // Team Pulse - Collaboration
    {
      name: 'Team Pulse',
      path: '/team-pulse',
      icon: <Activity className="h-5 w-5" />,
      emoji: '👥',
      roles: ['admin', 'manager', 'employee'],
      badge: 'New',
      section: 'collaboration',
    },
    
    // Business Strategy
    {
      name: 'Strategy',
      path: '/entity-dashboards',
      icon: <Building className="h-5 w-5" />,
      emoji: '🏢',
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      section: 'strategy',
      submenu: [
        { name: 'Business Entities', path: '/entity-dashboards', emoji: '🏢' },
        { name: 'Business Strategy', path: '/business-strategy', emoji: '🧭' },
        { name: 'Capacity Planning', path: '/business-strategy?tab=capacity-equation', emoji: '⚖️' },
        { name: 'Business Forecast', path: '/business-forecast', emoji: '🔮' },
        { name: 'Competition', path: '/competitors', emoji: '👁️' },
      ]
    },
    
    // Product R&D
    {
      name: 'Product R&D',
      path: '/product-rnd',
      icon: <Rocket className="h-5 w-5" />,
      emoji: '🚀',
      roles: ['admin', 'manager', 'employee'],
      badge: 'New',
      section: 'research',
    },
    
    // Legal & Compliance - Contracts, NDAs, Business Setup
    {
      name: 'Legal',
      path: '/legal-compliance',
      icon: <ScrollText className="h-5 w-5" />,
      emoji: '⚖️',
      roles: ['admin', 'manager'],
      badge: 'New',
      section: 'legal',
      submenu: [
        { name: 'Legal Dashboard', path: '/legal-compliance', emoji: '📊' },
        { name: 'Contracts', path: '/legal-compliance?tab=contracts', emoji: '📝' },
        { name: 'NDAs', path: '/legal-compliance?tab=ndas', emoji: '🤐' },
        { name: 'Business Setup', path: '/legal-compliance?tab=business-setup', emoji: '🏛️' },
      ]
    },
    
    // SEO & Web Management
    {
      name: 'SEO',
      path: '/seo-management',
      icon: <Globe className="h-5 w-5" />,
      emoji: '🔍',
      roles: ['admin', 'manager'],
      badge: 'Coming Soon',
      section: 'marketing',
    },
    
    // Intelligence & Analytics
    {
      name: 'Command Center',
      path: '/command-center',
      icon: <Zap className="h-5 w-5" />,
      emoji: '⚡',
      roles: ['admin', 'manager'],
      badge: 'New',
      section: 'intelligence'
    },
    {
      name: 'Builder Mode',
      path: '/builder-mode',
      icon: <Rocket className="h-5 w-5" />,
      emoji: '🚀',
      roles: ['admin', 'manager'],
      badge: 'New',
      section: 'intelligence'
    },
    {
      name: 'Pulse',
      path: '/pulse',
      icon: <Activity className="h-5 w-5" />,
      emoji: '📡',
      roles: ['admin', 'manager', 'employee'],
      badge: 'New',
      section: 'intelligence'
    },
    {
      name: 'Personalization',
      path: '/personalization',
      icon: <Settings className="h-5 w-5" />,
      emoji: '⚙️',
      roles: ['admin', 'manager', 'employee', 'customer'],
      badge: null,
      section: 'intelligence'
    }
  ];

  const toggleSubmenu = (path: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Check if we're on mobile/small screen
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile && expanded) {
      onToggle();
    }
  }, [isMobile, expanded, onToggle]);

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const groupedNavigation = filteredNavigation.reduce(
    (acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, typeof navigation>
  );

  const sectionLabels: Record<string, string> = {
    core: "Dashboard",
    founders: "Founder's Hub",
    finance: "Financial",
    operations: "Operations",
    marketing: "Marketing",
    sales: "Sales",
    customers: "Customers",
    products: "Products",
    people: "Team",
    strategy: "Strategy",
    research: "Product & R&D",
    legal: "Legal",
    tools: "Tools",
    settings: "Settings",
    intelligence: "Intelligence",
    collaboration: "Team Pulse",
  };

  // Company options for the selector
  const companies = [
    { id: 1, name: "Digital Merch Pros", color: "#5271FF" },
    { id: 2, name: "Mystery Hype", color: "#FF5757" },
    { id: 3, name: "Lone Star Custom", color: "#9747FF" },
    { id: 4, name: "Alcoeaze", color: "#00BA88" },
    { id: 5, name: "Hide Cafe Bars", color: "#FF8A00" },
  ];
  
  // Current selected company (in a real app, this would come from context/state)
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  
  return (
    <div className={cn(
      "h-full flex flex-col bg-background border-r border-border shadow-sm transition-all duration-300 ease-in-out",
      expanded ? "w-64" : "w-[70px]",
      "fixed left-0 top-0 bottom-0 z-40"
    )}>
      {/* Top Branding Area */}
      <div className="p-3 border-b border-border flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          {expanded ? (
            <Link href="/" className="flex items-center">
              <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="ml-2 font-bold text-lg text-foreground">DMPHQ</span>
            </Link>
          ) : (
            <Link href="/" className="w-full flex justify-center">
              <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Company Selector - Only visible when expanded */}
        {expanded && (
          <div className="flex items-center bg-muted/50 rounded-md p-2 cursor-pointer hover:bg-muted transition-colors">
            <div 
              className="h-5 w-5 rounded-sm mr-2" 
              style={{ backgroundColor: selectedCompany.color }}
            />
            <div className="flex-1 text-sm font-medium truncate">{selectedCompany.name}</div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Search - Only visible when expanded */}
      {expanded && (
        <div className="px-3 py-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-9 text-sm focus-visible:ring-primary/20 bg-muted/50"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <ScrollArea className="flex-1 overflow-auto pt-2">
        <div className="px-2 pb-4">
          {Object.entries(groupedNavigation).map(([section, items]) => (
            <div key={section} className="mb-4">
              {expanded && (
                <div className="flex items-center px-3 mb-2 mt-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {sectionLabels[section]}
                  </h4>
                  <Separator className="flex-1 ml-2" />
                </div>
              )}
              
              {/* Card Style For Expanded View */}
              {expanded ? (
                <div className="space-y-2">
                  {items.map((item) => 
                    item.submenu ? (
                      <Collapsible 
                        key={item.path}
                        open={!!openSubmenus[item.path]}
                        onOpenChange={() => toggleSubmenu(item.path)}
                        className="bg-muted/30 rounded-md overflow-hidden transition-all duration-200 border border-border/40"
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-12 px-3 rounded-none transition-all",
                              (location === item.path || !!openSubmenus[item.path])
                                ? "bg-primary/10 font-medium text-primary border-l-2 border-primary" 
                                : "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:border-l-2 hover:border-primary/40"
                            )}
                          >
                            <div className="flex items-center w-full">
                              <div className={cn(
                                "mr-3 h-7 w-7 rounded-md flex items-center justify-center",
                                (location === item.path || !!openSubmenus[item.path]) 
                                  ? "text-primary" 
                                  : "text-muted-foreground"
                              )}>
                                {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}
                              </div>
                              <span className={cn(
                                "flex-1 truncate font-medium text-base",
                                (location === item.path || !!openSubmenus[item.path]) ? "text-primary" : ""
                              )}>
                                {item.name}
                              </span>
                              {item.badge && (
                                <Badge 
                                  variant={(location === item.path || !!openSubmenus[item.path]) ? "default" : "outline"} 
                                  className={cn(
                                    "ml-auto mr-2 text-xs h-5 px-2",
                                    (location === item.path || !!openSubmenus[item.path])
                                      ? "bg-primary text-white border-transparent" 
                                      : "bg-muted/70"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              <div className={cn(
                                "h-5 w-5 flex items-center justify-center",
                                (location === item.path || !!openSubmenus[item.path]) ? "text-primary" : "text-muted-foreground"
                              )}>
                                {!!openSubmenus[item.path] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </div>
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="bg-muted/20 pl-9">
                          <div className="border-l border-primary/20 pl-2 py-1 space-y-1">
                            {item.submenu?.map((subItem: any) => (
                              <SidebarSubmenuItem
                                key={subItem.path}
                                name={subItem.name}
                                path={subItem.path}
                                isActive={location === subItem.path}
                                badge={subItem.badge}
                                expanded={expanded}
                              />
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-12 px-3 mb-1 rounded-md transition-all bg-muted/30 border border-border/40",
                          location === item.path 
                            ? "bg-primary/10 font-medium text-primary border-l-4 border-primary" 
                            : "hover:bg-muted/50 text-foreground/80 hover:text-foreground hover:border-l-4 hover:border-primary/40"
                        )}
                        asChild
                      >
                        <Link href={item.path} className="flex items-center">
                          <div className={cn(
                            "mr-3 h-7 w-7 rounded-md flex items-center justify-center",
                            location === item.path 
                              ? "text-primary" 
                              : "text-muted-foreground"
                          )}>
                            {React.cloneElement(item.icon as React.ReactElement, { className: "h-5 w-5" })}
                          </div>
                          <span className={cn(
                            "flex-1 truncate font-medium text-base",
                            location === item.path ? "text-primary" : ""
                          )}>{item.name}</span>
                          {item.badge && (
                            <Badge 
                              variant={location === item.path ? "default" : "outline"}
                              className={cn(
                                "ml-auto text-xs h-5 px-2 font-medium",
                                location === item.path 
                                  ? "bg-primary text-white border-transparent" 
                                  : "bg-muted/70"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    )
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  {items.map((item) => 
                    item.submenu ? (
                      <Submenu
                        key={item.path}
                        item={item}
                        expanded={expanded}
                        location={location}
                        isOpen={!!openSubmenus[item.path]}
                        onToggle={() => toggleSubmenu(item.path)}
                      />
                    ) : (
                      <SidebarItem
                        key={item.path}
                        name={item.name}
                        path={item.path}
                        icon={item.icon}
                        isActive={location === item.path}
                        expanded={expanded}
                        badge={item.badge}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Settings & User */}
      <div className="border-t border-border p-2 mt-auto bg-muted/20">
        <div className="space-y-2">
          {/* Theme Toggle */}
          {expanded ? (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-foreground font-medium">Dark Mode</span>
              <Switch 
                checked={theme === "dark"} 
                className="data-[state=checked]:bg-primary"
              />
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md hover:bg-muted"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          )}
          
          {/* Settings and Help */}
          <SidebarItem
            name="Settings"
            path="/settings"
            icon={<Settings className="h-5 w-5" />}
            isActive={location === "/settings"}
            expanded={expanded}
          />
          
          <SidebarItem
            name="Help & Docs"
            path="/help"
            icon={<HelpCircle className="h-5 w-5" />}
            isActive={location === "/help"}
            expanded={expanded}
          />
          
          {/* User Profile */}
          {expanded ? (
            <div className="flex items-center p-3 rounded-md bg-muted/50 mt-2 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                <UserCircle className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@dmphq.com</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-background/90">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center p-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md hover:bg-muted">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          )}
          
          {/* Notifications Badge */}
          {expanded ? (
            <div className="flex items-center p-3 rounded-md hover:bg-muted transition-colors cursor-pointer">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="ml-3 text-sm font-medium">Notifications</span>
              <Badge className="ml-auto bg-primary">5</Badge>
            </div>
          ) : (
            <div className="flex items-center justify-center p-2 relative">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md hover:bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] bg-primary">5</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}