import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  BarChart, 
  LineChart, 
  BarChart3, 
  LineChart as LineChartIcon, 
  ShoppingCart, 
  Package, 
  Tag, 
  AlertCircle,
  Download,
  RefreshCw,
  PlusCircle,
  Filter,
  Calendar,
  Store,
  Settings
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { DateRangePicker } from "@/components/DateRangePicker";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SiShopify, SiAmazon, SiEtsy, SiWoocommerce, SiTiktok } from "react-icons/si";

// Default date range for the dashboard
const defaultDateRange = {
  from: addDays(new Date(), -30),
  to: new Date(),
};

// Mock channel types and platform info
type Channel = 'shopify' | 'amazon' | 'etsy' | 'woocommerce' | 'tiktok';

interface ConnectedPlatform {
  id: string;
  name: string;
  type: Channel;
  icon: React.ReactNode;
  connected: boolean;
  status: 'active' | 'error' | 'pending';
  lastSync?: Date;
}

// Sample platforms
const platforms: ConnectedPlatform[] = [
  { 
    id: '1', 
    name: 'Digital Merch Pros Shopify', 
    type: 'shopify', 
    icon: <SiShopify className="h-5 w-5 text-[#7AB55C]" />, 
    connected: true, 
    status: 'active',
    lastSync: new Date()
  },
  { 
    id: '2', 
    name: 'DMP Amazon Store', 
    type: 'amazon', 
    icon: <SiAmazon className="h-5 w-5 text-[#FF9900]" />, 
    connected: true, 
    status: 'active',
    lastSync: new Date()
  },
  { 
    id: '3', 
    name: 'Mystery Hype Etsy', 
    type: 'etsy', 
    icon: <SiEtsy className="h-5 w-5 text-[#F56400]" />, 
    connected: true, 
    status: 'active',
    lastSync: new Date()
  },
  { 
    id: '4', 
    name: 'Lone Star WooCommerce', 
    type: 'woocommerce', 
    icon: <SiWoocommerce className="h-5 w-5 text-[#7F54B3]" />, 
    connected: false, 
    status: 'pending' 
  },
  { 
    id: '5', 
    name: 'TikTok Shop', 
    type: 'tiktok', 
    icon: <SiTiktok className="h-5 w-5 text-black" />, 
    connected: false, 
    status: 'pending' 
  },
];

// Order status types
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

// Order interface
interface Order {
  id: string;
  orderId: string;
  platform: Channel;
  customer: string;
  date: Date;
  total: number;
  items: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

// Sample recent orders
const recentOrders: Order[] = [
  {
    id: '1',
    orderId: 'DMP-12345',
    platform: 'shopify',
    customer: 'John Smith',
    date: new Date('2025-03-22T14:30:00'),
    total: 89.99,
    items: 2,
    status: 'shipped',
    paymentStatus: 'paid'
  },
  {
    id: '2',
    orderId: 'AMZN-45678',
    platform: 'amazon',
    customer: 'Sara Johnson',
    date: new Date('2025-03-22T12:15:00'),
    total: 129.97,
    items: 3,
    status: 'processing',
    paymentStatus: 'paid'
  },
  {
    id: '3',
    orderId: 'ETSY-98765',
    platform: 'etsy',
    customer: 'Michael Brown',
    date: new Date('2025-03-21T18:45:00'),
    total: 42.50,
    items: 1,
    status: 'delivered',
    paymentStatus: 'paid'
  },
  {
    id: '4',
    orderId: 'DMP-67890',
    platform: 'shopify',
    customer: 'Emily Davis',
    date: new Date('2025-03-21T09:22:00'),
    total: 157.85,
    items: 4,
    status: 'pending',
    paymentStatus: 'pending'
  },
  {
    id: '5',
    orderId: 'AMZN-54321',
    platform: 'amazon',
    customer: 'Robert Wilson',
    date: new Date('2025-03-20T16:30:00'),
    total: 65.99,
    items: 1,
    status: 'cancelled',
    paymentStatus: 'refunded'
  }
];

// Inventory item interface
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  threshold: number;
  platforms: {
    channel: Channel;
    available: number;
    reserved: number;
  }[];
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Sample inventory items
const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    sku: 'TSH-001-BLK-L',
    name: 'Black T-Shirt (Large)',
    price: 24.99,
    stock: 45,
    threshold: 10,
    platforms: [
      { channel: 'shopify', available: 20, reserved: 2 },
      { channel: 'amazon', available: 15, reserved: 1 },
      { channel: 'etsy', available: 10, reserved: 0 }
    ],
    status: 'in_stock'
  },
  {
    id: '2',
    sku: 'MUG-002-WHT',
    name: 'White Coffee Mug',
    price: 14.95,
    stock: 8,
    threshold: 10,
    platforms: [
      { channel: 'shopify', available: 3, reserved: 1 },
      { channel: 'amazon', available: 5, reserved: 0 },
      { channel: 'etsy', available: 0, reserved: 0 }
    ],
    status: 'low_stock'
  },
  {
    id: '3',
    sku: 'HAT-003-RED',
    name: 'Red Snapback Hat',
    price: 19.99,
    stock: 0,
    threshold: 5,
    platforms: [
      { channel: 'shopify', available: 0, reserved: 0 },
      { channel: 'amazon', available: 0, reserved: 0 },
      { channel: 'etsy', available: 0, reserved: 0 }
    ],
    status: 'out_of_stock'
  },
  {
    id: '4',
    sku: 'POST-004-PKG',
    name: 'Poster Bundle (Set of 3)',
    price: 29.99,
    stock: 32,
    threshold: 10,
    platforms: [
      { channel: 'shopify', available: 12, reserved: 0 },
      { channel: 'amazon', available: 15, reserved: 2 },
      { channel: 'etsy', available: 5, reserved: 1 }
    ],
    status: 'in_stock'
  },
  {
    id: '5',
    sku: 'STK-005-PAK',
    name: 'Sticker Pack (10pcs)',
    price: 9.99,
    stock: 7,
    threshold: 15,
    platforms: [
      { channel: 'shopify', available: 4, reserved: 1 },
      { channel: 'amazon', available: 3, reserved: 0 },
      { channel: 'etsy', available: 0, reserved: 0 }
    ],
    status: 'low_stock'
  }
];

// Marketing campaign interface
interface MarketingCampaign {
  id: string;
  name: string;
  platform: Channel;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  sales: number;
  roi: number;
  status: 'active' | 'scheduled' | 'completed' | 'paused';
}

// Sample marketing campaigns
const marketingCampaigns: MarketingCampaign[] = [
  {
    id: '1',
    name: 'Spring Sale - Shopify',
    platform: 'shopify',
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-31'),
    budget: 1000,
    spent: 450,
    sales: 2800,
    roi: 6.22,
    status: 'active'
  },
  {
    id: '2',
    name: 'Amazon Prime Day Push',
    platform: 'amazon',
    startDate: new Date('2025-04-05'),
    endDate: new Date('2025-04-15'),
    budget: 1500,
    spent: 0,
    sales: 0,
    roi: 0,
    status: 'scheduled'
  },
  {
    id: '3',
    name: 'Etsy Valentine\'s Promo',
    platform: 'etsy',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-14'),
    budget: 500,
    spent: 500,
    sales: 3200,
    roi: 6.4,
    status: 'completed'
  },
  {
    id: '4',
    name: 'TikTok Influencer Campaign',
    platform: 'tiktok',
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-04-10'),
    budget: 2000,
    spent: 750,
    sales: 1850,
    roi: 2.47,
    status: 'active'
  },
  {
    id: '5',
    name: 'New Product Launch',
    platform: 'shopify',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-03-31'),
    budget: 1200,
    spent: 900,
    sales: 4500,
    roi: 5.0,
    status: 'paused'
  }
];

// Channel sales data for charts
interface ChannelSalesData {
  channel: Channel;
  sales: number;
  orders: number;
  color: string;
}

// Sales data for charts
const channelSalesData: ChannelSalesData[] = [
  { channel: 'shopify', sales: 12580, orders: 423, color: '#7AB55C' },
  { channel: 'amazon', sales: 9780, orders: 312, color: '#FF9900' },
  { channel: 'etsy', sales: 4350, orders: 148, color: '#F56400' },
  { channel: 'woocommerce', sales: 2100, orders: 76, color: '#7F54B3' },
  { channel: 'tiktok', sales: 3250, orders: 105, color: '#000000' }
];

// Sales data by day for the last 30 days
interface DailySales {
  date: string;
  total: number;
  shopify: number;
  amazon: number;
  etsy: number;
  woocommerce: number;
  tiktok: number;
}

// Get alert status icon
const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-500">Pending</Badge>;
    case 'processing':
      return <Badge className="bg-blue-500">Processing</Badge>;
    case 'shipped':
      return <Badge className="bg-indigo-500">Shipped</Badge>;
    case 'delivered':
      return <Badge className="bg-green-500">Delivered</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case 'returned':
      return <Badge className="bg-orange-500">Returned</Badge>;
    default:
      return null;
  }
};

// Get platform icon
const getPlatformIcon = (platform: Channel) => {
  switch (platform) {
    case 'shopify':
      return <SiShopify className="h-4 w-4 text-[#7AB55C]" />;
    case 'amazon':
      return <SiAmazon className="h-4 w-4 text-[#FF9900]" />;
    case 'etsy':
      return <SiEtsy className="h-4 w-4 text-[#F56400]" />;
    case 'woocommerce':
      return <SiWoocommerce className="h-4 w-4 text-[#7F54B3]" />;
    case 'tiktok':
      return <SiTiktok className="h-4 w-4 text-black" />;
    default:
      return null;
  }
};

// Get inventory status badge
const getInventoryStatusBadge = (status: 'in_stock' | 'low_stock' | 'out_of_stock') => {
  switch (status) {
    case 'in_stock':
      return <Badge className="bg-green-500">In Stock</Badge>;
    case 'low_stock':
      return <Badge className="bg-yellow-500">Low Stock</Badge>;
    case 'out_of_stock':
      return <Badge className="bg-red-500">Out of Stock</Badge>;
    default:
      return null;
  }
};

// Campaign status badge
const getCampaignStatusBadge = (status: 'active' | 'scheduled' | 'completed' | 'paused') => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-500">Scheduled</Badge>;
    case 'completed':
      return <Badge className="bg-gray-500">Completed</Badge>;
    case 'paused':
      return <Badge className="bg-yellow-500">Paused</Badge>;
    default:
      return null;
  }
};

export default function OmniChannelSales() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange);
  const [tab, setTab] = useState("dashboard");
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Omni-Channel Sales</h1>
          <p className="text-muted-foreground">
            Manage your inventory, orders, and marketing across all sales channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Sales Channel Integration Status */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className={`overflow-hidden ${!platform.connected ? 'opacity-70' : ''}`}>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                {platform.icon}
                <CardTitle className="text-sm">{platform.type.charAt(0).toUpperCase() + platform.type.slice(1)}</CardTitle>
              </div>
              {platform.connected ? 
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge> : 
                <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Connected</Badge>}
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="text-xs text-muted-foreground truncate">{platform.name}</div>
              {platform.connected && platform.lastSync && 
                <div className="text-xs text-muted-foreground mt-1">
                  Last synced: {format(platform.lastSync, 'MMM d, h:mm a')}
                </div>
              }
              {!platform.connected && 
                <Button size="sm" className="mt-2 w-full" variant="outline">
                  Connect
                </Button>
              }
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="dashboard" value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="marketing">
            <Tag className="h-4 w-4 mr-2" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$32,060</div>
                <p className="text-xs text-muted-foreground mt-1">+12.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,064</div>
                <p className="text-xs text-muted-foreground mt-1">+5.8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$30.13</div>
                <p className="text-xs text-muted-foreground mt-1">+2.4% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground mt-1">+0.5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Sales by Channel */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Sales Trend</CardTitle>
                <CardDescription>Daily sales across all channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  {/* Replace with actual chart component */}
                  <div className="text-center">
                    <LineChartIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Sales trend visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sales by Channel</CardTitle>
                <CardDescription>Revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  {/* Replace with actual chart component */}
                  <div className="text-center">
                    <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Channel distribution visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Alerts & Recent Orders */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory Alerts</CardTitle>
                <CardDescription>Low stock and out of stock items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-yellow-800">Low Stock: White Coffee Mug</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Only 8 units remaining (below threshold of 10)
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Out of Stock: Red Snapback Hat</AlertTitle>
                    <AlertDescription>
                      0 units remaining across all channels
                    </AlertDescription>
                  </Alert>
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-yellow-800">Low Stock: Sticker Pack (10pcs)</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Only 7 units remaining (below threshold of 15)
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <CardDescription>Latest transactions across all channels</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        {getPlatformIcon(order.platform)}
                        <div className="ml-3">
                          <p className="font-medium">{order.orderId}</p>
                          <p className="text-xs text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                        {getStatusIcon(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order Management</CardTitle>
                  <CardDescription>View and manage orders across all channels</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Input type="text" placeholder="Search orders..." className="pl-8" />
                    <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="etsy">Etsy</SelectItem>
                      <SelectItem value="woocommerce">WooCommerce</SelectItem>
                      <SelectItem value="tiktok">TikTok Shop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getPlatformIcon(order.platform)}
                          <span className="ml-2 capitalize">{order.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{format(order.date, 'MMM d, h:mm a')}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusIcon(order.status)}</TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === 'paid' ? 'default' : order.paymentStatus === 'refunded' ? 'destructive' : 'outline'}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Inventory Management</CardTitle>
                  <CardDescription>Track stock levels across all sales channels</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Input type="text" placeholder="Search inventory..." className="pl-8" />
                    <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock Status</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total Stock</TableHead>
                    <TableHead>Shopify</TableHead>
                    <TableHead>Amazon</TableHead>
                    <TableHead>Etsy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>
                        {item.platforms.find(p => p.channel === 'shopify')?.available || 0}
                      </TableCell>
                      <TableCell>
                        {item.platforms.find(p => p.channel === 'amazon')?.available || 0}
                      </TableCell>
                      <TableCell>
                        {item.platforms.find(p => p.channel === 'etsy')?.available || 0}
                      </TableCell>
                      <TableCell>{getInventoryStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Tab */}
        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Marketing Campaigns</CardTitle>
                  <CardDescription>Track campaign performance across channels</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Campaign
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getPlatformIcon(campaign.platform)}
                          <span className="ml-2 capitalize">{campaign.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(campaign.startDate, 'MMM d')} - {format(campaign.endDate, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>${campaign.budget.toFixed(2)}</TableCell>
                      <TableCell>${campaign.spent.toFixed(2)}</TableCell>
                      <TableCell>${campaign.sales.toFixed(2)}</TableCell>
                      <TableCell>{campaign.roi > 0 ? `${campaign.roi.toFixed(1)}x` : '—'}</TableCell>
                      <TableCell>{getCampaignStatusBadge(campaign.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Integration Settings</CardTitle>
              <CardDescription>Configure and manage your sales channel integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {platforms.map((platform) => (
                  <div key={platform.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {platform.icon}
                        <div>
                          <h3 className="text-lg font-medium">{platform.name}</h3>
                          <p className="text-sm text-muted-foreground">API Status: {platform.connected ? 'Connected' : 'Not Connected'}</p>
                        </div>
                      </div>
                      <div>
                        {platform.connected ? (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Sync Now</Button>
                            <Button variant="outline" size="sm">Configure</Button>
                            <Button variant="destructive" size="sm">Disconnect</Button>
                          </div>
                        ) : (
                          <Button>Connect {platform.type.charAt(0).toUpperCase() + platform.type.slice(1)}</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}