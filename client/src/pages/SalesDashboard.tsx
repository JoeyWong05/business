import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart2, 
  BarChart3,
  Calendar, 
  ChevronDown, 
  Clock, 
  DollarSign, 
  Filter,
  ListFilter, 
  MoreHorizontal, 
  PercentCircle, 
  PieChart as PieChartIcon,
  Plus, 
  Star, 
  Tag, 
  Target, 
  TrendingUp, 
  User, 
  Users,
  UserCircle,
  ClipboardCheck, 
  EyeIcon, 
  Briefcase, 
  Settings,
  LineChart as LineChartIcon,
  BarChart4,
  CircleCheck,
  CircleX,
  AlertTriangle,
  FileSpreadsheet
} from "lucide-react";

// Import custom card components
import SalesDashboardComponents from "@/components/SalesDashboardCard";
const { SalesDashboardCard, DealCard, DealProgressCard } = SalesDashboardComponents;

// Define pipeline stage types
enum SalesPipelineStage {
  LEAD = 'lead',
  CONTACTED = 'contacted',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
  ON_HOLD = 'on_hold'
}

// Define priority types
enum SalesPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Define deal types
enum DealType {
  NEW_BUSINESS = 'new_business',
  RENEWAL = 'renewal',
  EXPANSION = 'expansion',
  UPSELL = 'upsell',
  CROSS_SELL = 'cross_sell',
  PARTNERSHIP = 'partnership'
}

// Define deal source types
enum DealSource {
  WEBSITE = 'website',
  COLD_CALL = 'cold_call',
  EMAIL = 'email',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  EVENT = 'event',
  PARTNER = 'partner',
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  ORGANIC = 'organic',
  PAID_ADVERTISING = 'paid_advertising'
}

// Define sales deal interface
interface SalesDeal {
  id: number;
  dealNumber: string;
  title: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  stage: SalesPipelineStage;
  value: string | number; // Server sends it as string, but we treat it as number
  probability: number;
  priority: SalesPriority;
  expectedCloseDate: string;
  type: DealType;
  source: DealSource;
  tags: string[];
  notes?: string;
  assignedTo: number;
  assignedToName?: string;
  lastActivity?: string;
  businessEntityId: number; // From backend
  createdAt: string;
  updatedAt: string;
}

// Define business entity interface
interface BusinessEntity {
  id: number;
  name: string;
  type: string;
  slug: string;
}

// Define sales pipeline data interface
interface SalesPipelineData {
  deals: SalesDeal[];
  entities: BusinessEntity[];
  summary: {
    totalValue: number;
    totalDeals: number;
    avgDealValue: number;
    avgDealCycle: number;
    winRate: number;
    conversions: {
      lead: number;
      contacted: number;
      proposal: number;
      negotiation: number;
      closed: number;
    };
    monthlyTrend: {
      month: string;
      value: number;
      deals: number;
    }[];
  };
  forecast: {
    thisMonth: number;
    nextMonth: number;
    quarter: number;
  };
}

// Define tab types
type SalesDashboardTabType = "pipeline" | "forecast" | "analytics" | "activities" | "clients";
type DealStageFilter = "all" | SalesPipelineStage;
type DealPriorityFilter = "all" | SalesPriority;
type DealTypeFilter = "all" | DealType;

export default function SalesDashboard() {
  // State for filters and tabs
  const [activeTab, setActiveTab] = useState<SalesDashboardTabType>("pipeline");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<DealStageFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<DealPriorityFilter>("all");
  const [dealTypeFilter, setDealTypeFilter] = useState<DealTypeFilter>("all");
  
  // Fetch sales pipeline data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/sales-pipeline"],
    queryFn: async () => await apiRequest("/api/sales-pipeline")
  });
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <DollarSign className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading sales data...</p>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-destructive/10 p-6 rounded-lg max-w-md text-center">
          <p className="text-destructive font-semibold mb-2">Failed to load sales data</p>
          <p className="text-muted-foreground">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }
  
  // Get sales data from API response
  const salesData: SalesPipelineData = data?.data || {
    deals: [],
    entities: [],
    summary: {
      totalValue: 0,
      totalDeals: 0,
      avgDealValue: 0,
      avgDealCycle: 0,
      winRate: 0,
      conversions: {
        lead: 0,
        contacted: 0,
        proposal: 0,
        negotiation: 0,
        closed: 0
      },
      monthlyTrend: []
    },
    forecast: {
      thisMonth: 0,
      nextMonth: 0,
      quarter: 0
    }
  };
  
  // Get filtered deals
  const filteredDeals = salesData.deals.filter(deal => {
    // Filter by entity if not "all"
    if (selectedEntity !== "all" && deal.businessEntityId.toString() !== selectedEntity) {
      return false;
    }
    
    // Filter by stage if not "all"
    if (stageFilter !== "all" && deal.stage !== stageFilter) {
      return false;
    }
    
    // Filter by priority if not "all"
    if (priorityFilter !== "all" && deal.priority !== priorityFilter) {
      return false;
    }
    
    // Filter by deal type if not "all"
    if (dealTypeFilter !== "all" && deal.type !== dealTypeFilter) {
      return false;
    }
    
    return true;
  });
  
  // Helper function to convert string|number to number for calculations
  const toNumber = (value: string | number): number => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  };
  
  // Helper function to find entity name by ID
  const getEntityNameById = (entityId: number): string => {
    const entity = salesData.entities.find(e => e.id === entityId);
    return entity ? entity.name : '';
  };
  
  // Calculate summary for filtered deals
  const filteredSummary = {
    totalValue: filteredDeals.reduce((sum, deal) => sum + toNumber(deal.value), 0),
    totalDeals: filteredDeals.length,
    activeDeals: filteredDeals.filter(deal => 
      deal.stage !== SalesPipelineStage.CLOSED_WON && 
      deal.stage !== SalesPipelineStage.CLOSED_LOST
    ).length,
    wonDeals: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.CLOSED_WON).length,
    lostDeals: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.CLOSED_LOST).length,
  };
  
  // Prepare data for stage distribution chart
  const stageDistributionData = [
    { name: "Lead", value: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.LEAD).length },
    { name: "Contacted", value: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.CONTACTED).length },
    { name: "Proposal", value: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.PROPOSAL).length },
    { name: "Negotiation", value: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.NEGOTIATION).length },
    { name: "Won", value: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.CLOSED_WON).length },
    { name: "Lost", value: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.CLOSED_LOST).length },
    { name: "On Hold", value: filteredDeals.filter(deal => deal.stage === SalesPipelineStage.ON_HOLD).length },
  ].filter(item => item.value > 0);
  
  // Prepare data for entity distribution chart
  const entityDistributionData = salesData.entities.map(entity => ({
    name: entity.name,
    value: filteredDeals.filter(deal => deal.businessEntityId === entity.id).length
  })).filter(item => item.value > 0);
  
  // Prepare colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#A28AFF'];
  
  // Helper function to get status badge
  const getStageBadge = (stage: SalesPipelineStage) => {
    switch (stage) {
      case SalesPipelineStage.LEAD:
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">Lead</Badge>;
      case SalesPipelineStage.CONTACTED:
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-50">Contacted</Badge>;
      case SalesPipelineStage.PROPOSAL:
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">Proposal</Badge>;
      case SalesPipelineStage.NEGOTIATION:
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50">Negotiation</Badge>;
      case SalesPipelineStage.CLOSED_WON:
        return <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Closed (Won)</Badge>;
      case SalesPipelineStage.CLOSED_LOST:
        return <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">Closed (Lost)</Badge>;
      case SalesPipelineStage.ON_HOLD:
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 hover:bg-gray-50">On Hold</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };
  
  // Helper function to get priority badge
  const getPriorityBadge = (priority: SalesPriority) => {
    switch (priority) {
      case SalesPriority.LOW:
        return <Badge variant="outline" className="bg-sky-50 text-sky-600 hover:bg-sky-50">Low</Badge>;
      case SalesPriority.MEDIUM:
        return <Badge variant="outline" className="bg-violet-50 text-violet-600 hover:bg-violet-50">Medium</Badge>;
      case SalesPriority.HIGH:
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50">High</Badge>;
      case SalesPriority.URGENT:
        return <Badge variant="outline" className="bg-rose-50 text-rose-600 hover:bg-rose-50">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Track your sales pipeline, forecast, and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            Last 30 Days
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button className="gap-1" size="sm">
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </div>
      </div>
      
      {/* Key metrics cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <SalesDashboardCard
          title="Pipeline Value"
          value={formatCurrency(filteredSummary.totalValue)}
          description={`From ${filteredSummary.totalDeals} active deals`}
          trend={{ value: 12, isPositive: true }}
          icon={<DollarSign className="h-4 w-4" />}
          variant="success"
        />

        <SalesDashboardCard
          title="Win Rate"
          value={`${salesData.summary.winRate}%`}
          description="Based on last 30 days"
          trend={{ value: 5, isPositive: true }}
          icon={<Target className="h-4 w-4" />}
          variant="info"
        />

        <SalesDashboardCard
          title="Avg. Deal Size"
          value={formatCurrency(salesData.summary.avgDealValue)}
          description={`${salesData.summary.totalDeals} deals analyzed`}
          trend={{ value: 3, isPositive: false }}
          icon={<PercentCircle className="h-4 w-4" />}
          variant="neutral"
        />

        <SalesDashboardCard
          title="Forecast This Month"
          value={formatCurrency(salesData.forecast.thisMonth)}
          description={`vs. ${formatCurrency(salesData.forecast.nextMonth)} next month`}
          trend={{ value: 18, isPositive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
          variant="warning"
        />
      </div>
      
      {/* Filters section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select value={selectedEntity} onValueChange={setSelectedEntity}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {salesData.entities.map((entity) => (
              <SelectItem key={entity.id} value={entity.id.toString()}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={stageFilter} onValueChange={(value) => setStageFilter(value as DealStageFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value={SalesPipelineStage.LEAD}>Lead</SelectItem>
            <SelectItem value={SalesPipelineStage.CONTACTED}>Contacted</SelectItem>
            <SelectItem value={SalesPipelineStage.PROPOSAL}>Proposal</SelectItem>
            <SelectItem value={SalesPipelineStage.NEGOTIATION}>Negotiation</SelectItem>
            <SelectItem value={SalesPipelineStage.CLOSED_WON}>Closed (Won)</SelectItem>
            <SelectItem value={SalesPipelineStage.CLOSED_LOST}>Closed (Lost)</SelectItem>
            <SelectItem value={SalesPipelineStage.ON_HOLD}>On Hold</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as DealPriorityFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value={SalesPriority.LOW}>Low</SelectItem>
            <SelectItem value={SalesPriority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={SalesPriority.HIGH}>High</SelectItem>
            <SelectItem value={SalesPriority.URGENT}>Urgent</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={dealTypeFilter} onValueChange={(value) => setDealTypeFilter(value as DealTypeFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Deal Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deal Types</SelectItem>
            <SelectItem value={DealType.NEW_BUSINESS}>New Business</SelectItem>
            <SelectItem value={DealType.RENEWAL}>Renewal</SelectItem>
            <SelectItem value={DealType.EXPANSION}>Expansion</SelectItem>
            <SelectItem value={DealType.UPSELL}>Upsell</SelectItem>
            <SelectItem value={DealType.CROSS_SELL}>Cross-sell</SelectItem>
            <SelectItem value={DealType.PARTNERSHIP}>Partnership</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SalesDashboardTabType)}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
          <TabsTrigger value="pipeline">
            <Briefcase className="h-4 w-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <TrendingUp className="h-4 w-4 mr-2" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="activities" className="hidden lg:flex">
            <Clock className="h-4 w-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="clients" className="hidden lg:flex">
            <Users className="h-4 w-4 mr-2" />
            Clients
          </TabsTrigger>
        </TabsList>
        
        {/* Pipeline tab content */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader className="py-4">
              <div className="flex justify-between items-center">
                <CardTitle>Sales Pipeline</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Advanced Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Deal</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="hidden md:table-cell">Close Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Probability</TableHead>
                      <TableHead className="hidden sm:table-cell">Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No deals found matching current filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDeals.map((deal) => (
                        <TableRow key={deal.id}>
                          <TableCell>
                            <div className="font-medium">{deal.title}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <span>{deal.companyName}</span>
                              <span className="text-xs">•</span>
                              <span className="text-xs">{getEntityNameById(deal.businessEntityId)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStageBadge(deal.stage)}</TableCell>
                          <TableCell>{formatCurrency(toNumber(deal.value))}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(deal.expectedCloseDate)}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Progress value={deal.probability} className="h-2 w-20" />
                              <span className="text-sm">{deal.probability}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">{getPriorityBadge(deal.priority)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <EyeIcon className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Pipeline distribution charts */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deal Stage Distribution</CardTitle>
                <CardDescription>
                  Overview of deals by current stage
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stageDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sales by Entity</CardTitle>
                <CardDescription>
                  Distribution of deals across business entities
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {entityDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={entityDistributionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" name="Deals" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No data available for the selected filters.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Forecast tab content */}
        <TabsContent value="forecast" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Forecast</CardTitle>
                  <CardDescription>
                    Projected revenue for upcoming periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium leading-none">This Month</div>
                        <div className="text-sm text-muted-foreground">Mar 2025</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{formatCurrency(salesData.forecast.thisMonth)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium leading-none">Next Month</div>
                        <div className="text-sm text-muted-foreground">Apr 2025</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{formatCurrency(salesData.forecast.nextMonth)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium leading-none">This Quarter</div>
                        <div className="text-sm text-muted-foreground">Q1 2025</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{formatCurrency(salesData.forecast.quarter)}</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="pt-2">
                      <div className="space-y-1">
                        <div className="text-sm font-medium leading-none flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Forecast Accuracy
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Based on historical data and current pipeline
                          </div>
                          <div className="font-medium">87%</div>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Deals in Pipeline</CardTitle>
                  <CardDescription>
                    Biggest opportunities by value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {filteredDeals
                      .sort((a, b) => toNumber(b.value) - toNumber(a.value))
                      .slice(0, 5)
                      .map((deal) => (
                        <div key={deal.id} className="flex gap-4 items-start">
                          <div className="bg-primary/10 p-3 rounded-md text-primary">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{deal.title}</div>
                              <div className="font-bold">{formatCurrency(toNumber(deal.value))}</div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="text-muted-foreground">{deal.companyName}</div>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-muted-foreground">{formatDate(deal.expectedCloseDate)}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <div>{getStageBadge(deal.stage)}</div>
                              <div className="flex items-center">
                                <PercentCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-muted-foreground">{deal.probability}% probability</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                  <CardDescription>
                    Historical and projected revenue by month
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData.summary.monthlyTrend}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <RechartsTooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Deals by Close Date</CardTitle>
                  <CardDescription>
                    Expected deal closings by month
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-medium text-sm mb-3 px-2">March 2025</h4>
                      <div className="space-y-2">
                        {filteredDeals
                          .filter(deal => {
                            const closeDate = new Date(deal.expectedCloseDate);
                            return closeDate.getMonth() === 2 && closeDate.getFullYear() === 2025;
                          })
                          .map(deal => (
                            <div key={deal.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                              <div className="hidden sm:block w-16 text-xs text-muted-foreground">
                                {new Date(deal.expectedCloseDate).getDate()} Mar
                              </div>
                              <div className="flex-1 truncate">
                                <div className="font-medium text-sm">{deal.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{deal.companyName}</div>
                              </div>
                              <div className="ml-auto font-medium">{formatCurrency(toNumber(deal.value))}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-3 px-2">April 2025</h4>
                      <div className="space-y-2">
                        {filteredDeals
                          .filter(deal => {
                            const closeDate = new Date(deal.expectedCloseDate);
                            return closeDate.getMonth() === 3 && closeDate.getFullYear() === 2025;
                          })
                          .map(deal => (
                            <div key={deal.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                              <div className="hidden sm:block w-16 text-xs text-muted-foreground">
                                {new Date(deal.expectedCloseDate).getDate()} Apr
                              </div>
                              <div className="flex-1 truncate">
                                <div className="font-medium text-sm">{deal.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{deal.companyName}</div>
                              </div>
                              <div className="ml-auto font-medium">{formatCurrency(toNumber(deal.value))}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-3 px-2">May 2025</h4>
                      <div className="space-y-2">
                        {filteredDeals
                          .filter(deal => {
                            const closeDate = new Date(deal.expectedCloseDate);
                            return closeDate.getMonth() === 4 && closeDate.getFullYear() === 2025;
                          })
                          .map(deal => (
                            <div key={deal.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                              <div className="hidden sm:block w-16 text-xs text-muted-foreground">
                                {new Date(deal.expectedCloseDate).getDate()} May
                              </div>
                              <div className="flex-1 truncate">
                                <div className="font-medium text-sm">{deal.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{deal.companyName}</div>
                              </div>
                              <div className="ml-auto font-medium">{formatCurrency(toNumber(deal.value))}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Analytics tab content */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Sales Performance Trends</CardTitle>
                <CardDescription>
                  Analysis of sales metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {salesData.summary.monthlyTrend && salesData.summary.monthlyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData.summary.monthlyTrend}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000}k`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}`} />
                      <RechartsTooltip formatter={(value, name) => {
                        return name === 'Revenue' 
                          ? formatCurrency(value as number) 
                          : value;
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="deals" name="Deals" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <BarChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2">No monthly trend data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>
                  Pipeline stage conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Lead → Contacted</div>
                      <div className="text-sm font-medium">{salesData.summary.conversions.lead}%</div>
                    </div>
                    <Progress value={salesData.summary.conversions.lead} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Contacted → Proposal</div>
                      <div className="text-sm font-medium">{salesData.summary.conversions.contacted}%</div>
                    </div>
                    <Progress value={salesData.summary.conversions.contacted} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Proposal → Negotiation</div>
                      <div className="text-sm font-medium">{salesData.summary.conversions.proposal}%</div>
                    </div>
                    <Progress value={salesData.summary.conversions.proposal} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Negotiation → Closed</div>
                      <div className="text-sm font-medium">{salesData.summary.conversions.negotiation}%</div>
                    </div>
                    <Progress value={salesData.summary.conversions.negotiation} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">Overall Win Rate</div>
                      <div className="text-sm font-medium">{salesData.summary.conversions.closed}%</div>
                    </div>
                    <Progress value={salesData.summary.conversions.closed} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Deal Sources</CardTitle>
                <CardDescription>
                  Distribution by acquisition channel
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                {filteredDeals.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Website", value: filteredDeals.filter(d => d.source === DealSource.WEBSITE).length },
                          { name: "Referral", value: filteredDeals.filter(d => d.source === DealSource.REFERRAL).length },
                          { name: "Cold Call", value: filteredDeals.filter(d => d.source === DealSource.COLD_CALL).length },
                          { name: "Email", value: filteredDeals.filter(d => d.source === DealSource.EMAIL).length },
                          { name: "Social", value: filteredDeals.filter(d => d.source === DealSource.SOCIAL_MEDIA).length },
                          { name: "Events", value: filteredDeals.filter(d => d.source === DealSource.EVENT).length },
                          { name: "Partner", value: filteredDeals.filter(d => d.source === DealSource.PARTNER).length },
                          { name: "Other", value: filteredDeals.filter(d => 
                            ![DealSource.WEBSITE, DealSource.REFERRAL, DealSource.COLD_CALL, 
                              DealSource.EMAIL, DealSource.SOCIAL_MEDIA, DealSource.EVENT, 
                              DealSource.PARTNER].includes(d.source)).length },
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stageDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <PieChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2">No deal source data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Deal Types</CardTitle>
                <CardDescription>
                  Distribution by transaction type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                {filteredDeals.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "New Business", value: filteredDeals.filter(d => d.type === DealType.NEW_BUSINESS).length },
                          { name: "Renewal", value: filteredDeals.filter(d => d.type === DealType.RENEWAL).length },
                          { name: "Expansion", value: filteredDeals.filter(d => d.type === DealType.EXPANSION).length },
                          { name: "Upsell", value: filteredDeals.filter(d => d.type === DealType.UPSELL).length },
                          { name: "Cross-sell", value: filteredDeals.filter(d => d.type === DealType.CROSS_SELL).length },
                          { name: "Partnership", value: filteredDeals.filter(d => d.type === DealType.PARTNERSHIP).length },
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stageDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <PieChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2">No deal type data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Activities tab content - simplified for this implementation */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales Activities</CardTitle>
              <CardDescription>
                Latest actions and events across your sales pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {filteredDeals.slice(0, 5).map(deal => (
                  <div key={deal.id} className="flex gap-4">
                    <div className="relative mt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <ClipboardCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 top-8 flex justify-center">
                        <div className="w-px bg-border" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-sm font-medium">{deal.lastActivity || `Updated stage to ${deal.stage}`}</div>
                      <div className="text-sm text-muted-foreground">
                        {deal.title} - {deal.companyName}
                      </div>
                      <div className="flex items-center pt-1 text-xs text-muted-foreground">
                        <User className="mr-1 h-3 w-3" />
                        <span>{deal.assignedToName || `User ${deal.assignedTo}`}</span>
                        <span className="mx-1">•</span>
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{formatDate(deal.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Clients tab content - simplified for this implementation */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Clients</CardTitle>
              <CardDescription>
                Companies with the highest revenue potential
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Active Deals</TableHead>
                      <TableHead className="hidden md:table-cell">Total Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Group deals by company and show top 5 */}
                    {Array.from(
                      new Set(filteredDeals.map(deal => deal.companyName))
                    ).slice(0, 5).map(companyName => {
                      const companyDeals = filteredDeals.filter(deal => deal.companyName === companyName);
                      const firstDeal = companyDeals[0];
                      const totalValue = companyDeals.reduce((sum, deal) => sum + toNumber(deal.value), 0);
                      
                      return (
                        <TableRow key={companyName}>
                          <TableCell>
                            <div className="font-medium">{companyName}</div>
                            <div className="text-sm text-muted-foreground">{getEntityNameById(firstDeal.businessEntityId)}</div>
                          </TableCell>
                          <TableCell>
                            <div>{firstDeal.contactName}</div>
                            <div className="text-sm text-muted-foreground">{firstDeal.contactEmail}</div>
                          </TableCell>
                          <TableCell>{companyDeals.length}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatCurrency(totalValue)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}