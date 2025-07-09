import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  CircleDollarSign,
  Download,
  FileBarChart,
  FileText,
  LineChart as LineChartIcon,
  BarChart2,
  PieChart as PieChartIcon,
  Printer,
  TrendingUp,
  CreditCard,
  DollarSign,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import MainLayout from "@/components/MainLayout";

// Types
type BusinessEntity = {
  id: number;
  name: string;
  slug: string;
  shortName?: string;
};

type PeriodOption = "monthly" | "quarterly" | "yearly";
type ComparisonOption = "yoy" | "qoq" | "mom" | "prev";

type FinancialMetric = {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  trend?: 'up' | 'down' | 'flat';
  unit: 'currency' | 'percentage' | 'ratio' | 'count';
  entityId?: number;
};

type FinancialHighlight = {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  description: string;
};

// Helper functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000000 ? 1 : 0
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
};

// Get appropriate symbol for trend
const getTrendSymbol = (value: number) => {
  if (value > 0) {
    return <ArrowUpRight className="h-4 w-4 text-green-500" />;
  } else if (value < 0) {
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  } else {
    return <ArrowRight className="h-4 w-4 text-gray-500" />;
  }
};

// Get CSS class for trend
const getTrendClass = (value: number, inverse: boolean = false) => {
  if (value === 0) return "text-gray-500";
  
  if (inverse) {
    return value > 0 ? "text-red-500" : "text-green-500";
  } else {
    return value > 0 ? "text-green-500" : "text-red-500";
  }
};

// Sample data
const monthlyRevenueData = [
  { month: "Jan", value: 182000, prevValue: 165000 },
  { month: "Feb", value: 195000, prevValue: 172000 },
  { month: "Mar", value: 210000, prevValue: 185000 },
  { month: "Apr", value: 205000, prevValue: 189000 },
  { month: "May", value: 225000, prevValue: 195000 },
  { month: "Jun", value: 251000, prevValue: 210000 },
  { month: "Jul", value: 265000, prevValue: 228000 },
  { month: "Aug", value: 280000, prevValue: 240000 },
  { month: "Sep", value: 290000, prevValue: 255000 },
  { month: "Oct", value: 310000, prevValue: 270000 },
  { month: "Nov", value: 325000, prevValue: 285000 },
  { month: "Dec", value: 345000, prevValue: 305000 },
];

const businessBreakdownData = [
  { name: "Digital Merch Pros", value: 425000, color: "#3b82f6" },
  { name: "Mystery Hype", value: 285000, color: "#10b981" },
  { name: "Lone Star Custom", value: 175000, color: "#f59e0b" },
  { name: "Alcoeaze", value: 110000, color: "#8b5cf6" },
  { name: "Hide Cafe", value: 88000, color: "#ef4444" },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// Main component
export default function FinancialOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("monthly");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch business entities
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: () => apiRequest('/api/business-entities')
  });

  // Financial highlights
  const financialHighlights: FinancialHighlight[] = [
    {
      title: "Total Revenue",
      value: 1083000,
      change: 15.2,
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      description: "Last 12 months"
    },
    {
      title: "Net Profit",
      value: 205770,
      change: 22.5,
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      description: "19% margin"
    },
    {
      title: "Expenses",
      value: 877230,
      change: 9.8,
      icon: <CreditCard className="h-5 w-5 text-red-500" />,
      description: "Year to date"
    },
    {
      title: "Business Valuation",
      value: 3791000,
      change: 28.3,
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      description: "3.5x revenue multiple"
    },
  ];

  return (
    <MainLayout title="Financial Overview">
      <div className="container py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
            <p className="text-muted-foreground mt-1">Comprehensive financial insights across all business entities</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                <SelectItem value="digital-merch-pros">Digital Merch Pros</SelectItem>
                <SelectItem value="mystery-hype">Mystery Hype</SelectItem>
                <SelectItem value="lone-star">Lone Star Custom</SelectItem>
                <SelectItem value="alcoeaze">Alcoeaze</SelectItem>
                <SelectItem value="hide-cafe">Hide Cafe</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as PeriodOption)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Monthly Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Financial Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {financialHighlights.map((highlight, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">{highlight.title}</div>
                    {highlight.icon}
                  </div>
                  <div className="text-3xl font-bold">{formatCurrency(highlight.value)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{highlight.description}</div>
                  <div className="mt-2 flex items-center text-sm">
                    {getTrendSymbol(highlight.change)}
                    <span className={getTrendClass(highlight.change, highlight.title === "Expenses")}>
                      {formatPercentage(highlight.change)}
                    </span>
                    <span className="text-muted-foreground ml-1">from previous year</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="valuation">Business Valuation</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5" />
                    <span>12-Month Revenue Trend</span>
                  </CardTitle>
                  <CardDescription>Monthly revenue across all business entities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyRevenueData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                        <Tooltip
                          formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="value"
                          name="Current Year"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                          activeDot={{ r: 6 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="prevValue"
                          name="Previous Year"
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    <span>Revenue Breakdown by Business</span>
                  </CardTitle>
                  <CardDescription>Distribution across all business entities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="w-64 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={businessBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            {businessBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 flex-1">
                      {businessBreakdownData.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                          </div>
                          <Progress value={(item.value / businessBreakdownData.reduce((sum, i) => sum + i.value, 0)) * 100} className={`h-2 bg-gray-100`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Financial Quick Links</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/business-valuation">
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/business-valuation">
                      <Card className="hover:bg-muted/30 transition-all">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-700" />
                          </div>
                          <div>
                            <h3 className="font-medium">Business Valuation</h3>
                            <p className="text-sm text-muted-foreground">Calculate your business worth</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link href="/business-forecast">
                      <Card className="hover:bg-muted/30 transition-all">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <LineChartIcon className="h-5 w-5 text-green-700" />
                          </div>
                          <div>
                            <h3 className="font-medium">Financial Forecast</h3>
                            <p className="text-sm text-muted-foreground">Revenue and growth projections</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    <Link href="/profit-loss">
                      <Card className="hover:bg-muted/30 transition-all">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <FileBarChart className="h-5 w-5 text-amber-700" />
                          </div>
                          <div>
                            <h3 className="font-medium">Profit & Loss</h3>
                            <p className="text-sm text-muted-foreground">Detailed income statements</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Valuation Tab Content */}
          <TabsContent value="valuation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Valuation Summary</CardTitle>
                <CardDescription>Current valuation across methods and entities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Digital Merch Pros", value: 1531000 },
                        { name: "Mystery Hype", value: 997500 },
                        { name: "Lone Star Custom", value: 612500 },
                        { name: "Alcoeaze", value: 385000 },
                        { name: "Hide Cafe", value: 265000 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Valuation']}
                      />
                      <Bar
                        dataKey="value"
                        name="Business Valuation"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 text-center">
                  <Button size="lg" asChild>
                    <Link href="/business-valuation">
                      View Full Valuation Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab Content */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profit & Loss Summary</CardTitle>
                  <CardDescription>Consolidated income statement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Revenue</div>
                        <div className="font-medium">{formatCurrency(1083000)}</div>
                      </div>
                      <Progress value={100} className="h-2 bg-gray-100" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Cost of Goods Sold</div>
                        <div className="font-medium text-red-500">-{formatCurrency(432000)}</div>
                      </div>
                      <Progress value={40} className="h-2 bg-gray-100" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Gross Profit</div>
                        <div className="font-medium text-green-500">{formatCurrency(651000)}</div>
                      </div>
                      <Progress value={60} className="h-2 bg-gray-100" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Operating Expenses</div>
                        <div className="font-medium text-red-500">-{formatCurrency(445230)}</div>
                      </div>
                      <Progress value={41} className="h-2 bg-gray-100" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">Net Profit</div>
                        <div className="font-medium text-green-500">{formatCurrency(205770)}</div>
                      </div>
                      <Progress value={19} className="h-2 bg-green-100" />
                    </div>
                    
                    <div className="pt-4">
                      <Button asChild>
                        <Link href="/profit-loss">
                          View Detailed P&L Statement
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>12-Month Forecast</CardTitle>
                  <CardDescription>Projected revenue and profit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyRevenueData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                        <Tooltip
                          formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name="Projected Revenue"
                          stroke="#10b981"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button asChild>
                      <Link href="/business-forecast">
                        View Complete Forecast
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}