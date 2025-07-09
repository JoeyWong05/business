import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoMode } from '@/contexts/DemoModeContext';
import {
  Search,
  PlusCircle,
  Download,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Users,
  User,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ShoppingCart,
  ExternalLink,
  Smile,
  Frown,
  Meh,
  BarChart3,
  PieChart,
  Tag,
  Star,
  SlidersHorizontal,
  CircleAlert,
  BarChart4,
  UserCog,
  FileText,
  MessageCircle
} from 'lucide-react';

// Types
interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  status: 'active' | 'inactive' | 'new' | 'churned';
  source: string;
  tags: string[];
  createdAt: string;
  lastOrderDate?: string;
  totalSpent: number;
  orderCount: number;
  avatar?: string;
  notes?: string;
  segmentId?: number;
  segmentName?: string;
  accountManager?: string;
  npsScore?: number;
  entityId?: number;
  entityName?: string;
}

interface CustomerSegment {
  id: number;
  name: string;
  description: string;
  customerCount: number;
  avgLtv: number;
  criteria: {
    field: string;
    operator: string;
    value: string | number;
  }[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  entityId?: number;
  entityName?: string;
}

interface NpsData {
  overall: number;
  responseRate: number;
  detractors: number;
  passives: number;
  promoters: number;
  trend: {
    date: string;
    score: number;
  }[];
  recentFeedback: {
    id: number;
    customerId: number;
    customerName: string;
    score: number;
    feedback?: string;
    date: string;
  }[];
  entityId?: number;
  entityName?: string;
}

// Customer Table Row Component
const CustomerRow: React.FC<{ customer: Customer }> = ({ customer }) => {
  const getStatusBadge = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'churned':
        return <Badge variant="destructive">Churned</Badge>;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            {customer.avatar ? (
              <AvatarImage src={customer.avatar} alt={customer.name} />
            ) : (
              <AvatarFallback>
                {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-xs text-muted-foreground">{customer.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{customer.company || '—'}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{formatCurrency(customer.totalSpent)}</span>
          <span className="text-xs text-muted-foreground">{customer.orderCount} orders</span>
        </div>
      </TableCell>
      <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {customer.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs px-1.5 py-0 h-5">
              {tag}
            </Badge>
          ))}
          {customer.tags.length > 2 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
              +{customer.tags.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(customer.status)}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
            <DropdownMenuItem>Contact History</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Archive Customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

// Segment Card Component
const SegmentCard: React.FC<{ segment: CustomerSegment }> = ({ segment }) => {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold">{segment.name}</CardTitle>
            <CardDescription className="text-xs">
              {segment.customerCount} customers • ${Math.round(segment.avgLtv)} avg. LTV
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Customers</DropdownMenuItem>
              <DropdownMenuItem>Edit Segment</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete Segment</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="text-muted-foreground mb-3">{segment.description}</p>
        <div className="space-y-1.5">
          <div className="text-xs font-medium">Criteria:</div>
          <div className="space-y-1">
            {segment.criteria.map((criterion, index) => (
              <div key={index} className="text-xs px-2 py-1 bg-muted rounded-sm">
                {criterion.field} {criterion.operator} {criterion.value}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {segment.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs px-1.5 py-0 h-5">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Segment
        </Button>
      </CardFooter>
    </Card>
  );
};

// NPS Score Component
const NpsScoreCard: React.FC<{ nps: NpsData }> = ({ nps }) => {
  const getNpsScoreClass = (score: number) => {
    if (score >= 50) return 'text-green-500';
    if (score >= 0) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">NPS Score</CardTitle>
            <CardDescription>
              Net Promoter Score over time
            </CardDescription>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getNpsScoreClass(nps.overall)}`}>
              {nps.overall}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {nps.responseRate}% response rate
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col space-y-1 p-2 bg-muted/50 rounded-md">
            <span className="text-xs text-muted-foreground">Detractors</span>
            <span className="text-xl font-bold text-red-500">{nps.detractors}%</span>
            <div className="flex items-center justify-center mt-1">
              <Frown className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <div className="flex flex-col space-y-1 p-2 bg-muted/50 rounded-md">
            <span className="text-xs text-muted-foreground">Passives</span>
            <span className="text-xl font-bold text-yellow-500">{nps.passives}%</span>
            <div className="flex items-center justify-center mt-1">
              <Meh className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <div className="flex flex-col space-y-1 p-2 bg-muted/50 rounded-md">
            <span className="text-xs text-muted-foreground">Promoters</span>
            <span className="text-xl font-bold text-green-500">{nps.promoters}%</span>
            <div className="flex items-center justify-center mt-1">
              <Smile className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Recent Feedback</h4>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              View All
            </Button>
          </div>
          
          <ScrollArea className="h-[150px] pr-4">
            <div className="space-y-3">
              {nps.recentFeedback.map(feedback => (
                <div key={feedback.id} className="space-y-1 pb-2 border-b border-border last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{feedback.customerName}</span>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-2 w-2 rounded-full ${
                            i < feedback.score 
                              ? (feedback.score >= 9 
                                ? 'bg-green-500' 
                                : feedback.score >= 7 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500')
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {feedback.feedback && (
                    <p className="text-xs text-muted-foreground">{feedback.feedback}</p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {new Date(feedback.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Run New NPS Survey
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Customer Hub Component
export default function CustomerHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { demoMode } = useDemoMode();
  
  // Fetch data from API
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['/api/customers', filterEntity, filterStatus],
    queryFn: () => apiRequest(`/api/customers?entityId=${filterEntity}&status=${filterStatus}`)
  });
  
  const { data: segmentsData, isLoading: isLoadingSegments } = useQuery({
    queryKey: ['/api/customer-segments', filterEntity],
    queryFn: () => apiRequest(`/api/customer-segments?entityId=${filterEntity}`)
  });
  
  const { data: npsData, isLoading: isLoadingNps } = useQuery({
    queryKey: ['/api/nps-data', filterEntity],
    queryFn: () => apiRequest(`/api/nps-data?entityId=${filterEntity}`)
  });
  
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: () => apiRequest('/api/business-entities')
  });

  // Default demo data
  const defaultCustomers: Customer[] = demoMode ? [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, USA",
      company: "Acme Corporation",
      status: "active",
      source: "website",
      tags: ["premium", "newsletter"],
      createdAt: "2024-09-15T10:30:00Z",
      lastOrderDate: "2025-03-10T14:20:00Z",
      totalSpent: 2450.75,
      orderCount: 8,
      segmentName: "High Value Customers",
      accountManager: "Sarah Johnson",
      npsScore: 9,
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      name: "Emily Chen",
      email: "emilyc@techpro.dev",
      phone: "+1 (555) 987-6543",
      company: "TechPro Solutions",
      status: "active",
      source: "referral",
      tags: ["wholesale", "corporate"],
      createdAt: "2024-11-08T09:15:00Z",
      lastOrderDate: "2025-03-18T11:45:00Z",
      totalSpent: 7890.50,
      orderCount: 12,
      segmentName: "Corporate Accounts",
      accountManager: "Michael Brown",
      npsScore: 8,
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      name: "David Rodriguez",
      email: "david.r@gmail.com",
      status: "new",
      source: "social_media",
      tags: ["first_purchase"],
      createdAt: "2025-03-01T16:20:00Z",
      lastOrderDate: "2025-03-05T13:10:00Z",
      totalSpent: 149.99,
      orderCount: 1,
      entityName: "Digital Merch Pros"
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@designhub.co",
      phone: "+1 (555) 234-5678",
      company: "DesignHub Studio",
      status: "inactive",
      source: "tradeshow",
      tags: ["designer", "international"],
      createdAt: "2024-06-20T11:30:00Z",
      lastOrderDate: "2024-12-12T09:25:00Z",
      totalSpent: 3760.25,
      orderCount: 5,
      segmentName: "International Customers",
      entityName: "Mystery Hype"
    },
    {
      id: 5,
      name: "Michael Johnson",
      email: "mjohnson@educorp.edu",
      phone: "+1 (555) 345-6789",
      company: "EduCorp University",
      status: "active",
      source: "google",
      tags: ["education", "bulk_orders"],
      createdAt: "2024-08-15T14:45:00Z",
      lastOrderDate: "2025-02-28T10:15:00Z",
      totalSpent: 12450.00,
      orderCount: 4,
      segmentName: "Educational Institutions",
      accountManager: "Jessica Lee",
      npsScore: 10,
      entityName: "Mystery Hype"
    },
    {
      id: 6,
      name: "Jennifer Lopez",
      email: "jenniferl@fashionco.com",
      phone: "+1 (555) 456-7890",
      company: "Fashion Co.",
      status: "churned",
      source: "email",
      tags: ["retail", "seasonal"],
      createdAt: "2024-04-10T09:20:00Z",
      lastOrderDate: "2024-10-05T15:30:00Z",
      totalSpent: 5680.75,
      orderCount: 7,
      segmentName: "Retail Partners",
      accountManager: "David Brown",
      npsScore: 3,
      entityName: "Lone Star Custom Clothing"
    }
  ] : [];

  const defaultSegments: CustomerSegment[] = demoMode ? [
    {
      id: 1,
      name: "High Value Customers",
      description: "Customers who have spent over $1,000 in the last 6 months",
      customerCount: 48,
      avgLtv: 3500,
      criteria: [
        { field: "Total Spent", operator: ">", value: 1000 },
        { field: "Last Order Date", operator: ">", value: "6 months ago" }
      ],
      tags: ["high_value", "loyal"],
      createdAt: "2024-09-10T08:30:00Z",
      updatedAt: "2025-02-15T11:45:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      name: "Corporate Accounts",
      description: "Business customers with multiple orders",
      customerCount: 32,
      avgLtv: 7800,
      criteria: [
        { field: "Company", operator: "is not", value: "empty" },
        { field: "Order Count", operator: ">", value: 3 }
      ],
      tags: ["business", "wholesale"],
      createdAt: "2024-10-05T14:20:00Z",
      updatedAt: "2025-01-20T09:15:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      name: "At-Risk Customers",
      description: "Previously active customers who haven't ordered in 90+ days",
      customerCount: 27,
      avgLtv: 1200,
      criteria: [
        { field: "Order Count", operator: ">", value: 2 },
        { field: "Last Order Date", operator: "<", value: "90 days ago" }
      ],
      tags: ["at_risk", "reactivation"],
      createdAt: "2025-01-12T10:35:00Z",
      updatedAt: "2025-03-01T16:20:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 4,
      name: "Newsletter Subscribers",
      description: "Customers who have opted in to email marketing",
      customerCount: 156,
      avgLtv: 850,
      criteria: [
        { field: "Email Subscribed", operator: "=", value: true }
      ],
      tags: ["marketing", "email"],
      createdAt: "2024-11-08T13:45:00Z",
      updatedAt: "2025-02-22T15:10:00Z",
      entityName: "Mystery Hype"
    },
    {
      id: 5,
      name: "International Customers",
      description: "Customers from outside the United States",
      customerCount: 64,
      avgLtv: 1950,
      criteria: [
        { field: "Country", operator: "!=", value: "United States" }
      ],
      tags: ["international", "shipping"],
      createdAt: "2024-08-23T09:50:00Z",
      updatedAt: "2025-01-05T11:30:00Z",
      entityName: "Mystery Hype"
    }
  ] : [];

  const defaultNpsData: NpsData = demoMode ? {
    overall: 48,
    responseRate: 32,
    detractors: 15,
    passives: 22,
    promoters: 63,
    trend: [
      { date: "2025-01-01", score: 42 },
      { date: "2025-01-15", score: 45 },
      { date: "2025-02-01", score: 43 },
      { date: "2025-02-15", score: 46 },
      { date: "2025-03-01", score: 48 }
    ],
    recentFeedback: [
      {
        id: 1,
        customerId: 1,
        customerName: "John Smith",
        score: 9,
        feedback: "Great products and excellent customer service. Very responsive team!",
        date: "2025-03-15T14:30:00Z"
      },
      {
        id: 2,
        customerId: 5,
        customerName: "Michael Johnson",
        score: 10,
        feedback: "The bulk order process was seamless. We'll definitely be ordering again for next semester.",
        date: "2025-03-10T09:45:00Z"
      },
      {
        id: 3,
        customerId: 6,
        customerName: "Jennifer Lopez",
        score: 3,
        feedback: "Delivery took much longer than promised and some items were damaged.",
        date: "2025-03-08T16:20:00Z"
      },
      {
        id: 4,
        customerId: 2,
        customerName: "Emily Chen",
        score: 8,
        feedback: "Good quality products but would like to see more variety in corporate merchandise.",
        date: "2025-03-05T11:10:00Z"
      },
      {
        id: 5,
        customerId: 4,
        customerName: "Sarah Williams",
        score: 7,
        feedback: "International shipping costs are a bit high, but otherwise satisfied with the products.",
        date: "2025-02-28T13:50:00Z"
      }
    ],
    entityName: "Digital Merch Pros"
  } : {
    overall: 0,
    responseRate: 0,
    detractors: 0,
    passives: 0,
    promoters: 0,
    trend: [],
    recentFeedback: []
  };

  const defaultEntities = [
    { id: 1, name: "Digital Merch Pros" },
    { id: 2, name: "Mystery Hype" },
    { id: 3, name: "Lone Star Custom Clothing" },
    { id: 4, name: "Alcoeaze" },
    { id: 5, name: "Hide Cafe Bars" }
  ];
  
  // Process data
  const customers = customersData?.customers || defaultCustomers;
  const segments = segmentsData?.segments || defaultSegments;
  const nps = npsData?.nps || defaultNpsData;
  const entities = entitiesData?.entities || defaultEntities;
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      (customer.company && customer.company.toLowerCase().includes(searchLower)) ||
      customer.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  // Filter segments by selected entity
  const filteredSegments = segments.filter(segment => {
    if (filterEntity === 'all') return true;
    return segment.entityId === parseInt(filterEntity);
  });
  
  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Customer Hub</h1>
            <p className="text-muted-foreground">
              Manage customers, segments, and analyze feedback
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="crm" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>CRM</span>
                </TabsTrigger>
                <TabsTrigger value="segments" className="flex items-center gap-1">
                  <PieChart className="h-4 w-4" />
                  <span>Segments</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Feedback</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Select value={filterEntity} onValueChange={setFilterEntity}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select Entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {entities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {activeTab === 'crm' && (
                  <Button variant="default">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Customer
                  </Button>
                )}
                
                {activeTab === 'segments' && (
                  <Button variant="default">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    New Segment
                  </Button>
                )}
              </div>
            </div>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="text-3xl font-bold">{customers.length}</div>
                    <p className="text-xs text-muted-foreground">
                      +{Math.floor(customers.length * 0.12)} new this month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="text-3xl font-bold">
                      {customers.filter(c => c.status === 'active').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(customers.filter(c => c.status === 'active').length / customers.length * 100)}% of total
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Customer Segments</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="text-3xl font-bold">{segments.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {entities.length} business entities
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="text-3xl font-bold">{nps.overall}</div>
                    <p className="text-xs text-muted-foreground">
                      {nps.responseRate}% response rate
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Recent Customers</CardTitle>
                      <CardDescription>
                        Newly added customers across all entities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customers
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 5)
                            .map(customer => (
                              <TableRow key={customer.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8">
                                      {customer.avatar ? (
                                        <AvatarImage src={customer.avatar} alt={customer.name} />
                                      ) : (
                                        <AvatarFallback>
                                          {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{customer.name}</div>
                                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{customer.company || '—'}</TableCell>
                                <TableCell>
                                  <Badge className={customer.status === 'active' ? 'bg-green-500' : customer.status === 'new' ? 'bg-blue-500' : 'bg-muted'}>
                                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          }
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-3">
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <a href="#" onClick={() => setActiveTab('crm')}>
                          View All Customers
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">Customer Segments</CardTitle>
                      <CardDescription>
                        Top performing customer groups
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-4">
                          {segments
                            .sort((a, b) => b.avgLtv - a.avgLtv)
                            .slice(0, 3)
                            .map(segment => (
                              <div key={segment.id} className="p-3 border rounded-md space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{segment.name}</h3>
                                    <p className="text-xs text-muted-foreground">{segment.customerCount} customers</p>
                                  </div>
                                  {segment.entityName && (
                                    <Badge variant="outline" className="text-xs">
                                      {segment.entityName}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Avg. LTV</span>
                                  <span className="font-medium">${Math.round(segment.avgLtv)}</span>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-3">
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <a href="#" onClick={() => setActiveTab('segments')}>
                          View All Segments
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* CRM Tab */}
            <TabsContent value="crm" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                    <div>
                      <CardTitle className="text-xl font-bold">Customer Database</CardTitle>
                      <CardDescription>
                        Manage and view all customer information
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search customers..."
                          className="w-full pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="churned">Churned</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <SlidersHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                          <DropdownMenuItem>By Date Added</DropdownMenuItem>
                          <DropdownMenuItem>By Last Order</DropdownMenuItem>
                          <DropdownMenuItem>By Spend Amount</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Clear Filters</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Customer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingCustomers ? (
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-[40px] w-full" />
                      {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[56px] w-full" />
                      ))}
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <User className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Customers Found</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        {searchTerm 
                          ? "No customers match your search criteria." 
                          : "You haven't added any customers yet."}
                      </p>
                      {searchTerm ? (
                        <Button onClick={() => setSearchTerm('')}>
                          Clear Search
                        </Button>
                      ) : (
                        <Button>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add First Customer
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Total Spent</TableHead>
                          <TableHead>Last Order</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map(customer => (
                          <CustomerRow key={customer.id} customer={customer} />
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Segments Tab */}
            <TabsContent value="segments" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-4">
                <div>
                  <h2 className="text-xl font-bold">Customer Segments</h2>
                  <p className="text-sm text-muted-foreground">
                    Create and manage customer groups based on behavior and attributes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    New Segment
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {isLoadingSegments ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-1/2 mt-1" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full mt-2" />
                        <Skeleton className="h-3 w-full mt-2" />
                        <div className="flex gap-1 mt-3">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-8 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : filteredSegments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Segments Found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You haven't created any customer segments yet.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create First Segment
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {filteredSegments.map(segment => (
                    <SegmentCard key={segment.id} segment={segment} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {isLoadingNps ? (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between">
                          <div>
                            <Skeleton className="h-7 w-40" />
                            <Skeleton className="h-4 w-32 mt-1" />
                          </div>
                          <Skeleton className="h-12 w-12 rounded-md" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-32" />
                        <div className="space-y-3">
                          {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="space-y-2 pb-2 border-b border-border last:border-0">
                              <div className="flex justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-8 w-full" />
                      </CardFooter>
                    </Card>
                  ) : (
                    <NpsScoreCard nps={nps} />
                  )}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">Feedback Sources</CardTitle>
                      <CardDescription>
                        Customer feedback collection channels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center p-3 border rounded-lg space-x-3">
                          <div className="rounded-full bg-blue-100 p-2">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Email Surveys</h3>
                            <p className="text-xs text-muted-foreground">Sent after purchase</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 border rounded-lg space-x-3">
                          <div className="rounded-full bg-amber-100 p-2">
                            <MessageCircle className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Chat Feedback</h3>
                            <p className="text-xs text-muted-foreground">Post-support rating</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 border rounded-lg space-x-3">
                          <div className="rounded-full bg-green-100 p-2">
                            <Smile className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">NPS Surveys</h3>
                            <p className="text-xs text-muted-foreground">Quarterly pulse</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 border rounded-lg space-x-3">
                          <div className="rounded-full bg-purple-100 p-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Form Submissions</h3>
                            <p className="text-xs text-muted-foreground">Website contact form</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Configure Feedback Channels
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold">Feedback Actions</CardTitle>
                      <CardDescription>
                        Quick response tools and triggers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <CircleAlert className="h-5 w-5 text-red-500" />
                          <div>
                            <span className="text-sm font-medium">Detractor Alert</span>
                            <p className="text-xs text-muted-foreground">Notify account manager</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <BarChart4 className="h-5 w-5 text-blue-500" />
                          <div>
                            <span className="text-sm font-medium">Weekly Reports</span>
                            <p className="text-xs text-muted-foreground">Send to leadership team</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <UserCog className="h-5 w-5 text-purple-500" />
                          <div>
                            <span className="text-sm font-medium">Customer Follow-up</span>
                            <p className="text-xs text-muted-foreground">Schedule for negative feedback</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        Add New Action
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}