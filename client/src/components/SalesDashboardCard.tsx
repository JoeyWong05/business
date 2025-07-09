import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight,
  CalendarClock, 
  ChevronRight, 
  Clock, 
  DollarSign,
  Info,
  MoreHorizontal, 
  Tag,
  User
} from "lucide-react";

interface SalesDashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  footer?: string;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
  isLoading?: boolean;
}

// Main dashboard card component
export function SalesDashboardCard({
  title,
  value,
  description,
  trend,
  icon,
  footer,
  onClick,
  variant = 'default',
  className = '',
  isLoading = false,
}: SalesDashboardCardProps) {
  // Determine color classes based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950/30';
      case 'warning':
        return 'border-amber-100 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30';
      case 'danger':
        return 'border-red-100 bg-red-50 dark:border-red-900 dark:bg-red-950/30';
      case 'info':
        return 'border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30';
      case 'neutral':
        return 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30';
      default:
        return '';
    }
  };

  // Determine icon background color based on variant
  const getIconBgClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300';
      case 'danger':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
      case 'info':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'neutral':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  // Trend indicator component
  const TrendIndicator = () => {
    if (!trend) return null;
    
    return (
      <div className={`flex items-center text-xs font-medium ${
        trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {trend.isPositive ? (
          <ArrowUpRight className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDownRight className="h-3 w-3 mr-1" />
        )}
        {Math.abs(trend.value)}%
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="h-4 w-1/2 animate-pulse bg-muted rounded"></div>
            <div className="h-6 w-1/3 animate-pulse bg-muted rounded"></div>
            <div className="h-4 w-2/3 animate-pulse bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`relative overflow-hidden transition-all hover:shadow-md ${getVariantClasses()} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              <TrendIndicator />
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className={`rounded-full p-2 ${getIconBgClass()}`}>
              {icon}
            </div>
          )}
        </div>
        
        {footer && (
          <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DealCardProps {
  deal: {
    id: string;
    title: string;
    companyName: string;
    contactName: string;
    value: number | string;
    stage: string;
    probability: number;
    priority: string;
    expectedCloseDate: string;
    tags?: string[];
    assignedTo?: string | number;
    assignedToName?: string;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function DealCard({ deal, onView, onEdit }: DealCardProps) {
  // Format currency
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numValue);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get badge color for stage
  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'lead':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-50';
      case 'contacted':
        return 'bg-purple-50 text-purple-600 hover:bg-purple-50';
      case 'proposal':
        return 'bg-amber-50 text-amber-600 hover:bg-amber-50';
      case 'negotiation':
        return 'bg-orange-50 text-orange-600 hover:bg-orange-50';
      case 'closed_won':
        return 'bg-green-50 text-green-600 hover:bg-green-50';
      case 'closed_lost':
        return 'bg-red-50 text-red-600 hover:bg-red-50';
      case 'on_hold':
        return 'bg-gray-50 text-gray-600 hover:bg-gray-50';
      default:
        return '';
    }
  };

  // Format stage name for display
  const formatStageName = (stage: string) => {
    switch (stage) {
      case 'lead':
        return 'Lead';
      case 'contacted':
        return 'Contacted';
      case 'proposal':
        return 'Proposal';
      case 'negotiation':
        return 'Negotiation';
      case 'closed_won':
        return 'Closed (Won)';
      case 'closed_lost':
        return 'Closed (Lost)';
      case 'on_hold':
        return 'On Hold';
      default:
        return stage.charAt(0).toUpperCase() + stage.slice(1).replace('_', ' ');
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold line-clamp-1">
              {deal.title}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-1">
              {deal.companyName}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getStageBadgeClass(deal.stage)}>
            {formatStageName(deal.stage)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{deal.contactName}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <DollarSign className="h-3.5 w-3.5 text-green-600" />
            <span>{formatCurrency(deal.value)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{formatDate(deal.expectedCloseDate)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Info className="h-3.5 w-3.5" />
            <span>{deal.probability}% probability</span>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Deal progress</div>
          <Progress value={deal.probability} className="h-1.5" />
        </div>
        
        {deal.tags && deal.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 mt-2">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {deal.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
            {deal.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{deal.tags.length - 3} more</span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t flex justify-between items-center">
        {deal.assignedToName ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {getInitials(deal.assignedToName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{deal.assignedToName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {deal.assignedTo ? deal.assignedTo.toString().substring(0, 2) : 'NA'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">ID: {deal.assignedTo || 'Unassigned'}</span>
          </div>
        )}
        <div className="flex gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onView(deal.id)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onEdit(deal.id)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

interface DealProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'blue' | 'green' | 'amber' | 'red' | 'purple';
  percentage?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export function DealProgressCard({
  title,
  value,
  maxValue,
  trend,
  color = 'default',
  percentage = false,
  icon,
  description
}: DealProgressCardProps) {
  // Calculate percentage
  const progressPercent = Math.min(100, (value / maxValue) * 100);
  
  // Format display value
  const displayValue = percentage 
    ? `${Math.round(progressPercent)}%` 
    : value.toLocaleString();
  
  // Determine color classes
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'amber':
        return 'text-amber-600 dark:text-amber-400';
      case 'red':
        return 'text-red-600 dark:text-red-400';
      case 'purple':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-primary';
    }
  };
  
  // Determine progress bar color
  const getProgressColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 dark:bg-blue-500';
      case 'green':
        return 'bg-green-600 dark:bg-green-500';
      case 'amber':
        return 'bg-amber-600 dark:bg-amber-500';
      case 'red':
        return 'bg-red-600 dark:bg-red-500';
      case 'purple':
        return 'bg-purple-600 dark:bg-purple-500';
      default:
        return 'bg-primary';
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className={`text-2xl font-bold ${getColorClasses()}`}>{displayValue}</h3>
              {trend && (
                <div className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {trend.isPositive ? (
                    <ArrowUpRight className="h-3 w-3 inline mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 inline mr-0.5" />
                  )}
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className="rounded-full p-2 bg-muted">{icon}</div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor()}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {maxValue !== 0 && (
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {percentage ? '0%' : '0'}
              </span>
              <span className="text-xs text-muted-foreground">
                {percentage ? '100%' : maxValue.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-3">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Default export for all card components
export default {
  SalesDashboardCard,
  DealCard,
  DealProgressCard
};