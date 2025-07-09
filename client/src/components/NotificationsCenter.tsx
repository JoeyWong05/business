import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useNotifications, Notification } from "@/contexts/NotificationsContext";
import {
  Bell,
  CheckCircle,
  Calendar,
  MessageSquare,
  BarChart2,
  Zap,
  Info,
  AlertTriangle,
  Trash2,
  CheckCheck,
  Clock,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Function to format time from now
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationsCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, isLoading } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [fullViewOpen, setFullViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    recommendation: true,
    meeting: true,
    sop: true,
    message: true,
    analytics: true,
    alert: true,
    update: true,
  });
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Display loading skeleton when fetching notifications
  const NotificationSkeleton = () => (
    <div className="flex gap-3 p-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'recommendation':
        return <Zap className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'sop':
        return <CheckCircle className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'analytics':
        return <BarChart2 className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'update':
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Get notification background based on read status and type
  const getNotificationBg = (notification: Notification) => {
    if (notification.read) return "bg-muted/30";
    
    switch(notification.type) {
      case 'recommendation':
        return "bg-blue-50 dark:bg-blue-950";
      case 'meeting':
        return "bg-amber-50 dark:bg-amber-950";
      case 'sop':
        return "bg-green-50 dark:bg-green-950";
      case 'alert':
        return "bg-red-50 dark:bg-red-950";
      default:
        return "bg-primary/5";
    }
  };

  // Get notification icon color based on type
  const getIconColor = (type: string) => {
    switch(type) {
      case 'recommendation':
        return "text-blue-500";
      case 'meeting':
        return "text-amber-500";
      case 'sop':
        return "text-green-500";
      case 'message':
        return "text-purple-500";
      case 'analytics':
        return "text-indigo-500";
      case 'alert':
        return "text-red-500";
      case 'update':
        return "text-cyan-500";
      default:
        return "text-primary";
    }
  };

  // Handle clicking a notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Close dropdown before navigating
      setShowNotifications(false);
    }
  };

  // Filter notifications based on active tab and filters
  const filteredNotifications = notifications.filter(notification => {
    // First check tab filter
    if (activeTab === "unread" && notification.read) return false;
    if (activeTab === "alerts" && notification.type !== "alert") return false;
    
    // Then check type filters
    return activeFilters[notification.type];
  });

  // Organize notifications by date groups
  const groupedNotifications = filteredNotifications.reduce<Record<string, Notification[]>>((groups, notification) => {
    const date = new Date(notification.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let group = "Older";
    
    if (date.toDateString() === today.toDateString()) {
      group = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = "Yesterday";
    } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      group = "This Week";
    }
    
    if (!groups[group]) {
      groups[group] = [];
    }
    
    groups[group].push(notification);
    return groups;
  }, {});

  // Notification item component
  const NotificationItem = ({ notification, expanded = false }: { notification: Notification, expanded?: boolean }) => (
    <div 
      className={`flex gap-3 p-3 cursor-pointer transition-colors ${getNotificationBg(notification)} ${expanded ? 'hover:bg-muted/40' : ''}`}
      onClick={() => handleNotificationClick(notification)}
    >
      <div className={`h-8 w-8 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary/10'} flex items-center justify-center ${getIconColor(notification.type)}`}>
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p className={`text-sm font-medium truncate ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
            {notification.title}
          </p>
          {expanded && (
            <div className="flex gap-1 ml-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <CheckCheck className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove notification</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {notification.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground/60 flex items-center">
            <Clock className="h-3 w-3 mr-1 inline" />
            {expanded ? notification.time : formatTimeAgo(notification.createdAt)}
          </p>
          {notification.entityName && (
            <Badge variant="outline" className="text-xs">
              {notification.entityName}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  // Dropdown menu for notifications
  const NotificationsDropdown = () => (
    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-10 h-10 touch-manipulation">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[calc(100vw-3rem)] sm:w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mobile-optimized notification display */}
        {isLoading ? (
          <div className="py-2">
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        ) : notifications.length > 0 ? (
          <div className="py-1">
            {notifications.slice(0, 3).map(notification => (
              <div 
                key={notification.id}
                className="px-2 py-2 hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  setShowNotifications(false);
                }}
              >
                <div className="flex items-start gap-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)} bg-muted/50`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">No notifications</p>
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer justify-center"
            onClick={() => {
              window.location.href = "/notifications";
              setShowNotifications(false);
            }}
          >
            View all notifications
          </DropdownMenuItem>
          {unreadCount > 0 && (
            <DropdownMenuItem 
              className="cursor-pointer justify-center"
              onClick={() => {
                markAllAsRead();
                setShowNotifications(false);
              }}
            >
              Mark all as read
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Full view dialog for notifications
  const NotificationsFullView = () => (
    <Dialog open={fullViewOpen} onOpenChange={setFullViewOpen}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Notifications Center</DialogTitle>
          <DialogDescription>
            Stay up to date with all your business activities
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Show notification types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={activeFilters.recommendation}
                  onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, recommendation: !!checked })}
                >
                  <Zap className="h-4 w-4 mr-2 text-blue-500" />
                  Recommendations
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.alert}
                  onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, alert: !!checked })}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Alerts
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.sop}
                  onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, sop: !!checked })}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  SOPs
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.meeting}
                  onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, meeting: !!checked })}
                >
                  <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                  Meetings
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.analytics}
                  onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, analytics: !!checked })}
                >
                  <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" />
                  Analytics
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.message}
                  onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, message: !!checked })}
                >
                  <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                  Messages
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters.update}
                  onCheckedChange={(checked) => setActiveFilters({ ...activeFilters, update: !!checked })}
                >
                  <Info className="h-4 w-4 mr-2 text-cyan-500" />
                  Updates
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          ) : filteredNotifications.length > 0 ? (
            <ScrollArea className="max-h-[60vh]">
              {Object.entries(groupedNotifications).map(([group, items]) => (
                <div key={group} className="mb-4">
                  <h3 className="text-sm font-medium px-3 py-1 bg-muted/40">{group}</h3>
                  <div className="divide-y">
                    {items.map(notification => (
                      <NotificationItem key={notification.id} notification={notification} expanded />
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === "all" 
                  ? "You don't have any notifications yet." 
                  : activeTab === "unread" 
                    ? "You've read all your notifications." 
                    : "No alerts at this time."}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            size="sm"
            disabled={unreadCount === 0}
            onClick={markAllAsRead}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setFullViewOpen(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // On mobile, use a simple button that directly navigates to the notifications page
  // instead of a dropdown which is causing freezing issues
  if (isMobile) {
    return (
      <Link href="/notifications">
        <Button variant="ghost" size="icon" className="relative w-10 h-10">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          )}
          <span className="sr-only">View Notifications</span>
        </Button>
      </Link>
    );
  }

  // On desktop, use the dropdown
  return (
    <>
      <NotificationsDropdown />
      <NotificationsFullView />
    </>
  );
}