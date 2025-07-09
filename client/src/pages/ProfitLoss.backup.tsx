import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ExportButton } from "@/components/ExportButton";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Calendar, 
  BarChart2, 
  PieChart as PieChartIcon, 
  Download, 
  Printer, 
  FileText, 
  MoreHorizontal, 
  ArrowDownUp, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink 
} from "lucide-react";
import { CustomProgress } from "@/components/CustomProgress";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Types
type PeriodOption = "monthly" | "quarterly" | "yearly";
type ComparisonOption = "yoy" | "qoq" | "mom" | "prev";
type ProfitLossEntry = {
  category: string;
  subcategory?: string;
  amount: number;
  previousAmount: number;
  change: number;
  isTotal?: boolean;
  isSubtotal?: boolean;
};

// Sample Data
const revenueData = [
  { category: "Revenue", subcategory: "Product Sales", amount: 125000, previousAmount: 115000, change: 8.7 },
  { category: "Revenue", subcategory: "Service Revenue", amount: 72500, previousAmount: 68000, change: 6.6 },
  { category: "Revenue", subcategory: "Subscription Revenue", amount: 45000, previousAmount: 32000, change: 40.6 },
  { category: "Revenue", subcategory: "Other Income", amount: 8500, previousAmount: 7000, change: 21.4 },
  { category: "Revenue", amount: 251000, previousAmount: 222000, change: 13.1, isSubtotal: true },
];

const expenseData = [
  { category: "Cost of Goods Sold", subcategory: "Direct Materials", amount: 42500, previousAmount: 39000, change: 9.0 },
  { category: "Cost of Goods Sold", subcategory: "Direct Labor", amount: 35000, previousAmount: 32500, change: 7.7 },
  { category: "Cost of Goods Sold", subcategory: "Manufacturing Overhead", amount: 18500, previousAmount: 17000, change: 8.8 },
  { category: "Cost of Goods Sold", amount: 96000, previousAmount: 88500, change: 8.5, isSubtotal: true },
  
  { category: "Operating Expenses", subcategory: "Salaries & Wages", amount: 58000, previousAmount: 52000, change: 11.5 },
  { category: "Operating Expenses", subcategory: "Marketing & Advertising", amount: 22500, previousAmount: 20000, change: 12.5 },
  { category: "Operating Expenses", subcategory: "Rent & Utilities", amount: 13500, previousAmount: 12800, change: 5.5 },
  { category: "Operating Expenses", subcategory: "Software & Subscriptions", amount: 8750, previousAmount: 7200, change: 21.5 },
  { category: "Operating Expenses", subcategory: "Office Supplies", amount: 2800, previousAmount: 2500, change: 12.0 },
  { category: "Operating Expenses", subcategory: "Travel & Entertainment", amount: 4200, previousAmount: 3800, change: 10.5 },
  { category: "Operating Expenses", subcategory: "Professional Services", amount: 6500, previousAmount: 5800, change: 12.1 },
  { category: "Operating Expenses", subcategory: "Depreciation & Amortization", amount: 8200, previousAmount: 7900, change: 3.8 },
  { category: "Operating Expenses", subcategory: "Other Expenses", amount: 3550, previousAmount: 3200, change: 10.9 },
  { category: "Operating Expenses", amount: 128000, previousAmount: 115200, change: 11.1, isSubtotal: true },
];

const profitData = [
  { category: "Gross Profit", amount: 155000, previousAmount: 133500, change: 16.1, isSubtotal: true },
  { category: "Operating Profit", amount: 27000, previousAmount: 18300, change: 47.5, isSubtotal: true },
  { category: "Net Profit", amount: 21600, previousAmount: 14640, change: 47.5, isTotal: true },
];

const trendData = [
  { month: "Jan", revenue: 182000, expenses: 162000, profit: 20000 },
  { month: "Feb", revenue: 195000, expenses: 168000, profit: 27000 },
  { month: "Mar", revenue: 210000, expenses: 175000, profit: 35000 },
  { month: "Apr", revenue: 205000, expenses: 180000, profit: 25000 },
  { month: "May", revenue: 225000, expenses: 190000, profit: 35000 },
  { month: "Jun", revenue: 251000, expenses: 224000, profit: 27000 },
];

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function ProfitLoss() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("monthly");
  const [selectedComparison, setSelectedComparison] = useState<ComparisonOption>("prev");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("summary");
  const [isLoading, setIsLoading] = useState(false);
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format percentage
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

  // Total number calculations
  const totalRevenue = 251000;
  const totalExpenses = 224000;
  const grossProfit = 155000;
  const netProfit = 21600;
  const profitMargin = (netProfit / totalRevenue) * 100;
  
  // Expense allocation data for pie chart
  const expenseAllocationData = [
    { name: "COGS", value: 96000 },
    { name: "Salaries", value: 58000 },
    { name: "Marketing", value: 22500 },
    { name: "Facilities", value: 13500 },
    { name: "Other", value: 34000 }
  ];
  
  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" className="p-0 h-8" asChild>
              <Link href="/financial-overview">
                <span className="text-muted-foreground hover:text-primary">Financial Overview</span>
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span>Profit & Loss</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profit & Loss</h1>
          <p className="text-muted-foreground mt-1">Track your financial performance across all business entities</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          
          <ExportButton 
            data={{
              revenueData,
              expenseData,
              profitData,
              trendData,
              businessEntity: selectedEntity,
              period: selectedPeriod,
              comparison: selectedComparison,
              activeTab: activeTab,
              totals: {
                revenue: totalRevenue,
                expenses: totalExpenses,
                grossProfit: grossProfit,
                netProfit: netProfit,
                profitMargin: profitMargin
              }
            }}
            filename={`profit-loss-${selectedEntity}-${selectedPeriod}`}
            title="P&L Export Options"
          />
        </div>
      </div>
      
      {/* Key Financial Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</div>
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div className="text-xl sm:text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
              <div className="mt-1 text-xs text-muted-foreground">For current {selectedPeriod}</div>
              <div className="mt-1 sm:mt-2 flex items-center text-xs sm:text-sm">
                {getTrendSymbol(13.1)}
                <span className={getTrendClass(13.1)}>{formatPercentage(13.1)}</span>
                <span className="text-muted-foreground ml-1 whitespace-nowrap">from prev period</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Total Expenses</div>
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              </div>
              <div className="text-xl sm:text-3xl font-bold">{formatCurrency(totalExpenses)}</div>
              <div className="mt-1 text-xs text-muted-foreground">For current {selectedPeriod}</div>
              <div className="mt-1 sm:mt-2 flex items-center text-xs sm:text-sm">
                {getTrendSymbol(10.1)}
                <span className={getTrendClass(10.1, true)}>{formatPercentage(10.1)}</span>
                <span className="text-muted-foreground ml-1 whitespace-nowrap">from prev period</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Net Profit</div>
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div className="text-xl sm:text-3xl font-bold">{formatCurrency(netProfit)}</div>
              <div className="mt-1 text-xs text-muted-foreground">For current {selectedPeriod}</div>
              <div className="mt-1 sm:mt-2 flex items-center text-xs sm:text-sm">
                {getTrendSymbol(47.5)}
                <span className={getTrendClass(47.5)}>{formatPercentage(47.5)}</span>
                <span className="text-muted-foreground ml-1 whitespace-nowrap">from prev period</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Profit Margin</div>
                <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <div className="text-xl sm:text-3xl font-bold">{profitMargin.toFixed(1)}%</div>
              <div className="mt-1 text-xs text-muted-foreground">Net profit percentage</div>
              <div className="mt-1 sm:mt-2 flex items-center text-xs sm:text-sm">
                {getTrendSymbol(3.2)}
                <span className={getTrendClass(3.2)}>{formatPercentage(3.2)}</span>
                <span className="text-muted-foreground ml-1 whitespace-nowrap">from prev period</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Detailed Statement</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab Content */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Revenue vs Expenses</CardTitle>
                <CardDescription>Comparison of revenue and expenses for the current period</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { 
                          name: selectedPeriod === "monthly" ? "This Month" : selectedPeriod === "quarterly" ? "This Quarter" : "This Year", 
                          revenue: totalRevenue, 
                          expenses: totalExpenses, 
                          profit: netProfit 
                        },
                        { 
                          name: selectedPeriod === "monthly" ? "Last Month" : selectedPeriod === "quarterly" ? "Last Quarter" : "Last Year", 
                          revenue: totalRevenue - (totalRevenue * 0.131), 
                          expenses: totalExpenses - (totalExpenses * 0.101), 
                          profit: netProfit - (netProfit * 0.475)
                        }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                        labelFormatter={(value) => `${value}`}
                      />
                      <Legend />
                      <Bar name="Revenue" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar name="Expenses" dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar name="Profit" dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Expense Allocation</CardTitle>
                <CardDescription>Breakdown of expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Profit & Loss Summary</CardTitle>
              <CardDescription>Overview of your financial performance for the current period</CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-3">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Previous</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {/* Revenue Section */}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium">Total Revenue</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(revenueData[4].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(revenueData[4].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(revenueData[4].change)}
                        <span className={getTrendClass(revenueData[4].change)}>
                          {formatPercentage(revenueData[4].change)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* COGS Section */}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium">Cost of Goods Sold</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(expenseData[3].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(expenseData[3].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(expenseData[3].change)}
                        <span className={getTrendClass(expenseData[3].change, true)}>
                          {formatPercentage(expenseData[3].change)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Gross Profit */}
                  <TableRow>
                    <TableCell className="font-medium">Gross Profit</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(profitData[0].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[0].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(profitData[0].change)}
                        <span className={getTrendClass(profitData[0].change)}>
                          {formatPercentage(profitData[0].change)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Operating Expenses */}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium">Operating Expenses</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(expenseData[13].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(expenseData[13].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(expenseData[13].change)}
                        <span className={getTrendClass(expenseData[13].change, true)}>
                          {formatPercentage(expenseData[13].change)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Operating Profit */}
                  <TableRow>
                    <TableCell className="font-medium">Operating Profit</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(profitData[1].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[1].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(profitData[1].change)}
                        <span className={getTrendClass(profitData[1].change)}>
                          {formatPercentage(profitData[1].change)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Other Income/Expenses */}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-medium">Other Income/Expenses</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(-5400)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(-3660)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(47.5)}
                        <span className={getTrendClass(47.5, true)}>
                          {formatPercentage(47.5)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Net Profit */}
                  <TableRow className="font-medium text-lg">
                    <TableCell className="font-bold">Net Profit</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(profitData[2].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[2].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(profitData[2].change)}
                        <span className={getTrendClass(profitData[2].change)}>
                          {formatPercentage(profitData[2].change)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t p-4">
              <p className="text-sm text-muted-foreground">
                {selectedPeriod === "monthly" ? "June 2024" : selectedPeriod === "quarterly" ? "Q2 2024" : "Fiscal Year 2024"}
              </p>
              <Button variant="outline" size="sm" className="text-xs">
                <FileText className="h-3.5 w-3.5 mr-1" />
                View Full Statement
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Detailed Statement Tab Content */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-semibold">Detailed Profit & Loss Statement</CardTitle>
                <CardDescription>Comprehensive breakdown of all revenue and expense categories</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedComparison} onValueChange={(value) => setSelectedComparison(value as ComparisonOption)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Comparison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prev">Previous Period</SelectItem>
                    <SelectItem value="yoy">Year-over-Year</SelectItem>
                    <SelectItem value="qoq">Quarter-over-Quarter</SelectItem>
                    <SelectItem value="mom">Month-over-Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-1 sm:px-3">
<              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Category</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Previous</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">% of Rev</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {/* Revenue Section */}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={5} className="py-2">Revenue</TableCell>
                  </TableRow>
                  
                  {revenueData.map((item, index) => (
                    !item.isSubtotal ? (
                      <TableRow key={`revenue-${index}`}>
                        <TableCell className="pl-6">{item.subcategory}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.previousAmount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {getTrendSymbol(item.change)}
                            <span className={getTrendClass(item.change)}>
                              {formatPercentage(item.change)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.amount / totalRevenue) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={`revenue-total`} className="font-medium">
                        <TableCell>Total Revenue</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.previousAmount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {getTrendSymbol(item.change)}
                            <span className={getTrendClass(item.change)}>
                              {formatPercentage(item.change)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">100.0%</TableCell>
                      </TableRow>
                    )
                  ))}
                  
                  {/* Cost of Goods Sold Section */}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={5} className="py-2">Cost of Goods Sold</TableCell>
                  </TableRow>
                  
                  {expenseData.slice(0, 4).map((item, index) => (
                    !item.isSubtotal ? (
                      <TableRow key={`cogs-${index}`}>
                        <TableCell className="pl-6">{item.subcategory}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.previousAmount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {getTrendSymbol(item.change)}
                            <span className={getTrendClass(item.change, true)}>
                              {formatPercentage(item.change)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.amount / totalRevenue) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={`cogs-total`} className="font-medium">
                        <TableCell>Total Cost of Goods Sold</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.previousAmount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {getTrendSymbol(item.change)}
                            <span className={getTrendClass(item.change, true)}>
                              {formatPercentage(item.change)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.amount / totalRevenue) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    )
                  ))}
                  
                  {/* Gross Profit */}
                  <TableRow className="font-medium border-t-2">
                    <TableCell>Gross Profit</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[0].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[0].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(profitData[0].change)}
                        <span className={getTrendClass(profitData[0].change)}>
                          {formatPercentage(profitData[0].change)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {((profitData[0].amount / totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  
                  {/* Operating Expenses Section */}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={5} className="py-2">Operating Expenses</TableCell>
                  </TableRow>
                  
                  {expenseData.slice(4, 14).map((item, index) => (
                    !item.isSubtotal ? (
                      <TableRow key={`opex-${index}`}>
                        <TableCell className="pl-6">{item.subcategory}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.previousAmount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {getTrendSymbol(item.change)}
                            <span className={getTrendClass(item.change, true)}>
                              {formatPercentage(item.change)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.amount / totalRevenue) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={`opex-total`} className="font-medium">
                        <TableCell>Total Operating Expenses</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.previousAmount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {getTrendSymbol(item.change)}
                            <span className={getTrendClass(item.change, true)}>
                              {formatPercentage(item.change)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {((item.amount / totalRevenue) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    )
                  ))}
                  
                  {/* Operating Profit */}
                  <TableRow className="font-medium border-t-2">
                    <TableCell>Operating Profit</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[1].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[1].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(profitData[1].change)}
                        <span className={getTrendClass(profitData[1].change)}>
                          {formatPercentage(profitData[1].change)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {((profitData[1].amount / totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  
                  {/* Other Income/Expenses */}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={5} className="py-2">Other Income/Expenses</TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="pl-6">Interest Expense</TableCell>
                    <TableCell className="text-right">{formatCurrency(-3800)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(-3200)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(18.8)}
                        <span className={getTrendClass(18.8, true)}>
                          {formatPercentage(18.8)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {((3800 / totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="pl-6">Tax Expense</TableCell>
                    <TableCell className="text-right">{formatCurrency(-1600)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(-460)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(247.8)}
                        <span className={getTrendClass(247.8, true)}>
                          {formatPercentage(247.8)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {((1600 / totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  
                  <TableRow className="font-medium">
                    <TableCell>Total Other Income/Expenses</TableCell>
                    <TableCell className="text-right">{formatCurrency(-5400)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(-3660)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(47.5)}
                        <span className={getTrendClass(47.5, true)}>
                          {formatPercentage(47.5)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {((5400 / totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  
                  {/* Net Profit */}
                  <TableRow className="font-medium text-lg bg-muted/30 border-t-2">
                    <TableCell className="font-bold">Net Profit</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(profitData[2].amount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profitData[2].previousAmount)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {getTrendSymbol(profitData[2].change)}
                        <span className={getTrendClass(profitData[2].change)}>
                          {formatPercentage(profitData[2].change)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {((profitData[2].amount / totalRevenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t p-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm text-muted-foreground">
                  {selectedPeriod === "monthly" ? "June 1-30, 2024" : selectedPeriod === "quarterly" ? "April 1 - June 30, 2024" : "January 1 - December 31, 2024"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Printer className="h-3.5 w-3.5 mr-1" />
                  Print
                </Button>
                <Button variant="default" size="sm" className="text-xs">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Trends & Analysis Tab Content */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Performance Trends</CardTitle>
              <CardDescription>Track your revenue, expenses, and profit over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, undefined]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      name="Expenses" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      name="Profit" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Revenue Growth Rate</div>
                    <div className="text-2xl font-bold mb-1">+13.1%</div>
                    <div className="text-xs text-muted-foreground mb-2">vs previous {selectedPeriod}</div>
                    <CustomProgress value={13.1} max={20} color="green" className="h-2" />
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Profit Growth Rate</div>
                    <div className="text-2xl font-bold mb-1">+47.5%</div>
                    <div className="text-xs text-muted-foreground mb-2">vs previous {selectedPeriod}</div>
                    <CustomProgress value={47.5} max={50} color="blue" className="h-2" />
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Expense Efficiency</div>
                    <div className="text-2xl font-bold mb-1">-2.7%</div>
                    <div className="text-xs text-muted-foreground mb-2">Expenses growing slower than revenue</div>
                    <CustomProgress value={2.7} max={10} color="amber" className="h-2" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Profitability Analysis</CardTitle>
                <CardDescription>Key profitability metrics and ratios</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Previous</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Gross Profit Margin</TableCell>
                      <TableCell className="text-right">61.8%</TableCell>
                      <TableCell className="text-right">60.1%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500">+1.7%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Operating Profit Margin</TableCell>
                      <TableCell className="text-right">10.8%</TableCell>
                      <TableCell className="text-right">8.2%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500">+2.6%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Net Profit Margin</TableCell>
                      <TableCell className="text-right">8.6%</TableCell>
                      <TableCell className="text-right">6.6%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500">+2.0%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Return on Investment</TableCell>
                      <TableCell className="text-right">18.2%</TableCell>
                      <TableCell className="text-right">14.1%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500">+4.1%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Expense Ratio</TableCell>
                      <TableCell className="text-right">89.2%</TableCell>
                      <TableCell className="text-right">91.8%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" transform="rotate(180)" />
                          <span className="text-green-500">-2.6%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Revenue Breakdown by Business</CardTitle>
                <CardDescription>Contribution of each business entity to total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                        <span>Digital Merch Pros</span>
                      </div>
                      <span className="font-medium">{formatCurrency(125500)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                      <span>+14.1% from previous period (50% of total)</span>
                    </div>
                    <CustomProgress value={50} className="h-2 bg-muted" color="blue" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Mystery Hype</span>
                      </div>
                      <span className="font-medium">{formatCurrency(62750)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                      <span>+18.4% from previous period (25% of total)</span>
                    </div>
                    <CustomProgress value={25} className="h-2 bg-muted" color="blue" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Lone Star Custom</span>
                      </div>
                      <span className="font-medium">{formatCurrency(37650)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                      <span>+7.6% from previous period (15% of total)</span>
                    </div>
                    <CustomProgress value={15} className="h-2 bg-muted" color="green" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>Alcoeaze</span>
                      </div>
                      <span className="font-medium">{formatCurrency(15060)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                      <span>+9.2% from previous period (6% of total)</span>
                    </div>
                    <CustomProgress value={6} className="h-2 bg-muted" color="amber" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span>Hide Cafe</span>
                      </div>
                      <span className="font-medium">{formatCurrency(10040)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                      <span>+5.3% from previous period (4% of total)</span>
                    </div>
                    <CustomProgress value={4} className="h-2 bg-muted" color="purple" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-semibold">Analyst Insights</CardTitle>
                <CardDescription>AI-generated analysis of your financial performance</CardDescription>
              </div>
              <Badge variant="outline" className="font-normal">AI-Generated</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">
                  Your financial performance this period shows strong improvement across all key metrics. Revenue grew by <span className="font-medium text-green-600 dark:text-green-400">13.1%</span> while 
                  net profit increased by <span className="font-medium text-green-600 dark:text-green-400">47.5%</span>, indicating significant operational efficiency gains.
                </p>
                
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Key Observations:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Subscription revenue growth (<span className="font-medium">+40.6%</span>) significantly outpaced other revenue streams, suggesting successful efforts to expand recurring revenue.</span>
                    </li>
                    <li className="flex gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Gross profit margin improved from <span className="font-medium">60.1%</span> to <span className="font-medium">61.8%</span>, indicating better pricing strategies or improved cost management in direct expenses.</span>
                    </li>
                    <li className="flex gap-2">
                      <ArrowUpRight className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Operating expenses grew at <span className="font-medium">11.1%</span>, which is slightly lower than revenue growth, demonstrating improved operational leverage.</span>
                    </li>
                    <li className="flex gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Mystery Hype showed the strongest growth (<span className="font-medium">+18.4%</span>) among all business entities, suggesting it may be a focal point for future investment.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-xs font-bold">1</span>
                      </div>
                      <span>Continue investing in subscription-based offerings to maintain the strong growth trajectory in recurring revenue.</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-xs font-bold">2</span>
                      </div>
                      <span>Analyze software & subscription expenses (<span className="font-medium">+21.5%</span>) to ensure this rapid growth is delivering appropriate ROI.</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-xs font-bold">3</span>
                      </div>
                      <span>Focus on developing growth strategies for Hide Cafe, which shows the lowest growth rate (<span className="font-medium">+5.3%</span>) among all entities.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href="/financial-insights">
                      <span>View Full Analysis</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}