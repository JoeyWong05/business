import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Target, 
  Zap,
  ArrowUpRight, 
  ArrowDownRight,
  HelpCircle,
  Percent
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Temporary chart components until we implement real ones
const BarChart = ({ data, title }: { data: any, title: string }) => (
  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-md">
    <p className="text-muted-foreground">Bar Chart: {title}</p>
  </div>
);

const LineChart = ({ data, title }: { data: any, title: string }) => (
  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-md">
    <p className="text-muted-foreground">Line Chart: {title}</p>
  </div>
);

const PieChart = ({ data, title }: { data: any, title: string }) => (
  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-md">
    <p className="text-muted-foreground">Pie Chart: {title}</p>
  </div>
);

interface PartnerDashboardProps {
  companyId: string;
  dateRange: { from: Date; to: Date } | undefined;
  companyBranding: {
    name: string;
    logo: string;
    logoFallback: string;
    primaryColor: string;
    secondaryColor: string;
    gradient: string;
  };
}

// Sample data - In a real app, this would come from an API call
const getDashboardData = (companyId: string) => {
  // Different sample data for different companies to simulate real data
  const data = {
    'dmp': {
      totalSales: 287650,
      growthPercent: 23.5,
      automationScore: 82,
      fulfillmentSpeed: 1.8, // days
      outreachStats: {
        emails: 1245,
        calls: 386,
        meetings: 92,
        responses: 431,
        conversionRate: 8.2
      },
      revenueSplit: [
        { name: 'Product Sales', value: 65 },
        { name: 'Services', value: 25 },
        { name: 'Licensing', value: 10 }
      ],
      monthlySales: [
        { month: 'Jan', amount: 18500 },
        { month: 'Feb', amount: 21200 },
        { month: 'Mar', amount: 19800 },
        { month: 'Apr', amount: 22100 },
        { month: 'May', amount: 24300 },
        { month: 'Jun', amount: 26500 },
        { month: 'Jul', amount: 29200 },
        { month: 'Aug', amount: 32400 },
        { month: 'Sep', amount: 35800 },
        { month: 'Oct', amount: 38600 },
        { month: 'Nov', amount: 42500 },
        { month: 'Dec', amount: 47000 }
      ]
    },
    'mystery-hype': {
      totalSales: 142850,
      growthPercent: 31.2,
      automationScore: 68,
      fulfillmentSpeed: 2.3, // days
      outreachStats: {
        emails: 856,
        calls: 211,
        meetings: 64,
        responses: 302,
        conversionRate: 9.1
      },
      revenueSplit: [
        { name: 'Product Sales', value: 78 },
        { name: 'Services', value: 12 },
        { name: 'Licensing', value: 10 }
      ],
      monthlySales: [
        { month: 'Jan', amount: 8200 },
        { month: 'Feb', amount: 9500 },
        { month: 'Mar', amount: 11200 },
        { month: 'Apr', amount: 10800 },
        { month: 'May', amount: 12300 },
        { month: 'Jun', amount: 13800 },
        { month: 'Jul', amount: 15200 },
        { month: 'Aug', amount: 16800 },
        { month: 'Sep', amount: 18500 },
        { month: 'Oct', amount: 20300 },
        { month: 'Nov', amount: 22500 },
        { month: 'Dec', amount: 25100 }
      ]
    },
    'lonestar': {
      totalSales: 98350,
      growthPercent: 14.8,
      automationScore: 76,
      fulfillmentSpeed: 3.2, // days
      outreachStats: {
        emails: 612,
        calls: 184,
        meetings: 43,
        responses: 198,
        conversionRate: 7.4
      },
      revenueSplit: [
        { name: 'Product Sales', value: 82 },
        { name: 'Services', value: 15 },
        { name: 'Licensing', value: 3 }
      ],
      monthlySales: [
        { month: 'Jan', amount: 7200 },
        { month: 'Feb', amount: 7800 },
        { month: 'Mar', amount: 8100 },
        { month: 'Apr', amount: 7900 },
        { month: 'May', amount: 8300 },
        { month: 'Jun', amount: 8500 },
        { month: 'Jul', amount: 8800 },
        { month: 'Aug', amount: 9200 },
        { month: 'Sep', amount: 9600 },
        { month: 'Oct', amount: 10300 },
        { month: 'Nov', amount: 11200 },
        { month: 'Dec', amount: 12100 }
      ]
    },
    'alcoease': {
      totalSales: 67850,
      growthPercent: 42.6,
      automationScore: 58,
      fulfillmentSpeed: 1.5, // days
      outreachStats: {
        emails: 423,
        calls: 135,
        meetings: 32,
        responses: 156,
        conversionRate: 10.3
      },
      revenueSplit: [
        { name: 'Product Sales', value: 92 },
        { name: 'Services', value: 6 },
        { name: 'Licensing', value: 2 }
      ],
      monthlySales: [
        { month: 'Jan', amount: 3200 },
        { month: 'Feb', amount: 3600 },
        { month: 'Mar', amount: 4100 },
        { month: 'Apr', amount: 4800 },
        { month: 'May', amount: 5500 },
        { month: 'Jun', amount: 6300 },
        { month: 'Jul', amount: 7200 },
        { month: 'Aug', amount: 8100 },
        { month: 'Sep', amount: 9200 },
        { month: 'Oct', amount: 10500 },
        { month: 'Nov', amount: 12100 },
        { month: 'Dec', amount: 13800 }
      ]
    },
    'hide-cafe': {
      totalSales: 43250,
      growthPercent: 28.7,
      automationScore: 62,
      fulfillmentSpeed: 0.8, // days
      outreachStats: {
        emails: 318,
        calls: 98,
        meetings: 24,
        responses: 112,
        conversionRate: 8.9
      },
      revenueSplit: [
        { name: 'Product Sales', value: 75 },
        { name: 'Services', value: 22 },
        { name: 'Licensing', value: 3 }
      ],
      monthlySales: [
        { month: 'Jan', amount: 2100 },
        { month: 'Feb', amount: 2400 },
        { month: 'Mar', amount: 2700 },
        { month: 'Apr', amount: 3100 },
        { month: 'May', amount: 3500 },
        { month: 'Jun', amount: 3900 },
        { month: 'Jul', amount: 4300 },
        { month: 'Aug', amount: 4800 },
        { month: 'Sep', amount: 5400 },
        { month: 'Oct', amount: 6100 },
        { month: 'Nov', amount: 6900 },
        { month: 'Dec', amount: 7800 }
      ]
    }
  };
  
  return data[companyId as keyof typeof data] || data['dmp'];
};

export function PartnerDashboard({ companyId, dateRange, companyBranding }: PartnerDashboardProps) {
  const dashboardData = getDashboardData(companyId);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalSales)}</div>
              <div className="flex items-center gap-1">
                <Badge variant={dashboardData.growthPercent >= 0 ? "default" : "destructive"} className="h-6">
                  {dashboardData.growthPercent >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 mr-1" />
                  )}
                  {Math.abs(dashboardData.growthPercent)}%
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Since last period</p>
          </CardContent>
        </Card>
        
        {/* Automation Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Automation Score
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/70" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-64">
                      Score based on automation tools implemented, integration levels, and process documentation.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{dashboardData.automationScore}/100</div>
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <Progress 
                value={dashboardData.automationScore} 
                className="h-2" 
              />
              <p className="text-xs text-muted-foreground">
                {dashboardData.automationScore > 80 ? 'Excellent' 
                : dashboardData.automationScore > 60 ? 'Good' 
                : dashboardData.automationScore > 40 ? 'Average' 
                : 'Needs Improvement'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Fulfillment Speed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fulfillment Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{dashboardData.fulfillmentSpeed} days</div>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average time to fulfill orders</p>
          </CardContent>
        </Card>
        
        {/* Outreach Conversion */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{dashboardData.outreachStats.conversionRate}%</div>
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">From outreach to deal</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
            <CardDescription>Revenue performance over the past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={dashboardData.monthlySales} 
              title="Monthly Sales" 
            />
          </CardContent>
        </Card>
        
        {/* Revenue Split */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Distribution by revenue stream</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={dashboardData.revenueSplit} 
              title="Revenue Split" 
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Outreach Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Outreach Performance</CardTitle>
          <CardDescription>Detailed marketing and sales outreach metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-2">Emails Sent</p>
              <p className="text-3xl font-bold">{dashboardData.outreachStats.emails}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-2">Calls Made</p>
              <p className="text-3xl font-bold">{dashboardData.outreachStats.calls}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-2">Meetings Held</p>
              <p className="text-3xl font-bold">{dashboardData.outreachStats.meetings}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-2">Responses</p>
              <p className="text-3xl font-bold">{dashboardData.outreachStats.responses}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 text-center text-sm text-muted-foreground">
          Data represents activities within the selected date range
        </CardFooter>
      </Card>
    </div>
  );
}