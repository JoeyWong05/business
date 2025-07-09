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
  SquareStack,
  Wrench,
  Moon,
  Sun,
  Bell,
  ChevronUp
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

export default function WorldClassSidebar({ expanded, onToggle }: WorldClassSidebarProps) {
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const { theme } = useTheme();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [compactMode, setCompactMode] = useState(false);
  
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
        { name: 'Business Setup', path: '/legal-compliance?tab=setup', emoji: '🏢' },
        { name: 'Document Library', path: '/legal-compliance?tab=documents', emoji: '📚' },
      ]
    },
    
    // Advanced Tools
    {
      name: 'Tools',
      path: '/advanced-ai',
      icon: <Settings className="h-5 w-5" />,
      emoji: '🧠',
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      section: 'tools',
      submenu: [
        { name: 'AI Assistant', path: '/advanced-ai', emoji: '🧠' },
        { name: 'Tool Management', path: '/tool-management', emoji: '🛠️' },
        { name: 'ROI Calculator', path: '/roi-calculator', emoji: '🧮' },
      ]
    },
    

  ];
  
  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );
  
  // Toggle submenu
  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  
  // Determine if we're in mobile view (for styling differences)
  const isMobileView = typeof window !== 'undefined' && 
                      window.matchMedia('(max-width: 768px)').matches && 
                      expanded;

  return (
    <div 
      className={cn(
        "bg-background h-full transition-all duration-300 ease-in-out overflow-hidden z-20",
        !isMobileView && "border-r", // Only show border on desktop
        expanded ? (isMobileView ? "w-full" : "w-64") : "w-16"
      )}
    >
      <div className={cn("py-2", isMobileView && "pb-16")}>
        <ScrollArea className={cn(
          "h-[calc(100vh-8rem)]",
          isMobileView && "h-[calc(100vh-12rem)]"
        )}>
          <div className={cn("space-y-2 px-2", expanded ? "pr-4" : "pr-2")}>
            {/* Group navigation by FOMSC business structure */}
            {['core', 'finance', 'operations', 'marketing', 'sales', 'customers', 'products', 'people', 'strategy', 'tools', 'legal'].map((section) => {
              const sectionItems = filteredNavigation.filter(item => item.section === section);
              if (sectionItems.length === 0) return null;
              
              return (
                <div key={section} className="mb-4">
                  {/* Section header - more subtle and compact */}
                  {expanded && section !== 'core' && (
                    <div className="flex items-center mb-1 mt-3 px-1">
                      <div className="h-px flex-grow bg-primary/10 mr-1" />
                      <span className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground/70 px-1">
                        {section === 'finance' && 'Finance'}
                        {section === 'operations' && 'Operations'}
                        {section === 'marketing' && 'Marketing'}
                        {section === 'sales' && 'Sales'}
                        {section === 'customers' && 'Customers'}
                        {section === 'products' && 'Products'}
                        {section === 'people' && 'People & Projects'}
                        {section === 'strategy' && 'Strategy'}
                        {section === 'tools' && 'Tools & Settings'}
                        {section === 'legal' && 'Legal & Compliance'}
                      </span>
                      <div className="h-px flex-grow bg-primary/10 ml-1" />
                    </div>
                  )}
                  
                  {/* Section items */}
                  <div className={section !== 'core' ? "ml-0" : ""}>
                    {sectionItems.map((item) => (
                      <div key={item.name} className="mb-1">
                        {item.submenu ? (
                          <Submenu
                            item={item}
                            expanded={expanded}
                            location={location}
                            isOpen={openSubmenus[item.name] || false}
                            onToggle={() => toggleSubmenu(item.name)}
                          />
                        ) : (
                          <SidebarItem
                            name={item.name}
                            path={item.path}
                            icon={item.icon}
                            isActive={location === item.path}
                            expanded={expanded}
                            badge={item.badge}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            <Separator className="my-4" />
            
            {/* Search */}
            {expanded && (
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 h-9 text-sm"
                />
              </div>
            )}
            
            {/* Settings and Help */}
            <SidebarItem
              name="Settings"
              path="/settings"
              icon={<Settings className="h-4 w-4" />}
              isActive={location === "/settings"}
              expanded={expanded}
            />
            
            <SidebarItem
              name="Help & Support"
              path="/help"
              icon={<HelpCircle className="h-4 w-4" />}
              isActive={location === "/help"}
              expanded={expanded}
            />
          </div>
        </ScrollArea>
        
        {/* Sidebar toggle and compact mode */}
        <div className={cn("px-3 pt-2 pb-4 border-t mt-4", !expanded && "flex justify-center")}>
          {expanded ? (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Compact mode</span>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
          ) : null}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggle}
            className={cn("h-8", expanded ? "w-full" : "w-10")}
          >
            {expanded ? (
              <div className="flex items-center justify-center w-full">
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </div>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}