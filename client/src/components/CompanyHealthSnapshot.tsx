import React, { useState } from 'react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  AlertCircle,
  Info,
  LineChart,
  Zap,
  Heart,
  AreaChart,
  List,
  Share2,
  RefreshCw,
  Download,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MetricProps {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
  timeframe: string;
  loading?: boolean;
}

const Metric: React.FC<MetricProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  timeframe,
  loading = false 
}) => {
  return (
    <div className={`space-y-1 ${loading ? 'opacity-70' : ''}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">{value}</p>
        <div className="flex items-center gap-1">
          {trend === "up" ? (
            <Badge variant={change > 0 ? "default" : "default"} className={`font-medium px-1.5 h-5 ${change > 0 ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" : ""}`}>
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {Math.abs(change)}%
            </Badge>
          ) : trend === "down" ? (
            <Badge variant={change < 0 ? "destructive" : "default"} className="font-medium px-1.5 h-5">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              {Math.abs(change)}%
            </Badge>
          ) : (
            <Badge variant="outline" className="font-medium px-1.5 h-5">
              0%
            </Badge>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">vs. {timeframe}</p>
    </div>
  );
};

interface HealthScore {
  score: number;
  category: string;
  change: number;
  status: "critical" | "warning" | "good" | "excellent";
}

interface CompanyPerformance {
  revenue: number;
  revenueChange: number;
  profit: number;
  profitChange: number;
  customersCount: number;
  customersChange: number;
  employeeCount: number;
  employeeChange: number;
  cashFlow: number;
  cashFlowChange: number;
  runwayMonths: number;
  runwayChange: number;
}

interface CompanyHealthData {
  overallScore: number;
  overallChange: number;
  status: "critical" | "warning" | "good" | "excellent";
  categories: HealthScore[];
  performance: CompanyPerformance;
  insights: string[];
  recommendations: string[];
  lastUpdated: string;
}

// Helper function to determine the status color
const getStatusColor = (status: "critical" | "warning" | "good" | "excellent") => {
  switch (status) {
    case "critical":
      return "text-red-500 bg-red-100 dark:bg-red-950 dark:text-red-400";
    case "warning":
      return "text-amber-500 bg-amber-100 dark:bg-amber-950 dark:text-amber-400";
    case "good":
      return "text-green-500 bg-green-100 dark:bg-green-950 dark:text-green-400";
    case "excellent":
      return "text-blue-500 bg-blue-100 dark:bg-blue-950 dark:text-blue-400";
    default:
      return "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Helper function to determine the status icon
const StatusIcon = ({ status }: { status: "critical" | "warning" | "good" | "excellent" }) => {
  switch (status) {
    case "critical":
      return <AlertCircle className="h-5 w-5" />;
    case "warning":
      return <Info className="h-5 w-5" />;
    case "good":
      return <TrendingUp className="h-5 w-5" />;
    case "excellent":
      return <Zap className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

export default function CompanyHealthSnapshot() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter">("month");
  const { demoMode } = useDemoMode();
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery<CompanyHealthData>({
    queryKey: ['/api/company-health', timeframe],
    queryFn: async () => {
      try {
        // In a real application, we would fetch data from an API
        if (demoMode) {
          // Simulated delay for demo mode
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Demo data with random variations based on timeframe
          const randomChange = () => Math.round((Math.random() * 20 - 10) * 10) / 10;
          const baseScore = 72 + Math.random() * 10;
          
          return {
            overallScore: Math.round(baseScore),
            overallChange: timeframe === 'week' ? 2.3 : timeframe === 'month' ? 4.7 : 8.2,
            status: baseScore > 85 ? "excellent" : baseScore > 70 ? "good" : baseScore > 50 ? "warning" : "critical",
            categories: [
              {
                score: Math.round(75 + Math.random() * 15),
                category: "Financial Health",
                change: randomChange(),
                status: "good"
              },
              {
                score: Math.round(65 + Math.random() * 25),
                category: "Operational Efficiency",
                change: randomChange(),
                status: "good"
              },
              {
                score: Math.round(80 + Math.random() * 15),
                category: "Customer Satisfaction",
                change: randomChange(),
                status: "excellent"
              },
              {
                score: Math.round(60 + Math.random() * 20),
                category: "Team Performance",
                change: randomChange(),
                status: "warning"
              },
              {
                score: Math.round(70 + Math.random() * 20),
                category: "Market Position",
                change: randomChange(),
                status: "good"
              }
            ],
            performance: {
              revenue: 285000 + Math.round(Math.random() * 50000),
              revenueChange: randomChange(),
              profit: 68000 + Math.round(Math.random() * 15000),
              profitChange: randomChange(),
              customersCount: 432 + Math.round(Math.random() * 20),
              customersChange: randomChange(),
              employeeCount: 24 + Math.round(Math.random() * 3),
              employeeChange: randomChange(),
              cashFlow: 125000 + Math.round(Math.random() * 25000),
              cashFlowChange: randomChange(),
              runwayMonths: 18 + Math.round(Math.random() * 6),
              runwayChange: randomChange()
            },
            insights: [
              "Revenue growth is outpacing market average by 7%",
              "Customer acquisition cost has decreased by 12%",
              "Profit margins remain stable at 23.8%",
              "Employee productivity increased 4.5% this period",
              "Marketing ROI improved significantly at 3.2x"
            ],
            recommendations: [
              "Consider expanding the sales team to capitalize on positive market trends",
              "Invest in automation tools to improve operational efficiency",
              "Focus on customer retention strategies to minimize churn",
              "Optimize cash reserves to prepare for potential market fluctuations"
            ],
            lastUpdated: new Date().toISOString()
          };
        } else {
          // In a real implementation this would call the backend API
          const response = await apiRequest('GET', `/api/company-health?timeframe=${timeframe}`);
          return await response.json();
        }
      } catch (err) {
        console.error('Error fetching company health data:', err);
        throw new Error('Failed to fetch company health data');
      }
    },
    enabled: true,
  });
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "Company health data has been updated.",
    });
  };
  
  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Company health report has been downloaded.",
    });
  };
  
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Error Loading Health Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400">
            There was a problem loading the company health data. Please try again later.
          </p>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Company Health Snapshot
              {data && (
                <Badge 
                  className={`ml-2 ${getStatusColor(data.status)}`}
                >
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Real-time overview of your business performance and health metrics
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <TabsList className="h-8">
              <TabsTrigger
                value="week"
                className="text-xs px-2.5 h-7"
                onClick={() => setTimeframe("week")}
                data-active={timeframe === "week"}
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="text-xs px-2.5 h-7"
                onClick={() => setTimeframe("month")}
                data-active={timeframe === "month"}
              >
                Month
              </TabsTrigger>
              <TabsTrigger
                value="quarter"
                className="text-xs px-2.5 h-7"
                onClick={() => setTimeframe("quarter")}
                data-active={timeframe === "quarter"}
              >
                Quarter
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overall Health Score */}
          <Card className="border-none shadow-sm bg-primary/5">
            <CardHeader className="py-4 px-5">
              <CardTitle className="text-base">Overall Health Score</CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-5">
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-4xl font-bold">
                  {isLoading ? "—" : data?.overallScore}
                </div>
                {data && (
                  <Badge 
                    variant={data.overallChange > 0 ? "default" : "destructive"} 
                    className={`font-medium px-1.5 ${data.overallChange > 0 ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" : ""}`}
                  >
                    {data.overallChange > 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
                    {Math.abs(data.overallChange)}%
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <p className="text-xs text-muted-foreground">vs. previous {timeframe}</p>
              </div>
              <Progress value={isLoading ? 0 : data?.overallScore} className="h-2.5 mb-3" />
              <div className="text-sm space-y-1 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Critical</span>
                  <span className="text-muted-foreground">Excellent</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] font-medium uppercase">
                  <div className="text-red-500">0-49</div>
                  <div className="text-amber-500">50-69</div>
                  <div className="text-green-500">70-84</div>
                  <div className="text-blue-500 text-right">85-100</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Performance Metrics Group 1 */}
          <Card className="overflow-hidden border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Financial Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 grid grid-cols-2 gap-4">
              <Metric
                title="Revenue"
                value={isLoading ? "—" : `$${data?.performance.revenue.toLocaleString()}`}
                change={isLoading ? 0 : data?.performance.revenueChange || 0}
                trend={isLoading ? "neutral" : (data?.performance.revenueChange || 0) > 0 ? "up" : "down"}
                timeframe={`last ${timeframe}`}
                loading={isLoading}
              />
              <Metric
                title="Profit"
                value={isLoading ? "—" : `$${data?.performance.profit.toLocaleString()}`}
                change={isLoading ? 0 : data?.performance.profitChange || 0}
                trend={isLoading ? "neutral" : (data?.performance.profitChange || 0) > 0 ? "up" : "down"}
                timeframe={`last ${timeframe}`}
                loading={isLoading}
              />
            </CardContent>
          </Card>
          
          {/* Performance Metrics Group 2 */}
          <Card className="overflow-hidden border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                People Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 grid grid-cols-2 gap-4">
              <Metric
                title="Customers"
                value={isLoading ? "—" : data?.performance.customersCount.toLocaleString() || 0}
                change={isLoading ? 0 : data?.performance.customersChange || 0}
                trend={isLoading ? "neutral" : (data?.performance.customersChange || 0) > 0 ? "up" : "down"}
                timeframe={`last ${timeframe}`}
                loading={isLoading}
              />
              <Metric
                title="Employees"
                value={isLoading ? "—" : data?.performance.employeeCount.toLocaleString() || 0}
                change={isLoading ? 0 : data?.performance.employeeChange || 0}
                trend={isLoading ? "neutral" : (data?.performance.employeeChange || 0) > 0 ? "up" : "down"}
                timeframe={`last ${timeframe}`}
                loading={isLoading}
              />
            </CardContent>
          </Card>
          
          {/* Category Health Scores */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-base flex items-center gap-2">
                  <AreaChart className="h-4 w-4 text-primary" />
                  Category Health Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="py-1 px-5">
                {isLoading ? (
                  <div className="space-y-3 p-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-36 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-2.5 flex-1 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 py-2">
                    {data?.categories.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-36 text-sm">{category.category}</div>
                        <div className="flex-1">
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-800">
                              <div 
                                style={{ width: `${category.score}%` }} 
                                className={`
                                  shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                                  ${category.status === "excellent" ? "bg-blue-500" : 
                                    category.status === "good" ? "bg-green-500" : 
                                    category.status === "warning" ? "bg-amber-500" : "bg-red-500"}
                                `}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 min-w-[60px]">
                          <span className="text-sm font-medium">{category.score}</span>
                          <Badge 
                            variant={category.change > 0 ? "default" : "destructive"} 
                            className={`h-5 text-[10px] px-1 ${category.change > 0 ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" : ""}`}
                          >
                            {category.change > 0 ? '+' : ''}{category.change}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Insights & Recommendations */}
          <Card>
            <CardHeader className="py-4 px-5">
              <CardTitle className="text-base flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-1 max-h-[280px] overflow-auto">
              <Tabs defaultValue="insights">
                <TabsList className="w-full mb-3">
                  <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex-1">Recommendations</TabsTrigger>
                </TabsList>
                <TabsContent value="insights" className="m-0">
                  {isLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {data?.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
                <TabsContent value="recommendations" className="m-0">
                  {isLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {data?.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between px-5 py-3">
        <div className="text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 inline mr-1" />
          Last updated: {isLoading ? "Loading..." : 
            new Date(data?.lastUpdated || Date.now()).toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadReport}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}