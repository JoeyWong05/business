import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';

interface ForecastDataItem {
  name: string;
  value: number;
  projection?: number;
}

interface CostForecastChartProps {
  data: ForecastDataItem[];
}

export default function CostForecastChart({ data }: CostForecastChartProps) {
  // Calculate the total projected annual cost based on the last 6 months
  const annualProjection = data
    .filter(item => item.projection)
    .reduce((sum, item) => sum + (item.projection || 0), 0);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Cost Forecast (12 Month)
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Monthly cost projection based on current tool usage
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Monthly
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${data.find(item => item.name === "Jun")?.value.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Projected EOY (Monthly)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${data.find(item => item.name === "Dec")?.projection?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  name="Actual Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="projection" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                  strokeDasharray="5 5"
                  name="Projected Cost"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Cost Analysis</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on current growth trends, your yearly tool costs are projected to increase by 
              <span className="font-medium text-primary"> 22%</span> by the end of the year. 
              Consider reviewing unused subscriptions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}