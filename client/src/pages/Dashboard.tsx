import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import StatCard from "@/components/StatCard";
import ActivityItem from "@/components/ActivityItem";
import SOPItem from "@/components/SOPItem";
import RecommendationItem from "@/components/RecommendationItem";
import CategoryCard from "@/components/CategoryCard";
import CostBreakdownChart from "@/components/CostBreakdownChart";
import CostForecastChart from "@/components/CostForecastChart";
import SmartRecommendationsPanel from "@/components/SmartRecommendationsPanel";
import WeeklyRecapCard from "@/components/WeeklyRecapCard";
import PredictiveInsightsPanel from "@/components/PredictiveInsightsPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { usePersonalization } from "@/contexts/PersonalizationContext";

export default function Dashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("enterprise");
  const { widgets, currentBrand } = usePersonalization();
  
  // States for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    smartRecommendations: false,
    weeklyRecap: false,
    predictiveInsights: false
  });
  
  // Toggle section collapse
  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
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
      const res = await fetch('/api/activities?limit=3');
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
  
  // Filter data based on selected entity if in entity view mode
  let displaySops = allSops;
  
  if (selectedEntity !== "all" && viewMode === "entity") {
    // Filter SOPs for selected entity
    displaySops = allSops.filter(sop => {
      return sop.businessEntityId === Number(selectedEntity) || sop.businessEntityId === null;
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

  // Update query parameters based on selected entity
  useEffect(() => {
    if (selectedEntity === "all") {
      // Reset to enterprise-wide view
    } else {
      // Apply entity filter
    }
  }, [selectedEntity]);

  return (
    <MainLayout
      title="Business Dashboard"
      description="Track your business execution across Finance, Operations, Marketing, Sales and Customer Experience."
    >
      {/* Entity Filtering */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Entity</h3>
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-[240px]">
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
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">View Mode</h3>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "enterprise" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("enterprise")}
            >
              Enterprise View
            </Button>
            <Button 
              variant={viewMode === "entity" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode("entity")}
              disabled={selectedEntity === "all"}
            >
              Entity View
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="mb-6 space-y-6">
        {/* Enhanced Stats Overview Cards */}
        <div className="grid grid-cols-1 gap-4 xs:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingStats ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="w-full overflow-hidden">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-md" />
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              {/* Tool Integration Card */}
              <Link href="/categories">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-2 bg-indigo-500 w-full" />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Business Tools
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {stats.totalTools}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Across {categories.length} business functions
                        </p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <span className="material-icons text-indigo-600 dark:text-indigo-300 text-2xl">
                          integration_instructions
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${75}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tool Coverage
                        </p>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          75%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Monthly Cost Card */}
              <Link href="/financial-overview">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-2 bg-green-500 w-full" />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Monthly Cost
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          ${stats.totalMonthlyCost.toFixed(2)}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ${(stats.totalMonthlyCost * 12).toFixed(2)} yearly
                        </p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <span className="material-icons text-green-600 dark:text-green-300 text-2xl">
                          attach_money
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <div className="flex items-center mr-4">
                        <span className="material-icons text-green-500 text-sm mr-1">
                          arrow_upward
                        </span>
                        <span className="text-xs font-medium text-green-500">
                          5.2%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        vs. previous month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* SOPs Card */}
              <Link href="/operations-dashboard">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-2 bg-amber-500 w-full" />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          SOPs Created
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {stats.totalSops}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Math.round(stats.totalSops * 0.75)} AI-generated
                        </p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                        <span className="material-icons text-amber-600 dark:text-amber-300 text-2xl">
                          description
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          SOPs by category
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {categories.slice(0, 5).map((category, idx) => (
                          <div 
                            key={idx} 
                            className="h-2 rounded-full flex-1" 
                            style={{ 
                              backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][idx % 5]
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Automation Score Card */}
              <Link href="/operations-dashboard?tab=automation">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="h-2 bg-purple-500 w-full" />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Automation Score
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore}%
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {(typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 75 ? 'Excellent' : (typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 50 ? 'Good' : 'Needs improvement'}
                        </p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <span className="material-icons text-purple-600 dark:text-purple-300 text-2xl">
                          auto_awesome
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore}%`,
                            backgroundColor: (typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 75 ? '#8B5CF6' : (typeof stats.automationScore === 'object' ? stats.automationScore.score : stats.automationScore) >= 50 ? '#A78BFA' : '#C4B5FD'
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
        </div>

        {/* Intelligence & Personalization Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Business Intelligence
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Smart Recommendations Panel */}
            {widgets.find(w => w.id === 'smart-recommendations' && w.enabled) && (
              <div className={`${
                widgets.find(w => w.id === 'smart-recommendations')?.size === 'full' 
                  ? 'col-span-full' 
                  : widgets.find(w => w.id === 'smart-recommendations')?.size === 'large'
                  ? 'col-span-2'
                  : 'col-span-1'
              }`}>
                <Card className="overflow-hidden border-0 shadow-lg h-full">
                  <div className="h-2 bg-blue-600 w-full"></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium">Smart Recommendations</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleSectionCollapse('smartRecommendations')}
                        className="px-2 h-8"
                      >
                        <span className="material-icons text-sm">
                          {collapsedSections.smartRecommendations ? 'expand_more' : 'expand_less'}
                        </span>
                      </Button>
                    </div>
                    {!collapsedSections.smartRecommendations && <SmartRecommendationsPanel />}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Weekly Recap */}
            {widgets.find(w => w.id === 'weekly-recap' && w.enabled) && (
              <div className={`${
                widgets.find(w => w.id === 'weekly-recap')?.size === 'full' 
                  ? 'col-span-full' 
                  : widgets.find(w => w.id === 'weekly-recap')?.size === 'large'
                  ? 'col-span-2'
                  : 'col-span-1'
              }`}>
                <Card className="overflow-hidden border-0 shadow-lg h-full">
                  <div className="h-2 bg-purple-600 w-full"></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium">Weekly Business Recap</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleSectionCollapse('weeklyRecap')}
                        className="px-2 h-8"
                      >
                        <span className="material-icons text-sm">
                          {collapsedSections.weeklyRecap ? 'expand_more' : 'expand_less'}
                        </span>
                      </Button>
                    </div>
                    {!collapsedSections.weeklyRecap && <WeeklyRecapCard summaryText="" />}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Predictive Insights */}
            {widgets.find(w => w.id === 'predictive-insights' && w.enabled) && (
              <div className={`${
                widgets.find(w => w.id === 'predictive-insights')?.size === 'full' 
                  ? 'col-span-full' 
                  : widgets.find(w => w.id === 'predictive-insights')?.size === 'large'
                  ? 'col-span-2'
                  : 'col-span-1'
              }`}>
                <Card className="overflow-hidden border-0 shadow-lg h-full">
                  <div className="h-2 bg-emerald-600 w-full"></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-md font-medium">Predictive Insights</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleSectionCollapse('predictiveInsights')}
                        className="px-2 h-8"
                      >
                        <span className="material-icons text-sm">
                          {collapsedSections.predictiveInsights ? 'expand_more' : 'expand_less'}
                        </span>
                      </Button>
                    </div>
                    {!collapsedSections.predictiveInsights && <PredictiveInsightsPanel insights={[]} />}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Data Visualization Section */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Cost Breakdown by Category */}
          <Link href="/cost-breakdown" className="block">
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-5 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  Cost Breakdown by Category
                </h3>
                <span className="text-primary text-sm">View Details →</span>
              </div>
              <div className="h-[250px] sm:h-[300px] w-full">
                <CostBreakdownChart
                  data={[
                    { name: "Finance", value: stats.totalMonthlyCost * 0.25, color: "#3B82F6" },
                    { name: "Operations", value: stats.totalMonthlyCost * 0.20, color: "#10B981" },
                    { name: "Marketing", value: stats.totalMonthlyCost * 0.30, color: "#F59E0B" },
                    { name: "Sales", value: stats.totalMonthlyCost * 0.15, color: "#8B5CF6" },
                    { name: "Customer", value: stats.totalMonthlyCost * 0.10, color: "#EC4899" },
                  ]}
                  timeframe="Monthly"
                  entityName={selectedEntity === "all" ? "All Entities" : entities.find(e => String(e.id) === selectedEntity)?.name || "Unknown Entity"}
                  totalCost={stats.totalMonthlyCost}
                />
              </div>
            </div>
          </Link>
          
          {/* Cost Forecast */}
          <Link href="/cost-forecast" className="block">
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-5 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  Cost Forecast
                </h3>
                <span className="text-primary text-sm">View Details →</span>
              </div>
              <div className="h-[250px] sm:h-[300px] w-full">
                <CostForecastChart
                  data={[
                    { name: "Jan", value: stats.totalMonthlyCost * 0.85 },
                    { name: "Feb", value: stats.totalMonthlyCost * 0.90 },
                    { name: "Mar", value: stats.totalMonthlyCost * 0.95 },
                    { name: "Apr", value: stats.totalMonthlyCost * 0.98 },
                    { name: "May", value: stats.totalMonthlyCost * 0.99 },
                    { name: "Jun", value: stats.totalMonthlyCost },
                    { name: "Jul", value: stats.totalMonthlyCost, projection: stats.totalMonthlyCost },
                    { name: "Aug", value: 0, projection: stats.totalMonthlyCost * 1.05 },
                    { name: "Sep", value: 0, projection: stats.totalMonthlyCost * 1.10 },
                    { name: "Oct", value: 0, projection: stats.totalMonthlyCost * 1.15 },
                    { name: "Nov", value: 0, projection: stats.totalMonthlyCost * 1.18 },
                    { name: "Dec", value: 0, projection: stats.totalMonthlyCost * 1.22 },
                  ]}
                />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Activity & Actions Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 mb-6 sm:mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
          <div className="p-3 sm:p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <Link href="/activities">
                <span className="text-sm font-medium text-primary hover:text-indigo-500 cursor-pointer">
                  View all
                </span>
              </Link>
            </div>
          </div>
          <div className="px-5 py-3">
            {isLoadingActivities ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="ml-3 flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {activities.map((activity) => {
                  let icon = "info";
                  let iconBgClass = "bg-blue-100 dark:bg-blue-900";
                  let iconColor = "text-blue-600 dark:text-blue-300";
                  
                  if (activity.type === "added_tool") {
                    icon = "bookmark_added";
                  } else if (activity.type === "generated_sop") {
                    icon = "description";
                    iconBgClass = "bg-green-100 dark:bg-green-900";
                    iconColor = "text-green-600 dark:text-green-300";
                  } else if (activity.type === "subscription_renewed") {
                    icon = "payments";
                    iconBgClass = "bg-red-100 dark:bg-red-900";
                    iconColor = "text-red-600 dark:text-red-300";
                  }
                  
                  return (
                    <ActivityItem
                      key={activity.id}
                      icon={icon}
                      iconBgClass={iconBgClass}
                      iconColor={iconColor}
                      description={activity.description}
                      timestamp={activity.createdAt}
                    />
                  );
                })}
              </ul>
            ) : (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                No recent activities found.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
          <div className="p-3 sm:p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
              Quick Actions
            </h3>
          </div>
          <div className="p-3 sm:p-5">
            <div className="space-y-2 sm:space-y-3">
              <Button variant="default" className="w-full justify-between text-sm sm:text-base">
                <div className="flex items-center">
                  <span className="material-icons mr-1 sm:mr-2 text-base sm:text-xl">add_circle</span>
                  <span>Add New Tool</span>
                </div>
                <span className="material-icons text-base sm:text-xl">arrow_forward</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between text-sm sm:text-base"
                asChild
              >
                <Link href="/generate-sop">
                  <div className="flex items-center">
                    <span className="material-icons mr-1 sm:mr-2 text-base sm:text-xl">smart_toy</span>
                    <span>Generate SOP with AI</span>
                  </div>
                  <span className="material-icons text-base sm:text-xl">arrow_forward</span>
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between text-sm sm:text-base"
                asChild
              >
                <Link href="/cost-analysis">
                  <div className="flex items-center">
                    <span className="material-icons mr-1 sm:mr-2 text-base sm:text-xl">assessment</span>
                    <span>Run Cost Analysis</span>
                  </div>
                  <span className="material-icons text-base sm:text-xl">arrow_forward</span>
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between text-sm sm:text-base"
                asChild
              >
                <Link href="/business-assistant">
                  <div className="flex items-center">
                    <span className="material-icons mr-1 sm:mr-2 text-base sm:text-xl">chat</span>
                    <span>Ask Business Assistant</span>
                  </div>
                  <span className="material-icons text-base sm:text-xl">arrow_forward</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Business Toolkit</h2>
        {isLoadingCategories || isLoadingStats ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {Array(5).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-6 w-6 rounded-full mr-2" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const categoryStats = toolsByCategory[category.slug] || { count: 0, cost: 0 };
              
              return (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  icon={category.icon}
                  iconColor={category.color}
                  toolCount={categoryStats.count}
                  monthlyCost={categoryStats.cost}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Recent SOPs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Generated SOPs</h2>
          <Button 
            asChild
            className="flex items-center"
          >
            <Link href="/generate-sop">
              <span className="material-icons mr-1 text-sm">add</span>
              Generate New
            </Link>
          </Button>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          {isLoadingSops ? (
            <div className="p-4 space-y-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex space-x-6">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : displaySops.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {displaySops.slice(0, 3).map((sop) => {
                const category = categories.find(c => c.id === sop.categoryId) || {
                  id: 0,
                  name: "Unknown",
                  color: "text-gray-500"
                };
                
                return (
                  <SOPItem
                    key={sop.id}
                    id={sop.id}
                    title={sop.title}
                    category={{
                      name: category.name,
                      color: category.color
                    }}
                    stepCount={sop.steps.length}
                    isAiGenerated={sop.isAiGenerated}
                    createdAt={sop.createdAt}
                  />
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No SOPs found. Generate your first SOP!
              </p>
              <Button className="mt-4" asChild>
                <Link href="/generate-sop">Generate SOP</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Recommendations</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="material-icons text-indigo-600 dark:text-indigo-300">auto_awesome</span>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Business Assistant</h3>
            </div>
            <div className="border-l-4 border-primary pl-4 py-2 mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                Based on your current tool usage and business needs, I recommend the following improvements:
              </p>
            </div>
            
            {isLoadingRecommendations ? (
              <div className="space-y-4 mt-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex">
                      <Skeleton className="h-6 w-6 mr-2" />
                      <div className="w-full">
                        <Skeleton className="h-5 w-64 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-8 w-24 mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <ul className="space-y-3 mt-4">
                {recommendations.map((recommendation) => (
                  <RecommendationItem
                    key={recommendation.id}
                    id={recommendation.id}
                    title={recommendation.title}
                    description={recommendation.description}
                    type={recommendation.type}
                    status={recommendation.status}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No current recommendations. Generate new ones for your business.
                </p>
                <Button asChild>
                  <Link href="/generate-recommendations">Generate Recommendations</Link>
                </Button>
              </div>
            )}
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center text-sm sm:text-base"
                asChild
              >
                <Link href="/business-assistant">
                  <span className="material-icons mr-1 sm:mr-2 text-base sm:text-xl">chat</span>
                  Ask Business Assistant for more recommendations
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
