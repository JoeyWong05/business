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
  LogOut,
  Sun,
  Moon,
  Check,
  Home,
  Settings,
  ChevronRight,
  X
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
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MinimalHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function MinimalHeader({ onMobileMenuToggle }: MinimalHeaderProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { userRole } = useUserRole();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // User data - would come from auth context in a real app
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: userRole,
    avatarUrl: null,
    initials: "AJ"
  };
  
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
  
  // Effect to focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Quick access menu structure - these are the most important sections
  const quickAccessMenu = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Sales', path: '/sales-dashboard', icon: <BarChartHorizontal className="h-4 w-4" /> },
    { name: 'Customers', path: '/client-management', icon: <User className="h-4 w-4" />, badge: '3' },
    { name: 'Operations', path: '/business-operations', icon: <Settings className="h-4 w-4" /> },
  ];
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container py-1 px-2">
        <div className="flex h-12 items-center justify-between">
          {/* Left side - Logo + Mobile menu toggle */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden" 
              onClick={onMobileMenuToggle}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link href="/" className="flex items-center gap-1">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <BarChartHorizontal className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline-block">DMPHQ</span>
            </Link>
          </div>
          
          {/* Center - Quick access buttons on mobile, search bar on desktop */}
          <div className="flex-1 mx-1 sm:mx-4">
            <div className="hidden md:flex w-full max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search across platform..."
                className="pl-10 pr-4 h-9 bg-background focus-visible:ring-primary"
              />
            </div>
            
            {/* Mobile Quick Access */}
            <div className="flex md:hidden justify-center items-center gap-0.5">
              {quickAccessMenu.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button 
                    variant={location === item.path ? "secondary" : "ghost"} 
                    size="sm" 
                    className="h-9 px-2 relative"
                  >
                    {item.icon}
                    <span className="sr-only">{item.name}</span>
                    {item.badge && (
                      <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Trigger */}
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-[25%] pt-10">
                <div className="flex flex-col gap-4 h-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search anything..."
                      className="pl-10 pr-4 h-10"
                      autoComplete="off"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Try searching for "sales dashboard", "customer support", "finance reports"
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="hidden sm:flex"
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
            <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full max-w-md sm:max-w-lg">
                <SheetHeader className="text-left mb-4 flex flex-row items-center justify-between">
                  <SheetTitle className="text-xl">Notifications</SheetTitle>
                  {unreadCount > 0 && (
                    <Badge variant="secondary">
                      {unreadCount} new
                    </Badge>
                  )}
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={cn(
                            "flex gap-3 p-3 rounded-lg cursor-pointer",
                            notification.read ? "bg-muted/40" : "bg-primary/5 border border-primary/10"
                          )}
                        >
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            notification.read ? "bg-muted" : "bg-primary/10"
                          )}>
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={cn(
                                "text-sm font-medium",
                                notification.read ? "text-muted-foreground" : "text-foreground"
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center">
                      <p className="text-muted-foreground">No notifications</p>
                    </div>
                  )}
                </ScrollArea>
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full">
                    Mark all as read
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* User menu */}
            <Sheet open={userMenu} onOpenChange={setUserMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full pb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 -mx-6">
                    <div className="px-6">
                      <div className="space-y-1 mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Account</h4>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link href="/settings">
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link href="/team">
                            <User className="mr-3 h-4 w-4" />
                            Profile
                          </Link>
                        </Button>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="space-y-1 mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Appearance</h4>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start" 
                          onClick={toggleTheme}
                        >
                          {theme === 'dark' ? (
                            <>
                              <Sun className="mr-3 h-4 w-4 text-amber-300" />
                              Light Mode
                            </>
                          ) : (
                            <>
                              <Moon className="mr-3 h-4 w-4" />
                              Dark Mode
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <Separator className="my-3" />

                      <div className="space-y-1 mt-4">
                        <Button variant="destructive" className="w-full" size="sm">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}