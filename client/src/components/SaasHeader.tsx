import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDemoMode } from "@/contexts/DemoModeContext";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  PlusCircle,
  MessageSquare,
  Calendar,
  BarChart2,
  CheckCircle,
  Building,
  Crown,
  Sparkles,
  Info,
  GanttChart,
  Lightbulb,
  Monitor,
  Globe
} from "lucide-react";

import NotificationsCenter from "./NotificationsCenter";
import TeamManagementDialog from "./TeamManagementDialog";
import LanguageSelector from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SaasHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function SaasHeader({ onMobileMenuToggle }: SaasHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState({
    id: 1,
    name: "Digital Merch Pros",
    shortName: "DMP",
    color: "#4f46e5" // indigo-600
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const { demoMode, toggleDemoMode } = useDemoMode();
  // Get current page context for breadcrumb/title
  const getPageContext = () => {
    const path = location.split('/');
    if (path.length <= 1 || path[1] === '') return { title: 'Dashboard', path: null };
    
    // Convert path segments to title case and replace hyphens with spaces
    const formatSegment = (segment: string) => {
      return segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    if (path.length === 2) {
      return { title: formatSegment(path[1]), path: null };
    }
    
    return {
      title: formatSegment(path[path.length - 1]),
      path: path.slice(1, -1).map(formatSegment)
    };
  };
  
  const pageContext = getPageContext();
  
  // Company list - this would come from API in real app
  const companies = [
    { id: 1, name: "Digital Merch Pros", shortName: "DMP", color: "#4f46e5" },
    { id: 2, name: "Mystery Hype", shortName: "MH", color: "#0ea5e9" },
    { id: 3, name: "Lone Star Custom Clothing", shortName: "LSCC", color: "#10b981" },
    { id: 4, name: "Alcoeaze", shortName: "AZ", color: "#f97316" },
    { id: 5, name: "Hide Cafe Bars", shortName: "HCB", color: "#8b5cf6" },
  ];
  
  // Effect to focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  

  
  // User data - would come from auth context in a real app
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: userRole,
    avatarUrl: null,
    initials: "AJ"
  };
  

  
  const handleCompanyChange = (company: typeof companies[0]) => {
    setActiveCompany(company);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b shadow-sm bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 h-16">
      <div className="flex h-full items-center px-4 sm:px-6">
        {/* LEFT SECTION - Logo and company selector */}
        <div className="flex items-center gap-3 mr-4">
          {/* Logo - visible on all screen sizes */}
          <Link href="/" className="flex items-center">
            <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-md tracking-tight">DMP</span>
            </div>
          </Link>

          {/* Company name with dropdown for switching */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 px-2 font-medium flex items-center gap-1.5"
              >
                <span className="truncate max-w-[120px] md:max-w-[180px] lg:max-w-[240px]">
                  {activeCompany.name}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Switch Company</span>
                <Badge variant="outline" className="text-xs px-1.5 py-0 border-primary/20 text-primary">Multi-Brand</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {companies.map((company) => (
                <DropdownMenuItem 
                  key={company.id}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer", 
                    activeCompany.id === company.id ? "bg-muted" : ""
                  )}
                  onClick={() => handleCompanyChange(company)}
                >
                  <div 
                    className="h-5 w-5 rounded-md flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: company.color }}
                  >
                    <span className="text-[10px] font-bold text-white">{company.shortName}</span>
                  </div>
                  <span>{company.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/entity-dashboards">
                  <Building className="mr-2 h-4 w-4" />
                  <span>Manage All Companies</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* CENTER SECTION - Current page title/breadcrumb */}
        <div className="hidden lg:flex items-center text-sm text-muted-foreground">
          {pageContext.path ? (
            <>
              {pageContext.path.map((segment, index) => (
                <React.Fragment key={index}>
                  <span>{segment}</span>
                  <ChevronDown className="h-3.5 w-3.5 mx-1 rotate-[-90deg] opacity-50" />
                </React.Fragment>
              ))}
              <span className="font-medium text-foreground">{pageContext.title}</span>
            </>
          ) : (
            <span className="font-medium text-foreground">{pageContext.title}</span>
          )}
        </div>
        
        {/* SPACER - Pushes right section to the end */}
        <div className="flex-1"></div>
        
        {/* RIGHT SECTION - Search, AI tips, theme toggle, notifications, profile */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Global search */}
          <div className="hidden md:block w-64 lg:w-72">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 pr-4 h-9 rounded-md border-muted focus:border-muted-foreground/30"
              />
            </div>
          </div>
          
          {/* Search button (mobile only) */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-[18px] w-[18px]" />
            <span className="sr-only">Search</span>
          </Button>
          
          {/* AI Assistant / Tips */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5 h-9 border-muted px-3">
                <Sparkles className="h-[16px] w-[16px] text-amber-500" />
                <span className="text-sm">AI Tips</span>
                <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1 rounded-full">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center">
                <GanttChart className="h-4 w-4 mr-2 text-primary" />
                <span>AI-Powered Suggestions</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                <DropdownMenuItem className="flex items-start gap-2 p-3 cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-300 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Increase social engagement</p>
                    <p className="text-xs text-muted-foreground mt-1">Schedule posts during peak hours to maximize reach. Traffic analysis suggests 11am-1pm is optimal.</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-2 p-3 cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5">
                    <Crown className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upgrade your subscription</p>
                    <p className="text-xs text-muted-foreground mt-1">You're reaching usage limits. Upgrade to Pro for unlimited access to all features.</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-2 p-3 cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 flex-shrink-0 mt-0.5">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Complete your profile</p>
                    <p className="text-xs text-muted-foreground mt-1">Add your company logo and complete business info to improve dashboard accuracy.</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="p-2 justify-center text-center">
                <Link href="/ai-insights">
                  View all AI insights
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="hidden sm:flex"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] text-amber-300" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
            <span className="sr-only">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </Button>
          
          {/* Language Selector */}
          <LanguageSelector />

          {/* Quick Actions button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <PlusCircle className="h-[18px] w-[18px]" />
                <span className="sr-only">Quick actions</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Quick Actions</DialogTitle>
                <DialogDescription>
                  Start a new task or workflow
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/customer-service">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Customer Support
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/orders?status=pending">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Order Fulfillment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/meetings">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/advanced-ai">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    AI Assistant
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/generate-sop">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create SOP
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/social-media">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Create Post
                  </Link>
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Enhanced Notifications Center */}
          <NotificationsCenter />
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 pl-1 pr-2 ml-1 relative">
                <Avatar className="h-8 w-8 border-2 border-background">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  ) : (
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                {demoMode && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary/20 border border-primary/70 ring-1 ring-background flex items-center justify-center" title="Demo Mode Active">
                    <Monitor className="h-2.5 w-2.5 text-primary" />
                  </div>
                )}
                <span className="hidden md:inline-block text-sm font-medium">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="hidden md:inline-block h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center justify-between p-2 pb-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                        {user.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="ml-auto text-[10px] h-5 px-1.5 border-primary/20 bg-primary/5 text-primary">
                  {user.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center py-1.5">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                    <DropdownMenuShortcut>⇧A</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <TeamManagementDialog />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center py-1.5">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="flex items-center py-1.5">
                    <Crown className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Billing & Plans</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex items-center py-1.5">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme} className="flex items-center py-1.5">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4 text-amber-300" />
                      <span>Light mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleDemoMode} className="flex items-center py-1.5">
                  <Monitor className="mr-2 h-4 w-4 text-primary" />
                  <span>Demo Mode: {demoMode ? "On" : "Off"}</span>
                  {demoMode && <Badge variant="outline" className="ml-auto text-[10px] py-0 px-1.5 rounded-sm">Active</Badge>}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center py-1.5">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>Version 1.3.2</span>
                  <span>Updated Mar 2025</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile search dialog */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="top" className="px-4 sm:px-6">
          <SheetHeader className="text-left">
            <SheetTitle>Search</SheetTitle>
            <SheetDescription>
              Search across all companies and resources
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Type to search..."
                className="pl-10 pr-4 h-12"
              />
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Quick Searches</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" className="justify-start h-8" asChild>
                  <Link href="/customer-service">
                    <span>Customer Tickets</span>
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" className="justify-start h-8" asChild>
                  <Link href="/orders?status=pending">
                    <span>Order Fulfillment</span>
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" className="justify-start h-8" asChild>
                  <Link href="/social-media">
                    <span>Social Media</span>
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" className="justify-start h-8" asChild>
                  <Link href="/business-operations">
                    <span>Business Operations</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="secondary" className="w-full">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
}