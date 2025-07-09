import React, { useState } from 'react';
import {
  ArrowRight,
  BellRing,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  FolderClosed,
  Info,
  Layers,
  MessageSquare,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Ticket,
  Hourglass,
  ListFilter,
  ClipboardList,
  PanelLeft,
  Users,
  Mail,
  BarChart,
  AlertCircle,
  X,
  Briefcase,
  FileText,
  Edit
} from 'lucide-react';

import { PageTitle } from '@/components/PageTitle';
import PageSubtitle from '@/components/PageSubtitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useDemoMode } from '@/contexts/DemoModeContext';
import { useNotifications } from '@/contexts/NotificationsContext';

// VA Assistant status types
type VAAssistantStatus = 'active' | 'offline' | 'busy' | 'away';

// Task status types
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'review' | 'blocked';

// Task priority types
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// VA Assistant interface
interface VAAssistant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: VAAssistantStatus;
  availability: {
    days: string[];
    hours: string;
  };
  skills: string[];
  assignedTasks: number;
  completedTasks: number;
  efficiency: number;
  lastActive: string;
  hourlyRate: number;
  hoursThisWeek: number;
  timezone: string;
  email: string;
  phone?: string;
}

// Task interface
interface VATask {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  assignedToAvatar?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  dueDate: string;
  category: string;
  duration?: string;
  attachments?: number;
  comments?: number;
  businessEntityId?: number;
  businessEntityName?: string;
  progress?: number;
}

// Time entry interface
interface TimeEntry {
  id: string;
  assistantId: string;
  assistantName: string;
  taskId: string;
  taskTitle: string;
  startTime: string;
  endTime?: string;
  duration: number;
  billable: boolean;
  notes?: string;
  date: string;
  businessEntityId?: number;
}

// Mock data for VA assistants
const mockVAAssistants: VAAssistant[] = [
  {
    id: 'va1',
    name: 'Maria Johnson',
    avatar: '',
    role: 'Executive Assistant',
    status: 'active',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '9:00 AM - 5:00 PM EST'
    },
    skills: ['Administrative Support', 'Calendar Management', 'Email Management', 'Research', 'Document Preparation'],
    assignedTasks: 12,
    completedTasks: 186,
    efficiency: 95,
    lastActive: '2 minutes ago',
    hourlyRate: 25,
    hoursThisWeek: 18.5,
    timezone: 'EST (UTC-5)',
    email: 'maria@example.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 'va2',
    name: 'Alex Chen',
    avatar: '',
    role: 'Social Media Specialist',
    status: 'busy',
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: '10:00 AM - 6:00 PM PST'
    },
    skills: ['Content Creation', 'Graphic Design', 'Social Media Management', 'Analytics', 'Scheduling'],
    assignedTasks: 8,
    completedTasks: 94,
    efficiency: 92,
    lastActive: '14 minutes ago',
    hourlyRate: 28,
    hoursThisWeek: 12,
    timezone: 'PST (UTC-8)',
    email: 'alex@example.com'
  },
  {
    id: 'va3',
    name: 'Javier Rodriguez',
    avatar: '',
    role: 'Customer Support Specialist',
    status: 'active',
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '8:00 AM - 4:00 PM CST'
    },
    skills: ['Ticket Management', 'Client Communication', 'Technical Troubleshooting', 'CRM Systems', 'Documentation'],
    assignedTasks: 15,
    completedTasks: 212,
    efficiency: 89,
    lastActive: '35 minutes ago',
    hourlyRate: 22,
    hoursThisWeek: 24,
    timezone: 'CST (UTC-6)',
    email: 'javier@example.com'
  },
  {
    id: 'va4',
    name: 'Sarah Williams',
    avatar: '',
    role: 'Content Writer',
    status: 'offline',
    availability: {
      days: ['Tuesday', 'Wednesday', 'Thursday'],
      hours: '11:00 AM - 7:00 PM GMT'
    },
    skills: ['Blog Writing', 'Copywriting', 'SEO', 'Research', 'Editing'],
    assignedTasks: 5,
    completedTasks: 67,
    efficiency: 96,
    lastActive: '3 hours ago',
    hourlyRate: 30,
    hoursThisWeek: 15,
    timezone: 'GMT (UTC+0)',
    email: 'sarah@example.com'
  },
  {
    id: 'va5',
    name: 'Omar Patel',
    avatar: '',
    role: 'Bookkeeping Assistant',
    status: 'away',
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: '9:00 AM - 5:00 PM IST'
    },
    skills: ['QuickBooks', 'Excel', 'Reconciliation', 'Invoice Processing', 'Expense Reports'],
    assignedTasks: 7,
    completedTasks: 142,
    efficiency: 98,
    lastActive: '1 hour ago',
    hourlyRate: 27,
    hoursThisWeek: 16,
    timezone: 'IST (UTC+5:30)',
    email: 'omar@example.com',
    phone: '+91 98765 43210'
  }
];

// Mock data for VA tasks
const mockVATasks: VATask[] = [
  {
    id: 'task1',
    title: 'Schedule quarterly team meetings',
    description: 'Coordinate with all department heads to schedule the Q2 team meetings. Find suitable time slots and send calendar invites.',
    assignedTo: 'Maria Johnson',
    assignedToAvatar: '',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-03-20T14:30:00Z',
    dueDate: '2024-03-25T23:59:59Z',
    category: 'Administrative',
    duration: '3 hours',
    attachments: 2,
    comments: 5,
    businessEntityId: 1,
    businessEntityName: 'Digital Merch Pros',
    progress: 65
  },
  {
    id: 'task2',
    title: 'Create social media content calendar for April',
    description: 'Develop a comprehensive social media content calendar for all platforms including post ideas, images, and captions.',
    assignedTo: 'Alex Chen',
    assignedToAvatar: '',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-19T09:15:00Z',
    dueDate: '2024-03-28T23:59:59Z',
    category: 'Marketing',
    duration: '6 hours',
    attachments: 1,
    comments: 3,
    businessEntityId: 2,
    businessEntityName: 'Mystery Hype',
    progress: 0
  },
  {
    id: 'task3',
    title: 'Respond to pending customer support tickets',
    description: 'Address all outstanding customer support tickets in the queue. Prioritize those waiting the longest.',
    assignedTo: 'Javier Rodriguez',
    assignedToAvatar: '',
    status: 'in-progress',
    priority: 'urgent',
    createdAt: '2024-03-21T08:45:00Z',
    dueDate: '2024-03-22T17:00:00Z',
    category: 'Customer Support',
    duration: '4 hours',
    attachments: 0,
    comments: 12,
    businessEntityId: 1,
    businessEntityName: 'Digital Merch Pros',
    progress: 40
  },
  {
    id: 'task4',
    title: 'Write blog post on industry trends',
    description: 'Research and write a 1500-word blog post about emerging trends in the industry. Include statistics and quotes from experts.',
    assignedTo: 'Sarah Williams',
    assignedToAvatar: '',
    status: 'completed',
    priority: 'medium',
    createdAt: '2024-03-15T11:20:00Z',
    dueDate: '2024-03-20T23:59:59Z',
    category: 'Content',
    duration: '8 hours',
    attachments: 3,
    comments: 7,
    businessEntityId: 3,
    businessEntityName: 'Lone Star Custom Clothing',
    progress: 100
  },
  {
    id: 'task5',
    title: 'Reconcile February expense reports',
    description: 'Review and reconcile all expense reports from February. Flag any discrepancies and prepare a summary report.',
    assignedTo: 'Omar Patel',
    assignedToAvatar: '',
    status: 'review',
    priority: 'high',
    createdAt: '2024-03-18T13:00:00Z',
    dueDate: '2024-03-24T23:59:59Z',
    category: 'Finance',
    duration: '5 hours',
    attachments: 4,
    comments: 2,
    businessEntityId: 1,
    businessEntityName: 'Digital Merch Pros',
    progress: 95
  },
  {
    id: 'task6',
    title: 'Update client presentation deck',
    description: 'Update the presentation slides for next week\'s client meeting with the latest metrics and achievements.',
    assignedTo: 'Maria Johnson',
    assignedToAvatar: '',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-21T15:30:00Z',
    dueDate: '2024-03-27T12:00:00Z',
    category: 'Administrative',
    duration: '2 hours',
    businessEntityId: 2,
    businessEntityName: 'Mystery Hype',
    progress: 0
  },
  {
    id: 'task7',
    title: 'Research competitor pricing strategies',
    description: 'Conduct market research on competitors\' pricing strategies and prepare a comparative analysis report.',
    status: 'pending',
    priority: 'low',
    createdAt: '2024-03-20T10:15:00Z',
    dueDate: '2024-04-01T23:59:59Z',
    category: 'Research',
    businessEntityId: 4,
    businessEntityName: 'Alcoeaze',
    progress: 0
  }
];

// Mock data for time entries
const mockTimeEntries: TimeEntry[] = [
  {
    id: 'time1',
    assistantId: 'va1',
    assistantName: 'Maria Johnson',
    taskId: 'task1',
    taskTitle: 'Schedule quarterly team meetings',
    startTime: '2024-03-23T09:30:00Z',
    endTime: '2024-03-23T10:45:00Z',
    duration: 1.25,
    billable: true,
    notes: 'Contacted department heads and set up preliminary meeting times',
    date: '2024-03-23',
    businessEntityId: 1
  },
  {
    id: 'time2',
    assistantId: 'va2',
    assistantName: 'Alex Chen',
    taskId: 'task2',
    taskTitle: 'Create social media content calendar for April',
    startTime: '2024-03-22T14:00:00Z',
    endTime: '2024-03-22T16:30:00Z',
    duration: 2.5,
    billable: true,
    notes: 'Researched trending topics and created content strategy',
    date: '2024-03-22',
    businessEntityId: 2
  },
  {
    id: 'time3',
    assistantId: 'va3',
    assistantName: 'Javier Rodriguez',
    taskId: 'task3',
    taskTitle: 'Respond to pending customer support tickets',
    startTime: '2024-03-23T08:00:00Z',
    endTime: '2024-03-23T11:15:00Z',
    duration: 3.25,
    billable: true,
    notes: 'Resolved 15 high-priority tickets, escalated 3 complex issues',
    date: '2024-03-23',
    businessEntityId: 1
  },
  {
    id: 'time4',
    assistantId: 'va5',
    assistantName: 'Omar Patel',
    taskId: 'task5',
    taskTitle: 'Reconcile February expense reports',
    startTime: '2024-03-22T09:00:00Z',
    endTime: '2024-03-22T13:00:00Z',
    duration: 4,
    billable: true,
    notes: 'Completed reconciliation of all expense reports, identified 3 discrepancies',
    date: '2024-03-22',
    businessEntityId: 1
  },
  {
    id: 'time5',
    assistantId: 'va1',
    assistantName: 'Maria Johnson',
    taskId: 'task6',
    taskTitle: 'Update client presentation deck',
    startTime: '2024-03-23T13:00:00Z',
    endTime: '2024-03-23T14:30:00Z',
    duration: 1.5,
    billable: true,
    date: '2024-03-23',
    businessEntityId: 2
  }
];

export const VACommandCenter: React.FC = () => {
  const { demoMode } = useDemoMode();
  const { addNotification } = useNotifications();
  
  const [vaAssistants, setVAAssistants] = useState<VAAssistant[]>(demoMode ? mockVAAssistants : []);
  const [vaTasks, setVATasks] = useState<VATask[]>(demoMode ? mockVATasks : []);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(demoMode ? mockTimeEntries : []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<VAAssistant | null>(null);
  const [selectedTask, setSelectedTask] = useState<VATask | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assistantFilter, setAssistantFilter] = useState<string>('all');
  
  // New task form
  const [newTask, setNewTask] = useState<Partial<VATask>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    dueDate: '',
    category: 'Administrative'
  });

  // Calculate stats
  const pendingTasks = vaTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = vaTasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = vaTasks.filter(task => task.status === 'completed').length;
  const urgentTasks = vaTasks.filter(task => task.priority === 'urgent').length;
  
  const activeAssistants = vaAssistants.filter(va => va.status === 'active').length;
  const totalActiveHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalCost = vaAssistants.reduce((sum, va) => sum + (va.hourlyRate * va.hoursThisWeek), 0);

  // Filter tasks
  const filteredTasks = vaTasks.filter(task => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    // Assistant filter  
    const matchesAssistant = assistantFilter === 'all' || task.assignedTo === assistantFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssistant;
  });

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      addNotification({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        type: 'alert',
        priority: 'high',
        read: false,
        time: 'Just now',
        userId: 1
      });
      return;
    }
    
    const newTaskWithId: VATask = {
      ...newTask as VATask,
      id: `task${vaTasks.length + 1}`,
      createdAt: new Date().toISOString(),
      progress: 0
    };
    
    setVATasks([...vaTasks, newTaskWithId]);
    setIsNewTaskDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      dueDate: '',
      category: 'Administrative'
    });
    
    addNotification({
      title: 'Task Created',
      description: 'New task has been successfully created.',
      type: 'message',
      read: false,
      time: 'Just now',
      userId: 1
    });
  };

  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setVATasks(vaTasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            progress: newStatus === 'completed' ? 100 : (newStatus === 'pending' ? 0 : task.progress)
          } 
        : task
    ));
    
    addNotification({
      title: 'Task Updated',
      description: `Task status changed to ${newStatus}`,
      type: 'update',
      read: false,
      time: 'Just now',
      userId: 1
    });
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-slate-100">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'review':
        return <Badge className="bg-amber-100 text-amber-800">In Review</Badge>;
      case 'blocked':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Helper function to get priority badge color
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-slate-100">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Urgent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  // Helper function to get VA status badge color
  const getVAStatusBadge = (status: VAAssistantStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'busy':
        return <Badge className="bg-amber-100 text-amber-800">Busy</Badge>;
      case 'away':
        return <Badge variant="outline" className="bg-slate-100">Away</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-slate-100 text-slate-600">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get VA's assigned tasks
  const getVATaskCount = (vaId: string) => {
    return vaTasks.filter(task => vaAssistants.find(va => va.id === vaId)?.name === task.assignedTo).length;
  };

  return (
    <div className="container p-4 mx-auto space-y-6">
      <PageTitle 
        title="VA Command Center" 
        subtitle="Manage your virtual assistants, assign tasks, and track productivity"
        icon={<Users className="w-5 h-5" />}
        action={
          <div className="flex space-x-2">
            <Button 
              onClick={() => setIsNewTaskDialogOpen(true)}
              className="hidden md:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsNewTaskDialogOpen(true)}
              className="md:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[500px] w-full">
          <TabsTrigger value="dashboard">
            <BarChart className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="assistants">
            <Users className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Assistants
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ClipboardList className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="timesheet">
            <Hourglass className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Timesheet
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <PageSubtitle title="Command Dashboard" description="Overview of your virtual assistant operations" />
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Assistants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{activeAssistants} / {vaAssistants.length}</div>
                  <Users className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasks In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{inProgressTasks} / {vaTasks.length}</div>
                  <Play className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Hours (Week)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalActiveHours.toFixed(1)}</div>
                  <Clock className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                  <Settings className="h-8 w-8 text-primary opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Task Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tasks Overview</CardTitle>
                <CardDescription>Current task distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 mr-2 rounded-full bg-slate-400"></div>
                        <span>Pending</span>
                      </div>
                      <div>{pendingTasks} / {vaTasks.length}</div>
                    </div>
                    <Progress value={(pendingTasks / vaTasks.length) * 100} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 mr-2 rounded-full bg-blue-500"></div>
                        <span>In Progress</span>
                      </div>
                      <div>{inProgressTasks} / {vaTasks.length}</div>
                    </div>
                    <Progress value={(inProgressTasks / vaTasks.length) * 100} className="bg-slate-200">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(inProgressTasks / vaTasks.length) * 100}%` }}></div>
                    </Progress>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 mr-2 rounded-full bg-green-500"></div>
                        <span>Completed</span>
                      </div>
                      <div>{completedTasks} / {vaTasks.length}</div>
                    </div>
                    <Progress value={(completedTasks / vaTasks.length) * 100} className="bg-slate-200">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(completedTasks / vaTasks.length) * 100}%` }}></div>
                    </Progress>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 mr-2 rounded-full bg-red-500"></div>
                        <span>Urgent</span>
                      </div>
                      <div>{urgentTasks} / {vaTasks.length}</div>
                    </div>
                    <Progress value={(urgentTasks / vaTasks.length) * 100} className="bg-slate-200">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${(urgentTasks / vaTasks.length) * 100}%` }}></div>
                    </Progress>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assistant Availability</CardTitle>
                <CardDescription>VA status & availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaAssistants.slice(0, 5).map((assistant) => (
                    <div key={assistant.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assistant.avatar} alt={assistant.name} />
                          <AvatarFallback>{assistant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{assistant.name}</p>
                          <p className="text-xs text-muted-foreground">{assistant.role}</p>
                        </div>
                      </div>
                      {getVAStatusBadge(assistant.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full" onClick={() => setActiveTab('assistants')}>
                  View All Assistants
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Tasks and Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Latest tasks added to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaTasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="flex items-center space-x-4">
                      <div className="min-w-10 flex items-center justify-center">
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : task.priority === 'urgent' ? (
                          <AlertCircle className="h-6 w-6 text-red-500" />
                        ) : (
                          <Ticket className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {task.assignedTo ? (
                            <span className="mr-2">Assigned to: {task.assignedTo}</span>
                          ) : (
                            <span className="mr-2">Unassigned</span>
                          )}
                          <span>Due: {formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full" onClick={() => setActiveTab('tasks')}>
                  View All Tasks
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent activity in your VA Command Center</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-[1px] before:bg-border">
                  <div className="relative">
                    <div className="absolute left-[-23px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Task Completed</p>
                      <p className="text-xs text-muted-foreground">Sarah Williams completed "Write blog post on industry trends"</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[-23px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Time Tracked</p>
                      <p className="text-xs text-muted-foreground">Javier Rodriguez tracked 3.25 hours for "Respond to pending customer support tickets"</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[-23px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Task Assigned</p>
                      <p className="text-xs text-muted-foreground">Maria Johnson was assigned "Update client presentation deck"</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[-23px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Status Change</p>
                      <p className="text-xs text-muted-foreground">Omar Patel moved "Reconcile February expense reports" to Review</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assistants Tab */}
        <TabsContent value="assistants" className="space-y-6">
          <PageSubtitle title="Virtual Assistants" description="Manage your team of virtual assistants" />
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assistants..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Assistant
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaAssistants.map((assistant) => (
              <Card key={assistant.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={assistant.avatar} alt={assistant.name} />
                        <AvatarFallback>{assistant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{assistant.name}</CardTitle>
                        <CardDescription>{assistant.role}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedAssistant(assistant)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>Assign Task</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-2">
                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                    <div className="flex items-center">
                      <BellRing className="h-4 w-4 mr-2 text-muted-foreground" />
                      Status:
                    </div>
                    <div>{getVAStatusBadge(assistant.status)}</div>
                    
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      Availability:
                    </div>
                    <div>{assistant.availability.days.length} days/week</div>
                    
                    <div className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-muted-foreground" />
                      Tasks:
                    </div>
                    <div>{getVATaskCount(assistant.id)} assigned</div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Hours:
                    </div>
                    <div>{assistant.hoursThisWeek} this week</div>
                  </div>
                  
                  <div className="space-y-1 mt-3">
                    <div className="text-xs flex justify-between">
                      <span>Efficiency</span>
                      <span>{assistant.efficiency}%</span>
                    </div>
                    <Progress value={assistant.efficiency} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Contact
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <FolderClosed className="h-3.5 w-3.5 mr-1" />
                    View Tasks
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* VA Detail Dialog */}
          {selectedAssistant && (
            <Dialog open={!!selectedAssistant} onOpenChange={(open) => !open && setSelectedAssistant(null)}>
              <DialogContent className="max-w-3xl max-h-screen overflow-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={selectedAssistant.avatar} alt={selectedAssistant.name} />
                      <AvatarFallback>{selectedAssistant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {selectedAssistant.name}
                    <div className="ml-4">
                      {getVAStatusBadge(selectedAssistant.status)}
                    </div>
                  </DialogTitle>
                  <DialogDescription className="text-left">{selectedAssistant.role}</DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Email:</span>
                        <span className="col-span-2">{selectedAssistant.email}</span>
                      </div>
                      {selectedAssistant.phone && (
                        <div className="grid grid-cols-3 gap-2">
                          <span className="font-medium">Phone:</span>
                          <span className="col-span-2">{selectedAssistant.phone}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Timezone:</span>
                        <span className="col-span-2">{selectedAssistant.timezone}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6 mb-2">Availability</h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Days:</span>
                        <span className="col-span-2">{selectedAssistant.availability.days.join(', ')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium">Hours:</span>
                        <span className="col-span-2">{selectedAssistant.availability.hours}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAssistant.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Performance</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Efficiency</span>
                          <span>{selectedAssistant.efficiency}%</span>
                        </div>
                        <Progress value={selectedAssistant.efficiency} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-2xl font-bold">{selectedAssistant.completedTasks}</div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-sm font-medium">Active Hours</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-2xl font-bold">{selectedAssistant.hoursThisWeek}</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader className="p-3 pb-1">
                          <CardTitle className="text-sm font-medium">Current Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="space-y-2 text-sm">
                            {vaTasks
                              .filter(task => task.assignedTo === selectedAssistant.name)
                              .map(task => (
                                <div key={task.id} className="flex justify-between items-center">
                                  <div className="truncate flex-1">{task.title}</div>
                                  {getStatusBadge(task.status)}
                                </div>
                              ))}
                            {vaTasks.filter(task => task.assignedTo === selectedAssistant.name).length === 0 && (
                              <div className="text-muted-foreground">No tasks currently assigned</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-6 gap-2 flex-row sm:justify-between">
                  <Button variant="outline" onClick={() => setSelectedAssistant(null)}>
                    Close
                  </Button>
                  <div className="flex gap-2">
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="default">
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Task
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <PageSubtitle title="Task Management" description="Manage and track tasks assigned to your virtual assistants" />
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <ListFilter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={assistantFilter} onValueChange={setAssistantFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Assistant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assistants</SelectItem>
                  {vaAssistants.map(assistant => (
                    <SelectItem key={assistant.id} value={assistant.name}>{assistant.name}</SelectItem>
                  ))}
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => setIsNewTaskDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                  <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{task.title}</span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {getStatusBadge(task.status)} {getPriorityBadge(task.priority)}
                        </span>
                        <span className="text-xs text-muted-foreground md:hidden mt-1">
                          {task.assignedTo || 'Unassigned'} | Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getStatusBadge(task.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getPriorityBadge(task.priority)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {task.assignedTo ? (
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={task.assignedToAvatar} alt={task.assignedTo} />
                            <AvatarFallback>{task.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{task.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(task.dueDate)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center">
                        <Progress value={task.progress} className="h-2 w-full max-w-24" />
                        <span className="ml-2 text-xs">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem 
                            disabled={task.status === 'pending'} 
                            onClick={() => handleTaskStatusChange(task.id, 'pending')}
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            disabled={task.status === 'in-progress'} 
                            onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                          >
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            disabled={task.status === 'review'} 
                            onClick={() => handleTaskStatusChange(task.id, 'review')}
                          >
                            Move to Review
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            disabled={task.status === 'completed'} 
                            onClick={() => handleTaskStatusChange(task.id, 'completed')}
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Info className="h-10 w-10 mb-2" />
                        <p>No tasks found matching your filters.</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setPriorityFilter('all');
                            setAssistantFilter('all');
                          }}
                        >
                          Clear all filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* New Task Dialog */}
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to assign to your virtual assistants.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Enter detailed task description"
                    rows={3}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(value: TaskPriority) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="task-category">Category</Label>
                    <Select 
                      value={newTask.category} 
                      onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Customer Support">Customer Support</SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-assignee">Assign To</Label>
                    <Select 
                      onValueChange={(value) => {
                        const assistant = vaAssistants.find(va => va.name === value);
                        setNewTask({ 
                          ...newTask, 
                          assignedTo: value,
                          assignedToAvatar: assistant?.avatar
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select VA" />
                      </SelectTrigger>
                      <SelectContent>
                        {vaAssistants.map(assistant => (
                          <SelectItem key={assistant.id} value={assistant.name}>{assistant.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="task-duedate">Due Date</Label>
                    <Input
                      id="task-duedate"
                      type="date"
                      value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          const date = new Date(e.target.value);
                          date.setHours(23, 59, 59);
                          setNewTask({ ...newTask, dueDate: date.toISOString() });
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="task-billable" />
                    <Label htmlFor="task-billable">Billable Task</Label>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Task Detail Dialog */}
          {selectedTask && (
            <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
              <DialogContent className="max-w-3xl max-h-screen overflow-auto">
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-xl mr-4">{selectedTask.title}</DialogTitle>
                    <div className="flex space-x-2">
                      {getStatusBadge(selectedTask.status)}
                      {getPriorityBadge(selectedTask.priority)}
                    </div>
                  </div>
                  <DialogDescription className="text-left">
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs">Due: {formatDate(selectedTask.dueDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Layers className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-xs">Category: {selectedTask.category}</span>
                      </div>
                      {selectedTask.businessEntityName && (
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs">Entity: {selectedTask.businessEntityName}</span>
                        </div>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="md:col-span-2 space-y-6">
                    {selectedTask.description && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <div className="text-sm p-4 bg-muted rounded-md">
                          {selectedTask.description}
                        </div>
                      </div>
                    )}
                    
                    {selectedTask.progress !== undefined && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Progress</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion</span>
                            <span>{selectedTask.progress}%</span>
                          </div>
                          <Progress value={selectedTask.progress} />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Comments</h3>
                      {selectedTask.comments ? (
                        <div className="space-y-4">
                          <div className="flex space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>MJ</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted p-3 rounded-md">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium text-sm">Maria Johnson</span>
                                  <span className="text-xs text-muted-foreground">2 days ago</span>
                                </div>
                                <p className="text-sm">I've started working on this task. Will update once the first draft is complete.</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>YS</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted p-3 rounded-md">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium text-sm">You</span>
                                  <span className="text-xs text-muted-foreground">1 day ago</span>
                                </div>
                                <p className="text-sm">Great! Could you also make sure to coordinate with the marketing team on this?</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>MJ</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted p-3 rounded-md">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium text-sm">Maria Johnson</span>
                                  <span className="text-xs text-muted-foreground">1 day ago</span>
                                </div>
                                <p className="text-sm">Yes, I've already reached out to Alex from marketing. We'll be meeting tomorrow.</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Add comment form */}
                          <div className="flex space-x-3 mt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>YS</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                              <div className="flex justify-end mt-2">
                                <Button size="sm">
                                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                  Add Comment
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">No comments yet</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Assignment</h3>
                      {selectedTask.assignedTo ? (
                        <div className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedTask.assignedToAvatar} alt={selectedTask.assignedTo} />
                            <AvatarFallback>{selectedTask.assignedTo.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedTask.assignedTo}</p>
                            <p className="text-xs text-muted-foreground">
                              {vaAssistants.find(va => va.name === selectedTask.assignedTo)?.role || ''}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <span className="text-muted-foreground">Unassigned</span>
                          <Button size="sm" variant="outline">Assign</Button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Time Tracking</h3>
                      <div className="space-y-2">
                        {timeEntries.filter(entry => entry.taskId === selectedTask.id).length > 0 ? (
                          <div>
                            <div className="bg-muted p-3 rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">Total Time</span>
                                <span className="font-medium">
                                  {timeEntries
                                    .filter(entry => entry.taskId === selectedTask.id)
                                    .reduce((sum, entry) => sum + entry.duration, 0)
                                    .toFixed(2)} hours
                                </span>
                              </div>
                              <ScrollArea className="h-[120px]">
                                <div className="space-y-2 mt-2">
                                  {timeEntries
                                    .filter(entry => entry.taskId === selectedTask.id)
                                    .map((entry) => (
                                      <div key={entry.id} className="text-xs py-2 flex justify-between border-b border-border last:border-b-0">
                                        <div>
                                          <p>{entry.assistantName}</p>
                                          <p className="text-muted-foreground">{formatDate(entry.date)}</p>
                                          {entry.notes && <p className="text-muted-foreground mt-1">{entry.notes}</p>}
                                        </div>
                                        <div className="text-right">
                                          <p>{entry.duration.toFixed(2)} hours</p>
                                          <p className="text-muted-foreground">{entry.billable ? 'Billable' : 'Non-billable'}</p>
                                        </div>
                                      </div>
                                    ))
                                  }
                                </div>
                              </ScrollArea>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Add Time Entry
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <Clock className="h-6 w-6 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">No time entries yet</p>
                            <Button size="sm">
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Add Time Entry
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Attachments</h3>
                      {selectedTask.attachments ? (
                        <div className="bg-muted p-3 rounded-md space-y-2">
                          <div className="flex items-center justify-between p-2 bg-background rounded">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="text-sm">briefing-document.pdf</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-background rounded">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-sm">requirements.xlsx</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Attachment
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                          <FileText className="h-6 w-6 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">No attachments</p>
                          <Button size="sm">
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Attachment
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-6 gap-2 sm:space-x-2">
                  <div className="flex items-center space-x-2 mr-auto">
                    <Label htmlFor="task-status-update" className="text-sm">Status:</Label>
                    <Select 
                      value={selectedTask.status}
                      onValueChange={(value: TaskStatus) => handleTaskStatusChange(selectedTask.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" onClick={() => setSelectedTask(null)}>
                    Close
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* Timesheet Tab */}
        <TabsContent value="timesheet" className="space-y-6">
          <PageSubtitle title="Time Tracking" description="Track and manage hours worked by your virtual assistants" />
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search time entries..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Assistant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assistants</SelectItem>
                  {vaAssistants.map(assistant => (
                    <SelectItem key={assistant.id} value={assistant.id}>{assistant.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Time Entry
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assistant</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="hidden lg:table-cell">Billable</TableHead>
                  <TableHead className="hidden lg:table-cell">Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{entry.assistantName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.assistantName}</span>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {formatDate(entry.date)} | {entry.duration.toFixed(2)} hrs
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-1">{entry.taskTitle}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(entry.date)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {entry.duration.toFixed(2)} hours
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {entry.billable ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Billable
                        </Badge>
                      ) : (
                        <Badge variant="outline">Non-billable</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px]">
                      {entry.notes ? (
                        <span className="text-sm line-clamp-1">{entry.notes}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                          <DropdownMenuItem>View Task</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete Entry</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {timeEntries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Hourglass className="h-10 w-10 mb-2" />
                        <p>No time entries found.</p>
                        <Button variant="link">Add your first time entry</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-medium mb-1">Time Summary</h3>
                <div className="text-sm text-muted-foreground">Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Total Hours</div>
                  <div className="text-2xl font-bold">{totalActiveHours.toFixed(1)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Billable Hours</div>
                  <div className="text-2xl font-bold">
                    {timeEntries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.duration, 0).toFixed(1)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                  <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VACommandCenter;