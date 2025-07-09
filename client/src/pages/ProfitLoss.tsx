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
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                      <Tooltip 
                        formatter={(value) => [`$${(Number(value)).toLocaleString()}`, ""]}
                        labelFormatter={(value) => `Period: ${value}`}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                      <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Expense Allocation</CardTitle>
                <CardDescription>See how your expenses are distributed</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${(Number(value)).toLocaleString()}`, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Profit & Loss Summary</CardTitle>
                  <CardDescription>Snapshot of revenue, expenses, and profit</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedComparison} onValueChange={(value) => setSelectedComparison(value as ComparisonOption)}>
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue placeholder="Compare to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prev">Previous Period</SelectItem>
                      <SelectItem value="yoy">Year over Year</SelectItem>
                      <SelectItem value="qoq">Quarter over Quarter</SelectItem>
                      <SelectItem value="mom">Month over Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" className="h-8">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Export</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-1 sm:px-3">
                <div className="overflow-x-auto">
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
          </div>
        </TabsContent>
        
        {/* Detailed Statement Tab Content */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Detailed Profit & Loss Statement</CardTitle>
                <CardDescription>Comprehensive breakdown of financial performance</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8">
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-1 sm:px-3">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Account</TableHead>
                      <TableHead className="text-right">Current Amount</TableHead>
                      <TableHead className="text-right">Previous Amount</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Revenue section with more detailed breakdown */}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={5} className="py-2">Revenue</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="pl-6">Product Sales - Digital Merch Pros</TableCell>
                      <TableCell className="text-right">{formatCurrency(55000)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(51000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(7.8)}
                          <span className={getTrendClass(7.8)}>
                            {formatPercentage(7.8)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">21.9%</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="pl-6">Product Sales - Mystery Hype</TableCell>
                      <TableCell className="text-right">{formatCurrency(42000)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(38000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(10.5)}
                          <span className={getTrendClass(10.5)}>
                            {formatPercentage(10.5)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">16.7%</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="pl-6">Product Sales - Lone Star Custom</TableCell>
                      <TableCell className="text-right">{formatCurrency(28000)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(26000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(7.7)}
                          <span className={getTrendClass(7.7)}>
                            {formatPercentage(7.7)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">11.2%</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="pl-6">Service Revenue - Consulting</TableCell>
                      <TableCell className="text-right">{formatCurrency(35500)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(32000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(10.9)}
                          <span className={getTrendClass(10.9)}>
                            {formatPercentage(10.9)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">14.1%</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="pl-6">Service Revenue - Design</TableCell>
                      <TableCell className="text-right">{formatCurrency(37000)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(36000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(2.8)}
                          <span className={getTrendClass(2.8)}>
                            {formatPercentage(2.8)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">14.7%</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="pl-6">Subscription Revenue</TableCell>
                      <TableCell className="text-right">{formatCurrency(45000)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(32000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(40.6)}
                          <span className={getTrendClass(40.6)}>
                            {formatPercentage(40.6)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">17.9%</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="pl-6">Other Income</TableCell>
                      <TableCell className="text-right">{formatCurrency(8500)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(7000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(21.4)}
                          <span className={getTrendClass(21.4)}>
                            {formatPercentage(21.4)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">3.4%</TableCell>
                    </TableRow>
                    
                    <TableRow className="font-medium">
                      <TableCell>Total Revenue</TableCell>
                      <TableCell className="text-right">{formatCurrency(251000)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(222000)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {getTrendSymbol(13.1)}
                          <span className={getTrendClass(13.1)}>
                            {formatPercentage(13.1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">100.0%</TableCell>
                    </TableRow>
                    
                    {/* Further detailed expense breakdowns would follow... */}
                    {/* For brevity, the demo shows just this revenue section with more detail */}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
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
                    <Tooltip formatter={(value) => [`$${(Number(value)).toLocaleString()}`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" activeDot={{ r: 8 }} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#3b82f6" name="Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Profit Margin Analysis</CardTitle>
                <CardDescription>Tracking profit margin over time by business unit</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", dmp: 9.2, mh: 8.5, lsc: 6.8, overall: 8.5 },
                        { month: "Feb", dmp: 10.5, mh: 9.0, lsc: 7.2, overall: 9.1 },
                        { month: "Mar", dmp: 12.8, mh: 10.3, lsc: 8.1, overall: 10.7 },
                        { month: "Apr", dmp: 11.5, mh: 9.8, lsc: 7.5, overall: 9.8 },
                        { month: "May", dmp: 13.2, mh: 11.5, lsc: 8.9, overall: 11.4 },
                        { month: "Jun", dmp: 14.8, mh: 12.2, lsc: 9.5, overall: 12.1 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="dmp" stroke="#10b981" name="Digital Merch Pros" />
                      <Line type="monotone" dataKey="mh" stroke="#3b82f6" name="Mystery Hype" />
                      <Line type="monotone" dataKey="lsc" stroke="#8b5cf6" name="Lone Star Custom" />
                      <Line type="monotone" dataKey="overall" stroke="#f59e0b" strokeWidth={2} name="Overall" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Revenue Contribution</CardTitle>
                <CardDescription>Revenue distribution by business entity</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: "Jan", dmp: 75000, mh: 52000, lsc: 32000, other: 23000 },
                        { month: "Feb", dmp: 80000, mh: 56000, lsc: 33000, other: 26000 },
                        { month: "Mar", dmp: 85000, mh: 62000, lsc: 34000, other: 29000 },
                        { month: "Apr", dmp: 82000, mh: 58000, lsc: 35000, other: 30000 },
                        { month: "May", dmp: 90000, mh: 64000, lsc: 38000, other: 33000 },
                        { month: "Jun", dmp: 98000, mh: 68000, lsc: 42000, other: 43000 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                      <Tooltip formatter={(value) => [`$${(Number(value)).toLocaleString()}`, ""]} />
                      <Legend />
                      <Bar dataKey="dmp" stackId="a" fill="#10b981" name="Digital Merch Pros" />
                      <Bar dataKey="mh" stackId="a" fill="#3b82f6" name="Mystery Hype" />
                      <Bar dataKey="lsc" stackId="a" fill="#8b5cf6" name="Lone Star Custom" />
                      <Bar dataKey="other" stackId="a" fill="#f59e0b" name="Other Entities" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}