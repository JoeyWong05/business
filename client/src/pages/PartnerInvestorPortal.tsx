import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  LineChart, 
  TrendingUp, 
  PieChart, 
  Download, 
  ExternalLink, 
  Award, 
  Users, 
  DollarSign, 
  ChevronDown, 
  Share2, 
  Briefcase, 
  FileText,
  Clock,
  CalendarDays,
  MessageSquare,
  BarChart2,
  ArrowUpRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart as RPieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExportButton } from '@/components/ExportButton';

// Sample Data
const revenueData = [
  { month: 'Jan', current: 125000, previous: 90000 },
  { month: 'Feb', current: 135000, previous: 95000 },
  { month: 'Mar', current: 152000, previous: 105000 },
  { month: 'Apr', current: 168000, previous: 115000 },
  { month: 'May', current: 175000, previous: 125000 },
  { month: 'Jun', current: 200000, previous: 135000 },
  { month: 'Jul', current: 220000, previous: 145000 },
  { month: 'Aug', current: 230000, previous: 155000 },
  { month: 'Sep', current: 245000, previous: 165000 },
  { month: 'Oct', current: 270000, previous: 175000 },
  { month: 'Nov', current: 290000, previous: 185000 },
  { month: 'Dec', current: 320000, previous: 200000 },
];

const investmentData = [
  { name: 'Seed Round', value: 750000 },
  { name: 'Series A', value: 2500000 },
  { name: 'Angel Investment', value: 350000 },
  { name: 'Convertible Note', value: 500000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const performanceMetrics = [
  { metric: 'Annual Recurring Revenue (ARR)', value: '$2.4M', growth: '+28%', status: 'positive' },
  { metric: 'Monthly Recurring Revenue (MRR)', value: '$198K', growth: '+4.2%', status: 'positive' },
  { metric: 'Customer Acquisition Cost (CAC)', value: '$950', growth: '-12%', status: 'positive' },
  { metric: 'Lifetime Value (LTV)', value: '$8,200', growth: '+18%', status: 'positive' },
  { metric: 'LTV:CAC Ratio', value: '8.6:1', growth: '+32%', status: 'positive' },
  { metric: 'Gross Margin', value: '72%', growth: '+5%', status: 'positive' },
  { metric: 'Burn Rate', value: '$85K/mo', growth: '-8%', status: 'positive' },
  { metric: 'Runway', value: '28 months', growth: '+6 months', status: 'positive' },
];

const updates = [
  {
    id: 1,
    title: 'Mystery Hype Product Launch',
    date: 'July 18, 2025',
    description: 'Successfully launched our new product line with 250+ pre-orders and 15 wholesale commitments in the first week.',
    category: 'milestone',
    metrics: [
      { name: 'Pre-orders', value: '250+' },
      { name: 'Wholesale Commitments', value: '15' },
      { name: 'Press Coverage', value: '8 outlets' }
    ]
  },
  {
    id: 2,
    title: 'New Partnership with Streetwear Collective',
    date: 'July 10, 2025',
    description: 'Established strategic partnership with Streetwear Collective to expand our distribution channels across the Midwest region.',
    category: 'partnership',
    metrics: [
      { name: 'New Stores', value: '32' },
      { name: 'Revenue Potential', value: '$540K annually' },
      { name: 'Market Expansion', value: '4 states' }
    ]
  },
  {
    id: 3,
    title: 'Q2 2025 Financial Results',
    date: 'July 5, 2025',
    description: 'Exceeded Q2 revenue targets by 18%, with significant growth in our digital merchandise division. Profit margins increased to 32%.',
    category: 'financial',
    metrics: [
      { name: 'Revenue Growth', value: '+18%' },
      { name: 'Profit Margin', value: '32%' },
      { name: 'Customer Growth', value: '+22%' }
    ]
  },
  {
    id: 4,
    title: 'New Digital Merch Pros Website Launch',
    date: 'June 25, 2025',
    description: 'Launched our redesigned e-commerce platform with improved UX, resulting in a 35% increase in conversion rate in the first week.',
    category: 'milestone',
    metrics: [
      { name: 'Conversion Rate', value: '+35%' },
      { name: 'Avg. Order Value', value: '+18%' },
      { name: 'Page Load Time', value: '-42%' }
    ]
  },
  {
    id: 5,
    title: 'New Team Members',
    date: 'June 15, 2025',
    description: 'Welcomed Sarah Chen (VP of Marketing) and Michael Rodriguez (Director of Operations) to strengthen our leadership team.',
    category: 'team',
    metrics: [
      { name: 'Leadership Team', value: '8 members' },
      { name: 'Total Team Size', value: '47 employees' },
      { name: 'Departments', value: '6' }
    ]
  }
];

const capTableData = [
  { investor: 'Founders', ownership: 55, shareClass: 'Class A', investment: 'N/A' },
  { investor: 'Angel Investors', ownership: 10, shareClass: 'Class B', investment: '$350K' },
  { investor: 'Atlas Ventures', ownership: 18, shareClass: 'Series A', investment: '$1.5M' },
  { investor: 'Blue Ridge Capital', ownership: 12, shareClass: 'Series A', investment: '$1M' },
  { investor: 'Employee Options Pool', ownership: 5, shareClass: 'Options', investment: 'N/A' }
];

const documents = [
  { 
    id: 1, 
    title: 'Q2 2025 Investor Report', 
    type: 'report', 
    date: 'July 10, 2025', 
    size: '4.2 MB', 
    version: '1.0' 
  },
  { 
    id: 2, 
    title: 'Financial Projections 2025-2027', 
    type: 'spreadsheet', 
    date: 'June 30, 2025', 
    size: '1.8 MB', 
    version: '2.1' 
  },
  { 
    id: 3, 
    title: 'Series A Term Sheet', 
    type: 'legal', 
    date: 'May 15, 2025', 
    size: '850 KB', 
    version: 'Final' 
  },
  { 
    id: 4, 
    title: 'Brand Portfolio Overview', 
    type: 'presentation', 
    date: 'May 5, 2025', 
    size: '12.4 MB', 
    version: '1.2' 
  },
  { 
    id: 5, 
    title: 'Market Expansion Strategy', 
    type: 'document', 
    date: 'April 21, 2025', 
    size: '3.7 MB', 
    version: '1.1' 
  },
  { 
    id: 6, 
    title: 'Competitor Analysis', 
    type: 'document', 
    date: 'April 10, 2025', 
    size: '5.1 MB', 
    version: '2.0' 
  },
  { 
    id: 7, 
    title: 'Product Roadmap 2025-2026', 
    type: 'presentation', 
    date: 'March 28, 2025', 
    size: '8.3 MB', 
    version: '1.3' 
  }
];

const events = [
  { 
    id: 1, 
    title: 'Q3 Investor Update Call', 
    date: 'Aug 15, 2025', 
    time: '2:00 PM EDT', 
    type: 'virtual', 
    status: 'upcoming' 
  },
  { 
    id: 2, 
    title: 'Annual Investor Meeting', 
    date: 'Oct 10, 2025', 
    time: '10:00 AM EDT', 
    type: 'in-person', 
    location: 'Chicago, IL', 
    status: 'upcoming' 
  },
  { 
    id: 3, 
    title: 'Product Showcase', 
    date: 'Aug 28, 2025', 
    time: '1:00 PM EDT', 
    type: 'virtual', 
    status: 'upcoming' 
  },
  { 
    id: 4, 
    title: 'Q2 Investor Update Call', 
    date: 'May 12, 2025', 
    type: 'virtual', 
    status: 'past' 
  }
];

export default function PartnerInvestorPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEntity, setSelectedEntity] = useState('all');
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone':
        return <Award className="h-5 w-5 text-amber-500" />;
      case 'partnership':
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'financial':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'team':
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <BarChart2 className="h-5 w-5 text-blue-500" />;
      case 'spreadsheet':
        return <LineChart className="h-5 w-5 text-green-500" />;
      case 'presentation':
        return <PieChart className="h-5 w-5 text-amber-500" />;
      case 'legal':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner & Investor Portal</h1>
          <p className="text-muted-foreground mt-1">
            Secure access to company performance, updates, and resources for partners and investors
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Select 
            value={selectedEntity} 
            onValueChange={setSelectedEntity}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Business Entities</SelectItem>
              <SelectItem value="digital-merch-pros">Digital Merch Pros</SelectItem>
              <SelectItem value="mystery-hype">Mystery Hype</SelectItem>
              <SelectItem value="lone-star">Lone Star Custom Clothing</SelectItem>
              <SelectItem value="alcoeaze">Alcoeaze</SelectItem>
              <SelectItem value="hide-cafe">Hide Cafe Bars</SelectItem>
            </SelectContent>
          </Select>
          
          <ExportButton 
            data={{
              revenueData,
              investmentData,
              performanceMetrics,
              capTableData,
              businessEntity: selectedEntity,
              activeTab: activeTab
            }}
            filename={`investor-data-${selectedEntity}`}
            title="Export Options"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="updates">Company Updates</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="captable">Cap Table</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Company Valuation</div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">$12.5M</div>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Badge variant="outline" className="text-green-500 bg-green-50">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +15.7%
                    </Badge>
                    <span className="text-xs text-muted-foreground">Since last valuation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Total Investment</div>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">$4.1M</div>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Badge variant="outline" className="text-muted-foreground">
                      4 Rounds
                    </Badge>
                    <span className="text-xs text-muted-foreground">3 Active Investors</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Annual Revenue</div>
                    <LineChart className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">$2.4M</div>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Badge variant="outline" className="text-green-500 bg-green-50">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +28%
                    </Badge>
                    <span className="text-xs text-muted-foreground">Year over year</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Cash Runway</div>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold mt-2">28 Months</div>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Badge variant="outline" className="text-amber-500 bg-amber-50">
                      $85K/mo burn
                    </Badge>
                    <span className="text-xs text-muted-foreground">Current burn rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue comparison (current vs. previous year)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, undefined]} 
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="current"
                      name="2025"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="previous"
                      name="2024"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Investment Breakdown and Upcoming Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Breakdown</CardTitle>
                <CardDescription>Distribution of investment rounds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={investmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {investmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming Events</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    View Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.filter(e => e.status === 'upcoming').slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 py-3 border-b last:border-0">
                      <div className="bg-primary/10 text-primary rounded-lg flex flex-col items-center justify-center w-12 h-12">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {event.date} {event.time && `at ${event.time}`}
                          </span>
                          <Badge variant="outline" className="mt-1">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View All Events
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
              <CardDescription>Critical metrics for investor evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-sm text-muted-foreground">{metric.metric}</div>
                    <div className="text-xl font-semibold">{metric.value}</div>
                    <div className={`text-sm ${metric.status === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.growth}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Company Updates Tab */}
        <TabsContent value="updates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Company Updates</CardTitle>
                  <CardDescription>Important milestones, achievements, and news</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  View Archive
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {updates.map((update) => (
                  <div key={update.id} className="border rounded-lg p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(update.category)}
                      <Badge variant="outline">
                        {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground ml-auto">{update.date}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{update.title}</h3>
                    <p className="text-muted-foreground mb-4">{update.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-3 rounded-md">
                      {update.metrics.map((metric, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-sm text-muted-foreground">{metric.name}</span>
                          <span className="font-medium">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline">Load More Updates</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly revenue trends with year-over-year comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar name="2025" dataKey="current" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      <Bar name="2024" dataKey="previous" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">ARR Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">YoY Growth</span>
                      <span className="font-medium text-green-500">+28%</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Current: $2.4M</span>
                        <span>Target: $2.8M</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        85% to annual target
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue by Entity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div className="text-sm">Digital Merch Pros</div>
                        </div>
                        <div className="font-medium">$1.1M (46%)</div>
                      </div>
                      <Progress value={46} className="h-1.5 bg-gray-100" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div className="text-sm">Mystery Hype</div>
                        </div>
                        <div className="font-medium">$720K (30%)</div>
                      </div>
                      <Progress value={30} className="h-1.5 bg-gray-100" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <div className="text-sm">Lone Star Custom</div>
                        </div>
                        <div className="font-medium">$360K (15%)</div>
                      </div>
                      <Progress value={15} className="h-1.5 bg-gray-100" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <div className="text-sm">Other Brands</div>
                        </div>
                        <div className="font-medium">$220K (9%)</div>
                      </div>
                      <Progress value={9} className="h-1.5 bg-gray-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Financial Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Burn Rate</span>
                      <span className="font-medium">$85K/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gross Margin</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer Acquisition Cost</span>
                      <span className="font-medium">$950</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cash Balance</span>
                      <span className="font-medium">$2.4M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key financial and operational indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-1 p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">{metric.metric}</div>
                    <div className="text-xl font-semibold">{metric.value}</div>
                    <div className={`text-sm ${metric.status === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.growth}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Cap Table Tab */}
        <TabsContent value="captable" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Capitalization Table</CardTitle>
                  <CardDescription>Current ownership structure and equity distribution</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Cap Table
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Share Class</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead className="text-right">Ownership %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capTableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.investor}</TableCell>
                      <TableCell>{row.shareClass}</TableCell>
                      <TableCell>{row.investment}</TableCell>
                      <TableCell className="text-right">{formatPercentage(row.ownership)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ownership Distribution</CardTitle>
                <CardDescription>Visual breakdown of company ownership</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={capTableData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="ownership"
                        nameKey="investor"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {capTableData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Funding History</CardTitle>
                <CardDescription>Investment rounds and valuations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold">Series A</div>
                      <Badge>March 2025</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Amount Raised</div>
                          <div className="font-medium">$2,500,000</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Valuation</div>
                          <div className="font-medium">$10.8M</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Lead Investors</div>
                        <div className="font-medium">Atlas Ventures, Blue Ridge Capital</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold">Seed Round</div>
                      <Badge>July 2024</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Amount Raised</div>
                          <div className="font-medium">$750,000</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Valuation</div>
                          <div className="font-medium">$3.5M</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Investors</div>
                        <div className="font-medium">Angel Investors Consortium</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Investor Documents</CardTitle>
                  <CardDescription>Access all reports, presentations, and legal documents</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Documents</SelectItem>
                      <SelectItem value="report">Reports</SelectItem>
                      <SelectItem value="presentation">Presentations</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Request Document
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors">
                    <div className="mr-4">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {doc.date} • {doc.size} • Version {doc.version}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing 7 of 24 documents
              </div>
              <Button variant="outline">Load More</Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest financial and operational reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.filter(d => d.type === 'report').map((doc) => (
                    <div key={doc.id} className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors">
                      <div className="mr-4">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.date} • {doc.size}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View All Reports
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Calendar of investor meetings and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.filter(e => e.status === 'upcoming').map((event) => (
                    <div key={event.id} className="flex items-start gap-3 py-3 border-b last:border-0">
                      <div className="bg-primary/10 text-primary rounded-lg flex flex-col items-center justify-center w-12 h-12">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {event.date} {event.time && `at ${event.time}`}
                          </span>
                          <Badge variant="outline" className="mt-1">
                            {event.type}
                          </Badge>
                        </div>
                        {event.location && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Location: {event.location}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <CalendarDays className="h-3.5 w-3.5 mr-1" />
                            Add to Calendar
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            RSVP
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}