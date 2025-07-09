import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowRight,
  Calendar,
  LayoutDashboard,
  LineChart,
  Megaphone,
  RotateCw,
  Star,
  Wand2
} from 'lucide-react';
import { useUserRole } from '@/contexts/UserRoleContext';
import AIContentGenerator from '@/components/SocialMediaAdvancedAI';
import SocialMediaContentCalendar from '@/components/SocialMediaContentCalendar';
import SocialMediaAnalyticsDashboard from '@/components/SocialMediaAnalyticsDashboard';
import { SocialPlatform, ContentType, PostStatus } from '@/components/EnhancedSocialMediaManager';

// Types for the data we'll fetch from backend
interface BusinessEntity {
  id: number;
  name: string;
  type: string;
  slug: string;
}

interface SocialPost {
  id: string;
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

interface SocialDashboardData {
  entities: BusinessEntity[];
  posts: SocialPost[];
  analytics: AnalyticsData;
}

export default function SocialMediaDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  // Fetch social media dashboard data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/social-dashboard'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Handle refreshing data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data refreshed",
        description: "Social media data has been updated.",
      });
    } catch (err) {
      toast({
        title: "Error refreshing data",
        description: "Failed to refresh social media data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle analyzing social media metrics with AI
  const analyzeSocialMediaMetrics = async () => {
    if (!dashboardData.analytics || !dashboardData.analytics.accounts.length) {
      toast({
        title: "No data to analyze",
        description: "There is no social media data available for analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      // Format data for the API
      const platformData = dashboardData.analytics.accounts.map(account => ({
        platform: account.platform,
        followers: account.followers,
        engagement: account.engagement,
        reachPercent: (account.reach / account.impressions) * 100,
        posts: 10, // Placeholder - would come from real data
        topPostTypes: ['image', 'carousel', 'video'] // Placeholder - would come from real data
      }));
      
      // Call our new API
      const response = await fetch('/api/social-media/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformData,
          timeRange: dashboardData.analytics.timeRange
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Show the analysis in a toast notification
      toast({
        title: "Social Media Analysis",
        description: (
          <div className="mt-2 space-y-2">
            <p className="font-medium text-sm">{data.overview}</p>
            <div className="space-y-1">
              {data.insights.slice(0, 2).map((insight: any, index: number) => (
                <div key={index} className="text-xs">
                  <span className="font-medium">{insight.title}: </span>
                  {insight.description.substring(0, 120)}...
                </div>
              ))}
            </div>
            <div className="pt-1 text-xs font-medium">
              See analytics tab for full details
            </div>
          </div>
        ),
        duration: 8000,
      });
      
    } catch (error) {
      console.error('Error analyzing social media metrics:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze social media data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle AI content generation
  const handleGenerateContent = async (
    prompt: string, 
    platform: SocialPlatform, 
    contentType: ContentType, 
    options: any
  ) => {
    try {
      const selectedEntityObj = selectedEntity === 'all' 
        ? dashboardData.entities[0] 
        : dashboardData.entities.find(e => e.id === selectedEntity);
      
      if (!selectedEntityObj) {
        throw new Error("No business entity selected");
      }
      
      // Get business type from entity type
      const businessType = selectedEntityObj.type;
      
      // Determine content goals based on options
      const contentGoals = [
        prompt,
        `Tone: ${options.tone}`
      ];
      
      if (options.targetAudience) {
        contentGoals.push(`Target audience: ${options.targetAudience}`);
      }
      
      if (options.callToAction) {
        contentGoals.push(`Call to action: ${options.callToAction}`);
      }
      
      // Prepare brand data
      const brand = {
        name: selectedEntityObj.name,
        voice: options.tone,
        targetAudience: options.targetAudience || "general audience",
        keyProducts: ["business services", "consulting"] // Default products
      };
      
      // Call our new API
      const response = await fetch('/api/social-media/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessType,
          platform,
          contentGoals,
          brand,
          count: 1 // Just generate one piece of content
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Format the response nicely
      if (data.contentIdeas && data.contentIdeas.length > 0) {
        const idea = data.contentIdeas[0];
        const formattedContent = `${idea.title}\n\n${idea.description}\n\n` +
          `Content type: ${idea.contentType}\n` +
          `Call to action: ${idea.callToAction}\n` +
          `Best time to post: ${idea.bestTimeToPost}\n\n` +
          (options.includeHashtags && idea.suggestedHashtags?.length 
            ? idea.suggestedHashtags.map(tag => `#${tag}`).join(' ') 
            : '');
            
        return formattedContent;
      }
      
      throw new Error('No content generated');
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Content generation failed",
        description: "There was an error generating AI content. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Handle exporting analytics data
  const handleExportAnalytics = async (format: 'pdf' | 'csv' | 'xlsx') => {
    try {
      toast({
        title: "Export initiated",
        description: `Exporting data as ${format.toUpperCase()}. The file will download shortly.`,
      });
      
      // In a real implementation, this would call an API endpoint
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Export complete",
        description: `Your ${format.toUpperCase()} file has been downloaded.`,
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the analytics data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Placeholder data for demonstration purposes
  // In production, this would come from the API
  const dashboardData: SocialDashboardData = data?.data || {
    entities: [
      { id: 1, name: "Digital Merch Pros", type: "business", slug: "digital-merch-pros" },
      { id: 2, name: "Mystery Hype", type: "business", slug: "mystery-hype" },
      { id: 3, name: "Lone Star Custom Clothing", type: "business", slug: "lone-star-custom-clothing" },
      { id: 4, name: "Alcoeaze", type: "business", slug: "alcoeaze" },
      { id: 5, name: "Hide Cafe Bars", type: "business", slug: "hide-cafe-bars" }
    ],
    posts: [],
    analytics: {
      timeRange: '30d',
      accounts: [],
      topPosts: [],
      audienceInsights: {
        demographics: {
          age: {},
          gender: {},
          location: {}
        },
        interests: {},
        activeHours: {}
      },
      trends: {
        followers: [],
        engagement: [],
        impressions: []
      },
      totals: {
        followers: 0,
        engagement: 0,
        impressions: 0,
        reach: 0,
        clicks: 0,
        engagementRate: 0
      }
    }
  };
  
  // Handle entity selection
  const handleEntityChange = (value: string) => {
    setSelectedEntity(value === 'all' ? 'all' : parseInt(value));
  };
  
  // Handle creating a new post
  const handleCreatePost = () => {
    toast({
      title: "Creating new post",
      description: "Opening post editor...",
    });
    // In a real implementation, this would open a modal or navigate to a post creation page
  };
  
  // Handle editing a post
  const handleEditPost = (postId: string) => {
    toast({
      title: "Editing post",
      description: `Opening editor for post ${postId}...`,
    });
    // In a real implementation, this would open a modal with the post data
  };
  
  // Handle viewing a post
  const handleViewPost = (postId: string) => {
    toast({
      title: "Viewing post",
      description: `Opening post ${postId}...`,
    });
    // In a real implementation, this would open a modal with the post details
  };
  
  // Handle deleting a post
  const handleDeletePost = (postId: string) => {
    toast({
      title: "Deleting post",
      description: `Are you sure you want to delete post ${postId}?`,
      variant: "destructive",
    });
    // In a real implementation, this would show a confirmation dialog
  };
  
  // Handle publishing a post
  const handlePublishPost = (postId: string) => {
    toast({
      title: "Publishing post",
      description: `Post ${postId} will be published immediately.`,
    });
    // In a real implementation, this would call an API to publish the post
  };
  
  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Social Media Dashboard</CardTitle>
          <CardDescription>
            There was an error loading the social media dashboard data. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Dashboard</h1>
          <p className="text-muted-foreground">
            Manage, analyze, and optimize your social media presence across all platforms
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
            onValueChange={handleEntityChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {dashboardData.entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id.toString()}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={analyzeSocialMediaMetrics}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">Analyze</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Content Calendar</span>
            <span className="sm:hidden">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="ai-content" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">AI Content Generator</span>
            <span className="sm:hidden">AI Content</span>
          </TabsTrigger>
          <TabsTrigger value="manager" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Full Manager</span>
            <span className="sm:hidden">Manager</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="mt-6">
          <SocialMediaAnalyticsDashboard 
            entities={dashboardData.entities}
            analytics={dashboardData.analytics}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            onExport={handleExportAnalytics}
            onTimeRangeChange={(range) => {
              // Console log removed for performance optimization
              // Handle time range change logic here if needed
            }}
            onPlatformSelect={(platform) => {
              // Console log removed for performance optimization
              // Handle platform selection logic here if needed
            }}
            onEntitySelect={(entityId) => 
              setSelectedEntity(entityId)
            }
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Content Calendar</h2>
            <Button onClick={handleCreatePost}>
              Create Post
            </Button>
          </div>
          
          <SocialMediaContentCalendar 
            posts={dashboardData.posts}
            entities={dashboardData.entities}
            onCreatePost={handleCreatePost}
            onEditPost={handleEditPost}
            onViewPost={handleViewPost}
            onDeletePost={handleDeletePost}
            onPublishPost={handlePublishPost}
          />
        </TabsContent>
        
        <TabsContent value="ai-content" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 order-2 md:order-1">
              <AIContentGenerator 
                onGenerate={handleGenerateContent}
              />
            </div>
            
            <div className="col-span-1 md:col-span-1 order-1 md:order-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Effective Prompts</h3>
                    <p className="text-sm text-muted-foreground">
                      Be specific about your goals, audience, and tone. Include keywords related to your brand.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Platform-Specific Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Each platform has different content requirements and audience expectations. Select the appropriate platform for targeted results.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Content Mix</h3>
                    <p className="text-sm text-muted-foreground">
                      Aim for 80% value-adding content and 20% promotional content for best engagement rates.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-blue-500" />
                    Popular Prompt Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Product Launch",
                      description: "Create excitement for our new [product] that helps customers [benefit]"
                    },
                    {
                      title: "Engagement Question",
                      description: "Ask a thought-provoking question about [industry topic] to spark conversation"
                    },
                    {
                      title: "Educational Content",
                      description: "Share 5 tips about [topic] that our audience would find valuable"
                    }
                  ].map((template, index) => (
                    <div key={index} className="p-3 border rounded-md hover:bg-muted transition-colors cursor-pointer">
                      <div className="font-medium">{template.title}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                      <Button variant="ghost" size="sm" className="mt-2 h-7 w-full justify-start">
                        <ArrowRight className="h-3.5 w-3.5 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="manager" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Social Media Manager</CardTitle>
              <CardDescription>
                Access the full-featured social media management system with all capabilities and tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Button size="lg" asChild>
                <a href="/business-operations">
                  Open Full Manager
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-4 max-w-md text-center">
                The full manager provides advanced automation capabilities, multi-account management, campaign tracking, and detailed analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}