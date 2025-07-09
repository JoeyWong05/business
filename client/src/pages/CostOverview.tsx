import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowDown, Calendar, TrendingUp, Building, Download } from "lucide-react";

// Sample color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function CostOverview() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [economiesOfScaleView, setEconomiesOfScaleView] = useState(false);

  // Fetch companies data
  const { data: companiesData } = useQuery({
    queryKey: ['/api/companies'],
  });
  
  // Fetch financial transactions
  const { data: financialData } = useQuery({
    queryKey: ['/api/financial-transactions'],
  });

  // Fetch tech stack with costs
  const { data: techStackData } = useQuery({
    queryKey: ['/api/tech-stack'],
  });

  // Process companies data
  const companies = companiesData?.companies || [];
  
  // Calculate total costs by time period
  const calculateCosts = () => {
    const techStack = techStackData?.techStack || [];
    
    // Default monthly costs from tech stack
    const monthlyCostsByCompany = companies.reduce((acc, company) => {
      // Filter tech stack items for this company
      const companyCosts = techStack
        .filter(item => item.businessEntityId === company.businessEntityId)
        .reduce((sum, item) => sum + (item.monthlyPrice || 0), 0);
        
      acc[company.id] = companyCosts;
      return acc;
    }, {});
    
    // Add a total for all companies
    monthlyCostsByCompany.total = Object.values(monthlyCostsByCompany)
      .reduce((sum: number, cost: number) => sum + cost, 0);
    
    // Calculate other time periods
    const dailyCostsByCompany = Object.entries(monthlyCostsByCompany).reduce((acc, [key, value]) => {
      acc[key] = Number(value) / 30; // Approximate daily cost
      return acc;
    }, {});
    
    const weeklyCostsByCompany = Object.entries(monthlyCostsByCompany).reduce((acc, [key, value]) => {
      acc[key] = Number(value) * 12 / 52; // Weekly cost
      return acc;
    }, {});
    
    const yearlyCostsByCompany = Object.entries(monthlyCostsByCompany).reduce((acc, [key, value]) => {
      acc[key] = Number(value) * 12; // Yearly cost
      return acc;
    }, {});
    
    return {
      daily: dailyCostsByCompany,
      weekly: weeklyCostsByCompany,
      monthly: monthlyCostsByCompany,
      yearly: yearlyCostsByCompany
    };
  };

  // Calculate economies of scale
  const calculateEconomiesOfScale = () => {
    const techStack = techStackData?.techStack || [];
    
    // Group tools by ID to find duplicates across companies
    const toolUsage = techStack.reduce((acc, item) => {
      if (!acc[item.toolId]) {
        acc[item.toolId] = {
          count: 0,
          companies: new Set(),
          totalCost: 0,
          name: item.tool?.name || `Tool ${item.toolId}`,
          baseCost: item.monthlyPrice || 0
        };
      }
      
      acc[item.toolId].count++;
      acc[item.toolId].companies.add(item.businessEntityId);
      acc[item.toolId].totalCost += (item.monthlyPrice || 0);
      
      return acc;
    }, {});
    
    // Estimate potential savings if each tool was only purchased once
    const sharedToolsSavings = Object.values(toolUsage)
      .filter((tool: any) => tool.count > 1)
      .map((tool: any) => {
        const companyCount = tool.companies.size;
        const totalSpend = tool.totalCost;
        const potentialSpend = tool.baseCost; // If just bought once
        const savings = totalSpend - potentialSpend;
        const savingsPercent = (savings / totalSpend) * 100;
        
        return {
          name: tool.name,
          companyCount,
          totalSpend,
          potentialSpend,
          savings,
          savingsPercent
        };
      });
      
    // Sort by highest savings
    sharedToolsSavings.sort((a: any, b: any) => b.savings - a.savings);
    
    // Calculate total potential savings
    const totalSavings = sharedToolsSavings.reduce((sum: number, tool: any) => sum + tool.savings, 0);
    const totalSpend = Object.values(toolUsage).reduce((sum: any, tool: any) => sum + tool.totalCost, 0);
    const savingsPercent = totalSavings / totalSpend * 100;
    
    return {
      sharedToolsSavings,
      totalSavings,
      totalSpend,
      savingsPercent
    };
  };

  // Prepare data for charts and metrics
  const costs = calculateCosts();
  const economiesOfScale = calculateEconomiesOfScale();
  
  // Data for the current selected timeframe
  const currentTimeframeCosts = costs[selectedTimeframe];
  
  // Format data for charts
  const prepareBarChartData = () => {
    return companies.map(company => ({
      name: company.name,
      cost: currentTimeframeCosts[company.id] || 0,
    }));
  };
  
  const preparePieChartData = () => {
    return companies.map(company => ({
      name: company.name,
      value: currentTimeframeCosts[company.id] || 0,
    }));
  };
  
  // Format for the economies of scale chart
  const prepareEconomiesOfScaleData = () => {
    return economiesOfScale.sharedToolsSavings.slice(0, 5).map(tool => ({
      name: tool.name,
      current: tool.totalSpend,
      optimized: tool.potentialSpend,
      savings: tool.savings
    }));
  };
  
  // Calculate time period factor for display
  const timeFactorMap = {
    daily: { label: 'Daily', factor: 1/30 },
    weekly: { label: 'Weekly', factor: 12/52 },
    monthly: { label: 'Monthly', factor: 1 },
    yearly: { label: 'Yearly', factor: 12 }
  };
  
  const currentFactor = timeFactorMap[selectedTimeframe].factor;
  const totalCost = currentTimeframeCosts.total || 0;

  return (
    <MainLayout title="Cost Overview" description="Analyze costs across companies and time periods">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Cost Overview</TabsTrigger>
              <TabsTrigger value="comparison">Company Comparison</TabsTrigger>
              <TabsTrigger value="economies">Economies of Scale</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {/* Time period selection */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Costs</SelectItem>
                      <SelectItem value="weekly">Weekly Costs</SelectItem>
                      <SelectItem value="monthly">Monthly Costs</SelectItem>
                      <SelectItem value="yearly">Yearly Costs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="ml-2 px-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {timeFactorMap[selectedTimeframe].label} View
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
              
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total {timeFactorMap[selectedTimeframe].label} Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary mr-2" />
                      <div className="text-2xl font-bold">
                        ${totalCost.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across {companies.length} companies
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Cost Per Company
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-primary mr-2" />
                      <div className="text-2xl font-bold">
                        ${(totalCost / (companies.length || 1)).toFixed(2)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per company average
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Potential Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <div className="text-2xl font-bold text-green-500">
                        ${(economiesOfScale.totalSavings * currentFactor).toFixed(2)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">{economiesOfScale.savingsPercent.toFixed(1)}%</span> potential reduction
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main cost chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Distribution by Company</CardTitle>
                  <CardDescription>
                    {timeFactorMap[selectedTimeframe].label} cost breakdown across all business entities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareBarChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis label={{ value: `Cost ($)`, angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                        <Legend />
                        <Bar dataKey="cost" fill="#8884d8" name={`${timeFactorMap[selectedTimeframe].label} Cost`} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Pie chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Proportional Spending</CardTitle>
                  <CardDescription>
                    Relative cost allocation across companies
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[300px] w-full max-w-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={preparePieChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {preparePieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Cost Comparison</CardTitle>
                  <CardDescription>
                    Compare costs between different companies over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Daily", cost: costs.daily[selectedCompany === "all" ? "total" : selectedCompany] || 0 },
                          { name: "Weekly", cost: costs.weekly[selectedCompany === "all" ? "total" : selectedCompany] || 0 },
                          { name: "Monthly", cost: costs.monthly[selectedCompany === "all" ? "total" : selectedCompany] || 0 },
                          { name: "Yearly", cost: costs.yearly[selectedCompany === "all" ? "total" : selectedCompany] || 0 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Cost']} />
                        <Legend />
                        <Bar dataKey="cost" fill="#8884d8" name="Cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="economies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Economies of Scale Analysis</CardTitle>
                  <CardDescription>
                    Potential savings through shared services and tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium">Top 5 Optimization Opportunities</h3>
                      <p className="text-sm text-muted-foreground">
                        Tools used across multiple companies with highest potential savings
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      {economiesOfScale.savingsPercent.toFixed(1)}% Potential Savings
                    </Badge>
                  </div>
                
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareEconomiesOfScaleData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        barGap={0}
                        barCategoryGap={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                        <Legend />
                        <Bar dataKey="current" fill="#ff8042" name="Current Monthly Cost" />
                        <Bar dataKey="optimized" fill="#00C49F" name="Optimized Cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-medium">Optimization Strategy</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      By consolidating licenses and subscriptions across your companies, you could 
                      potentially save ${economiesOfScale.totalSavings.toFixed(2)} monthly 
                      (${(economiesOfScale.totalSavings * 12).toFixed(2)} annually). This represents 
                      a {economiesOfScale.savingsPercent.toFixed(1)}% reduction in total technology costs.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h5 className="font-medium mb-2">Recommended Actions</h5>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Consolidate subscriptions for shared tools</li>
                          <li>Negotiate enterprise agreements across entities</li>
                          <li>Implement license management system</li>
                          <li>Review usage patterns for optimization</li>
                        </ul>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-4">
                        <h5 className="font-medium mb-2">Annual Impact</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Current Annual:</div>
                          <div className="font-medium">${(economiesOfScale.totalSpend * 12).toFixed(2)}</div>
                          <div>Optimized Annual:</div>
                          <div className="font-medium">${((economiesOfScale.totalSpend - economiesOfScale.totalSavings) * 12).toFixed(2)}</div>
                          <div>Total Savings:</div>
                          <div className="font-medium text-green-600">${(economiesOfScale.totalSavings * 12).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}