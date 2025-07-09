import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CostDataItem {
  name: string;
  value: number;
  color: string;
}

interface CostBreakdownChartProps {
  data: CostDataItem[];
  timeframe: string;
  entityName?: string;
  totalCost: number;
}

export default function CostBreakdownChart({ 
  data, 
  timeframe, 
  entityName = 'All Entities',
  totalCost
}: CostBreakdownChartProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {timeframe} Cost Breakdown by Category
            </h3>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
              {entityName}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {timeframe} spend across business functions
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total {timeframe} Cost
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalCost.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Yearly Estimate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(totalCost * 12).toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-sm font-medium">
                  ${item.value.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}