import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export interface MetricChange {
  name: string;
  value: number;
  previousValue: number;
  percentChange: number;
  direction: 'up' | 'down' | 'flat';
  icon: string;
  color: string;
}

export interface WeeklyRecapProps {
  summaryText: string;
  metrics?: MetricChange[];
  loading?: boolean;
}

// Default metrics for demo mode
const defaultMetrics: MetricChange[] = [
  {
    name: 'Revenue',
    value: 42500,
    previousValue: 38000,
    percentChange: 11.8,
    direction: 'up',
    icon: 'payments',
    color: 'text-green-500'
  },
  {
    name: 'New Customers',
    value: 27,
    previousValue: 22,
    percentChange: 22.7,
    direction: 'up',
    icon: 'person_add',
    color: 'text-blue-500'
  },
  {
    name: 'Avg. Order Value',
    value: 157,
    previousValue: 163,
    percentChange: -3.7,
    direction: 'down',
    icon: 'shopping_cart',
    color: 'text-amber-500'
  },
  {
    name: 'Tasks Completed',
    value: 34,
    previousValue: 29,
    percentChange: 17.2,
    direction: 'up',
    icon: 'task_alt',
    color: 'text-indigo-500'
  }
];

const defaultSummaryText = 
  "This week's performance shows strong growth in revenue (+11.8%) and new customer acquisition (+22.7%), though average order value has slightly decreased (-3.7%). Task completion has improved by 17.2% compared to last week. Focus areas for next week: improve average order value and maintain the positive revenue trend.";

const WeeklyRecapCard: React.FC<WeeklyRecapProps> = ({ 
  summaryText = defaultSummaryText,
  metrics = defaultMetrics,
  loading = false
}) => {
  const [viewMode, setViewMode] = useState<'summary' | 'metrics'>('summary');

  // Simple number formatter
  const formatNumber = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-7 w-24" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
          <Button
            variant={viewMode === 'summary' ? 'default' : 'ghost'}
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setViewMode('summary')}
          >
            Summary
          </Button>
          <Button
            variant={viewMode === 'metrics' ? 'default' : 'ghost'}
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setViewMode('metrics')}
          >
            Metrics
          </Button>
        </div>
      </div>

      {viewMode === 'summary' ? (
        // Summary view
        <div className="space-y-3">
          <Card className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {summaryText}
              </p>
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-2">
            {metrics.slice(0, 2).map((metric) => (
              <Badge 
                key={metric.name}
                variant="outline"
                className={`h-5 py-0 px-2 text-xs font-normal ${
                  metric.direction === 'up' 
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : metric.direction === 'down'
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span className="material-icons text-[11px]">
                    {metric.direction === 'up' ? 'arrow_upward' : metric.direction === 'down' ? 'arrow_downward' : 'drag_handle'}
                  </span>
                  {metric.name} {metric.percentChange > 0 ? '+' : ''}{metric.percentChange.toFixed(1)}%
                </span>
              </Badge>
            ))}
            {metrics.length > 2 && (
              <Badge 
                variant="outline"
                className="h-5 py-0 px-2 text-xs font-normal bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                +{metrics.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      ) : (
        // Metrics view
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <Card key={metric.name} className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-2">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className={`material-icons text-xs mr-1 ${metric.color}`}>
                        {metric.icon}
                      </span>
                      <span className="text-xs font-medium">{metric.name}</span>
                    </div>
                    <div className={`flex items-center text-xs ${
                      metric.direction === 'up' 
                        ? 'text-green-600 dark:text-green-400' 
                        : metric.direction === 'down' 
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      <span className="material-icons text-[11px] mr-0.5">
                        {metric.direction === 'up' ? 'arrow_upward' : metric.direction === 'down' ? 'arrow_downward' : 'drag_handle'}
                      </span>
                      <span>{metric.percentChange > 0 ? '+' : ''}{metric.percentChange.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="text-base font-semibold">
                    {metric.name.toLowerCase().includes('revenue') || metric.name.toLowerCase().includes('order') 
                      ? `$${metric.value.toLocaleString()}` 
                      : metric.value.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    vs. {metric.name.toLowerCase().includes('revenue') || metric.name.toLowerCase().includes('order') 
                      ? `$${metric.previousValue.toLocaleString()}` 
                      : metric.previousValue.toLocaleString()} last week
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Separator className="my-3" />
      
      <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
        <a href="/analytics">
          View full report →
        </a>
      </Button>
    </div>
  );
};

export default WeeklyRecapCard;