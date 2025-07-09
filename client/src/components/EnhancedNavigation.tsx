import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserRole } from "@/contexts/UserRoleContext";
import { 
  Building, Cpu, DollarSign, LineChart, BarChart, Settings, 
  MessageSquare, Network, Users, Calendar, FileText, ShoppingCart, 
  Target, LayoutDashboard, Megaphone, Bell, ChevronDown, 
  ChevronRight, ChevronLeft, Search, Moon, Sun, LifeBuoy, 
  LogOut, Menu, X, User, Home, FileImage, TrendingUp,
  PlusCircle, Briefcase, BarChart2, BarChart3, PieChart, HelpCircle,
  ArrowRight, FolderOpen, CreditCard, ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import NavigationGuideBot from "@/components/NavigationGuideBot";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Interface for navigation items
interface NavItem {
  name: string;
  path?: string;
  icon: ReactNode;
  roles: Array<'admin' | 'manager' | 'employee' | 'customer'>;
  badge?: string | null;
  submenu?: {
    name: string;
    path: string;
    badge?: string;
    icon?: ReactNode;
  }[];
}

// Navigation data structure
const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <Home className="h-5 w-5" />,
    roles: ['admin', 'manager', 'employee', 'customer'],
    badge: null,
  },
  {
    name: 'Operations',
    path: '/business-operations',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['admin', 'manager', 'employee'],
    badge: null,
    submenu: [
      { name: 'Business Overview', path: '/business-operations', icon: <Building className="h-4 w-4" /> },
      { name: 'Categories', path: '/categories', icon: <FolderOpen className="h-4 w-4" /> },
      { name: 'Tool Management', path: '/tool-management', icon: <Settings className="h-4 w-4" /> },
      { name: 'Standard Operating Procedures', path: '/generate-sop', icon: <FileText className="h-4 w-4" /> },
    ]
  },
  {
    name: 'Financial',
    path: '/financial-health',
    icon: <DollarSign className="h-5 w-5" />,
    roles: ['admin', 'manager'],
    badge: null,
    submenu: [
      { name: 'Financial Health', path: '/financial-health', icon: <LineChart className="h-4 w-4" /> },
      { name: 'Company Goals', path: '/company-goals', icon: <Target className="h-4 w-4" /> },
      { name: 'Cost Overview', path: '/cost-overview', icon: <BarChart className="h-4 w-4" /> },
      { name: 'Cost Analysis', path: '/cost-analysis', icon: <PieChart className="h-4 w-4" /> },
      { name: 'ROI Calculator', path: '/roi-calculator', icon: <ArrowRightLeft className="h-4 w-4" /> },
      { name: 'Expense Tracking', path: '/expense-tracking', icon: <CreditCard className="h-4 w-4" /> },
    ]
  },
  {
    name: 'Sales',
    path: '/sales-analytics',
    icon: <BarChart2 className="h-5 w-5" />,
    roles: ['admin', 'manager', 'employee'],
    badge: null,
    submenu: [
      { name: 'Sales Analytics', path: '/sales-analytics', icon: <BarChart2 className="h-4 w-4" /> },
      { name: 'Order Management', path: '/orders', badge: '2', icon: <ShoppingCart className="h-4 w-4" /> }
    ]
  },
  {
    name: 'Marketing',
    path: '/campaigns',
    icon: <Target className="h-5 w-5" />,
    roles: ['admin', 'manager', 'employee'],
    badge: null,
    submenu: [
      { name: 'Campaign Manager', path: '/campaigns', icon: <Target className="h-4 w-4" /> },
      { name: 'Social Media', path: '/social-media', icon: <MessageSquare className="h-4 w-4" /> },
      { name: 'Asset Library', path: '/assets', icon: <FileImage className="h-4 w-4" /> },
    ]
  },
  {
    name: 'Customer',
    path: '/customer-inquiries',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin', 'manager', 'employee', 'customer'],
    badge: '3',
    submenu: [
      { name: 'Customer Inquiries', path: '/customer-inquiries', badge: '3', icon: <Users className="h-4 w-4" /> },
      { name: 'WhatsApp Integration', path: '/whatsapp-settings', badge: '5', icon: <MessageSquare className="h-4 w-4" /> },
    ]
  },
  {
    name: 'Team',
    path: '/team',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin', 'manager'],
    badge: null,
    submenu: [
      { name: 'Team Members', path: '/team', icon: <Users className="h-4 w-4" /> },
      { name: 'Meetings', path: '/meetings', badge: '1', icon: <Calendar className="h-4 w-4" /> },
    ]
  },
  {
    name: 'Automation',
    path: '/department-automation',
    icon: <Cpu className="h-5 w-5" />,
    roles: ['admin', 'manager'],
    badge: null,
    submenu: [
      { name: 'Department Automation', path: '/department-automation', icon: <Cpu className="h-4 w-4" /> },
      { name: 'Organization Chart', path: '/organization-chart', icon: <Network className="h-4 w-4" /> },
    ]
  },
  {
    name: 'Competitors',
    path: '/competitors',
    icon: <Target className="h-5 w-5" />,
    roles: ['admin', 'manager'],
    badge: null,
  },
];

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { userRole } = useUserRole();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Handle mouse enter/leave for dropdown menus
  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  
  // Filter navigation based on user role
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-1 md:gap-4">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMobileMenuToggle}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80">
                <LayoutDashboard className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
              <span className="font-semibold text-xl hidden sm:inline-block">DMPHQ Platform</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex mx-6 gap-1">
              {filteredNavigation.map((item) => (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link href={item.path || "#"}>
                    <Button 
                      variant={location === item.path ? "secondary" : "ghost"}
                      size="sm" 
                      className={cn(
                        "h-9 gap-1.5",
                        item.submenu && "pr-8" // Extra padding for items with dropdown indicator
                      )}
                    >
                      {item.icon}
                      <span className="hidden lg:inline">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="hidden lg:flex ml-1 h-5 min-w-5 px-1.5 bg-primary/10 text-primary"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.submenu && (
                        <ChevronDown className="h-3.5 w-3.5 absolute right-2" />
                      )}
                    </Button>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.submenu && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border">
                      {item.submenu.map((subItem) => (
                        <Link key={subItem.path} href={subItem.path}>
                          <div className={cn(
                            "flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
                            location === subItem.path && "bg-gray-100 dark:bg-gray-700 font-medium text-primary"
                          )}>
                            <div className="flex items-center gap-2">
                              {subItem.icon}
                              <span>{subItem.name}</span>
                            </div>
                            {subItem.badge && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {subItem.badge}
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="absolute right-0 top-0 flex items-center">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-[200px] lg:w-[300px] mr-2"
                    autoFocus
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">3</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button variant="ghost" size="sm" className="h-auto text-xs px-2">Mark all as read</Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Notification Items */}
                {[
                  { title: 'New customer inquiry', time: '10 minutes ago', type: 'inquiry', read: false },
                  { title: 'Monthly cost report ready', time: '2 hours ago', type: 'report', read: false },
                  { title: 'New meeting scheduled', time: '4 hours ago', type: 'meeting', read: false },
                  { title: 'Tool recommendation', time: 'Yesterday', type: 'automation', read: true },
                  { title: 'Usage threshold exceeded', time: 'Yesterday', type: 'alert', read: true },
                ].map((notification, index) => (
                  <div key={index} className={cn(
                    "px-4 py-3 cursor-pointer hover:bg-muted flex gap-3 border-l-2",
                    notification.read 
                      ? "border-transparent" 
                      : "border-primary bg-primary/5 dark:bg-primary/10"
                  )}>
                    <div className={cn(
                      "rounded-full w-8 h-8 flex items-center justify-center",
                      notification.type === 'inquiry' ? "bg-blue-100 text-blue-600" :
                      notification.type === 'report' ? "bg-green-100 text-green-600" :
                      notification.type === 'meeting' ? "bg-purple-100 text-purple-600" :
                      notification.type === 'automation' ? "bg-amber-100 text-amber-600" :
                      "bg-red-100 text-red-600"
                    )}>
                      {notification.type === 'inquiry' ? <MessageSquare className="h-4 w-4" /> :
                       notification.type === 'report' ? <FileText className="h-4 w-4" /> :
                       notification.type === 'meeting' ? <Calendar className="h-4 w-4" /> :
                       notification.type === 'automation' ? <Cpu className="h-4 w-4" /> :
                       <Bell className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{notification.title}</div>
                      <div className="text-xs text-muted-foreground">{notification.time}</div>
                    </div>
                  </div>
                ))}
                <DropdownMenuSeparator />
                <div className="px-4 py-2 text-center">
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    View all notifications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  
  // Filter navigation based on user role
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  // Auto-expand relevant sections based on current location
  useEffect(() => {
    filteredNavigation.forEach((item) => {
      if (item.submenu && item.submenu.some(sub => sub.path === location)) {
        setExpandedMenus(prev => ({ ...prev, [item.name]: true }));
      }
    });
  }, [location, filteredNavigation]);
  
  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  return (
    <div className={cn(
      "bg-background border-r border-border flex flex-col h-screen transition-all duration-300 ease-in-out",
      expanded ? "w-64" : "w-16"
    )}>
      {/* Sidebar Header (for collapsed state) */}
      {!expanded && (
        <div className="h-16 flex items-center justify-center border-b">
          <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80">
            <LayoutDashboard className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
        </div>
      )}
      
      {/* Toggle Button (for collapsed state) */}
      {!expanded && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mx-auto mt-4"
          onClick={onToggle}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
      
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className={cn(
          "flex flex-col gap-1.5",
          expanded ? "px-3" : "px-2"
        )}>
          {filteredNavigation.map((item) => (
            <div key={item.name}>
              {/* Main Menu Item */}
              {!item.submenu ? (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={item.path || "#"}>
                        <Button 
                          variant={location === item.path ? "secondary" : "ghost"}
                          size={expanded ? "default" : "icon"}
                          className={cn(
                            "w-full justify-start", 
                            !expanded && "h-10 w-10"
                          )}
                        >
                          {item.icon}
                          {expanded && <span className="ml-2">{item.name}</span>}
                          {expanded && item.badge && (
                            <Badge className="ml-auto" variant="secondary">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {!expanded && (
                      <TooltipContent side="right">
                        <div className="flex items-center">
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge className="ml-2" variant="secondary">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ) : (
                // Menu With Submenu
                <>
                  <div className={cn("relative", expanded ? "" : "flex justify-center")}>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={item.submenu?.some(sub => sub.path === location) ? "secondary" : "ghost"}
                            size={expanded ? "default" : "icon"}
                            className={cn(
                              "w-full justify-start",
                              !expanded && "h-10 w-10",
                              expanded && "pr-8" // Space for dropdown icon
                            )}
                            onClick={() => expanded && toggleMenu(item.name)}
                          >
                            {item.icon}
                            {expanded && (
                              <>
                                <span className="ml-2">{item.name}</span>
                                {item.badge && (
                                  <Badge className="ml-auto" variant="secondary">
                                    {item.badge}
                                  </Badge>
                                )}
                                <ChevronDown 
                                  className={cn(
                                    "h-4 w-4 absolute right-2 transition-transform",
                                    expandedMenus[item.name] && "transform rotate-180"
                                  )} 
                                />
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        {!expanded && (
                          <TooltipContent side="right">
                            <div>
                              <div className="flex items-center mb-2">
                                <span>{item.name}</span>
                                {item.badge && (
                                  <Badge className="ml-2" variant="secondary">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <div className="border-t pt-2 flex flex-col gap-1.5">
                                {item.submenu?.map((subItem) => (
                                  <Link key={subItem.path} href={subItem.path}>
                                    <div className={cn(
                                      "text-sm rounded px-2 py-1.5 flex items-center gap-2",
                                      location === subItem.path 
                                        ? "bg-secondary text-secondary-foreground" 
                                        : "hover:bg-muted cursor-pointer"
                                    )}>
                                      {subItem.icon}
                                      <span>{subItem.name}</span>
                                      {subItem.badge && (
                                        <Badge className="ml-auto" variant="outline">
                                          {subItem.badge}
                                        </Badge>
                                      )}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {/* Submenu (expanded state) */}
                  {expanded && (
                    <div className={cn(
                      "overflow-hidden transition-all ml-9 space-y-1",
                      expandedMenus[item.name] ? "max-h-96" : "max-h-0"
                    )}>
                      {item.submenu?.map((subItem) => (
                        <Link key={subItem.path} href={subItem.path}>
                          <div className={cn(
                            "flex items-center text-sm rounded-md px-3 py-2 cursor-pointer",
                            location === subItem.path 
                              ? "bg-secondary text-secondary-foreground font-medium" 
                              : "text-muted-foreground hover:bg-muted"
                          )}>
                            {subItem.icon && (
                              <div className="w-5 mr-2">{subItem.icon}</div>
                            )}
                            <span>{subItem.name}</span>
                            {subItem.badge && (
                              <Badge className="ml-auto" variant="outline">
                                {subItem.badge}
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      {/* Sidebar Footer */}
      {expanded && (
        <div className="border-t p-4">
          <Button variant="outline" size="sm" className="w-full justify-between mb-2">
            <span className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              <span>Help & Support</span>
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={onToggle}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span>Collapse sidebar</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  
  // Filter navigation based on user role
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  // Auto-expand relevant sections based on current location
  useEffect(() => {
    if (isOpen) {
      filteredNavigation.forEach((item) => {
        if (item.submenu && item.submenu.some(sub => sub.path === location)) {
          setExpandedMenus(prev => ({ ...prev, [item.name]: true }));
        }
      });
    }
  }, [location, filteredNavigation, isOpen]);
  
  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  if (!isOpen) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-sm p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80">
              <LayoutDashboard className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
            </div>
            <SheetTitle className="text-2xl">DMPHQ Platform</SheetTitle>
          </div>
          <SheetDescription className="text-base mt-1">
            Complete business execution platform for your organization
          </SheetDescription>
        </SheetHeader>
        
        <div className="p-4">
          <Input
            type="search"
            placeholder="Search across platform..."
            className="mb-4"
            autoComplete="off"
          />
          
          <div className="space-y-1">
            {filteredNavigation.map((item) => (
              <div key={item.name} className="mb-2">
                {!item.submenu ? (
                  <SheetClose asChild>
                    <Link href={item.path || "#"}>
                      <Button
                        variant={location === item.path ? "default" : "ghost"}
                        className="w-full justify-start gap-2 mb-1 h-11"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-primary/10 p-1.5 rounded-md">
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  </SheetClose>
                ) : (
                  <>
                    <Button
                      variant={item.submenu?.some(sub => sub.path === location) ? "default" : "ghost"}
                      className="w-full justify-start gap-2 mb-1 h-11"
                      onClick={() => toggleMenu(item.name)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="bg-primary/10 p-1.5 rounded-md">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="mr-2">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronDown 
                        className={cn(
                          "h-5 w-5 transition-transform",
                          expandedMenus[item.name] && "transform rotate-180"
                        )} 
                      />
                    </Button>
                    
                    <div className={cn(
                      "overflow-hidden transition-all ml-11 border-l pl-3 space-y-1 mt-1 border-l-primary/20",
                      expandedMenus[item.name] ? "max-h-96" : "max-h-0"
                    )}>
                      {item.submenu?.map((subItem) => (
                        <SheetClose asChild key={subItem.path}>
                          <Link href={subItem.path}>
                            <Button
                              variant={location === subItem.path ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-sm"
                            >
                              <div className="flex-1 text-left flex items-center gap-2">
                                {subItem.icon}
                                <span>{subItem.name}</span>
                              </div>
                              {subItem.badge && (
                                <Badge variant="outline" className="ml-auto h-5 min-w-5 px-1.5">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src="/avatar.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <SheetClose asChild>
              <Link href="/settings">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/help">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </Button>
              </Link>
            </SheetClose>
          </div>
          
          <Separator className="my-4" />
          
          <Button variant="destructive" size="sm" className="gap-2 w-full">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface EnhancedNavigationProps {
  children: ReactNode;
}

export default function EnhancedNavigation({ children }: EnhancedNavigationProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Toggle sidebar expanded state
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar 
          expanded={sidebarExpanded} 
          onToggle={toggleSidebar} 
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header onMobileMenuToggle={toggleMobileMenu} />
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t py-6 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80">
                  <LayoutDashboard className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                </div>
                <div>
                  <div className="font-semibold">DMPHQ Platform</div>
                  <div className="text-xs text-muted-foreground">© 2025 All rights reserved</div>
                </div>
              </div>
              
              <div className="flex gap-6">
                <Link href="/help" className="text-sm hover:text-primary">Help Center</Link>
                <Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link>
                <Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link>
                <Link href="/contact" className="text-sm hover:text-primary">Contact Us</Link>
              </div>
              
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-1-4.8 4-8.3 7.5-5.5.8-.8 1.4-1.5 2-2.4.7.8 1.4 1.5 2 2.4"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <span className="sr-only">GitHub</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <span className="sr-only">LinkedIn</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </div>
  );
}