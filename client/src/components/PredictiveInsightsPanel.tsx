import React, { useState } from 'react';
import { LightbulbIcon, TrendingUp, ArrowUpDown, ChevronDown, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend
} from 'recharts';

export interface PredictiveInsightsPanelProps {
  fullWidth?: boolean;
}

// Mock data for revenue forecast
const revenueData = [
  { name: 'Jan', actual: 12000, predicted: 12000 },
  { name: 'Feb', actual: 15000, predicted: 15000 },
  { name: 'Mar', actual: 18000, predicted: 18000 },
  { name: 'Apr', actual: null, predicted: 22000 },
  { name: 'May', actual: null, predicted: 25000 },
  { name: 'Jun', actual: null, predicted: 28000 }
];

// Mock data for growth by channel
const channelData = [
  { name: 'Social', actual: 15, predicted: 22 },
  { name: 'Email', actual: 20, predicted: 25 },
  { name: 'Organic', actual: 13, predicted: 17 },
  { name: 'Paid', actual: 25, predicted: 29 },
  { name: 'Referral', actual: 8, predicted: 14 }
];

// Mock data for customer trends
const customerData = [
  { name: 'Jan', newCustomers: 80, churn: 20, netGrowth: 60 },
  { name: 'Feb', newCustomers: 100, churn: 25, netGrowth: 75 },
  { name: 'Mar', newCustomers: 120, churn: 30, netGrowth: 90 },
  { name: 'Apr', newCustomers: 140, churn: 35, netGrowth: 105 },
  { name: 'May', newCustomers: 160, churn: 40, netGrowth: 120 },
  { name: 'Jun', newCustomers: 180, churn: 45, netGrowth: 135 }
];

// Insights data
const insights = [
  {
    id: '1',
    title: 'Revenue growth accelerating',
    description: 'Predicted 28% increase in Q2 based on current trajectory and seasonal patterns.',
    category: 'financial',
    confidenceScore: 0.89, // 0-1 scale
    impactAreas: ['Revenue', 'Cash Flow'],
    timeHorizon: 'short', // short, medium, long
    dateGenerated: '2025-03-22T10:30:00Z'
  },
  {
    id: '2',
    title: 'Email marketing channel outperforming',
    description: 'Email campaigns showing higher ROI than other channels, predicted to continue improving.',
    category: 'marketing',
    confidenceScore: 0.77,
    impactAreas: ['Marketing', 'Customer Acquisition'],
    timeHorizon: 'medium',
    dateGenerated: '2025-03-21T14:15:00Z'
  },
  {
    id: '3',
    title: 'Customer retention risk increasing',
    description: 'Churn rate predicted to rise by 15% in next quarter unless addressed.',
    category: 'customer',
    confidenceScore: 0.82,
    impactAreas: ['Customer Retention', 'Revenue'],
    timeHorizon: 'short',
    dateGenerated: '2025-03-20T09:45:00Z'
  },
  {
    id: '4',
    title: 'New market opportunity identified',
    description: 'Data suggests expanding into enterprise segment would yield 30% higher LTV.',
    category: 'strategy',
    confidenceScore: 0.64,
    impactAreas: ['Growth', 'Market Share'],
    timeHorizon: 'long',
    dateGenerated: '2025-03-19T16:20:00Z'
  }
];

const PredictiveInsightsPanel: React.FC<PredictiveInsightsPanelProps> = ({
  fullWidth = false
}) => {
  const [timeFrame, setTimeFrame] = useState('6months');
  const [chartType, setChartType] = useState('revenue');
  
  // Helper function to get confidence level style
  const getConfidenceStyle = (score: number) => {
    if (score >= 0.8) {
      return { color: 'text-green-600', bg: 'bg-green-50', label: 'High' };
    } else if (score >= 0.6) {
      return { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Medium' };
    } else {
      return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Exploratory' };
    }
  };
  
  // Helper function to get time horizon label
  const getTimeHorizonLabel = (horizon: string) => {
    const labels: Record<string, string> = {
      short: '1-3 Months',
      medium: '3-6 Months',
      long: '6+ Months'
    };
    return labels[horizon] || horizon;
  };

  return (
    <Card className={fullWidth ? '' : 'border-none shadow-none'}>
      {fullWidth && (
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5 text-primary" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>
                AI-powered forecasts and business intelligence
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-3">
              <Select
                defaultValue={timeFrame}
                onValueChange={setTimeFrame}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="12months">12 Months</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                defaultValue={chartType}
                onValueChange={setChartType}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Forecast</SelectItem>
                  <SelectItem value="channels">Channel Growth</SelectItem>
                  <SelectItem value="customers">Customer Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="pt-4 space-y-6">
        {/* Charts Section */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">
              {chartType === 'revenue' 
                ? 'Revenue Forecast' 
                : chartType === 'channels' 
                  ? 'Growth by Channel' 
                  : 'Customer Acquisition & Retention'}
            </h3>
            
            {!fullWidth && (
              <Select
                defaultValue={chartType}
                onValueChange={setChartType}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Forecast</SelectItem>
                  <SelectItem value="channels">Channel Growth</SelectItem>
                  <SelectItem value="customers">Customer Trends</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="h-[300px] w-full">
            {chartType === 'revenue' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => ["$" + value.toLocaleString(), ""]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#6366f1" 
                    fill="#818cf8" 
                    strokeWidth={2}
                    name="Actual Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#6366f1" 
                    fill="#e0e7ff" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Predicted Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'channels' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={channelData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, ""]}
                    labelFormatter={(label) => `Channel: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="actual" name="Current Growth %" fill="#6366f1" />
                  <Bar dataKey="predicted" name="Predicted Growth %" fill="#c4b5fd" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'customers' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customerData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newCustomers" name="New Customers" fill="#10b981" />
                  <Bar dataKey="churn" name="Customer Churn" fill="#ef4444" />
                  <Bar dataKey="netGrowth" name="Net Growth" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            {chartType === 'revenue' 
              ? 'Forecast based on historical data, seasonal trends, and current growth rate. Dashed line represents AI predictions.' 
              : chartType === 'channels' 
                ? 'Predicted channel performance over the next quarter. Consider allocating more resources to high-growth channels.' 
                : 'Customer acquisition and retention trends. Focus on reducing churn to improve net growth rate.'}
          </div>
        </div>
        
        {/* Key Insights Section */}
        <div>
          <h3 className="font-medium text-lg mb-4">Key Insights</h3>
          <div className="space-y-3">
            {insights.map((insight) => {
              const confidenceStyle = getConfidenceStyle(insight.confidenceScore);
              
              return (
                <div key={insight.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant="outline">{insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {getTimeHorizonLabel(insight.timeHorizon)}
                        </Badge>
                        {insight.impactAreas.map((area, index) => (
                          <Badge key={index} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${confidenceStyle.bg} ${confidenceStyle.color} ml-2`}
                    >
                      {confidenceStyle.label} confidence
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      {fullWidth && (
        <CardFooter className="flex justify-between">
          <Button variant="link" className="px-0">
            View detailed report
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export insights
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PredictiveInsightsPanel;