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
  Clock,
  Copy,
  Edit,
  Eye,
  ExternalLink,
  FileBarChart,
  Filter,
  Globe,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Instagram,
  Link2,
  LineChart,
  Loader,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings,
  Share,
  Shuffle,
  SlidersHorizontal,
  ThumbsUp,
  Timer,
  Trash,
  TrendingUp,
  Upload,
  Users,
  Wand2,
  XCircle,
  Youtube
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SiFacebook, SiLinkedin, SiPinterest, SiTiktok } from 'react-icons/si';
import { BsTwitter } from 'react-icons/bs';

// Types and interfaces for social media management
export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  PINTEREST = 'pinterest',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube'
}

export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  TEXT = 'text',
  LINK = 'link',
  STORY = 'story',
  REEL = 'reel',
  LIVE = 'live'
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  PENDING_RESPONSE = 'pending_response',
  NEEDS_ATTENTION = 'needs_attention'
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  handle: string;
  profileUrl: string;
  profileImageUrl?: string;
  connected: boolean;
  lastSynced?: Date | string;
  followers?: number;
  engagement?: number;
  entityId: number;
  entityName: string;
}

export interface SocialPost {
  id: string;
  accountId: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  contentType: ContentType;
  status: PostStatus;
  scheduledFor?: Date | string;
  publishedAt?: Date | string;
  stats?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    clicks?: number;
  };
  tags?: string[];
  url?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
}

interface EnhancedSocialAccount extends SocialAccount {
  automationEnabled: boolean;
  postingSchedule?: {
    frequency: 'daily' | 'weekly' | 'custom';
    daysOfWeek?: number[]; // 0 = Sunday, 6 = Saturday
    timesOfDay?: string[];
    timezone?: string;
  };
  contentStrategy?: {
    contentMix: {
      promotional: number;
      educational: number;
      engagement: number;
      entertainment: number;
    };
    targetAudience: string[];
    topPerformingHashtags: string[];
    brandVoice: string;
  };
  aiAssistEnabled?: boolean;
  targetKPIs?: {
    engagementRate: number;
    followerGrowth: number;
    clickThroughRate: number;
    conversionRate: number;
  };
  integrations?: {
    analytics: boolean;
    ecommerce: boolean;
    crm: boolean;
  };
}

interface EnhancedSocialPost extends SocialPost {
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: Date | string;
  performance?: {
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    roi: number;
  };
  aiGenerated?: boolean;
  aiPrompt?: string;
  targetAudience?: string[];
  categories?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  attachments?: Array<{
    type: 'image' | 'video' | 'link' | 'document';
    url: string;
    thumbnailUrl?: string;
    title?: string;
  }>;
}

interface AutomationRule {
  id: string;
  name: string;
  accountIds: string[];
  trigger: {
    type: 'schedule' | 'event' | 'condition';
    config: any;
  };
  actions: Array<{
    type: string;
    config: any;
  }>;
  enabled: boolean;
  lastRun?: Date | string;
  nextRun?: Date | string;
  createdAt: Date | string;
  entityId: number;
}

interface ContentCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  entityId: number;
}

interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  platform: SocialPlatform;
  contentType: ContentType;
  content: string;
  mediaUrls?: string[];
  categories: string[];
  tags: string[];
  entityId: number;
}

interface SocialCampaign {
  id: string;
  name: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  platforms: SocialPlatform[];
  budget?: number;
  kpis: {
    [key: string]: number;
  };
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'canceled';
  posts: string[]; // Post IDs
  entityId: number;
  entityName: string;
  progress: number;
  results?: {
    [key: string]: number;
  };
}

interface HashtagGroup {
  id: string;
  name: string;
  hashtags: string[];
  platforms: SocialPlatform[];
  entityId: number;
}

interface SocialMediaAnalytics {
  accounts: Array<{
    id: string;
    platform: SocialPlatform;
    name: string;
    metrics: {
      followers: number;
      followersGrowth: number;
      engagement: number;
      impressions: number;
      reach: number;
      clicks: number;
    };
    trends: {
      followers: number[];
      engagement: number[];
      impressions: number[];
    };
  }>;
  topPosts: EnhancedSocialPost[];
  audienceInsights: {
    demographics: {
      age: Record<string, number>;
      gender: Record<string, number>;
      location: Record<string, number>;
    };
    interests: Record<string, number>;
    activeHours: Record<string, number>;
  };
  overallPerformance: {
    totalFollowers: number;
    totalEngagement: number;
    totalImpressions: number;
    totalReach: number;
    totalClicks: number;
    averageEngagementRate: number;
  };
}

interface EnhancedSocialMediaManagerProps {
  entities: Array<{ id: number, name: string, type: string }>;
  accounts?: EnhancedSocialAccount[];
  posts?: EnhancedSocialPost[];
  automationRules?: AutomationRule[];
  categories?: ContentCategory[];
  templates?: ContentTemplate[];
  campaigns?: SocialCampaign[];
  hashtagGroups?: HashtagGroup[];
  analytics?: SocialMediaAnalytics;
  onConnectAccount?: (platform: SocialPlatform, entityId: number) => Promise<EnhancedSocialAccount>;
  onDisconnectAccount?: (accountId: string) => Promise<void>;
  onCreatePost?: (post: Omit<EnhancedSocialPost, 'id'>) => Promise<EnhancedSocialPost>;
  onUpdatePost?: (id: string, post: Partial<EnhancedSocialPost>) => Promise<EnhancedSocialPost>;
  onDeletePost?: (id: string) => Promise<void>;
  onPublishPost?: (id: string) => Promise<EnhancedSocialPost>;
  onSchedulePost?: (id: string, date: Date) => Promise<EnhancedSocialPost>;
  onCreateAutomationRule?: (rule: Omit<AutomationRule, 'id'>) => Promise<AutomationRule>;
  onUpdateAutomationRule?: (id: string, rule: Partial<AutomationRule>) => Promise<AutomationRule>;
  onEnableAutomation?: (accountId: string, enabled: boolean) => Promise<EnhancedSocialAccount>;
  onCreateContentTemplate?: (template: Omit<ContentTemplate, 'id'>) => Promise<ContentTemplate>;
  onCreateHashtagGroup?: (group: Omit<HashtagGroup, 'id'>) => Promise<HashtagGroup>;
  onCreateCampaign?: (campaign: Omit<SocialCampaign, 'id'>) => Promise<SocialCampaign>;
  onGenerateAIContent?: (prompt: string, platform: SocialPlatform, contentType: ContentType) => Promise<string>;
}

const EnhancedSocialMediaManager: React.FC<EnhancedSocialMediaManagerProps> = ({
  entities,
  accounts = [],
  posts = [],
  automationRules = [],
  categories = [],
  templates = [],
  campaigns = [],
  hashtagGroups = [],
  analytics,
  onConnectAccount,
  onDisconnectAccount,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
  onPublishPost,
  onSchedulePost,
  onCreateAutomationRule,
  onUpdateAutomationRule,
  onEnableAutomation,
  onCreateContentTemplate,
  onCreateHashtagGroup,
  onCreateCampaign,
  onGenerateAIContent
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('content-calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isConnectingAccount, setIsConnectingAccount] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isCreatingAutomation, setIsCreatingAutomation] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiContent, setAiContent] = useState('');
  const [aiSelectedPlatform, setAiSelectedPlatform] = useState<SocialPlatform>(SocialPlatform.FACEBOOK);
  const [aiSelectedContentType, setAiSelectedContentType] = useState<ContentType>(ContentType.TEXT);
  const [newPostData, setNewPostData] = useState<Partial<EnhancedSocialPost>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Filter accounts based on selected entity
  const filteredAccounts = accounts.filter(account => 
    selectedEntity === 'all' || account.entityId === selectedEntity
  );
  
  // Filter posts based on selected entity and filters
  const filteredPosts = posts.filter(post => {
    // Filter by entity
    if (selectedEntity !== 'all' && post.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by platform
    if (filterPlatform !== 'all' && post.platform !== filterPlatform) {
      return false;
    }
    
    // Filter by status
    if (filterStatus !== 'all' && post.status !== filterStatus) {
      return false;
    }
    
    // Filter by search term (in content or tags)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const contentMatch = post.content.toLowerCase().includes(searchLower);
      const tagsMatch = post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;
      return contentMatch || tagsMatch;
    }
    
    return true;
  });
  
  // Filter automation rules
  const filteredAutomationRules = automationRules.filter(rule => 
    selectedEntity === 'all' || rule.entityId === selectedEntity
  );
  
  // Filter content templates
  const filteredTemplates = templates.filter(template => 
    selectedEntity === 'all' || template.entityId === selectedEntity
  );
  
  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => 
    selectedEntity === 'all' || campaign.entityId === selectedEntity
  );
  
  // Get the selected post details
  const selectedPostDetails = selectedPost 
    ? posts.find(post => post.id === selectedPost) 
    : null;
  
  // Get the selected template details
  const selectedTemplateDetails = selectedTemplate
    ? templates.find(template => template.id === selectedTemplate)
    : null;
  
  // Get the selected account details
  const selectedAccountDetails = selectedAccount
    ? accounts.find(account => account.id === selectedAccount)
    : null;
  
  // Get the selected campaign details
  const selectedCampaignDetails = selectedCampaign
    ? campaigns.find(campaign => campaign.id === selectedCampaign)
    : null;
  
  // Group posts by date for calendar view
  const postsByDate = filteredPosts.reduce((acc, post) => {
    const dateKey = post.scheduledFor 
      ? new Date(post.scheduledFor).toDateString() 
      : post.publishedAt 
        ? new Date(post.publishedAt).toDateString()
        : 'Unscheduled';
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(post);
    return acc;
  }, {} as Record<string, EnhancedSocialPost[]>);
  
  // Group posts by platform for analytics
  const postsByPlatform = filteredPosts.reduce((acc, post) => {
    if (!acc[post.platform]) {
      acc[post.platform] = [];
    }
    
    acc[post.platform].push(post);
    return acc;
  }, {} as Record<SocialPlatform, EnhancedSocialPost[]>);
  
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
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  // Get platform icon
  const getPlatformIcon = (platform: SocialPlatform, className = 'h-5 w-5') => {
    switch (platform) {
      case SocialPlatform.FACEBOOK:
        return <SiFacebook className={className} style={{ color: '#1877F2' }} />;
      case SocialPlatform.INSTAGRAM:
        return <Instagram className={className} style={{ color: '#E1306C' }} />;
      case SocialPlatform.TWITTER:
        return <BsTwitter className={className} style={{ color: '#1DA1F2' }} />;
      case SocialPlatform.LINKEDIN:
        return <SiLinkedin className={className} style={{ color: '#0A66C2' }} />;
      case SocialPlatform.PINTEREST:
        return <SiPinterest className={className} style={{ color: '#E60023' }} />;
      case SocialPlatform.TIKTOK:
        return <SiTiktok className={className} style={{ color: '#000000' }} />;
      case SocialPlatform.YOUTUBE:
        return <Youtube className={className} style={{ color: '#FF0000' }} />;
      default:
        return <Globe className={className} />;
    }
  };
  
  // Get platform color
  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.FACEBOOK:
        return '#1877F2';
      case SocialPlatform.INSTAGRAM:
        return '#E1306C';
      case SocialPlatform.TWITTER:
        return '#1DA1F2';
      case SocialPlatform.LINKEDIN:
        return '#0A66C2';
      case SocialPlatform.PINTEREST:
        return '#E60023';
      case SocialPlatform.TIKTOK:
        return '#000000';
      case SocialPlatform.YOUTUBE:
        return '#FF0000';
      default:
        return '#6E6E6E';
    }
  };
  
  // Get content type icon
  const getContentTypeIcon = (contentType: ContentType, className = 'h-4 w-4') => {
    switch (contentType) {
      case ContentType.IMAGE:
        return <ImageIcon className={className} />;
      case ContentType.VIDEO:
        return <Play className={className} />;
      case ContentType.CAROUSEL:
        return <Shuffle className={className} />;
      case ContentType.TEXT:
        return <MessageSquare className={className} />;
      case ContentType.LINK:
        return <Link2 className={className} />;
      case ContentType.STORY:
        return <Clock className={className} />;
      case ContentType.REEL:
        return <Youtube className={className} />;
      case ContentType.LIVE:
        return <Globe className={className} />;
      default:
        return <MessageSquare className={className} />;
    }
  };
  
  // Get post status badge variant
  const getPostStatusVariant = (status: PostStatus) => {
    switch (status) {
      case PostStatus.DRAFT:
        return "outline" as const;
      case PostStatus.SCHEDULED:
        return "secondary" as const;
      case PostStatus.PUBLISHED:
        return "default" as const;
      case PostStatus.FAILED:
        return "destructive" as const;
      case PostStatus.PENDING_RESPONSE:
        return "warning" as const;
      case PostStatus.NEEDS_ATTENTION:
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };
  
  // Get post status color
  const getPostStatusColor = (status: PostStatus) => {
    switch (status) {
      case PostStatus.DRAFT:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
      case PostStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case PostStatus.PUBLISHED:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case PostStatus.FAILED:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case PostStatus.PENDING_RESPONSE:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case PostStatus.NEEDS_ATTENTION:
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
      default:
        return "";
    }
  };
  
  // Generate AI content 
  const handleGenerateAIContent = async () => {
    if (!aiPrompt) {
      toast({
        title: "Missing prompt",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setAiContent('');
    
    try {
      if (onGenerateAIContent) {
        const content = await onGenerateAIContent(
          aiPrompt,
          aiSelectedPlatform,
          aiSelectedContentType
        );
        setAiContent(content);
      } else {
        // Mock for demo purposes - would be replaced with real API call
        setTimeout(() => {
          let generatedContent = '';
          
          if (aiSelectedPlatform === SocialPlatform.TWITTER) {
            generatedContent = `${aiPrompt.split(' ').slice(0, 5).join(' ')}... Check out our latest ${aiSelectedContentType === ContentType.IMAGE ? 'photo' : 'content'} and let us know what you think! #trending #socialmedia`;
          } else {
            generatedContent = `We're excited to share our latest ${aiSelectedContentType === ContentType.IMAGE ? 'photo' : 'content'} about ${aiPrompt}. What do you think? Let us know in the comments below!\n\n#trending #socialmedia #content`;
          }
          
          setAiContent(generatedContent);
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Connect account
  const handleConnectAccount = async (platform: SocialPlatform) => {
    if (selectedEntity === 'all') {
      toast({
        title: "Select an entity",
        description: "Please select a business entity to connect an account",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onConnectAccount) {
        const account = await onConnectAccount(platform, selectedEntity as number);
        
        toast({
          title: "Account connected",
          description: `Successfully connected ${platform} account: ${account.name}`,
        });
        
        setIsConnectingAccount(false);
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle automation for an account
  const handleToggleAutomation = async (accountId: string, enabled: boolean) => {
    try {
      if (onEnableAutomation) {
        await onEnableAutomation(accountId, enabled);
        
        toast({
          title: enabled ? "Automation enabled" : "Automation disabled",
          description: `Successfully ${enabled ? 'enabled' : 'disabled'} automation for this account`,
        });
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: `Failed to ${enabled ? 'enable' : 'disable'} automation. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  // Create new post
  const handleCreatePost = () => {
    // Implementation would be added here
    toast({
      title: "Post created",
      description: "Your post has been created and saved as a draft",
    });
    
    setIsCreatingPost(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Media Manager</h2>
          <p className="text-muted-foreground">
            Create, schedule, and automate your social media content across all platforms
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
          
          <Button onClick={() => setIsCreatingPost(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>
      
      {/* Accounts Overview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Connected Accounts</CardTitle>
            <Button size="sm" onClick={() => setIsConnectingAccount(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          </div>
          <CardDescription>
            Manage your social media accounts and enable automations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">No accounts connected</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Connect your social media accounts to start creating and scheduling content
              </p>
              <Button onClick={() => setIsConnectingAccount(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Connect Account
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAccounts.map((account) => (
                <Card 
                  key={account.id} 
                  className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedAccount(account.id)}
                >
                  <CardHeader className="pb-2 space-y-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <CardTitle className="text-base">{account.name}</CardTitle>
                          <CardDescription>@{account.handle}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {account.connected ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            Disconnected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Followers</div>
                        <div className="font-medium">{formatNumber(account.followers || 0)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Engagement</div>
                        <div className="font-medium">{account.engagement ? formatPercentage(account.engagement) : '0.0%'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">Automation</div>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </div>
                      <Switch 
                        checked={account.automationEnabled}
                        onCheckedChange={(checked) => {
                          handleToggleAutomation(account.id, checked);
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <div className="flex justify-between w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(account.profileUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAccount(account.id);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setIsCreatingPost(true);
                            setNewPostData({
                              accountId: account.id,
                              platform: account.platform,
                              entityId: account.entityId,
                              entityName: account.entityName
                            });
                          }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDisconnectAccount) {
                                onDisconnectAccount(account.id);
                              }
                            }}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="content-calendar">Calendar</TabsTrigger>
          <TabsTrigger value="content-library">Content Library</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>
        
        {/* Content Calendar Tab */}
        <TabsContent value="content-calendar" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select 
                value={filterPlatform}
                onValueChange={(value) => setFilterPlatform(value as SocialPlatform | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {Object.values(SocialPlatform).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(platform, 'h-4 w-4')}
                        <span>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as PostStatus | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(PostStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-secondary rounded-md flex items-center p-1">
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('calendar')}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('list')}
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={() => setIsCreatingPost(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
          </div>
          
          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 border-r p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      initialFocus
                    />
                    
                    <div className="mt-6 space-y-2">
                      <h3 className="text-sm font-medium">Platforms</h3>
                      <div className="space-y-1">
                        {Object.values(SocialPlatform).map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`platform-${platform}`}
                              checked={filterPlatform === 'all' || filterPlatform === platform}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterPlatform(platform);
                                } else if (filterPlatform === platform) {
                                  setFilterPlatform('all');
                                }
                              }}
                            />
                            <label
                              htmlFor={`platform-${platform}`}
                              className="text-sm leading-none flex items-center gap-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {getPlatformIcon(platform, 'h-4 w-4')}
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Post Status</h3>
                      <div className="space-y-1">
                        {Object.values(PostStatus).map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`status-${status}`}
                              checked={filterStatus === 'all' || filterStatus === status}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterStatus(status);
                                } else if (filterStatus === status) {
                                  setFilterStatus('all');
                                }
                              }}
                            />
                            <label
                              htmlFor={`status-${status}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Content Calendar'}
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                          Today
                        </Button>
                        <div className="flex">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-r-none"
                            onClick={() => {
                              if (selectedDate) {
                                const newDate = new Date(selectedDate);
                                newDate.setDate(newDate.getDate() - 1);
                                setSelectedDate(newDate);
                              }
                            }}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-l-none"
                            onClick={() => {
                              if (selectedDate) {
                                const newDate = new Date(selectedDate);
                                newDate.setDate(newDate.getDate() + 1);
                                setSelectedDate(newDate);
                              }
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {selectedDate ? (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Posts scheduled for {format(selectedDate, 'MMMM d, yyyy')}
                        </h4>
                        
                        {postsByDate[selectedDate.toDateString()] && 
                         postsByDate[selectedDate.toDateString()].length > 0 ? (
                          <div className="space-y-3">
                            {postsByDate[selectedDate.toDateString()]
                              .sort((a, b) => {
                                const timeA = a.scheduledFor 
                                  ? new Date(a.scheduledFor).getTime() 
                                  : 0;
                                const timeB = b.scheduledFor 
                                  ? new Date(b.scheduledFor).getTime() 
                                  : 0;
                                return timeA - timeB;
                              })
                              .map((post) => (
                                <Card 
                                  key={post.id}
                                  className="cursor-pointer hover:border-primary/50 transition-colors"
                                  onClick={() => setSelectedPost(post.id)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-start gap-4">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${getPlatformColor(post.platform)}20` }}>
                                          {getPlatformIcon(post.platform)}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}</span>
                                            <Badge 
                                              variant="outline" 
                                              className={getPostStatusColor(post.status)}
                                            >
                                              {post.status}
                                            </Badge>
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {post.scheduledFor ? formatTime(post.scheduledFor) : 'No time set'}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1">
                                          {getContentTypeIcon(post.contentType, 'h-3.5 w-3.5')}
                                          <span className="text-xs text-muted-foreground">
                                            {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
                                          </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                          {post.entityName}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-2">
                                      <p className="text-sm line-clamp-3">{post.content}</p>
                                    </div>
                                    
                                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                                      <div className="mt-2 flex gap-1">
                                        {post.mediaUrls.slice(0, 3).map((url, index) => (
                                          <div 
                                            key={index}
                                            className="h-12 w-12 rounded-md bg-muted overflow-hidden"
                                          >
                                            <img
                                              src={url}
                                              alt={`Media ${index + 1}`}
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        ))}
                                        {post.mediaUrls.length > 3 && (
                                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                                            <span className="text-xs font-medium">+{post.mediaUrls.length - 3}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {post.status === PostStatus.SCHEDULED && (
                                      <div className="mt-2 flex justify-end gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (onPublishPost) {
                                              onPublishPost(post.id);
                                            }
                                          }}
                                        >
                                          <Send className="mr-2 h-3.5 w-3.5" />
                                          Publish Now
                                        </Button>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))
                            }
                          </div>
                        ) : (
                          <div className="text-center py-12 border rounded-md">
                            <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                            <h3 className="text-lg font-medium mb-2">No posts scheduled</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Create or schedule posts for this date
                            </p>
                            <Button onClick={() => setIsCreatingPost(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Post
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p>Select a date to view scheduled posts</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* List View */}
          {viewMode === 'list' && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled/Published</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Pencil className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No posts found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts
                        .sort((a, b) => {
                          // Sort by scheduled date, then published date
                          const dateA = a.scheduledFor 
                            ? new Date(a.scheduledFor).getTime()
                            : a.publishedAt
                              ? new Date(a.publishedAt).getTime()
                              : new Date(a.createdAt).getTime();
                          
                          const dateB = b.scheduledFor 
                            ? new Date(b.scheduledFor).getTime()
                            : b.publishedAt
                              ? new Date(b.publishedAt).getTime()
                              : new Date(b.createdAt).getTime();
                          
                          return dateB - dateA; // Most recent first
                        })
                        .map((post) => (
                          <TableRow 
                            key={post.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedPost(post.id)}
                          >
                            <TableCell>
                              <div className="flex items-start gap-3">
                                {post.mediaUrls && post.mediaUrls.length > 0 ? (
                                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
                                    <img
                                      src={post.mediaUrls[0]}
                                      alt="Post media"
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                                    {getContentTypeIcon(post.contentType, 'h-5 w-5 text-muted-foreground')}
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium flex items-center gap-1">
                                    {getContentTypeIcon(post.contentType, 'h-3.5 w-3.5 mr-1')}
                                    {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
                                  </div>
                                  <p className="text-sm line-clamp-2">{post.content}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                {getPlatformIcon(post.platform, 'h-4 w-4')}
                                <span>
                                  {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getPostStatusColor(post.status)}
                              >
                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {post.scheduledFor ? (
                                <div>
                                  <div>{formatDate(post.scheduledFor)}</div>
                                  <div className="text-xs text-muted-foreground">{formatTime(post.scheduledFor)}</div>
                                </div>
                              ) : post.publishedAt ? (
                                <div>
                                  <div>{formatDate(post.publishedAt)}</div>
                                  <div className="text-xs text-muted-foreground">{formatTime(post.publishedAt)}</div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not scheduled</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {post.stats ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{formatNumber(post.stats.likes)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{formatNumber(post.stats.comments)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Share className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{formatNumber(post.stats.shares)}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No data</span>
                              )}
                            </TableCell>
                            <TableCell>{post.entityName}</TableCell>
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
                                    setSelectedPost(post.id);
                                  }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {post.status === PostStatus.DRAFT && (
                                    <>
                                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        Schedule
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onPublishPost) {
                                          onPublishPost(post.id);
                                        }
                                      }}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Publish Now
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {post.status === PostStatus.SCHEDULED && (
                                    <>
                                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onPublishPost) {
                                          onPublishPost(post.id);
                                        }
                                      }}>
                                        <Send className="mr-2 h-4 w-4" />
                                        Publish Now
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {post.status === PostStatus.PUBLISHED && post.url && (
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(post.url, '_blank');
                                      }}
                                    >
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      View on {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onDeletePost) {
                                        onDeletePost(post.id);
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
          )}
        </TabsContent>
        
        {/* Content Library Tab */}
        <TabsContent value="content-library" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium">Content Templates</h3>
              <p className="text-sm text-muted-foreground">
                Reusable content templates for quick posting
              </p>
            </div>
            <Button onClick={() => setIsCreatingTemplate(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">No templates created yet</h3>
                <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                  Create reusable content templates to streamline your posting process
                </p>
                <Button className="mt-4" onClick={() => setIsCreatingTemplate(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                    {template.mediaUrls && template.mediaUrls.length > 0 ? (
                      <img 
                        src={template.mediaUrls[0]} 
                        alt={template.name} 
                        className="h-full w-full object-cover transition-transform hover:scale-105" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full" style={{ 
                        backgroundColor: `${getPlatformColor(template.platform)}20` 
                      }}>
                        {getPlatformIcon(template.platform, 'h-16 w-16')}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm dark:bg-black/60">
                        {template.platform.charAt(0).toUpperCase() + template.platform.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm dark:bg-black/60">
                        {template.contentType.charAt(0).toUpperCase() + template.contentType.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {template.description && (
                      <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm line-clamp-3">{template.content}</div>
                    
                    {template.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.categories.map((categoryId, index) => {
                          const category = categories.find(c => c.id === categoryId);
                          return category ? (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      {template.entityName}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Create post from template
                          setIsCreatingPost(true);
                          setNewPostData({
                            content: template.content,
                            platform: template.platform,
                            contentType: template.contentType,
                            mediaUrls: template.mediaUrls,
                            entityId: template.entityId,
                            entityName: template.entityName,
                            tags: template.tags,
                            status: PostStatus.DRAFT
                          });
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
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
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Hashtag Groups</h3>
            
            {hashtagGroups.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hashtag groups created yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        // Open create hashtag group dialog
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Hashtag Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hashtagGroups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{group.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {group.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="secondary">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {group.platforms.map((platform, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                            {getPlatformIcon(platform, 'h-3 w-3')}
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                      <div className="flex justify-between w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Copy to clipboard
                            navigator.clipboard.writeText(group.hashtags.join(' '));
                            toast({
                              title: "Copied to clipboard",
                              description: "Hashtags copied to clipboard",
                            });
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Create post with these hashtags
                            setIsCreatingPost(true);
                            setNewPostData({
                              content: group.hashtags.join(' '),
                              entityId: group.entityId,
                              status: PostStatus.DRAFT
                            });
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Post
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Automations Tab */}
        <TabsContent value="automations" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium">Content Automation Rules</h3>
              <p className="text-sm text-muted-foreground">
                Automate your content creation and publishing workflow
              </p>
            </div>
            <Button onClick={() => setIsCreatingAutomation(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Automation
            </Button>
          </div>
          
          {filteredAutomationRules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Timer className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">No automation rules created yet</h3>
                <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                  Create automation rules to streamline your content workflow
                </p>
                <Button className="mt-4" onClick={() => setIsCreatingAutomation(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Automation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Platforms</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last/Next Run</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAutomationRules.map((rule) => {
                      const accountsForRule = accounts.filter(account => 
                        rule.accountIds.includes(account.id)
                      );
                      
                      const platformsForRule = accountsForRule.map(account => account.platform);
                      const uniquePlatforms = [...new Set(platformsForRule)];
                      
                      return (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <div className="font-medium">{rule.name}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {rule.trigger.type === 'schedule'
                                ? 'Time-based Schedule'
                                : rule.trigger.type === 'event'
                                  ? 'Event Trigger'
                                  : 'Conditional Trigger'
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {rule.trigger.type === 'schedule'
                                ? rule.trigger.config.frequency
                                : rule.trigger.type === 'event'
                                  ? rule.trigger.config.eventName
                                  : rule.trigger.config.condition
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {rule.actions.map((action, index) => (
                                <div key={index} className="text-sm">
                                  {action.type === 'create_post'
                                    ? 'Create Post'
                                    : action.type === 'schedule_post'
                                      ? 'Schedule Post'
                                      : action.type === 'send_notification'
                                        ? 'Send Notification'
                                        : action.type
                                  }
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {uniquePlatforms.map((platform, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                                  {getPlatformIcon(platform, 'h-3 w-3')}
                                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2.5 w-2.5 rounded-full ${
                                rule.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                              }`} />
                              <span>{rule.enabled ? 'Active' : 'Inactive'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {rule.lastRun ? (
                                <div className="text-sm">
                                  Last: {formatDate(rule.lastRun)}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">Never run</div>
                              )}
                              {rule.nextRun && (
                                <div className="text-sm">
                                  Next: {formatDate(rule.nextRun)}
                                </div>
                              )}
                            </div>
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
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {rule.enabled ? (
                                  <DropdownMenuItem onClick={() => {
                                    if (onUpdateAutomationRule) {
                                      onUpdateAutomationRule(rule.id, { enabled: false });
                                    }
                                  }}>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Disable
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => {
                                    if (onUpdateAutomationRule) {
                                      onUpdateAutomationRule(rule.id, { enabled: true });
                                    }
                                  }}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Enable
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Play className="mr-2 h-4 w-4" />
                                  Run Now
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
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-6">Account Automation Settings</h3>
            
            {filteredAccounts.length === 0 ? (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No social accounts connected</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setIsConnectingAccount(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Connect Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAccounts.map((account) => (
                  <Card key={account.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(account.platform)}
                          <CardTitle className="text-base">{account.name}</CardTitle>
                        </div>
                        <Switch 
                          checked={account.automationEnabled}
                          onCheckedChange={(checked) => {
                            handleToggleAutomation(account.id, checked);
                          }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {account.automationEnabled ? (
                        <div className="space-y-4">
                          {account.postingSchedule && (
                            <div>
                              <div className="text-sm font-medium">Posting Schedule</div>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {account.postingSchedule.frequency === 'daily' ? (
                                  <Badge variant="outline">Daily</Badge>
                                ) : account.postingSchedule.frequency === 'weekly' ? (
                                  <Badge variant="outline">Weekly</Badge>
                                ) : (
                                  <Badge variant="outline">Custom</Badge>
                                )}
                                
                                {account.postingSchedule.daysOfWeek && account.postingSchedule.daysOfWeek.length > 0 && (
                                  <div className="flex gap-1">
                                    {account.postingSchedule.daysOfWeek.map((day) => (
                                      <Badge key={day} variant="outline" className="w-6 flex items-center justify-center">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'][day]}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                
                                {account.postingSchedule.timesOfDay && account.postingSchedule.timesOfDay.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {account.postingSchedule.timesOfDay.map((time, index) => (
                                      <Badge key={index} variant="outline">
                                        {time}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {account.contentStrategy && (
                            <div>
                              <div className="text-sm font-medium">Content Strategy</div>
                              <div className="mt-2 grid grid-cols-2 gap-3">
                                <div>
                                  <div className="text-xs text-muted-foreground">Content Mix</div>
                                  <div className="space-y-1 mt-1">
                                    <div className="flex justify-between text-xs">
                                      <span>Promotional</span>
                                      <span>{account.contentStrategy.contentMix.promotional}%</span>
                                    </div>
                                    <Progress value={account.contentStrategy.contentMix.promotional} className="h-1" />
                                    
                                    <div className="flex justify-between text-xs">
                                      <span>Educational</span>
                                      <span>{account.contentStrategy.contentMix.educational}%</span>
                                    </div>
                                    <Progress value={account.contentStrategy.contentMix.educational} className="h-1" />
                                    
                                    <div className="flex justify-between text-xs">
                                      <span>Engagement</span>
                                      <span>{account.contentStrategy.contentMix.engagement}%</span>
                                    </div>
                                    <Progress value={account.contentStrategy.contentMix.engagement} className="h-1" />
                                    
                                    <div className="flex justify-between text-xs">
                                      <span>Entertainment</span>
                                      <span>{account.contentStrategy.contentMix.entertainment}%</span>
                                    </div>
                                    <Progress value={account.contentStrategy.contentMix.entertainment} className="h-1" />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-xs text-muted-foreground">Top Hashtags</div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {account.contentStrategy.topPerformingHashtags.map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-muted-foreground">AI Assist</div>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </div>
                            <Switch 
                              checked={account.aiAssistEnabled || false}
                              onCheckedChange={(checked) => {
                                // Update AI assist setting
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted p-4 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">
                            Automation is disabled for this account. Enable it to set up posting schedules and content strategies.
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleToggleAutomation(account.id, true)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Enable & Configure
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                      <div className="flex justify-between w-full">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // View account analytics
                          }}
                        >
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Analytics
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Edit automation settings
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Settings
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium">Social Media Campaigns</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage cross-platform social campaigns
              </p>
            </div>
            <Button onClick={() => setIsCreatingCampaign(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
          
          {filteredCampaigns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">No campaigns created yet</h3>
                <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                  Create campaigns to organize and track your social media marketing efforts
                </p>
                <Button className="mt-4" onClick={() => setIsCreatingCampaign(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCampaigns.map((campaign) => (
                <Card 
                  key={campaign.id}
                  className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{campaign.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={
                          campaign.status === 'active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                          campaign.status === 'scheduled' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                          campaign.status === 'completed' ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" :
                          campaign.status === 'canceled' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                          "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
                        }
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                    {campaign.description && (
                      <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Start Date</div>
                          <div className="font-medium">{formatDate(campaign.startDate)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">End Date</div>
                          <div className="font-medium">{formatDate(campaign.endDate)}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Platforms</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {campaign.platforms.map((platform, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                              {getPlatformIcon(platform, 'h-3 w-3')}
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Posts</div>
                        <div className="flex justify-between mt-1">
                          <div className="text-sm">{campaign.posts.length} posts</div>
                          {campaign.budget && (
                            <div className="text-sm">Budget: {formatCurrency(campaign.budget)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <div className="flex justify-between w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // View campaign analytics
                        }}
                      >
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Analytics
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Create post for this campaign
                          setIsCreatingPost(true);
                          setNewPostData({
                            entityId: campaign.entityId,
                            entityName: campaign.entityName,
                            status: PostStatus.DRAFT
                          });
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <div className="space-y-6">
              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Social media performance across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Followers</div>
                      <div className="text-2xl font-bold">{formatNumber(analytics.overallPerformance.totalFollowers)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Engagement</div>
                      <div className="text-2xl font-bold">{formatNumber(analytics.overallPerformance.totalEngagement)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Impressions</div>
                      <div className="text-2xl font-bold">{formatNumber(analytics.overallPerformance.totalImpressions)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avg. Engagement Rate</div>
                      <div className="text-2xl font-bold">{formatPercentage(analytics.overallPerformance.averageEngagementRate)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="h-[250px] flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-muted-foreground mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Platform Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                    <CardDescription>
                      Engagement and growth by platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {analytics.accounts.map((account) => (
                        <div key={account.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(account.platform)}
                              <span className="font-medium">{account.name}</span>
                            </div>
                            <span className="text-sm">{formatNumber(account.metrics.followers)} followers</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Engagement</div>
                              <div className="font-medium">{formatPercentage(account.metrics.engagement)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Impressions</div>
                              <div className="font-medium">{formatNumber(account.metrics.impressions)}</div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Growth: {account.metrics.followersGrowth > 0 ? '+' : ''}{account.metrics.followersGrowth}</span>
                            <span>Clicks: {formatNumber(account.metrics.clicks)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>
                      Your most engaging content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topPosts.map((post) => (
                        <div key={post.id} className="flex gap-3 border-b pb-4 last:border-0 last:pb-0">
                          <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                            {post.mediaUrls && post.mediaUrls.length > 0 ? (
                              <img
                                src={post.mediaUrls[0]}
                                alt="Post media"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                {getPlatformIcon(post.platform)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(post.platform, 'h-4 w-4')}
                              <span className="text-sm font-medium">{post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}</span>
                            </div>
                            <p className="text-sm line-clamp-2 mt-1">{post.content}</p>
                            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{formatNumber(post.stats?.likes || 0)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{formatNumber(post.stats?.comments || 0)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share className="h-3 w-3" />
                                <span>{formatNumber(post.stats?.shares || 0)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Audience Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Audience Insights</CardTitle>
                  <CardDescription>
                    Demographics and behavior of your audience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Demographics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm mb-1">Age Groups</div>
                          <div className="space-y-1">
                            {Object.entries(analytics.audienceInsights.demographics.age)
                              .sort(([ageA], [ageB]) => {
                                // Sort age groups (e.g., "18-24", "25-34", etc.)
                                const numA = parseInt(ageA.split('-')[0]);
                                const numB = parseInt(ageB.split('-')[0]);
                                return numA - numB;
                              })
                              .map(([age, percentage]) => (
                                <div key={age} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{age}</span>
                                    <span>{formatPercentage(percentage)}</span>
                                  </div>
                                  <Progress value={percentage * 100} className="h-1" />
                                </div>
                              ))
                            }
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm mb-1">Gender</div>
                          <div className="space-y-1">
                            {Object.entries(analytics.audienceInsights.demographics.gender).map(([gender, percentage]) => (
                              <div key={gender} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
                                  <span>{formatPercentage(percentage)}</span>
                                </div>
                                <Progress value={percentage * 100} className="h-1" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Top Locations</h4>
                      <div className="space-y-1">
                        {Object.entries(analytics.audienceInsights.demographics.location)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([location, percentage]) => (
                            <div key={location} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{location}</span>
                                <span>{formatPercentage(percentage)}</span>
                              </div>
                              <Progress value={percentage * 100} className="h-1" />
                            </div>
                          ))
                        }
                      </div>
                      
                      <h4 className="text-sm font-medium mt-4 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(analytics.audienceInsights.interests)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 8)
                          .map(([interest, percentage]) => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Active Hours</h4>
                      <div className="space-y-1">
                        {Object.entries(analytics.audienceInsights.activeHours)
                          .sort(([hourA], [hourB]) => parseInt(hourA) - parseInt(hourB))
                          .map(([hour, percentage]) => (
                            <div key={hour} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{hour}:00</span>
                                <span>{formatPercentage(percentage)}</span>
                              </div>
                              <Progress value={percentage * 100} className="h-1" />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">Analytics not available</h3>
                <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                  Connect your social media accounts and start posting to see analytics data
                </p>
                <Button className="mt-4" onClick={() => setIsConnectingAccount(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Account
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* AI Assistant Tab */}
        <TabsContent value="ai-assistant" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Content Generator
                  </CardTitle>
                  <CardDescription>
                    Generate social media content with AI assistance
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setAiPrompt('');
                    setAiContent('');
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">What would you like to post about?</Label>
                <Textarea 
                  id="prompt" 
                  placeholder="E.g., Announce our new summer collection with exciting features and benefits..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="h-24"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div>
                  <Label htmlFor="platform" className="text-sm">Platform</Label>
                  <Select 
                    value={aiSelectedPlatform}
                    onValueChange={(value) => setAiSelectedPlatform(value as SocialPlatform)}
                  >
                    <SelectTrigger id="platform" className="w-[150px]">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SocialPlatform).map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(platform, 'h-4 w-4')}
                            <span>
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="content-type" className="text-sm">Content Type</Label>
                  <Select 
                    value={aiSelectedContentType}
                    onValueChange={(value) => setAiSelectedContentType(value as ContentType)}
                  >
                    <SelectTrigger id="content-type" className="w-[150px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ContentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            {getContentTypeIcon(type, 'h-4 w-4')}
                            <span>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 mt-auto">
                  <Button 
                    className="w-full md:w-auto"
                    onClick={handleGenerateAIContent}
                    disabled={isLoading || !aiPrompt}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {aiContent && (
                <div className="mt-2">
                  <Label className="text-sm mb-1 block">Generated Content</Label>
                  <Card className="relative">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(aiSelectedPlatform, 'h-4 w-4')}
                          <span className="text-sm font-medium">
                            {aiSelectedPlatform.charAt(0).toUpperCase() + aiSelectedPlatform.slice(1)}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {aiSelectedContentType.charAt(0).toUpperCase() + aiSelectedContentType.slice(1)}
                        </Badge>
                      </div>
                      <p className="whitespace-pre-wrap">{aiContent}</p>
                    </CardContent>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(aiContent);
                          toast({
                            title: "Copied to clipboard",
                            description: "Content copied to clipboard",
                          });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setIsCreatingPost(true);
                          setNewPostData({
                            content: aiContent,
                            platform: aiSelectedPlatform,
                            contentType: aiSelectedContentType,
                            status: PostStatus.DRAFT,
                            aiGenerated: true,
                            aiPrompt: aiPrompt
                          });
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
              
              <div className="bg-muted p-4 rounded-md">
                <div className="flex gap-2 items-start">
                  <Wand2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">AI Content Generation Tips</h4>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>Be specific about your goals (e.g., drive sales, increase engagement)</li>
                      <li>Mention your target audience for more tailored content</li>
                      <li>Include key points you want to highlight about your product or service</li>
                      <li>Specify the tone (formal, casual, funny, professional)</li>
                      <li>Add relevant hashtags you want to include</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setAiPrompt("Announce a special summer promotion for our customers")}>
                  Promotion
                </Button>
                <Button variant="outline" onClick={() => setAiPrompt("Share tips about how to use our product effectively")}>
                  Tips & Advice
                </Button>
                <Button variant="outline" onClick={() => setAiPrompt("Create an engaging question to ask our followers")}>
                  Question
                </Button>
              </div>
              
              <Button 
                onClick={() => {
                  if (aiContent) {
                    setIsCreatingPost(true);
                    setNewPostData({
                      content: aiContent,
                      platform: aiSelectedPlatform,
                      contentType: aiSelectedContentType,
                      status: PostStatus.DRAFT,
                      aiGenerated: true,
                      aiPrompt: aiPrompt
                    });
                  } else {
                    handleGenerateAIContent();
                  }
                }}
                disabled={isLoading || (!aiContent && !aiPrompt)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {aiContent ? 'Create Post with This Content' : 'Generate & Create Post'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Smart Content Suggestions</CardTitle>
              <CardDescription>
                AI-powered content suggestions based on your audience and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Engagement Booster</h4>
                        <p className="text-sm text-muted-foreground">
                          Your audience engages more with image posts asking questions.
                          Try posting a question with a relevant image.
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setAiPrompt("Create an engaging question post with an image prompt about customer preferences");
                      setAiSelectedContentType(ContentType.IMAGE);
                      setActiveTab('ai-assistant');
                    }}>
                      Try It
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Optimal Posting Time</h4>
                        <p className="text-sm text-muted-foreground">
                          Your followers are most active on Wednesdays around 2PM.
                          Schedule your important posts for this time.
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      // Create a scheduled post for Wednesday at 2PM
                      const nextWednesday = new Date();
                      while (nextWednesday.getDay() !== 3) { // 3 is Wednesday
                        nextWednesday.setDate(nextWednesday.getDate() + 1);
                      }
                      nextWednesday.setHours(14, 0, 0, 0); // 2PM
                      
                      setIsCreatingPost(true);
                      setNewPostData({
                        scheduledFor: nextWednesday,
                        status: PostStatus.DRAFT
                      });
                    }}>
                      Schedule
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <Tag className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Trending Hashtags</h4>
                        <p className="text-sm text-muted-foreground">
                          These hashtags are performing well in your industry:
                          #BusinessAutomation #Productivity #TimeManagement
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setAiPrompt("Create a post about business efficiency using hashtags #BusinessAutomation #Productivity #TimeManagement");
                      setActiveTab('ai-assistant');
                    }}>
                      Use Tags
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Content Mix Recommendation</h4>
                        <p className="text-sm text-muted-foreground">
                          Your content is 70% promotional. Try creating more educational and engagement content.
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setAiPrompt("Create educational content that provides valuable insights about our industry without being promotional");
                      setActiveTab('ai-assistant');
                    }}>
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Connect Account Dialog */}
      <Dialog open={isConnectingAccount} onOpenChange={setIsConnectingAccount}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Social Media Account</DialogTitle>
            <DialogDescription>
              Select the platform you want to connect to
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {Object.values(SocialPlatform).map((platform) => (
              <Button
                key={platform}
                variant="outline"
                className="h-auto flex-col py-4 border-2 hover:bg-muted/80 hover:border-primary/50"
                onClick={() => handleConnectAccount(platform)}
              >
                <div className="h-12 w-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${getPlatformColor(platform)}20` }}>
                  {getPlatformIcon(platform, 'h-6 w-6')}
                </div>
                <div className="text-base">{platform.charAt(0).toUpperCase() + platform.slice(1)}</div>
              </Button>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnectingAccount(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Post Dialog would be implemented here */}
      
      {/* Create Template Dialog would be implemented here */}
      
      {/* Create Campaign Dialog would be implemented here */}
      
      {/* Post Details Dialog would be implemented here */}
      
      {/* Create Automation Dialog would be implemented here */}
    </div>
  );
};

export default EnhancedSocialMediaManager;