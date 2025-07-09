import React, { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CostBreakdownChart from '@/components/CostBreakdownChart';
import CostForecastChart from '@/components/CostForecastChart';
import CostAnalysisSimulator from '@/components/CostAnalysisSimulator';
import { Filter, Plus, DollarSign, LineChart, BarChart4, Calendar, FileSpreadsheet } from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';

export default function CostAnalysis() {
  const [timeframe, setTimeframe] = useState('monthly');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState('overview');

  // Fetch business entities
  const { data: entities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch tech stack data with entity filtering
  const { data: techStack } = useQuery({
    queryKey: ['/api/tech-stack', selectedEntity !== 'all' ? { businessEntityId: selectedEntity } : {}],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Fetch business entities
  const { data: businessEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Calculate total monthly cost
  const totalMonthlyCost = Array.isArray(techStack) 
    ? techStack.reduce((sum, item) => sum + (item.monthlyPrice || 0), 0) 
    : 0;

  // Calculate annual cost
  const totalAnnualCost = totalMonthlyCost * 12;

  // Group tools by category
  const toolsByCategory = Array.isArray(techStack) 
    ? techStack.reduce((acc, item) => {
        const categoryId = item.tool.categoryId;
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push(item);
        return acc;
      }, {} as Record<number, any[]>) 
    : {};

  // Prepare category cost data for breakdown chart
  const categoryColors = {
    'finance': '#4f46e5',
    'operations': '#0891b2',
    'marketing': '#db2777',
    'sales': '#ea580c',
    'customer': '#65a30d',
    'other': '#6b7280',
  };

  // Find category name by id
  const getCategoryName = (categoryId: number) => {
    const c = categories?.find(c => c.id === categoryId);
    const fallbackName = c ? c.name : 'Other';
    return fallbackName.toLowerCase();
  };

  // Get color for a category
  const getCategoryColor = (categoryId: number) => {
    const categoryName = getCategoryName(categoryId);
    const colorKey = Object.keys(categoryColors).find(key => 
      categoryName.includes(key)
    ) || 'other';
    return categoryColors[colorKey as keyof typeof categoryColors];
  };

  // Calculate cost by category
  const costByCategory = Object.entries(toolsByCategory).map(([categoryId, tools]) => {
    const totalCost = tools.reduce((acc, item) => {
      return acc + (item.monthlyPrice || 0);
    }, 0);
    
    return {
      name: getCategoryName(Number(categoryId)),
      value: timeframe === 'monthly' ? totalCost : totalCost * 12,
      color: getCategoryColor(Number(categoryId))
    };
  });

  // Group tools by pricing tier
  const pricingTiers = ['free', 'low_cost', 'mid_tier', 'enterprise'];
  
  const toolsByTier = Array.isArray(techStack) 
    ? techStack.reduce((acc, item) => {
        const tierSlug = item.tool.tierSlug;
        if (!acc[tierSlug]) {
          acc[tierSlug] = [];
        }
        acc[tierSlug].push(item);
        return acc;
      }, {} as Record<string, any[]>) 
    : {};

  // Calculate cost by pricing tier
  const costByTier = pricingTiers.map(tier => {
    const tools = toolsByTier[tier] || [];
    const totalCost = tools.reduce((acc, item) => {
      return acc + (item.monthlyPrice || 0);
    }, 0);
    
    return {
      name: tier.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: timeframe === 'monthly' ? totalCost : totalCost * 12,
      color: tier === 'free' ? '#65a30d' : 
             tier === 'low_cost' ? '#0891b2' : 
             tier === 'mid_tier' ? '#ea580c' : 
             '#4f46e5'
    };
  }).filter(item => item.value > 0);

  // Generate historical and forecast data for the forecast chart
  const generateForecastData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Generate past 6 months of data
    const historicalData = [];
    for (let i = 6; i >= 1; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      // Create some random variation for demo purposes
      const variationFactor = 0.9 + (Math.random() * 0.2);
      historicalData.push({
        name: months[monthIndex],
        value: Math.round(totalMonthlyCost * variationFactor)
      });
    }
    
    // Current month
    historicalData.push({
      name: months[currentMonth],
      value: totalMonthlyCost
    });
    
    // Generate 6 months of forecast data
    const forecastData = [];
    const growthRate = 1.05; // 5% monthly growth
    let lastValue = totalMonthlyCost;
    
    for (let i = 1; i <= 6; i++) {
      const monthIndex = (currentMonth + i) % 12;
      lastValue = Math.round(lastValue * growthRate);
      forecastData.push({
        name: months[monthIndex],
        value: totalMonthlyCost, // Historical reference point
        projection: lastValue
      });
    }
    
    return [...historicalData, ...forecastData];
  };

  const forecastData = generateForecastData();

  // Prepare data for business entities drop-down
  const entityOptions = Array.isArray(entities) 
    ? entities.map(entity => ({
        id: entity.id,
        name: entity.name
      })) 
    : [];

  // Prepare existing tools data for simulator
  const existingToolOptions = Array.isArray(techStack) 
    ? techStack.map(item => ({
        id: item.toolId,
        name: item.tool.name,
        monthlyPrice: item.monthlyPrice || 0,
        category: getCategoryName(item.tool.categoryId)
      })) 
    : [];

  // Handler for saving scenarios
  const handleSaveScenario = (scenarioData: any) => {
    // Removed console.log for performance optimization
    // Here you would typically send this to your API
  };

  return (
    <MainLayout 
      title="Cost Analysis"
      description="Analyze and forecast your technology costs"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold">Cost Analysis</h2>
            <p className="text-muted-foreground">
              Current Monthly Cost: ${totalMonthlyCost.toFixed(2)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {entityOptions.map(entity => (
                  <SelectItem key={entity.id} value={entity.id.toString()}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Monthly Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMonthlyCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +4.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Annual Cost
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAnnualCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Based on current monthly spending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tools
              </CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{techStack?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across {Object.keys(toolsByCategory).length || 0} categories
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <BarChart4 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="forecast">
              <LineChart className="mr-2 h-4 w-4" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="simulator">
              <Plus className="mr-2 h-4 w-4" />
              Cost Simulator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <CostBreakdownChart
                data={costByCategory}
                timeframe={timeframe === 'monthly' ? 'Monthly' : 'Annual'}
                entityName={selectedEntity === 'all' ? 'All Entities' : entityOptions.find(e => e.id.toString() === selectedEntity)?.name}
                totalCost={timeframe === 'monthly' ? totalMonthlyCost : totalAnnualCost}
              />
              
              <CostBreakdownChart
                data={costByTier}
                timeframe={timeframe === 'monthly' ? 'Monthly' : 'Annual'}
                entityName={selectedEntity === 'all' ? 'All Entities' : entityOptions.find(e => e.id.toString() === selectedEntity)?.name}
                totalCost={timeframe === 'monthly' ? totalMonthlyCost : totalAnnualCost}
              />
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>
                    Detailed cost breakdown by tool and category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tool
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tier
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monthly Cost
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(techStack) && techStack.length > 0 
                          ? techStack.sort((a, b) => (b.monthlyPrice || 0) - (a.monthlyPrice || 0)).map(item => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.tool.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getCategoryName(item.tool.categoryId)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.tool.tierSlug.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${(item.monthlyPrice || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${((item.monthlyPrice || 0) * 12).toFixed(2)}
                              </td>
                            </tr>
                          ))
                          : (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                <div className="flex flex-col items-center">
                                  <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-2" />
                                  <p className="font-medium">No tools in your tech stack yet</p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Add tools to your tech stack to see them in this cost breakdown
                                  </p>
                                  <Button 
                                    variant="outline" 
                                    className="mt-4"
                                    onClick={() => {
                                      // Navigate to categories page
                                      window.location.href = '/';
                                    }}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Tools
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="forecast">
            <div className="mt-6">
              <CostForecastChart data={forecastData} />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Drivers</CardTitle>
                  <CardDescription>
                    Factors impacting your cost forecast
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Team Growth</p>
                        <p className="text-sm text-gray-500">Additional user licenses</p>
                      </div>
                      <span className="text-amber-500 font-medium">+12.4%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">New Tools</p>
                        <p className="text-sm text-gray-500">Projected additions</p>
                      </div>
                      <span className="text-amber-500 font-medium">+8.7%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Price Increases</p>
                        <p className="text-sm text-gray-500">Vendor price changes</p>
                      </div>
                      <span className="text-amber-500 font-medium">+5.2%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Tool Consolidation</p>
                        <p className="text-sm text-gray-500">Elimination of redundant tools</p>
                      </div>
                      <span className="text-emerald-500 font-medium">-7.8%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cost Optimization</CardTitle>
                  <CardDescription>
                    Recommendations to reduce costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="mt-0.5 bg-amber-100 text-amber-800 p-1.5 rounded-full">
                        <DollarSign className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="font-medium">Annual Billing Discount</p>
                        <p className="text-sm text-gray-500">Switch to annual billing for key tools to save up to 20%</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="mt-0.5 bg-emerald-100 text-emerald-800 p-1.5 rounded-full">
                        <DollarSign className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="font-medium">Tool Consolidation</p>
                        <p className="text-sm text-gray-500">Consolidate 3 overlapping marketing tools to save $247/month</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="mt-0.5 bg-blue-100 text-blue-800 p-1.5 rounded-full">
                        <DollarSign className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="font-medium">License Optimization</p>
                        <p className="text-sm text-gray-500">Audit inactive user accounts to reduce license costs</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="mt-0.5 bg-purple-100 text-purple-800 p-1.5 rounded-full">
                        <DollarSign className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="font-medium">Tier Downgrade</p>
                        <p className="text-sm text-gray-500">Evaluate enterprise plans for downgrades based on feature usage</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="simulator">
            <div className="mt-6">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle>Entity Selection</CardTitle>
                  <CardDescription>
                    Select a business entity to analyze costs for that specific entity, or view all entities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Business Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities (Company-wide)</SelectItem>
                      {entityOptions.map(entity => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              <CostAnalysisSimulator 
                businessEntities={entityOptions}
                existingTools={existingToolOptions}
                onSaveScenario={handleSaveScenario}
                selectedEntityId={selectedEntity}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}