import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Cloud,
  CreditCard,
  DollarSign,
  ExternalLink,
  Filter,
  Package,
  Plus,
  Search,
  Settings,
  Star,
  Tags,
  Grid,
  List,
  ChevronRight
} from 'lucide-react';
import SaasLayout from '@/components/SaasLayout';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  pricingModel: 'monthly' | 'annual' | 'one-time' | 'free';
  rating: number;
  tags: string[];
  lastUsed?: string;
  status: 'active' | 'inactive' | 'trial' | 'expired';
  logoUrl: string;
}

export default function ToolManagement() {
  const { demoMode } = useDemoMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch tools data from API or use demo data
  const { data: toolsData, isLoading } = useQuery({
    queryKey: ['/api/tools'],
    queryFn: () => apiRequest('/api/tools'),
  });

  // Demo mode sample data
  const defaultTools: Tool[] = demoMode ? [
    {
      id: 1,
      name: 'Asana',
      description: 'Project management and team collaboration tool',
      category: 'productivity',
      subcategory: 'project-management',
      price: 9.99,
      pricingModel: 'monthly',
      rating: 4.5,
      tags: ['project management', 'tasks', 'collaboration'],
      lastUsed: '2025-03-20',
      status: 'active',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/asana-logo.svg'
    },
    {
      id: 2,
      name: 'Slack',
      description: 'Business communication platform',
      category: 'communication',
      subcategory: 'messaging',
      price: 6.67,
      pricingModel: 'monthly',
      rating: 4.8,
      tags: ['messaging', 'collaboration', 'communication'],
      lastUsed: '2025-03-24',
      status: 'active',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg'
    },
    {
      id: 3,
      name: 'Mailchimp',
      description: 'Email marketing platform',
      category: 'marketing',
      subcategory: 'email',
      price: 14.99,
      pricingModel: 'monthly',
      rating: 4.2,
      tags: ['email', 'marketing', 'automation'],
      lastUsed: '2025-03-15',
      status: 'active',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg'
    },
    {
      id: 4,
      name: 'Airtable',
      description: 'Database and spreadsheet hybrid',
      category: 'productivity',
      subcategory: 'database',
      price: 10,
      pricingModel: 'monthly',
      rating: 4.6,
      tags: ['database', 'spreadsheet', 'project management'],
      lastUsed: '2025-03-10',
      status: 'trial',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/airtable-logo.svg'
    },
    {
      id: 5,
      name: 'QuickBooks',
      description: 'Accounting software',
      category: 'finance',
      subcategory: 'accounting',
      price: 25,
      pricingModel: 'monthly',
      rating: 4.3,
      tags: ['accounting', 'invoicing', 'finance'],
      lastUsed: '2025-03-22',
      status: 'active',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/quickbooks-logo.svg'
    },
    {
      id: 6,
      name: 'Zoom',
      description: 'Video conferencing tool',
      category: 'communication',
      subcategory: 'video',
      price: 14.99,
      pricingModel: 'monthly',
      rating: 4.7,
      tags: ['video', 'conferencing', 'meetings'],
      lastUsed: '2025-03-24',
      status: 'active',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/zoom-icon.svg'
    },
    {
      id: 7,
      name: 'Adobe Creative Cloud',
      description: 'Suite of creative software',
      category: 'design',
      subcategory: 'creative',
      price: 52.99,
      pricingModel: 'monthly',
      rating: 4.5,
      tags: ['design', 'creative', 'graphics'],
      lastUsed: '2025-03-18',
      status: 'active',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/adobe-creative-cloud-cc.svg'
    },
    {
      id: 8,
      name: 'HubSpot',
      description: 'CRM and marketing platform',
      category: 'marketing',
      subcategory: 'crm',
      price: 45,
      pricingModel: 'monthly',
      rating: 4.4,
      tags: ['crm', 'marketing', 'sales'],
      lastUsed: '2025-03-05',
      status: 'inactive',
      logoUrl: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg'
    }
  ] : [];

  // Use API data or demo data
  const tools = toolsData?.tools || defaultTools;

  // Filter tools based on search query and filters
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || tool.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(tools.map(tool => tool.category))];
  
  // Get price display based on pricing model
  const getPriceDisplay = (price: number, model: string) => {
    if (model === 'free') return 'Free';
    if (model === 'one-time') return `$${price.toFixed(2)}`;
    return `$${price.toFixed(2)}/${model === 'annual' ? 'year' : 'month'}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'trial':
        return <Badge className="bg-blue-500">Trial</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get star rating display
  const getStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < Math.floor(rating) 
                ? 'text-yellow-400 fill-yellow-400' 
                : index < rating 
                  ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-[220px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <div className="flex flex-wrap gap-1 mt-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <SaasLayout>
      <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Tool Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all your business tools and software
          </p>
        </div>
        <div className="flex items-start">
          <Button className="flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            Add New Tool
          </Button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="icon" 
              className="h-10 rounded-l-md rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="icon" 
              className="h-10 rounded-r-md rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tools display - Grid view */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.length > 0 ? (
            filteredTools.map(tool => (
              <Link key={tool.id} href={`/tool-details/${tool.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded">
                          {tool.logoUrl ? (
                            <img src={tool.logoUrl} alt={tool.name} className="w-6 h-6 object-contain" />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                      </div>
                      {getStatusBadge(tool.status)}
                    </div>
                    <CardDescription className="line-clamp-2 h-10">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tool.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {tool.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{tool.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{getPriceDisplay(tool.price, tool.pricingModel)}</p>
                        <p className="text-xs text-muted-foreground">
                          Last used: {tool.lastUsed ? new Date(tool.lastUsed).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                      {getStarRating(tool.rating)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-40 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No tools found matching your filters</p>
            </div>
          )}
        </div>
      )}
      
      {/* Tools display - List view */}
      {viewMode === 'list' && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length > 0 ? (
                filteredTools.map(tool => (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded">
                          {tool.logoUrl ? (
                            <img src={tool.logoUrl} alt={tool.name} className="w-6 h-6 object-contain" />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{tool.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{tool.category}</TableCell>
                    <TableCell>{getStatusBadge(tool.status)}</TableCell>
                    <TableCell>{getPriceDisplay(tool.price, tool.pricingModel)}</TableCell>
                    <TableCell>{getStarRating(tool.rating)}</TableCell>
                    <TableCell>
                      {tool.lastUsed ? new Date(tool.lastUsed).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Link href={`/tool-details/${tool.id}`}>
                        <Button variant="ghost" size="sm">
                          Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No tools found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTools.length} of {tools.length} tools
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CreditCard className="mr-1 h-4 w-4" />
            Manage Subscriptions
          </Button>
          <Button variant="outline" size="sm">
            <Cloud className="mr-1 h-4 w-4" />
            Export Tool List
          </Button>
        </div>
      </div>
    </div>
    </SaasLayout>
  );
}