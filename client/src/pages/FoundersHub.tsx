import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowUpRight, 
  Award, 
  Bell, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Download, 
  ExternalLink, 
  Eye, 
  Filter, 
  LineChart, 
  MoreHorizontal, 
  PieChart, 
  Play, 
  Plus, 
  RefreshCw, 
  Search, 
  Settings, 
  TrendingUp,
  Zap,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  ArrowRight,
  Megaphone,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

// Interfaces
interface KPI {
  id: number;
  name: string;
  value: string;
  change: number;
  target: string;
  progress: number;
  status: 'positive' | 'negative' | 'neutral';
  department: 'finance' | 'marketing' | 'operations' | 'sales' | 'product';
  icon: React.ReactNode;
}

interface Alert {
  id: number;
  title: string;
  description: string;
  type: 'error' | 'warning' | 'success' | 'info';
  module: string;
  timestamp: Date;
  isRead: boolean;
}

interface DigestItem {
  id: number;
  title: string;
  description: string;
  change: number;
  type: 'increase' | 'decrease' | 'neutral';
  module: string;
}

interface AutomationMetric {
  id: number;
  name: string;
  description: string;
  score: number;
  potentialSavings: string;
  department: 'finance' | 'marketing' | 'operations' | 'sales' | 'product' | 'general';
}

interface Insight {
  id: number;
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  department: 'finance' | 'marketing' | 'operations' | 'sales' | 'product' | 'general';
}

// Sample Data
const sampleKPIs: KPI[] = [
  {
    id: 1,
    name: 'Monthly Revenue',
    value: '$42,580',
    change: 12.5,
    target: '$45,000',
    progress: 94,
    status: 'positive',
    department: 'finance',
    icon: <DollarSign className="h-5 w-5" />
  },
  {
    id: 2,
    name: 'Customer Acquisition Cost',
    value: '$32.40',
    change: -8.2,
    target: '$30.00',
    progress: 92,
    status: 'positive',
    department: 'marketing',
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 3,
    name: 'Conversion Rate',
    value: '4.8%',
    change: 0.6,
    target: '5.0%',
    progress: 96,
    status: 'positive',
    department: 'sales',
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    id: 4,
    name: 'Fulfillment Time',
    value: '2.3 days',
    change: -0.5,
    target: '2.0 days',
    progress: 87,
    status: 'positive',
    department: 'operations',
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: 5,
    name: 'Product Launch Readiness',
    value: '85%',
    change: 15,
    target: '100%',
    progress: 85,
    status: 'positive',
    department: 'product',
    icon: <Zap className="h-5 w-5" />
  }
];

const sampleAlerts: Alert[] = [
  {
    id: 1,
    title: 'Inventory Alert',
    description: 'Black T-shirt (XL) stock below threshold (5 units remaining)',
    type: 'warning',
    module: 'Inventory',
    timestamp: new Date(Date.now() - 3600000 * 2),
    isRead: false
  },
  {
    id: 2,
    title: 'Payment Failed',
    description: 'Customer payment for order #DMP-2305 failed (Stripe error)',
    type: 'error',
    module: 'Sales',
    timestamp: new Date(Date.now() - 3600000 * 5),
    isRead: false
  },
  {
    id: 3,
    title: 'Ad Campaign Performing Well',
    description: 'Facebook Campaign "Summer Sale" exceeding ROAS targets by 35%',
    type: 'success',
    module: 'Marketing',
    timestamp: new Date(Date.now() - 3600000 * 8),
    isRead: true
  },
  {
    id: 4,
    title: 'New Feature Deployed',
    description: 'Custom order tracking feature has been deployed to production',
    type: 'info',
    module: 'Product',
    timestamp: new Date(Date.now() - 3600000 * 24),
    isRead: true
  },
  {
    id: 5,
    title: 'Team Meeting Reminder',
    description: 'Weekly team meeting starting in 15 minutes (Zoom link attached)',
    type: 'info',
    module: 'Team',
    timestamp: new Date(Date.now() - 3600000 * 25),
    isRead: false
  }
];

const sampleDigestItems: DigestItem[] = [
  {
    id: 1,
    title: 'Revenue Growth',
    description: 'Weekly revenue up compared to previous week',
    change: 5.8,
    type: 'increase',
    module: 'Finance'
  },
  {
    id: 2,
    title: 'Conversion Optimization',
    description: 'Checkout conversion improving after UX updates',
    change: 0.9,
    type: 'increase',
    module: 'Sales'
  },
  {
    id: 3,
    title: 'Ad Spend Efficiency',
    description: 'Facebook CPC decreased this week',
    change: 12.3,
    type: 'decrease',
    module: 'Marketing'
  },
  {
    id: 4,
    title: 'Customer Support',
    description: 'Support ticket resolution time reduced',
    change: 15.0,
    type: 'decrease',
    module: 'Operations'
  },
  {
    id: 5,
    title: 'Feature Adoption',
    description: 'New customer portal seeing increased usage',
    change: 22.5,
    type: 'increase',
    module: 'Product'
  }
];

const sampleAutomationMetrics: AutomationMetric[] = [
  {
    id: 1,
    name: 'Customer Onboarding',
    description: 'Automating welcome emails, account setup instructions',
    score: 65,
    potentialSavings: '5-8 hours/week',
    department: 'sales'
  },
  {
    id: 2,
    name: 'Inventory Alerts',
    description: 'Automatic notifications for low stock and reordering',
    score: 85,
    potentialSavings: '2-4 hours/week',
    department: 'operations'
  },
  {
    id: 3,
    name: 'Financial Reporting',
    description: 'Automated daily/weekly financial summaries',
    score: 30,
    potentialSavings: '4-6 hours/week',
    department: 'finance'
  },
  {
    id: 4,
    name: 'Content Publishing',
    description: 'Scheduled social media and blog post publishing',
    score: 90,
    potentialSavings: '6-10 hours/week',
    department: 'marketing'
  },
  {
    id: 5,
    name: 'SOP Compliance',
    description: 'Tracking adherence to standard operating procedures',
    score: 40,
    potentialSavings: '3-7 hours/week',
    department: 'operations'
  }
];

const sampleInsights: Insight[] = [
  {
    id: 1,
    title: 'Customer Retention Opportunity',
    description: 'Customers who purchase custom designs are 3x more likely to make repeat purchases within 60 days.',
    recommendation: 'Target recent custom design customers with a loyalty program offer or early access to new designs.',
    impact: 'high',
    department: 'marketing'
  },
  {
    id: 2,
    title: 'Payment Processing Efficiency',
    description: 'Credit card processing fees vary by 0.8% between your current providers.',
    recommendation: 'Consider consolidating payment processing to the provider with lower fees.',
    impact: 'medium',
    department: 'finance'
  },
  {
    id: 3,
    title: 'Production Bottleneck Identified',
    description: 'Order fulfillment is delayed by an average of 1.2 days during artwork approval processes.',
    recommendation: 'Implement automated artwork validation tools to reduce manual review requirements.',
    impact: 'high',
    department: 'operations'
  }
];

function KPICard({ kpi }: { kpi: KPI }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center">
            <div className={cn(
              "mr-2 h-8 w-8 rounded-md flex items-center justify-center",
              kpi.department === 'finance' ? "bg-blue-100 text-blue-700" :
              kpi.department === 'marketing' ? "bg-purple-100 text-purple-700" :
              kpi.department === 'operations' ? "bg-amber-100 text-amber-700" :
              kpi.department === 'sales' ? "bg-green-100 text-green-700" :
              "bg-indigo-100 text-indigo-700"
            )}>
              {kpi.icon}
            </div>
            {kpi.name}
          </div>
        </CardTitle>
        <Badge 
          variant={kpi.status === 'positive' ? 'default' : kpi.status === 'negative' ? 'destructive' : 'outline'}
          className="ml-2"
        >
          {kpi.change > 0 ? '+' : ''}{kpi.change}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        <div className="mt-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>Target: {kpi.target}</span>
          </div>
          <Progress value={kpi.progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  return (
    <div className={`flex items-start p-3 rounded-lg border ${
      !alert.isRead ? 'bg-muted/50' : ''
    }`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
        alert.type === 'error' ? 'bg-red-100 text-red-600' :
        alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
        alert.type === 'success' ? 'bg-green-100 text-green-600' :
        'bg-blue-100 text-blue-600'
      }`}>
        {alert.type === 'error' ? <AlertCircle className="h-5 w-5" /> :
         alert.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> :
         alert.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> :
         <Bell className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">{alert.title}</div>
          <div className="text-xs text-muted-foreground">
            {format(alert.timestamp, 'h:mm a')}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{alert.description}</p>
        <div className="flex items-center mt-1">
          <Badge variant="outline" className="text-xs">{alert.module}</Badge>
          {!alert.isRead && (
            <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>
          )}
        </div>
      </div>
    </div>
  );
}

function DigestItemCard({ item }: { item: DigestItem }) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{item.title}</h4>
        <Badge variant={item.type === 'increase' ? 'default' : item.type === 'decrease' ? 'secondary' : 'outline'}>
          {item.type === 'increase' ? '+' : item.type === 'decrease' ? '-' : ''}{Math.abs(item.change)}%
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
      <div className="flex items-center mt-2">
        <Badge variant="outline" className="text-xs">{item.module}</Badge>
        <div className="ml-auto">
          {item.type === 'increase' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : item.type === 'decrease' ? (
            <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
          ) : (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
}

function AutomationScoreCard({ metric }: { metric: AutomationMetric }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{metric.name}</h4>
        <Badge
          variant={metric.score >= 80 ? "default" : metric.score >= 50 ? "outline" : "secondary"}
          className={metric.score >= 80 ? "bg-green-600" : metric.score >= 50 ? "" : ""}
        >
          {metric.score}%
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
      <div className="mt-3">
        <Progress value={metric.score} className="h-2" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">Potential savings:</span>
        <span className="text-xs font-medium">{metric.potentialSavings}</span>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
          insight.impact === 'high' ? 'bg-red-100 text-red-600' :
          insight.impact === 'medium' ? 'bg-amber-100 text-amber-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          <Zap className="h-3.5 w-3.5" />
        </div>
        <h4 className="font-medium">{insight.title}</h4>
        <Badge 
          variant="outline" 
          className={cn(
            "ml-auto capitalize",
            insight.impact === 'high' ? "border-red-200 text-red-700" :
            insight.impact === 'medium' ? "border-amber-200 text-amber-700" :
            "border-blue-200 text-blue-700"
          )}
        >
          {insight.impact} impact
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{insight.description}</p>
      <div className="mt-3 bg-muted/50 p-2 rounded-md">
        <div className="text-xs font-medium mb-1">Recommendation:</div>
        <p className="text-sm">{insight.recommendation}</p>
      </div>
      <div className="flex justify-between items-center mt-3">
        <Badge variant="outline" className="capitalize">{insight.department}</Badge>
        <Button variant="ghost" size="sm" className="h-7 gap-1">
          <span className="text-xs">Implement</span>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function FoundersHub() {
  const [alertFilter, setAlertFilter] = useState<string | null>(null);
  const [kpiView, setKpiView] = useState<'all' | 'finance' | 'marketing' | 'operations' | 'sales' | 'product'>('all');
  
  const filteredAlerts = alertFilter 
    ? sampleAlerts.filter(alert => 
        alertFilter === 'unread' 
          ? !alert.isRead 
          : alert.type === alertFilter
      )
    : sampleAlerts;
    
  const filteredKPIs = kpiView === 'all' 
    ? sampleKPIs 
    : sampleKPIs.filter(kpi => kpi.department === kpiView);

  return (
    <div className="container py-6 space-y-8 max-w-7xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Founder's Hub</h1>
            <p className="text-muted-foreground">Executive overview of your business metrics and alerts</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Last 7 days</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Today</DropdownMenuItem>
                <DropdownMenuItem>Yesterday</DropdownMenuItem>
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>This month</DropdownMenuItem>
                <DropdownMenuItem>Last month</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Custom range</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Company Selector */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src="/placeholder-logo.svg" />
                <AvatarFallback className="bg-primary text-white font-medium">DMP</AvatarFallback>
              </Avatar>
              <div>
                <Select defaultValue="dmp">
                  <SelectTrigger className="w-[220px] h-8 text-base font-medium">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dmp">Digital Merch Pros</SelectItem>
                    <SelectItem value="mh">Mystery Hype</SelectItem>
                    <SelectItem value="lscc">Lone Star Custom Clothing</SelectItem>
                    <SelectItem value="ae">Alcoeaze</SelectItem>
                    <SelectItem value="hcb">Hide Cafe Bars</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-0.5">Select company to view metrics</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">Refresh</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground hover:text-foreground">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="text-xs">Configure</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Top 5 KPIs</CardTitle>
                <div className="flex items-center gap-1">
                  <Select 
                    defaultValue="all" 
                    onValueChange={(value) => setKpiView(value as any)}
                  >
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredKPIs.map(kpi => (
                  <KPICard key={kpi.id} kpi={kpi} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Alerts</CardTitle>
                <div className="flex items-center gap-1">
                  <Select 
                    onValueChange={setAlertFilter}
                    defaultValue=""
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="All Alerts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Alerts</SelectItem>
                      <SelectItem value="unread">Unread Only</SelectItem>
                      <SelectItem value="error">Errors</SelectItem>
                      <SelectItem value="warning">Warnings</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Recent alerts across all modules
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-3 flex justify-center">
              <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
                <span>View All Alerts</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Digest</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Key metrics and changes in the past week
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {sampleDigestItems.map(item => (
                <DigestItemCard key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between items-center">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="text-xs">Export Report</span>
            </Button>
            <Button variant="default" size="sm" className="gap-1">
              <Megaphone className="h-3.5 w-3.5" />
              <span className="text-xs">Share With Team</span>
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Automation Score</CardTitle>
                <Button size="sm" variant="default" className="gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  <span className="text-xs">Boost Score</span>
                </Button>
              </div>
              <CardDescription>
                Optimize your business processes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="inline-flex h-32 w-32 items-center justify-center rounded-full border-8 border-muted">
                  <div className="text-4xl font-bold">68%</div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Overall automation score across all departments
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {sampleAutomationMetrics.map(metric => (
                  <AutomationScoreCard key={metric.id} metric={metric} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI-Powered Business Insights</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="text-xs">Generate New Insights</span>
            </Button>
          </div>
          <CardDescription>
            Actionable recommendations to grow your business
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Next insight batch available in 2 days
            </div>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="text-xs">How insights work</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">About AI-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Our system analyzes your business data across all departments to identify patterns, 
                    opportunities, and potential issues before they become problems.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Insights are generated weekly based on recent activities and performance trends.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}