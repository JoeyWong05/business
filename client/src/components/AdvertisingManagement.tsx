import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  ArrowDownUp,
  BarChart2,
  BarChart3,
  BarChartHorizontal,
  Building as BuildingIcon,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Copy,
  Download,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  HelpCircle,
  Info,
  Link2 as Link2Icon,
  Loader,
  Mail,
  MoreHorizontal,
  Pause,
  PieChart,
  Play,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  Share,
  ShoppingBag,
  Star,
  Tag,
  Trash,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

// Define icon components to avoid conflicts with our custom implementations
import { 
  LineChart as LineChartIcon,
  DollarSign as DollarSignIcon,
  MousePointerClick as MousePointerClickIcon,
  Upload as UploadIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Types for Advertising Management

export enum AdPlatform {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  AMAZON = 'amazon',
  ETSY = 'etsy',
  EBAY = 'ebay',
  PINTEREST = 'pinterest',
  TIKTOK = 'tiktok',
  SNAPCHAT = 'snapchat',
  MICROSOFT = 'microsoft',
  YOUTUBE = 'youtube',
  OTHER = 'other'
}

export enum AdType {
  SEARCH = 'search',
  DISPLAY = 'display',
  VIDEO = 'video',
  SHOPPING = 'shopping',
  SPONSORED_PRODUCTS = 'sponsored_products',
  SOCIAL = 'social',
  NATIVE = 'native',
  EMAIL = 'email',
  REMARKETING = 'remarketing',
  DYNAMIC = 'dynamic',
  LOCAL = 'local',
  APP_INSTALL = 'app_install'
}

export enum AdStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  SCHEDULED = 'scheduled',
  ENDED = 'ended',
  DRAFT = 'draft',
  REJECTED = 'rejected',
  PENDING_REVIEW = 'pending_review',
  DISAPPROVED = 'disapproved',
  OPTIMIZING = 'optimizing'
}

export enum BidStrategy {
  MANUAL_CPC = 'manual_cpc',
  ENHANCED_CPC = 'enhanced_cpc',
  TARGET_CPA = 'target_cpa',
  MAXIMIZE_CONVERSIONS = 'maximize_conversions',
  MAXIMIZE_CONVERSION_VALUE = 'maximize_conversion_value',
  TARGET_ROAS = 'target_roas',
  MAXIMIZE_CLICKS = 'maximize_clicks',
  MANUAL_CPV = 'manual_cpv',
  MANUAL_CPM = 'manual_cpm',
  VIEWABLE_CPM = 'viewable_cpm',
  TARGET_IMPRESSION_SHARE = 'target_impression_share'
}

export enum AdObjective {
  BRAND_AWARENESS = 'brand_awareness',
  REACH = 'reach',
  TRAFFIC = 'traffic',
  ENGAGEMENT = 'engagement',
  APP_INSTALLS = 'app_installs',
  VIDEO_VIEWS = 'video_views',
  LEAD_GENERATION = 'lead_generation',
  MESSAGES = 'messages',
  CONVERSIONS = 'conversions',
  CATALOG_SALES = 'catalog_sales',
  STORE_TRAFFIC = 'store_traffic'
}

export enum AudienceType {
  DEMOGRAPHIC = 'demographic',
  INTEREST = 'interest',
  BEHAVIOR = 'behavior',
  CUSTOM = 'custom',
  SIMILAR = 'similar',
  REMARKETING = 'remarketing',
  CUSTOMER_LIST = 'customer_list',
  COMBINED = 'combined'
}

export interface AdCampaign {
  id: string;
  name: string;
  platform: AdPlatform;
  status: AdStatus;
  objective: AdObjective;
  budget: number;
  budgetType: 'daily' | 'lifetime';
  startDate: Date | string;
  endDate?: Date | string;
  targetROAS?: number;
  targetCPA?: number;
  bidStrategy: BidStrategy;
  spendToDate: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionValue: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
  adGroups: AdGroup[];
  keywords?: AdKeyword[];
  audiences?: AdAudience[];
  isAutomated?: boolean;
  automationRules?: any[];
  notes?: string;
  tags?: string[];
}

export interface AdGroup {
  id: string;
  campaignId: string;
  name: string;
  status: AdStatus;
  bid?: number;
  targetAudience: string;
  ads: Ad[];
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpc: number;
  cvr: number;
  roas: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Ad {
  id: string;
  groupId: string;
  name: string;
  type: AdType;
  status: AdStatus;
  headline?: string;
  description?: string;
  finalUrl?: string;
  displayUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  callToAction?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpc: number;
  cvr: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AdKeyword {
  id: string;
  campaignId: string;
  adGroupId?: string;
  keyword: string;
  matchType: 'broad' | 'phrase' | 'exact' | 'negative';
  bid?: number;
  status: 'active' | 'paused' | 'removed';
  qualityScore?: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpc: number;
  position: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  isCompetitorTarget?: boolean;
  competitorName?: string;
}

export interface AdAudience {
  id: string;
  campaignId: string;
  name: string;
  type: AudienceType;
  size?: number;
  criteria: {
    [key: string]: any;
  };
  status: 'active' | 'paused' | 'archived';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CompetitorAd {
  id: string;
  competitorName: string;
  platform: AdPlatform;
  type: AdType;
  headline?: string;
  description?: string;
  imageUrl?: string;
  dateDetected: Date | string;
  estimatedBudget?: number;
  keywords?: string[];
  targetAudience?: string[];
  landingPageUrl?: string;
  notes?: string;
  entityId: number;
}

export interface KeywordRecommendation {
  id: string;
  keyword: string;
  relevanceScore: number; // 1-100
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  bidEstimate: number;
  potentialTraffic: number;
  recommendedBid: number;
  associated: {
    campaigns: string[]; // Campaign IDs
    adGroups: string[]; // AdGroup IDs
  };
  isCompetitorKeyword: boolean;
  competitorNames?: string[];
  entityId: number;
}

export interface AdAccountConnection {
  id: string;
  platform: AdPlatform;
  accountId: string;
  accountName: string;
  status: 'connected' | 'disconnected' | 'error';
  connectionDate: Date | string;
  lastSyncDate?: Date | string;
  apiCredentials?: {
    [key: string]: string;
  };
  entityId: number;
  entityName: string;
}

export interface AdPlatformRoadmap {
  id: string;
  platform: AdPlatform;
  setupSteps: {
    id: string;
    name: string;
    description: string;
    isCompleted: boolean;
    helpUrl?: string;
  }[];
  recommendedAudiences: {
    name: string;
    description: string;
    targetingCriteria: {
      [key: string]: any;
    };
  }[];
  recommendedBudget: {
    daily: number;
    monthly: number;
    recommendationBasis: string;
  };
  bestPractices: string[];
  competitorInsights?: {
    averageBid: number;
    topKeywords: string[];
    adFormats: AdType[];
  };
  entityId: number;
}

export interface AdvertisingManagementProps {
  entities: Array<{ id: number, name: string, type: string }>;
  campaigns?: AdCampaign[];
  connections?: AdAccountConnection[];
  keywords?: AdKeyword[];
  keywordRecommendations?: KeywordRecommendation[];
  competitorAds?: CompetitorAd[];
  roadmaps?: AdPlatformRoadmap[];
  onCreateCampaign?: (campaign: Omit<AdCampaign, 'id'>) => Promise<AdCampaign>;
  onUpdateCampaign?: (id: string, campaign: Partial<AdCampaign>) => Promise<AdCampaign>;
  onDeleteCampaign?: (id: string) => Promise<void>;
  onCreateAdGroup?: (adGroup: Omit<AdGroup, 'id'>) => Promise<AdGroup>;
  onUpdateAdGroup?: (id: string, adGroup: Partial<AdGroup>) => Promise<AdGroup>;
  onDeleteAdGroup?: (id: string) => Promise<void>;
  onCreateAd?: (ad: Omit<Ad, 'id'>) => Promise<Ad>;
  onUpdateAd?: (id: string, ad: Partial<Ad>) => Promise<Ad>;
  onDeleteAd?: (id: string) => Promise<void>;
  onCreateKeyword?: (keyword: Omit<AdKeyword, 'id'>) => Promise<AdKeyword>;
  onUpdateKeyword?: (id: string, keyword: Partial<AdKeyword>) => Promise<AdKeyword>;
  onDeleteKeyword?: (id: string) => Promise<void>;
  onConnectAdAccount?: (platform: AdPlatform, credentials: any, entityId: number) => Promise<AdAccountConnection>;
  onDisconnectAdAccount?: (id: string) => Promise<void>;
  onSyncAdAccount?: (id: string) => Promise<void>;
  onGenerateRecommendations?: (entityId: number, platform?: AdPlatform) => Promise<KeywordRecommendation[]>;
  onCreateRoadmap?: (platform: AdPlatform, entityId: number) => Promise<AdPlatformRoadmap>;
  onUpdateRoadmapStep?: (roadmapId: string, stepId: string, isCompleted: boolean) => Promise<void>;
}

const AdvertisingManagement: React.FC<AdvertisingManagementProps> = ({
  entities,
  campaigns = [],
  connections = [],
  keywords = [],
  keywordRecommendations = [],
  competitorAds = [],
  roadmaps = [],
  onCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onCreateAdGroup,
  onUpdateAdGroup,
  onDeleteAdGroup,
  onCreateAd,
  onUpdateAd,
  onDeleteAd,
  onCreateKeyword,
  onUpdateKeyword,
  onDeleteKeyword,
  onConnectAdAccount,
  onDisconnectAdAccount,
  onSyncAdAccount,
  onGenerateRecommendations,
  onCreateRoadmap,
  onUpdateRoadmapStep
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnectingAccount, setIsConnectingAccount] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isCreatingAdGroup, setIsCreatingAdGroup] = useState(false);
  const [isCreatingAd, setIsCreatingAd] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedAdGroup, setSelectedAdGroup] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<string | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter based on selected entity
  const filteredCampaigns = campaigns.filter(campaign => {
    // Filter by entity
    if (selectedEntity !== 'all' && campaign.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by status
    if (campaignStatusFilter !== 'all' && campaign.status !== campaignStatusFilter) {
      return false;
    }
    
    // Filter by platform
    if (platformFilter !== 'all' && campaign.platform !== platformFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !campaign.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const filteredConnections = connections.filter(connection => 
    selectedEntity === 'all' || connection.entityId === selectedEntity
  );
  
  const filteredKeywords = keywords.filter(keyword => {
    // If a campaign is selected, only show keywords for that campaign
    if (selectedCampaign && keyword.campaignId !== selectedCampaign) {
      return false;
    }
    
    // If an ad group is selected, only show keywords for that ad group
    if (selectedAdGroup && keyword.adGroupId !== selectedAdGroup) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const filteredKeywordRecommendations = keywordRecommendations.filter(recommendation => 
    selectedEntity === 'all' || recommendation.entityId === selectedEntity
  );
  
  const filteredCompetitorAds = competitorAds.filter(ad => 
    selectedEntity === 'all' || ad.entityId === selectedEntity
  );
  
  const filteredRoadmaps = roadmaps.filter(roadmap => 
    selectedEntity === 'all' || roadmap.entityId === selectedEntity
  );

  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Format large numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Get platform icon
  const getPlatformIcon = (platform: AdPlatform) => {
    switch (platform) {
      case AdPlatform.GOOGLE:
        return <GoogleIcon className="h-4 w-4" />;
      case AdPlatform.FACEBOOK:
        return <FacebookIcon className="h-4 w-4" />;
      case AdPlatform.INSTAGRAM:
        return <InstagramIcon className="h-4 w-4" />;
      case AdPlatform.TWITTER:
        return <TwitterIcon className="h-4 w-4" />;
      case AdPlatform.LINKEDIN:
        return <LinkedInIcon className="h-4 w-4" />;
      case AdPlatform.AMAZON:
        return <AmazonIcon className="h-4 w-4" />;
      case AdPlatform.ETSY:
        return <EtsyIcon className="h-4 w-4" />;
      case AdPlatform.EBAY:
        return <EbayIcon className="h-4 w-4" />;
      case AdPlatform.PINTEREST:
        return <PinterestIcon className="h-4 w-4" />;
      case AdPlatform.TIKTOK:
        return <TikTokIcon className="h-4 w-4" />;
      case AdPlatform.SNAPCHAT:
        return <SnapchatIcon className="h-4 w-4" />;
      case AdPlatform.MICROSOFT:
        return <MicrosoftIcon className="h-4 w-4" />;
      case AdPlatform.YOUTUBE:
        return <YoutubeIcon className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };
  
  // Platform icon components
  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
  
  const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
    </svg>
  );
  
  const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" fill="#E4405F" />
    </svg>
  );
  
  const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="#1DA1F2" />
    </svg>
  );
  
  const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
    </svg>
  );
  
  const AmazonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M15.93 17.09c-2.27-.59-3.33.15-5.42.67-1.7.42-3.5-.03-3.5-.03-.33-.13-.56-.27-.51-.58.05-.31.38-.27.64-.25 1.08.13 1.05-.53 2.74-.53 1.86 0 2.98 1 5.7-.5.11-.06.19.03.11.24-.16.38-.41.79-.76.98zm1.41-2.5c-.33.4-.85.71-1.4.71-.13 0-.25-.02-.38-.07-.49-.17-.84-.61-1.05-1.23-.09-.23.1-.34.25-.34h.22c.22.01.29-.15.36-.29.06-.13.18-.24.21-.28.03-.04.05-.07.14-.07h.72c.06 0 .09.01.12.06a.5.5 0 0 1 .07.18c.09.64.24 1.07.74 1.33zm-5.8-6.61c0 1.21-.3 2.19-1.05 2.97-.64.67-1.58 1.11-2.67 1.11-1.21 0-2.22-.45-2.92-1.3-.75-.92-.94-2.03-.94-3.05 0-1.96.79-4.37 3.83-4.37 2.98 0 3.75 2.49 3.75 4.64zm-3.77-3.26c-1.17 0-1.94 1.09-1.94 2.69 0 1.53.89 2.29 1.94 2.29.89 0 1.98-.6 1.98-2.37 0-1.25-.57-2.61-1.98-2.61zm13.88 7.14c-1.33 1.46-3.93 2.23-5.93 2.23-2.79 0-5.3-1.09-7.19-2.91-1.7-1.66-.52-3.72 1.85-1.89-.2-1.96 1.39-3.73 3.2-3.73.86 0 1.75.39 2.32 1.07.47-.75 1.4-1.3 2.66-1.3 1.39 0 2.39.87 2.39 2.21 0 .6-.22 1.03-.22 1.03 2.45-.66 2.61 3.16.92 3.29zM13.63 7.77c-.06-.35-.29-.59-.59-.59-.3 0-.53.24-.59.59-.06-.35-.29-.59-.59-.59-.3 0-.53.24-.59.59-.07-.35-.3-.59-.6-.59a.61.61 0 0 0-.58.59c-.07-.35-.3-.59-.6-.59-.46 0-.72.48-.48.87l1.59 2.62c.11.18.31.18.42 0l1.59-2.62c.24-.39-.02-.87-.48-.87zm2.86 2.95c0-.39-.32-.7-.71-.7h-.8c-.39 0-.71.31-.71.7v.8c0 .39.32.71.71.71h.8c.39 0 .71-.32.71-.71v-.8zm2.58-2.74a.695.695 0 0 0-.69-.69h-.59c-.38 0-.69.31-.69.69v3.28c0 .38.31.69.69.69h.59c.38 0 .69-.31.69-.69V7.98zm2.83-.69h-.59c-.38 0-.69.31-.69.69v.59c0 .38.31.69.69.69h.59c.38 0 .69-.31.69-.69v-.59a.695.695 0 0 0-.69-.69zm0 2.06h-.59c-.38 0-.69.31-.69.69v.59c0 .38.31.69.69.69h.59c.38 0 .69-.31.69-.69v-.59a.695.695 0 0 0-.69-.69zM3.54 20.43c1.25.22 3.64.39 6.49.39 2.71 0 5.46-.15 6.95-.41a.69.69 0 0 0 .56-.69c0-.39-.3-.66-.56-.69-1.48-.26-3.52-.42-5.95-.42-2.28 0-5.02.14-6.4.4-.34.06-.65.33-.65.72 0 .34.27.63.56.7z" fill="#FF9900" />
    </svg>
  );
  
  const EtsyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M6.547 8.96c0-.47-.37-.733-.733-.733-.362 0-.733.263-.733.733 0 .47.371.733.733.733.363 0 .733-.263.733-.733zm11.88-4.36c0-2.123-.326-2.42-3.637-2.42H7.21C3.9 2.18 3.574 2.477 3.574 4.6v2.662h13.528c1.324 0 1.514-.215 1.612-1.389H22V11.7h-3.299c-.95-1.095-1.227-1.244-3.166-1.244h-3.91c-1.841 0-2.257.412-2.257 2.156v2.31c0 1.842.478 2.081 2.166 2.081h3.91c2.033 0 2.326-.137 3.258-1.243H22v5.76h-3.286c-.098-1.174-.288-1.39-1.612-1.39H3.573v2.663c0 2.123.326 2.42 3.637 2.42h8.58c3.31 0 3.636-.297 3.636-2.42V4.6z" fill="#F16521" />
    </svg>
  );
  
  const EbayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M1.41 12.294c-.69-.799-1.013-1.96-1.013-3.485 0-2.285.669-3.9 2.008-4.846.917-.643 2.324-.967 4.221-.967h7.13V6.36c0 .936-.187 1.622-.56 2.057-.426.49-1.291.715-2.666.715h-4.42l-.138.072.014 2.07h4.544c1.817 0 3.097-.231 3.842-.692.804-.499 1.295-1.38 1.463-2.646.024-.19.036-.656.036-1.403V.06L15.803 0c-3.026 0-5.13.293-6.313.878C7.876 1.608 6.715 2.85 6.213 4.605c-.154.539-.232 1.124-.232 1.753v.462H8.44a2.305 2.305 0 0 0-.014-.26c0-.681.154-1.205.462-1.571.426-.514 1.227-.771 2.405-.771h2.777v2.103c0 .899-.256 1.518-.771 1.861-.426.282-1.245.424-2.457.424h-2.33c-1.88 0-3.061.47-3.553 1.411-.138.272-.209.583-.209.935 0 .244.018.481.053.713l-3.361.63zm12.646 5.651h2.697v-.036c-.072-.96-.282-1.668-.63-2.125-.534-.715-1.435-1.071-2.706-1.071h-4.8c-.78 0-1.322-.125-1.63-.377-.192-.155-.287-.395-.287-.715 0-.593.341-.889 1.023-.889h7.267l.138-.072v-2.07h-7.405c-1.024 0-1.773.246-2.246.74-.473.494-.71 1.194-.71 2.1 0 1.122.317 1.906.954 2.352.534.372 1.435.557 2.705.557h4.579c.772 0 1.28.138 1.525.412.16.179.241.479.241.9 0 .707-.366 1.06-1.095 1.06h-7.622l-.138.072v2.07h7.76c1.226 0 2.112-.258 2.658-.773.547-.515.818-1.278.818-2.286v-.563h-2.696v.714zm9.944.81h-3.877V5.598l-2.696.329v2.69h2.696v7.328c0 2.05.954 3.073 2.863 3.073.367 0 .691-.018.973-.053a7.053 7.053 0 0 0 .877-.162l.072-.018v-2.21l-.138.071c-.126.066-.262.12-.408.162a1.61 1.61 0 0 1-.462.072c-.473 0-.78-.107-.919-.318-.132-.211-.197-.655-.197-1.33v-6.545h1.216V5.597l-1.216.055V.06h-2.697v6.557h1.216v12.138z" fill="#E53238" />
    </svg>
  );
  
  const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 4.74 2.754 8.83 6.75 10.73-.09-.756-.171-1.914.036-2.736.188-.702 1.21-4.467 1.21-4.467s-.309-.619-.309-1.538c0-1.438.833-2.512 1.87-2.512.882 0 1.308.66 1.308 1.449 0 .884-.563 2.21-.853 3.433-.241 1.028.516 1.863 1.525 1.863 1.83 0 3.234-1.913 3.234-4.681 0-2.45-1.758-4.167-4.271-4.167-2.914 0-4.624 2.19-4.624 4.458 0 .884.343 1.835.788 2.353a.32.32 0 0 1 .075.308c-.08.315-.261 1.005-.297 1.142-.045.193-.152.234-.348.141-1.302-.629-2.111-2.616-2.111-4.21 0-3.39 2.467-6.503 7.117-6.503 3.744 0 6.653 2.673 6.653 6.245 0 3.725-2.354 6.717-5.618 6.717-1.095 0-2.125-.567-2.476-1.236l-.673 2.56a15.087 15.087 0 0 1-1.65 3.46c1.225.376 2.525.58 3.877.58 6.62 0 11.988-5.368 11.988-11.988C24.005 5.367 18.638 0 12.017 0z" fill="#E60023" />
    </svg>
  );
  
  const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#000000" />
    </svg>
  );
  
  const SnapchatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.359-1.275.975-3.225 1.125-.046.164-.105.449-.15.689-.045.285-.09.54-.165.78-.135.405-.585.705-1.215.705-.195 0-.42-.03-.689-.075-.441-.091-1.064-.151-1.754-.165-.645.015-1.334.09-1.965.27-1.155.33-1.969 1.09-2.61 1.679-.75.016-.15.031-.225.031-.48 0-.976-.275-1.215-.705a9.627 9.627 0 0 1-.158-.78c-.045-.24-.105-.525-.149-.689-1.949-.149-2.984-.766-3.224-1.125a.678.678 0 0 1-.05-.225c-.014-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.449-.884-.674-1.333-.809-.134-.045-.255-.09-.339-.12-.824-.328-1.228-.719-1.213-1.167 0-.359.285-.69.734-.838.149-.06.33-.09.508-.09.136 0 .3.015.465.104.375.18.735.284 1.034.3.194 0 .325-.044.4-.089-.008-.165-.017-.33-.03-.51l-.003-.06c-.103-1.628-.226-3.654.3-4.847C7.857 1.082 11.216.793 12.206.793z" fill="#FFFC00" />
    </svg>
  );
  
  const MicrosoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M0 0v11.408h11.408V0zm12.594 0v11.408H24V0zM0 12.594V24h11.408V12.594zm12.594 0V24H24V12.594z" fill="#00A4EF" />
    </svg>
  );
  
  const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000" />
    </svg>
  );
  
  // Platform name formatter
  const formatPlatformName = (platform: AdPlatform) => {
    switch (platform) {
      case AdPlatform.GOOGLE:
        return 'Google Ads';
      case AdPlatform.FACEBOOK:
        return 'Facebook Ads';
      case AdPlatform.INSTAGRAM:
        return 'Instagram Ads';
      case AdPlatform.TWITTER:
        return 'Twitter Ads';
      case AdPlatform.LINKEDIN:
        return 'LinkedIn Ads';
      case AdPlatform.AMAZON:
        return 'Amazon Ads';
      case AdPlatform.ETSY:
        return 'Etsy Ads';
      case AdPlatform.EBAY:
        return 'eBay Ads';
      case AdPlatform.PINTEREST:
        return 'Pinterest Ads';
      case AdPlatform.TIKTOK:
        return 'TikTok Ads';
      case AdPlatform.SNAPCHAT:
        return 'Snapchat Ads';
      case AdPlatform.MICROSOFT:
        return 'Microsoft Ads';
      case AdPlatform.YOUTUBE:
        return 'YouTube Ads';
      default:
        return 'Other Platform';
    }
  };
  
  // Calculate metrics
  const calculateMetrics = () => {
    const totalSpend = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spendToDate, 0);
    const totalClicks = filteredCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
    const totalImpressions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
    const totalConversions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
    const totalConversionValue = filteredCampaigns.reduce((sum, campaign) => sum + campaign.conversionValue, 0);
    
    const ctr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const conversionRate = totalClicks > 0 ? totalConversions / totalClicks : 0;
    const roas = totalSpend > 0 ? totalConversionValue / totalSpend : 0;
    
    return {
      totalSpend,
      totalClicks,
      totalImpressions,
      totalConversions,
      totalConversionValue,
      ctr,
      cpc,
      conversionRate,
      roas
    };
  };
  
  const metrics = calculateMetrics();
  
  // Spending by platform
  const getSpendByPlatform = () => {
    const platformSpend: Record<string, number> = {};
    
    filteredCampaigns.forEach(campaign => {
      const platform = campaign.platform;
      if (!platformSpend[platform]) {
        platformSpend[platform] = 0;
      }
      platformSpend[platform] += campaign.spendToDate;
    });
    
    return Object.entries(platformSpend)
      .map(([platform, spend]) => ({
        platform: platform as AdPlatform,
        spend
      }))
      .sort((a, b) => b.spend - a.spend);
  };
  
  const platformSpend = getSpendByPlatform();
  
  // Performance by campaign objective
  const getPerformanceByObjective = () => {
    const objectiveData: Record<string, { spend: number, conversions: number, value: number }> = {};
    
    filteredCampaigns.forEach(campaign => {
      const objective = campaign.objective;
      if (!objectiveData[objective]) {
        objectiveData[objective] = { spend: 0, conversions: 0, value: 0 };
      }
      objectiveData[objective].spend += campaign.spendToDate;
      objectiveData[objective].conversions += campaign.conversions;
      objectiveData[objective].value += campaign.conversionValue;
    });
    
    return Object.entries(objectiveData)
      .map(([objective, data]) => ({
        objective,
        spend: data.spend,
        conversions: data.conversions,
        value: data.value,
        roas: data.spend > 0 ? data.value / data.spend : 0
      }))
      .sort((a, b) => b.spend - a.spend);
  };
  
  const objectivePerformance = getPerformanceByObjective();
  
  // Calculate recommended budget based on business size and goals
  const getRecommendedBudget = () => {
    // This would ideally be calculated based on business size, goals, industry, etc.
    // For demonstration purposes, we'll return a simple recommendation
    return {
      platforms: [
        { platform: AdPlatform.GOOGLE, dailyBudget: 50, monthlyBudget: 1500 },
        { platform: AdPlatform.FACEBOOK, dailyBudget: 35, monthlyBudget: 1050 },
        { platform: AdPlatform.INSTAGRAM, dailyBudget: 30, monthlyBudget: 900 },
        { platform: AdPlatform.AMAZON, dailyBudget: 40, monthlyBudget: 1200 },
      ],
      totalDaily: 155,
      totalMonthly: 4650
    };
  };
  
  const recommendedBudget = getRecommendedBudget();
  
  // Generate keywords chart data
  const getKeywordPerformanceData = () => {
    return filteredKeywords
      .filter(k => k.impressions > 0)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
      .map(keyword => ({
        keyword: keyword.keyword,
        clicks: keyword.clicks,
        impressions: keyword.impressions,
        ctr: keyword.ctr,
        cost: keyword.cost,
        conversions: keyword.conversions
      }));
  };
  
  const keywordPerformanceData = getKeywordPerformanceData();
  
  // Get campaign by id
  const getCampaignById = (id: string) => {
    return campaigns.find(campaign => campaign.id === id);
  };
  
  // Get ad group by id
  const getAdGroupById = (id: string) => {
    let foundAdGroup: AdGroup | undefined;
    
    campaigns.forEach(campaign => {
      const adGroup = campaign.adGroups.find(group => group.id === id);
      if (adGroup) {
        foundAdGroup = adGroup;
      }
    });
    
    return foundAdGroup;
  };
  
  // Get roadmap by platform
  const getRoadmapByPlatform = (platform: AdPlatform) => {
    return filteredRoadmaps.find(roadmap => roadmap.platform === platform);
  };
  
  // Handle keyword recommendation generation
  const handleGenerateRecommendations = async () => {
    if (selectedEntity === 'all') {
      toast({
        title: "Entity required",
        description: "Please select a specific business entity before generating recommendations.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingRecommendations(true);
    
    try {
      if (onGenerateRecommendations) {
        await onGenerateRecommendations(selectedEntity as number, selectedPlatform || undefined);
        
        toast({
          title: "Recommendations generated",
          description: "Keyword recommendations have been successfully generated.",
        });
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate keyword recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };
  
  // Handle creating a roadmap
  const handleCreateRoadmap = async (platform: AdPlatform) => {
    if (selectedEntity === 'all') {
      toast({
        title: "Entity required",
        description: "Please select a specific business entity before creating a roadmap.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (onCreateRoadmap) {
        const roadmap = await onCreateRoadmap(platform, selectedEntity as number);
        
        toast({
          title: "Roadmap created",
          description: `The roadmap for ${formatPlatformName(platform)} has been created.`,
        });
        
        setSelectedRoadmap(roadmap.id);
      }
    } catch (error) {
      toast({
        title: "Creation failed",
        description: "Failed to create the platform roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update roadmap step completion status
  const handleUpdateRoadmapStep = async (roadmapId: string, stepId: string, isCompleted: boolean) => {
    try {
      if (onUpdateRoadmapStep) {
        await onUpdateRoadmapStep(roadmapId, stepId, isCompleted);
        
        toast({
          title: isCompleted ? "Step completed" : "Step uncompleted",
          description: `The roadmap step has been ${isCompleted ? 'completed' : 'marked as incomplete'}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update the roadmap step. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/40 backdrop-blur-sm shadow-sm rounded-lg p-4 sticky top-2 z-10 border border-border/10">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Advertising Management</h2>
          </div>
          <p className="text-muted-foreground">
            Track, manage, and optimize your advertising campaigns across multiple platforms
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
            onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : parseInt(value))}
          >
            <SelectTrigger className="w-[180px] border border-border/50 bg-background/80">
              <BuildingIcon className="h-4 w-4 mr-2 text-muted-foreground" />
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
          
          <Button 
            variant="outline" 
            onClick={() => setIsConnectingAccount(true)}
            className="bg-background/80 border-border/50 hover:bg-background transition-colors"
          >
            <Link2Icon className="mr-2 h-4 w-4 text-blue-500" />
            Connect Ad Account
          </Button>
          
          <Button 
            onClick={() => setIsCreatingCampaign(true)} 
            className="shadow-sm group transition-all duration-300 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            Create Campaign
          </Button>
        </div>
      </div>
      
      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 p-1">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
            <BarChart2 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
            <LineChartIcon className="h-4 w-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
            <Tag className="h-4 w-4" />
            <span>Keywords</span>
          </TabsTrigger>
          <TabsTrigger value="roadmaps" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
            <Rocket className="h-4 w-4" />
            <span>Roadmaps</span>
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md transition-all">
            <Eye className="h-4 w-4" />
            <span>Competitors</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Top metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                      <DollarSignIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>Total Ad Spend</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{formatCurrency(metrics.totalSpend)}</div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+12.5%</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" />
                    <span>Updated {formatDate(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full"></div>
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
                      <MousePointerClickIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <span>Clicks</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{formatNumber(metrics.totalClicks)}</div>
                <div className="flex items-center justify-between gap-1 mt-2 text-xs">
                  <div className="flex items-center">
                    <span className="font-medium">CTR:</span> 
                    <span className="ml-1">{formatPercentage(metrics.ctr)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">CPC:</span> 
                    <span className="ml-1">{formatCurrency(metrics.cpc)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" />
                    <span>Updated {formatDate(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-bl-full"></div>
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10">
                      <ShoppingBag className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Conversions</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{formatNumber(metrics.totalConversions)}</div>
                <div className="flex items-center justify-between gap-1 mt-2 text-xs">
                  <div className="flex items-center">
                    <span className="font-medium">Rate:</span> 
                    <span className="ml-1">{formatPercentage(metrics.conversionRate)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Value:</span> 
                    <span className="ml-1">{formatCurrency(metrics.totalConversionValue)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" />
                    <span>Updated {formatDate(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-full"></div>
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10">
                      <ArrowDownUp className="h-4 w-4 text-purple-500" />
                    </div>
                    <span>ROAS</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight flex items-baseline">
                  {metrics.roas.toFixed(2)}
                  <span className="text-muted-foreground text-sm ml-1">x</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <div className="flex items-center">
                    <span className="font-medium">Revenue:</span> 
                    <span className="ml-1">{formatCurrency(metrics.totalConversionValue)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin-slow" />
                    <span>Updated {formatDate(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Platform spend and campaign objective cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10">
                    <PieChart className="h-4 w-4 text-cyan-500" />
                  </div>
                  <CardTitle>Spend by Platform</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {platformSpend.length === 0 ? (
                  <div className="text-center py-6">
                    <PieChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No platform spend data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {platformSpend.map(({ platform, spend }) => (
                      <div key={platform} className="space-y-2 px-2 py-2 rounded-lg hover:bg-accent/20 transition-colors">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/60">
                              {getPlatformIcon(platform)}
                            </div>
                            <span className="font-medium">{formatPlatformName(platform)}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-semibold">{formatCurrency(spend)}</span>
                            <span className="text-xs text-muted-foreground">
                              {((spend / metrics.totalSpend) * 100).toFixed(1)}% of total
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={(spend / metrics.totalSpend) * 100} 
                          className="h-1.5 bg-muted/30"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10">
                    <BarChart3 className="h-4 w-4 text-amber-500" />
                  </div>
                  <CardTitle>Performance by Objective</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {objectivePerformance.length === 0 ? (
                  <div className="text-center py-6">
                    <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No performance data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {objectivePerformance.map(({ objective, spend, conversions, value, roas }) => (
                      <div key={objective} className="px-2 py-3 rounded-lg hover:bg-accent/20 transition-colors border-l-2 border-l-primary/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {objective.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </span>
                          <Badge 
                            variant={roas >= 2 ? "default" : roas >= 1 ? "outline" : "destructive"}
                            className="ml-2 font-semibold"
                          >
                            ROAS: {roas.toFixed(2)}x
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex flex-col items-start bg-muted/20 rounded-md p-1.5">
                            <span className="text-xs text-muted-foreground">Spend</span>
                            <span className="font-medium">{formatCurrency(spend)}</span>
                          </div>
                          <div className="flex flex-col items-start bg-muted/20 rounded-md p-1.5">
                            <span className="text-xs text-muted-foreground">Conversions</span>
                            <span className="font-medium">{formatNumber(conversions)}</span>
                          </div>
                          <div className="flex flex-col items-start bg-muted/20 rounded-md p-1.5">
                            <span className="text-xs text-muted-foreground">Revenue</span>
                            <span className="font-medium">{formatCurrency(value)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Budget recommendations and top performing keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10">
                    <DollarSignIcon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle>Budget Recommendations</CardTitle>
                    <CardDescription>
                      Suggested budget allocation across platforms
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedBudget.platforms.map((rec) => (
                    <div key={rec.platform} className="space-y-2 px-2 py-2 rounded-lg hover:bg-accent/20 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/60">
                            {getPlatformIcon(rec.platform)}
                          </div>
                          <span className="font-medium">{formatPlatformName(rec.platform)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold">{formatCurrency(rec.monthlyBudget)}</span>
                          <span className="text-xs text-muted-foreground">monthly</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Daily: {formatCurrency(rec.dailyBudget)}</span>
                        <span>{Math.round((rec.monthlyBudget / recommendedBudget.totalMonthly) * 100)}% of total</span>
                      </div>
                      <Progress 
                        value={(rec.monthlyBudget / recommendedBudget.totalMonthly) * 100} 
                        className="h-1.5 bg-muted/30"
                      />
                    </div>
                  ))}
                  
                  <div className="pt-3 mt-2 border-t border-border/30 px-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Recommended Budget</span>
                      <span>{formatCurrency(recommendedBudget.totalMonthly)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Daily budget across all platforms</span>
                      <span>{formatCurrency(recommendedBudget.totalDaily)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10">
                    <Tag className="h-4 w-4 text-emerald-500" />
                  </div>
                  <CardTitle>Top Performing Keywords</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {keywordPerformanceData.length === 0 ? (
                  <div className="text-center py-6">
                    <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No keyword performance data available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {keywordPerformanceData.map((data) => (
                      <div key={data.keyword} className="px-2 py-3 rounded-lg hover:bg-accent/20 transition-colors border-l-2 border-l-emerald-400/30">
                        <div className="font-medium">{data.keyword}</div>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          <div className="flex flex-col justify-center items-center bg-muted/20 rounded-md p-1.5 text-center">
                            <span className="text-xs text-muted-foreground">Clicks</span>
                            <span className="text-sm font-medium">{formatNumber(data.clicks)}</span>
                          </div>
                          <div className="flex flex-col justify-center items-center bg-muted/20 rounded-md p-1.5 text-center">
                            <span className="text-xs text-muted-foreground">Impr.</span>
                            <span className="text-sm font-medium">{formatNumber(data.impressions)}</span>
                          </div>
                          <div className="flex flex-col justify-center items-center bg-muted/20 rounded-md p-1.5 text-center">
                            <span className="text-xs text-muted-foreground">CTR</span>
                            <span className="text-sm font-medium">{formatPercentage(data.ctr)}</span>
                          </div>
                          <div className="flex flex-col justify-center items-center bg-muted/20 rounded-md p-1.5 text-center">
                            <span className="text-xs text-muted-foreground">Conv.</span>
                            <span className="text-sm font-medium">{formatNumber(data.conversions)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Connected platforms */}
          <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full"></div>
            <CardHeader className="relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
                    <Link2Icon className="h-4 w-4 text-blue-500" />
                  </div>
                  <CardTitle>Connected Ad Platforms</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsConnectingAccount(true)}
                  className="bg-background/80 border-border/50 hover:bg-background transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Platform
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredConnections.length === 0 ? (
                <div className="text-center py-8 px-4 bg-muted/10 rounded-lg border border-dashed border-border/50">
                  <Puzzle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-70" />
                  <h3 className="text-lg font-medium mb-1">No ad platforms connected</h3>
                  <p className="text-muted-foreground mb-4 text-sm max-w-md mx-auto">
                    Connect your advertising platforms to track performance and get recommendations in a unified dashboard.
                  </p>
                  <Button 
                    onClick={() => setIsConnectingAccount(true)}
                    className="shadow-sm group transition-all duration-300 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    Connect First Platform
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredConnections.map((connection) => (
                    <div 
                      key={connection.id}
                      className="flex items-center justify-between border border-border/40 rounded-lg p-3 hover:bg-accent/10 transition-colors hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/60">
                          {getPlatformIcon(connection.platform)}
                        </div>
                        <div>
                          <div className="font-medium">{connection.accountName}</div>
                          <div className="text-xs text-muted-foreground">
                            {connection.accountId}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          connection.status === 'connected' ? 'default' : 
                          connection.status === 'error' ? 'destructive' : 
                          'outline'
                        }
                        className="font-medium"
                      >
                        {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select
                value={campaignStatusFilter}
                onValueChange={setCampaignStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={platformFilter}
                onValueChange={setPlatformFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="facebook">Facebook Ads</SelectItem>
                  <SelectItem value="instagram">Instagram Ads</SelectItem>
                  <SelectItem value="amazon">Amazon Ads</SelectItem>
                  <SelectItem value="etsy">Etsy Ads</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
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
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <LineChartIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No campaigns found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns
                      .sort((a, b) => 
                        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                      )
                      .map((campaign) => (
                        <TableRow 
                          key={campaign.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedCampaign(campaign.id)}
                        >
                          <TableCell>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(campaign.startDate)}
                              {campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(campaign.platform)}
                              <span>{formatPlatformName(campaign.platform)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                campaign.status === AdStatus.ACTIVE ? 'default' : 
                                campaign.status === AdStatus.PAUSED ? 'outline' : 
                                campaign.status === AdStatus.SCHEDULED ? 'secondary' :
                                campaign.status === AdStatus.ENDED ? 'outline' :
                                campaign.status === AdStatus.REJECTED ? 'destructive' :
                                campaign.status === AdStatus.DISAPPROVED ? 'destructive' :
                                'outline'
                              }
                            >
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              {formatCurrency(campaign.budget)}
                              <span className="text-xs text-muted-foreground ml-1">
                                / {campaign.budgetType}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {formatCurrency(campaign.spendToDate)}
                              <div className="text-xs text-muted-foreground">
                                {campaign.budget > 0 && 
                                  `${Math.round((campaign.spendToDate / campaign.budget) * 100)}% of budget`
                                }
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Clicks: {formatNumber(campaign.clicks)}</div>
                                <div>Conv: {formatNumber(campaign.conversions)}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>ROAS: {(campaign.conversionValue / (campaign.spendToDate || 1)).toFixed(2)}x</div>
                                <div>CPA: {formatCurrency(campaign.spendToDate / (campaign.conversions || 1))}</div>
                              </div>
                            </div>
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
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <BarChart2 className="mr-2 h-4 w-4" />
                                  Performance
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {campaign.status === AdStatus.ACTIVE ? (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    if (onUpdateCampaign) {
                                      onUpdateCampaign(campaign.id, { status: AdStatus.PAUSED });
                                    }
                                  }}>
                                    <Pause className="mr-2 h-4 w-4" />
                                    Pause
                                  </DropdownMenuItem>
                                ) : campaign.status === AdStatus.PAUSED ? (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    if (onUpdateCampaign) {
                                      onUpdateCampaign(campaign.id, { status: AdStatus.ACTIVE });
                                    }
                                  }}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Resume
                                  </DropdownMenuItem>
                                ) : null}
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
        
        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search keywords..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Match Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="broad">Broad</SelectItem>
                  <SelectItem value="phrase">Phrase</SelectItem>
                  <SelectItem value="exact">Exact</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="no_filter">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Competitor Targeting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_filter">All Keywords</SelectItem>
                  <SelectItem value="competitor">Competitor Targeting Only</SelectItem>
                  <SelectItem value="non_competitor">Non-Competitor Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={handleGenerateRecommendations}
                disabled={isGeneratingRecommendations}
              >
                {isGeneratingRecommendations ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Generate Recommendations
                  </>
                )}
              </Button>
              
              <Button onClick={() => {}}>
                <Plus className="mr-2 h-4 w-4" />
                Add Keywords
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current Keywords</TabsTrigger>
              <TabsTrigger value="recommendations">Keyword Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Match Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bid</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Impressions</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Avg. Pos.</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKeywords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8">
                            <div className="flex flex-col items-center">
                              <Tag className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">No keywords found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredKeywords
                          .sort((a, b) => b.clicks - a.clicks)
                          .map((keyword) => (
                            <TableRow 
                              key={keyword.id}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setSelectedKeyword(keyword.id)}
                            >
                              <TableCell>
                                <div className="font-medium">{keyword.keyword}</div>
                                {keyword.isCompetitorTarget && keyword.competitorName && (
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    <span>Targeting competitor: {keyword.competitorName}</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {keyword.matchType.charAt(0).toUpperCase() + keyword.matchType.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    keyword.status === 'active' ? 'default' : 
                                    keyword.status === 'paused' ? 'outline' : 
                                    'secondary'
                                  }
                                >
                                  {keyword.status.charAt(0).toUpperCase() + keyword.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {keyword.bid ? formatCurrency(keyword.bid) : 'Auto'}
                              </TableCell>
                              <TableCell>
                                {keyword.qualityScore ? (
                                  <div className="flex items-center gap-1">
                                    <Badge 
                                      variant="outline" 
                                      className={`
                                        ${keyword.qualityScore >= 7 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                          keyword.qualityScore >= 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}
                                      `}
                                    >
                                      {keyword.qualityScore} / 10
                                    </Badge>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>{formatNumber(keyword.impressions)}</TableCell>
                              <TableCell>{formatNumber(keyword.clicks)}</TableCell>
                              <TableCell>{formatPercentage(keyword.ctr)}</TableCell>
                              <TableCell>{keyword.position.toFixed(1)}</TableCell>
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
                                      setSelectedKeyword(keyword.id);
                                    }}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {keyword.status === 'active' ? (
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onUpdateKeyword) {
                                          onUpdateKeyword(keyword.id, { status: 'paused' });
                                        }
                                      }}>
                                        <Pause className="mr-2 h-4 w-4" />
                                        Pause
                                      </DropdownMenuItem>
                                    ) : keyword.status === 'paused' ? (
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        if (onUpdateKeyword) {
                                          onUpdateKeyword(keyword.id, { status: 'active' });
                                        }
                                      }}>
                                        <Play className="mr-2 h-4 w-4" />
                                        Activate
                                      </DropdownMenuItem>
                                    ) : null}
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onDeleteKeyword) {
                                          onDeleteKeyword(keyword.id);
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
            
            <TabsContent value="recommendations">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Relevance</TableHead>
                        <TableHead>Search Volume</TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead>Suggested Bid</TableHead>
                        <TableHead>Competitor</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKeywordRecommendations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center">
                              <Tag className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground mb-2">No keyword recommendations available</p>
                              <Button 
                                variant="outline"
                                onClick={handleGenerateRecommendations}
                                disabled={isGeneratingRecommendations}
                              >
                                {isGeneratingRecommendations ? (
                                  <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Rocket className="mr-2 h-4 w-4" />
                                    Generate Recommendations
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredKeywordRecommendations
                          .sort((a, b) => b.relevanceScore - a.relevanceScore)
                          .map((recommendation) => (
                            <TableRow key={recommendation.id}>
                              <TableCell>
                                <div className="font-medium">{recommendation.keyword}</div>
                                <div className="text-xs text-muted-foreground">
                                  Est. traffic: {formatNumber(recommendation.potentialTraffic)} monthly clicks
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Progress 
                                    value={recommendation.relevanceScore} 
                                    className="h-2 w-12"
                                  />
                                  <span className="text-sm">{recommendation.relevanceScore}/100</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatNumber(recommendation.searchVolume)}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    recommendation.competition === 'low' ? 
                                    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                    recommendation.competition === 'medium' ? 
                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                  }
                                >
                                  {recommendation.competition.charAt(0).toUpperCase() + recommendation.competition.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatCurrency(recommendation.recommendedBid)}</TableCell>
                              <TableCell>
                                {recommendation.isCompetitorKeyword ? (
                                  <div className="flex items-center">
                                    <Check className="h-4 w-4 text-green-500 mr-1" />
                                    <div className="text-xs">
                                      {recommendation.competitorNames && recommendation.competitorNames.length > 0 && (
                                        <span>{recommendation.competitorNames[0]}{recommendation.competitorNames.length > 1 ? ` +${recommendation.competitorNames.length - 1}` : ''}</span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">No</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add
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
          </Tabs>
        </TabsContent>
        
        {/* Platform Roadmaps Tab */}
        <TabsContent value="roadmaps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              AdPlatform.GOOGLE,
              AdPlatform.FACEBOOK,
              AdPlatform.INSTAGRAM,
              AdPlatform.AMAZON,
              AdPlatform.ETSY,
              AdPlatform.EBAY,
              AdPlatform.PINTEREST,
              AdPlatform.TIKTOK
            ].map((platform) => {
              const roadmap = getRoadmapByPlatform(platform);
              const isConnected = filteredConnections.some(c => c.platform === platform);
              const completedSteps = roadmap ? roadmap.setupSteps.filter(s => s.isCompleted).length : 0;
              const totalSteps = roadmap ? roadmap.setupSteps.length : 0;
              const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
              
              return (
                <Card 
                  key={platform}
                  className={roadmap ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}
                  onClick={() => roadmap ? setSelectedRoadmap(roadmap.id) : null}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(platform)}
                        <CardTitle className="text-lg">{formatPlatformName(platform)}</CardTitle>
                      </div>
                      {isConnected && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {roadmap ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Setup progress</span>
                          <span>{completedSteps} of {totalSteps} steps</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          Recommended daily budget: {formatCurrency(roadmap.recommendedBudget.daily)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground py-2">
                        No roadmap created yet. Create a roadmap to get started with {formatPlatformName(platform)}.
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    {roadmap ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoadmap(roadmap.id);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Roadmap
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleCreateRoadmap(platform)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Roadmap
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Competitor Analysis Tab */}
        <TabsContent value="competitors" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitors..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="facebook">Facebook Ads</SelectItem>
                  <SelectItem value="instagram">Instagram Ads</SelectItem>
                  <SelectItem value="amazon">Amazon Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Competitor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Competitor Ads</CardTitle>
                <CardDescription>
                  Recent ads from competitors that have been detected
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competitor</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Ad Content</TableHead>
                      <TableHead>Detected</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompetitorAds.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Eye className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No competitor ads detected yet</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompetitorAds
                        .sort((a, b) => 
                          new Date(b.dateDetected).getTime() - new Date(a.dateDetected).getTime()
                        )
                        .slice(0, 5)
                        .map((ad) => (
                          <TableRow key={ad.id}>
                            <TableCell>
                              <div className="font-medium">{ad.competitorName}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPlatformIcon(ad.platform)}
                                <span>{ad.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {ad.headline && (
                                <div className="font-medium">{ad.headline}</div>
                              )}
                              {ad.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {ad.description}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(ad.dateDetected)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
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
            
            <Card>
              <CardHeader>
                <CardTitle>Top Competitor Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredKeywordRecommendations
                  .filter(r => r.isCompetitorKeyword)
                  .length === 0 ? (
                  <div className="text-center py-6">
                    <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-2">No competitor keywords detected</p>
                    <Button 
                      variant="outline"
                      onClick={handleGenerateRecommendations}
                      disabled={isGeneratingRecommendations}
                    >
                      {isGeneratingRecommendations ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Discover Keywords
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredKeywordRecommendations
                      .filter(r => r.isCompetitorKeyword)
                      .sort((a, b) => b.searchVolume - a.searchVolume)
                      .slice(0, 10)
                      .map((keyword) => (
                        <div key={keyword.id} className="flex justify-between items-center pb-2 border-b last:border-0">
                          <div>
                            <div className="font-medium">{keyword.keyword}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div>Vol: {formatNumber(keyword.searchVolume)}</div>
                              <div>Bid: {formatCurrency(keyword.recommendedBid)}</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Campaign Detail Dialog would be implemented here */}
      
      {/* Ad Group Detail Dialog would be implemented here */}
      
      {/* Ad Detail Dialog would be implemented here */}
      
      {/* Keyword Detail Dialog would be implemented here */}
      
      {/* Roadmap Detail Dialog would be implemented here */}
      
      {/* Connect Ad Account Dialog would be implemented here */}
      
      {/* Create Campaign Dialog would be implemented here */}
      
      {/* Create Ad Group Dialog would be implemented here */}
      
      {/* Create Ad Dialog would be implemented here */}
    </div>
  );
};

interface MailOpenProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const MailOpen: React.FC<MailOpenProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/>
      <path d="M3 9l9 6 9-6"/>
    </svg>
  );
};

interface MousePointerClickProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const MousePointerClick: React.FC<MousePointerClickProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="m9 9 5 12 1.8-5.2L21 14Z"/>
      <path d="M7.2 2.2 8 5.1"/>
      <path d="M5.1 7.2 2.2 8"/>
      <path d="M14 4.1 12 6"/>
      <path d="m6 12-1.9 2"/>
    </svg>
  );
};

interface DollarSignProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const DollarSign: React.FC<DollarSignProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <line x1="12" x2="12" y1="2" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
};

interface LineChartProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M3 3v18h18"></path>
      <path d="m19 9-5 5-4-4-3 3"></path>
    </svg>
  );
};

interface TargetProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Target: React.FC<TargetProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
};

interface UploadProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Upload: React.FC<UploadProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" x2="12" y1="3" y2="15"></line>
    </svg>
  );
};

export default AdvertisingManagement;