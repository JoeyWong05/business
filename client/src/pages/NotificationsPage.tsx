import React, { useState } from 'react';
import SaasLayout from '@/components/SaasLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useNotifications, Notification } from '@/contexts/NotificationsContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Check,
  Filter,
  Search,
  MessageSquare,
  Info,
  AlertTriangle,
  CheckCheck,
  Settings,
  Calendar,
  BarChart2,
  CheckCircle,
  Zap,
  Clock,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearNotification, isLoading } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    recommendation: true,
    meeting: true,
    sop: true,
    message: true,
    analytics: true,
    alert: true,
    update: true
  });
  
  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch(type) {
      case 'recommendation':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'sop':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'analytics':
        return <BarChart2 className="h-5 w-5 text-cyan-500" />;
      case 'update':
        return <Info className="h-5 w-5 text-cyan-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter notifications based on search and type filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filters[notification.type as keyof typeof filters] || false;
    return matchesSearch && matchesFilter;
  });

  // Group notifications by date (today, yesterday, this week, earlier)
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const now = new Date();
    const notifDate = new Date(notification.createdAt);
    const isToday = notifDate.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 86400000).toDateString() === notifDate.toDateString();
    
    let group = 'Earlier';
    if (isToday) group = 'Today';
    else if (isYesterday) group = 'Yesterday';
    else if (now.getTime() - notifDate.getTime() < 7 * 24 * 60 * 60 * 1000) group = 'This Week';
    
    if (!groups[group]) groups[group] = [];
    groups[group].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <SaasLayout>
      <div className="container px-4 py-4 md:py-6 space-y-4 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all your notifications and alerts
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 mt-2 md:mt-0">
            <Button 
              onClick={handleMarkAllAsRead} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 whitespace-nowrap"
              disabled={!filteredNotifications.some(n => !n.read)}
            >
              <CheckCheck className="h-4 w-4" />
              <span className="text-sm">Mark all read</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 whitespace-nowrap"
              asChild
            >
              <a href="/settings/notifications">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <div className="md:flex md:flex-row gap-4 items-start">
            <div className="w-full md:w-1/4 lg:w-1/5 mb-4 md:mb-0 flex-shrink-0">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle>Filter</CardTitle>
                  <CardDescription>
                    Show notifications by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-recommendation" 
                        checked={filters.recommendation}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, recommendation: checked === true})
                        } 
                      />
                      <Label htmlFor="filter-recommendation" className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span>Recommendations</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-sop" 
                        checked={filters.sop}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, sop: checked === true})
                        } 
                      />
                      <Label htmlFor="filter-sop" className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>SOPs</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-meeting" 
                        checked={filters.meeting}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, meeting: checked === true})
                        } 
                      />
                      <Label htmlFor="filter-meeting" className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span>Meetings</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-message" 
                        checked={filters.message}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, message: checked === true})
                        } 
                      />
                      <Label htmlFor="filter-message" className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        <span>Messages</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-analytics" 
                        checked={filters.analytics}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, analytics: checked === true})
                        } 
                      />
                      <Label htmlFor="filter-analytics" className="flex items-center gap-2 text-sm">
                        <BarChart2 className="h-4 w-4 text-cyan-500" />
                        <span>Analytics</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-alert" 
                        checked={filters.alert}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, alert: checked === true})
                        } 
                      />
                      <Label htmlFor="filter-alert" className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Alerts</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="filter-update" 
                        checked={filters.update}
                        onCheckedChange={(checked) => 
                          setFilters({...filters, update: checked === true})
                        } 
                      />
                      <Label htmlFor="filter-update" className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-cyan-500" />
                        <span>Updates</span>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-3/4 lg:w-4/5 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>

              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {Object.keys(groupedNotifications).length > 0 ? (
                  Object.entries(groupedNotifications).map(([timeGroup, notifs]) => (
                    <div key={timeGroup} className="space-y-2">
                      <h3 className="text-lg font-medium text-muted-foreground">{timeGroup}</h3>
                      <Card>
                        <CardContent className="p-0">
                          <ScrollArea className="max-h-[300px] md:max-h-[400px]">
                            <div className="divide-y">
                              {notifs.slice(0, 20).map((notification) => (
                                <div 
                                  key={notification.id} 
                                  className={`flex gap-3 p-3 ${notification.read ? 'bg-background' : 'bg-muted/20'}`}
                                >
                                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                      <p className={`font-medium text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                        {notification.title}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </span>
                                        {!notification.read && (
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              markAsRead(notification.id);
                                            }}
                                          >
                                            <Check className="h-3 w-3" />
                                            <span className="sr-only">Mark as read</span>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {notification.description}
                                    </p>
                                    {notification.actionUrl && (
                                      <Button 
                                        asChild
                                        variant="link" 
                                        className="p-0 h-auto text-xs text-primary mt-1"
                                      >
                                        <a href={notification.actionUrl}>View Details</a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-center">No notifications matching your criteria</p>
                      <Button 
                        variant="link" 
                        className="mt-2"
                        onClick={() => {
                          setSearchTerm('');
                          setFilters({
                            recommendation: true,
                            meeting: true,
                            sop: true,
                            message: true,
                            analytics: true,
                            alert: true,
                            update: true
                          });
                        }}
                      >
                        Reset filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-6">
                {filteredNotifications.filter(n => !n.read).length > 0 ? (
                  <Card>
                    <CardContent className="p-0">
                      <ScrollArea className="max-h-[300px] md:max-h-[400px]">
                        <div className="divide-y">
                          {filteredNotifications.filter(n => !n.read).slice(0, 20).map((notification) => (
                            <div 
                              key={notification.id} 
                              className="flex gap-3 p-3 bg-muted/20"
                            >
                              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                  <p className="font-medium text-foreground text-sm">
                                    {notification.title}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification.id);
                                      }}
                                    >
                                      <Check className="h-3 w-3" />
                                      <span className="sr-only">Mark as read</span>
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.description}
                                </p>
                                {notification.actionUrl && (
                                  <Button 
                                    asChild
                                    variant="link" 
                                    className="p-0 h-auto text-xs text-primary mt-1"
                                  >
                                    <a href={notification.actionUrl}>View Details</a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Check className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-center">No unread notifications</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="archived" className="space-y-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <CheckCheck className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground text-center">No archived notifications</p>
                    <p className="text-muted-foreground/70 text-sm text-center mt-1">Archived notifications will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </SaasLayout>
  );
}