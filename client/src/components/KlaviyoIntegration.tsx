import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  BarChart2,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  HelpCircle,
  Info,
  Link,
  Loader,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Puzzle,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share,
  ShoppingBag,
  Tag,
  Trash,
  TrendingUp,
  Users,
  Workflow,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Interface definitions for Klaviyo Integration
export interface KlaviyoAccount {
  id: string;
  apiKey: string;
  name: string;
  email: string;
  companyName: string;
  status: 'active' | 'disconnected' | 'error';
  connectDate: Date | string;
  lastSyncDate?: Date | string;
  entityId: number;
  entityName: string;
}

export interface KlaviyoList {
  id: string;
  accountId: string;
  name: string;
  listType: 'default' | 'segment' | 'custom';
  memberCount: number;
  createdDate: Date | string;
  updatedDate: Date | string;
  description?: string;
  entityId: number;
}

export interface KlaviyoMetric {
  id: string;
  accountId: string;
  name: string;
  metricType: 'count' | 'value' | 'conversion';
  value: number;
  period: 'day' | 'week' | 'month' | 'year' | 'all_time';
  date: Date | string;
  entityId: number;
}

export interface KlaviyoFlow {
  id: string;
  accountId: string;
  name: string;
  status: 'draft' | 'active' | 'inactive';
  triggerType: 'list' | 'metric' | 'segment' | 'date';
  createdDate: Date | string;
  updatedDate: Date | string;
  stats?: {
    recipients: number;
    opens: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  entityId: number;
}

export interface KlaviyoCampaign {
  id: string;
  accountId: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'canceled';
  listIds: string[];
  sendDate?: Date | string;
  createdDate: Date | string;
  stats?: {
    recipients: number;
    opens: number;
    openRate: number;
    clicks: number;
    clickRate: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    unsubscribes: number;
    bounces: number;
  };
  entityId: number;
}

export interface KlaviyoTemplate {
  id: string;
  accountId: string;
  name: string;
  category: 'newsletter' | 'promotion' | 'announcement' | 'event' | 'other';
  createdDate: Date | string;
  updatedDate: Date | string;
  html: string;
  thumbnail?: string;
  entityId: number;
}

export interface KlaviyoIntegrationProps {
  entities: Array<{ id: number, name: string, type: string }>;
  accounts?: KlaviyoAccount[];
  lists?: KlaviyoList[];
  flows?: KlaviyoFlow[];
  campaigns?: KlaviyoCampaign[];
  templates?: KlaviyoTemplate[];
  metrics?: KlaviyoMetric[];
  onConnect?: (apiKey: string, entityId: number) => Promise<KlaviyoAccount>;
  onDisconnect?: (accountId: string) => Promise<void>;
  onSyncAccount?: (accountId: string) => Promise<void>;
  onCreateList?: (list: Omit<KlaviyoList, 'id'>) => Promise<KlaviyoList>;
  onUpdateList?: (id: string, list: Partial<KlaviyoList>) => Promise<KlaviyoList>;
  onDeleteList?: (id: string) => Promise<void>;
  onCreateCampaign?: (campaign: Omit<KlaviyoCampaign, 'id'>) => Promise<KlaviyoCampaign>;
  onUpdateCampaign?: (id: string, campaign: Partial<KlaviyoCampaign>) => Promise<KlaviyoCampaign>;
  onDeleteCampaign?: (id: string) => Promise<void>;
  onCreateFlow?: (flow: Omit<KlaviyoFlow, 'id'>) => Promise<KlaviyoFlow>;
  onUpdateFlow?: (id: string, flow: Partial<KlaviyoFlow>) => Promise<KlaviyoFlow>;
  onDeleteFlow?: (id: string) => Promise<void>;
  onCreateTemplate?: (template: Omit<KlaviyoTemplate, 'id'>) => Promise<KlaviyoTemplate>;
  onUpdateTemplate?: (id: string, template: Partial<KlaviyoTemplate>) => Promise<KlaviyoTemplate>;
  onDeleteTemplate?: (id: string) => Promise<void>;
}

const KlaviyoIntegration: React.FC<KlaviyoIntegrationProps> = ({
  entities,
  accounts = [],
  lists = [],
  flows = [],
  campaigns = [],
  templates = [],
  metrics = [],
  onConnect,
  onDisconnect,
  onSyncAccount,
  onCreateList,
  onUpdateList,
  onDeleteList,
  onCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onCreateFlow,
  onUpdateFlow,
  onDeleteFlow,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isCreatingFlow, setIsCreatingFlow] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Filter based on selected entity
  const filteredAccounts = accounts.filter(account => 
    selectedEntity === 'all' || account.entityId === selectedEntity
  );
  
  const filteredLists = lists.filter(list => {
    if (selectedEntity !== 'all' && list.entityId !== selectedEntity) {
      return false;
    }
    
    if (selectedAccount && list.accountId !== selectedAccount) {
      return false;
    }
    
    if (searchTerm) {
      return list.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });
  
  const filteredFlows = flows.filter(flow => {
    if (selectedEntity !== 'all' && flow.entityId !== selectedEntity) {
      return false;
    }
    
    if (selectedAccount && flow.accountId !== selectedAccount) {
      return false;
    }
    
    if (searchTerm) {
      return flow.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });
  
  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedEntity !== 'all' && campaign.entityId !== selectedEntity) {
      return false;
    }
    
    if (selectedAccount && campaign.accountId !== selectedAccount) {
      return false;
    }
    
    if (searchTerm) {
      return (
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });
  
  const filteredTemplates = templates.filter(template => {
    if (selectedEntity !== 'all' && template.entityId !== selectedEntity) {
      return false;
    }
    
    if (selectedAccount && template.accountId !== selectedAccount) {
      return false;
    }
    
    if (searchTerm) {
      return template.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });
  
  const filteredMetrics = metrics.filter(metric => {
    if (selectedEntity !== 'all' && metric.entityId !== selectedEntity) {
      return false;
    }
    
    if (selectedAccount && metric.accountId !== selectedAccount) {
      return false;
    }
    
    return true;
  });
  
  // Get selected account
  const selectedAccountDetails = selectedAccount 
    ? accounts.find(a => a.id === selectedAccount) 
    : (filteredAccounts.length > 0 ? filteredAccounts[0] : null);
  
  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format time
  const formatTime = (date: string | Date) => {
    try {
      return format(new Date(date), 'h:mm a');
    } catch (e) {
      return 'Invalid time';
    }
  };
  
  // Format date and time
  const formatDateTime = (date: string | Date) => {
    try {
      return `${formatDate(date)} at ${formatTime(date)}`;
    } catch (e) {
      return 'Invalid date/time';
    }
  };
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  // Handle connect Klaviyo
  const handleConnectKlaviyo = async () => {
    if (!newApiKey || selectedEntity === 'all') {
      toast({
        title: "Missing information",
        description: "Please provide your Klaviyo API key and select an entity.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onConnect) {
        const account = await onConnect(newApiKey, selectedEntity as number);
        
        toast({
          title: "Klaviyo connected",
          description: `Successfully connected ${account.name} to Klaviyo.`,
        });
        
        setIsConnecting(false);
        setNewApiKey('');
        setSelectedAccount(account.id);
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Klaviyo. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get metrics data for dashboard
  const getMetricsData = () => {
    const accountIds = selectedAccount 
      ? [selectedAccount] 
      : filteredAccounts.map(a => a.id);
    
    const relevantMetrics = filteredMetrics.filter(m => accountIds.includes(m.accountId));
    
    const totalSubscribers = filteredLists.reduce((sum, list) => sum + list.memberCount, 0);
    const openRateMetric = relevantMetrics.find(m => m.name === 'Open Rate');
    const clickRateMetric = relevantMetrics.find(m => m.name === 'Click Rate');
    const conversionRateMetric = relevantMetrics.find(m => m.name === 'Conversion Rate');
    const revenueMetric = relevantMetrics.find(m => m.name === 'Revenue');
    
    return {
      totalSubscribers,
      openRate: openRateMetric?.value || 0,
      clickRate: clickRateMetric?.value || 0,
      conversionRate: conversionRateMetric?.value || 0,
      revenue: revenueMetric?.value || 0,
    };
  };
  
  const metrics = getMetricsData();
  
  // Calculate campaign stats
  const getCampaignStats = () => {
    const sentCampaigns = filteredCampaigns.filter(c => c.status === 'sent');
    
    if (sentCampaigns.length === 0) {
      return {
        avgOpenRate: 0,
        avgClickRate: 0,
        avgConversionRate: 0,
        totalSent: 0,
        totalRevenue: 0,
      };
    }
    
    const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.stats?.recipients || 0), 0);
    const totalRevenue = sentCampaigns.reduce((sum, c) => sum + (c.stats?.revenue || 0), 0);
    const avgOpenRate = sentCampaigns.reduce((sum, c) => sum + (c.stats?.openRate || 0), 0) / sentCampaigns.length;
    const avgClickRate = sentCampaigns.reduce((sum, c) => sum + (c.stats?.clickRate || 0), 0) / sentCampaigns.length;
    const avgConversionRate = sentCampaigns.reduce((sum, c) => sum + (c.stats?.conversionRate || 0), 0) / sentCampaigns.length;
    
    return {
      avgOpenRate,
      avgClickRate,
      avgConversionRate,
      totalSent,
      totalRevenue,
    };
  };
  
  const campaignStats = getCampaignStats();
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Klaviyo Integration</h2>
          <p className="text-muted-foreground">
            Connect and manage your Klaviyo email marketing accounts
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
            onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id.toString()}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {filteredAccounts.length > 0 ? (
            <Select
              value={selectedAccount || ''}
              onValueChange={setSelectedAccount}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {filteredAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Button onClick={() => setIsConnecting(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Klaviyo
            </Button>
          )}
        </div>
      </div>
      
      {/* Account summary card */}
      {selectedAccountDetails && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg className="h-4 w-4 text-blue-700 dark:text-blue-300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.9998 14C27.9998 21.7319 21.7317 28 13.9998 28C6.2679 28 -0.000244141 21.7319 -0.000244141 14C-0.000244141 6.26812 6.2679 0 13.9998 0C21.7317 0 27.9998 6.26812 27.9998 14Z" fill="currentColor"/>
                      <path d="M9.1001 20.9C9.1001 21.5 8.6001 22 8.0001 22C7.4001 22 6.9001 21.5 6.9001 20.9V7.1C6.9001 6.5 7.4001 6 8.0001 6C8.6001 6 9.1001 6.5 9.1001 7.1V20.9Z" fill="white"/>
                      <path d="M14.1001 20.9C14.1001 21.5 13.6001 22 13.0001 22C12.4001 22 11.9001 21.5 11.9001 20.9V7.1C11.9001 6.5 12.4001 6 13.0001 6C13.6001 6 14.1001 6.5 14.1001 7.1V20.9Z" fill="white"/>
                      <path d="M19.1001 20.9C19.1001 21.5 18.6001 22 18.0001 22C17.4001 22 16.9001 21.5 16.9001 20.9V7.1C16.9001 6.5 17.4001 6 18.0001 6C18.6001 6 19.1001 6.5 19.1001 7.1V20.9Z" fill="white"/>
                      <path d="M24.1001 20.9C24.1001 21.5 23.6001 22 23.0001 22C22.4001 22 21.9001 21.5 21.9001 20.9V7.1C21.9001 6.5 22.4001 6 23.0001 6C23.6001 6 24.1001 6.5 24.1001 7.1V20.9Z" fill="white"/>
                    </svg>
                  </div>
                  {selectedAccountDetails.name}
                </CardTitle>
                <CardDescription>
                  {selectedAccountDetails.companyName}
                </CardDescription>
              </div>
              <Badge 
                variant="outline" 
                className={
                  selectedAccountDetails.status === 'active' ? 
                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                  selectedAccountDetails.status === 'error' ? 
                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                }
              >
                {selectedAccountDetails.status.charAt(0).toUpperCase() + selectedAccountDetails.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Connected Since</div>
                  <div className="font-medium">{formatDate(selectedAccountDetails.connectDate)}</div>
                </div>
                {selectedAccountDetails.lastSyncDate && (
                  <div>
                    <div className="text-sm text-muted-foreground">Last Synced</div>
                    <div className="font-medium">{formatDateTime(selectedAccountDetails.lastSyncDate)}</div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{selectedAccountDetails.email}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">API Key</div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAccountDetails.apiKey);
                      toast({
                        title: "API Key copied",
                        description: "The API key has been copied to your clipboard.",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-mono text-sm bg-muted px-3 py-1 rounded-md">
                  •••••••••••••{selectedAccountDetails.apiKey.slice(-4)}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (onSyncAccount && selectedAccountDetails) {
                    onSyncAccount(selectedAccountDetails.id);
                    toast({
                      title: "Sync started",
                      description: "Syncing data with Klaviyo...",
                    });
                  }
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
              
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    window.open('https://www.klaviyo.com/dashboard', '_blank');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Klaviyo
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (onDisconnect && selectedAccountDetails) {
                      onDisconnect(selectedAccountDetails.id);
                      setSelectedAccount(null);
                      toast({
                        title: "Account disconnected",
                        description: "Your Klaviyo account has been disconnected.",
                      });
                    }
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
      
      {/* Main tabs - Only show if there's a connected account */}
      {filteredAccounts.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(metrics.totalSubscribers)}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Across {filteredLists.length} lists
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                    Open Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(metrics.openRate)}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 font-medium">+2.5%</span>
                    <span>from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    Click Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(metrics.clickRate)}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500 font-medium">+1.2%</span>
                    <span>from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Conversion Rate: {formatPercentage(metrics.conversionRate)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-6">
                      <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No campaigns found</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setIsCreatingCampaign(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCampaigns
                        .sort((a, b) => 
                          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                        )
                        .slice(0, 3)
                        .map((campaign) => (
                          <div key={campaign.id} className="border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                              <div className="font-medium">{campaign.name}</div>
                              <Badge 
                                variant="outline" 
                                className={
                                  campaign.status === 'sent' ? 
                                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                  campaign.status === 'sending' ? 
                                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                  campaign.status === 'scheduled' ? 
                                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                  campaign.status === 'canceled' ? 
                                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                  "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                                }
                              >
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Subject: {campaign.subject}
                            </div>
                            {campaign.stats && (
                              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{formatNumber(campaign.stats.recipients)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MailOpen className="h-3 w-3" />
                                  <span>{formatPercentage(campaign.stats.openRate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MousePointerClick className="h-3 w-3" />
                                  <span>{formatPercentage(campaign.stats.clickRate)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm">Open Rate</div>
                        <div className="text-sm font-medium">{formatPercentage(campaignStats.avgOpenRate)}</div>
                      </div>
                      <Progress value={campaignStats.avgOpenRate * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm">Click Rate</div>
                        <div className="text-sm font-medium">{formatPercentage(campaignStats.avgClickRate)}</div>
                      </div>
                      <Progress value={campaignStats.avgClickRate * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm">Conversion Rate</div>
                        <div className="text-sm font-medium">{formatPercentage(campaignStats.avgConversionRate)}</div>
                      </div>
                      <Progress value={campaignStats.avgConversionRate * 100} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Sent</div>
                        <div className="font-medium">{formatNumber(campaignStats.totalSent)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                        <div className="font-medium">{formatCurrency(campaignStats.totalRevenue)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Lists Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Lists Overview</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsCreatingList(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create List
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>List Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLists.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Users className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No lists found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLists
                        .sort((a, b) => b.memberCount - a.memberCount)
                        .slice(0, 5)
                        .map((list) => (
                          <TableRow key={list.id}>
                            <TableCell>
                              <div className="font-medium">{list.name}</div>
                              {list.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {list.description}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {list.listType.charAt(0).toUpperCase() + list.listType.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatNumber(list.memberCount)}</TableCell>
                            <TableCell>{formatDate(list.createdDate)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedList(list.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Lists Tab */}
          <TabsContent value="lists" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search lists..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="segment">Segment</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => setIsCreatingList(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create List
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>List Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLists.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Users className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No lists found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLists.map((list) => (
                        <TableRow 
                          key={list.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedList(list.id)}
                        >
                          <TableCell>
                            <div className="font-medium">{list.name}</div>
                            {list.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {list.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {list.listType.charAt(0).toUpperCase() + list.listType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatNumber(list.memberCount)}</TableCell>
                          <TableCell>{formatDate(list.createdDate)}</TableCell>
                          <TableCell>{formatDate(list.updatedDate)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedList(list.id);
                                }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Subscribers
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Create Campaign
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Workflow className="mr-2 h-4 w-4" />
                                  Create Flow
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Import Subscribers
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Share className="mr-2 h-4 w-4" />
                                  Export Subscribers
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onDeleteList) {
                                      onDeleteList(list.id);
                                    }
                                  }} 
                                  className="text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="sending">Sending</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => setIsCreatingCampaign(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Lists</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent/Scheduled</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Mail className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No campaigns found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCampaigns
                        .sort((a, b) => {
                          const dateA = a.sendDate
                            ? new Date(a.sendDate).getTime()
                            : new Date(a.createdDate).getTime();
                          const dateB = b.sendDate
                            ? new Date(b.sendDate).getTime()
                            : new Date(b.createdDate).getTime();
                          return dateB - dateA;
                        })
                        .map((campaign) => (
                          <TableRow 
                            key={campaign.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedCampaign(campaign.id)}
                          >
                            <TableCell>
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Subject: {campaign.subject}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {campaign.listIds.map((listId, index) => {
                                  const list = lists.find(l => l.id === listId);
                                  return list ? (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {list.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  campaign.status === 'sent' ? 
                                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                  campaign.status === 'sending' ? 
                                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                  campaign.status === 'scheduled' ? 
                                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                  campaign.status === 'canceled' ? 
                                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                  "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                                }
                              >
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {campaign.sendDate ? (
                                <div>
                                  <div>{formatDate(campaign.sendDate)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatTime(campaign.sendDate)}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not scheduled</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {campaign.stats ? (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Opens:</span>
                                    <span>{formatPercentage(campaign.stats.openRate)}</span>
                                  </div>
                                  <Progress value={campaign.stats.openRate * 100} className="h-1" />
                                  
                                  <div className="flex justify-between text-xs">
                                    <span>Clicks:</span>
                                    <span>{formatPercentage(campaign.stats.clickRate)}</span>
                                  </div>
                                  <Progress value={campaign.stats.clickRate * 100} className="h-1" />
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No data</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCampaign(campaign.id);
                                  }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {campaign.status === 'draft' && (
                                    <>
                                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                        <Clock className="mr-2 h-4 w-4" />
                                        Schedule
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onUpdateCampaign) {
                                          onUpdateCampaign(campaign.id, { 
                                            status: 'sending',
                                            sendDate: new Date()
                                          });
                                        }
                                      }}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Now
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {campaign.status === 'scheduled' && (
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      if (onUpdateCampaign) {
                                        onUpdateCampaign(campaign.id, { status: 'canceled' });
                                      }
                                    }}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancel
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  {campaign.status === 'sent' && (
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                      <BarChart2 className="mr-2 h-4 w-4" />
                                      Analytics
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  {campaign.status !== 'sent' && campaign.status !== 'sending' && (
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onDeleteCampaign) {
                                          onDeleteCampaign(campaign.id);
                                        }
                                      }} 
                                      className="text-red-600"
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Flows Tab */}
          <TabsContent value="flows" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search flows..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trigger Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="metric">Metric</SelectItem>
                    <SelectItem value="segment">Segment</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => setIsCreatingFlow(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Flow
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flow</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Workflow className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No flows found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFlows
                        .sort((a, b) => 
                          new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
                        )
                        .map((flow) => (
                          <TableRow 
                            key={flow.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedFlow(flow.id)}
                          >
                            <TableCell>
                              <div className="font-medium">{flow.name}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {flow.triggerType.charAt(0).toUpperCase() + flow.triggerType.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  flow.status === 'active' ? 
                                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                  flow.status === 'inactive' ? 
                                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                                  "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                                }
                              >
                                {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(flow.createdDate)}</TableCell>
                            <TableCell>
                              {flow.stats ? (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Recipients:</span>
                                    <span>{formatNumber(flow.stats.recipients)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span>Conversions:</span>
                                    <span>{formatNumber(flow.stats.conversions)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span>Revenue:</span>
                                    <span>{formatCurrency(flow.stats.revenue)}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No data</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFlow(flow.id);
                                  }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  {flow.status === 'active' ? (
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      if (onUpdateFlow) {
                                        onUpdateFlow(flow.id, { status: 'inactive' });
                                      }
                                    }}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      if (onUpdateFlow) {
                                        onUpdateFlow(flow.id, { status: 'active' });
                                      }
                                    }}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Activate
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <BarChart2 className="mr-2 h-4 w-4" />
                                    Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onDeleteFlow) {
                                        onDeleteFlow(flow.id);
                                      }
                                    }} 
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={() => setIsCreatingTemplate(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium">No templates found</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                      Create email templates to streamline your campaign creation
                    </p>
                    <Button className="mt-4" onClick={() => setIsCreatingTemplate(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                      {template.thumbnail ? (
                        <img 
                          src={template.thumbnail} 
                          alt={template.name} 
                          className="h-full w-full object-cover transition-transform hover:scale-105" 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileText className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <Badge 
                        variant="outline" 
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm dark:bg-black/60"
                      >
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-xs text-muted-foreground">
                        Updated {formatDate(template.updatedDate)}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Create campaign with this template
                          setIsCreatingCampaign(true);
                        }}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Use
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit template
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Share className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onDeleteTemplate) {
                                  onDeleteTemplate(template.id);
                                }
                              }} 
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key metrics and analytics from your Klaviyo account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Open Rate</div>
                      <div className="text-2xl font-bold">{formatPercentage(metrics.openRate)}</div>
                      <Progress value={metrics.openRate * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Industry average: 21.5%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Click Rate</div>
                      <div className="text-2xl font-bold">{formatPercentage(metrics.clickRate)}</div>
                      <Progress value={metrics.clickRate * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Industry average: 2.3%
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Conversion Rate</div>
                      <div className="text-2xl font-bold">{formatPercentage(metrics.conversionRate)}</div>
                      <Progress value={metrics.conversionRate * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Industry average: 0.17%
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Revenue by Campaign</div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Campaign</TableHead>
                          <TableHead>Sent</TableHead>
                          <TableHead>Opens</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>Conversions</TableHead>
                          <TableHead>Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCampaigns
                          .filter(c => c.stats && c.stats.revenue > 0)
                          .sort((a, b) => (b.stats?.revenue || 0) - (a.stats?.revenue || 0))
                          .slice(0, 5)
                          .map((campaign) => (
                            <TableRow key={campaign.id}>
                              <TableCell>
                                <div className="font-medium">{campaign.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(campaign.sendDate || campaign.createdDate)}
                                </div>
                              </TableCell>
                              <TableCell>{formatNumber(campaign.stats?.recipients || 0)}</TableCell>
                              <TableCell>{formatPercentage(campaign.stats?.openRate || 0)}</TableCell>
                              <TableCell>{formatPercentage(campaign.stats?.clickRate || 0)}</TableCell>
                              <TableCell>{formatNumber(campaign.stats?.conversions || 0)}</TableCell>
                              <TableCell>{formatCurrency(campaign.stats?.revenue || 0)}</TableCell>
                            </TableRow>
                          ))
                        }
                        {filteredCampaigns
                          .filter(c => c.stats && c.stats.revenue > 0).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              <span className="text-muted-foreground">No revenue data available</span>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm font-medium mb-2">List Growth</div>
                    <div className="h-[250px] w-full flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">List growth chart would go here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <svg className="h-6 w-6 text-blue-700 dark:text-blue-300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.9998 14C27.9998 21.7319 21.7317 28 13.9998 28C6.2679 28 -0.000244141 21.7319 -0.000244141 14C-0.000244141 6.26812 6.2679 0 13.9998 0C21.7317 0 27.9998 6.26812 27.9998 14Z" fill="currentColor"/>
                <path d="M9.1001 20.9C9.1001 21.5 8.6001 22 8.0001 22C7.4001 22 6.9001 21.5 6.9001 20.9V7.1C6.9001 6.5 7.4001 6 8.0001 6C8.6001 6 9.1001 6.5 9.1001 7.1V20.9Z" fill="white"/>
                <path d="M14.1001 20.9C14.1001 21.5 13.6001 22 13.0001 22C12.4001 22 11.9001 21.5 11.9001 20.9V7.1C11.9001 6.5 12.4001 6 13.0001 6C13.6001 6 14.1001 6.5 14.1001 7.1V20.9Z" fill="white"/>
                <path d="M19.1001 20.9C19.1001 21.5 18.6001 22 18.0001 22C17.4001 22 16.9001 21.5 16.9001 20.9V7.1C16.9001 6.5 17.4001 6 18.0001 6C18.6001 6 19.1001 6.5 19.1001 7.1V20.9Z" fill="white"/>
                <path d="M24.1001 20.9C24.1001 21.5 23.6001 22 23.0001 22C22.4001 22 21.9001 21.5 21.9001 20.9V7.1C21.9001 6.5 22.4001 6 23.0001 6C23.6001 6 24.1001 6.5 24.1001 7.1V20.9Z" fill="white"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect to Klaviyo</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Connect your Klaviyo account to manage email campaigns, automation flows, and track performance metrics
            </p>
            <Button onClick={() => setIsConnecting(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Klaviyo Account
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Connect Klaviyo Dialog */}
      <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-4 w-4 text-blue-700 dark:text-blue-300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.9998 14C27.9998 21.7319 21.7317 28 13.9998 28C6.2679 28 -0.000244141 21.7319 -0.000244141 14C-0.000244141 6.26812 6.2679 0 13.9998 0C21.7317 0 27.9998 6.26812 27.9998 14Z" fill="currentColor"/>
                  <path d="M9.1001 20.9C9.1001 21.5 8.6001 22 8.0001 22C7.4001 22 6.9001 21.5 6.9001 20.9V7.1C6.9001 6.5 7.4001 6 8.0001 6C8.6001 6 9.1001 6.5 9.1001 7.1V20.9Z" fill="white"/>
                  <path d="M14.1001 20.9C14.1001 21.5 13.6001 22 13.0001 22C12.4001 22 11.9001 21.5 11.9001 20.9V7.1C11.9001 6.5 12.4001 6 13.0001 6C13.6001 6 14.1001 6.5 14.1001 7.1V20.9Z" fill="white"/>
                  <path d="M19.1001 20.9C19.1001 21.5 18.6001 22 18.0001 22C17.4001 22 16.9001 21.5 16.9001 20.9V7.1C16.9001 6.5 17.4001 6 18.0001 6C18.6001 6 19.1001 6.5 19.1001 7.1V20.9Z" fill="white"/>
                  <path d="M24.1001 20.9C24.1001 21.5 23.6001 22 23.0001 22C22.4001 22 21.9001 21.5 21.9001 20.9V7.1C21.9001 6.5 22.4001 6 23.0001 6C23.6001 6 24.1001 6.5 24.1001 7.1V20.9Z" fill="white"/>
                </svg>
              </div>
              Connect to Klaviyo
            </DialogTitle>
            <DialogDescription>
              Connect your Klaviyo account to integrate with your business
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="entity-select">Business Entity</Label>
              <Select
                value={selectedEntity === 'all' ? undefined : selectedEntity.toString()}
                onValueChange={(value) => setSelectedEntity(parseInt(value))}
              >
                <SelectTrigger id="entity-select">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">Klaviyo Private API Key</Label>
              <Input 
                id="api-key" 
                type="password"
                placeholder="pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find your Private API Key in your Klaviyo account under Account → Settings → API Keys
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    What this integration will access
                  </h4>
                  <ul className="mt-1 text-sm text-blue-700 dark:text-blue-400 list-disc pl-5 space-y-1">
                    <li>Email campaigns and metrics</li>
                    <li>Subscriber lists and segments</li>
                    <li>Automated flows and analytics</li>
                    <li>Email templates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConnecting(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConnectKlaviyo}
              disabled={isLoading || !newApiKey || selectedEntity === 'all'}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Campaign Detail Dialog would be implemented here */}
      
      {/* Template Detail Dialog would be implemented here */}
      
      {/* List Detail Dialog would be implemented here */}
      
      {/* Flow Detail Dialog would be implemented here */}
      
      {/* Create Campaign Dialog would be implemented here */}
      
      {/* Create Template Dialog would be implemented here */}
      
      {/* Create List Dialog would be implemented here */}
      
      {/* Create Flow Dialog would be implemented here */}
    </div>
  );
};

export default KlaviyoIntegration;