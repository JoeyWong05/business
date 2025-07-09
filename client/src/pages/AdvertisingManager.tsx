import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import MainLayout from "@/components/MainLayout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  BarChart3,
  Calendar as CalendarIcon,
  ChevronDown,
  Circle,
  Clock,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Filter,
  HelpCircle,
  Info,
  LineChart,
  MoreHorizontal,
  PieChart,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Sparkles,
  Target,
  Trash2,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell
} from "recharts";

import { AdPlatform, AdType, AdStatus, BidStrategy, AdObjective } from "@/components/AdvertisingManagement";

// New ad image type
enum AdImageType {
  STATIC = 'static',
  CAROUSEL = 'carousel',
  VIDEO = 'video',
  COLLECTION = 'collection',
  STORY = 'story',
  REEL = 'reel'
}

// Campaign timeline item
interface CampaignTimelineItem {
  id: string;
  date: Date | string;
  type: 'created' | 'modified' | 'paused' | 'resumed' | 'budget_change' | 'creative_update' | 'performance_alert';
  description: string;
  user?: string;
  metadata?: any;
}

// Campaign with enhanced metrics
interface EnhancedAdCampaign {
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
  revenue?: number; // Attributed revenue
  roi?: number; // Return on investment
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpm: number; // Cost per thousand impressions
  cvr: number; // Conversion rate
  cpa: number; // Cost per acquisition
  roas: number; // Return on ad spend
  adGroups: number; // Count of ad groups
  ads: number; // Count of ads
  createdAt: Date | string;
  updatedAt: Date | string;
  entityId: number;
  entityName: string;
  isAutomated?: boolean;
  automationRules?: any[];
  timeline?: CampaignTimelineItem[];
  tags?: string[];
  performance?: {
    trend: 'up' | 'down' | 'stable';
    percentChange: number;
    timeFrame: '24h' | '7d' | '30d';
  };
  // Historical data for trends
  dailyStats?: {
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue?: number;
  }[];
}

// Platform summary
interface PlatformSummary {
  platform: AdPlatform;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roas: number;
  campaigns: number;
}

// Enhanced Creative Asset
interface CreativeAsset {
  id: string;
  name: string;
  type: AdImageType;
  url: string;
  thumbnailUrl: string;
  aspectRatio: string;
  platform: AdPlatform;
  status: 'active' | 'inactive' | 'pending_review' | 'rejected';
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    conversionRate: number;
    score: number; // 1-10 performance score
  };
  usedInAds: string[]; // Ad IDs
  createdAt: Date | string;
  tags: string[];
}

// Type for analytics tab
type AdvertisingTabType = "campaigns" | "performance" | "insights" | "creative" | "automation";
type CampaignStatus = "all" | "active" | "paused" | "scheduled";
type DateRange = "today" | "yesterday" | "7d" | "30d" | "mtd" | "custom";
type CampaignPerformance = "all" | "high" | "medium" | "low";
type CampaignMetricView = "simple" | "detailed" | "full";

// Sample data for campaigns
const sampleCampaigns: EnhancedAdCampaign[] = [
  {
    id: "camp1",
    name: "Summer Collection Launch",
    platform: AdPlatform.FACEBOOK,
    status: AdStatus.ACTIVE,
    objective: AdObjective.CONVERSIONS,
    budget: 125.00,
    budgetType: 'daily',
    startDate: "2025-03-01",
    targetROAS: 4.5,
    bidStrategy: BidStrategy.TARGET_ROAS,
    spendToDate: 3750.00,
    impressions: 425000,
    clicks: 8500,
    conversions: 340,
    conversionValue: 16875.00,
    revenue: 16875.00,
    roi: 4.5,
    ctr: 2.0,
    cpc: 0.44,
    cpm: 8.82,
    cvr: 4.0,
    cpa: 11.03,
    roas: 4.5,
    adGroups: 5,
    ads: 15,
    createdAt: "2025-02-25",
    updatedAt: "2025-03-20",
    entityId: 3,
    entityName: "Lone Star Custom Clothing",
    isAutomated: true,
    automationRules: [
      { type: "budget_adjustment", condition: "roas < 3", action: "decrease_budget_10_percent" },
      { type: "status_change", condition: "spend > 5000", action: "pause_campaign" }
    ],
    tags: ["summer", "collection", "high_performer"],
    performance: {
      trend: "up",
      percentChange: 15.3,
      timeFrame: "7d"
    },
    dailyStats: [
      { date: "2025-03-14", spend: 125, impressions: 15000, clicks: 300, conversions: 12, revenue: 600 },
      { date: "2025-03-15", spend: 125, impressions: 14200, clicks: 285, conversions: 11, revenue: 550 },
      { date: "2025-03-16", spend: 125, impressions: 13800, clicks: 290, conversions: 10, revenue: 500 },
      { date: "2025-03-17", spend: 125, impressions: 15500, clicks: 310, conversions: 13, revenue: 650 },
      { date: "2025-03-18", spend: 125, impressions: 16200, clicks: 325, conversions: 14, revenue: 700 },
      { date: "2025-03-19", spend: 125, impressions: 16800, clicks: 335, conversions: 15, revenue: 750 },
      { date: "2025-03-20", spend: 125, impressions: 17500, clicks: 350, conversions: 16, revenue: 800 }
    ]
  },
  {
    id: "camp2",
    name: "Loyalty Program Promotion",
    platform: AdPlatform.GOOGLE,
    status: AdStatus.ACTIVE,
    objective: AdObjective.CONVERSIONS,
    budget: 85.00,
    budgetType: 'daily',
    startDate: "2025-03-05",
    targetCPA: 18.00,
    bidStrategy: BidStrategy.TARGET_CPA,
    spendToDate: 1360.00,
    impressions: 178000,
    clicks: 5340,
    conversions: 160,
    conversionValue: 8000.00,
    revenue: 8000.00,
    roi: 5.88,
    ctr: 3.0,
    cpc: 0.25,
    cpm: 7.64,
    cvr: 3.0,
    cpa: 8.50,
    roas: 5.88,
    adGroups: 3,
    ads: 9,
    createdAt: "2025-03-01",
    updatedAt: "2025-03-20",
    entityId: 3,
    entityName: "Lone Star Custom Clothing",
    tags: ["loyalty", "existing_customers"],
    performance: {
      trend: "up",
      percentChange: 8.7,
      timeFrame: "7d"
    },
    dailyStats: [
      { date: "2025-03-14", spend: 85, impressions: 11000, clicks: 330, conversions: 10, revenue: 500 },
      { date: "2025-03-15", spend: 85, impressions: 11200, clicks: 335, conversions: 10, revenue: 500 },
      { date: "2025-03-16", spend: 85, impressions: 11300, clicks: 340, conversions: 10, revenue: 500 },
      { date: "2025-03-17", spend: 85, impressions: 11500, clicks: 345, conversions: 10, revenue: 500 },
      { date: "2025-03-18", spend: 85, impressions: 11800, clicks: 350, conversions: 11, revenue: 550 },
      { date: "2025-03-19", spend: 85, impressions: 12000, clicks: 360, conversions: 11, revenue: 550 },
      { date: "2025-03-20", spend: 85, impressions: 12500, clicks: 375, conversions: 12, revenue: 600 }
    ]
  },
  {
    id: "camp3",
    name: "Spring Menu Showcase",
    platform: AdPlatform.INSTAGRAM,
    status: AdStatus.ACTIVE,
    objective: AdObjective.ENGAGEMENT,
    budget: 60.00,
    budgetType: 'daily',
    startDate: "2025-03-10",
    bidStrategy: BidStrategy.MAXIMIZE_CONVERSIONS,
    spendToDate: 660.00,
    impressions: 98000,
    clicks: 2940,
    conversions: 88,
    conversionValue: 2640.00,
    revenue: 2640.00,
    roi: 4.0,
    ctr: 3.0,
    cpc: 0.22,
    cpm: 6.73,
    cvr: 3.0,
    cpa: 7.50,
    roas: 4.0,
    adGroups: 2,
    ads: 6,
    createdAt: "2025-03-08",
    updatedAt: "2025-03-20",
    entityId: 5,
    entityName: "Hide Cafe Bars",
    tags: ["spring", "menu", "food"],
    performance: {
      trend: "stable",
      percentChange: 1.2,
      timeFrame: "7d"
    },
    dailyStats: [
      { date: "2025-03-14", spend: 60, impressions: 8200, clicks: 245, conversions: 7, revenue: 210 },
      { date: "2025-03-15", spend: 60, impressions: 8300, clicks: 250, conversions: 8, revenue: 240 },
      { date: "2025-03-16", spend: 60, impressions: 8100, clicks: 245, conversions: 7, revenue: 210 },
      { date: "2025-03-17", spend: 60, impressions: 8400, clicks: 255, conversions: 8, revenue: 240 },
      { date: "2025-03-18", spend: 60, impressions: 8500, clicks: 255, conversions: 8, revenue: 240 },
      { date: "2025-03-19", spend: 60, impressions: 8600, clicks: 260, conversions: 8, revenue: 240 },
      { date: "2025-03-20", spend: 60, impressions: 8700, clicks: 265, conversions: 9, revenue: 270 }
    ]
  },
  {
    id: "camp4",
    name: "New Craft Beer Collection",
    platform: AdPlatform.FACEBOOK,
    status: AdStatus.PAUSED,
    objective: AdObjective.CATALOG_SALES,
    budget: 75.00,
    budgetType: 'daily',
    startDate: "2025-02-20",
    endDate: "2025-03-18",
    bidStrategy: BidStrategy.MAXIMIZE_CONVERSION_VALUE,
    spendToDate: 1950.00,
    impressions: 212000,
    clicks: 6360,
    conversions: 159,
    conversionValue: 7950.00,
    revenue: 7950.00,
    roi: 4.08,
    ctr: 3.0,
    cpc: 0.31,
    cpm: 9.20,
    cvr: 2.5,
    cpa: 12.26,
    roas: 4.08,
    adGroups: 4,
    ads: 12,
    createdAt: "2025-02-18",
    updatedAt: "2025-03-18",
    entityId: 4,
    entityName: "Alcoeaze",
    tags: ["beer", "craft", "collection"],
    performance: {
      trend: "down",
      percentChange: -5.8,
      timeFrame: "7d"
    },
    dailyStats: [
      { date: "2025-03-12", spend: 75, impressions: 9100, clicks: 275, conversions: 7, revenue: 350 },
      { date: "2025-03-13", spend: 75, impressions: 9000, clicks: 270, conversions: 7, revenue: 350 },
      { date: "2025-03-14", spend: 75, impressions: 8800, clicks: 265, conversions: 6, revenue: 300 },
      { date: "2025-03-15", spend: 75, impressions: 8700, clicks: 260, conversions: 6, revenue: 300 },
      { date: "2025-03-16", spend: 75, impressions: 8600, clicks: 255, conversions: 6, revenue: 300 },
      { date: "2025-03-17", spend: 75, impressions: 8500, clicks: 255, conversions: 6, revenue: 300 },
      { date: "2025-03-18", spend: 75, impressions: 8300, clicks: 250, conversions: 5, revenue: 250 }
    ]
  },
  {
    id: "camp5",
    name: "March Mystery Boxes",
    platform: AdPlatform.TIKTOK,
    status: AdStatus.SCHEDULED,
    objective: AdObjective.CONVERSIONS,
    budget: 100.00,
    budgetType: 'daily',
    startDate: "2025-03-25",
    bidStrategy: BidStrategy.MAXIMIZE_CONVERSIONS,
    spendToDate: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    conversionValue: 0,
    ctr: 0,
    cpc: 0,
    cpm: 0,
    cvr: 0,
    cpa: 0,
    roas: 0,
    adGroups: 2,
    ads: 8,
    createdAt: "2025-03-18",
    updatedAt: "2025-03-18",
    entityId: 2,
    entityName: "Mystery Hype",
    tags: ["mystery", "boxes", "promotion"],
    performance: {
      trend: "stable",
      percentChange: 0,
      timeFrame: "7d"
    }
  }
];

// Sample platform summaries
const platformSummaries: PlatformSummary[] = [
  {
    platform: AdPlatform.FACEBOOK,
    spend: 5700.00,
    impressions: 637000,
    clicks: 14860,
    conversions: 499,
    revenue: 24825.00,
    roas: 4.36,
    campaigns: 2
  },
  {
    platform: AdPlatform.GOOGLE,
    spend: 1360.00,
    impressions: 178000,
    clicks: 5340,
    conversions: 160,
    revenue: 8000.00,
    roas: 5.88,
    campaigns: 1
  },
  {
    platform: AdPlatform.INSTAGRAM,
    spend: 660.00,
    impressions: 98000,
    clicks: 2940,
    conversions: 88,
    revenue: 2640.00,
    roas: 4.00,
    campaigns: 1
  },
  {
    platform: AdPlatform.TIKTOK,
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    roas: 0,
    campaigns: 1
  }
];

// Creative assets
const creativeAssets: CreativeAsset[] = [
  {
    id: "asset1",
    name: "Summer T-shirt Collection",
    type: AdImageType.CAROUSEL,
    url: "https://example.com/assets/summer-tshirt.jpg",
    thumbnailUrl: "https://example.com/assets/summer-tshirt-thumb.jpg",
    aspectRatio: "1:1",
    platform: AdPlatform.FACEBOOK,
    status: 'active',
    performance: {
      impressions: 215000,
      clicks: 4300,
      ctr: 2.0,
      conversions: 172,
      conversionRate: 4.0,
      score: 8.5
    },
    usedInAds: ["ad1", "ad2", "ad3"],
    createdAt: "2025-02-25",
    tags: ["summer", "collection", "carousel"]
  },
  {
    id: "asset2",
    name: "Loyalty Program Promo Video",
    type: AdImageType.VIDEO,
    url: "https://example.com/assets/loyalty-video.mp4",
    thumbnailUrl: "https://example.com/assets/loyalty-video-thumb.jpg",
    aspectRatio: "16:9",
    platform: AdPlatform.GOOGLE,
    status: 'active',
    performance: {
      impressions: 178000,
      clicks: 5340,
      ctr: 3.0,
      conversions: 160,
      conversionRate: 3.0,
      score: 9.2
    },
    usedInAds: ["ad4", "ad5"],
    createdAt: "2025-03-01",
    tags: ["loyalty", "video", "promotion"]
  },
  {
    id: "asset3",
    name: "Spring Menu Items",
    type: AdImageType.CAROUSEL,
    url: "https://example.com/assets/spring-menu.jpg",
    thumbnailUrl: "https://example.com/assets/spring-menu-thumb.jpg",
    aspectRatio: "4:5",
    platform: AdPlatform.INSTAGRAM,
    status: 'active',
    performance: {
      impressions: 98000,
      clicks: 2940,
      ctr: 3.0,
      conversions: 88,
      conversionRate: 3.0,
      score: 8.8
    },
    usedInAds: ["ad6", "ad7"],
    createdAt: "2025-03-08",
    tags: ["food", "menu", "spring"]
  },
  {
    id: "asset4",
    name: "Craft Beer Collection",
    type: AdImageType.COLLECTION,
    url: "https://example.com/assets/craft-beer.jpg",
    thumbnailUrl: "https://example.com/assets/craft-beer-thumb.jpg",
    aspectRatio: "1:1",
    platform: AdPlatform.FACEBOOK,
    status: 'active',
    performance: {
      impressions: 212000,
      clicks: 6360,
      ctr: 3.0,
      conversions: 159,
      conversionRate: 2.5,
      score: 7.6
    },
    usedInAds: ["ad8", "ad9", "ad10"],
    createdAt: "2025-02-18",
    tags: ["beer", "collection", "product"]
  },
  {
    id: "asset5",
    name: "Mystery Box Reveal",
    type: AdImageType.REEL,
    url: "https://example.com/assets/mystery-box.mp4",
    thumbnailUrl: "https://example.com/assets/mystery-box-thumb.jpg",
    aspectRatio: "9:16",
    platform: AdPlatform.TIKTOK,
    status: 'pending_review',
    usedInAds: ["ad11", "ad12"],
    createdAt: "2025-03-18",
    tags: ["mystery", "box", "reel", "unboxing"]
  }
];

export default function AdvertisingManager() {
  const [activeTab, setActiveTab] = useState<AdvertisingTabType>("campaigns");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus>("all");
  const [performanceFilter, setPerformanceFilter] = useState<CampaignPerformance>("all");
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [metricView, setMetricView] = useState<CampaignMetricView>("simple");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [newCampaignDialogOpen, setNewCampaignDialogOpen] = useState(false);

  // Fetch campaigns - using mock data for now
  const { data: campaignsData } = useQuery({
    queryKey: ['/api/advertising/campaigns'],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return { campaigns: sampleCampaigns };
    },
  });

  // Fetch platform summaries
  const { data: platformData } = useQuery({
    queryKey: ['/api/advertising/platforms'],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return { platforms: platformSummaries };
    },
  });

  // Fetch creative assets
  const { data: creativesData } = useQuery({
    queryKey: ['/api/advertising/creatives'],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return { creatives: creativeAssets };
    },
  });

  const campaigns = campaignsData?.campaigns || [];
  const platforms = platformData?.platforms || [];
  const creatives = creativesData?.creatives || [];
  
  // Filter campaigns based on search query, status, and platform
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      searchQuery === "" || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && campaign.status === AdStatus.ACTIVE) ||
      (statusFilter === "paused" && campaign.status === AdStatus.PAUSED) ||
      (statusFilter === "scheduled" && campaign.status === AdStatus.SCHEDULED);

    const matchesPlatform = 
      selectedPlatform === "all" || 
      campaign.platform.toString() === selectedPlatform;
      
    const matchesPerformance = 
      performanceFilter === "all" || 
      (performanceFilter === "high" && campaign.roas >= 4) ||
      (performanceFilter === "medium" && campaign.roas >= 2 && campaign.roas < 4) ||
      (performanceFilter === "low" && campaign.roas < 2);
    
    return matchesSearch && matchesStatus && matchesPlatform && matchesPerformance;
  });

  // Platform-specific colors
  const platformColors: { [key in AdPlatform]?: string } = {
    [AdPlatform.FACEBOOK]: "#1877F2",
    [AdPlatform.INSTAGRAM]: "#E1306C",
    [AdPlatform.GOOGLE]: "#4285F4",
    [AdPlatform.TWITTER]: "#1DA1F2",
    [AdPlatform.LINKEDIN]: "#0A66C2",
    [AdPlatform.TIKTOK]: "#000000",
    [AdPlatform.PINTEREST]: "#E60023",
    [AdPlatform.SNAPCHAT]: "#FFFC00",
    [AdPlatform.AMAZON]: "#FF9900",
    [AdPlatform.MICROSOFT]: "#00A4EF",
    [AdPlatform.YOUTUBE]: "#FF0000"
  };

  // Status badges
  const getStatusBadge = (status: AdStatus) => {
    switch(status) {
      case AdStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case AdStatus.PAUSED:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>;
      case AdStatus.SCHEDULED:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case AdStatus.ENDED:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Ended</Badge>;
      case AdStatus.DRAFT:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Draft</Badge>;
      case AdStatus.PENDING_REVIEW:
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending Review</Badge>;
      case AdStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Platform badges
  const getPlatformBadge = (platform: AdPlatform) => {
    const color = platformColors[platform] || "#6E6E6E";
    
    return (
      <Badge 
        variant="outline" 
        className="flex items-center gap-1 font-medium" 
        style={{ borderColor: `${color}30`, background: `${color}10`, color }}
      >
        <Circle className="h-2 w-2" fill={color} />
        {platform}
      </Badge>
    );
  };

  // Overall ad metrics summary
  const overallMetrics = platforms.reduce(
    (acc, platform) => {
      acc.spend += platform.spend;
      acc.impressions += platform.impressions;
      acc.clicks += platform.clicks;
      acc.conversions += platform.conversions;
      acc.revenue += platform.revenue;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );
  
  const overallRoas = overallMetrics.spend > 0 ? overallMetrics.revenue / overallMetrics.spend : 0;
  const overallCtr = overallMetrics.impressions > 0 ? (overallMetrics.clicks / overallMetrics.impressions) * 100 : 0;
  const overallCvr = overallMetrics.clicks > 0 ? (overallMetrics.conversions / overallMetrics.clicks) * 100 : 0;
  const overallCpc = overallMetrics.clicks > 0 ? overallMetrics.spend / overallMetrics.clicks : 0;
  const overallCpm = overallMetrics.impressions > 0 ? (overallMetrics.spend / overallMetrics.impressions) * 1000 : 0;
  const overallCpa = overallMetrics.conversions > 0 ? overallMetrics.spend / overallMetrics.conversions : 0;

  // Format dollar amounts
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format percentages
  const formatPercent = (percent: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(percent / 100);
  };

  // Prepare data for platform comparison chart
  const platformChartData = platforms.map(platform => ({
    name: platform.platform,
    spend: platform.spend,
    revenue: platform.revenue,
    roas: platform.roas,
    color: platformColors[platform.platform as AdPlatform] || "#6E6E6E"
  }));

  // Prepare data for daily spend chart
  const getDailySpendData = () => {
    const dailyData: { [date: string]: { spend: number, revenue: number } } = {};
    
    campaigns.forEach(campaign => {
      if (campaign.dailyStats) {
        campaign.dailyStats.forEach(day => {
          if (!dailyData[day.date]) {
            dailyData[day.date] = { spend: 0, revenue: 0 };
          }
          dailyData[day.date].spend += day.spend;
          dailyData[day.date].revenue += day.revenue || 0;
        });
      }
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      spend: data.spend,
      revenue: data.revenue
    }));
  };

  // Performance metrics chart data
  const performanceMetricsData = [
    { name: 'CTR', value: overallCtr },
    { name: 'CVR', value: overallCvr },
    { name: 'ROAS', value: overallRoas * 100 / 10 } // Scaled for visualization
  ];

  // Get color based on ROAS
  const getRoasColor = (roas: number) => {
    if (roas >= 4) return "text-green-600";
    if (roas >= 2) return "text-amber-600";
    if (roas > 0) return "text-red-600";
    return "text-gray-500";
  };

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable', className: string = "h-4 w-4") => {
    switch(trend) {
      case 'up':
        return <ArrowUp className={`${className} text-green-600`} />;
      case 'down':
        return <ArrowDown className={`${className} text-red-600`} />;
      case 'stable':
        return <ArrowDownUp className={`${className} text-gray-500`} />;
    }
  };

  return (
    <MainLayout title="Advertising Manager" description="Manage your advertising campaigns across all platforms">
      <div className="space-y-6">
        {/* Advanced Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between bg-card rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter as any}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={performanceFilter} onValueChange={setPerformanceFilter as any}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Performance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="high">High (ROAS ≥ 4)</SelectItem>
                <SelectItem value="medium">Medium (ROAS 2-4)</SelectItem>
                <SelectItem value="low">Low (ROAS &lt; 2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Select value={dateRange} onValueChange={setDateRange as any}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="mtd">Month to Date</SelectItem>
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
            
            {dateRange === "custom" && (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[160px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
            
            <Button onClick={() => setNewCampaignDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Ad Spend</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(overallMetrics.spend)}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Across {campaigns.length} campaigns
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <LineChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(overallMetrics.revenue)}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  From {formatNumber(overallMetrics.conversions)} conversions
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getRoasColor(overallRoas)}`}>
                {overallRoas.toFixed(2)}x
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Avg. return on ad spend
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="text-sm font-medium">{formatPercent(overallCtr)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CVR</p>
                  <p className="text-sm font-medium">{formatPercent(overallCvr)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CPC</p>
                  <p className="text-sm font-medium">${overallCpc.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs 
          defaultValue="campaigns" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as AdvertisingTabType)}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="campaigns" className="py-2">
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Campaigns
              </div>
            </TabsTrigger>
            <TabsTrigger value="performance" className="py-2">
              <div className="flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Performance
              </div>
            </TabsTrigger>
            <TabsTrigger value="insights" className="py-2">
              <div className="flex items-center">
                <PieChart className="h-4 w-4 mr-2" />
                Insights
              </div>
            </TabsTrigger>
            <TabsTrigger value="creative" className="py-2">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Creative Assets
              </div>
            </TabsTrigger>
            <TabsTrigger value="automation" className="py-2">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Automation
                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/20">New</Badge>
              </div>
            </TabsTrigger>
          </TabsList>
          
          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Active Campaigns</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* View options */}
            <div className="flex justify-end mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    View Options
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Metric Display</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setMetricView("simple")}>
                    Simple View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMetricView("detailed")}>
                    Detailed View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMetricView("full")}>
                    Full Metrics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Campaigns Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Campaign</TableHead>
                    <TableHead className="w-[100px]">Platform</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    {metricView !== "simple" && (
                      <>
                        <TableHead className="text-right">Conversions</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                      </>
                    )}
                    {metricView === "full" && (
                      <>
                        <TableHead className="text-right">CPC</TableHead>
                        <TableHead className="text-right">CPA</TableHead>
                      </>
                    )}
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={metricView === "simple" ? 7 : metricView === "detailed" ? 9 : 11} className="text-center py-8 text-muted-foreground">
                        No campaigns found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {campaign.adGroups} ad groups • {campaign.ads} ads
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getPlatformBadge(campaign.platform)}</TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(campaign.spendToDate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(campaign.revenue || 0)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {campaign.performance && (
                              getTrendIcon(campaign.performance.trend, "h-3 w-3")
                            )}
                            <span className={getRoasColor(campaign.roas)}>
                              {campaign.roas.toFixed(2)}x
                            </span>
                          </div>
                          {campaign.performance && campaign.performance.percentChange > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {campaign.performance.percentChange > 0 ? "+" : ""}
                              {campaign.performance.percentChange.toFixed(1)}%
                            </div>
                          )}
                        </TableCell>
                        {metricView !== "simple" && (
                          <>
                            <TableCell className="text-right">{formatNumber(campaign.conversions)}</TableCell>
                            <TableCell className="text-right">{formatPercent(campaign.ctr)}</TableCell>
                          </>
                        )}
                        {metricView === "full" && (
                          <>
                            <TableCell className="text-right">${campaign.cpc.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${campaign.cpa.toFixed(2)}</TableCell>
                          </>
                        )}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Platform
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Campaign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Spend & Revenue Chart */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Daily Spend & Revenue</CardTitle>
                  <CardDescription>Track your advertising spend and revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getDailySpendData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C853" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <RechartsTooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="spend" 
                        stroke="#0066FF" 
                        fillOpacity={1} 
                        fill="url(#colorSpend)" 
                        name="Ad Spend"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#00C853" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Platform Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Compare spend and return across platforms</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={platformChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="spend" name="Spend" fill="#0066FF" />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#00C853" />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="roas" 
                        name="ROAS" 
                        stroke="#FF6B00" 
                        strokeWidth={2} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key advertising metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* CTR */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm font-medium">Click-Through Rate (CTR)</div>
                        <div className="text-sm">{formatPercent(overallCtr)}</div>
                      </div>
                      <Progress value={overallCtr} max={10} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Percentage of impressions that resulted in clicks
                      </div>
                    </div>
                    
                    {/* CVR */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm font-medium">Conversion Rate (CVR)</div>
                        <div className="text-sm">{formatPercent(overallCvr)}</div>
                      </div>
                      <Progress value={overallCvr} max={10} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Percentage of clicks that resulted in conversions
                      </div>
                    </div>
                    
                    {/* CPC */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm font-medium">Cost Per Click (CPC)</div>
                        <div className="text-sm">${overallCpc.toFixed(2)}</div>
                      </div>
                      <Progress 
                        value={100 - (overallCpc / 2) * 100} 
                        max={100} 
                        className="h-2" 
                      />
                      <div className="text-xs text-muted-foreground">
                        Average cost for each click
                      </div>
                    </div>
                    
                    {/* CPA */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm font-medium">Cost Per Acquisition (CPA)</div>
                        <div className="text-sm">${overallCpa.toFixed(2)}</div>
                      </div>
                      <Progress 
                        value={100 - (overallCpa / 50) * 100} 
                        max={100} 
                        className="h-2" 
                      />
                      <div className="text-xs text-muted-foreground">
                        Average cost for each conversion
                      </div>
                    </div>
                    
                    {/* ROAS */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-sm font-medium">Return on Ad Spend (ROAS)</div>
                        <div className={`text-sm ${getRoasColor(overallRoas)}`}>{overallRoas.toFixed(2)}x</div>
                      </div>
                      <Progress 
                        value={(overallRoas / 8) * 100} 
                        max={100} 
                        className="h-2" 
                      />
                      <div className="text-xs text-muted-foreground">
                        Revenue generated for each dollar spent
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Performing Campaigns */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Campaign Insights</CardTitle>
                  <CardDescription>Performance analysis and optimization opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {campaigns
                      .filter(c => c.status !== AdStatus.SCHEDULED)
                      .sort((a, b) => b.roas - a.roas)
                      .slice(0, 3)
                      .map((campaign) => (
                        <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{campaign.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {getPlatformBadge(campaign.platform)}
                                <span className="text-sm text-muted-foreground">
                                  Started {new Date(campaign.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className={`text-lg font-bold ${getRoasColor(campaign.roas)}`}>
                              {campaign.roas.toFixed(2)}x ROAS
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Spend</div>
                              <div>{formatCurrency(campaign.spendToDate)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Revenue</div>
                              <div>{formatCurrency(campaign.revenue || 0)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Conversions</div>
                              <div>{formatNumber(campaign.conversions)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">CPA</div>
                              <div>${campaign.cpa.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            {campaign.performance && (
                              <div className="flex items-center text-sm">
                                {getTrendIcon(campaign.performance.trend)}
                                <span className="ml-1">
                                  {campaign.performance.trend === 'up' && 'Trending upward'}
                                  {campaign.performance.trend === 'down' && 'Trending downward'}
                                  {campaign.performance.trend === 'stable' && 'Stable performance'}
                                </span>
                                <span className="mx-1">•</span>
                                <span>
                                  {campaign.performance.percentChange > 0 ? "+" : ""}
                                  {campaign.performance.percentChange.toFixed(1)}% in last {campaign.performance.timeFrame}
                                </span>
                              </div>
                            )}
                            
                            {/* AI-generated insight */}
                            <div className="mt-3 bg-primary/5 p-3 rounded-md flex items-start space-x-2">
                              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm">
                                  {campaign.roas >= 4 
                                    ? `This campaign is performing exceptionally well. Consider increasing the budget by 15-20% to scale results.`
                                    : campaign.roas >= 2
                                    ? `Good performance, but we detected opportunities to improve CTR through creative optimization.`
                                    : `This campaign is underperforming. Consider pausing and reviewing your targeting and creative strategy.`
                                  }
                                </p>
                                <div className="flex justify-end mt-2">
                                  <Button variant="outline" size="sm" className="h-7 text-xs">Apply Recommendation</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Budget Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Allocation</CardTitle>
                  <CardDescription>Current spending distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={platformChartData}
                        dataKey="spend"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => `${entry.name}: $${entry.spend}`}
                      >
                        {platformChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Platform-specific Insights */}
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Platform-Specific Insights</CardTitle>
                  <CardDescription>Performance analysis by advertising platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Platform</TableHead>
                        <TableHead>Campaigns</TableHead>
                        <TableHead className="text-right">Spend</TableHead>
                        <TableHead className="text-right">Impressions</TableHead>
                        <TableHead className="text-right">Clicks</TableHead>
                        <TableHead className="text-right">Conversions</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">ROAS</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {platforms.map((platform) => (
                        <TableRow key={platform.platform}>
                          <TableCell>
                            {getPlatformBadge(platform.platform as AdPlatform)}
                          </TableCell>
                          <TableCell>{platform.campaigns}</TableCell>
                          <TableCell className="text-right">{formatCurrency(platform.spend)}</TableCell>
                          <TableCell className="text-right">{formatNumber(platform.impressions)}</TableCell>
                          <TableCell className="text-right">{formatNumber(platform.clicks)}</TableCell>
                          <TableCell className="text-right">{formatNumber(platform.conversions)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(platform.revenue)}</TableCell>
                          <TableCell className={`text-right ${getRoasColor(platform.roas)}`}>
                            {platform.roas.toFixed(2)}x
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Creative Assets Tab */}
          <TabsContent value="creative" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Creative Performance */}
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Creative Assets</CardTitle>
                      <CardDescription>Manage and track performance of your ad creatives</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Creative
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {creatives.map((creative) => (
                      <div key={creative.id} className="border rounded-lg overflow-hidden flex flex-col">
                        <div className="h-48 bg-gray-100 relative">
                          {/* Placeholder for creative thumbnail */}
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            {creative.type === AdImageType.VIDEO || creative.type === AdImageType.REEL ? (
                              <div className="text-center">
                                <Eye className="h-8 w-8 mx-auto mb-2" />
                                <span className="text-sm">Video Asset</span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Eye className="h-8 w-8 mx-auto mb-2" />
                                <span className="text-sm">Image Asset</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Creative type badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className="capitalize">
                              {creative.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {/* Platform badge */}
                          <div className="absolute top-2 right-2">
                            {getPlatformBadge(creative.platform)}
                          </div>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-medium truncate">{creative.name}</h4>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(creative.createdAt).toLocaleDateString()} • Used in {creative.usedInAds.length} ads
                          </div>
                          
                          {creative.performance && (
                            <div className="mt-3 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Performance Score</span>
                                <span className="font-medium">{creative.performance.score.toFixed(1)}/10</span>
                              </div>
                              <Progress 
                                value={creative.performance.score * 10} 
                                max={100}
                                className="h-2"
                              />
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                                <div>
                                  <span className="text-muted-foreground">CTR: </span>
                                  <span>{formatPercent(creative.performance.ctr)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">CVR: </span>
                                  <span>{formatPercent(creative.performance.conversionRate)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Clicks: </span>
                                  <span>{formatNumber(creative.performance.clicks)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Conv: </span>
                                  <span>{formatNumber(creative.performance.conversions)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-1 mt-3 flex-wrap">
                            {creative.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between mt-auto pt-4">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2 text-amber-500" />
                        AI-Powered Campaign Automation
                      </CardTitle>
                      <CardDescription>
                        Let AI optimize your campaigns automatically based on performance metrics
                      </CardDescription>
                    </div>
                    <Button variant="outline" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      New Rule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Automation rule card */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">Budget Scaling Rule</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Automatically increases campaign budget when ROAS is above target
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Card className="bg-background/50 border-dashed">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Condition</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-sm">
                              If <span className="font-medium">ROAS</span> is <span className="font-medium">greater than</span> <span className="font-medium">3.5x</span> for <span className="font-medium">3 consecutive days</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-background/50 border-dashed">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Action</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-sm">
                              <span className="font-medium">Increase budget</span> by <span className="font-medium">10%</span> up to maximum of <span className="font-medium">$200/day</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-background/50 border-dashed">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Platforms</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="flex gap-1 flex-wrap">
                              <Badge className="bg-[#1877F2] hover:bg-[#1877F2]/90">Facebook</Badge>
                              <Badge className="bg-[#E1306C] hover:bg-[#E1306C]/90">Instagram</Badge>
                              <Badge className="bg-[#4285F4] hover:bg-[#4285F4]/90">Google</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-4 text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Last triggered: March 18, 2025 • Applied to 2 campaigns
                      </div>
                    </div>
                    
                    {/* Automation rule card 2 */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg">Performance Guardian</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Automatically pauses underperforming campaigns
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Card className="bg-background/50 border-dashed">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Condition</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-sm">
                              If <span className="font-medium">ROAS</span> is <span className="font-medium">less than</span> <span className="font-medium">1.2x</span> after spending minimum <span className="font-medium">$300</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-background/50 border-dashed">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Action</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-sm">
                              <span className="font-medium">Pause campaign</span> and <span className="font-medium">send notification</span> to team
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-background/50 border-dashed">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Platforms</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="flex gap-1 flex-wrap">
                              <Badge className="bg-[#1877F2] hover:bg-[#1877F2]/90">Facebook</Badge>
                              <Badge className="bg-[#E1306C] hover:bg-[#E1306C]/90">Instagram</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-4 text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Last triggered: March 15, 2025 • Applied to 1 campaign
                      </div>
                    </div>
                    
                    {/* New automation template cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <Card className="border-dashed border-primary/50 bg-primary/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Smart Budget Allocation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            AI automatically distributes budget across campaigns based on performance
                          </p>
                          <Button className="w-full mt-4" variant="outline">Use Template</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-dashed border-primary/50 bg-primary/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Bid Optimization</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Adjusts bid strategy to achieve target CPA or ROAS
                          </p>
                          <Button className="w-full mt-4" variant="outline">Use Template</Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-dashed border-primary/50 bg-primary/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Creative Rotation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Automatically tests and rotates ad creatives based on performance
                          </p>
                          <Button className="w-full mt-4" variant="outline">Use Template</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Campaign Dialog */}
      <Dialog open={newCampaignDialogOpen} onOpenChange={setNewCampaignDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new advertising campaign across multiple platforms
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input id="campaign-name" placeholder="e.g. Summer Sale 2025" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-platform">Platform</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-objective">Campaign Objective</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                    <SelectItem value="lead_generation">Lead Generation</SelectItem>
                    <SelectItem value="app_installs">App Installs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-budget">Daily Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="campaign-budget" type="number" className="pl-8" placeholder="100.00" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-xs">End Date (Optional)</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-targeting">Campaign Targeting</Label>
                <Textarea 
                  id="campaign-targeting" 
                  placeholder="Describe your target audience"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bid Strategy</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bid strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maximize_conversions">Maximize Conversions</SelectItem>
                    <SelectItem value="target_cpa">Target CPA</SelectItem>
                    <SelectItem value="target_roas">Target ROAS</SelectItem>
                    <SelectItem value="maximize_clicks">Maximize Clicks</SelectItem>
                    <SelectItem value="manual_cpc">Manual CPC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="optimization-target">Optimization Target</Label>
                  <div className="text-sm text-muted-foreground">
                    Target ROAS: 4.0x
                  </div>
                </div>
                <Slider defaultValue={[4]} max={10} step={0.1} />
              </div>
              
              <div className="space-y-2 mt-6">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-optimization" />
                  <Label htmlFor="auto-optimization">Enable AI Optimization</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Let our AI system automatically optimize your campaign for better performance
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-1" />
              You'll be able to add creatives in the next step
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setNewCampaignDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create Campaign</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}