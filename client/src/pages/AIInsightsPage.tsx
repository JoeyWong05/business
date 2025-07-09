import React, { useState } from "react";
import SaasLayout from "@/components/SaasLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  LineChart,
  BrainCircuit,
  PieChart,
  Target,
  BarChart3,
  Calendar,
  Users,
  Crown,
  Rocket,
  CheckCircle2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDemoMode } from "@/contexts/DemoModeContext";

// Define types for insights
interface Insight {
  id: string;
  title: string;
  description: string;
  category: "strategy" | "operations" | "marketing" | "growth" | "finance";
  impact: "high" | "medium" | "low";
  icon: React.ReactNode;
  color: string;
  timestamp: string;
  implemented?: boolean;
  progress?: number;
}

export default function AIInsightsPage() {
  const { demoMode } = useDemoMode();
  const [activeTab, setActiveTab] = useState("all");
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "ins-001",
      title: "Increase social engagement",
      description: "Schedule posts during peak hours to maximize reach. Traffic analysis suggests 11am-1pm is optimal for your audience.",
      category: "marketing",
      impact: "high",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "text-amber-500",
      timestamp: "2 hours ago",
    },
    {
      id: "ins-002",
      title: "Complete your business profile",
      description: "Add your company logo, description and business details to improve AI recommendations and dashboard accuracy.",
      category: "operations",
      impact: "medium",
      icon: <Settings className="h-5 w-5" />,
      color: "text-indigo-500",
      timestamp: "4 hours ago",
      progress: 60,
    },
    {
      id: "ins-003",
      title: "Revenue optimization opportunity",
      description: "Based on your current pricing strategy, increasing your premium package by 10% could boost revenue by 23% with minimal impact on conversion.",
      category: "finance",
      impact: "high",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-emerald-500",
      timestamp: "Yesterday",
    },
    {
      id: "ins-004",
      title: "Upgrade your subscription",
      description: "You're reaching the limits of your current plan. Upgrade to Pro for unlimited access to all features and advanced analytics.",
      category: "operations",
      impact: "medium",
      icon: <Crown className="h-5 w-5" />,
      color: "text-blue-500",
      timestamp: "2 days ago",
    },
    {
      id: "ins-005",
      title: "Customer retention alert",
      description: "Churn risk detected for 3 enterprise customers. Recommended action: schedule check-in calls within the next 5 days.",
      category: "growth",
      impact: "high",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-500",
      timestamp: "3 days ago",
    },
    {
      id: "ins-006",
      title: "Website traffic pattern change",
      description: "Noticed a 27% increase in mobile traffic from Instagram. Consider optimizing your landing page for mobile conversion.",
      category: "marketing",
      impact: "medium",
      icon: <LineChart className="h-5 w-5" />,
      color: "text-purple-500",
      timestamp: "5 days ago",
      implemented: true,
    },
    {
      id: "ins-007",
      title: "New market opportunity",
      description: "Based on your customer data, there's an untapped market in the education sector with high compatibility to your services.",
      category: "strategy",
      impact: "high",
      icon: <Target className="h-5 w-5" />,
      color: "text-orange-500",
      timestamp: "1 week ago",
    },
    {
      id: "ins-008",
      title: "Team capacity optimization",
      description: "Task analysis suggests redistributing creative workload could increase department efficiency by 18%.",
      category: "operations",
      impact: "medium",
      icon: <Users className="h-5 w-5" />,
      color: "text-cyan-500",
      timestamp: "1 week ago",
    },
  ]);

  // Filter insights based on active tab
  const filteredInsights = insights.filter(insight => {
    if (activeTab === "all") return true;
    if (activeTab === "high-impact") return insight.impact === "high";
    if (activeTab === "implemented") return insight.implemented;
    return insight.category === activeTab;
  });

  // Function to implement an insight
  const implementInsight = (id: string) => {
    setInsights(prevInsights => 
      prevInsights.map(insight => 
        insight.id === id 
          ? { ...insight, implemented: true } 
          : insight
      )
    );
  };

  return (
    <SaasLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Insights Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Data-driven recommendations to optimize your business performance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <BrainCircuit className="h-4 w-4" />
              Configure AI Settings
            </Button>
            <Button className="gap-2">
              <Rocket className="h-4 w-4" />
              Generate New Insights
            </Button>
          </div>
        </div>
        
        {/* Insights Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                Active Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{insights.filter(i => !i.implemented).length}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {insights.filter(i => i.impact === "high" && !i.implemented).length} high impact opportunities
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                Implemented Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{insights.filter(i => i.implemented).length}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Resulting in 23% business improvement
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                Implementation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>Overall progress</span>
                  <span className="font-medium">42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Insights Tabs & Content */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Business Insights</CardTitle>
            <CardDescription>
              AI-generated recommendations based on your business data
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all">All Insights</TabsTrigger>
                <TabsTrigger value="high-impact">High Impact</TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="operations">Operations</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="implemented">Implemented</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <TabsContent value={activeTab} className="p-0">
              <div className="divide-y">
                {filteredInsights.map((insight) => (
                  <div key={insight.id} className="p-6 flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-opacity-10 ${insight.color.replace('text-', 'bg-')}`}>
                      <div className={insight.color}>{insight.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{insight.title}</h3>
                        <Badge variant={insight.impact === "high" ? "destructive" : "outline"} className="rounded-sm text-[10px]">
                          {insight.impact === "high" ? "High Impact" : insight.impact === "medium" ? "Medium Impact" : "Low Impact"}
                        </Badge>
                        {insight.implemented && (
                          <Badge variant="outline" className="rounded-sm text-[10px] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Implemented
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {insight.timestamp}
                        </span>
                        <div className="flex gap-2">
                          {!insight.implemented ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {/* Dismiss logic */}}
                              >
                                Dismiss
                              </Button>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => implementInsight(insight.id)}
                              >
                                Implement
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:text-green-400 dark:border-green-900 dark:bg-green-950 dark:hover:bg-green-900"
                            >
                              View Results
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {insight.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Implementation progress</span>
                            <span>{insight.progress}%</span>
                          </div>
                          <Progress value={insight.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredInsights.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="bg-muted rounded-full p-3 mb-3">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No insights found</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      There are no insights matching your current filter. Try changing the filter or generate new insights.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <CardFooter className="border-t flex justify-between py-4">
            <p className="text-sm text-muted-foreground">
              Insights are updated every 24 hours based on your latest data
            </p>
            <Button variant="link" className="p-0 h-auto">
              Configure insight preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SaasLayout>
  );
}