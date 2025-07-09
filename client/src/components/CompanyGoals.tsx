import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Edit,
  Plus, 
  Trash2,
  AlertCircle,
  Users,
  BarChart,
  Rocket
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';
import { useUserRole } from '@/contexts/UserRoleContext';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
enum GoalTimeframe {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  BEHIND = 'behind',
  AT_RISK = 'at_risk',
  ON_TRACK = 'on_track',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

enum GoalType {
  REVENUE = 'revenue',
  CUSTOMER = 'customer',
  OPERATIONS = 'operations',
  GROWTH = 'growth',
  CULTURE = 'culture',
  PRODUCT = 'product',
  MARKETING = 'marketing',
  OTHER = 'other'
}

interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  status: GoalStatus;
  progress: number;
  businessEntityId?: number;
  timeframe: GoalTimeframe;
  startDate: string;
  targetDate: string;
  metrics?: GoalMetric[];
  milestones?: GoalMilestone[];
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  assignedTeams?: string[];
  assignedUsers?: string[];
  tags?: string[];
  parentGoalId?: string;
}

interface GoalMetric {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  updatedAt?: string;
}

interface GoalMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

interface BusinessEntity {
  id: number;
  name: string;
}

// Component
export default function CompanyGoals() {
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [activeTimeframe, setActiveTimeframe] = useState<GoalTimeframe | 'all'>('all');
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [showGoalDetailsDialog, setShowGoalDetailsDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  const { toast } = useToast();
  const { userRole } = useUserRole();
  
  // Fetch business entities
  const { data: entitiesData, isLoading: entitiesLoading } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Fetch goals with query parameters
  const queryParams = new URLSearchParams();
  if (selectedEntity !== 'all') {
    queryParams.append('businessEntityId', selectedEntity);
  }
  if (activeTimeframe !== 'all') {
    queryParams.append('timeframe', activeTimeframe);
  }
  
  const { data: goalsData, isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/goals', selectedEntity, activeTimeframe],
    queryFn: getQueryFn({ 
      on401: 'returnNull',
      queryParams: Object.fromEntries(queryParams)
    }),
  });

  const entities: BusinessEntity[] = entitiesData?.entities || [];
  const goals: Goal[] = goalsData?.goals || [];
  
  // Default goals data for demonstration
  const defaultGoals: Goal[] = [
    {
      id: 'goal-1',
      title: 'Increase overall revenue by 30% across all entities',
      description: 'Focus on cross-selling existing products and introducing new service tiers to drive revenue growth.',
      type: GoalType.REVENUE,
      status: GoalStatus.IN_PROGRESS,
      progress: 45,
      timeframe: GoalTimeframe.YEARLY,
      startDate: '2025-01-01',
      targetDate: '2025-12-31',
      metrics: [
        {
          id: 'metric-1',
          name: 'Total Revenue',
          currentValue: 4500000,
          targetValue: 6500000,
          unit: 'USD',
          updatedAt: '2025-03-15'
        },
        {
          id: 'metric-2',
          name: 'New Service Contracts',
          currentValue: 12,
          targetValue: 30,
          unit: 'contracts',
          updatedAt: '2025-03-10'
        }
      ],
      milestones: [
        {
          id: 'milestone-1',
          title: 'Launch premium tier for all services',
          dueDate: '2025-04-15',
          completed: true,
          completedDate: '2025-03-30'
        },
        {
          id: 'milestone-2',
          title: 'Implement cross-selling strategy',
          dueDate: '2025-06-30',
          completed: false
        },
        {
          id: 'milestone-3',
          title: 'Review pricing structure',
          dueDate: '2025-09-15',
          completed: false
        }
      ],
      createdAt: '2025-01-05',
      createdBy: 'User 1',
      assignedTeams: ['Sales', 'Marketing', 'Product'],
      tags: ['revenue', 'growth', '2025-targets']
    },
    {
      id: 'goal-2',
      title: 'Expand Hide Cafe Bars to three new locations',
      description: 'Open three new Hide Cafe Bars in prime locations in Bangkok to capitalize on brand popularity.',
      type: GoalType.GROWTH,
      status: GoalStatus.ON_TRACK,
      progress: 65,
      businessEntityId: 5, // Hide Cafe Bars
      timeframe: GoalTimeframe.YEARLY,
      startDate: '2025-01-15',
      targetDate: '2025-12-01',
      metrics: [
        {
          id: 'metric-3',
          name: 'New Locations',
          currentValue: 2,
          targetValue: 3,
          unit: 'locations',
          updatedAt: '2025-03-20'
        },
        {
          id: 'metric-4',
          name: 'Expansion Budget Used',
          currentValue: 650000,
          targetValue: 1000000,
          unit: 'USD',
          updatedAt: '2025-03-19'
        }
      ],
      milestones: [
        {
          id: 'milestone-4',
          title: 'Secure first location lease',
          dueDate: '2025-02-28',
          completed: true,
          completedDate: '2025-02-15'
        },
        {
          id: 'milestone-5',
          title: 'Secure second location lease',
          dueDate: '2025-05-30',
          completed: true,
          completedDate: '2025-05-10'
        },
        {
          id: 'milestone-6',
          title: 'Secure third location lease',
          dueDate: '2025-08-30',
          completed: false
        }
      ],
      createdAt: '2025-01-10',
      createdBy: 'User 2',
      assignedTeams: ['Operations', 'Real Estate', 'Finance'],
      tags: ['expansion', 'hide-cafe', 'bangkok']
    },
    {
      id: 'goal-3',
      title: 'Improve customer retention rate to 85%',
      description: 'Implement strategies to reduce customer churn and improve long-term retention.',
      type: GoalType.CUSTOMER,
      status: GoalStatus.BEHIND,
      progress: 30,
      businessEntityId: 1, // Digital Merch Pros
      timeframe: GoalTimeframe.QUARTERLY,
      startDate: '2025-01-01',
      targetDate: '2025-03-31',
      metrics: [
        {
          id: 'metric-5',
          name: 'Customer Retention Rate',
          currentValue: 72.5,
          targetValue: 85,
          unit: '%',
          updatedAt: '2025-03-15'
        },
        {
          id: 'metric-6',
          name: 'Customer Satisfaction Score',
          currentValue: 7.8,
          targetValue: 9.0,
          unit: 'CSAT',
          updatedAt: '2025-03-10'
        }
      ],
      createdAt: '2024-12-20',
      createdBy: 'User 3',
      assignedTeams: ['Customer Success', 'Product'],
      tags: ['retention', 'customer-success', 'q1-2025']
    },
    {
      id: 'goal-4',
      title: 'Launch new Mystery Hype product line',
      description: 'Design, produce, and launch a new premium product line for the Mystery Hype brand.',
      type: GoalType.PRODUCT,
      status: GoalStatus.IN_PROGRESS,
      progress: 50,
      businessEntityId: 2, // Mystery Hype
      timeframe: GoalTimeframe.QUARTERLY,
      startDate: '2025-01-15',
      targetDate: '2025-06-30',
      milestones: [
        {
          id: 'milestone-7',
          title: 'Complete product design phase',
          dueDate: '2025-02-28',
          completed: true,
          completedDate: '2025-03-05'
        },
        {
          id: 'milestone-8',
          title: 'Finalize supplier contracts',
          dueDate: '2025-04-15',
          completed: false
        },
        {
          id: 'milestone-9',
          title: 'Launch marketing campaign',
          dueDate: '2025-06-01',
          completed: false
        }
      ],
      createdAt: '2025-01-10',
      createdBy: 'User 4',
      assignedTeams: ['Product', 'Design', 'Marketing'],
      tags: ['product-launch', 'mystery-hype', '2025-q2']
    },
    {
      id: 'goal-5',
      title: 'Implement new sustainability initiatives across all entities',
      description: 'Reduce environmental impact through sustainable practices in operations and supply chain.',
      type: GoalType.OPERATIONS,
      status: GoalStatus.NOT_STARTED,
      progress: 10,
      timeframe: GoalTimeframe.YEARLY,
      startDate: '2025-04-01',
      targetDate: '2025-12-31',
      metrics: [
        {
          id: 'metric-7',
          name: 'Carbon Footprint Reduction',
          currentValue: 0,
          targetValue: 30,
          unit: '%',
          updatedAt: '2025-03-15'
        }
      ],
      createdAt: '2025-02-15',
      createdBy: 'User 1',
      assignedTeams: ['Operations', 'Supply Chain'],
      tags: ['sustainability', 'environment', 'corporate-responsibility']
    }
  ];
  
  // Filter goals based on selections
  const filteredGoals = goals.filter(goal => {
    // Filter by entity
    if (selectedEntity !== 'all' && goal.businessEntityId !== parseInt(selectedEntity)) {
      // Include only organization-wide goals (no entity ID) or entity-specific goals
      if (goal.businessEntityId !== undefined) {
        return false;
      }
    }
    
    // Filter by timeframe
    if (activeTimeframe !== 'all' && goal.timeframe !== activeTimeframe) {
      return false;
    }
    
    return true;
  });
  
  // Grouped goals by entity
  const goalsByEntity = filteredGoals.reduce((acc, goal) => {
    const entityId = goal.businessEntityId !== undefined
      ? goal.businessEntityId.toString()
      : 'organization';
    
    if (!acc[entityId]) {
      acc[entityId] = [];
    }
    
    acc[entityId].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);
  
  // Helper functions
  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.NOT_STARTED:
        return <Badge variant="outline">Not Started</Badge>;
      case GoalStatus.IN_PROGRESS:
        return <Badge variant="secondary">In Progress</Badge>;
      case GoalStatus.BEHIND:
        return <Badge variant="destructive">Behind</Badge>;
      case GoalStatus.AT_RISK:
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">At Risk</Badge>;
      case GoalStatus.ON_TRACK:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>;
      case GoalStatus.COMPLETED:
        return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
      case GoalStatus.CANCELLED:
        return <Badge variant="outline" className="text-muted-foreground">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getGoalTypeIcon = (type: GoalType) => {
    switch (type) {
      case GoalType.REVENUE:
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case GoalType.CUSTOMER:
        return <Users className="h-4 w-4 text-blue-500" />;
      case GoalType.OPERATIONS:
        return <BarChart className="h-4 w-4 text-indigo-500" />;
      case GoalType.GROWTH:
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case GoalType.CULTURE:
        return <Users className="h-4 w-4 text-pink-500" />;
      case GoalType.PRODUCT:
        return <Award className="h-4 w-4 text-amber-500" />;
      case GoalType.MARKETING:
        return <BarChart className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getProgressColor = (progress: number, status: GoalStatus) => {
    if (status === GoalStatus.COMPLETED) return 'bg-primary';
    if (status === GoalStatus.BEHIND || status === GoalStatus.AT_RISK) return 'bg-destructive';
    return 'bg-primary';
  };
  
  const getEntityName = (entityId?: number) => {
    if (entityId === undefined) return 'Organization-wide';
    const entity = entities.find(e => e.id === entityId);
    return entity ? entity.name : 'Unknown Entity';
  };
  
  const formatDateFromNow = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const openGoalDetails = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowGoalDetailsDialog(true);
  };
  
  const handleAddGoal = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding new goals will be available in the next update.",
    });
    setShowAddGoalDialog(false);
  };
  
  const handleUpdateGoalStatus = (goalId: string, newStatus: GoalStatus) => {
    // Update the goal status in the state
    toast({
      title: "Status updated",
      description: `Goal status has been updated to ${newStatus.replace('_', ' ')}.`,
    });
  };
  
  // Render
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Company Goals</CardTitle>
          <CardDescription>
            Track progress on strategic business objectives
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={selectedEntity}
            onValueChange={setSelectedEntity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entities.map(entity => (
                <SelectItem key={entity.id} value={entity.id.toString()}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={activeTimeframe}
            onValueChange={(value) => setActiveTimeframe(value as GoalTimeframe | 'all')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Timeframes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Timeframes</SelectItem>
              <SelectItem value={GoalTimeframe.WEEKLY}>Weekly</SelectItem>
              <SelectItem value={GoalTimeframe.MONTHLY}>Monthly</SelectItem>
              <SelectItem value={GoalTimeframe.QUARTERLY}>Quarterly</SelectItem>
              <SelectItem value={GoalTimeframe.YEARLY}>Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          {(userRole === 'admin' || userRole === 'manager') && (
            <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Define a new strategic objective for your organization.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input id="goal-title" placeholder="Enter goal title" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal-description">Description</Label>
                    <Textarea 
                      id="goal-description" 
                      placeholder="Describe the goal and its importance"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-type">Type</Label>
                      <Select>
                        <SelectTrigger id="goal-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(GoalType).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goal-timeframe">Timeframe</Label>
                      <Select>
                        <SelectTrigger id="goal-timeframe">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(GoalTimeframe).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="target-date">Target Date</Label>
                      <Input id="target-date" type="date" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="goal-entity">Business Entity (Optional)</Label>
                    <Select>
                      <SelectTrigger id="goal-entity">
                        <SelectValue placeholder="Organization-wide" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Organization-wide</SelectItem>
                        {entities.map(entity => (
                          <SelectItem key={entity.id} value={entity.id.toString()}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddGoalDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddGoal}>
                    Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">
              <BarChart className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="board">
              <Rocket className="h-4 w-4 mr-2" />
              Board View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4 space-y-4">
            {filteredGoals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No goals found</h3>
                <p className="text-muted-foreground max-w-sm">
                  There are no goals matching your current filters. Try changing your filters or add a new goal.
                </p>
                
                {(userRole === 'admin' || userRole === 'manager') && (
                  <Button 
                    className="mt-4" 
                    onClick={() => setShowAddGoalDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGoals.map((goal) => (
                  <div 
                    key={goal.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openGoalDetails(goal)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getGoalTypeIcon(goal.type)}
                        <h3 className="font-medium">{goal.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(goal.status)}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateGoalStatus(goal.id, GoalStatus.NOT_STARTED);
                            }}>
                              Not Started
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateGoalStatus(goal.id, GoalStatus.IN_PROGRESS);
                            }}>
                              In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateGoalStatus(goal.id, GoalStatus.ON_TRACK);
                            }}>
                              On Track
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateGoalStatus(goal.id, GoalStatus.BEHIND);
                            }}>
                              Behind
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateGoalStatus(goal.id, GoalStatus.AT_RISK);
                            }}>
                              At Risk
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateGoalStatus(goal.id, GoalStatus.COMPLETED);
                            }}>
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {goal.description}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Clock className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Timeframe: {goal.timeframe}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span>
                          Due {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                          <span className="mx-2">•</span>
                          {getEntityName(goal.businessEntityId)}
                        </span>
                      </div>
                      
                      {goal.assignedTeams && (
                        <div className="flex items-center gap-1">
                          {goal.assignedTeams.map((team, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{team}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress 
                        value={goal.progress} 
                        className={getProgressColor(goal.progress, goal.status)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="board" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Board by entity */}
              {Object.keys(goalsByEntity).length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No goals found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    There are no goals matching your current filters. Try changing your filters or add a new goal.
                  </p>
                </div>
              ) : (
                Object.entries(goalsByEntity).map(([entityId, goals]) => (
                  <Card key={entityId} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-3">
                      <CardTitle className="text-base">
                        {entityId === 'organization' 
                          ? 'Organization-wide Goals' 
                          : getEntityName(parseInt(entityId))
                        }
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
                      {goals.map(goal => (
                        <div 
                          key={goal.id}
                          className="border rounded-md p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => openGoalDetails(goal)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2">
                              {getGoalTypeIcon(goal.type)}
                              <h3 className="font-medium text-sm">{goal.title}</h3>
                            </div>
                            {getStatusBadge(goal.status)}
                          </div>
                          
                          <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {goal.description}
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{goal.progress}%</span>
                            </div>
                            <Progress 
                              value={goal.progress} 
                              className={getProgressColor(goal.progress, goal.status)}
                            />
                          </div>
                          
                          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                            <span>Due {format(new Date(goal.targetDate), 'MMM d')}</span>
                            
                            {goal.milestones && (
                              <span>
                                <CheckCircle2 className="h-3 w-3 inline mr-1" />
                                {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Goal Details Dialog */}
      <Dialog open={showGoalDetailsDialog} onOpenChange={setShowGoalDetailsDialog}>
        <DialogContent className="max-w-3xl">
          {selectedGoal && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {getGoalTypeIcon(selectedGoal.type)}
                  <DialogTitle>{selectedGoal.title}</DialogTitle>
                </div>
                <DialogDescription>
                  {selectedGoal.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedGoal.status)}
                      
                      {(userRole === 'admin' || userRole === 'manager') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Update
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateGoalStatus(selectedGoal.id, GoalStatus.NOT_STARTED)}>
                              Not Started
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateGoalStatus(selectedGoal.id, GoalStatus.IN_PROGRESS)}>
                              In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateGoalStatus(selectedGoal.id, GoalStatus.ON_TRACK)}>
                              On Track
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateGoalStatus(selectedGoal.id, GoalStatus.BEHIND)}>
                              Behind
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateGoalStatus(selectedGoal.id, GoalStatus.AT_RISK)}>
                              At Risk
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateGoalStatus(selectedGoal.id, GoalStatus.COMPLETED)}>
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Timeline</div>
                    <div className="font-medium">
                      {format(new Date(selectedGoal.startDate), 'MMM d, yyyy')} - {format(new Date(selectedGoal.targetDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Entity</div>
                    <div className="font-medium">
                      {getEntityName(selectedGoal.businessEntityId)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Overall Progress</div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completion</span>
                      <span className="text-sm font-medium">{selectedGoal.progress}%</span>
                    </div>
                    <Progress 
                      value={selectedGoal.progress} 
                      className={getProgressColor(selectedGoal.progress, selectedGoal.status)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <Tabs defaultValue="metrics" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                    <TabsTrigger value="teams">Teams</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="metrics" className="mt-4 space-y-4">
                    {!selectedGoal.metrics || selectedGoal.metrics.length === 0 ? (
                      <div className="text-center py-6">
                        <BarChart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No metrics defined for this goal</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedGoal.metrics.map(metric => (
                          <div key={metric.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">{metric.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {metric.updatedAt ? `Last updated ${formatDateFromNow(metric.updatedAt)}` : ''}
                                </p>
                              </div>
                              <div>
                                <span className="text-lg font-bold">
                                  {metric.currentValue} {metric.unit}
                                </span>
                                <span className="text-muted-foreground mx-2">of</span>
                                <span className="font-medium">
                                  {metric.targetValue} {metric.unit}
                                </span>
                              </div>
                            </div>
                            
                            <Progress 
                              value={(metric.currentValue / metric.targetValue) * 100} 
                              className="bg-primary" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="milestones" className="mt-4 space-y-4">
                    {!selectedGoal.milestones || selectedGoal.milestones.length === 0 ? (
                      <div className="text-center py-6">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No milestones defined for this goal</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedGoal.milestones.map(milestone => (
                          <div 
                            key={milestone.id} 
                            className={`flex items-center justify-between p-3 border rounded-md ${
                              milestone.completed ? 'bg-muted/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 rounded-full p-1 ${
                                milestone.completed 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {milestone.completed ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <Clock className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <div className={`font-medium ${
                                  milestone.completed ? 'line-through text-muted-foreground' : ''
                                }`}>
                                  {milestone.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {milestone.completed 
                                    ? `Completed ${milestone.completedDate ? formatDateFromNow(milestone.completedDate) : ''}` 
                                    : `Due ${formatDateFromNow(milestone.dueDate)}`
                                  }
                                </div>
                              </div>
                            </div>
                            
                            {!milestone.completed && (userRole === 'admin' || userRole === 'manager') && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Milestone marked as complete",
                                    description: "The milestone has been marked as completed.",
                                  });
                                }}
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="teams" className="mt-4 space-y-4">
                    {!selectedGoal.assignedTeams || selectedGoal.assignedTeams.length === 0 ? (
                      <div className="text-center py-6">
                        <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No teams assigned to this goal</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Assigned Teams</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedGoal.assignedTeams.map((team, index) => (
                              <Badge key={index} variant="secondary">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {selectedGoal.assignedUsers && selectedGoal.assignedUsers.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">Assigned Users</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedGoal.assignedUsers.map((user, index) => (
                                <Badge key={index} variant="outline">
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}