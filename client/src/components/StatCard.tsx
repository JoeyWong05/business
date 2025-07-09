import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  description: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  progress?: {
    value: number;
    label?: string;
    max?: number;
  };
}

export default function StatCard({
  title,
  description,
  value,
  subValue,
  icon,
  iconColor,
  iconBgColor,
  trend,
  progress,
}: StatCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-950 shadow-md hover:shadow-lg transition-shadow border-none">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className={`h-8 w-8 rounded-full ${iconBgColor} flex items-center justify-center`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col">
          <div className="text-3xl font-bold">{value}</div>
          {subValue && (
            <div className="text-xs text-muted-foreground mt-1">
              {subValue}
            </div>
          )}
          
          {trend && (
            <div className={`flex items-center mt-3 text-xs font-medium ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <div className={`${
                trend.isPositive ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'
              } p-0.5 rounded mr-1 flex items-center justify-center`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                >
                  {trend.isPositive ? (
                    <polyline points="18 15 12 9 6 15" />
                  ) : (
                    <polyline points="6 9 12 15 18 9" />
                  )}
                </svg>
              </div>
              {trend.value}% {trend.label}
            </div>
          )}
          
          {progress && (
            <>
              <Progress 
                value={progress.value} 
                className="h-1.5 mt-3" 
              />
              {progress.label && (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">{progress.label}</span>
                  <Badge variant="outline" className="font-normal bg-primary/5">
                    {progress.value}%
                  </Badge>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}