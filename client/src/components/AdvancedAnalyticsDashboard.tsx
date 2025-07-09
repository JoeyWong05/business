import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowUpRight,
  BarChart2,
  Brain,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Filter,
  HelpCircle,
  LineChart as LineChartIcon,
  ListFilter,
  PieChart as PieChartIcon,
  Plus,
  RefreshCw,
  Save,
  Share2,
  Sliders,
  Terminal,
  Zap
} from 'lucide-react';

// Types
interface AnalyticsData {
  timeRange: string;
  metrics: any[];
  kpis: any[];
}

// Sample data for visualizations
const sampleData = {
  revenue: [
    { month: 'Jan', actual: 4000, forecast: 3800, lastYear: 3200 },
    { month: 'Feb', actual: 4200, forecast: 3900, lastYear: 3300 },
    { month: 'Mar', actual: 4500, forecast: 4000, lastYear: 3400 },
    { month: 'Apr', actual: 4800, forecast: 4200, lastYear: 3600 },
    { month: 'May', actual: 5100, forecast: 4500, lastYear: 3800 },
    { month: 'Jun', actual: 5400, forecast: 4700, lastYear: 4000 },
    { month: 'Jul', actual: 0, forecast: 5000, lastYear: 4200 },
    { month: 'Aug', actual: 0, forecast: 5300, lastYear: 4400 },
    { month: 'Sep', actual: 0, forecast: 5500, lastYear: 4500 },
    { month: 'Oct', actual: 0, forecast: 5800, lastYear: 4700 },
    { month: 'Nov', actual: 0, forecast: 6000, lastYear: 4900 },
    { month: 'Dec', actual: 0, forecast: 6300, lastYear: 5100 },
  ],
  expenses: [
    { category: 'Marketing', value: 25000, percentage: 25 },
    { category: 'Operations', value: 35000, percentage: 35 },
    { category: 'Sales', value: 20000, percentage: 20 },
    { category: 'Technology', value: 15000, percentage: 15 },
    { category: 'Admin', value: 5000, percentage: 5 },
  ],
  products: [
    { name: 'Product A', sales: 4000, returns: 240, satisfaction: 4.2 },
    { name: 'Product B', sales: 3000, returns: 150, satisfaction: 4.5 },
    { name: 'Product C', sales: 2000, returns: 180, satisfaction: 3.8 },
    { name: 'Product D', sales: 2780, returns: 90, satisfaction: 4.7 },
    { name: 'Product E', sales: 1890, returns: 120, satisfaction: 4.0 },
    { name: 'Product F', sales: 2390, returns: 210, satisfaction: 3.5 },
  ],
  channels: [
    { name: 'Website', value: 35 },
    { name: 'Amazon', value: 30 },
    { name: 'Walmart', value: 15 },
    { name: 'eBay', value: 10 },
    { name: 'Etsy', value: 10 },
  ],
  customerSegments: [
    { name: 'New', value: 30 },
    { name: 'Returning', value: 45 },
    { name: 'VIP', value: 25 },
  ],
  customerRetention: [
    { month: 'Jan', rate: 85 },
    { month: 'Feb', rate: 83 },
    { month: 'Mar', rate: 86 },
    { month: 'Apr', rate: 87 },
    { month: 'May', rate: 88 },
    { month: 'Jun', rate: 86 },
  ],
  costOptimizationSuggestions: [
    {
      id: 1,
      title: 'Consolidate marketing tools',
      description: 'Reduce overlap between Mailchimp and Constant Contact.',
      potentialSavings: 1200,
      impactLevel: 'Medium',
      complexity: 'Low',
      aiGenerated: true,
    },
    {
      id: 2,
      title: 'Upgrade Shopify plan',
      description: 'Current usage would be more cost-effective on annual plan.',
      potentialSavings: 450,
      impactLevel: 'Low',
      complexity: 'Low',
      aiGenerated: true,
    },
    {
      id: 3,
      title: 'Renegotiate warehouse lease',
      description: 'Current market rates are 15% lower than current contract.',
      potentialSavings: 5400,
      impactLevel: 'High',
      complexity: 'Medium',
      aiGenerated: true,
    },
  ],
  aiInsights: [
    {
      id: 1,
      title: 'Revenue pattern detected',
      description: 'Sales increase by 22% following email campaigns. Consider increasing email frequency.',
      category: 'Marketing',
      confidence: 89,
    },
    {
      id: 2,
      title: 'Inventory optimization',
      description: 'Product C has 40% higher holding costs than industry benchmark. Consider JIT inventory.',
      category: 'Operations',
      confidence: 92,
    },
    {
      id: 3,
      title: 'Customer segmentation opportunity',
      description: 'High-value customer group identified who purchase within 3 days of abandoned cart emails.',
      category: 'Sales',
      confidence: 78,
    },
  ],
};

// Color palette for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Advanced Analytics Dashboard Component
const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('last_30_days');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedVisualization, setSelectedVisualization] = useState<string>('line');
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState<boolean>(true);
  const [exportFormat, setExportFormat] = useState<string>('pdf');
  
  // Business entities
  const entities = [
    { id: 1, name: 'Digital Merch Pros' },
    { id: 2, name: 'Mystery Hype' },
    { id: 3, name: 'Lone Star Custom Clothing' },
    { id: 4, name: 'Alcoeaze' },
    { id: 5, name: 'Hide Cafe Bars' },
  ];
  
  // Format large numbers with comma separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Handle export to different formats
  const handleExport = () => {
    // Console log removed for performance optimization
    // In a real implementation, this would generate and download the export file
  };
  
  // Handle insight dismissal
  const handleDismissInsight = (id: number) => {
    // Console log removed for performance optimization
    // In a real implementation, this would remove the insight from the list
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            AI-powered insights and interactive data visualizations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={selectedEntity}
            onValueChange={setSelectedEntity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entities.map(entity => (
                <SelectItem key={entity.id} value={entity.name}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="year_to_date">Year to date</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-insights"
              checked={aiInsightsEnabled}
              onCheckedChange={setAiInsightsEnabled}
            />
            <Label htmlFor="ai-insights" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              AI Insights
            </Label>
          </div>
        </div>
      </div>
      
      {/* AI-generated insights panel */}
      {aiInsightsEnabled && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1.5">
                  <Brain className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
                <CardTitle className="text-blue-700 dark:text-blue-300">AI-Generated Business Insights</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                Powered by OpenAI
              </Badge>
            </div>
            <CardDescription className="text-blue-600 dark:text-blue-400">
              Data-driven insights to optimize your business operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {sampleData.aiInsights.map((insight) => (
                <Card key={insight.id} className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{insight.title}</CardTitle>
                      <Badge variant="outline">{insight.category}</Badge>
                    </div>
                    <CardDescription className="text-sm">
                      Confidence: {insight.confidence}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">{insight.description}</p>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-2" onClick={() => handleDismissInsight(insight.id)}>
                      Dismiss
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-2">
                      Apply
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 w-full">
              <Plus className="mr-2 h-4 w-4" />
              Generate more insights
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$268,500</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  12.5% from previous period
                </div>
                <div className="mt-3">
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cost Reduction
                </CardTitle>
                <LineChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$48,250</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  8.3% from previous period
                </div>
                <div className="mt-3">
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  ROI
                </CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142%</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  5.2% from previous period
                </div>
                <div className="mt-3">
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Optimization Opportunities
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${formatNumber(sampleData.costOptimizationSuggestions.reduce((acc, item) => acc + item.potentialSavings, 0))}</div>
                <div className="flex items-center pt-1 text-xs text-blue-500">
                  <Brain className="mr-1 h-3 w-3" />
                  AI-detected savings
                </div>
                <div className="mt-3 flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    3 suggestions
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue Forecast</CardTitle>
                  <ToggleGroup type="single" value={selectedVisualization} onValueChange={(value) => value && setSelectedVisualization(value)}>
                    <ToggleGroupItem value="line" aria-label="Line chart">
                      <LineChartIcon className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="area" aria-label="Area chart">
                      <BarChart2 className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <CardDescription>
                  Actual vs forecast revenue with AI predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedVisualization === 'line' ? (
                    <LineChart data={sampleData.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="lastYear" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <AreaChart data={sampleData.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="actual" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="forecast" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="lastYear" stackId="3" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Distribution by department with optimization potential
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sampleData.expenses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sampleData.expenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${formatNumber(value)}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cost Optimization Suggestions</CardTitle>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Brain className="mr-1 h-3 w-3" />
                  AI-Generated
                </Badge>
              </div>
              <CardDescription>
                Potential cost savings identified by AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleData.costOptimizationSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ${formatNumber(suggestion.potentialSavings)}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant={suggestion.impactLevel === 'High' ? 'default' : (suggestion.impactLevel === 'Medium' ? 'outline' : 'secondary')}>
                            {suggestion.impactLevel} Impact
                          </Badge>
                          <Badge variant="outline">
                            {suggestion.complexity} Complexity
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm">Dismiss</Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Generate More Suggestions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue Analysis</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={exportFormat}
                    onValueChange={setExportFormat}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Export as" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              <CardDescription>
                Revenue distribution and trends by channel and product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px]">
                  <h3 className="text-sm font-medium mb-2">Revenue by Channel</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sampleData.channels}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sampleData.channels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <h3 className="text-sm font-medium mb-2">Product Sales</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampleData.products}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" />
                      <Bar dataKey="returns" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Monthly Revenue Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleData.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${formatNumber(value)}`, 'Amount']} />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="lastYear" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Drivers</CardTitle>
                <CardDescription>
                  Top factors influencing revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Website Traffic</span>
                      <span className="text-sm">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Social Media</span>
                      <span className="text-sm">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Email Marketing</span>
                      <span className="text-sm">83%</span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Paid Advertising</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Revenue Predictions</CardTitle>
                <CardDescription>
                  Machine learning revenue forecasts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Short-term Forecast (30 days)</h3>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-2xl font-bold">$89,500</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        +12% expected growth
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Based on current trend analysis and seasonal patterns
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Q3 Projection</h3>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-2xl font-bold">$275,000</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        92% confidence
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Incorporates market trends and historical performance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Costs Tab */}
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cost Analysis</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              <CardDescription>
                Detailed breakdown and tracking of all business expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px]">
                  <h3 className="text-sm font-medium mb-2">Cost Distribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sampleData.expenses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sampleData.expenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${formatNumber(value)}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-[300px]">
                  <h3 className="text-sm font-medium mb-2">Monthly Cost Trend</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', cost: 35000 },
                      { month: 'Feb', cost: 38000 },
                      { month: 'Mar', cost: 37500 },
                      { month: 'Apr', cost: 39000 },
                      { month: 'May', cost: 40000 },
                      { month: 'Jun', cost: 41000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${formatNumber(value)}`, 'Cost']} />
                      <Legend />
                      <Line type="monotone" dataKey="cost" stroke="#ff8042" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Cost Optimization Suggestions</h3>
                {sampleData.costOptimizationSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ${formatNumber(suggestion.potentialSavings)}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant={suggestion.impactLevel === 'High' ? 'default' : (suggestion.impactLevel === 'Medium' ? 'outline' : 'secondary')}>
                            {suggestion.impactLevel} Impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button size="sm">Implement</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Performance</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              <CardDescription>
                Sales, returns, and customer satisfaction analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sampleData.products}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#ff8042" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="returns" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Product Satisfaction Scores</h3>
                <div className="space-y-4">
                  {sampleData.products.map((product, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{product.name}</span>
                        <span className="text-sm">{product.satisfaction}/5.0</span>
                      </div>
                      <Progress value={product.satisfaction * 20} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>
                  Revenue distribution by customer type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sampleData.customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sampleData.customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>
                  Monthly retention rate
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleData.customerRetention}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI-Generated Customer Insights</CardTitle>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Brain className="mr-1 h-3 w-3" />
                  OpenAI Powered
                </Badge>
              </div>
              <CardDescription>
                Machine learning derived patterns in customer behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Customer Purchasing Patterns</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analysis shows 68% of customers who purchase Product A also purchase Product C within 30 days. Consider bundle promotions to capitalize on this trend.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm">Create Bundle Promotion</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Churn Risk Identification</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI has identified 47 customers at high risk of churn based on declining engagement patterns. Most common factors include reduced site visits and no purchases in 60+ days.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm">View At-Risk Customers</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Customer Feedback Analysis</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sentiment analysis of recent customer reviews shows increasing concerns about shipping times (mentioned in 32% of negative reviews). Consider improving logistics or setting clearer expectations.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm">View Detailed Analysis</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <CalendarDays className="inline-block mr-1 h-4 w-4" />
                  Last updated: Today at 09:45 AM
                </div>
                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Insights
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Command Terminal for Advanced User Queries */}
      <Card className="bg-black text-white dark:border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <CardTitle className="text-white">AI Data Analysis Terminal</CardTitle>
            </div>
            <Button variant="ghost" className="h-8 px-2 text-white">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            Ask complex analytical questions in natural language
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-md">
              <p className="text-sm text-gray-300 mb-2">
                <span className="text-blue-400 font-mono">Query:</span> What's the correlation between marketing spend and revenue in Q2?
              </p>
              <p className="text-sm text-gray-200">
                <span className="text-green-400 font-mono">Result:</span> Analysis shows a positive correlation (r=0.78) between marketing spend and revenue in Q2. For every $1000 increase in marketing spend, revenue increased by approximately $3,450. The strongest channel effect was observed in social media advertising (4.2x ROI).
              </p>
            </div>
            <div className="flex">
              <Input 
                className="flex-1 bg-gray-800 border-gray-700 text-white" 
                placeholder="Ask a question about your business data..."
              />
              <Button className="ml-2 bg-blue-600 hover:bg-blue-700">
                Analyze
              </Button>
            </div>
            <div className="text-xs text-gray-400">
              Examples: "Compare revenue across all entities", "Predict cashflow for next quarter", "Identify underperforming products"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;