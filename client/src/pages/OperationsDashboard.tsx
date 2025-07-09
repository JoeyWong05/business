import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useDemoMode } from '@/contexts/DemoModeContext';
import SaasLayout from '@/components/SaasLayout';
import { Category } from '@shared/schema';
import { Link } from 'wouter';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  ResponsiveContainer, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  Bar,
  Pie,
  Cell
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  BarChart3, 
  Briefcase, 
  CheckCircle, 
  ChevronRight, 
  Cpu, 
  FileText, 
  Info, 
  LayoutDashboard, 
  ListFilter,
  PieChart as PieChartIcon,
  Settings, 
  Timer,
  Zap,
  AlertCircle
} from 'lucide-react';

// Type definitions
interface SOP {
  id: number;
  title: string;
  category: string;
  department: string;
  steps: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface Recommendation {
  id: number;
  userId: number;
  title: string;
  description: string;
  categoryId: number;
  type: string;
  status: string;
  createdAt: string;
}

interface Activity {
  id: number;
  userId: number;
  type: string;
  entityId?: number;
  entityType?: string;
  data: any;
  timestamp: string;
}

interface ProcessEfficiency {
  id: number;
  name: string;
  manualTime: number;
  automatedTime: number;
  savings: number;
  category: string;
}

// Activity Item Component
const ActivityItem = ({ activity }: { activity: Activity }) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      // Make sure timestamp is valid
      if (!timestamp || typeof timestamp !== 'string') {
        return 'Invalid date';
      }
      
      // Try to parse the timestamp
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Invalid date';
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'added_tool':
        return <Cpu className="h-4 w-4 text-blue-500" />;
      case 'updated_sop':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'completed_task':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'system_update':
        return <Settings className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActivityTitle = (activity: Activity) => {
    switch (activity.type) {
      case 'added_tool':
        return `New tool added: ${activity.data?.name || 'Unknown tool'}`;
      case 'updated_sop':
        return `SOP updated: ${activity.data?.title || 'Unknown SOP'}`;
      case 'completed_task':
        return `Task completed: ${activity.data?.title || 'Unknown task'}`;
      case 'system_update':
        return `System update: ${activity.data?.title || 'Unknown update'}`;
      default:
        return `Activity: ${activity.type}`;
    }
  };
  
  return (
    <div className="flex items-start space-x-3 py-3 border-b border-border last:border-0">
      <div className="p-1 bg-muted rounded-full flex-shrink-0 mt-0.5">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{getActivityTitle(activity)}</p>
        {activity.data?.description && (
          <p className="text-xs text-muted-foreground">
            {typeof activity.data.description === 'string' 
              ? activity.data.description 
              : 'No description available'}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {formatTimestamp(activity.timestamp)}
        </p>
      </div>
    </div>
  );
};

// RecommendationItem Component
const RecommendationItem = ({ 
  id, 
  title, 
  description, 
  type, 
  status 
}: { 
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
}) => {
  const getRecommendationIcon = () => {
    switch (type) {
      case 'new_tool':
        return <Cpu className="h-4 w-4 text-green-500" />;
      case 'upgrade':
        return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
      case 'improvement':
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = () => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  return (
    <div className="flex space-x-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 px-2 rounded cursor-pointer transition-colors">
      <div className="p-1 rounded-full bg-muted flex-shrink-0 mt-1">
        {getRecommendationIcon()}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div className="font-medium text-sm">{title}</div>
          {status && (
            <div className="mt-1 sm:mt-0">
              {getStatusBadge()}
            </div>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
};

// Main Operations Dashboard Component
export default function OperationsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { demoMode } = useDemoMode();
  
  // Fetch data from API
  const { data: sopsData, isLoading: isLoadingSops } = useQuery({
    queryKey: ['/api/sops'],
    queryFn: () => apiRequest('/api/sops')
  });
  
  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['/api/activities'],
    queryFn: () => apiRequest('/api/activities')
  });
  
  const { data: automationData, isLoading: isLoadingAutomation } = useQuery({
    queryKey: ['/api/automation-score'],
    queryFn: () => apiRequest('/api/automation-score')
  });
  
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('/api/categories')
  });
  
  const { data: recommendationsData, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['/api/recommendations'],
    queryFn: () => apiRequest('/api/recommendations')
  });

  // Process data
  const sops: SOP[] = sopsData?.sops || [];
  const activities: Activity[] = activitiesData?.activities || [];
  const recommendations: Recommendation[] = recommendationsData?.recommendations || [];
  
  // Demo mode default data for process efficiency
  const defaultProcessEfficiency: ProcessEfficiency[] = demoMode ? [
    {
      id: 1,
      name: "Customer Onboarding",
      manualTime: 180,
      automatedTime: 15,
      savings: 91.7,
      category: "Customer Service"
    },
    {
      id: 2,
      name: "Payroll Processing",
      manualTime: 240,
      automatedTime: 30,
      savings: 87.5,
      category: "Finance"
    },
    {
      id: 3,
      name: "Invoice Generation",
      manualTime: 90,
      automatedTime: 5,
      savings: 94.4,
      category: "Finance"
    },
    {
      id: 4,
      name: "Marketing Campaign Setup",
      manualTime: 240,
      automatedTime: 60,
      savings: 75,
      category: "Marketing"
    },
    {
      id: 5,
      name: "Employee Onboarding",
      manualTime: 300,
      automatedTime: 120,
      savings: 60,
      category: "Human Resources"
    }
  ] : [];
  
  // Process data
  const automationScore = automationData?.overallScore || (demoMode ? 78 : 0);
  const processEfficiency = automationData?.processEfficiency || defaultProcessEfficiency;
  
  // Default value for "Time Saved by Automation" chart
  const timeSavedChartData = processEfficiency.map((process: ProcessEfficiency) => ({
    name: process.name,
    manual: process.manualTime,
    automated: process.automatedTime,
    savings: process.savings
  }));
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
  
  return (
    <SaasLayout>
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-background pb-6">
        <div className="container px-4 pt-8 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Operations Command Center
              </h1>
              <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
                Centralized intelligence to optimize business operations and unlock strategic advantages
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="h-9">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">
                <Zap className="h-4 w-4 mr-2" />
                Automation Report
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tab Menu */}
        <div className="container px-4 max-w-7xl mx-auto border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0 rounded-none">
              <TabsTrigger value="overview" className="h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="automation" className="h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Zap className="w-4 h-4 mr-2" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="processes" className="h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <Briefcase className="w-4 h-4 mr-2" />
                Processes
              </TabsTrigger>
              <TabsTrigger value="activity" className="h-12 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                <BarChart3 className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* KPI Summary Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/tool-management" className="block w-full">
                  <Card className="relative overflow-hidden border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent" />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-blue-500" />
                        <p className="text-sm font-medium text-muted-foreground">Tools Integrated</p>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <h3 className="text-3xl font-bold">{demoMode ? 18 : 9}</h3>
                        <span className="text-sm font-medium text-green-500 flex items-center">
                          +3 <ArrowUpRight className="h-3 w-3 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/generate-sop" className="block w-full">
                  <Card className="relative overflow-hidden border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent" />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-amber-500" />
                        <p className="text-sm font-medium text-muted-foreground">SOPs Created</p>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <h3 className="text-3xl font-bold">{sops.length}</h3>
                        <span className="text-sm font-medium text-green-500 flex items-center">
                          +2 <ArrowUpRight className="h-3 w-3 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/automation-score" className="block w-full">
                  <Card className="relative overflow-hidden border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-green-500/10 to-transparent" />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5 text-green-500" />
                        <p className="text-sm font-medium text-muted-foreground">Time Saved Weekly</p>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <h3 className="text-3xl font-bold">{demoMode ? '48h' : '24h'}</h3>
                        <span className="text-sm font-medium text-green-500 flex items-center">
                          +15% <ArrowUpRight className="h-3 w-3 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/financial-overview" className="block w-full">
                  <Card className="relative overflow-hidden border-l-4 border-l-purple-500 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/10 to-transparent" />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-purple-500" />
                        <p className="text-sm font-medium text-muted-foreground">ROI (Monthly)</p>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <h3 className="text-3xl font-bold">${demoMode ? '8,750' : '4,320'}</h3>
                        <span className="text-sm font-medium text-green-500 flex items-center">
                          +8% <ArrowUpRight className="h-3 w-3 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              
              {/* Charts and Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Automation Score */}
                <Link href="/automation-score" className="block col-span-1">
                  <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Automation Score</CardTitle>
                      <CardDescription>
                        Overall business automation level
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 px-0 flex justify-center">
                      <div className="w-full h-[250px] flex flex-col items-center justify-center px-6">
                        <div className="relative flex items-center justify-center mb-4">
                          <PieChartIcon className="h-32 w-32 text-muted-foreground/20" />
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-4xl font-bold text-primary">{automationScore}</span>
                            <span className="text-sm text-muted-foreground">out of 100</span>
                          </div>
                        </div>
                        
                        <div className="w-full grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Processes</div>
                            <div className="text-xl font-bold">{demoMode ? 12 : 6}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-muted-foreground">Automated</div>
                            <div className="text-xl font-bold">{demoMode ? 9 : 4}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full text-center py-2 text-primary font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Zap className="h-4 w-4 inline mr-2" />
                        View Detailed Report
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
                
                {/* Time Saved by Automation (Bar Chart) */}
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Time Saved by Automation</CardTitle>
                    <CardDescription>
                      Comparison of manual vs. automated processes (in minutes)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {isLoadingAutomation ? (
                      <div className="h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={timeSavedChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="manual" name="Manual Process (mins)" fill="#ff8042" />
                          <Bar dataKey="automated" name="Automated Process (mins)" fill="#0088fe" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Process Insights & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-1">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                    <CardDescription>
                      Latest actions and events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[340px] pr-4">
                      {isLoadingActivities ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-start space-x-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : activities.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No recent activity
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {activities.slice(0, 10).map((activity) => (
                            <ActivityItem key={activity.id} activity={activity} />
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Recommendations */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                    <CardDescription>
                      Process improvements and optimization suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[340px] pr-4">
                      {isLoadingRecommendations ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                              <Skeleton className="h-5 w-2/3" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ))}
                        </div>
                      ) : recommendations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No recommendations available
                        </div>
                      ) : (
                        <div>
                          {recommendations.slice(0, 7).map((recommendation) => (
                            <RecommendationItem
                              key={recommendation.id}
                              id={recommendation.id}
                              title={recommendation.title}
                              description={recommendation.description}
                              type={recommendation.type}
                              status={recommendation.status}
                            />
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Recommendations
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === 'automation' && (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis of automation across business functions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    Automation breakdown content will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'processes' && (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Process Management</CardTitle>
                  <CardDescription>
                    Streamline and optimize your business processes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    Process management content will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Detailed record of all system activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    Activity log content will be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </SaasLayout>
  );
}