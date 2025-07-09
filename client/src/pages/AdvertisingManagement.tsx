import { useState } from "react";
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  CalendarIcon, 
  Check, 
  CreditCard, 
  DollarSign, 
  Edit, 
  Eye, 
  Filter, 
  LineChart, 
  MoreHorizontal, 
  Package, 
  Pause, 
  Play, 
  Plus, 
  Search, 
  Settings, 
  Tag, 
  Trash, 
  TrendingUp, 
  BarChart
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  AdCampaign,
  AdGroup,
  Ad,
  AdPlatform,
  AdObjective,
  AdStatus,
  BidStrategy,
  AdType
} from '@/components/AdvertisingManagement';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Sample campaign data
const sampleCampaigns: AdCampaign[] = [
  {
    id: "1",
    name: "Summer Collection Launch",
    platform: AdPlatform.FACEBOOK,
    status: AdStatus.ACTIVE,
    objective: AdObjective.CONVERSIONS,
    budget: 500,
    budgetType: 'daily',
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-08-31T23:59:59Z",
    targetROAS: 3.5,
    bidStrategy: BidStrategy.MAXIMIZE_CONVERSION_VALUE,
    spendToDate: 3200,
    impressions: 85000,
    clicks: 4200,
    conversions: 210,
    conversionValue: 12600,
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-07-10T14:15:00Z",
    entityId: 3,
    entityName: "Lone Star Custom Clothing",
    adGroups: [],
    isAutomated: true
  },
  {
    id: "2",
    name: "Craft Beer Awareness",
    platform: AdPlatform.INSTAGRAM,
    status: AdStatus.ACTIVE,
    objective: AdObjective.BRAND_AWARENESS,
    budget: 250,
    budgetType: 'daily',
    startDate: "2023-06-15T00:00:00Z",
    endDate: "2023-09-15T23:59:59Z",
    bidStrategy: BidStrategy.MAXIMIZE_IMPRESSIONS,
    spendToDate: 1800,
    impressions: 120000,
    clicks: 3800,
    conversions: 85,
    conversionValue: 6800,
    createdAt: "2023-06-01T09:45:00Z",
    updatedAt: "2023-07-11T11:20:00Z",
    entityId: 4,
    entityName: "Alcoeaze",
    adGroups: [],
    isAutomated: false
  },
  {
    id: "3",
    name: "Coffee Subscription Drive",
    platform: AdPlatform.GOOGLE,
    status: AdStatus.PAUSED,
    objective: AdObjective.LEAD_GENERATION,
    budget: 350,
    budgetType: 'daily',
    startDate: "2023-05-01T00:00:00Z",
    endDate: "2023-07-31T23:59:59Z",
    targetCPA: 15,
    bidStrategy: BidStrategy.TARGET_CPA,
    spendToDate: 2500,
    impressions: 65000,
    clicks: 3100,
    conversions: 175,
    conversionValue: 8750,
    createdAt: "2023-04-15T08:20:00Z",
    updatedAt: "2023-07-05T16:30:00Z",
    entityId: 5,
    entityName: "Hide Cafe Bars",
    adGroups: [],
    isAutomated: true
  },
  {
    id: "4",
    name: "Digital Marketing Services",
    platform: AdPlatform.LINKEDIN,
    status: AdStatus.ACTIVE,
    objective: AdObjective.TRAFFIC,
    budget: 800,
    budgetType: 'daily',
    startDate: "2023-07-01T00:00:00Z",
    bidStrategy: BidStrategy.MAXIMIZE_CLICKS,
    spendToDate: 1600,
    impressions: 25000,
    clicks: 950,
    conversions: 28,
    conversionValue: 14000,
    createdAt: "2023-06-20T11:00:00Z",
    updatedAt: "2023-07-12T09:40:00Z",
    entityId: 1,
    entityName: "Digital Merch Pros",
    adGroups: [],
    isAutomated: false
  },
  {
    id: "5",
    name: "Mystery Box Promotion",
    platform: AdPlatform.FACEBOOK,
    status: AdStatus.SCHEDULED,
    objective: AdObjective.CATALOG_SALES,
    budget: 600,
    budgetType: 'lifetime',
    startDate: "2023-08-01T00:00:00Z",
    endDate: "2023-10-31T23:59:59Z",
    targetROAS: 4.0,
    bidStrategy: BidStrategy.MAXIMIZE_CONVERSION_VALUE,
    spendToDate: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    conversionValue: 0,
    createdAt: "2023-07-10T14:30:00Z",
    updatedAt: "2023-07-10T14:30:00Z",
    entityId: 2,
    entityName: "Mystery Hype",
    adGroups: [],
    isAutomated: true
  }
];

// Sample ad groups
const sampleAdGroups: AdGroup[] = [
  {
    id: "1",
    campaignId: "1",
    name: "Summer T-Shirts",
    status: AdStatus.ACTIVE,
    targetAudience: "Fashion enthusiasts, ages 18-35",
    ads: [],
    impressions: 42500,
    clicks: 2300,
    ctr: 5.41,
    conversions: 115,
    conversionRate: 5.0,
    cost: 1600,
    cpc: 0.70,
    cvr: 5.0,
    roas: 3.8,
    createdAt: "2023-05-15T10:35:00Z",
    updatedAt: "2023-07-10T14:16:00Z"
  },
  {
    id: "2",
    campaignId: "1",
    name: "Summer Hats & Accessories",
    status: AdStatus.ACTIVE,
    targetAudience: "Fashion enthusiasts, ages 18-35",
    ads: [],
    impressions: 42500,
    clicks: 1900,
    ctr: 4.47,
    conversions: 95,
    conversionRate: 5.0,
    cost: 1600,
    cpc: 0.84,
    cvr: 5.0,
    roas: 3.2,
    createdAt: "2023-05-15T10:40:00Z",
    updatedAt: "2023-07-10T14:17:00Z"
  },
  {
    id: "3",
    campaignId: "2",
    name: "Craft Beer General",
    status: AdStatus.ACTIVE,
    targetAudience: "Beer enthusiasts, ages 21-45",
    ads: [],
    impressions: 80000,
    clicks: 2500,
    ctr: 3.13,
    conversions: 55,
    conversionRate: 2.2,
    cost: 1200,
    cpc: 0.48,
    cvr: 2.2,
    roas: 2.8,
    createdAt: "2023-06-01T09:50:00Z",
    updatedAt: "2023-07-11T11:21:00Z"
  },
  {
    id: "4",
    campaignId: "2",
    name: "IPA Focused",
    status: AdStatus.ACTIVE,
    targetAudience: "IPA lovers, ages 25-40",
    ads: [],
    impressions: 40000,
    clicks: 1300,
    ctr: 3.25,
    conversions: 30,
    conversionRate: 2.3,
    cost: 600,
    cpc: 0.46,
    cvr: 2.3,
    roas: 3.1,
    createdAt: "2023-06-01T09:55:00Z",
    updatedAt: "2023-07-11T11:22:00Z"
  },
  {
    id: "5",
    campaignId: "3",
    name: "Monthly Subscription",
    status: AdStatus.PAUSED,
    targetAudience: "Coffee enthusiasts, ages 25-55",
    ads: [],
    impressions: 40000,
    clicks: 1800,
    ctr: 4.5,
    conversions: 110,
    conversionRate: 6.1,
    cost: 1500,
    cpc: 0.83,
    cvr: 6.1,
    roas: 3.6,
    createdAt: "2023-04-15T08:25:00Z",
    updatedAt: "2023-07-05T16:31:00Z"
  },
  {
    id: "6",
    campaignId: "3",
    name: "Single-origin Explorer",
    status: AdStatus.PAUSED,
    targetAudience: "Premium coffee lovers, ages 30-60",
    ads: [],
    impressions: 25000,
    clicks: 1300,
    ctr: 5.2,
    conversions: 65,
    conversionRate: 5.0,
    cost: 1000,
    cpc: 0.77,
    cvr: 5.0,
    roas: 3.25,
    createdAt: "2023-04-15T08:30:00Z",
    updatedAt: "2023-07-05T16:32:00Z"
  }
];

// Sample ads
const sampleAds: Ad[] = [
  {
    id: "1",
    groupId: "1",
    name: "Summer Collection - Graphic T 1",
    type: AdType.IMAGE,
    status: AdStatus.ACTIVE,
    headline: "Summer Style Just Dropped",
    description: "Shop our new summer graphic tees. Limited editions available now!",
    finalUrl: "https://lonestarcustomclothing.com/summer-collection",
    imageUrl: "https://example.com/ads/tshirt1.jpg",
    callToAction: "Shop Now",
    impressions: 22000,
    clicks: 1200,
    ctr: 5.45,
    conversions: 60,
    conversionRate: 5.0,
    cost: 840,
    cpc: 0.70,
    cvr: 5.0,
    createdAt: "2023-05-15T10:45:00Z",
    updatedAt: "2023-07-10T14:18:00Z"
  },
  {
    id: "2",
    groupId: "1",
    name: "Summer Collection - Graphic T 2",
    type: AdType.IMAGE,
    status: AdStatus.ACTIVE,
    headline: "Express Your Summer Vibe",
    description: "Unique designs for every style. Free shipping on orders over $50!",
    finalUrl: "https://lonestarcustomclothing.com/summer-collection",
    imageUrl: "https://example.com/ads/tshirt2.jpg",
    callToAction: "Shop Now",
    impressions: 20500,
    clicks: 1100,
    ctr: 5.37,
    conversions: 55,
    conversionRate: 5.0,
    cost: 760,
    cpc: 0.69,
    cvr: 5.0,
    createdAt: "2023-05-15T10:50:00Z",
    updatedAt: "2023-07-10T14:19:00Z"
  },
  {
    id: "3",
    groupId: "2",
    name: "Summer Hats - Promo 1",
    type: AdType.IMAGE,
    status: AdStatus.ACTIVE,
    headline: "Top Off Your Summer Look",
    description: "Stylish hats for sun protection. New designs just arrived!",
    finalUrl: "https://lonestarcustomclothing.com/summer-hats",
    imageUrl: "https://example.com/ads/hat1.jpg",
    callToAction: "Shop Now",
    impressions: 21000,
    clicks: 950,
    ctr: 4.52,
    conversions: 48,
    conversionRate: 5.05,
    cost: 800,
    cpc: 0.84,
    cvr: 5.05,
    createdAt: "2023-05-15T10:55:00Z",
    updatedAt: "2023-07-10T14:20:00Z"
  },
  {
    id: "4",
    groupId: "2",
    name: "Summer Accessories Bundle",
    type: AdType.IMAGE,
    status: AdStatus.ACTIVE,
    headline: "Complete Your Summer Collection",
    description: "Hat + Sunglasses + Tote Bundle. Save 15% when you buy together!",
    finalUrl: "https://lonestarcustomclothing.com/summer-bundle",
    imageUrl: "https://example.com/ads/bundle1.jpg",
    callToAction: "Shop Bundle",
    impressions: 21500,
    clicks: 950,
    ctr: 4.42,
    conversions: 47,
    conversionRate: 4.95,
    cost: 800,
    cpc: 0.84,
    cvr: 4.95,
    createdAt: "2023-05-15T11:00:00Z",
    updatedAt: "2023-07-10T14:21:00Z"
  },
  {
    id: "5",
    groupId: "3",
    name: "Craft Beer Selection",
    type: AdType.IMAGE,
    status: AdStatus.ACTIVE,
    headline: "Discover Your New Favorite Brew",
    description: "Over 20 craft varieties. Locally made, globally inspired.",
    finalUrl: "https://alcoeaze.com/craft-collection",
    imageUrl: "https://example.com/ads/beer-selection.jpg",
    callToAction: "Explore",
    impressions: 42000,
    clicks: 1300,
    ctr: 3.10,
    conversions: 29,
    conversionRate: 2.23,
    cost: 624,
    cpc: 0.48,
    cvr: 2.23,
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-07-11T11:23:00Z"
  },
  {
    id: "6",
    groupId: "3",
    name: "Craft Beer Story",
    type: AdType.VIDEO,
    status: AdStatus.ACTIVE,
    headline: "Crafted With Passion",
    description: "See how we make our award-winning craft beers. From grain to glass.",
    finalUrl: "https://alcoeaze.com/our-story",
    videoUrl: "https://example.com/ads/brewing-story.mp4",
    callToAction: "Learn More",
    impressions: 38000,
    clicks: 1200,
    ctr: 3.16,
    conversions: 26,
    conversionRate: 2.17,
    cost: 576,
    cpc: 0.48,
    cvr: 2.17,
    createdAt: "2023-06-01T10:05:00Z",
    updatedAt: "2023-07-11T11:24:00Z"
  }
];

// Performance over time chart data
const performanceData = [
  { date: '2023-06-01', impressions: 5000, clicks: 250, conversions: 12, cost: 180 },
  { date: '2023-06-08', impressions: 5500, clicks: 275, conversions: 14, cost: 198 },
  { date: '2023-06-15', impressions: 6200, clicks: 310, conversions: 16, cost: 223 },
  { date: '2023-06-22', impressions: 7000, clicks: 350, conversions: 18, cost: 252 },
  { date: '2023-06-29', impressions: 7500, clicks: 375, conversions: 19, cost: 270 },
  { date: '2023-07-06', impressions: 8200, clicks: 410, conversions: 21, cost: 295 },
  { date: '2023-07-13', impressions: 8800, clicks: 440, conversions: 22, cost: 317 },
];

// Platform distribution data
const platformData = [
  { name: 'Facebook', value: 40 },
  { name: 'Instagram', value: 30 },
  { name: 'Google', value: 20 },
  { name: 'LinkedIn', value: 10 },
];

const PLATFORM_COLORS = {
  [AdPlatform.FACEBOOK]: '#4267B2',
  [AdPlatform.INSTAGRAM]: '#E1306C',
  [AdPlatform.GOOGLE]: '#4285F4',
  [AdPlatform.LINKEDIN]: '#0077B5',
  [AdPlatform.TWITTER]: '#1DA1F2',
  [AdPlatform.TIKTOK]: '#000000',
  [AdPlatform.PINTEREST]: '#E60023',
  [AdPlatform.SNAPCHAT]: '#FFFC00',
  [AdPlatform.AMAZON]: '#FF9900',
  [AdPlatform.MICROSOFT]: '#00A4EF',
  [AdPlatform.YOUTUBE]: '#FF0000',
  DEFAULT: '#6E7681'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

// Tab types
type AdvertisingTabType = "campaigns" | "performance" | "insights" | "creative" | "automation";
type CampaignStatus = "all" | "active" | "paused" | "scheduled";

export default function AdvertisingManagement() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<AdvertisingTabType>("campaigns");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<CampaignStatus>("all");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [newCampaignDialog, setNewCampaignDialog] = useState(false);
  const [campaignDate, setCampaignDate] = useState<Date | undefined>(new Date());
  const [campaignEndDate, setCampaignEndDate] = useState<Date | undefined>(undefined);
  
  // Queries for data fetching
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
  });
  
  // Mock data fetch for campaigns
  const { data: campaignsData, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['/api/advertising/campaigns', campaignStatusFilter, selectedEntity],
    queryFn: async () => {
      // In a real app, this would be a fetch request
      return { campaigns: sampleCampaigns };
    },
  });
  
  // Mock data fetch for ad groups
  const { data: adGroupsData, isLoading: isLoadingAdGroups } = useQuery({
    queryKey: ['/api/advertising/ad-groups'],
    queryFn: async () => {
      // In a real app, this would be a fetch request
      return { adGroups: sampleAdGroups };
    },
  });
  
  // Mock data fetch for ads
  const { data: adsData, isLoading: isLoadingAds } = useQuery({
    queryKey: ['/api/advertising/ads'],
    queryFn: async () => {
      // In a real app, this would be a fetch request
      return { ads: sampleAds };
    },
  });
  
  // Process data
  const campaigns = campaignsData?.campaigns || [];
  const adGroups = adGroupsData?.adGroups || [];
  const ads = adsData?.ads || [];
  const entities = entitiesData?.entities || [];
  
  // Attach ad groups and ads to campaigns for the UI
  const processedCampaigns = campaigns.map(campaign => {
    const campaignAdGroups = adGroups.filter(group => group.campaignId === campaign.id);
    const processedAdGroups = campaignAdGroups.map(group => {
      const groupAds = ads.filter(ad => ad.groupId === group.id);
      return { ...group, ads: groupAds };
    });
    return { ...campaign, adGroups: processedAdGroups };
  });
  
  // Filter campaigns based on search and filters
  const filteredCampaigns = processedCampaigns.filter(campaign => {
    // Filter by search
    const matchesSearch = 
      searchQuery === "" || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.platform.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Filter by status
    if (campaignStatusFilter !== "all" && campaign.status.toLowerCase() !== campaignStatusFilter) {
      return false;
    }
    
    // Filter by entity
    if (selectedEntity !== "all" && campaign.entityId !== Number(selectedEntity)) {
      return false;
    }
    
    return true;
  });
  
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Helper function to format percentage
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: AdStatus) => {
    switch (status) {
      case AdStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case AdStatus.PAUSED:
        return <Badge className="bg-amber-100 text-amber-800">Paused</Badge>;
      case AdStatus.SCHEDULED:
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case AdStatus.ENDED:
        return <Badge className="bg-gray-100 text-gray-800">Ended</Badge>;
      case AdStatus.DRAFT:
        return <Badge className="bg-purple-100 text-purple-800">Draft</Badge>;
      case AdStatus.PENDING_REVIEW:
        return <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Helper function to get platform icon and color
  const getPlatformBadge = (platform: AdPlatform) => {
    const color = PLATFORM_COLORS[platform] || PLATFORM_COLORS.DEFAULT;
    
    return (
      <Badge variant="outline" style={{ borderColor: color, color: color, backgroundColor: `${color}10` }}>
        {platform}
      </Badge>
    );
  };
  
  // Helper function to calculate campaign metrics
  const calculateCampaignMetrics = () => {
    if (filteredCampaigns.length === 0) return { impressions: 0, clicks: 0, conversions: 0, spend: 0, ctr: 0, cvr: 0, cpc: 0, roas: 0 };
    
    const impressions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
    const clicks = filteredCampaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
    const conversions = filteredCampaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
    const spend = filteredCampaigns.reduce((sum, campaign) => sum + campaign.spendToDate, 0);
    const conversionValue = filteredCampaigns.reduce((sum, campaign) => sum + campaign.conversionValue, 0);
    
    const ctr = clicks > 0 ? (clicks / impressions) * 100 : 0;
    const cvr = conversions > 0 ? (conversions / clicks) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const roas = spend > 0 ? conversionValue / spend : 0;
    
    return { impressions, clicks, conversions, spend, ctr, cvr, cpc, roas };
  };
  
  const metrics = calculateCampaignMetrics();

  return (
    <MainLayout title="Advertising Management" description="Manage your advertising campaigns across all platforms">
      <div className="space-y-6">
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.spend)}</div>
              <p className="text-xs text-muted-foreground">Across all active campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversions}</div>
              <p className="text-xs text-muted-foreground">
                {formatPercent(metrics.cvr)} conversion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(metrics.ctr)}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.clicks.toLocaleString()} clicks from {metrics.impressions.toLocaleString()} impressions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.roas.toFixed(2)}x</div>
              <p className="text-xs text-muted-foreground">
                Return on ad spend
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select 
              value={selectedEntity} 
              onValueChange={setSelectedEntity}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {isLoadingEntities ? (
                  <SelectItem value="loading" disabled>Loading entities...</SelectItem>
                ) : (
                  entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Select 
              value={campaignStatusFilter} 
              onValueChange={(value) => setCampaignStatusFilter(value as CampaignStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button onClick={() => setNewCampaignDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
        
        {/* Tabs and Content */}
        <Tabs defaultValue="campaigns" className="w-full" onValueChange={(value) => setActiveTab(value as AdvertisingTabType)}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>
          
          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="mt-0">
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
                      <TableHead>ROAS</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCampaigns ? (
                      Array(3).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-9 w-9 rounded-md float-right" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Package className="h-8 w-8 mb-2" />
                            <p className="text-sm font-medium mb-1">No campaigns found</p>
                            <p className="text-xs">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCampaigns.map((campaign) => {
                        const roas = campaign.spendToDate > 0 
                          ? campaign.conversionValue / campaign.spendToDate 
                          : 0;
                          
                        return (
                          <TableRow key={campaign.id} className="group">
                            <TableCell>
                              <div className="font-medium">{campaign.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {campaign.objective.replace('_', ' ')}
                              </div>
                            </TableCell>
                            <TableCell>{getPlatformBadge(campaign.platform)}</TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>
                              <div className="font-medium">{formatCurrency(campaign.budget)}</div>
                              <div className="text-xs text-muted-foreground">
                                {campaign.budgetType === 'daily' ? 'Daily' : 'Lifetime'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{formatCurrency(campaign.spendToDate)}</div>
                              {campaign.status !== AdStatus.SCHEDULED && (
                                <Progress 
                                  value={campaign.budget > 0 ? (campaign.spendToDate / (campaign.budget * 30)) * 100 : 0} 
                                  className="h-1 w-16 mt-1"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{roas.toFixed(2)}x</div>
                              <div className="text-xs text-muted-foreground">
                                Target: {campaign.targetROAS ? `${campaign.targetROAS}x` : 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <div>Start: {formatDate(campaign.startDate)}</div>
                                {campaign.endDate && (
                                  <div>End: {formatDate(campaign.endDate)}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{campaign.entityName}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Campaign
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <LineChart className="h-4 w-4 mr-2" />
                                    Performance
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {campaign.status === AdStatus.ACTIVE ? (
                                    <DropdownMenuItem>
                                      <Pause className="h-4 w-4 mr-2" />
                                      Pause Campaign
                                    </DropdownMenuItem>
                                  ) : campaign.status === AdStatus.PAUSED ? (
                                    <DropdownMenuItem>
                                      <Play className="h-4 w-4 mr-2" />
                                      Resume Campaign
                                    </DropdownMenuItem>
                                  ) : null}
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete Campaign
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Campaign Performance Over Time</CardTitle>
                  <CardDescription>
                    Impressions, clicks, and conversions for the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="impressions" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          yAxisId="left" 
                          stackId="1"
                          fillOpacity={0.3}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="#82ca9d" 
                          fill="#82ca9d" 
                          yAxisId="right" 
                          stackId="2"
                          fillOpacity={0.3}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="conversions" 
                          stroke="#ffc658" 
                          fill="#ffc658" 
                          yAxisId="right" 
                          stackId="3"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>
                    Ad spend by platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Effectiveness</CardTitle>
                  <CardDescription>
                    Conversion rate by campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={filteredCampaigns.map(campaign => ({
                          name: campaign.name,
                          conversionRate: campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${parseFloat(value as string).toFixed(2)}%`, "Conversion Rate"]} />
                        <Legend />
                        <Bar dataKey="conversionRate" fill="#8884d8" name="Conversion Rate (%)" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>
                    AI-generated insights from your campaign data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Conversion optimization opportunity</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your "Summer Collection Launch" campaign is performing well above target ROAS. Consider increasing budget allocation to this campaign by 20% to capitalize on its success.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <BarChart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">Audience targeting insight</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Analytics indicates that your ads are performing 35% better with the 25-34 age demographic compared to other age groups. Consider refining your targeting to focus more on this demographic.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="bg-amber-100 p-2 rounded-full mr-3">
                        <Settings className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-amber-800">Bid strategy recommendation</h3>
                        <p className="text-sm text-amber-700 mt-1">
                          Your "Coffee Subscription Drive" campaign is currently using Target CPA bidding. Based on historical performance, switching to Maximize Conversions could improve results by approximately 15-20%.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Ad Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adGroups
                      .sort((a, b) => b.roas - a.roas)
                      .slice(0, 3)
                      .map((group) => (
                        <div key={group.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-sm">{group.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {group.targetAudience}
                              </p>
                            </div>
                            <Badge>{formatPercent(group.conversionRate)}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                            <div>
                              <p className="text-muted-foreground">CTR</p>
                              <p className="font-medium">{formatPercent(group.ctr)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Cost/Conv.</p>
                              <p className="font-medium">{formatCurrency(group.cost / group.conversions)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">ROAS</p>
                              <p className="font-medium">{group.roas.toFixed(2)}x</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    View All Ad Groups
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Creative Tab */}
          <TabsContent value="creative" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.slice(0, 6).map((ad) => (
                <Card key={ad.id} className="overflow-hidden">
                  {ad.type === AdType.IMAGE && ad.imageUrl && (
                    <div className="aspect-video w-full bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span>Ad Preview Image</span>
                      </div>
                    </div>
                  )}
                  {ad.type === AdType.VIDEO && ad.videoUrl && (
                    <div className="aspect-video w-full bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span>Video Ad Preview</span>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{ad.headline}</CardTitle>
                      {getStatusBadge(ad.status)}
                    </div>
                    <CardDescription>{ad.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Impressions</p>
                        <p className="font-medium">{ad.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-medium">{ad.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-medium">{formatPercent(ad.ctr)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conv. Rate</p>
                        <p className="font-medium">{formatPercent(ad.conversionRate)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Creative
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Automation Tab */}
          <TabsContent value="automation" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Campaign Automation Rules</CardTitle>
                  <CardDescription>
                    Create rules to automatically adjust your campaigns based on performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Play className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Budget Scaling Rule</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              If ROAS exceeds 3.0 for 3 consecutive days, increase daily budget by 20%.
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="mt-3 ml-11 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Applies To</p>
                          <p className="font-medium">All ROAS campaigns</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium">Daily check</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Triggered</p>
                          <p className="font-medium">July 8, 2023</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="bg-red-100 p-2 rounded-full mr-3">
                            <Pause className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Underperforming Campaign Pause</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              If CPA exceeds 200% of target for 2 days, pause campaign and send notification.
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="mt-3 ml-11 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Applies To</p>
                          <p className="font-medium">All CPA campaigns</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium">Daily check</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Triggered</p>
                          <p className="font-medium">Never</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <Tag className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Automatic Bid Adjustment</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Adjust bid strategy based on day-of-week performance patterns.
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800">Scheduled</Badge>
                      </div>
                      <div className="mt-3 ml-11 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Applies To</p>
                          <p className="font-medium">Summer Collection</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium">Weekly</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Run</p>
                          <p className="font-medium">July 16, 2023</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Automation Rule
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Automated Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredCampaigns
                        .filter(campaign => campaign.isAutomated)
                        .map((campaign) => (
                          <div key={campaign.id} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="font-medium text-sm">{campaign.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {campaign.platform}
                              </p>
                            </div>
                            <Badge variant="outline">{campaign.status}</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-3">
                        <h3 className="text-sm font-medium">Optimize Campaign Budget Allocation</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Redistribute budgets based on performance analysis to maximize overall ROAS.
                        </p>
                        <Button size="sm" className="mt-2 w-full">Apply</Button>
                      </div>
                      <div className="border rounded-lg p-3">
                        <h3 className="text-sm font-medium">Generate AI Ad Creative Variants</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Create 5 new ad variants based on your best performing ads.
                        </p>
                        <Button size="sm" className="mt-2 w-full">Generate</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Campaign Dialog */}
      <Dialog open={newCampaignDialog} onOpenChange={setNewCampaignDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Advertising Campaign</DialogTitle>
            <DialogDescription>
              Set up a new campaign across any of your connected ad platforms.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="e.g. Summer Collection 2023"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select defaultValue={AdPlatform.FACEBOOK}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AdPlatform.FACEBOOK}>Facebook</SelectItem>
                    <SelectItem value={AdPlatform.INSTAGRAM}>Instagram</SelectItem>
                    <SelectItem value={AdPlatform.GOOGLE}>Google</SelectItem>
                    <SelectItem value={AdPlatform.LINKEDIN}>LinkedIn</SelectItem>
                    <SelectItem value={AdPlatform.TWITTER}>Twitter</SelectItem>
                    <SelectItem value={AdPlatform.TIKTOK}>TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="objective">Objective</Label>
                <Select defaultValue={AdObjective.CONVERSIONS}>
                  <SelectTrigger id="objective">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AdObjective.BRAND_AWARENESS}>Brand Awareness</SelectItem>
                    <SelectItem value={AdObjective.TRAFFIC}>Traffic</SelectItem>
                    <SelectItem value={AdObjective.ENGAGEMENT}>Engagement</SelectItem>
                    <SelectItem value={AdObjective.LEAD_GENERATION}>Lead Generation</SelectItem>
                    <SelectItem value={AdObjective.CONVERSIONS}>Conversions</SelectItem>
                    <SelectItem value={AdObjective.CATALOG_SALES}>Catalog Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Daily Budget</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="500.00"
                    className="pl-7"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bid-strategy">Bid Strategy</Label>
                <Select defaultValue={BidStrategy.MAXIMIZE_CONVERSIONS}>
                  <SelectTrigger id="bid-strategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BidStrategy.MAXIMIZE_CONVERSIONS}>Maximize Conversions</SelectItem>
                    <SelectItem value={BidStrategy.MAXIMIZE_CONVERSION_VALUE}>Maximize Conversion Value</SelectItem>
                    <SelectItem value={BidStrategy.TARGET_CPA}>Target CPA</SelectItem>
                    <SelectItem value={BidStrategy.TARGET_ROAS}>Target ROAS</SelectItem>
                    <SelectItem value={BidStrategy.MAXIMIZE_CLICKS}>Maximize Clicks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date-range">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="date-range"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignDate ? format(campaignDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={campaignDate}
                      onSelect={setCampaignDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="end-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {campaignEndDate ? format(campaignEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={campaignEndDate}
                      onSelect={setCampaignEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="entity">Business Entity</Label>
              <Select defaultValue="1">
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
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="automation">
                  Enable Automation
                </Label>
                <Switch id="automation" />
              </div>
              <p className="text-xs text-muted-foreground">
                Automatically optimize this campaign based on performance.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCampaignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setNewCampaignDialog(false)}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}