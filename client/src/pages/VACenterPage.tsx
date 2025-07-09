import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useDemoMode } from "@/contexts/DemoModeContext";
import MainLayout from "@/components/MainLayout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Slack,
  Sparkles,
  Users,
  XCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isToday, isTomorrow, isPast, isThisWeek } from "date-fns";
import { VirtualAssistant, VATask, TaskStatus, TaskPriority, AITaskSuggestion } from "@/types/va-center-types";

// Demo data
const demoVAs: VirtualAssistant[] = [
  {
    id: "va-1",
    name: "Sarah Johnson",
    email: "sarah.j@virtualassist.co",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "Executive Assistant",
    status: "active",
    hourlyRate: 15,
    hoursThisWeek: 32.5,
    lastActive: new Date().toISOString(),
    skills: ["Email Management", "Calendar", "Research", "Data Entry", "Social Media"],
    performanceRating: 4.8
  },
  {
    id: "va-2",
    name: "Michael Chen",
    email: "michael.c@virtualassist.co",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Technical VA",
    status: "busy",
    hourlyRate: 18,
    hoursThisWeek: 28,
    lastActive: new Date().toISOString(),
    skills: ["WordPress", "Shopify", "SEO", "Technical Support", "Web Research"],
    performanceRating: 4.6
  },
  {
    id: "va-3",
    name: "Elena Rodriguez",
    email: "elena.r@virtualassist.co",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "Social Media Manager",
    status: "offline",
    hourlyRate: 16,
    hoursThisWeek: 22,
    lastActive: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
    skills: ["Content Creation", "Instagram", "TikTok", "Copywriting", "Analytics"],
    performanceRating: 4.7
  }
];

// Create demo tasks
const generateDemoTasks = (): VATask[] => {
  // Today's date
  const now = new Date();
  
  // Create a mix of tasks with different statuses and due dates
  return [
    // Tasks for VA 1 (Sarah)
    {
      id: "task-1",
      title: "Schedule quarterly team meeting",
      description: "Coordinate with all department heads to find suitable time for Q2 planning",
      assignedTo: "va-1",
      assignedToName: "Sarah Johnson",
      assignedBy: "user-1",
      assignedByName: "John Smith",
      status: "assigned",
      priority: "high",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 0, 0).toISOString(),
      module: "Operations",
      checklistItems: [
        { id: "checklist-1", text: "Email department heads", isComplete: false },
        { id: "checklist-2", text: "Find available slots in calendar", isComplete: false },
        { id: "checklist-3", text: "Book conference room", isComplete: false }
      ]
    },
    {
      id: "task-2",
      title: "Research competitor pricing",
      description: "Compile pricing data from top 5 competitors for our main product lines",
      assignedTo: "va-1",
      assignedToName: "Sarah Johnson",
      assignedBy: "user-1",
      assignedByName: "John Smith",
      status: "in-progress",
      priority: "medium",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 14, 0, 0).toISOString(),
      module: "Sales",
      checklistItems: [
        { id: "checklist-4", text: "Identify top competitors", isComplete: true },
        { id: "checklist-5", text: "Create spreadsheet for data", isComplete: true },
        { id: "checklist-6", text: "Compile pricing data", isComplete: false },
        { id: "checklist-7", text: "Format report for presentation", isComplete: false }
      ]
    },
    {
      id: "task-3",
      title: "Organize digital asset library",
      description: "Organize all marketing assets into folders by campaign and product line",
      assignedTo: "va-1",
      assignedToName: "Sarah Johnson",
      assignedBy: "user-2",
      assignedByName: "Emma Davis",
      status: "completed",
      priority: "low",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 10, 30, 0).toISOString(),
      completedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 15, 0, 0).toISOString(),
      module: "Marketing"
    },
    
    // Tasks for VA 2 (Michael)
    {
      id: "task-4",
      title: "Fix website contact form",
      description: "Debug and repair contact form that's not sending emails properly",
      assignedTo: "va-2",
      assignedToName: "Michael Chen",
      assignedBy: "user-1",
      assignedByName: "John Smith",
      status: "blocked",
      priority: "urgent",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 16, 0, 0).toISOString(),
      blockedReason: "Waiting for IT to provide SMTP server credentials",
      module: "Operations"
    },
    {
      id: "task-5",
      title: "Update SEO meta descriptions",
      description: "Review and update meta descriptions for top 20 product pages",
      assignedTo: "va-2",
      assignedToName: "Michael Chen",
      assignedBy: "user-3",
      assignedByName: "Robert Johnson",
      status: "in-progress",
      priority: "medium",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 17, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 9, 15, 0).toISOString(),
      module: "Marketing"
    },
    {
      id: "task-6",
      title: "Set up new product in Shopify",
      description: "Create new product listings for the summer collection",
      assignedTo: "va-2",
      assignedToName: "Michael Chen",
      assignedBy: "user-2",
      assignedByName: "Emma Davis",
      status: "overdue",
      priority: "high",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 17, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 11, 30, 0).toISOString(),
      module: "Sales"
    },
    
    // Tasks for VA 3 (Elena)
    {
      id: "task-7",
      title: "Create TikTok content calendar",
      description: "Develop 2-week content calendar for our TikTok channel around new product launch",
      assignedTo: "va-3",
      assignedToName: "Elena Rodriguez",
      assignedBy: "user-2",
      assignedByName: "Emma Davis",
      status: "assigned",
      priority: "high",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 45, 0).toISOString(),
      module: "Marketing"
    },
    {
      id: "task-8",
      title: "Analyze social media metrics",
      description: "Compile last month's performance metrics across all platforms",
      assignedTo: "va-3",
      assignedToName: "Elena Rodriguez",
      assignedBy: "user-3",
      assignedByName: "Robert Johnson",
      status: "completed",
      priority: "medium",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4, 10, 0, 0).toISOString(),
      completedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 16, 30, 0).toISOString(),
      module: "Marketing"
    },
    {
      id: "task-9",
      title: "Respond to Instagram comments",
      description: "Catch up on customer comments and questions from the past week",
      assignedTo: "va-3",
      assignedToName: "Elena Rodriguez",
      assignedBy: "user-2",
      assignedByName: "Emma Davis",
      status: "overdue",
      priority: "urgent",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 17, 0, 0).toISOString(),
      createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 14, 20, 0).toISOString(),
      module: "Customer"
    }
  ];
};

// AI task suggestions
const demoAISuggestions: AITaskSuggestion[] = [
  {
    id: "suggestion-1",
    vaId: "va-1",
    taskTitle: "Update client onboarding documents",
    taskDescription: "Review and update the client onboarding materials based on recent feedback",
    priority: "medium",
    suggestedDueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    module: "Operations",
    reasonForSuggestion: "Multiple clients mentioned confusion in latest NPS survey",
    isApplied: false
  },
  {
    id: "suggestion-2",
    vaId: "va-2",
    taskTitle: "Fix broken links on Resources page",
    taskDescription: "Several links on the Resources page are returning 404 errors and need to be updated",
    priority: "high",
    suggestedDueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    module: "Operations",
    reasonForSuggestion: "Web analytics shows high bounce rate from Resources page",
    isApplied: false
  },
  {
    id: "suggestion-3",
    vaId: "va-3",
    taskTitle: "Create social posts for new product feature",
    taskDescription: "Develop a series of social posts highlighting the new dashboard analytics feature",
    priority: "medium",
    suggestedDueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    module: "Marketing",
    reasonForSuggestion: "New feature launching next week needs promotion",
    isApplied: false
  }
];

// Task card component
interface TaskCardProps {
  task: VATask;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskCard = ({ task, onStatusChange }: TaskCardProps) => {
  const { toast } = useToast();
  const isPastDue = isPast(new Date(task.dueDate)) && !['completed', 'overdue'].includes(task.status);
  const actualStatus = isPastDue ? 'overdue' : task.status;
  
  const statusConfig = {
    assigned: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", icon: <ClipboardList className="h-3 w-3 mr-1" /> },
    'in-progress': { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300", icon: <Clock className="h-3 w-3 mr-1" /> },
    blocked: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", icon: <XCircle className="h-3 w-3 mr-1" /> },
    completed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    overdue: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", icon: <Clock className="h-3 w-3 mr-1" /> }
  };

  const priorityConfig = {
    low: { color: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300" },
    medium: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
    high: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
    urgent: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" }
  };

  // Format the due date for display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  // Calculate checklist progress
  const checklistProgress = task.checklistItems 
    ? Math.round((task.checklistItems.filter(item => item.isComplete).length / task.checklistItems.length) * 100)
    : null;

  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <CardTitle className="text-base font-medium">{task.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                Assigned to {task.assignedToName} by {task.assignedByName}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => toast({ title: "Edit Task", description: "Not implemented in demo" })}>
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Add Note", description: "Not implemented in demo" })}>
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onStatusChange && onStatusChange(task.id, 'in-progress')}
                disabled={task.status === 'in-progress' || task.status === 'completed'}
              >
                Mark In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange && onStatusChange(task.id, 'completed')}
                disabled={task.status === 'completed'}
              >
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange && onStatusChange(task.id, 'blocked')}
                disabled={task.status === 'blocked' || task.status === 'completed'}
              >
                Mark Blocked
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="py-0 px-4">
        {task.description && <p className="text-sm text-muted-foreground mb-3">{task.description}</p>}
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className={statusConfig[actualStatus].color + " flex items-center"}>
            {statusConfig[actualStatus].icon}
            {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
          </Badge>
          
          <Badge variant="secondary" className={priorityConfig[task.priority].color}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          
          <Badge variant="outline">
            {task.module}
          </Badge>
        </div>
        
        {task.blockedReason && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-md text-sm text-red-700 dark:text-red-300">
            <strong>Blocked:</strong> {task.blockedReason}
          </div>
        )}
        
        {task.checklistItems && task.checklistItems.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
              <span>Checklist Progress</span>
              <span>{task.checklistItems.filter(item => item.isComplete).length}/{task.checklistItems.length}</span>
            </div>
            <Progress value={checklistProgress || 0} className="h-1.5" />
          </div>
        )}
      </CardContent>
      <CardFooter className="py-3 px-4 flex justify-between items-center border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Due: {formatDueDate(task.dueDate)}
        </div>
        
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" asChild>
          <Link href={`/va-task/${task.id}`}>
            View Details
            <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// VA Card component
interface VACardProps {
  va: VirtualAssistant;
  tasks: VATask[];
  expanded?: boolean;
  onToggleExpand?: (vaId: string) => void;
}

const VACard = ({ va, tasks, expanded = false, onToggleExpand }: VACardProps) => {
  const todayCount = tasks.filter(task => isToday(new Date(task.dueDate))).length;
  const overdueCount = tasks.filter(task => 
    task.status === 'overdue' || 
    (isPast(new Date(task.dueDate)) && !['completed'].includes(task.status))
  ).length;
  const completedTodayCount = tasks.filter(task => 
    task.status === 'completed' && 
    task.completedAt && 
    isToday(new Date(task.completedAt))
  ).length;
  
  const statusIndicator = {
    active: "bg-green-500",
    busy: "bg-amber-500",
    offline: "bg-slate-400"
  };

  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={va.avatar} alt={va.name} />
              <AvatarFallback>{va.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium flex items-center">
                {va.name}
                <div className={`ml-2 h-2.5 w-2.5 rounded-full ${statusIndicator[va.status]}`} />
              </CardTitle>
              <CardDescription className="text-xs">
                {va.role} • ${va.hourlyRate}/hr
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-5 text-xs">
              {va.status === "active" ? "Online now" : va.status === "busy" ? "Busy" : "Offline"}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7"
              onClick={() => onToggleExpand && onToggleExpand(va.id)}
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-0 px-4">
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="bg-muted/50 rounded p-2">
            <div className="text-lg font-semibold">{todayCount}</div>
            <div className="text-xs text-muted-foreground">Due Today</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="text-lg font-semibold">{overdueCount}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="text-lg font-semibold">{completedTodayCount}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Skills</h4>
              <Badge variant="outline" className="h-5 text-xs">{va.performanceRating} / 5</Badge>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {va.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <h4 className="text-sm font-medium mb-2">Today's Tasks</h4>
            {tasks.filter(task => isToday(new Date(task.dueDate))).length > 0 ? (
              tasks
                .filter(task => isToday(new Date(task.dueDate)))
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No tasks due today
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="py-3 px-4 flex justify-between items-center border-t">
        <div className="text-xs text-muted-foreground">
          {va.hoursThisWeek} hrs this week
        </div>
        
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8 px-2">
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
          <Button variant="default" size="sm" className="h-8 px-2">
            <Plus className="h-4 w-4 mr-1" />
            Assign Task
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// AI Suggestion Card
interface SuggestionCardProps {
  suggestion: AITaskSuggestion;
  onApply: (suggestion: AITaskSuggestion) => void;
  onDismiss: (suggestionId: string) => void;
}

const SuggestionCard = ({ suggestion, onApply, onDismiss }: SuggestionCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "MMM d");
    }
  };

  return (
    <Card className="mb-3 border-dashed bg-muted/20">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-medium">AI Suggestion</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-0 px-4">
        <h4 className="font-medium">{suggestion.taskTitle}</h4>
        <p className="text-sm text-muted-foreground mt-1 mb-2">{suggestion.taskDescription}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline">
            {suggestion.module}
          </Badge>
          <Badge variant="outline">
            Due: {formatDate(suggestion.suggestedDueDate)}
          </Badge>
          <Badge variant="outline">
            {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          <strong>Why suggested:</strong> {suggestion.reasonForSuggestion}
        </div>
      </CardContent>
      <CardFooter className="py-3 px-4 flex justify-end gap-2 border-t">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDismiss(suggestion.id)}
        >
          Dismiss
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onApply(suggestion)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Apply Suggestion
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main VA Center Page Component
export default function VACenterPage() {
  const { demoMode } = useDemoMode();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'admin' | 'va'>('admin');
  const [expandedVAs, setExpandedVAs] = useState<Record<string, boolean>>({});
  const [taskFilter, setTaskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vas] = useState<VirtualAssistant[]>(demoVAs);
  const [tasks, setTasks] = useState<VATask[]>(generateDemoTasks());
  const [aiSuggestions, setAISuggestions] = useState<AITaskSuggestion[]>(demoAISuggestions);

  // Toggle VA card expansion
  const toggleVAExpansion = (vaId: string) => {
    setExpandedVAs(prev => ({
      ...prev,
      [vaId]: !prev[vaId]
    }));
  };

  // Filter tasks based on current filter
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        task.assignedToName.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    switch (taskFilter) {
      case 'due-today':
        filtered = filtered.filter(task => isToday(new Date(task.dueDate)));
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          task.status === 'overdue' || 
          (isPast(new Date(task.dueDate)) && !['completed'].includes(task.status))
        );
        break;
      case 'blocked':
        filtered = filtered.filter(task => task.status === 'blocked');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
      case 'this-week':
        filtered = filtered.filter(task => isThisWeek(new Date(task.dueDate)));
        break;
      // 'all' - no additional filtering
    }
    
    return filtered;
  };

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { 
            ...task, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt
          };
          return updatedTask;
        }
        return task;
      })
    );
    
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}`
    });
  };

  // Handle AI suggestion application
  const handleApplySuggestion = (suggestion: AITaskSuggestion) => {
    // Create a new task from the suggestion
    const newTask: VATask = {
      id: `task-${Date.now()}`,
      title: suggestion.taskTitle,
      description: suggestion.taskDescription,
      assignedTo: suggestion.vaId,
      assignedToName: vas.find(va => va.id === suggestion.vaId)?.name || '',
      assignedBy: "user-1", // Current user
      assignedByName: "John Smith", // Current user name
      status: 'assigned',
      priority: suggestion.priority,
      dueDate: suggestion.suggestedDueDate,
      createdAt: new Date().toISOString(),
      module: suggestion.module
    };
    
    // Add the new task
    setTasks(prev => [...prev, newTask]);
    
    // Mark the suggestion as applied
    setAISuggestions(prev => 
      prev.map(s => 
        s.id === suggestion.id 
          ? { ...s, isApplied: true }
          : s
      )
    );
    
    toast({
      title: "AI Suggestion Applied",
      description: `New task created for ${vas.find(va => va.id === suggestion.vaId)?.name || 'VA'}`
    });
  };

  // Handle dismissing a suggestion
  const handleDismissSuggestion = (suggestionId: string) => {
    setAISuggestions(prev => prev.filter(s => s.id !== suggestionId));
    
    toast({
      title: "Suggestion Dismissed",
      description: "AI suggestion has been dismissed"
    });
  };

  // Send daily summary
  const handleSendSummary = (method: 'email' | 'slack') => {
    toast({
      title: "Summary Sent",
      description: `Daily summary sent via ${method === 'email' ? 'email' : 'Slack'}`,
    });
  };

  return (
    <MainLayout>
      <Helmet>
        <title>VA Command Center | DMPHQ</title>
      </Helmet>
      
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Page heading */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">VA Command Center</h1>
            <p className="text-muted-foreground mt-1">
              Manage your virtual assistants and delegate tasks
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(val: 'admin' | 'va') => setViewMode(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin View</SelectItem>
                <SelectItem value="va">VA View</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Daily Summary
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSendSummary('email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSendSummary('slack')}>
                  <Slack className="h-4 w-4 mr-2" />
                  Send to Slack
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">All Tasks</TabsTrigger>
            <TabsTrigger value="vas">Virtual Assistants</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* VA Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Virtual Assistants</CardTitle>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Team
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {vas.map(va => (
                      <VACard 
                        key={va.id} 
                        va={va} 
                        tasks={tasks.filter(t => t.assignedTo === va.id)}
                        expanded={!!expandedVAs[va.id]}
                        onToggleExpand={toggleVAExpansion}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              {/* Task Summary Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <ClipboardList className="h-4 w-4 mr-1" />
                            Tasks Due Today
                          </div>
                          <div className="text-2xl font-bold">
                            {tasks.filter(task => isToday(new Date(task.dueDate))).length}
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Completed Today
                          </div>
                          <div className="text-2xl font-bold">
                            {tasks.filter(task => 
                              task.status === 'completed' && 
                              task.completedAt && 
                              isToday(new Date(task.completedAt))
                            ).length}
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <XCircle className="h-4 w-4 mr-1" />
                            Overdue Tasks
                          </div>
                          <div className="text-2xl font-bold">
                            {tasks.filter(task => 
                              task.status === 'overdue' || 
                              (isPast(new Date(task.dueDate)) && !['completed'].includes(task.status))
                            ).length}
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Briefcase className="h-4 w-4 mr-1" />
                            Total Active Tasks
                          </div>
                          <div className="text-2xl font-bold">
                            {tasks.filter(task => !['completed'].includes(task.status)).length}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">VA Activity</h4>
                        <div className="space-y-3">
                          {vas.map(va => {
                            const vaTaskCount = tasks.filter(t => t.assignedTo === va.id).length;
                            const vaCompletedCount = tasks.filter(t => 
                              t.assignedTo === va.id && 
                              t.status === 'completed'
                            ).length;
                            const completionRate = vaTaskCount > 0 
                              ? Math.round((vaCompletedCount / vaTaskCount) * 100) 
                              : 0;
                              
                            return (
                              <div key={va.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={va.avatar} alt={va.name} />
                                    <AvatarFallback>{va.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-sm font-medium">{va.name}</div>
                                    <div className="text-xs text-muted-foreground">{va.hoursThisWeek} hrs this week</div>
                                  </div>
                                </div>
                                <div className="text-sm">{completionRate}%</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Blocked Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks.filter(task => task.status === 'blocked').length > 0 ? (
                      <div className="space-y-3">
                        {tasks
                          .filter(task => task.status === 'blocked')
                          .map(task => (
                            <TaskCard key={task.id} task={task} onStatusChange={handleTaskStatusChange} />
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <XCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                        <p>No blocked tasks</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>All Tasks</CardTitle>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tasks..."
                        className="pl-9 w-full sm:w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select value={taskFilter} onValueChange={setTaskFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        <SelectItem value="due-today">Due Today</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Task
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getFilteredTasks().length > 0 ? (
                  <div className="space-y-4">
                    {getFilteredTasks().map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onStatusChange={handleTaskStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ClipboardList className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                    <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                    <p>
                      {searchQuery 
                        ? "Try adjusting your search query or filters" 
                        : "You don't have any tasks matching this filter"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* VAs Tab */}
          <TabsContent value="vas">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Virtual Assistant Team</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New VA
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vas.map(va => {
                    const vaTaskCount = tasks.filter(t => t.assignedTo === va.id).length;
                    const vaCompletedCount = tasks.filter(t => 
                      t.assignedTo === va.id && 
                      t.status === 'completed'
                    ).length;
                    const completionRate = vaTaskCount > 0 
                      ? Math.round((vaCompletedCount / vaTaskCount) * 100) 
                      : 0;
                      
                    return (
                      <Card key={va.id} className="overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/50 to-primary/30 h-12"></div>
                        <div className="-mt-6 px-6">
                          <div className="flex justify-between">
                            <Avatar className="h-12 w-12 border-2 border-background">
                              <AvatarImage src={va.avatar} alt={va.name} />
                              <AvatarFallback>{va.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <Badge variant="outline" className="bg-background mt-1">
                              ${va.hourlyRate}/hr
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader className="pt-2">
                          <CardTitle className="text-lg">{va.name}</CardTitle>
                          <CardDescription>{va.role}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-1">
                            {va.skills.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs font-normal">
                                {skill}
                              </Badge>
                            ))}
                            {va.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs font-normal">
                                +{va.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1 text-sm">
                              <span>Performance</span>
                              <Badge variant="outline" className="h-6 text-xs">{va.performanceRating} / 5</Badge>
                            </div>
                            <Progress 
                              value={va.performanceRating ? (va.performanceRating / 5) * 100 : 0} 
                              className="h-2" 
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="border rounded-md p-2">
                              <div className="text-xl font-semibold">{vaTaskCount}</div>
                              <div className="text-xs text-muted-foreground">Total Tasks</div>
                            </div>
                            <div className="border rounded-md p-2">
                              <div className="text-xl font-semibold">{completionRate}%</div>
                              <div className="text-xs text-muted-foreground">Completion Rate</div>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex gap-2">
                          <Button className="w-full" variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button className="w-full" size="sm">
                            Assign Task
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Task Assistant</CardTitle>
                    <CardDescription>
                      AI analyzes your business activity and suggests tasks that can be delegated to your VAs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 border rounded-md p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-medium mb-1">Daily Task Analysis</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Based on your recent business activities, our AI has identified several tasks 
                            that could be delegated to your virtual assistants to improve efficiency.
                          </p>
                          <div className="text-sm">
                            <strong>Business areas needing attention:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                              <li>Website maintenance (broken links detected)</li>
                              <li>Client onboarding materials need updating</li>
                              <li>Social media engagement is below target</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-3">Suggested Tasks</h3>
                    {aiSuggestions.filter(s => !s.isApplied).length > 0 ? (
                      aiSuggestions
                        .filter(s => !s.isApplied)
                        .map(suggestion => (
                          <SuggestionCard 
                            key={suggestion.id}
                            suggestion={suggestion}
                            onApply={handleApplySuggestion}
                            onDismiss={handleDismissSuggestion}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                        <p>No active suggestions at the moment</p>
                        <p className="text-sm">Check back later for new AI-generated task suggestions</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure AI
                    </Button>
                    <Button>
                      Generate New Suggestions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>VA Utilization</CardTitle>
                    <CardDescription>
                      Understand how effectively you're utilizing your VA team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <h4 className="text-sm font-medium">Overall Utilization</h4>
                        <span className="text-sm">73%</span>
                      </div>
                      <Progress value={73} className="h-2" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">VA Capacity</h4>
                      
                      {vas.map(va => {
                        // Calculate a utilization percentage based on hours worked vs expected
                        const utilization = Math.min(100, Math.round((va.hoursThisWeek / 40) * 100));
                        
                        return (
                          <div key={va.id}>
                            <div className="flex justify-between mb-1">
                              <div className="text-sm flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={va.avatar} alt={va.name} />
                                  <AvatarFallback>{va.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                {va.name}
                              </div>
                              <span className="text-sm">{utilization}%</span>
                            </div>
                            <Progress value={utilization} className="h-1.5" />
                          </div>
                        );
                      })}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Task Distribution by Module</h4>
                      <div className="space-y-2">
                        {['Operations', 'Marketing', 'Sales', 'Customer'].map(module => {
                          const count = tasks.filter(t => t.module === module).length;
                          const percentage = Math.round((count / tasks.length) * 100) || 0;
                          
                          return (
                            <div key={module}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{module}</span>
                                <span className="text-sm">{count} tasks ({percentage}%)</span>
                              </div>
                              <Progress value={percentage} className="h-1.5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-3">AI Recommendations</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <p>Redistribute marketing tasks more evenly across your VA team</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <p>Consider hiring a VA specialized in technical support based on current needs</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <p>Sarah has capacity for more work; consider delegating additional tasks</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}