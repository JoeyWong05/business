import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AreaChart,
  Alert,
  AlertCircle,
  ArrowRight,
  Bell,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  FileText,
  Filter,
  LayoutDashboard,
  LineChart,
  MoreHorizontal,
  Plus,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Users
} from "lucide-react";
import SOPItem from "@/components/SOPItem";
import ActivityItem from "@/components/ActivityItem";
import RecommendationItem from "@/components/RecommendationItem";
import CostBreakdownChart from "@/components/CostBreakdownChart";
import CostForecastChart from "@/components/CostForecastChart";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

// Widget configuration type
interface WidgetConfig {
  id: string;
  title: string;
  type: string;
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large' | 'full';
  entitySpecific: boolean;
}

// Time range type for date filtering
type TimeRange = 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'custom';

// Sample news/updates data
interface NewsUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  entityId: number | null;
  entityName: string | null;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  read: boolean;
}

const sampleNewsUpdates: NewsUpdate[] = [
  {
    id: "1",
    title: "New Social Media Strategy Launched",
    content: "We've launched our new social media strategy across all platforms. Please review the updated posting guidelines and content calendar.",
    date: "2023-07-10T14:30:00Z",
    entityId: 1,
    entityName: "Digital Merch Pros",
    priority: 'medium',
    tags: ['marketing', 'social-media'],
    read: false
  },
  {
    id: "2",
    title: "Q3 Sales Targets Updated",
    content: "Q3 sales targets have been updated based on Q2 performance. Team leads should schedule reviews with their teams.",
    date: "2023-07-08T09:15:00Z",
    entityId: null,
    entityName: null,
    priority: 'high',
    tags: ['sales', 'targets', 'quarterly'],
    read: false
  },
  {
    id: "3",
    title: "New Inventory Management System",
    content: "The new inventory management system will go live next week. Training sessions are scheduled for all staff.",
    date: "2023-07-05T11:45:00Z",
    entityId: 3,
    entityName: "Lone Star Custom Clothing",
    priority: 'medium',
    tags: ['operations', 'inventory', 'training'],
    read: true
  },
  {
    id: "4",
    title: "Summer Promotion Results",
    content: "The summer promotion exceeded expectations with a 28% increase in sales compared to last year.",
    date: "2023-07-03T15:20:00Z",
    entityId: 4,
    entityName: "Alcoeaze",
    priority: 'low',
    tags: ['marketing', 'promotions', 'sales'],
    read: true
  },
  {
    id: "5",
    title: "New Coffee Supplier Partnership",
    content: "We've partnered with a new local coffee supplier to provide premium beans at a better rate.",
    date: "2023-07-01T10:00:00Z",
    entityId: 5,
    entityName: "Hide Cafe Bars",
    priority: 'medium',
    tags: ['operations', 'suppliers', 'products'],
    read: true
  }
];

// Default widget configuration
const defaultWidgets: WidgetConfig[] = [
  { id: 'stats', title: 'Business Stats', type: 'stats', enabled: true, position: 0, size: 'full', entitySpecific: false },
  { id: 'activities', title: 'Recent Activities', type: 'activities', enabled: true, position: 1, size: 'medium', entitySpecific: true },
  { id: 'recommendations', title: 'Recommendations', type: 'recommendations', enabled: true, position: 2, size: 'medium', entitySpecific: true },
  { id: 'cost-breakdown', title: 'Cost Breakdown', type: 'cost-breakdown', enabled: true, position: 3, size: 'medium', entitySpecific: true },
  { id: 'cost-forecast', title: 'Cost Forecast', type: 'cost-forecast', enabled: true, position: 4, size: 'medium', entitySpecific: true },
  { id: 'sops', title: 'Recent SOPs', type: 'sops', enabled: true, position: 5, size: 'medium', entitySpecific: true },
  { id: 'news', title: 'Company News & Updates', type: 'news', enabled: true, position: 6, size: 'medium', entitySpecific: true },
  { id: 'calendar', title: 'Calendar', type: 'calendar', enabled: true, position: 7, size: 'medium', entitySpecific: false },
  { id: 'summary', title: 'Weekly Summary', type: 'summary', enabled: true, position: 8, size: 'full', entitySpecific: true },
];

export default function EnhancedDashboard() {
  // State for business entity selection
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("enterprise");
  
  // State for widget configuration
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    // Load widget config from localStorage if available
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : defaultWidgets;
  });
  
  // State for widget customization dialog
  const [isCustomizingWidgets, setIsCustomizingWidgets] = useState(false);
  
  // State for date range filtering
  const [timeRange, setTimeRange] = useState<TimeRange>('this-week');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const now = new Date();
    // Create the current date for today
    const currentDate = new Date();
    // Get the start and end of the current week
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return {
      from: weekStart,
      to: weekEnd
    };
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  // State for text opt-in system
  const [textNotifications, setTextNotifications] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOptInDialog, setShowOptInDialog] = useState(false);
  
  // Save widget configuration to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);
  
  // Update date range when time range selection changes
  useEffect(() => {
    const now = new Date();
    let newRange = { from: new Date(), to: new Date() };
    
    switch (timeRange) {
      case 'today':
        newRange = { from: now, to: now };
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        newRange = { from: yesterday, to: yesterday };
        break;
      case 'this-week':
        newRange = {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 })
        };
        break;
      case 'last-week':
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - 7);
        newRange = {
          from: startOfWeek(lastWeekStart, { weekStartsOn: 1 }),
          to: endOfWeek(lastWeekStart, { weekStartsOn: 1 })
        };
        break;
      case 'this-month':
        newRange = {
          from: startOfMonth(now),
          to: endOfMonth(now)
        };
        break;
      case 'last-month':
        const lastMonthDate = new Date(now);
        lastMonthDate.setMonth(now.getMonth() - 1);
        newRange = {
          from: startOfMonth(lastMonthDate),
          to: endOfMonth(lastMonthDate)
        };
        break;
      case 'custom':
        // Don't change the range for custom - it's set by the calendar
        break;
    }
    
    if (timeRange !== 'custom') {
      setDateRange(newRange);
    }
  }, [timeRange]);
  
  // Queries for data fetching
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
  });
  
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard-stats'],
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const res = await fetch('/api/activities?limit=5');
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    },
  });

  const { data: sopsData, isLoading: isLoadingSops } = useQuery({
    queryKey: ['/api/sops'],
    queryFn: async () => {
      const res = await fetch('/api/sops');
      if (!res.ok) throw new Error('Failed to fetch SOPs');
      return res.json();
    },
  });

  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['/api/recommendations'],
    queryFn: async () => {
      const res = await fetch('/api/recommendations?status=pending');
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return res.json();
    },
  });

  // Process data
  const stats = statsData?.stats || {
    totalTools: 0,
    totalMonthlyCost: 0,
    totalSops: 0,
    automationScore: 0
  };

  const categories = categoriesData?.categories || [];
  const activities = activitiesData?.activities || [];
  const allSops = sopsData?.sops || [];
  const recommendations = recommendationsData?.recommendations || [];
  const entities = entitiesData?.entities || [];
  
  // Filter data based on selected entity if in entity view mode
  const filteredSops = selectedEntity === "all" 
    ? allSops 
    : allSops.filter(sop => sop.businessEntityId === Number(selectedEntity) || sop.businessEntityId === null);
  
  // Filter news updates based on selected entity
  const filteredNewsUpdates = selectedEntity === "all"
    ? sampleNewsUpdates
    : sampleNewsUpdates.filter(update => 
        update.entityId === null || update.entityId === Number(selectedEntity)
      );
  
  // Helper to format date range for display
  const formatDateRange = () => {
    if (isSameDay(dateRange.from, dateRange.to)) {
      return format(dateRange.from, 'PPP');
    }
    return `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`;
  };
  
  // Get entity name
  const getEntityName = (entityId: string | number) => {
    if (entityId === "all" || entityId === null) return "All Entities";
    const entity = entities.find(e => e.id === Number(entityId));
    return entity ? entity.name : "Unknown Entity";
  };
  
  // Toggle widget visibility
  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };
  
  // Update widget position
  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const index = widgets.findIndex(w => w.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === widgets.length - 1)) {
      return; // Can't move first widget up or last widget down
    }
    
    const newWidgets = [...widgets];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    const temp = newWidgets[index].position;
    newWidgets[index].position = newWidgets[newIndex].position;
    newWidgets[newIndex].position = temp;
    
    // Sort by position
    newWidgets.sort((a, b) => a.position - b.position);
    
    setWidgets(newWidgets);
  };
  
  // Reset widget configuration to defaults
  const resetWidgetConfig = () => {
    setWidgets(defaultWidgets);
  };
  
  // Save text notification preferences
  const saveTextPreferences = () => {
    setTextNotifications(true);
    setShowOptInDialog(false);
    // In a real app, this would send a request to the server
    // Console log removed for performance optimization
  };

  return (
    <MainLayout
      title="Business Dashboard"
      description="Track your business execution across all entities and departments."
    >
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Entity Selection & View Mode */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <Label htmlFor="entity-select">Business Entity</Label>
            <Select 
              value={selectedEntity} 
              onValueChange={setSelectedEntity}
            >
              <SelectTrigger id="entity-select" className="w-[200px]">
                <SelectValue placeholder="Select an entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {isLoadingEntities ? (
                  <SelectItem value="loading" disabled>Loading entities...</SelectItem>
                ) : (
                  entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="view-mode">View Mode</Label>
            <Select 
              value={viewMode} 
              onValueChange={setViewMode}
            >
              <SelectTrigger id="view-mode" className="w-[200px]">
                <SelectValue placeholder="Select view mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enterprise">Enterprise View</SelectItem>
                <SelectItem value="entity" disabled={selectedEntity === "all"}>
                  Entity-Specific View
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Date Range Selection & Customization */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <Label htmlFor="time-range">Time Period</Label>
            <div className="flex items-center gap-2">
              <Select 
                value={timeRange} 
                onValueChange={(value) => setTimeRange(value as TimeRange)}
              >
                <SelectTrigger id="time-range" className="w-[150px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {timeRange === 'custom' && (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateRange()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                          setCalendarOpen(false);
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
            <Button onClick={() => setIsCustomizingWidgets(true)}>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Customize Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Dynamically render widgets based on configuration */}
        {widgets
          .filter(widget => widget.enabled)
          .sort((a, b) => a.position - b.position)
          .map(widget => {
            // Determine widget column span based on size
            const colSpan = 
              widget.size === 'full' ? 'col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4' :
              widget.size === 'large' ? 'col-span-1 md:col-span-2 lg:col-span-2' :
              widget.size === 'medium' ? 'col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2' :
              'col-span-1';
            
            return (
              <div key={widget.id} className={colSpan}>
                {renderWidget(widget)}
              </div>
            );
          })}
      </div>
      
      {/* Dashboard Customization Dialog */}
      <Dialog open={isCustomizingWidgets} onOpenChange={setIsCustomizingWidgets}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customize Dashboard</DialogTitle>
            <DialogDescription>
              Adjust which widgets appear on your dashboard and their order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[400px] overflow-y-auto">
            {widgets
              .sort((a, b) => a.position - b.position)
              .map(widget => (
                <div key={widget.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center space-x-4">
                    <Switch
                      id={`widget-${widget.id}`}
                      checked={widget.enabled}
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                    <Label htmlFor={`widget-${widget.id}`} className="font-medium">
                      {widget.title}
                    </Label>
                    {widget.entitySpecific && (
                      <Badge variant="outline" className="text-xs">Entity-specific</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveWidget(widget.id, 'up')}
                      disabled={widget.position === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveWidget(widget.id, 'down')}
                      disabled={widget.position === widgets.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Select
                      value={widget.size}
                      onValueChange={(value) => {
                        setWidgets(widgets.map(w => 
                          w.id === widget.id ? { ...w, size: value as 'small' | 'medium' | 'large' | 'full' } : w
                        ));
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="full">Full Width</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetWidgetConfig}>
              Reset to Default
            </Button>
            <Button onClick={() => setIsCustomizingWidgets(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Text Notification Opt-In Dialog */}
      <Dialog open={showOptInDialog} onOpenChange={setShowOptInDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Opt-in for Text Notifications</DialogTitle>
            <DialogDescription>
              Receive important updates and alerts via text message.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Your Mobile Number</Label>
              <Input
                id="phone-number"
                placeholder="(123) 456-7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Standard message and data rates may apply. You can opt out at any time.
              </p>
            </div>
            
            <div className="mt-4 space-y-1">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Business updates and announcements</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Weekly performance summaries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Critical alerts and notifications</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptInDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveTextPreferences} disabled={!phoneNumber}>
              Subscribe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Floating Text Notifications Button */}
      {!textNotifications && (
        <Button
          className="fixed bottom-6 right-6 shadow-lg"
          size="lg"
          onClick={() => setShowOptInDialog(true)}
        >
          <Bell className="h-5 w-5 mr-2" />
          Enable Text Alerts
        </Button>
      )}
    </MainLayout>
  );
  
  // Helper function to render individual widgets based on type
  function renderWidget(widget: WidgetConfig) {
    switch (widget.type) {
      case 'stats':
        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Business Statistics</CardTitle>
              <CardDescription>
                {timeRange === 'custom' ? formatDateRange() : `Showing data for ${timeRange.replace('-', ' ')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Tools Stat */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tools</p>
                      <p className="text-xl font-bold">{stats.totalTools}</p>
                    </div>
                  </div>
                </div>
                
                {/* Cost Stat */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Cost</p>
                      <p className="text-xl font-bold">${stats.totalMonthlyCost}</p>
                    </div>
                  </div>
                </div>
                
                {/* SOPs Stat */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">SOPs</p>
                      <p className="text-xl font-bold">{stats.totalSops}</p>
                    </div>
                  </div>
                </div>
                
                {/* Automation Score */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                      <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automation</p>
                      <p className="text-xl font-bold">
                        {typeof stats.automationScore === 'object' ? 
                          stats.automationScore.score : stats.automationScore}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'activities':
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <Badge>{getEntityName(selectedEntity)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              {isLoadingActivities ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-4 px-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No activities to display
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 3).map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      icon={activity.icon || "event_note"}
                      iconBgClass={`bg-${activity.color || "blue"}-100 dark:bg-${activity.color || "blue"}-900`}
                      iconColor={`text-${activity.color || "blue"}-600 dark:text-${activity.color || "blue"}-400`}
                      description={activity.description}
                      timestamp={formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/activities">
                  View All Activities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 'recommendations':
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recommendations</CardTitle>
                <Badge>{getEntityName(selectedEntity)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-2">
              {isLoadingRecommendations ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex justify-end gap-2 mt-3">
                        <Skeleton className="h-9 w-16" />
                        <Skeleton className="h-9 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No recommendations to display
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.slice(0, 2).map((recommendation) => (
                    <RecommendationItem
                      key={recommendation.id}
                      title={recommendation.title}
                      description={recommendation.description}
                      type={recommendation.type}
                      id={recommendation.id}
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/recommendations">
                  View All Recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 'cost-breakdown':
        return (
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                <Badge>{getEntityName(selectedEntity)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CostBreakdownChart
                data={[
                  { name: "Finance", value: stats.totalMonthlyCost * 0.25, color: "#3B82F6" },
                  { name: "Operations", value: stats.totalMonthlyCost * 0.20, color: "#10B981" },
                  { name: "Marketing", value: stats.totalMonthlyCost * 0.30, color: "#F59E0B" },
                  { name: "Sales", value: stats.totalMonthlyCost * 0.15, color: "#8B5CF6" },
                  { name: "Customer Experience", value: stats.totalMonthlyCost * 0.10, color: "#EC4899" },
                ]}
                timeframe="monthly"
                totalCost={stats.totalMonthlyCost}
              />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/cost-analysis">
                  View Cost Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'cost-forecast':
        return (
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Cost Forecast</CardTitle>
                <Badge>{getEntityName(selectedEntity)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CostForecastChart 
                data={[
                  { name: "Jan", value: stats.totalMonthlyCost * 0.8, projection: stats.totalMonthlyCost * 0.8 },
                  { name: "Feb", value: stats.totalMonthlyCost * 0.9, projection: stats.totalMonthlyCost * 0.9 },
                  { name: "Mar", value: stats.totalMonthlyCost * 0.95, projection: stats.totalMonthlyCost * 0.95 },
                  { name: "Apr", value: stats.totalMonthlyCost, projection: stats.totalMonthlyCost },
                  { name: "May", value: stats.totalMonthlyCost * 1.05, projection: stats.totalMonthlyCost * 1.05 },
                  { name: "Jun", value: stats.totalMonthlyCost * 1.1, projection: stats.totalMonthlyCost * 1.1 },
                  { name: "Jul", value: 0, projection: stats.totalMonthlyCost * 1.15 },
                  { name: "Aug", value: 0, projection: stats.totalMonthlyCost * 1.2 },
                  { name: "Sep", value: 0, projection: stats.totalMonthlyCost * 1.25 },
                  { name: "Oct", value: 0, projection: stats.totalMonthlyCost * 1.3 },
                  { name: "Nov", value: 0, projection: stats.totalMonthlyCost * 1.35 },
                  { name: "Dec", value: 0, projection: stats.totalMonthlyCost * 1.4 },
                ]}
              />
            </CardContent>
          </Card>
        );
      
      case 'sops':
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Standard Operating Procedures</CardTitle>
                <Badge>{getEntityName(selectedEntity)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingSops ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredSops.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No SOPs to display
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSops.slice(0, 3).map((sop) => (
                    <SOPItem
                      key={sop.id}
                      id={sop.id}
                      title={sop.title}
                      category={sop.category}
                      steps={sop.steps.length}
                      createdAt={sop.createdAt}
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/generate-sop">
                  Create New SOP
                  <Plus className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'news':
        return (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Company News & Updates</CardTitle>
                <Badge>{getEntityName(selectedEntity)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {filteredNewsUpdates.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No updates to display
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNewsUpdates.slice(0, 3).map((update) => (
                    <div 
                      key={update.id} 
                      className={`p-4 rounded-lg border ${!update.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold">{update.title}</h3>
                        {update.priority === 'high' && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{update.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(update.date), { addSuffix: true })}
                          {update.entityName && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{update.entityName}</span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {update.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/company-updates">
                  View All Updates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'calendar':
        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
              <CardDescription>
                {format(new Date(), 'MMMM yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/meetings">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Meetings
                </Link>
              </Button>
              <Button asChild>
                <Link href="/schedule">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'summary':
        // Select correct entity name for the summary
        const entityName = selectedEntity === "all" 
          ? "Enterprise-wide" 
          : entities.find(e => e.id === Number(selectedEntity))?.name || "Unknown";
        
        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {entityName} Weekly Summary
              </CardTitle>
              <CardDescription>
                {format(dateRange.from, 'PPP')} - {format(dateRange.to, 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Key Metrics Section */}
                <div>
                  <h3 className="text-base font-medium mb-3">Key Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Sales</span>
                        <div className="mt-1 flex items-center">
                          <span className="text-2xl font-bold mr-2">$24,850</span>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <ChevronUp className="h-3 w-3 mr-1" />
                            8.2%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400">New Customers</span>
                        <div className="mt-1 flex items-center">
                          <span className="text-2xl font-bold mr-2">32</span>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <ChevronUp className="h-3 w-3 mr-1" />
                            12.5%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Customer Support</span>
                        <div className="mt-1 flex items-center">
                          <span className="text-2xl font-bold mr-2">18 tickets</span>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <ChevronUp className="h-3 w-3 mr-1" />
                            4.2%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Highlights Section */}
                <div>
                  <h3 className="text-base font-medium mb-3">Weekly Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span>Successfully launched the summer promotion campaign with 15% better engagement than projected</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span>Onboarded 2 new automation tools that will save approximately 12 hours per week</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <span>Inventory levels for top 3 products are running low; restock orders have been placed</span>
                    </li>
                  </ul>
                </div>
                
                {/* Upcoming Tasks Section */}
                <div>
                  <h3 className="text-base font-medium mb-3">Upcoming Tasks</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <CalendarDays className="h-5 w-5 text-blue-500 mr-3" />
                        <span>Quarterly team review meeting</span>
                      </div>
                      <Badge>July 15</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <Truck className="h-5 w-5 text-green-500 mr-3" />
                        <span>New product inventory arrival</span>
                      </div>
                      <Badge>July 18</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <LineChart className="h-5 w-5 text-purple-500 mr-3" />
                        <span>Marketing performance review</span>
                      </div>
                      <Badge>July 20</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <AreaChart className="mr-2 h-4 w-4" />
                View Detailed Reports
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Widget content</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  }
}