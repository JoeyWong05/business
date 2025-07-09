import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  ArrowUpRight,
  BarChart2,
  Brain,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Copy,
  CreditCard,
  Edit,
  Eye,
  ExternalLink,
  FileText,
  Filter,
  ImageIcon,
  Link2,
  LineChart,
  Loader,
  Mail,
  MailCheck,
  MailOpen,
  MailPlus,
  MailQuestion,
  MailWarning,
  MailX,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Share,
  ShoppingBag,
  Shuffle,
  Star,
  Tag,
  Timer,
  Trash,
  Upload,
  Users,
  Wand2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Email Marketing Interfaces and Enums
export enum EmailCampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
  PAUSED = 'paused',
  CANCELLED = 'cancelled'
}

export enum EmailCampaignType {
  NEWSLETTER = 'newsletter',
  PROMOTIONAL = 'promotional',
  TRANSACTIONAL = 'transactional',
  AUTOMATED = 'automated',
  ABANDONED_CART = 'abandoned_cart',
  WINBACK = 'winback',
  WELCOME = 'welcome',
  ONBOARDING = 'onboarding'
}

export enum EmailTemplateType {
  EMAIL = 'email',
  NEWSLETTER = 'newsletter',
  RECEIPT = 'receipt',
  CONFIRMATION = 'confirmation',
  SHIPPING = 'shipping',
  ABANDONED_CART = 'abandoned_cart',
  WELCOME = 'welcome'
}

export enum EmailListType {
  MAIN = 'main',
  MARKETING = 'marketing',
  NEWSLETTER = 'newsletter',
  VIP = 'vip',
  PRODUCT_INTEREST = 'product_interest',
  SEGMENT = 'segment'
}

export enum EmailSegmentType {
  DEMOGRAPHIC = 'demographic',
  BEHAVIORAL = 'behavioral',
  TRANSACTIONAL = 'transactional',
  ENGAGEMENT = 'engagement',
  CUSTOM = 'custom'
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  previewText?: string;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
  status: EmailCampaignStatus;
  type: EmailCampaignType;
  templateId?: string;
  templateName?: string;
  htmlContent?: string;
  plainTextContent?: string;
  listIds: string[];
  segmentIds?: string[];
  scheduledAt?: Date | string;
  sentAt?: Date | string;
  stats?: {
    recipients: number;
    opens: number;
    openRate: number;
    clicks: number;
    clickRate: number;
    conversions: number;
    conversionRate: number;
    revenue?: number;
    unsubscribes: number;
    unsubscribeRate: number;
    bounces: number;
    bounceRate: number;
  };
  tags?: string[];
  abTest?: {
    enabled: boolean;
    variants: {
      id: string;
      name: string;
      subject: string;
      previewText?: string;
      content?: string;
      weight: number;
      statsId?: string;
    }[];
    winningVariantId?: string;
    testType: 'subject' | 'content' | 'from_name' | 'send_time';
    testPercentage: number;
    winningCriteria: 'open_rate' | 'click_rate' | 'conversion_rate' | 'revenue';
    testDuration: number; // hours
  };
  personalization?: {
    enabled: boolean;
    fields: string[];
    defaultValues: Record<string, string>;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  type: EmailTemplateType;
  subject?: string;
  previewText?: string;
  htmlContent: string;
  plainTextContent?: string;
  thumbnailUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
  isDefault?: boolean;
  category?: string;
  tags?: string[];
}

export interface EmailList {
  id: string;
  name: string;
  description?: string;
  type: EmailListType;
  subscriberCount: number;
  doubleOptIn: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
  tags?: string[];
  formId?: string;
  formName?: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileData?: Record<string, any>;
  listIds: string[];
  segmentIds?: string[];
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  source?: string;
  subscriptionDate: Date | string;
  lastEmailSentAt?: Date | string;
  lastEmailOpenedAt?: Date | string;
  lastEmailClickedAt?: Date | string;
  engagementScore?: number;
  lifetimeValue?: number;
  entityId: number;
  entityName: string;
  tags?: string[];
}

export interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  type: EmailSegmentType;
  conditions: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'does_not_contain' | 'greater_than' | 'less_than' | 'exists' | 'does_not_exist' | 'before' | 'after';
    value: any;
  }[];
  conditionMatch: 'all' | 'any';
  estimatedCount: number;
  isDynamic: boolean;
  entityId: number;
  entityName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EmailAutomation {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'draft';
  trigger: {
    type: 'event' | 'time_delay' | 'date_based' | 'list_subscription' | 'abandoned_cart' | 'birthday' | 'custom';
    config: any;
  };
  steps: {
    id: string;
    type: 'email' | 'delay' | 'condition' | 'split' | 'action';
    config: any;
    position: number;
    nextStepIds: string[];
  }[];
  listIds: string[];
  segmentIds?: string[];
  stats?: {
    entered: number;
    completed: number;
    active: number;
    revenue?: number;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
  lastUpdatedStepId?: string;
}

export interface KlaviyoIntegrationConfig {
  apiKey: string;
  privateKey?: string;
  isConnected: boolean;
  status: 'active' | 'needs_attention' | 'disconnected';
  connectedAt?: Date | string;
  lists: {
    id: string;
    name: string;
    subscriberCount: number;
  }[];
  metrics: {
    id: string; 
    name: string;
  }[];
  syncStatus?: {
    lastSyncAt: Date | string;
    nextSyncAt: Date | string;
    status: 'in_progress' | 'completed' | 'failed';
    details?: string;
  };
  entityId: number;
}

export interface EmailMarketingDashboardStats {
  totalSubscribers: number;
  subscriberGrowth: number;
  emailsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  totalRevenue: number;
  topPerformingCampaigns: {
    id: string;
    name: string;
    subject: string;
    openRate: number;
    clickRate: number;
    revenue?: number;
  }[];
  recentActivity: {
    type: 'subscription' | 'unsubscription' | 'campaign_sent' | 'email_opened' | 'link_clicked';
    email: string;
    details: string;
    timestamp: Date | string;
  }[];
}

interface EmailMarketingSystemProps {
  entities: Array<{ id: number, name: string, type: string }>;
  campaigns?: EmailCampaign[];
  templates?: EmailTemplate[];
  lists?: EmailList[];
  subscribers?: EmailSubscriber[];
  segments?: EmailSegment[];
  automations?: EmailAutomation[];
  dashboardStats?: EmailMarketingDashboardStats;
  klaviyoConfig?: KlaviyoIntegrationConfig[];
  onAddCampaign?: (campaign: Omit<EmailCampaign, 'id'>) => void;
  onUpdateCampaign?: (id: string, campaign: Partial<EmailCampaign>) => void;
  onDeleteCampaign?: (id: string) => void;
  onAddTemplate?: (template: Omit<EmailTemplate, 'id'>) => void;
  onUpdateTemplate?: (id: string, template: Partial<EmailTemplate>) => void;
  onDeleteTemplate?: (id: string) => void;
  onAddList?: (list: Omit<EmailList, 'id'>) => void;
  onUpdateList?: (id: string, list: Partial<EmailList>) => void;
  onDeleteList?: (id: string) => void;
  onAddSubscriber?: (subscriber: Omit<EmailSubscriber, 'id'>) => void;
  onUpdateSubscriber?: (id: string, subscriber: Partial<EmailSubscriber>) => void;
  onDeleteSubscriber?: (id: string) => void;
  onAddSegment?: (segment: Omit<EmailSegment, 'id'>) => void;
  onUpdateSegment?: (id: string, segment: Partial<EmailSegment>) => void;
  onDeleteSegment?: (id: string) => void;
  onAddAutomation?: (automation: Omit<EmailAutomation, 'id'>) => void;
  onUpdateAutomation?: (id: string, automation: Partial<EmailAutomation>) => void;
  onDeleteAutomation?: (id: string) => void;
  onConnectKlaviyo?: (entityId: number, apiKey: string) => Promise<KlaviyoIntegrationConfig>;
  onDisconnectKlaviyo?: (entityId: number) => Promise<void>;
  onSyncKlaviyo?: (entityId: number) => Promise<void>;
}

const EmailMarketingSystem: React.FC<EmailMarketingSystemProps> = ({
  entities,
  campaigns = [],
  templates = [],
  lists = [],
  subscribers = [],
  segments = [],
  automations = [],
  dashboardStats,
  klaviyoConfig = [],
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onAddList,
  onUpdateList,
  onDeleteList,
  onAddSubscriber,
  onUpdateSubscriber,
  onDeleteSubscriber,
  onAddSegment,
  onUpdateSegment,
  onDeleteSegment,
  onAddAutomation,
  onUpdateAutomation,
  onDeleteAutomation,
  onConnectKlaviyo,
  onDisconnectKlaviyo,
  onSyncKlaviyo
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [newCampaignData, setNewCampaignData] = useState<Partial<EmailCampaign>>({});
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState<Partial<EmailTemplate>>({});
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListData, setNewListData] = useState<Partial<EmailList>>({});
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [newSegmentData, setNewSegmentData] = useState<Partial<EmailSegment>>({});
  const [isCreatingAutomation, setIsCreatingAutomation] = useState(false);
  const [newAutomationData, setNewAutomationData] = useState<Partial<EmailAutomation>>({});
  const [isConnectingKlaviyo, setIsConnectingKlaviyo] = useState(false);
  const [newKlaviyoApiKey, setNewKlaviyoApiKey] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null);
  const [isLoadingKlaviyo, setIsLoadingKlaviyo] = useState(false);
  const { toast } = useToast();
  
  // Filter campaigns based on selected entity and search term
  const filteredCampaigns = campaigns.filter(campaign => {
    // Filter by entity
    if (selectedEntity !== 'all' && campaign.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.subject.toLowerCase().includes(searchLower) ||
        (campaign.tags && campaign.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    return true;
  });
  
  // Filter templates based on selected entity and search term
  const filteredTemplates = templates.filter(template => {
    // Filter by entity
    if (selectedEntity !== 'all' && template.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        template.name.toLowerCase().includes(searchLower) ||
        (template.description && template.description.toLowerCase().includes(searchLower)) ||
        (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    return true;
  });
  
  // Filter lists based on selected entity and search term
  const filteredLists = lists.filter(list => {
    // Filter by entity
    if (selectedEntity !== 'all' && list.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        list.name.toLowerCase().includes(searchLower) ||
        (list.description && list.description.toLowerCase().includes(searchLower)) ||
        (list.tags && list.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    return true;
  });
  
  // Filter subscribers based on selected entity and search term
  const filteredSubscribers = subscribers.filter(subscriber => {
    // Filter by entity
    if (selectedEntity !== 'all' && subscriber.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        subscriber.email.toLowerCase().includes(searchLower) ||
        (subscriber.firstName && subscriber.firstName.toLowerCase().includes(searchLower)) ||
        (subscriber.lastName && subscriber.lastName.toLowerCase().includes(searchLower)) ||
        (subscriber.tags && subscriber.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    return true;
  });
  
  // Filter segments based on selected entity and search term
  const filteredSegments = segments.filter(segment => {
    // Filter by entity
    if (selectedEntity !== 'all' && segment.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        segment.name.toLowerCase().includes(searchLower) ||
        (segment.description && segment.description.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Filter automations based on selected entity and search term
  const filteredAutomations = automations.filter(automation => {
    // Filter by entity
    if (selectedEntity !== 'all' && automation.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        automation.name.toLowerCase().includes(searchLower) ||
        (automation.description && automation.description.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Get the selected campaign
  const selectedCampaign = selectedCampaignId 
    ? campaigns.find(campaign => campaign.id === selectedCampaignId) 
    : null;
  
  // Get the selected template
  const selectedTemplate = selectedTemplateId 
    ? templates.find(template => template.id === selectedTemplateId) 
    : null;
  
  // Get the selected list
  const selectedList = selectedListId 
    ? lists.find(list => list.id === selectedListId) 
    : null;
  
  // Get the selected segment
  const selectedSegment = selectedSegmentId 
    ? segments.find(segment => segment.id === selectedSegmentId) 
    : null;
  
  // Get the selected automation
  const selectedAutomation = selectedAutomationId 
    ? automations.find(automation => automation.id === selectedAutomationId) 
    : null;
  
  // Get Klaviyo config for the selected entity
  const selectedEntityKlaviyoConfig = selectedEntity !== 'all' 
    ? klaviyoConfig.find(config => config.entityId === selectedEntity) 
    : null;
  
  // Calculate statistics
  const calculateStats = () => {
    const totalCampaigns = campaigns.filter(c => 
      selectedEntity === 'all' || c.entityId === selectedEntity
    ).length;
    
    const sentCampaigns = campaigns.filter(c => 
      (selectedEntity === 'all' || c.entityId === selectedEntity) && 
      c.status === EmailCampaignStatus.SENT
    );
    
    const totalSent = sentCampaigns.reduce((sum, campaign) => 
      sum + (campaign.stats?.recipients || 0), 0);
    
    const avgOpenRate = sentCampaigns.length > 0 
      ? sentCampaigns.reduce((sum, campaign) => 
          sum + (campaign.stats?.openRate || 0), 0) / sentCampaigns.length 
      : 0;
    
    const avgClickRate = sentCampaigns.length > 0 
      ? sentCampaigns.reduce((sum, campaign) => 
          sum + (campaign.stats?.clickRate || 0), 0) / sentCampaigns.length 
      : 0;
    
    const totalSubscribers = lists.filter(list => 
      selectedEntity === 'all' || list.entityId === selectedEntity
    ).reduce((sum, list) => sum + list.subscriberCount, 0);
    
    const activeAutomations = automations.filter(a => 
      (selectedEntity === 'all' || a.entityId === selectedEntity) && 
      a.status === 'active'
    ).length;
    
    return {
      totalCampaigns,
      totalSent,
      avgOpenRate,
      avgClickRate,
      totalSubscribers,
      activeAutomations
    };
  };
  
  const stats = calculateStats();
  
  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Get color for campaign status badge
  const getCampaignStatusColor = (status: EmailCampaignStatus) => {
    switch (status) {
      case EmailCampaignStatus.DRAFT:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
      case EmailCampaignStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case EmailCampaignStatus.SENDING:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case EmailCampaignStatus.SENT:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case EmailCampaignStatus.PAUSED:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case EmailCampaignStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };
  
  // Get icon for campaign type
  const getCampaignTypeIcon = (type: EmailCampaignType) => {
    switch (type) {
      case EmailCampaignType.NEWSLETTER:
        return <FileText className="h-4 w-4" />;
      case EmailCampaignType.PROMOTIONAL:
        return <Tag className="h-4 w-4" />;
      case EmailCampaignType.TRANSACTIONAL:
        return <ShoppingBag className="h-4 w-4" />;
      case EmailCampaignType.AUTOMATED:
        return <Timer className="h-4 w-4" />;
      case EmailCampaignType.ABANDONED_CART:
        return <ShoppingBag className="h-4 w-4" />;
      case EmailCampaignType.WINBACK:
        return <Users className="h-4 w-4" />;
      case EmailCampaignType.WELCOME:
        return <Mail className="h-4 w-4" />;
      case EmailCampaignType.ONBOARDING:
        return <Users className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  // Handle connect Klaviyo
  const handleConnectKlaviyo = async () => {
    if (selectedEntity === 'all' || !newKlaviyoApiKey) {
      toast({
        title: "Missing information",
        description: "Please select an entity and enter your Klaviyo API key.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingKlaviyo(true);
    
    try {
      if (onConnectKlaviyo) {
        const result = await onConnectKlaviyo(selectedEntity as number, newKlaviyoApiKey);
        
        toast({
          title: "Klaviyo connected",
          description: "Your Klaviyo account has been connected successfully.",
        });
        
        setIsConnectingKlaviyo(false);
        setNewKlaviyoApiKey('');
      } else {
        // Simulate for demo
        setTimeout(() => {
          toast({
            title: "Klaviyo connected",
            description: "Your Klaviyo account has been connected successfully.",
          });
          
          setIsConnectingKlaviyo(false);
          setNewKlaviyoApiKey('');
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Klaviyo. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingKlaviyo(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Marketing</h2>
          <p className="text-muted-foreground">
            Create, manage, and automate email campaigns with Klaviyo integration
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
          
          <Button onClick={() => setIsCreatingCampaign(true)}>
            <MailPlus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>
      
      {/* Klaviyo Integration Alert if not connected */}
      {selectedEntity !== 'all' && !selectedEntityKlaviyoConfig && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Klaviyo integration not configured
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                <p>
                  Connect your Klaviyo account to unlock advanced email marketing features like 
                  automated flows, advanced segmentation, and detailed analytics.
                </p>
              </div>
              <div className="mt-4">
                <Button size="sm" onClick={() => setIsConnectingKlaviyo(true)}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect Klaviyo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Klaviyo Integration Card if connected */}
      {selectedEntity !== 'all' && selectedEntityKlaviyoConfig && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <svg className="h-4 w-4 text-blue-700 dark:text-blue-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.9994 0H3C1.35 0 0 1.35 0 3V21C0 22.65 1.35 24 3 24H21C22.65 24 24 22.65 24 21V3C23.9994 1.35 22.6494 0 20.9994 0Z" fill="currentColor"/>
                      <path d="M11.7945 5.62744L4.05234 17.1225H9.3476L17.0986 5.62744H11.7945Z" fill="white"/>
                      <path d="M13.3264 17.1207H19.9478L15.7102 10.6323L13.3264 17.1207Z" fill="white"/>
                    </svg>
                  </div>
                  Klaviyo Integration
                </CardTitle>
                <CardDescription>
                  Connected and syncing data with your Klaviyo account
                </CardDescription>
              </div>
              <Badge 
                variant="outline" 
                className={
                  selectedEntityKlaviyoConfig.status === 'active' ? 
                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                  selectedEntityKlaviyoConfig.status === 'needs_attention' ? 
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }
              >
                {selectedEntityKlaviyoConfig.status.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Connected Lists</div>
                  <div className="font-medium">{selectedEntityKlaviyoConfig.lists.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tracked Metrics</div>
                  <div className="font-medium">{selectedEntityKlaviyoConfig.metrics.length}</div>
                </div>
              </div>
              
              {selectedEntityKlaviyoConfig.syncStatus && (
                <div>
                  <div className="text-sm text-muted-foreground">Last Sync</div>
                  <div className="flex justify-between">
                    <div className="font-medium">
                      {formatDate(selectedEntityKlaviyoConfig.syncStatus.lastSyncAt)}
                    </div>
                    <div className="text-sm">
                      Next: {formatDate(selectedEntityKlaviyoConfig.syncStatus.nextSyncAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (onSyncKlaviyo) {
                    onSyncKlaviyo(selectedEntity as number);
                  }
                  
                  toast({
                    title: "Sync started",
                    description: "Syncing data with Klaviyo...",
                  });
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
                    // Open Klaviyo dashboard
                    window.open('https://www.klaviyo.com/dashboard', '_blank');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Dashboard
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Settings or disconnect
                    if (onDisconnectKlaviyo) {
                      onDisconnectKlaviyo(selectedEntity as number);
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
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="lists">Lists</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Sent</div>
                    <div>{campaigns.filter(c => c.status === EmailCampaignStatus.SENT).length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Scheduled</div>
                    <div>{campaigns.filter(c => c.status === EmailCampaignStatus.SCHEDULED).length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(stats.totalSubscribers)}</div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">Lists</div>
                    <div>{filteredLists.length}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <div className="text-muted-foreground">Segments</div>
                    <div>{filteredSegments.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Open Rate</div>
                    <div className="text-xl font-bold">{formatPercentage(stats.avgOpenRate)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Click Rate</div>
                    <div className="text-xl font-bold">{formatPercentage(stats.avgClickRate)}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground mb-1">Total Emails Sent</div>
                  <div className="text-sm">{formatNumber(stats.totalSent)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>
                    Your latest email marketing campaigns and their performance
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('campaigns')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Mail className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No campaigns found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns
                      .sort((a, b) => {
                        const dateA = new Date(a.updatedAt).getTime();
                        const dateB = new Date(b.updatedAt).getTime();
                        return dateB - dateA; // Sort by most recent first
                      })
                      .slice(0, 5) // Show only 5 most recent
                      .map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Subject: {campaign.subject}
                            </div>
                          </TableCell>
                          <TableCell>
                            {campaign.stats?.recipients 
                              ? formatNumber(campaign.stats.recipients)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {campaign.stats?.openRate 
                              ? formatPercentage(campaign.stats.openRate)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {campaign.stats?.clickRate 
                              ? formatPercentage(campaign.stats.clickRate)
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getCampaignStatusColor(campaign.status)}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Activity & Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subscriber Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Growth</CardTitle>
                <CardDescription>
                  Subscriber count growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Subscriber growth chart would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest email marketing activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardStats?.recentActivity && dashboardStats.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardStats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          {activity.type === 'subscription' && <MailCheck className="h-4 w-4" />}
                          {activity.type === 'unsubscription' && <MailX className="h-4 w-4" />}
                          {activity.type === 'campaign_sent' && <MailPlus className="h-4 w-4" />}
                          {activity.type === 'email_opened' && <MailOpen className="h-4 w-4" />}
                          {activity.type === 'link_clicked' && <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {activity.email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{activity.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
                  {Object.values(EmailCampaignStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(EmailCampaignType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setIsCreatingCampaign(true)}>
              <MailPlus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Mail className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No campaigns found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <TableRow 
                        key={campaign.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedCampaignId(campaign.id)}
                      >
                        <TableCell>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Subject: {campaign.subject}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getCampaignTypeIcon(campaign.type)}
                            <span>
                              {campaign.type.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {campaign.listIds.length === 1 ? '1 list' : `${campaign.listIds.length} lists`}
                          </div>
                          {campaign.segmentIds && campaign.segmentIds.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {campaign.segmentIds.length === 1 ? '1 segment' : `${campaign.segmentIds.length} segments`}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {campaign.status === EmailCampaignStatus.SCHEDULED && campaign.scheduledAt ? (
                            <div className="text-sm">
                              <div>Scheduled for:</div>
                              <div>{formatDate(campaign.scheduledAt)}</div>
                            </div>
                          ) : campaign.status === EmailCampaignStatus.SENT && campaign.sentAt ? (
                            <div className="text-sm">
                              <div>Sent on:</div>
                              <div>{formatDate(campaign.sentAt)}</div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              {campaign.status === EmailCampaignStatus.DRAFT ? 'Not scheduled' : '-'}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {campaign.stats ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>Open Rate:</span>
                                <span className="font-medium">{formatPercentage(campaign.stats.openRate)}</span>
                              </div>
                              <Progress value={campaign.stats.openRate * 100} className="h-1" />
                              <div className="flex items-center justify-between text-xs">
                                <span>Click Rate:</span>
                                <span className="font-medium">{formatPercentage(campaign.stats.clickRate)}</span>
                              </div>
                              <Progress value={campaign.stats.clickRate * 100} className="h-1" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No data</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCampaignStatusColor(campaign.status)}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </Badge>
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
                                setSelectedCampaignId(campaign.id);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {campaign.status === EmailCampaignStatus.DRAFT && (
                                <>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <MailPlus className="mr-2 h-4 w-4" />
                                    Schedule
                                  </DropdownMenuItem>
                                </>
                              )}
                              {campaign.status === EmailCampaignStatus.SCHEDULED && (
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  // Cancel scheduled campaign
                                  if (onUpdateCampaign) {
                                    onUpdateCampaign(campaign.id, { 
                                      status: EmailCampaignStatus.CANCELLED 
                                    });
                                  }
                                }}>
                                  <MailX className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              {campaign.status === EmailCampaignStatus.SENT && (
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <BarChart2 className="mr-2 h-4 w-4" />
                                  Analytics
                                </DropdownMenuItem>
                              )}
                              {campaign.status !== EmailCampaignStatus.SENT && (
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Template Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(EmailTemplateType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
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
                    Create email templates to streamline your campaign creation process
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
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                    {template.thumbnailUrl ? (
                      <img 
                        src={template.thumbnailUrl} 
                        alt={template.name} 
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>
                          {template.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </CardDescription>
                      </div>
                      {template.isDefault && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Default
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {template.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(template.updatedAt)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplateId(template.id);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <MailPlus className="mr-2 h-4 w-4" />
                          Create Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
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
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="List Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(EmailListType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
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
                    <TableHead>Double Opt-In</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLists.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
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
                        onClick={() => setSelectedListId(list.id)}
                      >
                        <TableCell>
                          <div className="font-medium">{list.name}</div>
                          {list.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {list.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {list.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </TableCell>
                        <TableCell>{formatNumber(list.subscriberCount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {list.doubleOptIn ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span className="ml-2">
                              {list.doubleOptIn ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{list.entityName}</TableCell>
                        <TableCell>{formatDate(list.createdAt)}</TableCell>
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
                                setSelectedListId(list.id);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Subscribers
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <MailPlus className="mr-2 h-4 w-4" />
                                Create Campaign
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
        
        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="subscribed">Subscribed</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="complained">Complained</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="List" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lists</SelectItem>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Subscriber
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lists</TableHead>
                    <TableHead>Subscribed Date</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Users className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No subscribers found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell>
                          <div className="font-medium">{subscriber.email}</div>
                        </TableCell>
                        <TableCell>
                          {subscriber.firstName && subscriber.lastName ? (
                            `${subscriber.firstName} ${subscriber.lastName}`
                          ) : subscriber.firstName ? (
                            subscriber.firstName
                          ) : subscriber.lastName ? (
                            subscriber.lastName
                          ) : (
                            <span className="text-muted-foreground">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            subscriber.status === 'subscribed' ? 
                            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                            subscriber.status === 'unsubscribed' ? 
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                            subscriber.status === 'bounced' ? 
                            "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }>
                            {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {subscriber.listIds.map((listId, index) => {
                              const list = lists.find(l => l.id === listId);
                              return list ? (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {list.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(subscriber.subscriptionDate)}</TableCell>
                        <TableCell>
                          {subscriber.engagementScore !== undefined ? (
                            <div className="flex items-center gap-2">
                              <Progress value={subscriber.engagementScore * 100} className="h-2 w-16" />
                              <span className="text-sm">{formatPercentage(subscriber.engagementScore)}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
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
        
        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search segments..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Segment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.values(EmailSegmentType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setIsCreatingSegment(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Conditions</TableHead>
                    <TableHead>Est. Size</TableHead>
                    <TableHead>Dynamic</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSegments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Shuffle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No segments found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSegments.map((segment) => (
                      <TableRow 
                        key={segment.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedSegmentId(segment.id)}
                      >
                        <TableCell>
                          <div className="font-medium">{segment.name}</div>
                          {segment.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {segment.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {segment.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{segment.conditions.length}</span>
                            <span className="text-xs text-muted-foreground">
                              ({segment.conditionMatch})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatNumber(segment.estimatedCount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {segment.isDynamic ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <span className="ml-2">
                              {segment.isDynamic ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(segment.createdAt)}</TableCell>
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
                                setSelectedSegmentId(segment.id);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Subscribers
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <MailPlus className="mr-2 h-4 w-4" />
                                Create Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Shuffle className="mr-2 h-4 w-4" />
                                Refresh Count
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onDeleteSegment) {
                                    onDeleteSegment(segment.id);
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
        
        {/* Automations Tab */}
        <TabsContent value="automations" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search automations..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setIsCreatingAutomation(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Automation
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Automation</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Lists</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAutomations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Timer className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No automations found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAutomations.map((automation) => (
                      <TableRow 
                        key={automation.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedAutomationId(automation.id)}
                      >
                        <TableCell>
                          <div className="font-medium">{automation.name}</div>
                          {automation.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {automation.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {automation.trigger.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {automation.listIds.map((listId, index) => {
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
                          {automation.stats ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>Entered:</span>
                                <span className="font-medium">{formatNumber(automation.stats.entered)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span>Active:</span>
                                <span className="font-medium">{formatNumber(automation.stats.active)}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span>Completed:</span>
                                <span className="font-medium">{formatNumber(automation.stats.completed)}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No data</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            automation.status === 'active' ? 
                            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                            automation.status === 'paused' ? 
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                            "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                          }>
                            {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(automation.updatedAt)}</TableCell>
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
                                setSelectedAutomationId(automation.id);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {automation.status === 'active' ? (
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  if (onUpdateAutomation) {
                                    onUpdateAutomation(automation.id, { status: 'paused' });
                                  }
                                }}>
                                  <MailWarning className="mr-2 h-4 w-4" />
                                  Pause
                                </DropdownMenuItem>
                              ) : automation.status === 'paused' || automation.status === 'draft' ? (
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  if (onUpdateAutomation) {
                                    onUpdateAutomation(automation.id, { status: 'active' });
                                  }
                                }}>
                                  <MailCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onDeleteAutomation) {
                                    onDeleteAutomation(automation.id);
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
      </Tabs>
      
      {/* Connect Klaviyo Dialog */}
      <Dialog open={isConnectingKlaviyo} onOpenChange={setIsConnectingKlaviyo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-4 w-4 text-blue-700 dark:text-blue-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.9994 0H3C1.35 0 0 1.35 0 3V21C0 22.65 1.35 24 3 24H21C22.65 24 24 22.65 24 21V3C23.9994 1.35 22.6494 0 20.9994 0Z" fill="currentColor"/>
                  <path d="M11.7945 5.62744L4.05234 17.1225H9.3476L17.0986 5.62744H11.7945Z" fill="white"/>
                  <path d="M13.3264 17.1207H19.9478L15.7102 10.6323L13.3264 17.1207Z" fill="white"/>
                </svg>
              </div>
              Connect to Klaviyo
            </DialogTitle>
            <DialogDescription>
              Connect your Klaviyo account to enable advanced email marketing capabilities
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
              <Label htmlFor="klaviyo-api-key">Klaviyo API Key</Label>
              <Input 
                id="klaviyo-api-key" 
                type="password"
                placeholder="pk_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={newKlaviyoApiKey}
                onChange={(e) => setNewKlaviyoApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can find your API key in the Klaviyo dashboard under Account {">"} Settings {">"} API Keys
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    What will be synchronized?
                  </h4>
                  <ul className="mt-1 text-sm text-blue-700 dark:text-blue-400 list-disc pl-5 space-y-1">
                    <li>Lists and segments</li>
                    <li>Subscriber data and profiles</li>
                    <li>Campaign metrics and analytics</li>
                    <li>Automations and flows</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConnectingKlaviyo(false)}
              disabled={isLoadingKlaviyo}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConnectKlaviyo}
              disabled={isLoadingKlaviyo || !newKlaviyoApiKey || selectedEntity === 'all'}
            >
              {isLoadingKlaviyo ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Campaign Detail Dialog */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaignId} onOpenChange={(open) => !open && setSelectedCampaignId(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">{selectedCampaign.name}</DialogTitle>
                  <DialogDescription>
                    Created on {formatDate(selectedCampaign.createdAt)}
                  </DialogDescription>
                </div>
                <Badge variant="outline" className={getCampaignStatusColor(selectedCampaign.status)}>
                  {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Email Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Subject</div>
                        <div className="text-base">{selectedCampaign.subject}</div>
                      </div>
                      
                      {selectedCampaign.previewText && (
                        <div>
                          <div className="text-sm font-medium">Preview Text</div>
                          <div className="text-base">{selectedCampaign.previewText}</div>
                        </div>
                      )}
                      
                      <div>
                        <div className="text-sm font-medium">From</div>
                        <div className="text-base">
                          {selectedCampaign.fromName} &lt;{selectedCampaign.fromEmail}&gt;
                        </div>
                      </div>
                      
                      {selectedCampaign.replyToEmail && (
                        <div>
                          <div className="text-sm font-medium">Reply To</div>
                          <div className="text-base">{selectedCampaign.replyToEmail}</div>
                        </div>
                      )}
                      
                      {selectedCampaign.templateName && (
                        <div>
                          <div className="text-sm font-medium">Template</div>
                          <div className="text-base">{selectedCampaign.templateName}</div>
                        </div>
                      )}
                      
                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-muted px-4 py-2 font-medium text-sm border-b">
                          Email Preview
                        </div>
                        <div className="aspect-[4/3] bg-white flex items-center justify-center">
                          {selectedCampaign.htmlContent ? (
                            <div className="w-full h-full overflow-hidden">
                              <iframe 
                                title="Email Preview"
                                src={`data:text/html;charset=utf-8,${encodeURIComponent(selectedCampaign.htmlContent)}`}
                                className="w-full h-full border-0"
                              />
                            </div>
                          ) : (
                            <div className="text-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">Preview not available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {selectedCampaign.abTest?.enabled && (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">A/B Test</CardTitle>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Test Type</div>
                            <div className="font-medium">
                              {selectedCampaign.abTest.testType.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Test Duration</div>
                            <div className="font-medium">{selectedCampaign.abTest.testDuration} hours</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Winning Criteria</div>
                            <div className="font-medium">
                              {selectedCampaign.abTest.winningCriteria.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Test Percentage</div>
                            <div className="font-medium">{selectedCampaign.abTest.testPercentage}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Variants</div>
                          <div className="space-y-2">
                            {selectedCampaign.abTest.variants.map((variant) => (
                              <div key={variant.id} className="border rounded-md p-3">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium">{variant.name}</div>
                                  <Badge variant="outline" className="text-xs">
                                    {variant.weight}% traffic
                                  </Badge>
                                </div>
                                <div className="mt-2 text-sm">
                                  <div><span className="text-muted-foreground">Subject:</span> {variant.subject}</div>
                                  {variant.previewText && (
                                    <div><span className="text-muted-foreground">Preview:</span> {variant.previewText}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {selectedCampaign.personalization?.enabled && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Personalization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Personalized Fields</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedCampaign.personalization.fields.map((field, index) => (
                            <Badge key={index} variant="secondary">
                              {field}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-sm text-muted-foreground">Default Values</div>
                          <div className="mt-1 border rounded-md divide-y">
                            {Object.entries(selectedCampaign.personalization.defaultValues).map(([key, value], index) => (
                              <div key={index} className="flex p-2">
                                <div className="font-medium w-1/3">{key}</div>
                                <div className="w-2/3">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Campaign Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Campaign Type</div>
                      <div className="font-medium flex items-center gap-1.5">
                        {getCampaignTypeIcon(selectedCampaign.type)}
                        <span>
                          {selectedCampaign.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Audience</div>
                      <div className="space-y-1 mt-1">
                        <div className="flex justify-between">
                          <span>Lists:</span>
                          <span className="font-medium">
                            {selectedCampaign.listIds.length}
                          </span>
                        </div>
                        {selectedCampaign.segmentIds && (
                          <div className="flex justify-between">
                            <span>Segments:</span>
                            <span className="font-medium">
                              {selectedCampaign.segmentIds.length}
                            </span>
                          </div>
                        )}
                        {selectedCampaign.stats && (
                          <div className="flex justify-between">
                            <span>Total Recipients:</span>
                            <span className="font-medium">
                              {formatNumber(selectedCampaign.stats.recipients)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedCampaign.status === EmailCampaignStatus.SCHEDULED && selectedCampaign.scheduledAt && (
                      <div>
                        <div className="text-sm text-muted-foreground">Scheduled For</div>
                        <div className="font-medium">{formatDate(selectedCampaign.scheduledAt)}</div>
                      </div>
                    )}
                    
                    {selectedCampaign.status === EmailCampaignStatus.SENT && selectedCampaign.sentAt && (
                      <div>
                        <div className="text-sm text-muted-foreground">Sent On</div>
                        <div className="font-medium">{formatDate(selectedCampaign.sentAt)}</div>
                      </div>
                    )}
                    
                    {selectedCampaign.tags && selectedCampaign.tags.length > 0 && (
                      <div>
                        <div className="text-sm text-muted-foreground">Tags</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCampaign.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {selectedCampaign.stats && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Opens:</span>
                          <span>{formatNumber(selectedCampaign.stats.opens)} ({formatPercentage(selectedCampaign.stats.openRate)})</span>
                        </div>
                        <Progress value={selectedCampaign.stats.openRate * 100} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Clicks:</span>
                          <span>{formatNumber(selectedCampaign.stats.clicks)} ({formatPercentage(selectedCampaign.stats.clickRate)})</span>
                        </div>
                        <Progress value={selectedCampaign.stats.clickRate * 100} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Unsubscribes</div>
                          <div className="font-medium">{formatPercentage(selectedCampaign.stats.unsubscribeRate)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Bounces</div>
                          <div className="font-medium">{formatPercentage(selectedCampaign.stats.bounceRate)}</div>
                        </div>
                      </div>
                      
                      {selectedCampaign.stats.conversions > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Conversions</div>
                            <div className="font-medium">{formatNumber(selectedCampaign.stats.conversions)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Revenue</div>
                            <div className="font-medium">${selectedCampaign.stats.revenue?.toLocaleString()}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              {selectedCampaign.status === EmailCampaignStatus.DRAFT && (
                <>
                  <Button variant="outline">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button>
                    <MailPlus className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </>
              )}
              
              {selectedCampaign.status === EmailCampaignStatus.SCHEDULED && (
                <Button variant="destructive">
                  <MailX className="mr-2 h-4 w-4" />
                  Cancel Send
                </Button>
              )}
              
              {selectedCampaign.status === EmailCampaignStatus.SENT && (
                <>
                  <Button variant="outline">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Template Detail, List Detail, Segment Detail, and Automation Detail dialogs */}
      {/* would be implemented similarly to the Campaign Detail Dialog */}
      
      {/* Create Campaign, Create Template, Create List, Create Segment, and Create Automation dialogs */}
      {/* would be implemented with forms for each type of content */}
    </div>
  );
};

export default EmailMarketingSystem;