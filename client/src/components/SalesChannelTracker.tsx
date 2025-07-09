import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  ArrowUpDown,
  ExternalLink,
  ShoppingCart,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Check,
  Store,
  Globe,
  ShoppingBag,
  Instagram,
  Users,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';

export enum ChannelType {
  ECOMMERCE = 'ecommerce',
  MARKETPLACE = 'marketplace',
  SOCIAL = 'social',
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  OTHER = 'other'
}

export enum ChannelStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  SETUP_REQUIRED = 'setup_required',
  SUSPENDED = 'suspended',
  ARCHIVED = 'archived'
}

export interface SalesChannel {
  id: string;
  name: string;
  platform: string;
  platformUrl?: string;
  platformIconUrl?: string;
  type: ChannelType;
  entityId: number;
  entityName: string;
  status: ChannelStatus;
  monthlyRevenue?: number;
  revenueGoal?: number;
  monthlySales?: number;
  salesGoal?: number;
  lastSync?: Date | string;
  healthScore?: number; // 0-100
  integrationStatus?: 'connected' | 'issue' | 'disconnected';
  tags?: string[];
  responsibleUserId?: number;
  responsibleUserName?: string;
  notes?: string;
  fees?: {
    subscription?: number;
    transaction?: number;
    transactionPercentage?: number;
    listing?: number;
  };
  inventory?: {
    productCount: number;
    outOfStockCount: number;
    lowStockCount: number;
  };
}

export interface SalesChannelTrackerProps {
  channels: SalesChannel[];
  entities: Array<{id: number, name: string}>;
  platforms: Array<{id: string, name: string, type: ChannelType, url?: string, iconUrl?: string}>;
  teamMembers: Array<{id: number, name: string, avatarUrl?: string}>;
  onAddChannel?: (channel: Omit<SalesChannel, 'id'>) => void;
  onUpdateChannel?: (id: string, updates: Partial<SalesChannel>) => void;
  onDeleteChannel?: (id: string) => void;
  onSyncChannel?: (id: string) => Promise<void>;
  onViewAnalytics?: (id: string) => void;
}

export default function SalesChannelTracker({
  channels,
  entities,
  platforms,
  teamMembers,
  onAddChannel,
  onUpdateChannel,
  onDeleteChannel,
  onSyncChannel,
  onViewAnalytics
}: SalesChannelTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<SalesChannel | null>(null);
  const [currentChannelForm, setCurrentChannelForm] = useState<any>({
    name: '',
    platform: '',
    type: ChannelType.ECOMMERCE,
    entityId: -1,
    status: ChannelStatus.ACTIVE,
    monthlyRevenue: 0,
    revenueGoal: 0,
    monthlySales: 0,
    salesGoal: 0,
    healthScore: 0,
    integrationStatus: 'connected',
    tags: [],
    notes: '',
    fees: {
      subscription: 0,
      transaction: 0,
      transactionPercentage: 0,
      listing: 0
    },
    inventory: {
      productCount: 0,
      outOfStockCount: 0,
      lowStockCount: 0
    }
  });
  
  // Apply filters and search
  const filteredChannels = channels
    .filter(channel => {
      // Apply search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          channel.name.toLowerCase().includes(searchLower) ||
          channel.platform.toLowerCase().includes(searchLower) ||
          channel.entityName.toLowerCase().includes(searchLower) ||
          (channel.tags && channel.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      return true;
    })
    .filter(channel => {
      // Apply type filter
      if (typeFilter === 'all') return true;
      return channel.type === typeFilter;
    })
    .filter(channel => {
      // Apply status filter
      if (statusFilter === 'all') return true;
      return channel.status === statusFilter;
    })
    .filter(channel => {
      // Apply entity filter
      if (entityFilter === 'all') return true;
      return channel.entityId === parseInt(entityFilter);
    })
    .filter(channel => {
      // Apply tab filter
      if (currentTab === 'all') return true;
      if (currentTab === 'issues') {
        return channel.integrationStatus === 'issue' || 
          (channel.healthScore !== undefined && channel.healthScore < 50) ||
          (channel.inventory && channel.inventory.outOfStockCount > 0);
      }
      return channel.platform.toLowerCase() === currentTab.toLowerCase();
    });
  
  // Sort channels
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    if (!sortBy) return 0;
    
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'revenue': {
        const revenueA = a.monthlyRevenue || 0;
        const revenueB = b.monthlyRevenue || 0;
        return direction * (revenueA - revenueB);
      }
      case 'sales': {
        const salesA = a.monthlySales || 0;
        const salesB = b.monthlySales || 0;
        return direction * (salesA - salesB);
      }
      case 'health': {
        const healthA = a.healthScore || 0;
        const healthB = b.healthScore || 0;
        return direction * (healthA - healthB);
      }
      default:
        return 0;
    }
  });
  
  // Calculate statistics
  const totalRevenue = channels.reduce((sum, channel) => sum + (channel.monthlyRevenue || 0), 0);
  const totalSales = channels.reduce((sum, channel) => sum + (channel.monthlySales || 0), 0);
  const averageHealth = channels.length
    ? channels.reduce((sum, channel) => sum + (channel.healthScore || 0), 0) / channels.length
    : 0;
  const issuesCount = channels.filter(
    channel => channel.integrationStatus === 'issue' || 
      (channel.healthScore !== undefined && channel.healthScore < 50) ||
      (channel.inventory && channel.inventory.outOfStockCount > 0)
  ).length;
  
  // Get unique platforms for tabs
  const uniquePlatforms = Array.from(new Set(channels.map(channel => channel.platform)));
  
  // Initialize a new channel
  const initNewChannel = () => {
    setCurrentChannelForm({
      name: '',
      platform: '',
      type: ChannelType.ECOMMERCE,
      entityId: entities.length > 0 ? entities[0].id : -1,
      status: ChannelStatus.ACTIVE,
      monthlyRevenue: 0,
      revenueGoal: 0,
      monthlySales: 0,
      salesGoal: 0,
      healthScore: 0,
      integrationStatus: 'connected',
      tags: [],
      notes: '',
      fees: {
        subscription: 0,
        transaction: 0,
        transactionPercentage: 0,
        listing: 0
      },
      inventory: {
        productCount: 0,
        outOfStockCount: 0,
        lowStockCount: 0
      }
    });
    setIsAddDialogOpen(true);
  };
  
  // Handle adding a new channel
  const handleAddChannel = () => {
    if (onAddChannel) {
      // Find the platform info
      const platformInfo = platforms.find(p => p.id === currentChannelForm.platformId);
      
      // Find the entity name
      const entityName = entities.find(e => e.id === currentChannelForm.entityId)?.name || 'Unknown';
      
      const newChannel = {
        ...currentChannelForm,
        platform: platformInfo?.name || currentChannelForm.platform,
        platformUrl: platformInfo?.url,
        platformIconUrl: platformInfo?.iconUrl,
        type: platformInfo?.type || currentChannelForm.type,
        entityName
      };
      
      onAddChannel(newChannel);
    }
    
    setIsAddDialogOpen(false);
  };
  
  // Handle editing a channel
  const handleEditChannel = (channel: SalesChannel) => {
    setSelectedChannel(channel);
    setCurrentChannelForm({
      ...channel,
      platformId: platforms.find(p => p.name === channel.platform)?.id
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle updating a channel
  const handleUpdateChannel = () => {
    if (selectedChannel && onUpdateChannel) {
      // Find the platform info
      const platformInfo = platforms.find(p => p.id === currentChannelForm.platformId);
      
      // Find the entity name
      const entityName = entities.find(e => e.id === currentChannelForm.entityId)?.name || 'Unknown';
      
      const updatedChannel = {
        ...currentChannelForm,
        platform: platformInfo?.name || currentChannelForm.platform,
        platformUrl: platformInfo?.url,
        platformIconUrl: platformInfo?.iconUrl,
        type: platformInfo?.type || currentChannelForm.type,
        entityName
      };
      
      onUpdateChannel(selectedChannel.id, updatedChannel);
    }
    
    setIsEditDialogOpen(false);
    setSelectedChannel(null);
  };
  
  // Handle deleting a channel
  const handleConfirmDelete = () => {
    if (selectedChannel && onDeleteChannel) {
      onDeleteChannel(selectedChannel.id);
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedChannel(null);
  };
  
  // Handle syncing a channel
  const handleSyncChannel = async (id: string) => {
    if (onSyncChannel) {
      try {
        await onSyncChannel(id);
        // Success notification would go here
      } catch (error) {
        console.error("Error syncing channel:", error);
        // Error notification would go here
      }
    }
  };
  
  // Format monetary values
  const formatCurrency = (value?: number) => {
    if (value === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (date?: Date | string) => {
    if (!date) return 'Never';
    return format(new Date(date), 'MMM dd, yyyy');
  };
  
  // Calculate achievement percentage
  const calculateAchievementPercentage = (current?: number, goal?: number) => {
    if (!current || !goal) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };
  
  // Get channel icon by platform
  const getChannelIcon = (channel: SalesChannel) => {
    switch (channel.platform.toLowerCase()) {
      case 'shopify':
        return <ShoppingBag className="h-4 w-4" />;
      case 'amazon':
        return <ShoppingCart className="h-4 w-4" />;
      case 'walmart':
        return <Store className="h-4 w-4" />;
      case 'ebay':
        return <ShoppingBag className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'etsy':
        return <ShoppingBag className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: ChannelStatus) => {
    switch (status) {
      case ChannelStatus.ACTIVE:
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case ChannelStatus.PAUSED:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Paused</Badge>;
      case ChannelStatus.SETUP_REQUIRED:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Setup Required</Badge>;
      case ChannelStatus.SUSPENDED:
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Suspended</Badge>;
      case ChannelStatus.ARCHIVED:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get health score badge
  const getHealthScoreBadge = (score?: number) => {
    if (score === undefined) return null;
    
    if (score >= 80) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{score}% Healthy</Badge>;
    } else if (score >= 50) {
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">{score}% Attention</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{score}% Issues</Badge>;
    }
  };
  
  // Get integration status badge
  const getIntegrationStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'connected':
        return <Badge variant="outline" className="flex gap-1 items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"><Check className="h-3 w-3" /> Connected</Badge>;
      case 'issue':
        return <Badge variant="outline" className="flex gap-1 items-center bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"><AlertTriangle className="h-3 w-3" /> Issues</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="flex gap-1 items-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Disconnected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Channel Tracker</CardTitle>
          <CardDescription>
            Monitor performance across all sales platforms
          </CardDescription>
        </div>
        <Button onClick={initNewChannel}>
          <Plus className="mr-2 h-4 w-4" />
          Add Channel
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Stats summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-green-100 dark:bg-green-900">
                    <DollarSign className="h-6 w-6 text-green-700 dark:text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <h3 className="text-2xl font-bold">{totalSales.toLocaleString()}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900">
                    <ShoppingCart className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Channel Health</p>
                    <h3 className="text-2xl font-bold">{Math.round(averageHealth)}%</h3>
                  </div>
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900">
                    <BarChart3 className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issues</p>
                    <h3 className="text-2xl font-bold">{issuesCount}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-orange-100 dark:bg-orange-900">
                    <AlertTriangle className="h-6 w-6 text-orange-700 dark:text-orange-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search channels..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(ChannelType).map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(ChannelStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.split('_').join(' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Entity" />
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
            </div>
          </div>
          
          {/* Tabs for filtering by platform */}
          <Tabs 
            defaultValue="all" 
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 mb-4 overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="issues" className="relative">
                Issues
                {issuesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {issuesCount}
                  </span>
                )}
              </TabsTrigger>
              {uniquePlatforms.map(platform => (
                <TabsTrigger key={platform} value={platform}>
                  {platform}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={currentTab} className="mt-0">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button 
                          variant="ghost" 
                          className="p-0 font-medium"
                          onClick={() => {
                            setSortBy('name');
                            setSortDirection(prev => sortBy === 'name' ? (prev === 'asc' ? 'desc' : 'asc') : 'asc');
                          }}
                        >
                          Channel
                          {sortBy === 'name' && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Entity/Status</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="p-0 font-medium"
                          onClick={() => {
                            setSortBy('revenue');
                            setSortDirection(prev => sortBy === 'revenue' ? (prev === 'asc' ? 'desc' : 'asc') : 'desc');
                          }}
                        >
                          Revenue
                          {sortBy === 'revenue' && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="p-0 font-medium"
                          onClick={() => {
                            setSortBy('sales');
                            setSortDirection(prev => sortBy === 'sales' ? (prev === 'asc' ? 'desc' : 'asc') : 'desc');
                          }}
                        >
                          Sales
                          {sortBy === 'sales' && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="p-0 font-medium"
                          onClick={() => {
                            setSortBy('health');
                            setSortDirection(prev => sortBy === 'health' ? (prev === 'asc' ? 'desc' : 'asc') : 'desc');
                          }}
                        >
                          Health
                          {sortBy === 'health' && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedChannels.length > 0 ? (
                      sortedChannels.map((channel) => (
                        <TableRow key={channel.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                {channel.platformIconUrl ? (
                                  <AvatarImage src={channel.platformIconUrl} alt={channel.platform} />
                                ) : (
                                  <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
                                    {getChannelIcon(channel)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">{channel.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  {getChannelIcon(channel)}
                                  {channel.platform}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{channel.entityName}</div>
                              {getStatusBadge(channel.status)}
                              {channel.integrationStatus && (
                                <div className="mt-1">
                                  {getIntegrationStatusBadge(channel.integrationStatus)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{formatCurrency(channel.monthlyRevenue)}</div>
                              {channel.revenueGoal ? (
                                <div className="w-24">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">
                                      Goal: {formatCurrency(channel.revenueGoal)}
                                    </span>
                                    <span className="text-xs font-medium">
                                      {calculateAchievementPercentage(channel.monthlyRevenue, channel.revenueGoal)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={calculateAchievementPercentage(channel.monthlyRevenue, channel.revenueGoal)}
                                    className="h-2"
                                  />
                                </div>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{channel.monthlySales?.toLocaleString() || 0}</div>
                              {channel.salesGoal ? (
                                <div className="w-24">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">
                                      Goal: {channel.salesGoal?.toLocaleString()}
                                    </span>
                                    <span className="text-xs font-medium">
                                      {calculateAchievementPercentage(channel.monthlySales, channel.salesGoal)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={calculateAchievementPercentage(channel.monthlySales, channel.salesGoal)}
                                    className="h-2"
                                  />
                                </div>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>
                                {getHealthScoreBadge(channel.healthScore)}
                              </div>
                              
                              {channel.inventory && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  <div className="flex items-center gap-1">
                                    <span>Products: {channel.inventory.productCount}</span>
                                  </div>
                                  {channel.inventory.outOfStockCount > 0 && (
                                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                      <AlertTriangle className="h-3 w-3" />
                                      <span>Out of stock: {channel.inventory.outOfStockCount}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{formatDate(channel.lastSync)}</span>
                              {channel.responsibleUserName && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                  <Users className="h-3 w-3" />
                                  <span>{channel.responsibleUserName}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSyncChannel(channel.id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (channel.platformUrl) {
                                    window.open(channel.platformUrl, '_blank');
                                  }
                                }}
                                disabled={!channel.platformUrl}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (onViewAnalytics) {
                                    onViewAnalytics(channel.id);
                                  }
                                }}
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditChannel(channel)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedChannel(channel);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Store className="h-12 w-12 text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium mb-1">No channels found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || entityFilter !== 'all' || currentTab !== 'all'
                                ? "Try adjusting your search filters"
                                : "Start by adding your first sales channel"}
                            </p>
                            <Button onClick={initNewChannel}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Channel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      {/* Add Channel Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Sales Channel</DialogTitle>
            <DialogDescription>
              Connect a new sales channel to track performance and inventory
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="channel-name">Channel Name</Label>
              <Input
                id="channel-name"
                value={currentChannelForm.name}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, name: e.target.value})}
                placeholder="Main Website Store"
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={currentChannelForm.platformId}
                onValueChange={(value) => setCurrentChannelForm({...currentChannelForm, platformId: value})}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="entity">Business Entity</Label>
              <Select
                value={String(currentChannelForm.entityId)}
                onValueChange={(value) => setCurrentChannelForm({...currentChannelForm, entityId: parseInt(value)})}
              >
                <SelectTrigger id="entity">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="status">Status</Label>
              <Select
                value={currentChannelForm.status}
                onValueChange={(value) => setCurrentChannelForm({...currentChannelForm, status: value})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ChannelStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.split('_').join(' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="responsibleUser">Responsible Person</Label>
              <Select
                value={String(currentChannelForm.responsibleUserId || '')}
                onValueChange={(value) => setCurrentChannelForm({
                  ...currentChannelForm,
                  responsibleUserId: parseInt(value),
                  responsibleUserName: teamMembers.find(member => member.id === parseInt(value))?.name
                })}
              >
                <SelectTrigger id="responsibleUser">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
              <Input
                id="monthlyRevenue"
                type="number"
                value={currentChannelForm.monthlyRevenue || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, monthlyRevenue: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="revenueGoal">Revenue Goal ($)</Label>
              <Input
                id="revenueGoal"
                type="number"
                value={currentChannelForm.revenueGoal || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, revenueGoal: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="monthlySales">Monthly Sales (Units)</Label>
              <Input
                id="monthlySales"
                type="number"
                value={currentChannelForm.monthlySales || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, monthlySales: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="salesGoal">Sales Goal (Units)</Label>
              <Input
                id="salesGoal"
                type="number"
                value={currentChannelForm.salesGoal || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, salesGoal: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={currentChannelForm.notes || ''}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, notes: e.target.value})}
                placeholder="Additional information about this sales channel"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={(currentChannelForm.tags || []).join(', ')}
                onChange={(e) => setCurrentChannelForm({
                  ...currentChannelForm,
                  tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                })}
                placeholder="retail, b2c, primary"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddChannel}>Add Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Channel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Sales Channel</DialogTitle>
            <DialogDescription>
              Update channel information and performance metrics
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="edit-channel-name">Channel Name</Label>
              <Input
                id="edit-channel-name"
                value={currentChannelForm.name}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, name: e.target.value})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={currentChannelForm.status}
                onValueChange={(value) => setCurrentChannelForm({...currentChannelForm, status: value})}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ChannelStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.split('_').join(' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-entity">Business Entity</Label>
              <Select
                value={String(currentChannelForm.entityId)}
                onValueChange={(value) => setCurrentChannelForm({...currentChannelForm, entityId: parseInt(value)})}
              >
                <SelectTrigger id="edit-entity">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-monthlyRevenue">Monthly Revenue ($)</Label>
              <Input
                id="edit-monthlyRevenue"
                type="number"
                value={currentChannelForm.monthlyRevenue || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, monthlyRevenue: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-revenueGoal">Revenue Goal ($)</Label>
              <Input
                id="edit-revenueGoal"
                type="number"
                value={currentChannelForm.revenueGoal || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, revenueGoal: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-monthlySales">Monthly Sales (Units)</Label>
              <Input
                id="edit-monthlySales"
                type="number"
                value={currentChannelForm.monthlySales || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, monthlySales: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-salesGoal">Sales Goal (Units)</Label>
              <Input
                id="edit-salesGoal"
                type="number"
                value={currentChannelForm.salesGoal || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, salesGoal: parseInt(e.target.value) || 0})}
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-healthScore">Health Score (%)</Label>
              <Input
                id="edit-healthScore"
                type="number"
                value={currentChannelForm.healthScore || 0}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, healthScore: parseInt(e.target.value) || 0})}
                min="0"
                max="100"
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="edit-integration">Integration Status</Label>
              <Select
                value={currentChannelForm.integrationStatus || 'connected'}
                onValueChange={(value) => setCurrentChannelForm({...currentChannelForm, integrationStatus: value})}
              >
                <SelectTrigger id="edit-integration">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="issue">Issues</SelectItem>
                  <SelectItem value="disconnected">Disconnected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={currentChannelForm.notes || ''}
                onChange={(e) => setCurrentChannelForm({...currentChannelForm, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateChannel}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Channel Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedChannel?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              Delete Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {sortedChannels.length} sales {sortedChannels.length === 1 ? 'channel' : 'channels'} found
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}