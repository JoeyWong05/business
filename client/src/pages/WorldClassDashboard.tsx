import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import StatCard from "@/components/StatCard";
import ActivityItem from "@/components/ActivityItem";
import SOPItem from "@/components/SOPItem";
import RecommendationItem from "@/components/RecommendationItem";
import CategoryCard from "@/components/CategoryCard";
import TimeZoneWidget from "@/components/TimeZoneWidget";
import CostBreakdownChart from "@/components/CostBreakdownChart";
import CostForecastChart from "@/components/CostForecastChart";
import SalesDashboardComponents from "@/components/SalesDashboardCard";
const { SalesDashboardCard } = SalesDashboardComponents;
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialPlatform, ContentType, PostStatus } from "@/components/EnhancedSocialMediaManager";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  BellRing,
  CalendarDays,
  Check,
  CheckCircle2,
  CheckCheck,
  ChevronRight,
  ClipboardList,
  Clock,
  Cpu,
  DollarSign,
  ExternalLink,
  TrendingDown,
  FileText,
  GanttChartSquare,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  MoreHorizontal,
  PanelRightOpen,
  PieChart,
  Plus,
  PlusCircle,
  RefreshCw,
  Settings,
  Share2,
  Sparkles,
  Target,
  ThumbsUp,
  Timer,
  Users,
  Wand2,
  Zap
} from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";

export default function WorldClassDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  // Fetch business entities
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
  });
  
  // Fetch dashboard statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard-stats'],
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch recent activities
  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const res = await fetch('/api/activities?limit=5');
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    },
  });

  // Fetch recent SOPs
  const { data: sopsData, isLoading: isLoadingSops } = useQuery({
    queryKey: ['/api/sops'],
    queryFn: async () => {
      const res = await fetch('/api/sops');
      if (!res.ok) throw new Error('Failed to fetch SOPs');
      return res.json();
    },
  });

  // Fetch recommendations
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['/api/recommendations'],
    queryFn: async () => {
      const res = await fetch('/api/recommendations?status=pending');
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return res.json();
    },
  });
  
  // Fetch social media data
  const { data: socialMediaData, isLoading: isLoadingSocialMedia } = useQuery({
    queryKey: ['/api/social-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/social-dashboard');
      if (!res.ok) throw new Error('Failed to fetch social media data');
      return res.json();
    },
  });

  // Process data
  const stats = statsData?.stats || {
    totalTools: 0,
    totalMonthlyCost: 0,
    totalSops: 0,
    automationScore: 0
  };

  const categories = categoriesData?.categories || [];
  const activities = activitiesData?.activities || [];
  const allSops = sopsData?.sops || [];
  const recommendations = recommendationsData?.recommendations || [];
  const socialMedia = socialMediaData || { posts: [], entities: [] };
  
  // Filter data based on selected entity if in entity view mode
  let displaySops = allSops;
  let displaySocialPosts = socialMedia.posts || [];
  
  if (selectedEntity !== "all") {
    // Filter SOPs for selected entity
    displaySops = allSops.filter(sop => {
      return sop.businessEntityId === Number(selectedEntity) || sop.businessEntityId === null;
    });
    
    // Filter social posts for selected entity
    displaySocialPosts = displaySocialPosts.filter(post => {
      return post.entityId === Number(selectedEntity);
    });
  }
  
  const toolsByCategory = statsData?.toolsByCategory || {};

  const getCategoryIcon = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    return category ? category.icon : "apps";
  };

  const getCategoryColor = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    return category ? category.color : "text-gray-500";
  };

  // Get all business entities
  const entities = entitiesData?.entities || [];

  // Get currently selected entity
  const selectedEntityData = entities.find(entity => entity.id.toString() === selectedEntity);
  
  // Format date from now
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };
  
  // Get priority status styling
  const getPriorityStyles = (priority: string) => {
    switch(priority) {
      case 'high':
        return { 
          badge: 'destructive',
          icon: <Zap className="h-4 w-4" />,
          text: 'text-red-600 dark:text-red-400'
        };
      case 'medium':
        return { 
          badge: 'default',
          icon: <ArrowUpRight className="h-4 w-4" />,
          text: 'text-blue-600 dark:text-blue-400' 
        };
      default:
        return { 
          badge: 'secondary', 
          icon: <Clock className="h-4 w-4" />,
          text: 'text-gray-600 dark:text-gray-400'
        };
    }
  };
  
  // Platform styling for social media
  const getPlatformStyles = (platform: SocialPlatform) => {
    switch(platform) {
      case SocialPlatform.INSTAGRAM:
        return {
          name: 'Instagram',
          icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
          bgColor: 'bg-pink-500',
          textColor: 'text-pink-600 dark:text-pink-400',
          borderColor: 'border-pink-200 dark:border-pink-900',
          bgLightColor: 'bg-pink-50 dark:bg-pink-900/20'
        };
      case SocialPlatform.FACEBOOK:
        return {
          name: 'Facebook',
          icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>,
          bgColor: 'bg-blue-600',
          textColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-900',
          bgLightColor: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case SocialPlatform.TWITTER:
        return {
          name: 'Twitter',
          icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>,
          bgColor: 'bg-sky-500',
          textColor: 'text-sky-600 dark:text-sky-400',
          borderColor: 'border-sky-200 dark:border-sky-900',
          bgLightColor: 'bg-sky-50 dark:bg-sky-900/20'
        };
      case SocialPlatform.LINKEDIN:
        return {
          name: 'LinkedIn',
          icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
          bgColor: 'bg-blue-700',
          textColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-900',
          bgLightColor: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case SocialPlatform.TIKTOK:
        return {
          name: 'TikTok',
          icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>,
          bgColor: 'bg-rose-500',
          textColor: 'text-rose-600 dark:text-rose-400',
          borderColor: 'border-rose-200 dark:border-rose-900',
          bgLightColor: 'bg-rose-50 dark:bg-rose-900/20'
        };
      default:
        return {
          name: 'Social',
          icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-600 dark:text-gray-400',
          borderColor: 'border-gray-200 dark:border-gray-800',
          bgLightColor: 'bg-gray-50 dark:bg-gray-900/20'
        };
    }
  };

  return (
    <MainLayout
      title=""
      description=""
    >
      {/* Hero Section with Entity Selector */}
      <div className="mb-8 p-8 bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tighter">
              {selectedEntityData 
                ? `${selectedEntityData.name} Dashboard` 
                : "DMPHQ Command Center"
              }
            </h1>
            <p className="text-muted-foreground">
              {selectedEntityData 
                ? `Comprehensive operational view for ${selectedEntityData.name}`
                : "Unified view of operations across all your business entities"
              }
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <span>System operational</span>
              <span className="px-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground">Last updated: just now</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Entity</label>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[240px] bg-background/60 backdrop-blur-sm border-primary/20">
                <SelectValue placeholder="Select an entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities (Enterprise-wide)</SelectItem>
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
            
            <div className="flex pt-2">
              <Button 
                variant="link" 
                size="sm" 
                className="flex items-center text-xs"
                onClick={() => toast({
                  title: "Entity Management",
                  description: "Entity management coming soon"
                })}
              >
                <Settings className="h-3 w-3 mr-1" />
                Manage entities
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Command Center Controls - Moved to be more visible */}
      <div className="bg-white dark:bg-gray-900 p-4 mb-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="mr-3 text-lg font-semibold text-primary">Command Center:</span>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
                <TabsTrigger 
                  value="actions" 
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Actions
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              asChild
            >
              <Link href="/enhanced-dashboard">
                <Sparkles className="h-4 w-4 mr-2" />
                Advanced Mode
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Original Dashboard Tabs - Keep content but hide controls */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Priority Tasks Section */}
          <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center text-red-700 dark:text-red-400">
                <Zap className="h-5 w-5 mr-2" />
                Priority Tasks
              </CardTitle>
              <CardDescription>Items that need your attention today</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3 pt-2">
                {recommendations.filter(rec => rec.status === 'pending' && rec.priority === 'high').slice(0, 2).map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-red-100 dark:border-red-900/30">
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-red-700 dark:text-red-400">{rec.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{rec.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                          High Priority
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Added {formatDate(rec.createdAt.toString())}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Take Action
                    </Button>
                  </div>
                ))}
                {recommendations.filter(rec => rec.status === 'pending' && rec.priority === 'high').length === 0 && (
                  <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <CheckCircle2 className="h-6 w-6 mx-auto text-green-500" />
                      <p>No priority tasks at the moment</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Enhanced Automation Status Section */}
          <Card className="border-2 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/30 shadow-md mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center text-purple-700 dark:text-purple-400">
                <Wand2 className="h-5 w-5 mr-2" />
                Enterprise Automation Status
              </CardTitle>
              <CardDescription>Current business-wide automation progress and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-purple-100 dark:border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400">Enterprise Score</h3>
                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400">Overall</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 text-xl font-bold border-4 border-purple-200 dark:border-purple-800">
                      {typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore}%
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {(typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 75 
                          ? 'Excellent Automation' 
                          : (typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 50 
                            ? 'Good Progress' 
                            : 'Needs Improvement'
                        }
                      </div>
                      <Progress 
                        value={typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore} 
                        className="h-2 w-full [--progress-foreground:theme(colors.purple.600)]"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enterprise-wide business process efficiency
                      </p>
                    </div>
                  </div>
                </div>
                
                {entities.slice(0, 2).map((entity, idx) => (
                  <div key={entity.id} className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-purple-100 dark:border-purple-900/30">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400">{entity.name}</h3>
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400">Entity</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 text-xl font-bold border-4 border-purple-200 dark:border-purple-800">
                        {65 + idx * 8}%
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {idx === 0 ? 'Good Progress' : 'Advanced Automation'}
                        </div>
                        <Progress 
                          value={65 + idx * 8} 
                          className="h-2 w-full [--progress-foreground:theme(colors.purple.600)]"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {idx === 0 ? '3 processes need optimization' : 'All core processes automated'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2 bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Automation by Department</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Marketing', score: 82, color: 'bg-red-500' },
                      { name: 'Sales', score: 75, color: 'bg-blue-500' },
                      { name: 'Customer Service', score: 68, color: 'bg-amber-500' },
                      { name: 'Finance', score: 59, color: 'bg-green-500' }
                    ].map((dept, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{dept.name}</span>
                          <span className="font-medium">{dept.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${dept.color}`} 
                            style={{ width: `${dept.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Automation Opportunities</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Customer onboarding automation</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Potential 28% time saving</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Inventory management workflow</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Potential 35% error reduction</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-4 w-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      </div>
                      <div>
                        <p className="text-xs font-medium">Financial reporting pipeline</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Potential 42% time saving</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400"
                    asChild
                  >
                    <Link href="/department-automation">
                      <span className="flex items-center justify-center w-full">
                        View All Opportunities
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                asChild
              >
                <Link href="/department-automation">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance Business Automation
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Company Health Score Section */}
          <Card className="border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 shadow-md mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center text-green-700 dark:text-green-400">
                <HeartPulse className="h-5 w-5 mr-2" />
                Company Health Score
              </CardTitle>
              <CardDescription>Overall business health metrics across all operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-3">
                {/* Enterprise-wide score */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-green-100 dark:border-green-900/30 md:col-span-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-muted-foreground">Enterprise Health</h3>
                    <Badge className="bg-green-600">Enterprise-wide</Badge>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 text-xl font-bold border-4 border-green-200 dark:border-green-800">
                        {/* Calculate a combined health score from automation, financial, and operational metrics */}
                        {Math.round((typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) + 80 + 75) / 3}%
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Automation</span>
                            <span className="font-medium">{typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore}%</span>
                          </div>
                          <Progress value={typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore} className="h-2 bg-green-100 dark:bg-green-950" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Financial</span>
                            <span className="font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-2 bg-green-100 dark:bg-green-950" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Operational</span>
                            <span className="font-medium">75%</span>
                          </div>
                          <Progress value={75} className="h-2 bg-green-100 dark:bg-green-950" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Entity-specific health scores */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-green-100 dark:border-green-900/30 md:col-span-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm text-muted-foreground">Entity-Specific Health</h3>
                  </div>
                  
                  {selectedEntity !== "all" ? (
                    <div className="flex flex-col h-full justify-center items-center">
                      <div className="mb-4">
                        <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 text-3xl font-bold border-4 border-green-200 dark:border-green-800">
                          {/* Entity-specific score calculation */}
                          {selectedEntityData && (selectedEntityData.id % 2 === 0 ? 82 : 78)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium">{selectedEntityData?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedEntityData && (selectedEntityData.id % 2 === 0 ? 
                            "Excellent health across all metrics" : 
                            "Good overall, needs improvement in automation")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full">
                      {entities.slice(0, 4).map((entity, idx) => (
                        <div key={entity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 text-lg font-bold border-2 border-green-200 dark:border-green-800">
                            {idx % 2 === 0 ? 82 : 78}%
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{entity.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {idx % 2 === 0 ? "Excellent" : "Good"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Improvement Insights */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-green-100 dark:border-green-900/30">
                <h3 className="font-medium text-sm mb-2">Improvement Opportunities</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Increase automation in customer service processes (+12% potential)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Optimize inventory management to reduce overhead costs (+8% potential)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Improve response time on social media inquiries (+5% potential)</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                asChild
              >
                <Link href="/financial-health">
                  <HeartPulse className="mr-2 h-4 w-4" />
                  View Detailed Health Analysis
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Sales Dashboard Card - NEW PROMINENT POSITION */}
          <div className="mb-6">
            <SalesDashboardCard 
              title="Sales Pipeline Overview"
              value="$138,250"
              description="14 active deals"
              trend={{ value: 12, isPositive: true }}
              icon={<DollarSign className="h-4 w-4" />}
              variant="success"
            />
          </div>

          {/* Social Media Priority Section */}
          <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 shadow-md mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center text-blue-700 dark:text-blue-400">
                <MessageSquare className="h-5 w-5 mr-2" />
                Social Media Priority
              </CardTitle>
              <CardDescription>Posts requiring immediate attention across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingSocialMedia ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : displaySocialPosts.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No social media posts requiring attention</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="mt-2" 
                      asChild
                    >
                      <Link href="/social-media-dashboard">
                        View all social media
                      </Link>
                    </Button>
                  </div>
                ) : (
                  displaySocialPosts
                    .filter(post => post.status === PostStatus.PENDING_RESPONSE || post.status === PostStatus.NEEDS_ATTENTION)
                    .slice(0, 3)
                    .map((post, index) => {
                      const platformStyle = getPlatformStyles(post.platform);
                      return (
                        <div 
                          key={post.id || index} 
                          className={`rounded-lg p-4 border ${platformStyle.borderColor} ${platformStyle.bgLightColor}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`rounded-full p-2 ${platformStyle.bgColor} text-white flex-shrink-0`}>
                              {platformStyle.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-medium ${platformStyle.textColor}`}>
                                  {platformStyle.name}
                                </span>
                                <Badge variant={post.status === PostStatus.NEEDS_ATTENTION ? "destructive" : "outline"} className="text-xs">
                                  {post.status === PostStatus.NEEDS_ATTENTION ? "Urgent" : "Pending Response"}
                                </Badge>
                                <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                                  {formatDate(post.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>{post.stats?.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>{post.stats?.comments || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="h-3 w-3" />
                                  <span>{post.stats?.shares || 0}</span>
                                </div>
                                
                                <Button variant="ghost" size="sm" className="ml-auto h-6 gap-1" asChild>
                                  <Link href={`/social-media-dashboard?post=${post.id}`}>
                                    Respond
                                    <ArrowRight className="h-3 w-3" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link href="/social-media-dashboard">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Manage Social Media
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tool Count Card */}
            <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow border-none">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Tools</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <GanttChartSquare className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <CardDescription>Business applications</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col">
                  <div className="text-3xl font-bold">{stats.totalTools}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Across {categories.length} business functions
                  </div>
                  <Progress 
                    value={75} 
                    className="h-1.5 mt-3" 
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Coverage</span>
                    <Badge variant="outline" className="font-normal bg-primary/5">75%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Monthly Cost Card */}
            <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mt-10 -mr-10"></div>
              <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">Cost Overview</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground pt-1">Monthly subscription spending</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="flex flex-col">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">${stats.totalMonthlyCost.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1.5 text-emerald-500 dark:text-emerald-400" />
                    ${(stats.totalMonthlyCost * 12).toFixed(2)} annually
                  </div>
                  
                  <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                    <div className="flex items-center text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      <span>5.2% decrease vs. previous month</span>
                    </div>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1">
                      Your tool spending is below the projected budget for this month.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* SOP Card */}
            <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow border-none">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">SOPs</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center">
                    <ClipboardList className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <CardDescription>Standard Operating Procedures</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col">
                  <div className="text-3xl font-bold">{stats.totalSops}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round(stats.totalSops * 0.75)} AI-generated
                  </div>
                  <div className="flex space-x-1 mt-3">
                    {categories.slice(0, 5).map((category, idx) => (
                      <div 
                        key={idx} 
                        className="h-1.5 rounded-full flex-1" 
                        style={{ 
                          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][idx % 5]
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Distribution by category
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Automation Score Card */}
            <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow border-none">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Automation</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                    <Wand2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardDescription>Operational efficiency score</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col">
                  <div className="text-3xl font-bold">
                    {typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 75 
                      ? 'Excellent' 
                      : (typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 50 
                        ? 'Good' 
                        : 'Needs improvement'
                    }
                  </div>
                  <Progress 
                    value={typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore} 
                    className={`h-1.5 mt-3 ${
                      (typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 75 
                        ? '[--progress-foreground:theme(colors.purple.600)]' 
                        : (typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 50 
                          ? '[--progress-foreground:theme(colors.purple.400)]' 
                          : '[--progress-foreground:theme(colors.purple.300)]'
                    }`}
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Beginner</span>
                    <span className="text-muted-foreground">Advanced</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Primary Dashboard Content - 2 columns on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Activity and Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mt-10 -mr-10"></div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                      Quick Navigation
                    </CardTitle>
                    <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <PanelRightOpen className="h-5 w-5 text-primary dark:text-primary-400" />
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground pt-1">Frequently used sections and tools</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <Link href="/social-media">
                      <div className="group hover:bg-pink-50 dark:hover:bg-pink-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-pink-100 dark:hover:border-pink-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-pink-100 dark:border-pink-800/30">
                          <Target className="h-6 w-6 text-pink-500 dark:text-pink-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Social Media</div>
                      </div>
                    </Link>
                    
                    <Link href="/business-strategy">
                      <div className="group hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-blue-100 dark:border-blue-800/30">
                          <PieChart className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Strategy</div>
                      </div>
                    </Link>
                    
                    <Link href="/meetings">
                      <div className="group hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-indigo-100 dark:border-indigo-800/30">
                          <CalendarDays className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Meetings</div>
                      </div>
                    </Link>
                    
                    <Link href="/academy">
                      <div className="group hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-amber-100 dark:hover:border-amber-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-amber-100 dark:border-amber-800/30">
                          <GraduationCap className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Training Academy</div>
                        <div className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-400 font-medium inline-block mt-1">New</div>
                      </div>
                    </Link>
                    
                    <Link href="/sales-dashboard">
                      <div className="group hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-blue-100 dark:border-blue-800/30">
                          <BarChart2 className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Sales Dashboard</div>
                        <div className="text-xs font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full px-2 py-0.5 mt-1 inline-block">New</div>
                      </div>
                    </Link>
                    
                    <Link href="/generate-sop">
                      <div className="group hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-amber-100 dark:hover:border-amber-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-amber-100 dark:border-amber-800/30">
                          <FileText className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Create SOP</div>
                      </div>
                    </Link>
                    
                    <Link href="/client-management">
                      <div className="group hover:bg-cyan-50 dark:hover:bg-cyan-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-cyan-100 dark:hover:border-cyan-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-cyan-100 dark:border-cyan-800/30">
                          <Users className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Clients</div>
                      </div>
                    </Link>
                    
                    <Link href="/cost-analysis">
                      <div className="group hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-emerald-100 dark:border-emerald-800/30">
                          <DollarSign className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Cost Analysis</div>
                      </div>
                    </Link>
                    
                    <Link href="/advanced-ai">
                      <div className="group hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-purple-100 dark:hover:border-purple-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-purple-100 dark:border-purple-800/30">
                          <Wand2 className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Assistant</div>
                      </div>
                    </Link>
                    
                    <Link href="/business-forecast">
                      <div className="group hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-xl p-4 text-center cursor-pointer transition-all duration-200 border border-transparent hover:border-orange-100 dark:hover:border-orange-800/30 hover:shadow-sm">
                        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 border border-orange-100 dark:border-orange-800/30">
                          <LineChart className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Forecast</div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Visualization Section */}
              <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mt-10 -mr-10"></div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">Operations Snapshot</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      <BarChart2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground pt-1">Financial and operational analytics</CardDescription>
                  <div className="flex gap-2 mt-3">
                    <Select defaultValue="month">
                      <SelectTrigger className="w-[140px] h-9 text-sm bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="quarter">This Quarter</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 pb-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CostBreakdownChart
                      data={[
                        { name: "Finance", value: stats.totalMonthlyCost * 0.25, color: "#3B82F6" },
                        { name: "Operations", value: stats.totalMonthlyCost * 0.20, color: "#10B981" },
                        { name: "Marketing", value: stats.totalMonthlyCost * 0.30, color: "#F59E0B" },
                        { name: "Sales", value: stats.totalMonthlyCost * 0.15, color: "#8B5CF6" },
                        { name: "Customer Experience", value: stats.totalMonthlyCost * 0.10, color: "#EC4899" },
                      ]}
                      timeframe="monthly"
                      entityName={selectedEntityData?.name}
                      totalCost={stats.totalMonthlyCost}
                    />
                    
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/30 dark:to-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                      <h3 className="text-sm font-medium mb-3 text-indigo-700 dark:text-indigo-400 flex items-center">
                        <LineChart className="h-4 w-4 mr-2" />
                        Tool Cost Forecast
                      </h3>
                      <CostForecastChart 
                        data={[
                          { name: 'Jan', value: stats.totalMonthlyCost * 0.85, projection: stats.totalMonthlyCost * 0.9 },
                          { name: 'Feb', value: stats.totalMonthlyCost * 0.9, projection: stats.totalMonthlyCost * 0.95 },
                          { name: 'Mar', value: stats.totalMonthlyCost * 0.95, projection: stats.totalMonthlyCost },
                          { name: 'Apr', value: stats.totalMonthlyCost, projection: stats.totalMonthlyCost * 1.05 },
                          { name: 'May', value: stats.totalMonthlyCost * 1.05, projection: stats.totalMonthlyCost * 1.1 },
                          { name: 'Jun', value: 0, projection: stats.totalMonthlyCost * 1.15 },
                          { name: 'Jul', value: 0, projection: stats.totalMonthlyCost * 1.2 },
                          { name: 'Aug', value: 0, projection: stats.totalMonthlyCost * 1.25 },
                        ]}
                      />
                      
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-indigo-500 mr-1.5"></div>
                          <span className="text-gray-600 dark:text-gray-400">Actual costs</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-purple-400 mr-1.5"></div>
                          <span className="text-gray-600 dark:text-gray-400">Projected costs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activities Section */}
              <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mt-8 -mr-8"></div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">Recent Activities</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground pt-1">Latest actions across your business</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {isLoadingActivities ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-transparent to-green-50 dark:from-transparent dark:to-green-950/30 rounded-lg p-6">
                      <div className="text-center">
                        <div className="mb-3 inline-flex p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-50">No activities yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                          Activities will appear here as you use the platform.
                        </p>
                        <Button className="mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200" size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Log an Activity
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {activities.map((activity, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                            activity.type.includes('recommendation') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                            activity.type.includes('sop') ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800' :
                            activity.type.includes('tool') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800' :
                            activity.type.includes('entity') ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800' :
                            'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700'
                          }`}>
                            {activity.type.includes('recommendation') ? <Wand2 className="h-5 w-5" /> :
                             activity.type.includes('sop') ? <FileText className="h-5 w-5" /> :
                             activity.type.includes('tool') ? <GanttChartSquare className="h-5 w-5" /> :
                             activity.type.includes('entity') ? <LayoutDashboard className="h-5 w-5" /> :
                             <RefreshCw className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                              {activity.description}
                            </p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mr-1.5" />
                              <p className="text-xs text-muted-foreground">
                                {formatDate(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {activities.length > 0 && (
                  <CardFooter className="pt-0 pb-3 flex justify-center border-t border-gray-100 dark:border-gray-800">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      <Plus className="h-3 w-3" /> Log activity
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
            
            {/* Right Column - Recommendations & Tasks */}
            <div className="lg:col-span-1 space-y-6">
              {/* TimeZone Widget Section */}
              <TimeZoneWidget />
              
              {/* Action Items Section */}
              <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mt-8 -mr-8"></div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50 flex items-center">
                      Priority Items
                      {recommendations.length > 0 && (
                        <Badge className="ml-2 bg-red-500 hover:bg-red-600">
                          {recommendations.length}
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                      <BellRing className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground pt-1">Urgent tasks requiring your attention</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {isLoadingRecommendations ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recommendations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-transparent to-red-50 dark:from-transparent dark:to-red-950/30 rounded-lg p-6">
                      <div className="text-center">
                        <div className="mb-3 inline-flex p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-50">All caught up!</h3>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                          You've completed all your priority items. Great job!
                        </p>
                        <Button className="mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200" size="sm" asChild>
                          <Link href="/recommendations?status=completed">
                            <CheckCheck className="mr-2 h-4 w-4" />
                            View Completed Items
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {recommendations.slice(0, 4).map((recommendation, idx) => (
                        <div 
                          key={idx} 
                          className="flex gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                            recommendation.priority === 'high' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800' :
                            recommendation.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800' :
                            'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800'
                          }`}>
                            {getPriorityStyles(recommendation.priority).icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{recommendation.title}</h4>
                              <Badge variant={getPriorityStyles(recommendation.priority).badge as any} className="text-[10px] h-5">
                                {recommendation.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {recommendation.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  <Check className="h-3 w-3 mr-1" />
                                  Complete
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                  Snooze
                                </Button>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                {recommendations.length > 0 && (
                  <CardFooter className="pt-0 pb-3 flex justify-center border-t border-gray-100 dark:border-gray-800">
                    <Button variant="link" size="sm" asChild className="text-xs">
                      <Link href="/recommendations">
                        View all recommendations
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {/* SOPs Section */}
              <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mt-8 -mr-8"></div>
                <CardHeader className="p-6 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">Popular SOPs</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground pt-1">Standard operating procedures for your teams</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {isLoadingSops ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : allSops.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-transparent to-amber-50 dark:from-transparent dark:to-amber-950/30 rounded-lg p-6">
                      <div className="text-center">
                        <div className="mb-3 inline-flex p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                          <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-50">No SOPs created yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                          Document your business processes by creating your first Standard Operating Procedure.
                        </p>
                        <Button className="mt-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-200" size="sm" asChild>
                          <Link href="/generate-sop">
                            <FileText className="mr-2 h-4 w-4" />
                            Create First SOP
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {displaySops.slice(0, 3).map((sop, idx) => (
                        <Link href={`/sop/${sop.id}`} key={idx}>
                          <div className="flex gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors group">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center border-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{sop.title}</h4>
                              <div className="flex items-center mt-1">
                                <Badge 
                                  variant="outline"
                                  className="text-[10px] h-5 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                                >
                                  {sop.category}
                                </Badge>
                                <div className="ml-2 text-xs text-muted-foreground flex items-center">
                                  <Clock className="inline-block h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mr-1.5" />
                                  <span>{formatDate(sop.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
                {allSops.length > 0 && (
                  <CardFooter className="pt-0 pb-3 flex justify-center border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" size="sm" className="text-xs" asChild>
                      <Link href="/generate-sop">
                        <Plus className="h-3 w-3 mr-1" /> Create new SOP
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Insights Tab Content */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mt-10 -mr-10"></div>
              <CardHeader className="p-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">Business Insights</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground pt-1">Key metrics and trends for your business</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="flex flex-col items-center justify-center h-44 bg-gradient-to-br from-transparent to-blue-50 dark:from-transparent dark:to-blue-950/30 rounded-lg p-6">
                  <div className="text-center">
                    <div className="mb-3 inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-50">Analytics Coming Soon</h3>
                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                      Advanced business insights and trends will be available in the next update.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 p-4 flex justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200" asChild>
                  <Link href="/business-forecast" className="flex items-center">
                    <LineChart className="mr-2 h-4 w-4" />
                    View Business Forecast
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300 border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mt-10 -mr-10"></div>
              <CardHeader className="p-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">AI Recommendations</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardDescription className="text-sm text-muted-foreground pt-1">Personalized suggestions to improve your business</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="flex flex-col items-center justify-center h-44 bg-gradient-to-br from-transparent to-purple-50 dark:from-transparent dark:to-purple-950/30 rounded-lg p-6">
                  <div className="text-center">
                    <div className="mb-3 inline-flex p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-50">AI Insights Coming Soon</h3>
                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                      Personalized AI-driven insights based on your business data will be available shortly.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 p-4 flex justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200" asChild>
                  <Link href="/advanced-ai" className="flex items-center">
                    <Cpu className="mr-2 h-4 w-4" />
                    Explore AI Assistant
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Actions Tab Content */}
        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-md border-none lg:col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-4">
                    <Button asChild variant="default" className="w-full justify-start" size="lg">
                      <Link href="/generate-sop">
                        <FileText className="h-5 w-5 mr-2" />
                        Generate New SOP
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/meetings">
                        <CalendarDays className="h-5 w-5 mr-2" />
                        Schedule Meeting
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/social-media">
                        <Target className="h-5 w-5 mr-2" />
                        Manage Social Media
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/client-management">
                        <Users className="h-5 w-5 mr-2" />
                        Manage Clients
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/cost-analysis">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Analyze Costs
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/organization-chart">
                        <GanttChartSquare className="h-5 w-5 mr-2" />
                        View Organization
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/advanced-ai">
                        <Wand2 className="h-5 w-5 mr-2" />
                        AI Assistant
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/business-strategy">
                        <LineChart className="h-5 w-5 mr-2" />
                        Strategy Planning
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="w-full justify-start" size="lg">
                      <Link href="/operating-system">
                        <PanelRightOpen className="h-5 w-5 mr-2" />
                        Operating System
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}