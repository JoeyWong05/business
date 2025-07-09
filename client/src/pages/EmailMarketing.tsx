import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowUpRight,
  BarChart,
  Clock,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  LineChart,
  Link2,
  Mail,
  MessageCircle,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Smartphone,
  Upload
} from "lucide-react";
import { Link } from "wouter";

// Email platform interfaces
enum EmailPlatform {
  KLAVIYO = 'klaviyo',
  SENDLANE = 'sendlane', 
  MAILCHIMP = 'mailchimp',
  CONSTANT_CONTACT = 'constant_contact',
  CAMPAIGN_MONITOR = 'campaign_monitor',
  AWEBER = 'aweber',
  ACTIVE_CAMPAIGN = 'active_campaign',
  DRIP = 'drip',
  CONVERTKIT = 'convertkit',
  MANUAL = 'manual' // For spreadsheet imports
}

interface EmailMarketingPlatform {
  id: EmailPlatform;
  name: string;
  connected: boolean;
  lastSynced?: string;
  accounts?: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  }[];
}

interface EmailCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  platform: EmailPlatform;
  type: 'newsletter' | 'promotional' | 'transactional' | 'automated' | 'announcement';
  subject: string;
  previewText?: string;
  fromName: string;
  fromEmail: string;
  scheduledDate?: string;
  sentDate?: string;
  stats?: {
    recipients: number;
    opens: number;
    openRate: number;
    clicks: number;
    clickRate: number;
    conversions?: number;
    conversionRate?: number;
    revenue?: number;
    unsubscribes: number;
    unsubscribeRate: number;
    complaints?: number;
    complaintRate?: number;
  };
  listId?: string;
  listName?: string;
  tags?: string[];
  entityId: number;
  entityName: string;
}

interface SMSCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  platform: EmailPlatform;
  message: string;
  mediaUrl?: string;
  scheduledDate?: string;
  sentDate?: string;
  stats?: {
    recipients: number;
    delivered: number;
    deliveryRate: number;
    clicks?: number;
    clickRate?: number;
    responses?: number;
    responseRate?: number;
    conversions?: number;
    conversionRate?: number;
    revenue?: number;
    optOuts: number;
    optOutRate: number;
  };
  listId?: string;
  listName?: string;
  tags?: string[];
  entityId: number;
  entityName: string;
}

interface List {
  id: string;
  name: string;
  platform: EmailPlatform;
  subscribers: number;
  type: 'standard' | 'segment' | 'suppression';
  growthRate: number;
  createdAt: string;
  description?: string;
  tags?: string[];
  entityId: number;
  entityName: string;
}

interface Automation {
  id: string;
  name: string;
  platform: EmailPlatform;
  status: 'active' | 'paused' | 'draft';
  type: 'welcome' | 'abandoned_cart' | 'browse_abandonment' | 'birthday' | 'post_purchase' | 'win_back' | 'custom';
  triggers: string[];
  steps: number;
  metrics?: {
    recipients: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
  entityId: number;
  entityName: string;
}

export default function EmailMarketing() {
  // State for tab management
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<EmailPlatform | 'all'>('all');
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<EmailPlatform | null>(null);
  const [showApiTokenField, setShowApiTokenField] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Sample data
  const platforms: EmailMarketingPlatform[] = [
    { 
      id: EmailPlatform.KLAVIYO, 
      name: 'Klaviyo',
      connected: true,
      lastSynced: '2025-03-22T14:30:00Z',
      accounts: [
        { id: 'klv-1', name: 'Digital Merch Pros', email: 'marketing@digitalmerchhq.com', isActive: true }
      ]
    },
    { 
      id: EmailPlatform.SENDLANE, 
      name: 'Sendlane',
      connected: true,
      lastSynced: '2025-03-22T10:15:00Z',
      accounts: [
        { id: 'sdl-1', name: 'Mystery Hype', email: 'marketing@mysteryhype.com', isActive: true }
      ]
    },
    { id: EmailPlatform.MAILCHIMP, name: 'Mailchimp', connected: false },
    { id: EmailPlatform.CONSTANT_CONTACT, name: 'Constant Contact', connected: false },
    { id: EmailPlatform.CAMPAIGN_MONITOR, name: 'Campaign Monitor', connected: false },
    { id: EmailPlatform.AWEBER, name: 'AWeber', connected: false },
    { id: EmailPlatform.ACTIVE_CAMPAIGN, name: 'ActiveCampaign', connected: false },
    { id: EmailPlatform.DRIP, name: 'Drip', connected: false },
    { id: EmailPlatform.CONVERTKIT, name: 'ConvertKit', connected: false },
    { id: EmailPlatform.MANUAL, name: 'Manual Import (Excel/Sheets)', connected: true }
  ];

  // Sample entities
  const entities = [
    { id: 1, name: 'Digital Merch Pros' },
    { id: 2, name: 'Mystery Hype' },
    { id: 3, name: 'Lone Star Custom Clothing' },
    { id: 4, name: 'Alcoeaze' },
    { id: 5, name: 'Hide Cafe Bars' }
  ];

  // Sample campaigns
  const emailCampaigns: EmailCampaign[] = [
    {
      id: 'em-1',
      name: 'March New Arrivals',
      status: 'sent',
      platform: EmailPlatform.KLAVIYO,
      type: 'newsletter',
      subject: 'New Spring Collection is Here! 🌸',
      previewText: 'Check out our fresh designs for spring!',
      fromName: 'Digital Merch Pros',
      fromEmail: 'news@digitalmerchhq.com',
      sentDate: '2025-03-15T10:00:00Z',
      stats: {
        recipients: 4586,
        opens: 1527,
        openRate: 33.3,
        clicks: 432,
        clickRate: 9.4,
        conversions: 78,
        conversionRate: 1.7,
        revenue: 3896.45,
        unsubscribes: 12,
        unsubscribeRate: 0.26,
        complaints: 2,
        complaintRate: 0.04
      },
      listName: 'Active Subscribers',
      tags: ['spring', 'newsletter', 'new-collection'],
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'em-2',
      name: 'Mystery Box Announcement',
      status: 'scheduled',
      platform: EmailPlatform.SENDLANE,
      type: 'promotional',
      subject: 'Mystery Box Reveal This Weekend! 📦',
      previewText: 'Limited spots available for our exclusive drop',
      fromName: 'Mystery Hype',
      fromEmail: 'drops@mysteryhype.com',
      scheduledDate: '2025-03-25T09:00:00Z',
      listName: 'Mystery Box Subscribers',
      tags: ['mystery-box', 'promotion', 'limited'],
      entityId: 2,
      entityName: 'Mystery Hype'
    },
    {
      id: 'em-3',
      name: 'Order Confirmation Flow',
      status: 'sent',
      platform: EmailPlatform.KLAVIYO,
      type: 'transactional',
      subject: 'Your Order Confirmation',
      fromName: 'Digital Merch Pros',
      fromEmail: 'orders@digitalmerchhq.com',
      sentDate: '2025-03-20T14:30:00Z',
      stats: {
        recipients: 1205,
        opens: 1086,
        openRate: 90.1,
        clicks: 687,
        clickRate: 57.0,
        unsubscribes: 0,
        unsubscribeRate: 0
      },
      listName: 'Transactional',
      tags: ['transactional', 'order-flow'],
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'em-4',
      name: 'Customer Feedback Survey',
      status: 'draft',
      platform: EmailPlatform.MANUAL,
      type: 'announcement',
      subject: 'We Value Your Feedback! 🔍',
      previewText: 'Complete our survey for 10% off your next order',
      fromName: 'Lone Star Custom Clothing',
      fromEmail: 'feedback@lonestarcustom.com',
      tags: ['survey', 'feedback', 'discount'],
      entityId: 3,
      entityName: 'Lone Star Custom Clothing'
    }
  ];

  // Sample SMS campaigns
  const smsCampaigns: SMSCampaign[] = [
    {
      id: 'sms-1',
      name: 'Flash Sale Alert',
      status: 'sent',
      platform: EmailPlatform.KLAVIYO,
      message: '24 HOURS ONLY! Use code FLASH20 for 20% off all orders over $50. Shop now: https://dmp.shop/flash',
      sentDate: '2025-03-18T09:00:00Z',
      stats: {
        recipients: 2342,
        delivered: 2289,
        deliveryRate: 97.7,
        clicks: 578,
        clickRate: 24.7,
        conversions: 112,
        conversionRate: 4.8,
        revenue: 5631.42,
        optOuts: 18,
        optOutRate: 0.77
      },
      listName: 'SMS Subscribers',
      tags: ['flash-sale', 'discount', 'urgent'],
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'sms-2',
      name: 'Mystery Box Reminder',
      status: 'scheduled',
      platform: EmailPlatform.SENDLANE,
      message: 'REMINDER: Our exclusive Mystery Box drop is tomorrow at 10AM CT! Set your alarms! https://mh.co/box',
      scheduledDate: '2025-03-24T09:00:00Z',
      listName: 'Mystery Box SMS List',
      tags: ['mystery-box', 'reminder'],
      entityId: 2,
      entityName: 'Mystery Hype'
    },
    {
      id: 'sms-3',
      name: 'Shipping Confirmation',
      status: 'sent',
      platform: EmailPlatform.KLAVIYO,
      message: 'Your order #12345 has shipped! Track your package here: https://dmp.shop/track/12345',
      sentDate: '2025-03-20T15:30:00Z',
      stats: {
        recipients: 856,
        delivered: 856,
        deliveryRate: 100,
        clicks: 612,
        clickRate: 71.5,
        optOuts: 1,
        optOutRate: 0.12
      },
      listName: 'Transactional SMS',
      tags: ['transactional', 'shipping'],
      entityId: 1,
      entityName: 'Digital Merch Pros'
    }
  ];

  // Sample lists
  const lists: List[] = [
    {
      id: 'list-1',
      name: 'Active Subscribers',
      platform: EmailPlatform.KLAVIYO,
      subscribers: 4586,
      type: 'standard',
      growthRate: 2.4,
      createdAt: '2023-06-15T00:00:00Z',
      description: 'Main email list for Digital Merch Pros',
      tags: ['active', 'main-list'],
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'list-2',
      name: 'Mystery Box Subscribers',
      platform: EmailPlatform.SENDLANE,
      subscribers: 2187,
      type: 'segment',
      growthRate: 5.7,
      createdAt: '2023-09-22T00:00:00Z',
      description: 'Subscribers interested in mystery box drops',
      tags: ['mystery-box', 'high-engagement'],
      entityId: 2,
      entityName: 'Mystery Hype'
    },
    {
      id: 'list-3',
      name: 'SMS Subscribers',
      platform: EmailPlatform.KLAVIYO,
      subscribers: 2342,
      type: 'standard',
      growthRate: 3.2,
      createdAt: '2023-08-10T00:00:00Z',
      tags: ['sms', 'mobile'],
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'list-4',
      name: 'Inactive Customers',
      platform: EmailPlatform.KLAVIYO,
      subscribers: 1256,
      type: 'segment',
      growthRate: -0.5,
      createdAt: '2023-11-05T00:00:00Z',
      description: 'Customers who haven\'t purchased in 90+ days',
      tags: ['win-back', 'inactive'],
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'list-5',
      name: 'Excel Import - Event Contacts',
      platform: EmailPlatform.MANUAL,
      subscribers: 247,
      type: 'standard',
      growthRate: 0,
      createdAt: '2025-02-28T00:00:00Z',
      description: 'Contacts collected at SXSW event',
      tags: ['event', 'import', 'excel'],
      entityId: 3,
      entityName: 'Lone Star Custom Clothing'
    }
  ];

  // Sample automations
  const automations: Automation[] = [
    {
      id: 'auto-1',
      name: 'Welcome Series',
      platform: EmailPlatform.KLAVIYO,
      status: 'active',
      type: 'welcome',
      triggers: ['New Subscriber'],
      steps: 3,
      metrics: {
        recipients: 876,
        conversions: 152,
        conversionRate: 17.4,
        revenue: 7580.32
      },
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2025-02-15T00:00:00Z',
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'auto-2',
      name: 'Abandoned Cart Recovery',
      platform: EmailPlatform.KLAVIYO,
      status: 'active',
      type: 'abandoned_cart',
      triggers: ['Cart Abandoned'],
      steps: 3,
      metrics: {
        recipients: 1245,
        conversions: 327,
        conversionRate: 26.3,
        revenue: 18435.75
      },
      createdAt: '2024-02-05T00:00:00Z',
      updatedAt: '2025-03-01T00:00:00Z',
      entityId: 1,
      entityName: 'Digital Merch Pros'
    },
    {
      id: 'auto-3',
      name: 'Mystery Box Interest Flow',
      platform: EmailPlatform.SENDLANE,
      status: 'active',
      type: 'custom',
      triggers: ['Form Submission: Mystery Box Interest'],
      steps: 4,
      metrics: {
        recipients: 583,
        conversions: 194,
        conversionRate: 33.3,
        revenue: 12257.88
      },
      createdAt: '2024-03-12T00:00:00Z',
      updatedAt: '2025-03-15T00:00:00Z',
      entityId: 2,
      entityName: 'Mystery Hype'
    },
    {
      id: 'auto-4',
      name: 'Win-Back Campaign',
      platform: EmailPlatform.KLAVIYO,
      status: 'draft',
      type: 'win_back',
      triggers: ['No Purchase in 60 Days'],
      steps: 2,
      createdAt: '2025-03-18T00:00:00Z',
      updatedAt: '2025-03-18T00:00:00Z',
      entityId: 1,
      entityName: 'Digital Merch Pros'
    }
  ];

  // Filter data based on selections
  const filteredEmails = emailCampaigns.filter(campaign => {
    const platformMatch = selectedPlatform === 'all' || campaign.platform === selectedPlatform;
    const entityMatch = selectedEntity === 'all' || campaign.entityId === selectedEntity;
    const searchMatch = !searchQuery || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return platformMatch && entityMatch && searchMatch;
  });

  const filteredSMS = smsCampaigns.filter(campaign => {
    const platformMatch = selectedPlatform === 'all' || campaign.platform === selectedPlatform;
    const entityMatch = selectedEntity === 'all' || campaign.entityId === selectedEntity;
    const searchMatch = !searchQuery || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return platformMatch && entityMatch && searchMatch;
  });

  const filteredLists = lists.filter(list => {
    const platformMatch = selectedPlatform === 'all' || list.platform === selectedPlatform;
    const entityMatch = selectedEntity === 'all' || list.entityId === selectedEntity;
    const searchMatch = !searchQuery || 
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return platformMatch && entityMatch && searchMatch;
  });

  const filteredAutomations = automations.filter(automation => {
    const platformMatch = selectedPlatform === 'all' || automation.platform === selectedPlatform;
    const entityMatch = selectedEntity === 'all' || automation.entityId === selectedEntity;
    const searchMatch = !searchQuery || 
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.triggers.some(trigger => trigger.toLowerCase().includes(searchQuery.toLowerCase())) ||
      automation.type.includes(searchQuery.toLowerCase());
    
    return platformMatch && entityMatch && searchMatch;
  });

  // Statistics
  const connectedPlatforms = platforms.filter(p => p.connected).length;
  const totalEmailCampaigns = emailCampaigns.length;
  const totalSMSCampaigns = smsCampaigns.length;
  const totalActiveAutomations = automations.filter(a => a.status === 'active').length;
  
  const totalSubscribers = lists.reduce((total, list) => total + list.subscribers, 0);
  
  // Calculate average metrics
  const emailStats = emailCampaigns
    .filter(campaign => campaign.stats)
    .map(campaign => campaign.stats!);
    
  const avgOpenRate = emailStats.length 
    ? emailStats.reduce((sum, stats) => sum + stats.openRate, 0) / emailStats.length 
    : 0;
    
  const avgClickRate = emailStats.length 
    ? emailStats.reduce((sum, stats) => sum + stats.clickRate, 0) / emailStats.length 
    : 0;
    
  const totalEmailRevenue = emailStats
    .reduce((sum, stats) => sum + (stats.revenue || 0), 0);
    
  const smsStats = smsCampaigns
    .filter(campaign => campaign.stats)
    .map(campaign => campaign.stats!);
    
  const avgSMSClickRate = smsStats.length 
    ? smsStats.reduce((sum, stats) => sum + (stats.clickRate || 0), 0) / smsStats.length 
    : 0;
    
  const totalSMSRevenue = smsStats
    .reduce((sum, stats) => sum + (stats.revenue || 0), 0);

  // Handlers
  const handleConnectPlatform = (platformId: EmailPlatform) => {
    setConnectingPlatform(platformId);
    setConnectDialogOpen(true);
  };

  const handleShowManualImport = () => {
    setImportDialogOpen(true);
  };

  // Helper to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1,
      notation: num > 9999 ? 'compact' : 'standard'
    }).format(num);
  };

  // Helper to format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Helper to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  // Helper to get platform badge styling
  const getPlatformBadge = (platform: EmailPlatform) => {
    switch(platform) {
      case EmailPlatform.KLAVIYO:
        return <Badge className="bg-indigo-500 hover:bg-indigo-600">Klaviyo</Badge>;
      case EmailPlatform.SENDLANE:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Sendlane</Badge>;
      case EmailPlatform.MAILCHIMP:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Mailchimp</Badge>;
      case EmailPlatform.MANUAL:
        return <Badge variant="outline" className="border-gray-400 text-gray-700 dark:text-gray-300">Manual</Badge>;
      default:
        return <Badge variant="secondary">{platform}</Badge>;
    }
  };

  // Helper to get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
      case 'sent':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case 'draft':
        return <Badge variant="outline">{status}</Badge>;
      case 'paused':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-8 w-8" /> Email Marketing
          </h1>
          <p className="text-muted-foreground">
            Manage email campaigns, SMS messages, and automations across all platforms
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>
      
      {/* Controls & Filters */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <Label htmlFor="platform-filter">Platform</Label>
              <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as EmailPlatform | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.filter(p => p.connected).map(platform => (
                    <SelectItem key={platform.id} value={platform.id}>{platform.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="entity-filter">Business Entity</Label>
              <Select value={String(selectedEntity)} onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>{entity.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:ml-4">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search campaigns, lists..."
                  className="pl-9 w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShowManualImport}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleConnectPlatform(EmailPlatform.KLAVIYO)}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Connect Platform
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Overview Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{connectedPlatforms}/{platforms.length}</div>
              {connectedPlatforms === platforms.length ? 
                <Badge className="bg-green-500">All Connected</Badge> :
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 dark:text-blue-400 p-0 h-auto font-medium"
                  onClick={() => handleConnectPlatform(platforms.find(p => !p.connected)?.id || EmailPlatform.KLAVIYO)}
                >
                  Connect More
                </Button>
              }
            </div>
            <div className="mt-4">
              <Progress value={(connectedPlatforms / platforms.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{formatNumber(totalSubscribers)}</div>
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+{formatNumber(lists.reduce((sum, list) => sum + (list.subscribers * list.growthRate / 100), 0))}</span>
                <span className="text-muted-foreground ml-1">/ mo</span>
              </div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Across {lists.length} active lists
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Email Open Rate</div>
                <div className="text-xl font-semibold">{avgOpenRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Email Click Rate</div>
                <div className="text-xl font-semibold">{avgClickRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">SMS Click Rate</div>
                <div className="text-xl font-semibold">{avgSMSClickRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Active Automations</div>
                <div className="text-xl font-semibold">{totalActiveAutomations}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(totalEmailRevenue + totalSMSRevenue)}
            </div>
            <div className="flex text-sm mt-1">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-muted-foreground">Email: {formatCurrency(totalEmailRevenue)}</span>
              </div>
              <div className="flex items-center ml-4">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-muted-foreground">SMS: {formatCurrency(totalSMSRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <LineChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <Mail className="h-4 w-4 mr-2" />
            Email Campaigns
          </TabsTrigger>
          <TabsTrigger value="sms" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <Smartphone className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="lists" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <FileText className="h-4 w-4 mr-2" />
            Lists & Segments
          </TabsTrigger>
          <TabsTrigger value="automations" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <Settings className="h-4 w-4 mr-2" />
            Automations
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key email and SMS performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex justify-center items-center">
                  <div className="text-center space-y-4">
                    <PieChart className="h-12 w-12 mx-auto text-primary opacity-70" />
                    <div>
                      <p className="text-lg font-medium">Interactive Performance Charts</p>
                      <p className="text-sm text-muted-foreground">
                        Shows email and SMS metrics over time
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Campaigns */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Latest email and SMS campaigns</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/email-marketing/campaigns">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...emailCampaigns, ...smsCampaigns]
                    .sort((a, b) => {
                      const dateA = a.sentDate || a.scheduledDate || '0';
                      const dateB = b.sentDate || b.scheduledDate || '0';
                      return new Date(dateB).getTime() - new Date(dateA).getTime();
                    })
                    .slice(0, 5)
                    .map(campaign => {
                      const isEmail = 'subject' in campaign;
                      return (
                        <div key={campaign.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="font-medium flex items-center">
                                {isEmail ? <Mail className="h-4 w-4 mr-2 text-blue-500" /> : <Smartphone className="h-4 w-4 mr-2 text-green-500" />}
                                {campaign.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {isEmail 
                                  ? (campaign as EmailCampaign).subject 
                                  : (campaign as SMSCampaign).message.substring(0, 50) + '...'}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(campaign.status)}
                              {getPlatformBadge(campaign.platform)}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <div className="text-muted-foreground">
                              {campaign.sentDate 
                                ? `Sent ${formatDate(campaign.sentDate)}` 
                                : campaign.scheduledDate 
                                  ? `Scheduled for ${formatDate(campaign.scheduledDate)}`
                                  : 'Draft'}
                            </div>
                            {campaign.stats && (
                              <div className="font-medium">
                                {isEmail 
                                  ? `${(campaign as EmailCampaign).stats?.openRate.toFixed(1)}% open rate` 
                                  : `${(campaign as SMSCampaign).stats?.clickRate?.toFixed(1)}% click rate`}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Top Performing Lists */}
            <Card>
              <CardHeader>
                <CardTitle>Top Lists</CardTitle>
                <CardDescription>Lists with highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lists
                    .sort((a, b) => b.subscribers - a.subscribers)
                    .slice(0, 3)
                    .map(list => (
                      <div key={list.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{list.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatNumber(list.subscribers)} subscribers
                          </div>
                        </div>
                        <div className="text-sm flex items-center">
                          {list.growthRate > 0 ? (
                            <div className="text-green-600 dark:text-green-400 flex items-center">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              {list.growthRate.toFixed(1)}%
                            </div>
                          ) : (
                            <div className="text-red-600 dark:text-red-400">
                              {list.growthRate.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/email-marketing/lists">View All Lists</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Active Automations */}
            <Card>
              <CardHeader>
                <CardTitle>Active Automations</CardTitle>
                <CardDescription>Currently running automation flows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automations
                    .filter(a => a.status === 'active')
                    .slice(0, 3)
                    .map(automation => (
                      <div key={automation.id} className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{automation.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <Settings className="h-3 w-3 mr-1" />
                            {automation.steps} steps
                            {automation.metrics && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{automation.metrics.conversions} conversions</span>
                              </>
                            )}
                          </div>
                        </div>
                        {automation.metrics && (
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(automation.metrics.revenue)}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/email-marketing/automations">View All Automations</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Connected Platforms Status */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>Status of integrated services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platforms
                    .filter(p => p.connected)
                    .map(platform => (
                      <div key={platform.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            platform.id === EmailPlatform.KLAVIYO 
                              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
                              : platform.id === EmailPlatform.SENDLANE
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                : platform.id === EmailPlatform.MANUAL
                                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {platform.id === EmailPlatform.KLAVIYO && 'K'}
                            {platform.id === EmailPlatform.SENDLANE && 'S'}
                            {platform.id === EmailPlatform.MANUAL && <FileSpreadsheet className="h-4 w-4" />}
                            {platform.id !== EmailPlatform.KLAVIYO && 
                             platform.id !== EmailPlatform.SENDLANE && 
                             platform.id !== EmailPlatform.MANUAL && platform.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{platform.name}</div>
                            {platform.lastSynced && (
                              <div className="text-xs text-muted-foreground">
                                Synced {new Date(platform.lastSynced).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                          Connected
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="ghost" size="sm" className="w-full" onClick={() => handleConnectPlatform(platforms.find(p => !p.connected)?.id || EmailPlatform.KLAVIYO)}>
                  <Link2 className="h-4 w-4 mr-2" /> 
                  Connect More
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Email Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Email Campaigns ({filteredEmails.length})</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Email Campaign
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent/Scheduled</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipients</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Open Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Click Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map(campaign => (
                      <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{campaign.subject}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getPlatformBadge(campaign.platform)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {campaign.sentDate 
                            ? formatDate(campaign.sentDate)
                            : campaign.scheduledDate
                              ? formatDate(campaign.scheduledDate)
                              : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {campaign.stats ? formatNumber(campaign.stats.recipients) : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {campaign.stats ? `${campaign.stats.openRate.toFixed(1)}%` : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {campaign.stats ? `${campaign.stats.clickRate.toFixed(1)}%` : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
                          {campaign.stats?.revenue ? formatCurrency(campaign.stats.revenue) : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                        No email campaigns found with the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* SMS Tab */}
        <TabsContent value="sms" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">SMS Campaigns ({filteredSMS.length})</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New SMS Campaign
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent/Scheduled</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipients</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivery Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Click Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredSMS.length > 0 ? (
                    filteredSMS.map(campaign => (
                      <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{campaign.message.substring(0, 50)}...</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getPlatformBadge(campaign.platform)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {campaign.sentDate 
                            ? formatDate(campaign.sentDate)
                            : campaign.scheduledDate
                              ? formatDate(campaign.scheduledDate)
                              : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {campaign.stats ? formatNumber(campaign.stats.recipients) : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {campaign.stats ? `${campaign.stats.deliveryRate.toFixed(1)}%` : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {campaign.stats?.clickRate ? `${campaign.stats.clickRate.toFixed(1)}%` : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
                          {campaign.stats?.revenue ? formatCurrency(campaign.stats.revenue) : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                        No SMS campaigns found with the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Lists Tab */}
        <TabsContent value="lists" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Lists & Segments ({filteredLists.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShowManualImport}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Import List
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create List
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLists.map(list => (
              <Card key={list.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{list.name}</CardTitle>
                    {getPlatformBadge(list.platform)}
                  </div>
                  <CardDescription>
                    {list.description || `${list.type.charAt(0).toUpperCase() + list.type.slice(1)} list`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">{formatNumber(list.subscribers)}</div>
                    <div className="flex items-center">
                      {list.growthRate > 0 ? (
                        <div className="text-green-600 dark:text-green-400 flex items-center text-sm">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          {list.growthRate.toFixed(1)}%
                        </div>
                      ) : list.growthRate < 0 ? (
                        <div className="text-red-600 dark:text-red-400 text-sm">
                          {list.growthRate.toFixed(1)}%
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">0%</div>
                      )}
                      <span className="text-xs text-muted-foreground ml-1">/ mo</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    Created {new Date(list.createdAt).toLocaleDateString()}
                  </div>
                  
                  {list.tags && list.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {list.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex justify-between w-full">
                    <Button variant="ghost" size="sm">View Contacts</Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {filteredLists.length === 0 && (
              <div className="col-span-full py-6 text-center text-muted-foreground">
                No lists found with the current filters.
              </div>
            )}
          </div>
        </TabsContent>

        {/* Automations Tab */}
        <TabsContent value="automations" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Automations ({filteredAutomations.length})</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAutomations.map(automation => (
              <Card key={automation.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{automation.name}</CardTitle>
                    {getStatusBadge(automation.status)}
                  </div>
                  <CardDescription>
                    {automation.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Flow
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm mb-4">
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{automation.steps} steps</span>
                    </div>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <div className="flex items-center">
                      {getPlatformBadge(automation.platform)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Triggers:</span> {automation.triggers.join(', ')}
                    </div>
                    
                    {automation.metrics && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                          <div className="text-lg font-semibold">{automation.metrics.conversions}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Conversion Rate</div>
                          <div className="text-lg font-semibold">{automation.metrics.conversionRate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                          <div className="text-lg font-semibold">{formatCurrency(automation.metrics.revenue)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Recipients</div>
                          <div className="text-lg font-semibold">{formatNumber(automation.metrics.recipients)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex justify-between w-full">
                    <Button variant="ghost" size="sm">Edit Flow</Button>
                    {automation.status === 'active' ? (
                      <Button variant="outline" size="sm">Pause</Button>
                    ) : (
                      <Button variant="default" size="sm">Activate</Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
            
            {filteredAutomations.length === 0 && (
              <div className="col-span-full py-6 text-center text-muted-foreground">
                No automations found with the current filters.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Connect Platform Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Connect {connectingPlatform ? platforms.find(p => p.id === connectingPlatform)?.name : 'Platform'}</DialogTitle>
            <DialogDescription>
              Connect your email marketing platform to integrate your campaigns, lists, and automations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                placeholder="My Klaviyo Account"
                className="w-full"
              />
            </div>
            
            {connectingPlatform !== EmailPlatform.MANUAL && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="api-key">{showApiTokenField ? 'API Key/Token' : 'Authentication'}</Label>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs p-0 h-auto"
                    onClick={() => setShowApiTokenField(!showApiTokenField)}
                  >
                    {showApiTokenField ? 'Use OAuth' : 'Use API Key'}
                  </Button>
                </div>
                
                {showApiTokenField ? (
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="pk_xxxx"
                    className="w-full"
                  />
                ) : (
                  <Button className="w-full">
                    Connect with {connectingPlatform ? platforms.find(p => p.id === connectingPlatform)?.name : 'OAuth'}
                  </Button>
                )}
                
                <div className="text-xs text-muted-foreground flex items-center">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  {showApiTokenField 
                    ? `You can find your API key in your ${connectingPlatform} account settings`
                    : `You will be redirected to ${connectingPlatform} to authorize access`}
                </div>
              </div>
            )}
            
            {connectingPlatform === EmailPlatform.MANUAL && (
              <div className="space-y-2">
                <Label>Excel/Google Sheets Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Import data directly from Excel, Google Sheets, or CSV files.
                </p>
                <Button variant="outline" className="w-full" onClick={handleShowManualImport}>
                  Import Data Instead
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setConnectDialogOpen(false)}>
              Connect Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Data from Spreadsheet</DialogTitle>
            <DialogDescription>
              Import contacts or campaign data from Excel, Google Sheets, or CSV files.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Import Type</Label>
              <Select defaultValue="contacts">
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacts">Contact List</SelectItem>
                  <SelectItem value="campaign-results">Campaign Results</SelectItem>
                  <SelectItem value="metrics">Performance Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Business Entity</Label>
              <Select defaultValue="1">
                <SelectTrigger className="w-full mt-2">
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
            
            <div className="space-y-2">
              <Label>Import Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" className="justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  From Google Sheets
                </Button>
              </div>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900/50">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm font-medium">
                Drag and drop your file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports Excel, CSV, and TXT files
              </p>
              <Button variant="secondary" size="sm" className="mt-4">
                Browse Files
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setImportDialogOpen(false)}>
              Import Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}