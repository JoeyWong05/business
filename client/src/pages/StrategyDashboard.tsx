import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart,
  BarChart2,
  Building,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Database,
  Dollar,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileBarChart,
  FilePlus2,
  Filter,
  Flag,
  HandCoins,
  Heart,
  HelpCircle,
  Info,
  LayoutDashboard,
  LineChart,
  LucideIcon,
  Minus,
  Pencil,
  PieChart,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Target,
  Trash,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

// Types
interface BusinessEntity {
  id: number;
  name: string;
  industry: string;
  founded: string;
  employees: number;
  revenue: number;
  profitMargin: number;
  growthRate: number;
  location: string;
}

interface HealthScore {
  id: number;
  name: string;
  score: number;
  maxScore: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  category: string;
  icon: LucideIcon;
  color: string;
  businessEntityId?: number;
  businessEntityName?: string;
}

interface NorthStarMetric {
  id: number;
  name: string;
  value: number;
  format: 'number' | 'currency' | 'percentage';
  target: number;
  previousValue: number;
  changePercentage: number;
  unit?: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  importance: 'primary' | 'secondary';
  icon: LucideIcon;
  color: string;
  businessEntityId?: number;
  businessEntityName?: string;
}

interface QuarterlyGoal {
  id: number;
  title: string;
  description: string;
  category: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  dueDate: string;
  assignedTo: string;
  keyResults: {
    id: number;
    title: string;
    target: number;
    current: number;
    unit?: string;
    completed: boolean;
  }[];
  businessEntityId?: number;
  businessEntityName?: string;
}

interface StrategicInitiative {
  id: number;
  name: string;
  description: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  category: string;
  startDate: string;
  endDate: string;
  owner: string;
  budget: number;
  budgetSpent: number;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedGoals: number[];
  businessEntityId?: number;
  businessEntityName?: string;
}

interface BusinessInsight {
  id: number;
  title: string;
  description: string;
  category: 'opportunity' | 'risk' | 'strength' | 'trend';
  impact: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  source: string;
  date: string;
  actionItems: {
    id: number;
    text: string;
    completed: boolean;
  }[];
  businessEntityId?: number;
  businessEntityName?: string;
}

// Formatter functions
const formatValue = (value: number, format: 'number' | 'currency' | 'percentage', unit?: string): string => {
  if (format === 'currency') {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  } else if (format === 'percentage') {
    return `${(value * 100).toFixed(1)}%`;
  } else {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M${unit ? ' ' + unit : ''}`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K${unit ? ' ' + unit : ''}`;
    } else {
      return `${value.toFixed(0)}${unit ? ' ' + unit : ''}`;
    }
  }
};

// Component for Health Score Card
const HealthScoreCard = ({ score }: { score: HealthScore }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{score.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{score.score}/{score.maxScore}</div>
            <div className={`flex items-center text-xs ${score.trend === 'increasing' ? 'text-green-500' : score.trend === 'decreasing' ? 'text-red-500' : 'text-muted-foreground'}`}>
              {score.trend === 'increasing' ? 
                <ChevronUp className="h-3 w-3 mr-1" /> : 
                score.trend === 'decreasing' ? 
                  <ChevronDown className="h-3 w-3 mr-1" /> : 
                  <Minus className="h-3 w-3 mr-1" />
              }
              {score.change > 0 ? '+' : ''}{score.change} in last 30 days
            </div>
          </div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${score.color}`}>
            <score.icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for North Star Metric Card
const NorthStarMetricCard = ({ metric }: { metric: NorthStarMetric }) => {
  return (
    <Card className={`${metric.importance === 'primary' ? 'border-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
          {metric.importance === 'primary' && (
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          )}
        </div>
        <CardDescription>{metric.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {formatValue(metric.value, metric.format, metric.unit)}
              </div>
              <div className={`flex items-center text-xs ${metric.changePercentage > 0 ? 'text-green-500' : metric.changePercentage < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {metric.changePercentage > 0 ? 
                  <TrendingUp className="h-3 w-3 mr-1" /> : 
                  metric.changePercentage < 0 ? 
                    <TrendingDown className="h-3 w-3 mr-1" /> : 
                    <Minus className="h-3 w-3 mr-1" />
                }
                {metric.changePercentage > 0 ? '+' : ''}{Math.abs(metric.changePercentage).toFixed(1)}% vs previous
              </div>
            </div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${metric.color}`}>
              <metric.icon className="h-5 w-5" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Target: {formatValue(metric.target, metric.format, metric.unit)}</span>
              <span className={`${metric.value >= metric.target ? 'text-green-500' : ''}`}>
                {Math.round((metric.value / metric.target) * 100)}%
              </span>
            </div>
            <Progress value={(metric.value / metric.target) * 100} className="h-1.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Quarterly Goal Card
const QuarterlyGoalCard = ({ goal, onViewDetails }: { goal: QuarterlyGoal, onViewDetails: (id: number) => void }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'at_risk':
        return <Badge variant="destructive">At Risk</Badge>;
      default:
        return null;
    }
  };

  const getDaysRemaining = () => {
    const dueDate = new Date(goal.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                {goal.quarter} {goal.year}
              </Badge>
              {getStatusBadge(goal.status)}
            </div>
            <CardTitle className="text-base">{goal.title}</CardTitle>
            <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{goal.category}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{goal.assignedTo}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{new Date(goal.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className={daysRemaining < 0 ? 'text-red-500' : daysRemaining < 7 ? 'text-amber-500' : ''}>
                {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => onViewDetails(goal.id)}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component for Strategic Initiative Card
const StrategicInitiativeCard = ({ initiative }: { initiative: StrategicInitiative }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline">Planned</Badge>;
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800">High</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getStatusBadge(initiative.status)}
              {getPriorityBadge(initiative.priority)}
            </div>
            <CardTitle className="text-base">{initiative.name}</CardTitle>
            <CardDescription className="line-clamp-2">{initiative.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">{initiative.progress}%</span>
            </div>
            <Progress value={initiative.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{initiative.category}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{initiative.owner}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{new Date(initiative.startDate).toLocaleDateString()} - {new Date(initiative.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Wallet className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>${initiative.budgetSpent.toLocaleString()} / ${initiative.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Business Insight Card
const BusinessInsightCard = ({ insight }: { insight: BusinessInsight }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'risk':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'strength':
        return <ShieldCheck className="h-5 w-5 text-blue-500" />;
      case 'trend':
        return <LineChart className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">Low Impact</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">Medium Impact</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">High Impact</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getImpactBadge(insight.impact)}
              <Badge variant="outline">
                {insight.confidence.charAt(0).toUpperCase() + insight.confidence.slice(1)} Confidence
              </Badge>
            </div>
            <CardTitle className="text-base flex items-center gap-2">
              {getCategoryIcon(insight.category)}
              {insight.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">{insight.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="text-sm">
            <div className="flex items-start gap-1.5">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="font-medium">Source: {insight.source}</div>
                <div className="text-muted-foreground">
                  Identified on {new Date(insight.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          {insight.actionItems.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-sm font-medium">Action Items:</div>
              <div className="space-y-1">
                {insight.actionItems.slice(0, 2).map(item => (
                  <div key={item.id} className="flex items-start gap-1.5 text-sm">
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    )}
                    <span className={item.completed ? 'text-muted-foreground line-through' : ''}>
                      {item.text}
                    </span>
                  </div>
                ))}
                {insight.actionItems.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{insight.actionItems.length - 2} more action items
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Overall Health Score
const OverallHealthScoreChart = ({ score }: { score: number }) => {
  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke={`hsl(${score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--destructive)'})`}
          strokeWidth="10"
          strokeDasharray={`${score * 2.83} 283`}
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold">{score}</span>
        <span className="text-sm text-muted-foreground">Business Health</span>
      </div>
    </div>
  );
};

// Main Strategy Dashboard Component
export default function StrategyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBusinessEntity, setSelectedBusinessEntity] = useState<number>(1); // Default to first entity
  const [goalFilter, setGoalFilter] = useState('all');
  const [initiativeFilter, setInitiativeFilter] = useState('all');
  const { demoMode } = useDemoMode();
  
  // Fetch data from API
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: () => apiRequest('/api/business-entities')
  });
  
  const { data: healthScoresData, isLoading: isLoadingHealthScores } = useQuery({
    queryKey: ['/api/health-scores', selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/health-scores?entityId=${selectedBusinessEntity}`)
  });
  
  const { data: northStarData, isLoading: isLoadingNorthStar } = useQuery({
    queryKey: ['/api/north-star-metrics', selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/north-star-metrics?entityId=${selectedBusinessEntity}`)
  });
  
  const { data: goalsData, isLoading: isLoadingGoals } = useQuery({
    queryKey: ['/api/quarterly-goals', selectedBusinessEntity, goalFilter],
    queryFn: () => apiRequest(`/api/quarterly-goals?entityId=${selectedBusinessEntity}&status=${goalFilter}`)
  });
  
  const { data: initiativesData, isLoading: isLoadingInitiatives } = useQuery({
    queryKey: ['/api/strategic-initiatives', selectedBusinessEntity, initiativeFilter],
    queryFn: () => apiRequest(`/api/strategic-initiatives?entityId=${selectedBusinessEntity}&status=${initiativeFilter}`)
  });
  
  const { data: insightsData, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['/api/business-insights', selectedBusinessEntity],
    queryFn: () => apiRequest(`/api/business-insights?entityId=${selectedBusinessEntity}`)
  });

  // Mock default data for demo mode
  const defaultBusinessEntities: BusinessEntity[] = demoMode ? [
    {
      id: 1,
      name: "Digital Merch Pros",
      industry: "E-commerce",
      founded: "2020-03-15",
      employees: 42,
      revenue: 4750000,
      profitMargin: 0.18,
      growthRate: 0.32,
      location: "Austin, TX"
    },
    {
      id: 2,
      name: "Mystery Hype",
      industry: "Retail",
      founded: "2021-06-22",
      employees: 28,
      revenue: 2100000,
      profitMargin: 0.14,
      growthRate: 0.45,
      location: "Austin, TX"
    },
    {
      id: 3,
      name: "Lone Star Custom Clothing",
      industry: "Manufacturing",
      founded: "2019-01-10",
      employees: 35,
      revenue: 3250000,
      profitMargin: 0.22,
      growthRate: 0.18,
      location: "Austin, TX"
    },
    {
      id: 4,
      name: "Alcoeaze",
      industry: "Beverage",
      founded: "2022-04-05",
      employees: 12,
      revenue: 950000,
      profitMargin: 0.26,
      growthRate: 0.65,
      location: "Austin, TX"
    },
    {
      id: 5,
      name: "Hide Cafe Bars",
      industry: "Hospitality",
      founded: "2021-11-30",
      employees: 18,
      revenue: 1200000,
      profitMargin: 0.15,
      growthRate: 0.28,
      location: "Austin, TX"
    }
  ] : [];

  const defaultHealthScores: HealthScore[] = demoMode ? [
    {
      id: 1,
      name: "Financial Health",
      score: 85,
      maxScore: 100,
      trend: "increasing",
      change: 3,
      category: "Finance",
      icon: Wallet,
      color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
    },
    {
      id: 2,
      name: "Operational Efficiency",
      score: 78,
      maxScore: 100,
      trend: "increasing",
      change: 5,
      category: "Operations",
      icon: LayoutDashboard,
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
    },
    {
      id: 3,
      name: "Market Position",
      score: 72,
      maxScore: 100,
      trend: "stable",
      change: 0,
      category: "Marketing",
      icon: Target,
      color: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
    },
    {
      id: 4,
      name: "Customer Satisfaction",
      score: 92,
      maxScore: 100,
      trend: "increasing",
      change: 2,
      category: "Customer",
      icon: Users,
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
    },
    {
      id: 5,
      name: "Team Health",
      score: 88,
      maxScore: 100,
      trend: "increasing",
      change: 4,
      category: "Human Resources",
      icon: Users,
      color: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
    },
    {
      id: 6,
      name: "Compliance Score",
      score: 95,
      maxScore: 100,
      trend: "stable",
      change: 0,
      category: "Legal",
      icon: ShieldCheck,
      color: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
    }
  ] : [];

  const defaultNorthStarMetrics: NorthStarMetric[] = demoMode ? [
    {
      id: 1,
      name: "Monthly Recurring Revenue",
      value: 395000,
      format: "currency",
      target: 450000,
      previousValue: 380000,
      changePercentage: 3.9,
      description: "Total monthly subscription revenue",
      frequency: "monthly",
      importance: "primary",
      icon: Wallet,
      color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
    },
    {
      id: 2,
      name: "Net Revenue Retention",
      value: 0.112,
      format: "percentage",
      target: 0.15,
      previousValue: 0.105,
      changePercentage: 6.7,
      description: "Revenue growth from existing customers",
      frequency: "monthly",
      importance: "secondary",
      icon: TrendingUp,
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
    },
    {
      id: 3,
      name: "User Acquisition Cost",
      value: 85,
      format: "currency",
      target: 75,
      previousValue: 90,
      changePercentage: -5.6,
      description: "Cost to acquire a new user",
      frequency: "monthly",
      importance: "secondary",
      icon: HandCoins,
      color: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
    },
    {
      id: 4,
      name: "Active Users",
      value: 12500,
      format: "number",
      target: 15000,
      previousValue: 11800,
      changePercentage: 5.9,
      description: "Monthly active users",
      frequency: "monthly",
      importance: "primary",
      icon: Users,
      color: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
    },
    {
      id: 5,
      name: "Average Order Value",
      value: 120,
      format: "currency",
      target: 150,
      previousValue: 115,
      changePercentage: 4.3,
      unit: "",
      description: "Average value per order",
      frequency: "monthly",
      importance: "secondary",
      icon: ShoppingCart,
      color: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
    },
    {
      id: 6,
      name: "Customer Satisfaction",
      value: 0.92,
      format: "percentage",
      target: 0.95,
      previousValue: 0.91,
      changePercentage: 1.1,
      description: "Overall customer satisfaction score",
      frequency: "quarterly",
      importance: "primary",
      icon: Heart,
      color: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
    }
  ] : [];

  const defaultQuarterlyGoals: QuarterlyGoal[] = demoMode ? [
    {
      id: 1,
      title: "Increase Monthly Active Users",
      description: "Grow our active user base through enhanced product features and improved onboarding.",
      category: "Growth",
      progress: 75,
      status: "in_progress",
      quarter: "Q1",
      year: 2025,
      dueDate: "2025-03-31T00:00:00Z",
      assignedTo: "Sarah Johnson",
      keyResults: [
        {
          id: 1,
          title: "Reach 15,000 monthly active users",
          target: 15000,
          current: 12500,
          unit: "users",
          completed: false
        },
        {
          id: 2,
          title: "Reduce onboarding drop-off rate to 15%",
          target: 15,
          current: 18,
          unit: "%",
          completed: false
        },
        {
          id: 3,
          title: "Launch 3 new user engagement features",
          target: 3,
          current: 2,
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "Improve Revenue Retention",
      description: "Increase net revenue retention through better customer success practices and reduced churn.",
      category: "Revenue",
      progress: 65,
      status: "in_progress",
      quarter: "Q1",
      year: 2025,
      dueDate: "2025-03-31T00:00:00Z",
      assignedTo: "Michael Chen",
      keyResults: [
        {
          id: 1,
          title: "Increase net revenue retention to 115%",
          target: 115,
          current: 112,
          unit: "%",
          completed: false
        },
        {
          id: 2,
          title: "Reduce monthly customer churn to 2.5%",
          target: 2.5,
          current: 3.1,
          unit: "%",
          completed: false
        },
        {
          id: 3,
          title: "Implement strategic account management for top 20 customers",
          target: 20,
          current: 15,
          unit: "accounts",
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Optimize Customer Acquisition Cost",
      description: "Reduce the average cost to acquire a new customer through more efficient marketing channels.",
      category: "Marketing",
      progress: 80,
      status: "in_progress",
      quarter: "Q1",
      year: 2025,
      dueDate: "2025-03-31T00:00:00Z",
      assignedTo: "Emily Rodriguez",
      keyResults: [
        {
          id: 1,
          title: "Reduce CAC to $75 per customer",
          target: 75,
          current: 85,
          unit: "USD",
          completed: false
        },
        {
          id: 2,
          title: "Increase organic lead generation by 35%",
          target: 35,
          current: 28,
          unit: "%",
          completed: false
        },
        {
          id: 3,
          title: "Optimize conversion rates on top 5 marketing channels",
          target: 5,
          current: 4,
          unit: "channels",
          completed: false
        }
      ]
    },
    {
      id: 4,
      title: "Expand Product Feature Set",
      description: "Develop and launch new product features to enhance user value and support upsell opportunities.",
      category: "Product",
      progress: 45,
      status: "in_progress",
      quarter: "Q1",
      year: 2025,
      dueDate: "2025-03-31T00:00:00Z",
      assignedTo: "David Brown",
      keyResults: [
        {
          id: 1,
          title: "Launch premium tier with 5 exclusive features",
          target: 5,
          current: 3,
          unit: "features",
          completed: false
        },
        {
          id: 2,
          title: "Achieve 15% adoption of new reporting module",
          target: 15,
          current: 10,
          unit: "%",
          completed: false
        },
        {
          id: 3,
          title: "Complete integration with 3 third-party platforms",
          target: 3,
          current: 1,
          completed: false
        }
      ]
    },
    {
      id: 5,
      title: "Improve Operational Efficiency",
      description: "Streamline internal processes to reduce costs and improve delivery timelines.",
      category: "Operations",
      progress: 90,
      status: "in_progress",
      quarter: "Q1",
      year: 2025,
      dueDate: "2025-03-31T00:00:00Z",
      assignedTo: "Robert Thompson",
      keyResults: [
        {
          id: 1,
          title: "Reduce fulfillment time by 30%",
          target: 30,
          current: 25,
          unit: "%",
          completed: false
        },
        {
          id: 2,
          title: "Automate 12 manual processes",
          target: 12,
          current: 10,
          unit: "processes",
          completed: false
        },
        {
          id: 3,
          title: "Decrease operational costs by 15%",
          target: 15,
          current: 14,
          unit: "%",
          completed: true
        }
      ]
    }
  ] : [];

  const defaultStrategicInitiatives: StrategicInitiative[] = demoMode ? [
    {
      id: 1,
      name: "Enterprise Customer Expansion",
      description: "Strategic initiative to expand our enterprise customer base through targeted outreach and specialized solutions.",
      status: "active",
      category: "Sales",
      startDate: "2025-01-15T00:00:00Z",
      endDate: "2025-06-30T00:00:00Z",
      owner: "Michael Chen",
      budget: 125000,
      budgetSpent: 45000,
      progress: 35,
      priority: "high",
      relatedGoals: [2]
    },
    {
      id: 2,
      name: "Product Platform Modernization",
      description: "Comprehensive update of our product platform to improve scalability, performance, and feature delivery.",
      status: "active",
      category: "Product",
      startDate: "2025-02-01T00:00:00Z",
      endDate: "2025-07-31T00:00:00Z",
      owner: "David Brown",
      budget: 250000,
      budgetSpent: 65000,
      progress: 25,
      priority: "critical",
      relatedGoals: [4]
    },
    {
      id: 3,
      name: "Marketing Channel Optimization",
      description: "Data-driven analysis and optimization of marketing channels to improve CAC and lead quality.",
      status: "active",
      category: "Marketing",
      startDate: "2025-01-05T00:00:00Z",
      endDate: "2025-03-31T00:00:00Z",
      owner: "Emily Rodriguez",
      budget: 85000,
      budgetSpent: 55000,
      progress: 65,
      priority: "high",
      relatedGoals: [3]
    },
    {
      id: 4,
      name: "Customer Success Program Enhancement",
      description: "Developing and implementing enhanced customer success practices to improve retention and satisfaction.",
      status: "active",
      category: "Customer Success",
      startDate: "2025-01-20T00:00:00Z",
      endDate: "2025-04-15T00:00:00Z",
      owner: "Sarah Johnson",
      budget: 70000,
      budgetSpent: 30000,
      progress: 40,
      priority: "medium",
      relatedGoals: [2]
    },
    {
      id: 5,
      name: "International Market Expansion",
      description: "Strategic expansion into European markets, including localization and regional partnership development.",
      status: "planned",
      category: "Growth",
      startDate: "2025-04-01T00:00:00Z",
      endDate: "2025-12-31T00:00:00Z",
      owner: "Jennifer Lee",
      budget: 320000,
      budgetSpent: 0,
      progress: 0,
      priority: "medium",
      relatedGoals: [1, 2]
    },
    {
      id: 6,
      name: "Operational Automation Program",
      description: "Implementation of automation tools and AI to streamline key operational processes.",
      status: "active",
      category: "Operations",
      startDate: "2025-01-10T00:00:00Z",
      endDate: "2025-03-25T00:00:00Z",
      owner: "Robert Thompson",
      budget: 95000,
      budgetSpent: 75000,
      progress: 80,
      priority: "high",
      relatedGoals: [5]
    }
  ] : [];

  const defaultBusinessInsights: BusinessInsight[] = demoMode ? [
    {
      id: 1,
      title: "Premium Tier Customer Growth Opportunity",
      description: "Analysis of customer usage patterns reveals significant opportunity to convert mid-tier customers to premium plans through targeted feature set enhancements.",
      category: "opportunity",
      impact: "high",
      confidence: "medium",
      source: "Customer Usage Analysis",
      date: "2025-03-10T00:00:00Z",
      actionItems: [
        {
          id: 1,
          text: "Develop targeted feature enhancement roadmap for mid-tier customers",
          completed: false
        },
        {
          id: 2,
          text: "Create conversion campaign with personalized messaging",
          completed: false
        },
        {
          id: 3,
          text: "Build ROI calculator for premium tier customers",
          completed: true
        }
      ]
    },
    {
      id: 2,
      title: "Competitor Pricing Pressure in Enterprise Segment",
      description: "Major competitor has reduced enterprise pricing by 15%, creating potential retention risk for our enterprise customer base.",
      category: "risk",
      impact: "high",
      confidence: "high",
      source: "Competitive Analysis Report",
      date: "2025-03-05T00:00:00Z",
      actionItems: [
        {
          id: 1,
          text: "Develop enhanced value proposition for enterprise customers",
          completed: true
        },
        {
          id: 2,
          text: "Review enterprise pricing structure",
          completed: false
        },
        {
          id: 3,
          text: "Create proactive communication strategy for at-risk accounts",
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Industry-Leading Customer Satisfaction Rating",
      description: "Recent NPS surveys show our customer satisfaction scores are 15 points above industry average, creating strong referral opportunity.",
      category: "strength",
      impact: "medium",
      confidence: "high",
      source: "Quarterly NPS Survey",
      date: "2025-02-25T00:00:00Z",
      actionItems: [
        {
          id: 1,
          text: "Develop customer testimonial and case study program",
          completed: true
        },
        {
          id: 2,
          text: "Launch formal customer referral incentive program",
          completed: false
        }
      ]
    },
    {
      id: 4,
      title: "Emerging Market Segment in Healthcare Vertical",
      description: "Analysis of industry trends shows rapidly growing opportunity in healthcare mid-market segment, particularly for compliance-related solutions.",
      category: "trend",
      impact: "medium",
      confidence: "medium",
      source: "Industry Research Report",
      date: "2025-03-01T00:00:00Z",
      actionItems: [
        {
          id: 1,
          text: "Assess current product capabilities for healthcare compliance",
          completed: true
        },
        {
          id: 2,
          text: "Develop healthcare vertical go-to-market strategy",
          completed: false
        },
        {
          id: 3,
          text: "Identify potential healthcare industry partnerships",
          completed: false
        }
      ]
    },
    {
      id: 5,
      title: "Mobile Usage Increasing Among User Base",
      description: "User analytics show 45% increase in mobile app usage over the past 6 months, with mobile users showing 22% higher engagement.",
      category: "trend",
      impact: "medium",
      confidence: "high",
      source: "User Analytics Dashboard",
      date: "2025-03-12T00:00:00Z",
      actionItems: [
        {
          id: 1,
          text: "Prioritize mobile feature development in product roadmap",
          completed: true
        },
        {
          id: 2,
          text: "Conduct mobile UX review and improvement initiative",
          completed: false
        },
        {
          id: 3,
          text: "Develop mobile-specific marketing campaigns",
          completed: false
        }
      ]
    }
  ] : [];
  
  // Process data
  const businessEntities = entitiesData?.entities || defaultBusinessEntities;
  const healthScores = healthScoresData?.scores || defaultHealthScores;
  const northStarMetrics = northStarData?.metrics || defaultNorthStarMetrics;
  const quarterlyGoals = goalsData?.goals || defaultQuarterlyGoals;
  const strategicInitiatives = initiativesData?.initiatives || defaultStrategicInitiatives;
  const businessInsights = insightsData?.insights || defaultBusinessInsights;
  
  // Get the selected entity
  const selectedEntity = businessEntities.find(entity => entity.id === selectedBusinessEntity);
  
  // Calculate overall health score
  const overallHealthScore = healthScores.length 
    ? Math.round(healthScores.reduce((sum, score) => sum + score.score, 0) / healthScores.length) 
    : 0;
  
  // Filter goals based on filter
  const filteredGoals = goalFilter === 'all' 
    ? quarterlyGoals 
    : quarterlyGoals.filter(goal => goal.status === goalFilter);
  
  // Filter initiatives based on filter
  const filteredInitiatives = initiativeFilter === 'all' 
    ? strategicInitiatives 
    : strategicInitiatives.filter(initiative => initiative.status === initiativeFilter);
  
  // Get primary North Star metrics
  const primaryMetrics = northStarMetrics.filter(metric => metric.importance === 'primary');
  
  // Handle viewing goal details
  const handleViewGoalDetails = (id: number) => {
    console.log(`Viewing goal with ID: ${id}`);
    // In a real implementation, you would open a modal or navigate to a details page
  };
  
  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Strategy Dashboard</h1>
            <p className="text-muted-foreground">
              Track business health, strategic goals, and key performance indicators
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <Select 
              value={selectedBusinessEntity.toString()} 
              onValueChange={(value) => setSelectedBusinessEntity(parseInt(value))}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select business entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Business Entities</SelectLabel>
                  {businessEntities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Q1 2025
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </Button>
              <Button variant="default" size="sm">
                <FilePlus2 className="h-4 w-4 mr-1" />
                New Goal
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="north-star" className="flex items-center gap-1">
                <Compass className="h-4 w-4" />
                <span>North Star Metrics</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Quarterly Goals</span>
              </TabsTrigger>
              <TabsTrigger value="initiatives" className="flex items-center gap-1">
                <Flag className="h-4 w-4" />
                <span>Strategic Initiatives</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {selectedEntity && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{selectedEntity.name} Strategy Overview</CardTitle>
                    <CardDescription>
                      High-level view of business health, key metrics, and strategic priorities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-base font-medium mb-3">Overall Business Health</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <OverallHealthScoreChart score={overallHealthScore} />
                          <div className="text-center mt-2">
                            <div className="text-sm text-muted-foreground">
                              {overallHealthScore >= 80 
                                ? "Excellent business health across key dimensions." 
                                : overallHealthScore >= 60 
                                  ? "Good business health with areas for improvement." 
                                  : "Significant improvement needed in multiple areas."}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h3 className="text-base font-medium mb-3">Primary North Star Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {isLoadingNorthStar ? (
                            Array(2).fill(0).map((_, i) => (
                              <Skeleton key={i} className="h-[180px] w-full" />
                            ))
                          ) : primaryMetrics.length === 0 ? (
                            <div className="col-span-2 flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg text-center">
                              <Compass className="h-12 w-12 text-muted-foreground mb-2" />
                              <h3 className="text-lg font-medium">No Primary Metrics Defined</h3>
                              <p className="text-sm text-muted-foreground mt-1 mb-4">
                                Define your key north star metrics to guide your business strategy.
                              </p>
                              <Button size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Define Primary Metrics
                              </Button>
                            </div>
                          ) : (
                            primaryMetrics.slice(0, 2).map(metric => (
                              <NorthStarMetricCard key={metric.id} metric={metric} />
                            ))
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setActiveTab('north-star')}
                          >
                            View All Metrics
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-base font-medium">Q1 2025 Goals Progress</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 flex items-center text-xs"
                            onClick={() => setActiveTab('goals')}
                          >
                            View All
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                        
                        {isLoadingGoals ? (
                          <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                              <Skeleton key={i} className="h-24 w-full" />
                            ))}
                          </div>
                        ) : quarterlyGoals.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg text-center">
                            <Target className="h-12 w-12 text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium">No Quarterly Goals</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Set quarterly goals to track your strategic objectives.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {quarterlyGoals.slice(0, 3).map(goal => (
                              <div key={goal.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center mb-1">
                                    <Badge variant="secondary" className="mr-2 text-xs px-1.5 py-0 h-5">
                                      {goal.quarter} {goal.year}
                                    </Badge>
                                    {goal.status === 'completed' ? (
                                      <Badge className="bg-green-500">Completed</Badge>
                                    ) : goal.status === 'at_risk' ? (
                                      <Badge variant="destructive">At Risk</Badge>
                                    ) : null}
                                  </div>
                                  <div className="font-medium truncate">{goal.title}</div>
                                  <div className="flex items-center mt-1">
                                    <Progress value={goal.progress} className="h-1.5 flex-1 mr-2" />
                                    <span className="text-xs font-medium">{goal.progress}%</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-base font-medium">Business Insights</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 flex items-center text-xs"
                          >
                            View All
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                        
                        {isLoadingInsights ? (
                          <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                              <Skeleton key={i} className="h-24 w-full" />
                            ))}
                          </div>
                        ) : businessInsights.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg text-center">
                            <Info className="h-12 w-12 text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium">No Business Insights</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Record key business insights to inform strategic decisions.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {businessInsights.slice(0, 2).map(insight => (
                              <div key={insight.id} className="p-3 border rounded-lg">
                                <div className="flex items-center mb-1">
                                  {insight.category === 'opportunity' ? (
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
                                  ) : insight.category === 'risk' ? (
                                    <AlertCircle className="h-4 w-4 text-red-500 mr-1.5" />
                                  ) : insight.category === 'strength' ? (
                                    <ShieldCheck className="h-4 w-4 text-blue-500 mr-1.5" />
                                  ) : (
                                    <LineChart className="h-4 w-4 text-purple-500 mr-1.5" />
                                  )}
                                  <div className="font-medium">{insight.title}</div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {insight.description}
                                </p>
                                {insight.actionItems.length > 0 && (
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    {insight.actionItems.filter(item => item.completed).length} of {insight.actionItems.length} actions completed
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthScores.map(score => (
                  <HealthScoreCard key={score.id} score={score} />
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Strategic Initiatives</CardTitle>
                  <CardDescription>
                    Key strategic programs currently in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingInitiatives ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full" />
                      ))}
                    </div>
                  ) : strategicInitiatives.filter(i => i.status === 'active').length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <Flag className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Active Initiatives</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                        There are no active strategic initiatives at this time.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Create New Initiative
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {strategicInitiatives.filter(i => i.status === 'active')
                        .sort((a, b) => {
                          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                          return priorityOrder[a.priority] - priorityOrder[b.priority];
                        })
                        .slice(0, 3)
                        .map(initiative => (
                          <div key={initiative.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Badge className="bg-green-500">Active</Badge>
                                  {initiative.priority === 'critical' ? (
                                    <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">Critical</Badge>
                                  ) : initiative.priority === 'high' ? (
                                    <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800">High</Badge>
                                  ) : null}
                                </div>
                                <h3 className="font-medium">{initiative.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{initiative.description}</p>
                              </div>
                              <div className="text-sm font-medium">
                                {initiative.progress}%
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <Progress value={initiative.progress} className="h-2" />
                            </div>
                            
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <div>Owner: {initiative.owner}</div>
                              <div>Budget: ${initiative.budgetSpent.toLocaleString()} / ${initiative.budget.toLocaleString()}</div>
                            </div>
                          </div>
                        ))
                      }
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab('initiatives')}
                      >
                        View All Initiatives
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* North Star Metrics Tab */}
            <TabsContent value="north-star" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">North Star Metrics</CardTitle>
                  <CardDescription>
                    Key metrics that guide your business strategy and decision-making
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 mb-6">
                    <h3 className="text-sm font-medium">Primary Metrics</h3>
                    <p className="text-xs text-muted-foreground">
                      The most important metrics that drive overall business success
                    </p>
                  </div>
                  
                  {isLoadingNorthStar ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[180px] w-full" />
                      ))}
                    </div>
                  ) : primaryMetrics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center mb-8">
                      <Compass className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Primary Metrics Defined</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                        Define your key north star metrics to guide your business strategy.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Define Primary Metrics
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {primaryMetrics.map(metric => (
                        <NorthStarMetricCard key={metric.id} metric={metric} />
                      ))}
                    </div>
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-1 mb-6">
                    <h3 className="text-sm font-medium">Secondary Metrics</h3>
                    <p className="text-xs text-muted-foreground">
                      Supporting metrics that help achieve primary objectives
                    </p>
                  </div>
                  
                  {isLoadingNorthStar ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[180px] w-full" />
                      ))}
                    </div>
                  ) : northStarMetrics.filter(m => m.importance === 'secondary').length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <LineChart className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Secondary Metrics Defined</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                        Define supporting metrics to help achieve your primary objectives.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Secondary Metrics
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {northStarMetrics
                        .filter(metric => metric.importance === 'secondary')
                        .map(metric => (
                          <NorthStarMetricCard key={metric.id} metric={metric} />
                        ))
                      }
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex justify-between items-center w-full">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Metrics
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Metric
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Quarterly Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                    <div>
                      <CardTitle className="text-lg">Quarterly Goals</CardTitle>
                      <CardDescription>
                        Track and manage your strategic objectives for Q1 2025
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={goalFilter} onValueChange={setGoalFilter}>
                        <SelectTrigger className="w-[160px]">
                          <Filter className="h-4 w-4 mr-1" />
                          <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Goals</SelectItem>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="at_risk">At Risk</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="default">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Goal
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingGoals ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[220px] w-full" />
                      ))}
                    </div>
                  ) : filteredGoals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <Target className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Goals Found</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                        {goalFilter === 'all' 
                          ? "You haven't created any quarterly goals yet." 
                          : `No goals with '${goalFilter.replace('_', ' ')}' status found.`}
                      </p>
                      {goalFilter === 'all' ? (
                        <Button>
                          <Plus className="h-4 w-4 mr-1" />
                          Create First Goal
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setGoalFilter('all')}>
                          Show All Goals
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredGoals.map(goal => (
                        <QuarterlyGoalCard key={goal.id} goal={goal} onViewDetails={handleViewGoalDetails} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Strategic Initiatives Tab */}
            <TabsContent value="initiatives" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                    <div>
                      <CardTitle className="text-lg">Strategic Initiatives</CardTitle>
                      <CardDescription>
                        Long-term strategic programs and projects
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={initiativeFilter} onValueChange={setInitiativeFilter}>
                        <SelectTrigger className="w-[160px]">
                          <Filter className="h-4 w-4 mr-1" />
                          <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Initiatives</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="default">
                        <Plus className="h-4 w-4 mr-1" />
                        New Initiative
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingInitiatives ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[220px] w-full" />
                      ))}
                    </div>
                  ) : filteredInitiatives.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <Flag className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Initiatives Found</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                        {initiativeFilter === 'all' 
                          ? "You haven't created any strategic initiatives yet." 
                          : `No initiatives with '${initiativeFilter}' status found.`}
                      </p>
                      {initiativeFilter === 'all' ? (
                        <Button>
                          <Plus className="h-4 w-4 mr-1" />
                          Create First Initiative
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setInitiativeFilter('all')}>
                          Show All Initiatives
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredInitiatives.map(initiative => (
                        <StrategicInitiativeCard key={initiative.id} initiative={initiative} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Insights</CardTitle>
                  <CardDescription>
                    Strategic insights that inform initiative planning and execution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingInsights ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[220px] w-full" />
                      ))}
                    </div>
                  ) : businessInsights.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                      <Info className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Business Insights</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                        Record key business insights to inform strategic decisions.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Business Insight
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {businessInsights.map(insight => (
                        <BusinessInsightCard key={insight.id} insight={insight} />
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex justify-end w-full">
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      Record New Insight
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}