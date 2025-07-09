import React, { useState } from 'react';
import { 
  Command, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  BarChart3, 
  BellRing, 
  Rocket, 
  Zap,
  ArrowRight,
  Target,
  LineChart,
  Users,
  ShoppingCart,
  DollarSign,
  Award,
  CheckCircle2
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDemoMode } from '@/hooks/use-demo-mode';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEMO_DATA = {
  kpis: [
    { name: 'Monthly Revenue', value: '$124,587', change: '+12.5%', isPositive: true, icon: DollarSign },
    { name: 'Customer Acquisition Cost', value: '$24.18', change: '-4.2%', isPositive: true, icon: Users },
    { name: 'Conversion Rate', value: '3.8%', change: '+0.7%', isPositive: true, icon: Target },
    { name: 'Active Campaigns', value: '7', change: '+2', isPositive: true, icon: Rocket },
    { name: 'Automation Score', value: '83%', change: '+5%', isPositive: true, icon: Zap },
  ],
  alerts: [
    { id: 1, level: 'critical', source: 'Finance', message: 'Monthly expense report requires approval', time: '2 hours ago' },
    { id: 2, level: 'warning', source: 'Operations', message: 'Inventory levels below threshold for 3 products', time: '6 hours ago' },
    { id: 3, level: 'info', source: 'Marketing', message: 'Facebook ad campaign completed with 3.2x ROAS', time: '12 hours ago' },
    { id: 4, level: 'success', source: 'Sales', message: 'Monthly sales target achieved ahead of schedule', time: '1 day ago' },
  ],
  revenueData: [
    { date: 'Jan', revenue: 25000, expenses: 18000, profit: 7000 },
    { date: 'Feb', revenue: 29000, expenses: 19000, profit: 10000 },
    { date: 'Mar', revenue: 31000, expenses: 20000, profit: 11000 },
    { date: 'Apr', revenue: 35000, expenses: 21000, profit: 14000 },
    { date: 'May', revenue: 38000, expenses: 22000, profit: 16000 },
    { date: 'Jun', revenue: 42000, expenses: 24000, profit: 18000 },
    { date: 'Jul', revenue: 48000, expenses: 26000, profit: 22000 },
    { date: 'Aug', revenue: 51000, expenses: 27000, profit: 24000 },
    { date: 'Sep', revenue: 55000, expenses: 28000, profit: 27000 },
    { date: 'Oct', revenue: 59000, expenses: 29000, profit: 30000 },
    { date: 'Nov', revenue: 64000, expenses: 31000, profit: 33000 },
    { date: 'Dec', revenue: 68000, expenses: 32000, profit: 36000 },
  ],
  activeCampaigns: [
    { id: 1, name: 'Summer Product Launch', status: 'active', progress: 75, budget: '$12,500', roi: '3.1x' },
    { id: 2, name: 'Email Re-engagement Series', status: 'active', progress: 60, budget: '$3,200', roi: '4.7x' },
    { id: 3, name: 'Partnership Co-marketing', status: 'active', progress: 40, budget: '$7,800', roi: '2.8x' },
    { id: 4, name: 'Holiday Season Preparation', status: 'active', progress: 25, budget: '$18,500', roi: 'N/A' },
  ],
  teamUpdates: [
    { id: 1, user: { name: 'Emily Chen', role: 'Marketing Director', avatar: '' }, action: 'completed', item: 'Q3 Marketing Report', time: '1 hour ago' },
    { id: 2, user: { name: 'David Kim', role: 'Operations Manager', avatar: '' }, action: 'updated', item: 'Inventory Management SOP', time: '3 hours ago' },
    { id: 3, user: { name: 'Sara Johnson', role: 'Sales Director', avatar: '' }, action: 'achieved', item: 'Monthly Sales Target', time: '1 day ago' },
    { id: 4, user: { name: 'Michael Lee', role: 'Finance Manager', avatar: '' }, action: 'requested', item: 'Budget Approval for Q4', time: '2 days ago' },
  ],
  projectStatus: [
    { id: 1, name: 'Website Redesign', progress: 85, status: 'On Track', dueDate: '2023-12-30' },
    { id: 2, name: 'CRM Integration', progress: 60, status: 'Delayed', dueDate: '2023-11-15' },
    { id: 3, name: 'New Product Development', progress: 40, status: 'On Track', dueDate: '2024-02-28' },
    { id: 4, name: 'Team Training Program', progress: 90, status: 'Ahead', dueDate: '2023-11-10' },
  ],
  weeklyDigest: {
    highlights: [
      'Revenue is up 12.5% compared to last month',
      'Marketing campaigns delivering 3.2x average ROAS',
      'Operations automation score improved by 5%',
      'Customer acquisition cost reduced by 4.2%'
    ],
    risks: [
      'Inventory levels low for 3 key products',
      'Support ticket response time increased by 8%',
      'Facebook ad CPM increasing by 15%'
    ],
    opportunities: [
      'New partnership opportunity with complementary brand',
      'Email list grew by 2,800 subscribers',
      'Top-performing SKU identified for scale'
    ]
  },
  businessEntities: [
    { id: 'dmp', name: 'Digital Merch Pros', health: 85 },
    { id: 'mystery', name: 'Mystery Hype', health: 72 },
    { id: 'lonestar', name: 'Lone Star Custom Clothing', health: 68 },
    { id: 'alcoeaze', name: 'Alcoeaze', health: 90 },
    { id: 'hide', name: 'Hide Cafe Bars', health: 78 },
  ]
};

// Helper function to determine badge variant based on alert level
const getAlertBadgeVariant = (level: string) => {
  switch(level) {
    case 'critical': return 'destructive';
    case 'warning': return 'warning';
    case 'info': return 'secondary';
    case 'success': return 'success';
    default: return 'outline';
  }
};

const CommandCenter = () => {
  const { demoMode } = useDemoMode();
  const [timeframe, setTimeframe] = useState('week');
  const { activeBrand } = usePersonalization();
  
  return (
    <div className="container px-4 mx-auto max-w-7xl space-y-8">
      <PageHeader 
        title="Command Center" 
        subtitle="Executive overview of key metrics, alerts, and activities across all business operations"
        icon={<Command className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Select
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default">
              Run Analysis
            </Button>
          </div>
        }
      />
      
      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {demoMode ? DEMO_DATA.kpis.map((kpi, index) => (
          <Card key={index} className="overflow-hidden border-l-4" style={{ borderLeftColor: kpi.isPositive ? '#10b981' : '#ef4444' }}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <Badge variant={kpi.isPositive ? "success" : "destructive"} className="font-normal">
                  {kpi.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="md:col-span-5 p-8 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No data available</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-1">
              Enable demo mode to see sample metrics or connect your data sources to display live KPIs.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/intelligence/personalization'}
            >
              Customize Dashboard
            </Button>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Overview */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Revenue Overview
                </CardTitle>
                <Select defaultValue="revenue">
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="profit">Profit</SelectItem>
                    <SelectItem value="expenses">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>Financial performance across all business entities</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px] w-full">
                {demoMode ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={DEMO_DATA.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#6b728040" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis 
                        stroke="#6b7280"
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4f46e5" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    <LineChart className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Enable demo mode to view sample data</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex justify-between w-full text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Profit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>Expenses</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Active Campaigns
              </CardTitle>
              <CardDescription>Current marketing initiatives and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              {demoMode ? (
                <div className="space-y-4">
                  {DEMO_DATA.activeCampaigns.map(campaign => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <div className="flex space-x-2 text-sm text-muted-foreground">
                            <span>Budget: {campaign.budget}</span>
                            <span>•</span>
                            <span>ROI: {campaign.roi}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">{campaign.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={campaign.progress} className="h-2" />
                        <span className="text-sm text-muted-foreground">{campaign.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <Rocket className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No active campaigns available</p>
                </div>
              )}
            </CardContent>
            {demoMode && (
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Campaigns
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Current Projects Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Project Status
              </CardTitle>
              <CardDescription>Key initiatives and their current progress</CardDescription>
            </CardHeader>
            <CardContent>
              {demoMode ? (
                <div className="space-y-4">
                  {DEMO_DATA.projectStatus.map(project => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            Due: {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge 
                          variant={
                            project.status === 'On Track' ? 'outline' : 
                            project.status === 'Delayed' ? 'destructive' : 'success'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <Target className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No active projects available</p>
                </div>
              )}
            </CardContent>
            {demoMode && (
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Projects
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BellRing className="h-5 w-5 text-primary" />
                Alerts & Notifications
              </CardTitle>
              <CardDescription>Recent activity requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {demoMode ? (
                <div className="space-y-4">
                  {DEMO_DATA.alerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <Badge variant={getAlertBadgeVariant(alert.level)} className="h-fit mt-0.5">
                        {alert.level}
                      </Badge>
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{alert.source}</span>
                          <span>•</span>
                          <span>{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <BellRing className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No alerts available</p>
                </div>
              )}
            </CardContent>
            {demoMode && (
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Alerts
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Activity
              </CardTitle>
              <CardDescription>Recent updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              {demoMode ? (
                <div className="space-y-4">
                  {DEMO_DATA.teamUpdates.map(update => (
                    <div key={update.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={update.user.avatar} />
                        <AvatarFallback>{update.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{update.user.name}</span>
                          {' '}
                          <span className="text-muted-foreground">{update.action}</span>
                          {' '}
                          <span className="font-medium">{update.item}</span>
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{update.user.role}</span>
                          <span className="mx-1">•</span>
                          <span>{update.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <Users className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No team activity available</p>
                </div>
              )}
            </CardContent>
            {demoMode && (
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Weekly Digest */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Digest
              </CardTitle>
              <CardDescription>Summary of this week's key metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              {demoMode ? (
                <Tabs defaultValue="highlights">
                  <TabsList className="w-full">
                    <TabsTrigger value="highlights" className="flex-1">Highlights</TabsTrigger>
                    <TabsTrigger value="risks" className="flex-1">Risks</TabsTrigger>
                    <TabsTrigger value="opportunities" className="flex-1">Opportunities</TabsTrigger>
                  </TabsList>
                  <TabsContent value="highlights" className="space-y-2 pt-4">
                    <ul className="space-y-2">
                      {DEMO_DATA.weeklyDigest.highlights.map((item, i) => (
                        <li key={i} className="flex gap-2 items-baseline">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="risks" className="space-y-2 pt-4">
                    <ul className="space-y-2">
                      {DEMO_DATA.weeklyDigest.risks.map((item, i) => (
                        <li key={i} className="flex gap-2 items-baseline">
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="opportunities" className="space-y-2 pt-4">
                    <ul className="space-y-2">
                      {DEMO_DATA.weeklyDigest.opportunities.map((item, i) => (
                        <li key={i} className="flex gap-2 items-baseline">
                          <Rocket className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No digest available</p>
                </div>
              )}
            </CardContent>
            {demoMode && (
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Full Digest
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Business Entity Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Business Health
              </CardTitle>
              <CardDescription>Health indicators for your business entities</CardDescription>
            </CardHeader>
            <CardContent>
              {demoMode ? (
                <div className="space-y-4">
                  {DEMO_DATA.businessEntities.map(entity => (
                    <div key={entity.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{entity.name}</p>
                        <span className="text-sm">{entity.health}%</span>
                      </div>
                      <Progress 
                        value={entity.health} 
                        className="h-2" 
                        indicatorClassName={
                          entity.health > 80 ? 'bg-green-500' : 
                          entity.health > 60 ? 'bg-amber-500' : 'bg-red-500'
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No business entities available</p>
                </div>
              )}
            </CardContent>
            {demoMode && (
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Entities
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;