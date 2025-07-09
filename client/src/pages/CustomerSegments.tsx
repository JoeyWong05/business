import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomProgress } from "@/components/CustomProgress";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Calendar, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  UserPlus, 
  Download, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Zap, 
  Tag, 
  Mail, 
  Megaphone,
  ArrowUpRight,
  Phone,
  Share2,
  Star,
  Info
} from "lucide-react";

// Types
interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  totalRevenue: number;
  avgLTV: number;
  avgOrderValue: number;
  purchaseFrequency: number;
  retentionRate: number;
  growthRate: number;
  color: string;
  createdAt: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  segment: string;
  ltv: number;
  totalSpent: number;
  orderCount: number;
  lastPurchase: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'at-risk';
  businessEntity: string;
  avatarUrl?: string;
}

// Sample data
const customerSegments: CustomerSegment[] = [
  {
    id: "premium",
    name: "Premium Customers",
    description: "High-value customers with multiple purchases and high LTV",
    customerCount: 24,
    totalRevenue: 124800,
    avgLTV: 5200,
    avgOrderValue: 285,
    purchaseFrequency: 1.8,
    retentionRate: 92,
    growthRate: 15,
    color: "#10B981",
    createdAt: "2023-11-15"
  },
  {
    id: "regular",
    name: "Regular Customers",
    description: "Consistent customers with moderate purchase frequency",
    customerCount: 58,
    totalRevenue: 104400,
    avgLTV: 1800,
    avgOrderValue: 170,
    purchaseFrequency: 1.2,
    retentionRate: 78,
    growthRate: 8,
    color: "#3B82F6",
    createdAt: "2023-11-15"
  },
  {
    id: "new",
    name: "New Customers",
    description: "Recently acquired customers with limited purchase history",
    customerCount: 26,
    totalRevenue: 15600,
    avgLTV: 600,
    avgOrderValue: 130,
    purchaseFrequency: 0.5,
    retentionRate: 40,
    growthRate: 28,
    color: "#8B5CF6",
    createdAt: "2023-11-15"
  }
];

const sampleCustomers: Customer[] = [
  {
    id: 1023,
    name: "Jessica Thompson",
    email: "jessica.t@example.com",
    segment: "premium",
    ltv: 5850,
    totalSpent: 3950,
    orderCount: 14,
    lastPurchase: "2024-03-05",
    joinDate: "2022-08-12",
    status: "active",
    businessEntity: "Digital Merch Pros"
  },
  {
    id: 1045,
    name: "Marcus Wilson",
    email: "marcus.w@example.com",
    segment: "premium",
    ltv: 6200,
    totalSpent: 4100,
    orderCount: 16,
    lastPurchase: "2024-02-28",
    joinDate: "2022-06-03",
    status: "active",
    businessEntity: "Mystery Hype"
  },
  {
    id: 1078,
    name: "Sophia Chen",
    email: "sophia.c@example.com",
    segment: "regular",
    ltv: 2400,
    totalSpent: 1850,
    orderCount: 8,
    lastPurchase: "2024-03-12",
    joinDate: "2023-01-15",
    status: "active",
    businessEntity: "Digital Merch Pros"
  },
  {
    id: 1102,
    name: "James Rodriguez",
    email: "james.r@example.com",
    segment: "regular",
    ltv: 1650,
    totalSpent: 950,
    orderCount: 6,
    lastPurchase: "2024-02-10",
    joinDate: "2023-04-22",
    status: "at-risk",
    businessEntity: "Lone Star Custom"
  },
  {
    id: 1156,
    name: "Emma Davis",
    email: "emma.d@example.com",
    segment: "new",
    ltv: 420,
    totalSpent: 420,
    orderCount: 2,
    lastPurchase: "2024-03-15",
    joinDate: "2024-02-01",
    status: "active",
    businessEntity: "Mystery Hype"
  }
];

const segmentChartData = [
  { name: "Premium", value: 124800, percentage: 51, count: 24, color: "#10B981" },
  { name: "Regular", value: 104400, percentage: 43, count: 58, color: "#3B82F6" },
  { name: "New", value: 15600, percentage: 6, count: 26, color: "#8B5CF6" }
];

const rfmData = [
  { x: 1, y: 1, z: 5, name: "Low Value" },
  { x: 2, y: 2, z: 10, name: "Potential" },
  { x: 3, y: 3, z: 15, name: "Mid Value" },
  { x: 4, y: 4, z: 20, name: "High Value" },
  { x: 5, y: 5, z: 25, name: "Premium" }
];

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6'];

// Format currency function
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000000 ? 1 : 0
  }).format(value);
};

export default function CustomerSegments() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [selectedSegment, setSelectedSegment] = useState("all");
  
  // Simulate data loading
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['/api/customers'],
    queryFn: async () => {
      // This would normally be an API fetch, but we're using sample data
      return { customers: sampleCustomers };
    }
  });
  
  const customers = customersData?.customers || [];
  
  // Filter customers based on selected entity
  const filteredCustomers = selectedEntity === "all" 
    ? customers 
    : customers.filter(customer => customer.businessEntity.toLowerCase() === selectedEntity.toLowerCase());
    
  // Filter customers based on selected segment
  const segmentFilteredCustomers = selectedSegment === "all"
    ? filteredCustomers
    : filteredCustomers.filter(customer => customer.segment === selectedSegment);
  
  // Render customer status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">Inactive</Badge>;
      case "at-risk":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">At Risk</Badge>;
      default:
        return null;
    }
  };
  
  // Render segment badge
  const renderSegmentBadge = (segment: string) => {
    switch(segment) {
      case "premium":
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900 dark:border-green-800 dark:text-green-300">Premium</Badge>;
      case "regular":
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300">Regular</Badge>;
      case "new":
        return <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900 dark:border-purple-800 dark:text-purple-300">New</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Segments</h1>
          <p className="text-muted-foreground mt-1">Analyze and manage customer segments to optimize marketing and sales</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Businesses</SelectItem>
              <SelectItem value="Digital Merch Pros">Digital Merch Pros</SelectItem>
              <SelectItem value="Mystery Hype">Mystery Hype</SelectItem>
              <SelectItem value="Lone Star Custom">Lone Star Custom</SelectItem>
              <SelectItem value="Alcoeaze">Alcoeaze</SelectItem>
              <SelectItem value="Hide Cafe">Hide Cafe</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="new">New</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analysis">RFM Analysis</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Total Customers</div>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold">108</div>
                  <div className="mt-1 text-xs text-muted-foreground">across all segments</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+12%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Average LTV</div>
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold">{formatCurrency(2845)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">lifetime value</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+8.3%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Avg. Order Value</div>
                    <ShoppingCart className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold">{formatCurrency(185)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">per purchase</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+5.7%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Retention Rate</div>
                    <CreditCard className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold">78%</div>
                  <div className="mt-1 text-xs text-muted-foreground">customer retention</div>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+2.5%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Segments Distribution Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Revenue by Segment</CardTitle>
                <CardDescription>Revenue distribution across customer segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {segmentChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip 
                        formatter={(value) => formatCurrency(Number(value))} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2 mt-4">
                  {segmentChartData.map((segment) => (
                    <div key={segment.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: segment.color }}
                          ></div>
                          <span>{segment.name} ({segment.count} customers)</span>
                        </div>
                        <span className="font-medium">{formatCurrency(segment.value)}</span>
                      </div>
                      <CustomProgress 
                        value={segment.percentage} 
                        className="h-2 bg-muted" 
                        color={
                          segment.name === "Premium" 
                            ? "green" 
                            : segment.name === "Regular" 
                            ? "blue" 
                            : "purple"
                        } 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Segment Comparison</CardTitle>
                <CardDescription>Key metrics comparison by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Premium', ltv: 5200, retention: 92, orders: 14 },
                        { name: 'Regular', ltv: 1800, retention: 78, orders: 8 },
                        { name: 'New', ltv: 600, retention: 40, orders: 2 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
                      <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="ltv" name="Avg. LTV ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="retention" name="Retention (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Customer Distribution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Customer Value Distribution</CardTitle>
                <CardDescription>Lifetime value distribution across segments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Tier 1 - Premium</span>
                    </div>
                    <span className="font-medium">$5,200+ LTV</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>24 customers (22%)</span>
                  </div>
                  <CustomProgress value={22} className="h-3 bg-muted" color="green" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>Tier 2 - Regular</span>
                    </div>
                    <span className="font-medium">$1,800-$5,200 LTV</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>58 customers (54%)</span>
                  </div>
                  <CustomProgress value={54} className="h-3 bg-muted" color="blue" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>Tier 3 - New</span>
                    </div>
                    <span className="font-medium">$0-$1,800 LTV</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>26 customers (24%)</span>
                  </div>
                  <CustomProgress value={24} className="h-3 bg-muted" color="purple" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Search segments..." 
                className="w-[300px]"
              />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Segment
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerSegments.map((segment) => (
              <Card key={segment.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">{segment.name}</CardTitle>
                      <CardDescription className="mt-1">{segment.description}</CardDescription>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    ></div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-lg font-semibold">{segment.customerCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-lg font-semibold">{formatCurrency(segment.totalRevenue)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg. LTV</p>
                      <p className="text-lg font-semibold">{formatCurrency(segment.avgLTV)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                      <p className="text-lg font-semibold">{formatCurrency(segment.avgOrderValue)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Retention Rate</p>
                      <p className="text-lg font-semibold">{segment.retentionRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                      <p className="text-lg font-semibold">{segment.growthRate}%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end border-t">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Segment Performance</CardTitle>
              <CardDescription>Key metrics comparison across all segments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Avg. LTV</TableHead>
                    <TableHead>Avg. Order Value</TableHead>
                    <TableHead>Purchase Frequency</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSegments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell>
                        <div className="flex items-center font-medium">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: segment.color }}
                          ></div>
                          {segment.name}
                        </div>
                      </TableCell>
                      <TableCell>{segment.customerCount}</TableCell>
                      <TableCell>{formatCurrency(segment.avgLTV)}</TableCell>
                      <TableCell>{formatCurrency(segment.avgOrderValue)}</TableCell>
                      <TableCell>{segment.purchaseFrequency.toFixed(1)}x/month</TableCell>
                      <TableCell>{segment.retentionRate}%</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span>{segment.growthRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="relative w-[300px]">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input 
                  placeholder="Search customers..." 
                  className="w-full pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Lifetime Value</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segmentFilteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            {customer.avatarUrl ? (
                              <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                            ) : (
                              <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.businessEntity}</TableCell>
                      <TableCell>{renderSegmentBadge(customer.segment)}</TableCell>
                      <TableCell>{formatCurrency(customer.ltv)}</TableCell>
                      <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>{customer.orderCount}</TableCell>
                      <TableCell>{new Date(customer.lastPurchase).toLocaleDateString()}</TableCell>
                      <TableCell>{renderStatusBadge(customer.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Order History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Tag className="h-4 w-4 mr-2" />
                              Change Segment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <p className="text-sm text-muted-foreground">Showing {segmentFilteredCustomers.length} of {segmentFilteredCustomers.length} customers</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Customer Acquisition</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: 'Jan', newCustomers: 8 },
                        { month: 'Feb', newCustomers: 12 },
                        { month: 'Mar', newCustomers: 15 },
                        { month: 'Apr', newCustomers: 10 },
                        { month: 'May', newCustomers: 18 },
                        { month: 'Jun', newCustomers: 14 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="newCustomers" name="New Customers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Engagement Channels</CardTitle>
                <CardDescription>Most effective customer engagement channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center p-4 rounded-lg border bg-muted/20">
                    <Mail className="h-10 w-10 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-2xl font-bold">82%</div>
                      <div className="text-xs text-muted-foreground">open rate</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg border bg-muted/20">
                    <Phone className="h-10 w-10 text-green-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium">SMS</div>
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-xs text-muted-foreground">delivery rate</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg border bg-muted/20">
                    <Share2 className="h-10 w-10 text-purple-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium">Social</div>
                      <div className="text-2xl font-bold">68%</div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg border bg-muted/20">
                    <Megaphone className="h-10 w-10 text-amber-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium">Ads</div>
                      <div className="text-2xl font-bold">3.2%</div>
                      <div className="text-xs text-muted-foreground">conversion</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* RFM Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">RFM Analysis</CardTitle>
              <CardDescription>Recency, Frequency, Monetary segmentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name="Recency" 
                          unit=""
                          domain={[0, 6]} 
                          label={{ value: 'Recency', position: 'bottom' }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          name="Frequency" 
                          unit=""
                          domain={[0, 6]} 
                          label={{ value: 'Frequency', angle: -90, position: 'left' }}
                        />
                        <ZAxis 
                          type="number" 
                          dataKey="z" 
                          range={[60, 400]} 
                          name="Monetary" 
                          unit="$"
                        />
                        <RechartsTooltip 
                          cursor={{ strokeDasharray: '3 3' }} 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-md border shadow-sm">
                                  <p className="font-medium">{data.name}</p>
                                  <p className="text-sm">Recency: {data.x}/5</p>
                                  <p className="text-sm">Frequency: {data.y}/5</p>
                                  <p className="text-sm">Monetary: ${data.z * 100}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter 
                          name="Customers" 
                          data={rfmData} 
                          fill="#8884d8" 
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="w-full sm:w-[300px] space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-md border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center mb-2">
                      <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 flex-shrink-0" />
                      <div className="font-medium text-amber-800 dark:text-amber-300">About RFM Analysis</div>
                    </div>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      RFM stands for Recency, Frequency, and Monetary value, which helps segment customers based on their purchasing behavior.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm font-medium">At Risk (Low R)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Haven't purchased recently, may have churned
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm font-medium">Regular (Med F, Med M)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Consistent buyers with moderate spending
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium">Premium (High R, F, M)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recent frequent buyers with high spending
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium">New (High R, Low F)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recent customers with few purchases
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Purchase Frequency</CardTitle>
                <CardDescription>Distribution of purchase frequency among customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { frequency: '1 order', customers: 26 },
                        { frequency: '2-3 orders', customers: 32 },
                        { frequency: '4-6 orders', customers: 24 },
                        { frequency: '7-10 orders', customers: 18 },
                        { frequency: '11+ orders', customers: 8 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="frequency" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="customers" name="Customers" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Customer Recommendations</CardTitle>
                <CardDescription>AI-generated actions based on RFM analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium">Reactivation Campaign</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Target 15 customers who haven't made a purchase in the last 60 days with a personalized offer.
                    </p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">Create Campaign</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">VIP Program</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Invite 8 high-value customers to an exclusive loyalty program with premium benefits.
                    </p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">Set Up Program</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Cross-Sell Campaign</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Target 22 mid-value customers with complementary product recommendations based on purchase history.
                    </p>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}