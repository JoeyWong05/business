import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Components
import { CustomProgress } from "@/components/CustomProgress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import chart components
import CostBreakdownChart from "@/components/CostBreakdownChart";
import CostForecastChart from "@/components/CostForecastChart";

// Icons
import {
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  BellRing,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Clipboard,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Gauge,
  Globe,
  Info,
  LayoutDashboard,
  LineChart,
  Megaphone,
  MoreHorizontal,
  PlusCircle,
  Presentation,
  RefreshCw,
  Send,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Wand2,
  Workflow,
  Zap
} from "lucide-react";

// Existing components
import ActivityItem from "@/components/ActivityItem";
import RecommendationItem from "@/components/RecommendationItem";
import SOPItem from "@/components/SOPItem";

interface DashboardSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// DashboardSection component for consistent section styling
const DashboardSection = ({ title, icon, children, className }: DashboardSectionProps) => (
  <div className={cn("mb-6", className)}>
    <div className="flex items-center mb-4">
      <div className="p-1.5 rounded-md bg-primary/10 mr-3">
        {icon}
      </div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    </div>
    {children}
  </div>
);

// Metric Card Component with animated counter
interface MetricCardProps {
  title: string;
  value: number | string;
  secondaryValue?: string;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  trend?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percent";
  link?: string;
  loading?: boolean;
}

const MetricCard = ({
  title,
  value,
  secondaryValue,
  change,
  icon,
  color = "primary",
  trend = "neutral",
  format = "number",
  link,
  loading = false
}: MetricCardProps) => {
  const [displayValue, setDisplayValue] = useState<number | string>(0);
  
  // Format the value based on the format type
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case "currency":
        return `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case "percent":
        return `${val}%`;
      default:
        return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
  };
  
  // Animate the counter on mount
  useEffect(() => {
    if (loading || typeof value === 'string') {
      setDisplayValue(value);
      return;
    }
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    let start = 0;
    const increment = numValue / 30; // Divide by number of steps
    const timer = setInterval(() => {
      start += increment;
      if (start >= numValue) {
        clearInterval(timer);
        setDisplayValue(numValue);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [value, loading]);
  
  const colorMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
    red: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  };
  
  const trendIcon = trend === "up" ? (
    <TrendingUp className="h-4 w-4 text-green-500" />
  ) : trend === "down" ? (
    <TrendingDown className="h-4 w-4 text-red-500" />
  ) : null;
  
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500";

  const cardContent = (
    <>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        <div className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center",
          colorMap[color as keyof typeof colorMap] || colorMap.primary
        )}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        {loading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <h3 className="text-2xl font-bold tracking-tight">
            {formatValue(displayValue)}
          </h3>
        )}
        {secondaryValue && (
          <p className="text-sm text-muted-foreground">{secondaryValue}</p>
        )}
        {typeof change === 'number' && (
          <div className="flex items-center mt-2">
            {trendIcon}
            <span className={cn("text-sm font-medium ml-1", trendColor)}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-muted-foreground ml-2">vs last period</span>
          </div>
        )}
      </div>
    </>
  );
  
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {link ? (
          <Link href={link} className="block h-full hover:no-underline">
            {cardContent}
          </Link>
        ) : (
          cardContent
        )}
      </CardContent>
    </Card>
  );
};

// Chart Card Component
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  legend?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

const ChartCard = ({ title, children, legend, action, footer }: ChartCardProps) => (
  <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="px-5 py-4 flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-base font-medium">{title}</CardTitle>
      <div className="flex items-center space-x-2">
        {legend}
        {action}
      </div>
    </CardHeader>
    <CardContent className="px-5 pb-4">
      {children}
    </CardContent>
    {footer && <CardFooter className="px-5 py-3 bg-muted/30 border-t">{footer}</CardFooter>}
  </Card>
);

// Activity Feed Component
interface ActivityFeedProps {
  activities: any[];
  loading: boolean;
}

const ActivityFeed = ({ activities, loading }: ActivityFeedProps) => (
  <div className="space-y-5">
    {loading ? (
      Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-start">
          <Skeleton className="h-8 w-8 rounded-full mr-3" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))
    ) : activities.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <p>No recent activities to display.</p>
      </div>
    ) : (
      activities.map((activity, idx) => <ActivityItem key={idx} activity={activity} />)
    )}
  </div>
);

// Quick Actions Component
interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
    {actions.map((action) => (
      <Button 
        key={action.id} 
        variant="outline" 
        className="h-auto py-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50"
        asChild
      >
        <Link href={action.href}>
          <div>{action.icon}</div>
          <span className="text-xs font-medium">{action.label}</span>
        </Link>
      </Button>
    ))}
  </div>
);

export default function FomscDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("this-month");
  const { userRole } = useUserRole();
  const { toast } = useToast();
  
  // Fetch business entities
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery<{entities: any[]}>({
    queryKey: ['/api/business-entities'],
  });
  
  // Fetch dashboard statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery<{stats: any}>({
    queryKey: ['/api/dashboard-stats'],
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<{categories: any[]}>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch social media dashboard data
  const { data: socialData, isLoading: isLoadingSocial } = useQuery<{data: any}>({
    queryKey: ['/api/social-dashboard'],
  });

  // Fetch recent activities
  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery<{activities: any[]}>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const res = await fetch('/api/activities?limit=5');
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    },
  });

  // Fetch SOPs
  const { data: sopsData, isLoading: isLoadingSops } = useQuery<{sops: any[]}>({
    queryKey: ['/api/sops'],
  });

  // Fetch recommendations
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useQuery<{recommendations: any[]}>({
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
    automationScore: 0,
    monthlyRevenue: 45000,
    valuationMultiple: 5.2,
    marketingCampaigns: 12,
    activeLeads: 35,
    customerCount: 108
  };

  const activities = activitiesData?.activities || [];
  const entities = entitiesData?.entities || [];
  
  // Social media engagement summary
  const socialStats = socialData?.data || {
    totalFollowers: 0,
    weeklyEngagement: 0,
    topPlatform: 'None'
  };
  
  // Calculate valuation based on revenue * multiple
  const valuation = (stats.monthlyRevenue || 45000) * 12 * (stats.valuationMultiple || 5);
  
  // Quick Actions
  const quickActions: QuickAction[] = [
    { 
      id: 'create-sop', 
      label: 'Create SOP', 
      icon: <FileText className="h-5 w-5" />,
      href: '/generate-sop' 
    },
    { 
      id: 'manage-projects', 
      label: 'Projects', 
      icon: <Clipboard className="h-5 w-5" />,
      href: '/projects' 
    },
    { 
      id: 'add-campaign', 
      label: 'Add Campaign', 
      icon: <Megaphone className="h-5 w-5" />,
      href: '/campaigns' 
    },
    { 
      id: 'valuation-report', 
      label: 'Valuation Report', 
      icon: <LineChart className="h-5 w-5" />,
      href: '/business-valuation' 
    },
    { 
      id: 'investor-update', 
      label: 'Investor Update', 
      icon: <Presentation className="h-5 w-5" />,
      href: '/partner-portal' 
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6 pt-4">
      {/* Top Header Strip */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {userRole || 'Admin'}</h1>
          <p className="text-md text-muted-foreground">Here's your business snapshot – {format(new Date(), "MMMM d, yyyy")}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              {entities.map((entity: any) => (
                <SelectItem key={entity.id} value={entity.id.toString()}>{entity.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge className="bg-primary-foreground hover:bg-primary-foreground/90 text-sm px-2.5 py-1 gap-1.5 flex items-center" variant="outline">
            <Gauge className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">Automation Score: {typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore}%</span>
          </Badge>
          
          <Badge className="bg-amber-100 hover:bg-amber-100/90 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 gap-1.5 flex items-center" variant="outline">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Valuation up 12% – great job!</span>
          </Badge>
        </div>
      </div>
      
      {/* Quick Actions Panel */}
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-md font-semibold flex items-center">
            <Zap className="h-4 w-4 mr-2 text-primary" />
            Quick Actions
          </h2>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Customize
          </Button>
        </div>
        <QuickActions actions={quickActions} />
      </div>
      
      {/* FOMSC Dashboard Sections */}
      
      {/* Finance Section */}
      <DashboardSection title="Finance Overview" icon={<CircleDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="MTD Revenue"
            value={stats.monthlyRevenue || 45000}
            secondaryValue="$540K YTD"
            icon={<DollarSign className="h-5 w-5" />}
            format="currency"
            color="blue"
            trend="up"
            change={8.3}
            loading={isLoadingStats}
            link="/financial-health"
          />
          
          <MetricCard
            title="Valuation Estimate"
            value={valuation}
            secondaryValue={`${stats.valuationMultiple || 5.2}x Annual Revenue`}
            icon={<TrendingUp className="h-5 w-5" />}
            format="currency"
            color="blue"
            trend="up"
            change={12}
            loading={isLoadingStats}
            link="/business-valuation"
          />
          
          <ChartCard
            title="P&L Snapshot"
            action={
              <Button size="sm" variant="ghost" asChild>
                <Link href="/profit-loss">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Revenue</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">$45,000</span>
                </div>
                <CustomProgress value={100} className="h-2 bg-muted" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expenses</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">$32,450</span>
                </div>
                <CustomProgress value={72} className="h-2 bg-muted" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profit</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">$12,550</span>
                </div>
                <CustomProgress value={28} className="h-2 bg-muted" color="blue" />
              </div>
              
              <div className="pt-2 flex justify-between items-center text-sm text-muted-foreground">
                <span>Profit Margin: 28%</span>
                <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">+2.4%</Badge>
              </div>
            </div>
          </ChartCard>
        </div>
      </DashboardSection>
      
      {/* Operations Section */}
      <DashboardSection title="Operations Insights" icon={<Workflow className="h-5 w-5 text-green-600 dark:text-green-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="SOP Completion"
            value="78"
            secondaryValue={`${stats.totalSops} SOPs created`}
            icon={<FileText className="h-5 w-5" />}
            format="percent"
            color="green"
            loading={isLoadingStats}
            link="/generate-sop"
          />
          
          <MetricCard
            title="Automation Score"
            value={typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore}
            secondaryValue="12 opportunity areas"
            icon={<Gauge className="h-5 w-5" />}
            format="percent"
            color="green"
            trend="up"
            change={5.2}
            loading={isLoadingStats}
            link="/department-automation"
          />
          
          <ChartCard
            title="Tools & Integrations"
            action={
              <Button size="sm" variant="ghost" asChild>
                <Link href="/tools-integration">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 mb-1">
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <span className="text-xl font-semibold mb-1">{stats.totalTools}</span>
                  <span className="text-xs text-muted-foreground">Total Tools</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <span className="text-xl font-semibold mb-1">68%</span>
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <span className="text-xl font-semibold mb-1">${stats.totalMonthlyCost}</span>
                  <span className="text-xs text-muted-foreground">Monthly</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Finance</span>
                </div>
                <span className="font-medium">3 tools</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Operations</span>
                </div>
                <span className="font-medium">2 tools</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Marketing</span>
                </div>
                <span className="font-medium">4 tools</span>
              </div>
            </div>
          </ChartCard>
        </div>
      </DashboardSection>
      
      {/* Marketing Section */}
      <DashboardSection title="Marketing Performance" icon={<Megaphone className="h-5 w-5 text-amber-600 dark:text-amber-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Campaign Stats"
            value={stats.marketingCampaigns || 12}
            secondaryValue="32% avg open rate"
            icon={<Megaphone className="h-5 w-5" />}
            color="amber"
            loading={isLoadingStats}
            link="/campaigns"
          />
          
          <MetricCard
            title="SEO Performance"
            value="185"
            secondaryValue="+23 keyword rankings"
            icon={<Globe className="h-5 w-5" />}
            color="amber"
            trend="up"
            change={12.5}
            loading={isLoadingStats || isLoadingSocial}
            link="/seo-intelligence"
          />
          
          <ChartCard
            title="Social Engagement"
            action={
              <Button size="sm" variant="ghost" asChild>
                <Link href="/social-media">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 mb-1">
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <span className="text-xl font-semibold mb-1">{socialStats.totalFollowers || 8432}</span>
                  <span className="text-xs text-muted-foreground">Total Followers</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <span className="text-xl font-semibold mb-1">+{socialStats.weeklyEngagement || 18}%</span>
                  <span className="text-xs text-muted-foreground">Engagement</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Instagram</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300">Top</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>TikTok</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-300">Growing</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span>LinkedIn</span>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300">B2B Focus</Badge>
              </div>
            </div>
          </ChartCard>
        </div>
      </DashboardSection>
      
      {/* Sales Section */}
      <DashboardSection title="Sales Dashboard" icon={<LineChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Lead Pipeline"
            value={stats.activeLeads || 35}
            secondaryValue="$124K potential value"
            icon={<Users className="h-5 w-5" />}
            color="purple"
            loading={isLoadingStats}
            link="/sales-dashboard"
          />
          
          <ChartCard
            title="Orders by Channel"
            action={
              <Button size="sm" variant="ghost" asChild>
                <Link href="/omni-channel-sales">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Website</span>
                </div>
                <span className="font-medium">42%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                  <span>TikTok Shop</span>
                </div>
                <span className="font-medium">28%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Amazon</span>
                </div>
                <span className="font-medium">18%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Other</span>
                </div>
                <span className="font-medium">12%</span>
              </div>
            </div>
          </ChartCard>
          
          <ChartCard
            title="Conversion Funnel"
            action={
              <Button size="sm" variant="ghost" asChild>
                <Link href="/sales-funnel">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Visitors</span>
                  <span className="text-sm font-medium">8,432</span>
                </div>
                <CustomProgress value={100} className="h-2.5 bg-muted" color="blue" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Product Views</span>
                  <span className="text-sm font-medium">2,543</span>
                </div>
                <CustomProgress value={30} className="h-2.5 bg-muted" color="green" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Add to Cart</span>
                  <span className="text-sm font-medium">764</span>
                </div>
                <CustomProgress value={9} className="h-2.5 bg-muted" color="amber" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Purchases</span>
                  <span className="text-sm font-medium">345</span>
                </div>
                <CustomProgress value={4} className="h-2.5 bg-muted" color="purple" />
              </div>
            </div>
          </ChartCard>
        </div>
      </DashboardSection>
      
      {/* Customer Section */}
      <DashboardSection title="Customer Insights" icon={<Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="CRM Status"
            value={stats.customerCount || 108}
            secondaryValue="22 new this month"
            icon={<Users className="h-5 w-5" />}
            color="pink"
            trend="up"
            change={10.8}
            loading={isLoadingStats}
            link="/client-management"
          />
          
          <ChartCard
            title="Customer Feedback"
            action={
              <Button size="sm" variant="ghost" asChild>
                <Link href="/customer-feedback">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold">NPS Score: 68</span>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Good</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Promoters</span>
                  </div>
                  <span className="font-medium">72%</span>
                </div>
                <CustomProgress value={72} className="h-2 bg-muted" color="green" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Neutral</span>
                  </div>
                  <span className="font-medium">18%</span>
                </div>
                <CustomProgress value={18} className="h-2 bg-muted" color="amber" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Detractors</span>
                  </div>
                  <span className="font-medium">10%</span>
                </div>
                <CustomProgress value={10} className="h-2 bg-muted" color="red" />
              </div>
            </div>
          </ChartCard>
          
          <ChartCard
            title="Customer Value"
            action={
              <Button size="sm" variant="ghost" asChild>
                <Link href="/customer-segments">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Avg. Lifetime Value</span>
                <span className="text-lg font-bold">$2,845</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tier 1 - Premium</span>
                  <span className="font-medium">$5,200+ LTV</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>24 customers</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tier 2 - Regular</span>
                  <span className="font-medium">$1,800-$5,200 LTV</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>58 customers</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Tier 3 - New</span>
                  <span className="font-medium">$0-$1,800 LTV</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>26 customers</span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </DashboardSection>
      
      {/* Activity Feed Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
              <div className="flex items-center">
                <Tabs defaultValue="all" className="w-[300px]">
                  <TabsList className="grid grid-cols-5 h-8">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="finance" className="text-xs">Finance</TabsTrigger>
                    <TabsTrigger value="ops" className="text-xs">Ops</TabsTrigger>
                    <TabsTrigger value="marketing" className="text-xs">Marketing</TabsTrigger>
                    <TabsTrigger value="partner" className="text-xs">Partner</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <ActivityFeed activities={activities} loading={isLoadingActivities} />
            </CardContent>
            <CardFooter className="pt-0 border-t flex justify-center">
              <Button variant="link" size="sm" asChild>
                <Link href="/activity-log">
                  View all activity
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Recommendations</CardTitle>
                <Badge variant="outline" className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">{recommendationsData?.recommendations?.length || 0} pending</Badge>
              </div>
              <CardDescription>AI-powered business suggestions</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              {isLoadingRecommendations ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="mb-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5 mt-1" />
                  </div>
                ))
              ) : (recommendationsData?.recommendations?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Sparkles className="h-10 w-10 mb-2 text-amber-500/50" />
                  <p>No new recommendations</p>
                  <p className="text-sm">Check back later for AI insights.</p>
                </div>
              ) : (
                recommendationsData?.recommendations?.slice(0, 3).map((recommendation: any, idx: number) => (
                  <RecommendationItem 
                    key={idx}
                    id={recommendation.id || idx}
                    title={recommendation.title || ''}
                    description={recommendation.description || ''}
                    priority={recommendation.priority || 'medium'}
                    status={recommendation.status || 'pending'}
                  />
                ))
              ))}
            </CardContent>
            <CardFooter className="pt-0 border-t flex justify-center">
              <Button variant="link" size="sm" asChild>
                <Link href="/recommendations">
                  View all recommendations
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}