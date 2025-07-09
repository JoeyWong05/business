import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  Bell,
  User,
  BarChartHorizontal,
  Menu,
  X,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  PlusCircle,
  MessageSquare,
  Calendar,
  BarChart2,
  CheckCircle
} from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
} from "@/components/ui/sheet";

interface WorldClassHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function WorldClassHeader({ onMobileMenuToggle }: WorldClassHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const [showNotifications, setShowNotifications] = useState(false);
  const [quickActions, setQuickActions] = useState(false);
  
  // User data - would come from auth context in a real app
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: userRole,
    avatarUrl: null,
    initials: "AJ"
  };
  
  // Effect to focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Sample notifications - would come from API in a real app
  const notifications = [
    {
      id: 1,
      title: "New recommendation",
      description: "AI suggested a new tool for your marketing stack",
      time: "5 min ago",
      read: false,
      type: "recommendation"
    },
    {
      id: 2,
      title: "Meeting Reminder",
      description: "Team standup starts in 15 minutes",
      time: "15 min ago",
      read: false,
      type: "meeting"
    },
    {
      id: 3,
      title: "SOP Updated",
      description: "Customer Onboarding Process was updated",
      time: "3 hours ago",
      read: true,
      type: "sop"
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'recommendation':
        return <PlusCircle className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'sop':
        return <CheckCircle className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'analytics':
        return <BarChart2 className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Get notification background based on read status and type
  const getNotificationBg = (read: boolean, type: string) => {
    if (read) return "bg-muted/30";
    
    switch(type) {
      case 'recommendation':
        return "bg-blue-50 dark:bg-blue-950";
      case 'meeting':
        return "bg-amber-50 dark:bg-amber-950";
      case 'sop':
        return "bg-green-50 dark:bg-green-950";
      default:
        return "bg-primary/5";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 shadow-md">
      <div className="container px-2 sm:px-4 md:px-6">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuToggle}
              aria-label="Toggle sidebar navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                <BarChartHorizontal className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground inline-block tracking-tight">
                DMPHQ
              </span>
            </Link>

            {/* Main Navigation - Only on larger screens */}
            <nav className="hidden lg:flex ml-8 space-x-1">
              <Button asChild variant="ghost" className="text-base font-medium">
                <Link href="/">Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-base font-medium">
                    Companies
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/entity-dashboards">All Companies</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/entity-dashboards?id=1">Digital Merch Pros</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/entity-dashboards?id=2">Mystery Hype</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/entity-dashboards?id=3">Lone Star Custom Clothing</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-base font-medium">
                    Tools
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/advanced-ai">AI Assistant</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/department-automation">Automation</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/generate-sop">SOP Builder</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/tool-management">All Tools</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-base font-medium">
                    Reports
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/financial-health">Financial Reports</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sales-dashboard">Sales Analytics</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/social-media">Marketing Reports</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
          
          {/* Center - Search (on larger screens) */}
          <div className="hidden md:flex flex-1 mx-6 justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search across platform..."
                className="pl-10 pr-4 h-10 rounded-md bg-background border border-input hover:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
              />
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Access button (mobile only) */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setQuickActions(true)}
              aria-label="Quick actions"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
            
            {/* Search button (mobile only) */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            
            {/* Quick Actions - Desktop */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden md:flex"
                >
                  <PlusCircle className="h-5 w-5" />
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
                      Customer Tickets
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
            
            {/* Quick Actions - Mobile */}
            <Sheet open={quickActions} onOpenChange={setQuickActions}>
              <SheetContent side="bottom" className="px-4 py-6 sm:px-6">
                <SheetHeader className="text-left mb-4">
                  <SheetTitle>Quick Actions</SheetTitle>
                  <SheetDescription>
                    Start a new task or workflow
                  </SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link href="/customer-service">
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span className="text-xs">Tickets</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link href="/orders?status=pending">
                      <CheckCircle className="h-5 w-5 mb-1" />
                      <span className="text-xs">Orders</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link href="/meetings">
                      <Calendar className="h-5 w-5 mb-1" />
                      <span className="text-xs">Meetings</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link href="/advanced-ai">
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span className="text-xs">AI Assistant</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link href="/generate-sop">
                      <CheckCircle className="h-5 w-5 mb-1" />
                      <span className="text-xs">Create SOP</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 flex-col">
                    <Link href="/social-media">
                      <BarChart2 className="h-5 w-5 mb-1" />
                      <span className="text-xs">Create Post</span>
                    </Link>
                  </Button>
                </div>
                <div className="mt-6">
                  <SheetClose asChild>
                    <Button className="w-full">Close</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Theme toggle - visible on all devices */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-300" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
            </Button>
            
            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  <div className="max-h-[300px] overflow-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className={`flex gap-4 p-3 cursor-pointer ${getNotificationBg(notification.read, notification.type)}`}>
                        <div className={`h-8 w-8 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'} flex items-center justify-center text-foreground`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="p-2 justify-center text-center">
                  <Link href="/notifications">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 pl-1 pr-2">
                  <Avatar className="h-7 w-7">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {user.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                      <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'dark' ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark mode</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile search dialog */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="top" className="px-4 sm:px-6">
          <SheetHeader className="text-left">
            <SheetTitle>Search</SheetTitle>
            <SheetDescription>
              Search across the entire platform
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
                  <Link href="/operating-system">
                    <span>SOPs</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <SheetClose asChild>
            <Button className="w-full">Close</Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </header>
  );
}