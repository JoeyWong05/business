import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

export interface DealStage {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface PipelineData {
  entityId: number;
  entityName: string;
  totalValue: number;
  stages: DealStage[];
}

interface SalesPipelineChartProps {
  data: PipelineData;
  stageColors?: Record<string, string>;
  showHeader?: boolean;
}

export default function SalesPipelineChart({
  data,
  stageColors = {
    'Lead': '#8884d8',
    'Qualified': '#83a6ed',
    'Proposal': '#8dd1e1',
    'Negotiation': '#82ca9d',
    'Closed Won': '#a4de6c',
  },
  showHeader = true,
}: SalesPipelineChartProps) {
  const totalDealCount = data.stages.reduce((sum, stage) => sum + stage.count, 0);
  
  // Format for the tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white dark:bg-gray-800 shadow rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-gray-600 dark:text-gray-300">${data.value.toLocaleString()}</p>
          <p className="text-gray-500 dark:text-gray-400">{data.count} deals</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      {showHeader && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex justify-between items-center">
            <span>Sales Pipeline: {data.entityName}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ${data.totalValue.toLocaleString()} total value
            </span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Deals</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDealCount}</p>
          </div>
          <div className="flex space-x-4">
            {data.stages.map((stage) => (
              <div key={stage.name} className="text-center">
                <div
                  className="h-3 w-3 rounded-full inline-block mr-1"
                  style={{ backgroundColor: stage.color || stageColors[stage.name] || '#cccccc' }}
                ></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {stage.name}: {stage.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.stages}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={60}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `$${value / 1000}k`}
                domain={[0, 'dataMax + 10000']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Deal Value">
                {data.stages.map((entry, index) => (
                  <Bar
                    key={`cell-${index}`}
                    fill={entry.color || stageColors[entry.name] || '#cccccc'}
                  />
                ))}
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(value: number) => `${value} deals`}
                  style={{ fill: '#6b7280', fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Avg. Deal Size</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${(data.totalValue / totalDealCount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.round((data.stages.find(s => s.name === 'Closed Won')?.count || 0) / totalDealCount * 100)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}