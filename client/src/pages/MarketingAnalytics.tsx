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
  Heart,
  AlertCircle,
  Clock,
  Calendar,
  BarChart,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  MessageCircle,
  Mail,
  FileText,
  Zap,
  DollarSign,
  Percent,
  Target,
  Eye,
  MousePointer,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Laptop,
  Globe,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Share2,
  Megaphone,
} from 'lucide-react';
import SocialIcons from '@/components/SocialIcons';

// Types
interface MarketingMetric {
  id: number;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  status: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  format?: 'number' | 'currency' | 'percentage';
  description: string;
}

interface MarketingCampaign {
  id: number;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate?: string;
  budget: number;
  budgetSpent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  roi: number;
}

interface ChannelPerformance {
  id: number;
  channel: string;
  icon: React.ElementType;
  customIcon?: boolean;
  visitors: number;
  sessions: number;
  bounceRate: number;
  conversionRate: number;
  costPerAcquisition: number;
  revenue: number;
  roi: number;
}

interface ContentPerformance {
  id: number;
  title: string;
  type: string;
  url: string;
  views: number;
  engagement: number;
  shares: number;
  conversions: number;
  publishDate: string;
}

// Demo data functions
const getMarketingMetrics = (demoMode: boolean): MarketingMetric[] => {
  if (!demoMode) return [];
  
  return [
    {
      id: 1,
      name: 'Website Visitors',
      value: 24650,
      previousValue: 21300,
      change: 15.7,
      status: 'positive',
      icon: Globe,
      format: 'number',
      description: 'Total unique visitors in the last 30 days'
    },
    {
      id: 2,
      name: 'Conversion Rate',
      value: 3.2,
      previousValue: 2.8,
      change: 14.3,
      status: 'positive',
      icon: Target,
      format: 'percentage',
      description: 'Percentage of visitors who completed a goal'
    },
    {
      id: 3,
      name: 'Customer Acquisition Cost',
      value: 42.5,
      previousValue: 46.8,
      change: -9.2,
      status: 'positive',
      icon: DollarSign,
      format: 'currency',
      description: 'Average cost to acquire a new customer'
    },
    {
      id: 4,
      name: 'Marketing ROI',
      value: 285,
      previousValue: 240,
      change: 18.8,
      status: 'positive',
      icon: TrendingUp,
      format: 'percentage',
      description: 'Return on investment for marketing campaigns'
    },
    {
      id: 5,
      name: 'Email Open Rate',
      value: 24.3,
      previousValue: 22.5,
      change: 8.0,
      status: 'positive',
      icon: Mail,
      format: 'percentage',
      description: 'Percentage of sent emails that were opened'
    },
    {
      id: 6,
      name: 'Social Media Engagement',
      value: 5840,
      previousValue: 4920,
      change: 18.7,
      status: 'positive',
      icon: Share2,
      format: 'number',
      description: 'Total likes, comments, shares across platforms'
    }
  ];
};

const getMarketingCampaigns = (demoMode: boolean): MarketingCampaign[] => {
  if (!demoMode) return [];
  
  return [
    {
      id: 1,
      name: 'Summer Sale Promotion',
      platform: 'Google Ads',
      status: 'active',
      startDate: '2023-06-01',
      endDate: '2023-07-31',
      budget: 6000,
      budgetSpent: 3450,
      impressions: 342500,
      clicks: 12800,
      conversions: 820,
      ctr: 3.74,
      cpc: 0.27,
      conversionRate: 6.41,
      roi: 420
    },
    {
      id: 2,
      name: 'Product Launch Campaign',
      platform: 'Facebook & Instagram',
      status: 'active',
      startDate: '2023-05-15',
      endDate: '2023-07-15',
      budget: 8000,
      budgetSpent: 5200,
      impressions: 528600,
      clicks: 18450,
      conversions: 960,
      ctr: 3.49,
      cpc: 0.28,
      conversionRate: 5.20,
      roi: 310
    },
    {
      id: 3,
      name: 'Brand Awareness',
      platform: 'LinkedIn',
      status: 'active',
      startDate: '2023-03-01',
      endDate: '2023-06-30',
      budget: 4500,
      budgetSpent: 3850,
      impressions: 215300,
      clicks: 7840,
      conversions: 320,
      ctr: 3.64,
      cpc: 0.49,
      conversionRate: 4.08,
      roi: 220
    },
    {
      id: 4,
      name: 'Email Nurture Series',
      platform: 'Email',
      status: 'completed',
      startDate: '2023-04-01',
      endDate: '2023-05-30',
      budget: 1500,
      budgetSpent: 1500,
      impressions: 45000,
      clicks: 6300,
      conversions: 450,
      ctr: 14.00,
      cpc: 0.24,
      conversionRate: 7.14,
      roi: 480
    },
    {
      id: 5,
      name: 'Holiday Special Offer',
      platform: 'Multi-Channel',
      status: 'draft',
      startDate: '2023-11-15',
      endDate: '2023-12-31',
      budget: 10000,
      budgetSpent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      conversionRate: 0,
      roi: 0
    }
  ];
};

const getChannelPerformance = (demoMode: boolean): ChannelPerformance[] => {
  if (!demoMode) return [];
  
  return [
    {
      id: 1,
      channel: 'Organic Search',
      icon: Search,
      customIcon: false,
      visitors: 8450,
      sessions: 10200,
      bounceRate: 38,
      conversionRate: 3.2,
      costPerAcquisition: 0,
      revenue: 52800,
      roi: 0
    },
    {
      id: 2,
      channel: 'Paid Search',
      icon: Target,
      customIcon: false,
      visitors: 5800,
      sessions: 6700,
      bounceRate: 42,
      conversionRate: 4.5,
      costPerAcquisition: 28,
      revenue: 75600,
      roi: 390
    },
    {
      id: 3,
      channel: 'Social Media',
      icon: Share2,
      customIcon: false,
      visitors: 4200,
      sessions: 5100,
      bounceRate: 55,
      conversionRate: 2.8,
      costPerAcquisition: 35,
      revenue: 42000,
      roi: 280
    },
    {
      id: 4,
      channel: 'Email Marketing',
      icon: Mail,
      customIcon: false,
      visitors: 3100,
      sessions: 3600,
      bounceRate: 32,
      conversionRate: 6.4,
      costPerAcquisition: 12,
      revenue: 68400,
      roi: 450
    },
    {
      id: 5,
      channel: 'Direct Traffic',
      icon: MousePointer,
      customIcon: false,
      visitors: 2800,
      sessions: 3500,
      bounceRate: 41,
      conversionRate: 3.8,
      costPerAcquisition: 0,
      revenue: 35200,
      roi: 0
    },
    {
      id: 6,
      channel: 'Referral',
      icon: ExternalLink,
      customIcon: false,
      visitors: 1650,
      sessions: 1900,
      bounceRate: 35,
      conversionRate: 5.2,
      costPerAcquisition: 8,
      revenue: 28800,
      roi: 520
    },
    {
      id: 7,
      channel: 'Facebook',
      icon: Facebook,
      customIcon: true,
      visitors: 1520,
      sessions: 1850,
      bounceRate: 48,
      conversionRate: 2.5,
      costPerAcquisition: 42,
      revenue: 16200,
      roi: 240
    },
    {
      id: 8,
      channel: 'Instagram',
      icon: Instagram,
      customIcon: true,
      visitors: 1280,
      sessions: 1550,
      bounceRate: 52,
      conversionRate: 2.3,
      costPerAcquisition: 45,
      revenue: 14800,
      roi: 210
    }
  ];
};

const getContentPerformance = (demoMode: boolean): ContentPerformance[] => {
  if (!demoMode) return [];
  
  return [
    {
      id: 1,
      title: '10 Ways to Improve Your Digital Marketing Strategy',
      type: 'Blog Post',
      url: '/blog/improve-digital-marketing-strategy',
      views: 4850,
      engagement: 720,
      shares: 215,
      conversions: 42,
      publishDate: '2023-05-15'
    },
    {
      id: 2,
      title: 'How Our Product Saved ABC Company $50K',
      type: 'Case Study',
      url: '/resources/case-studies/abc-company',
      views: 2540,
      engagement: 840,
      shares: 180,
      conversions: 68,
      publishDate: '2023-04-22'
    },
    {
      id: 3,
      title: 'Product Demonstration: New Features in v2.5',
      type: 'Video',
      url: '/resources/videos/product-demo-v2-5',
      views: 3200,
      engagement: 950,
      shares: 245,
      conversions: 72,
      publishDate: '2023-05-28'
    },
    {
      id: 4,
      title: 'Ultimate Guide to SEO in 2023',
      type: 'Whitepaper',
      url: '/resources/whitepapers/seo-guide-2023',
      views: 1850,
      engagement: 640,
      shares: 120,
      conversions: 95,
      publishDate: '2023-03-10'
    },
    {
      id: 5,
      title: 'Customer Success Story: XYZ Corp',
      type: 'Blog Post',
      url: '/blog/customer-success-xyz-corp',
      views: 1960,
      engagement: 380,
      shares: 85,
      conversions: 32,
      publishDate: '2023-05-05'
    }
  ];
};

// Format functions
const formatValue = (value: number, format?: 'number' | 'currency' | 'percentage'): string => {
  if (format === 'currency') {
    return `$${value.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
  } else if (format === 'percentage') {
    return `${value}%`;
  } else {
    return value.toLocaleString();
  }
};

// Card components
const MarketingMetricCard = ({ metric }: { metric: MarketingMetric }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {formatValue(metric.value, metric.format)}
            </div>
            <div className={`flex items-center text-xs ${
              metric.status === 'positive' ? 'text-green-500' : 
              metric.status === 'negative' ? 'text-red-500' : 
              'text-muted-foreground'
            }`}>
              {metric.status === 'positive' ? 
                <TrendingUp className="h-3 w-3 mr-1" /> : 
                metric.status === 'negative' ? 
                  <TrendingDown className="h-3 w-3 mr-1" /> : 
                  null
              }
              {metric.change > 0 ? '+' : ''}{metric.change}% vs previous
            </div>
          </div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            metric.status === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' :
            metric.status === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
            'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
          }`}>
            <metric.icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          {metric.description}
        </div>
      </CardContent>
    </Card>
  );
};

// Campaign Status Badge
const CampaignStatusBadge = ({ status }: { status: string }) => {
  switch(status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'paused':
      return <Badge variant="secondary">Paused</Badge>;
    case 'completed':
      return <Badge className="bg-blue-500">Completed</Badge>;
    case 'draft':
      return <Badge variant="outline">Draft</Badge>;
    default:
      return null;
  }
};

// Marketing Analytics component
const MarketingAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { demoMode } = useDemoMode();
  
  // Load data with React Query (using demo data for demonstration)
  const { data: marketingMetrics = [] } = useQuery({
    queryKey: ['marketing-metrics'],
    queryFn: async () => {
      if (demoMode) {
        return getMarketingMetrics(true);
      }
      const response = await apiRequest('GET', '/api/marketing-metrics');
      return await response.json();
    }
  });
  
  const { data: marketingCampaigns = [] } = useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: async () => {
      if (demoMode) {
        return getMarketingCampaigns(true);
      }
      const response = await apiRequest('GET', '/api/marketing-campaigns');
      return await response.json();
    }
  });
  
  const { data: channelPerformance = [] } = useQuery({
    queryKey: ['channel-performance'],
    queryFn: async () => {
      if (demoMode) {
        return getChannelPerformance(true);
      }
      const response = await apiRequest('GET', '/api/channel-performance');
      return await response.json();
    }
  });
  
  const { data: contentPerformance = [] } = useQuery({
    queryKey: ['content-performance'],
    queryFn: async () => {
      if (demoMode) {
        return getContentPerformance(true);
      }
      const response = await apiRequest('GET', '/api/content-performance');
      return await response.json();
    }
  });
  
  // Render overview tab
  const renderOverviewTab = () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Key Marketing Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketingMetrics.map((metric: MarketingMetric) => (
              <MarketingMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Active Campaigns</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Campaign
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
                    <TableHead>CTR</TableHead>
                    <TableHead>Conv. Rate</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingCampaigns
                    .filter((campaign: MarketingCampaign) => campaign.status !== 'draft')
                    .slice(0, 3)
                    .map((campaign: MarketingCampaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.platform}</TableCell>
                        <TableCell>
                          <CampaignStatusBadge status={campaign.status} />
                        </TableCell>
                        <TableCell>
                          ${campaign.budgetSpent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                        </TableCell>
                        <TableCell>{campaign.ctr.toFixed(2)}%</TableCell>
                        <TableCell>{campaign.conversionRate.toFixed(2)}%</TableCell>
                        <TableCell className="text-green-600">{campaign.roi}%</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center py-2">
              <Button variant="link" size="sm">
                View All Campaigns
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Traffic and conversion metrics by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Chart placeholder - Channel performance</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Content with highest engagement and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance.slice(0, 3).map((content: ContentPerformance) => (
                  <div key={content.id} className="flex justify-between items-start pb-3 border-b last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium line-clamp-1">{content.title}</div>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2 text-xs">{content.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(content.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex flex-col items-end">
                        <div className="font-medium">{content.views.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-medium">{content.conversions}</div>
                        <div className="text-xs text-muted-foreground">Conv.</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  // Render campaigns tab
  const renderCampaignsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Input placeholder="Search campaigns..." className="w-[250px]" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Paused</DropdownMenuItem>
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuItem>Draft</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Campaign
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
                  <TableHead>Timeline</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Conv. Rate</TableHead>
                  <TableHead>CPC</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketingCampaigns.map((campaign: MarketingCampaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.platform}</TableCell>
                    <TableCell>
                      <CampaignStatusBadge status={campaign.status} />
                    </TableCell>
                    <TableCell>
                      {campaign.startDate && new Date(campaign.startDate).toLocaleDateString()} - 
                      {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}
                    </TableCell>
                    <TableCell>
                      ${campaign.budgetSpent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                    </TableCell>
                    <TableCell>{campaign.impressions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                    <TableCell>{campaign.ctr.toFixed(2)}%</TableCell>
                    <TableCell>{campaign.conversions.toLocaleString()}</TableCell>
                    <TableCell>{campaign.conversionRate.toFixed(2)}%</TableCell>
                    <TableCell>${campaign.cpc.toFixed(2)}</TableCell>
                    <TableCell className={campaign.roi > 0 ? "text-green-600" : "text-muted-foreground"}>
                      {campaign.roi > 0 ? `${campaign.roi}%` : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {campaign.status === 'active' ? 'Pause Campaign' : 
                             campaign.status === 'paused' ? 'Resume Campaign' : 'Archive Campaign'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render channel performance tab
  const renderChannelPerformanceTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic by Channel</CardTitle>
              <CardDescription>Distribution of website visitors by acquisition channel</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Chart placeholder - Traffic by channel</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversion by Channel</CardTitle>
              <CardDescription>Conversion rate and total conversions by channel</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Chart placeholder - Conversions by channel</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance Metrics</CardTitle>
            <CardDescription>Detailed metrics for each marketing channel</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Visitors</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Cost Per Acquisition</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channelPerformance.map((channel: ChannelPerformance) => (
                  <TableRow key={channel.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted mr-2">
                          {channel.customIcon ? (
                            <channel.icon className="h-4 w-4" />
                          ) : (
                            <channel.icon className="h-4 w-4" />
                          )}
                        </div>
                        <span className="font-medium">{channel.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>{channel.visitors.toLocaleString()}</TableCell>
                    <TableCell>{channel.sessions.toLocaleString()}</TableCell>
                    <TableCell>{channel.bounceRate}%</TableCell>
                    <TableCell>{channel.conversionRate.toFixed(1)}%</TableCell>
                    <TableCell>{channel.costPerAcquisition > 0 ? `$${channel.costPerAcquisition}` : 'N/A'}</TableCell>
                    <TableCell>${channel.revenue.toLocaleString()}</TableCell>
                    <TableCell className={channel.roi > 0 ? "text-green-600" : "text-muted-foreground"}>
                      {channel.roi > 0 ? `${channel.roi}%` : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render content performance tab
  const renderContentPerformanceTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Input placeholder="Search content..." className="w-[250px]" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Blog Post</DropdownMenuItem>
                <DropdownMenuItem>Case Study</DropdownMenuItem>
                <DropdownMenuItem>Video</DropdownMenuItem>
                <DropdownMenuItem>Whitepaper</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="last90">Last 90 Days</SelectItem>
                <SelectItem value="last180">Last 180 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">14,400</div>
              <div className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs previous
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24.8%</div>
              <div className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.2% vs previous
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Shares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">845</div>
              <div className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.4% vs previous
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Content Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">309</div>
              <div className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.7% vs previous
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Engagement metrics for published content</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Conv. Rate</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentPerformance.map((content: ContentPerformance) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="truncate max-w-xs">{content.title}</div>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{content.type}</Badge>
                    </TableCell>
                    <TableCell>{new Date(content.publishDate).toLocaleDateString()}</TableCell>
                    <TableCell>{content.views.toLocaleString()}</TableCell>
                    <TableCell>{content.engagement.toLocaleString()}</TableCell>
                    <TableCell>{content.shares}</TableCell>
                    <TableCell>{content.conversions}</TableCell>
                    <TableCell>{((content.conversions / content.views) * 100).toFixed(2)}%</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          <DropdownMenuItem>Edit Content</DropdownMenuItem>
                          <DropdownMenuItem>Promote Content</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing Analytics</h1>
            <p className="text-muted-foreground">
              Track performance across all marketing channels and campaigns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="12months">Last 12 months</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="channels">Channel Performance</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {renderOverviewTab()}
          </TabsContent>
          
          <TabsContent value="campaigns" className="space-y-4">
            {renderCampaignsTab()}
          </TabsContent>
          
          <TabsContent value="channels" className="space-y-4">
            {renderChannelPerformanceTab()}
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            {renderContentPerformanceTab()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MarketingAnalytics;