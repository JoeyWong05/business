import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import {
  BarChart2,
  Calendar,
  ChevronsUpDown,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Instagram,
  Loader,
  MousePointer as Pointer,
  PieChart as PieChartIcon,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
  Youtube,
} from 'lucide-react';
import { SiFacebook, SiLinkedin, SiPinterest, SiTiktok } from 'react-icons/si';
import { BsTwitter } from 'react-icons/bs';

// Import these types from your EnhancedSocialMediaManager component
import { SocialPlatform, ContentType, PostStatus } from './EnhancedSocialMediaManager';

interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  handle: string;
  profileUrl: string;
  profileImageUrl?: string;
  followers: number;
  followersGrowth: number;
  engagement: number;
  impressions: number;
  reach: number;
  clicks?: number;
}

interface SocialPost {
  id: string;
  accountId: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  contentType: ContentType;
  status: PostStatus;
  publishedAt?: Date | string;
  stats?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    clicks?: number;
    engagement: number;
  };
}

interface AudienceInsights {
  demographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
  };
  interests: Record<string, number>;
  activeHours: Record<string, number>;
}

interface AnalyticsData {
  timeRange: '7d' | '30d' | '90d' | 'ytd' | 'all';
  accounts: SocialAccount[];
  topPosts: SocialPost[];
  audienceInsights: AudienceInsights;
  trends: {
    followers: {
      date: string;
      total: number;
      [platform: string]: number | string;
    }[];
    engagement: {
      date: string;
      total: number;
      [platform: string]: number | string;
    }[];
    impressions: {
      date: string;
      total: number;
      [platform: string]: number | string;
    }[];
  };
  totals: {
    followers: number;
    engagement: number;
    impressions: number;
    reach: number;
    clicks: number;
    engagementRate: number;
  };
}

interface SocialMediaAnalyticsDashboardProps {
  entities: Array<{ id: number, name: string, type: string }>;
  analytics: AnalyticsData;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  onExport?: (format: 'pdf' | 'csv' | 'xlsx') => Promise<void>;
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | 'ytd' | 'all') => Promise<void>;
  onPlatformSelect?: (platform: SocialPlatform | 'all') => void;
  onEntitySelect?: (entityId: number | 'all') => void;
}

const SocialMediaAnalyticsDashboard: React.FC<SocialMediaAnalyticsDashboardProps> = ({
  entities,
  analytics,
  isLoading = false,
  onRefresh,
  onExport,
  onTimeRangeChange,
  onPlatformSelect,
  onEntitySelect
}) => {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd' | 'all'>(analytics.timeRange);
  
  // Platform colors for charts
  const platformColors = {
    [SocialPlatform.FACEBOOK]: '#1877F2',
    [SocialPlatform.INSTAGRAM]: '#E1306C',
    [SocialPlatform.TWITTER]: '#1DA1F2',
    [SocialPlatform.LINKEDIN]: '#0A66C2',
    [SocialPlatform.PINTEREST]: '#E60023',
    [SocialPlatform.TIKTOK]: '#000000',
    [SocialPlatform.YOUTUBE]: '#FF0000',
    total: '#6E6E6E'
  };
  
  // Format numbers with commas
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
  
  // Handle time range change
  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | 'ytd' | 'all') => {
    setTimeRange(range);
    if (onTimeRangeChange) onTimeRangeChange(range);
  };
  
  // Handle platform selection
  const handlePlatformSelect = (platform: SocialPlatform | 'all') => {
    setSelectedPlatform(platform);
    if (onPlatformSelect) onPlatformSelect(platform);
  };
  
  // Handle entity selection
  const handleEntitySelect = (entityId: number | 'all') => {
    setSelectedEntity(entityId);
    if (onEntitySelect) onEntitySelect(entityId);
  };
  
  // Get trend icon and color
  const getTrendIndicator = (value: number) => {
    if (value > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (value < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <ChevronsUpDown className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format trend value
  const formatTrendValue = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };
  
  // Get trend color class
  const getTrendColorClass = (value: number) => {
    if (value > 0) {
      return "text-green-500";
    } else if (value < 0) {
      return "text-red-500";
    } else {
      return "text-gray-500";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Media Analytics</h2>
          <p className="text-muted-foreground">
            Track performance and audience insights across social platforms
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
            onValueChange={(value) => handleEntitySelect(value === 'all' ? 'all' : parseInt(value))}
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
          
          <Select
            value={selectedPlatform}
            onValueChange={(value) => handlePlatformSelect(value as SocialPlatform | 'all')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {Object.values(SocialPlatform).map((platform) => (
                <SelectItem key={platform} value={platform}>
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(platform as SocialPlatform, 'h-4 w-4')}
                    <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={timeRange}
            onValueChange={(value) => handleTimeRangeChange(value as '7d' | '30d' | '90d' | 'ytd' | 'all')}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          {onRefresh && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onRefresh()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {onExport && (
            <Select
              onValueChange={(value) => onExport(value as 'pdf' | 'csv' | 'xlsx')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">Export PDF</SelectItem>
                <SelectItem value="csv">Export CSV</SelectItem>
                <SelectItem value="xlsx">Export Excel</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {/* Top metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Total Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totals.followers)}</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              {getTrendIndicator(analytics.accounts.reduce((sum, acc) => sum + acc.followersGrowth, 0) / analytics.accounts.length)}
              <span className={getTrendColorClass(analytics.accounts.reduce((sum, acc) => sum + acc.followersGrowth, 0) / analytics.accounts.length)}>
                {formatTrendValue(analytics.accounts.reduce((sum, acc) => sum + acc.followersGrowth, 0) / analytics.accounts.length)}
              </span>
              <span className="text-muted-foreground ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analytics.totals.engagementRate)}</div>
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <div>Industry average: 1.2%</div>
              <div>
                {analytics.totals.engagementRate > 0.012 ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Above Average
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                    Below Average
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CustomEye className="h-4 w-4 text-muted-foreground" />
              Total Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totals.impressions)}</div>
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <div>Reach: {formatNumber(analytics.totals.reach)}</div>
              <div>
                <Badge variant="outline">
                  {(analytics.totals.reach / analytics.totals.impressions * 100).toFixed(1)}% Unique
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CustomPointer className="h-4 w-4 text-muted-foreground" />
              Click-through Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(analytics.totals.clicks / analytics.totals.impressions)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {formatNumber(analytics.totals.clicks)} total clicks
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Followers and engagement charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.trends.followers}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.values(SocialPlatform)
                    .filter(platform => 
                      selectedPlatform === 'all' || platform === selectedPlatform
                    )
                    .map(platform => (
                      <Line 
                        key={platform}
                        type="monotone" 
                        dataKey={platform} 
                        stroke={platformColors[platform as SocialPlatform]} 
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  {selectedPlatform === 'all' && (
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={platformColors.total}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.trends.engagement}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.values(SocialPlatform)
                    .filter(platform => 
                      selectedPlatform === 'all' || platform === selectedPlatform
                    )
                    .map(platform => (
                      <Line 
                        key={platform}
                        type="monotone" 
                        dataKey={platform} 
                        stroke={platformColors[platform as SocialPlatform]} 
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  {selectedPlatform === 'all' && (
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={platformColors.total}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Platform performance and audience insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Growth</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.accounts
                  .filter(account => 
                    selectedPlatform === 'all' || account.platform === selectedPlatform
                  )
                  .map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(account.platform, 'h-4 w-4')}
                          <span className="font-medium">{account.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{account.handle}
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(account.followers)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIndicator(account.followersGrowth)}
                          <span className={getTrendColorClass(account.followersGrowth)}>
                            {formatTrendValue(account.followersGrowth)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatPercentage(account.engagement)}</TableCell>
                      <TableCell>{formatNumber(account.impressions)}</TableCell>
                      <TableCell>{formatNumber(account.clicks || 0)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="age">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="age">Age</TabsTrigger>
                <TabsTrigger value="gender">Gender</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="age" className="pt-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(analytics.audienceInsights.demographics.age).map(([key, value]) => ({ name: key, value }))}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="gender" className="pt-4">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.audienceInsights.demographics.gender).map(([key, value]) => ({ name: key, value }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(analytics.audienceInsights.demographics.gender).map(([key, value], index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="pt-4">
                <div className="space-y-3">
                  {Object.entries(analytics.audienceInsights.demographics.location)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([location, percentage]) => (
                      <div key={location} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{location}</span>
                          <span>{formatPercentage(percentage / 100)}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Top performing posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topPosts
              .filter(post => 
                selectedPlatform === 'all' || post.platform === selectedPlatform
              )
              .slice(0, 6)
              .map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={post.mediaUrls[0]} 
                        alt="Post media" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {getPlatformIcon(post.platform, 'h-4 w-4')}
                        <Badge variant="secondary" className="text-xs">
                          {formatPercentage(post.stats?.engagement || 0)} Engagement
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        asChild
                      >
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                    <div className="text-sm line-clamp-3">
                      {post.content}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Like className="h-3 w-3" />
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
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button variant="outline">
            View All Posts
          </Button>
        </CardFooter>
      </Card>
      
      {/* Audience insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Audience Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={Object.entries(analytics.audienceInsights.interests)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([key, value]) => ({ name: key, value }))
                  }
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(analytics.audienceInsights.activeHours)
                    .map(([key, value]) => ({ 
                      name: key.padStart(2, '0') + ':00', 
                      value 
                    }))
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Custom icons
const CustomEye = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Like = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const Share = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const MessageCircle = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CustomPointer = (props: React.SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <path d="M22 14a8 8 0 0 1-8 8" />
    <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
    <path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" />
    <path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" />
    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);

export default SocialMediaAnalyticsDashboard;