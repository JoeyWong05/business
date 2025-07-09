import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  CheckCircle2, 
  Clock, 
  ClipboardList, 
  CalendarDays, 
  Users, 
  Tag, 
  Filter,
  Search,
  Plus,
  ExternalLink,
  ArrowUpRight,
  Briefcase,
  ListTodo,
  SquarePen,
  AlarmClock,
  Goal,
  BarChart3,
  ArrowRight,
  Box,
  Calendar,
  MessageSquare,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Menu,
  MoveHorizontal,
  Sparkles,
  X,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDemoMode } from "@/contexts/DemoModeContext";
import MainLayout from "@/components/MainLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import SortableTask from "../components/SortableTask";
import { TaskPriority, TaskStatus, Task, Project, ProjectStatus } from "@/types/project-types";

// Demo data for projects
const demoProjects: Project[] = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Complete overhaul of client website with new branding",
    status: "active",
    createdAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    progress: 65,
    teamMembers: [
      { id: "1", name: "Alex Johnson", avatar: "/assets/avatars/avatar-1.jpg" },
      { id: "2", name: "Maria Garcia", avatar: "/assets/avatars/avatar-2.jpg" }
    ],
    tags: ["design", "development", "branding"],
    businessEntityId: "1",
    businessEntityName: "Digital Merch Pros"
  },
  {
    id: "project-2",
    name: "Product Launch Campaign",
    description: "Marketing campaign for new product line",
    status: "active",
    createdAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    progress: 40,
    teamMembers: [
      { id: "1", name: "Alex Johnson", avatar: "/assets/avatars/avatar-1.jpg" },
      { id: "3", name: "James Wilson", avatar: "/assets/avatars/avatar-3.jpg" }
    ],
    tags: ["marketing", "social media", "advertising"],
    businessEntityId: "1",
    businessEntityName: "Digital Merch Pros"
  },
  {
    id: "project-3",
    name: "Inventory Management System",
    description: "Custom inventory tracking solution",
    status: "active",
    createdAt: new Date().toISOString(),
    startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 75)).toISOString(),
    progress: 0,
    teamMembers: [
      { id: "4", name: "David Kim", avatar: "/assets/avatars/avatar-4.jpg" }
    ],
    tags: ["development", "backend", "database"],
    businessEntityId: "3",
    businessEntityName: "Lone Star Custom Clothing"
  }
];

// Demo data for tasks
const demoTasks: Task[] = [
  {
    id: "task-1",
    title: "Create wireframes",
    description: "Design wireframes for the homepage, about page, and product pages.",
    status: "done",
    priority: "high",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    assigneeId: "1",
    assigneeName: "Alex Johnson",
    assigneeAvatar: "/assets/avatars/avatar-1.jpg",
    projectId: "project-1",
    relatedModule: "design",
    tags: ["wireframing", "ux"]
  },
  {
    id: "task-2",
    title: "Design homepage mockup",
    description: "Create high-fidelity design mockup for the homepage based on approved wireframes.",
    status: "done",
    priority: "high",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    assigneeId: "2",
    assigneeName: "Maria Garcia",
    assigneeAvatar: "/assets/avatars/avatar-2.jpg",
    projectId: "project-1",
    relatedModule: "design",
    tags: ["design", "ui"]
  },
  {
    id: "task-3",
    title: "Front-end development",
    description: "Implement the front-end using React based on the approved design mockups.",
    status: "in-progress",
    priority: "high",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    assigneeId: "1",
    assigneeName: "Alex Johnson",
    assigneeAvatar: "/assets/avatars/avatar-1.jpg",
    projectId: "project-1",
    relatedModule: "development",
    tags: ["react", "frontend"]
  },
  {
    id: "task-4",
    title: "Content migration",
    description: "Migrate content from the old website to the new one.",
    status: "todo",
    priority: "medium",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    projectId: "project-1",
    relatedModule: "content",
    tags: ["migration", "content"]
  },
  {
    id: "task-5",
    title: "Create marketing plan",
    description: "Develop a comprehensive marketing plan for the product launch.",
    status: "done",
    priority: "high",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    assigneeId: "3",
    assigneeName: "James Wilson",
    assigneeAvatar: "/assets/avatars/avatar-3.jpg",
    projectId: "project-2",
    relatedModule: "marketing",
    tags: ["planning", "strategy"]
  },
  {
    id: "task-6",
    title: "Design social media assets",
    description: "Create social media graphics for Facebook, Instagram, and Twitter.",
    status: "in-progress",
    priority: "high",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    assigneeId: "2",
    assigneeName: "Maria Garcia",
    assigneeAvatar: "/assets/avatars/avatar-2.jpg",
    projectId: "project-2",
    relatedModule: "design",
    tags: ["social media", "design"]
  },
  {
    id: "task-7",
    title: "Plan launch event",
    description: "Organize virtual product launch event including scheduling, invitations, and platform selection.",
    status: "todo",
    priority: "medium",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
    assigneeId: "3",
    assigneeName: "James Wilson",
    assigneeAvatar: "/assets/avatars/avatar-3.jpg",
    projectId: "project-2",
    relatedModule: "events",
    tags: ["event", "planning"]
  }
];

// Team members for demo/selection purposes
const demoTeamMembers = [
  { id: "1", name: "Alex Johnson", avatar: "/assets/avatars/avatar-1.jpg" },
  { id: "2", name: "Maria Garcia", avatar: "/assets/avatars/avatar-2.jpg" },
  { id: "3", name: "James Wilson", avatar: "/assets/avatars/avatar-3.jpg" },
  { id: "4", name: "David Kim", avatar: "/assets/avatars/avatar-4.jpg" },
  { id: "5", name: "Sarah Chen", avatar: "/assets/avatars/avatar-5.jpg" },
  { id: "6", name: "Emily Davis", avatar: "/assets/avatars/avatar-6.jpg" }
];

// Available modules/departments for task assignment
const moduleOptions = [
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "marketing", label: "Marketing" },
  { value: "content", label: "Content" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "events", label: "Events" }
];

// Helper to generate AI tasks from a plain text input
const generateAITasks = async (input: string): Promise<Task[]> => {
  // Here would be a call to an AI API (like OpenAI) to generate tasks
  // For demo purposes, we'll just create some sample tasks based on keywords
  
  const keywords = [
    { trigger: "website", tasks: ["Design homepage wireframe", "Develop responsive layout", "Create navigation menu", "Write website copy", "Test website on all devices"] },
    { trigger: "marketing", tasks: ["Create marketing plan", "Design social media graphics", "Write email campaign", "Set up analytics tracking", "Plan launch event"] },
    { trigger: "product", tasks: ["Research market needs", "Create product mockups", "Test with focus group", "Define pricing strategy", "Prepare sales materials"] },
    { trigger: "launch", tasks: ["Create launch timeline", "Prepare press release", "Schedule social announcements", "Coordinate with sales team", "Plan launch day activities"] },
    { trigger: "research", tasks: ["Define research questions", "Create survey or interview guide", "Recruit participants", "Analyze findings", "Present results"] }
  ];
  
  let generatedTasks: Task[] = [];
  const lowerInput = input.toLowerCase();
  
  // Find matching keywords and generate tasks
  keywords.forEach(keyword => {
    if (lowerInput.includes(keyword.trigger)) {
      keyword.tasks.forEach((taskTitle, index) => {
        generatedTasks.push({
          id: `ai-task-${Date.now()}-${index}`,
          title: taskTitle,
          description: `AI-generated task related to ${keyword.trigger}`,
          status: "todo",
          priority: index === 0 ? "high" : index < 3 ? "medium" : "low",
          createdAt: new Date().toISOString(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7 + index)).toISOString(),
          projectId: "",  // To be assigned
          relatedModule: keyword.trigger === "marketing" ? "marketing" : 
                        keyword.trigger === "website" ? "development" :
                        keyword.trigger === "research" ? "operations" : "general",
        });
      });
    }
  });
  
  // If no matches, create generic tasks
  if (generatedTasks.length === 0) {
    generatedTasks = [
      {
        id: `ai-task-${Date.now()}-1`,
        title: "Research project requirements",
        description: `Initial research phase for "${input}"`,
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        projectId: "",
        relatedModule: "operations",
      },
      {
        id: `ai-task-${Date.now()}-2`,
        title: "Define project scope",
        description: `Define the scope and requirements for "${input}"`,
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        projectId: "",
        relatedModule: "operations",
      },
      {
        id: `ai-task-${Date.now()}-3`,
        title: "Create project timeline",
        description: `Develop a timeline for "${input}" project execution`,
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        projectId: "",
        relatedModule: "operations",
      }
    ];
  }
  
  return generatedTasks;
};

const EnhancedProjectManagement = () => {
  const { demoMode } = useDemoMode();
  
  // State for filtering and viewing
  const [activeTab, setActiveTab] = useState<string>("board");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  
  // State for task creation
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: new Date().toISOString(),
    projectId: "",
    relatedModule: "",
  });
  
  // State for project creation
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    status: "active",
    startDate: new Date().toISOString(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    teamMembers: [],
    tags: [],
  });
  
  // State for task editing
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  // State for AI task generation
  const [isAITaskOpen, setIsAITaskOpen] = useState(false);
  const [aiTaskInput, setAITaskInput] = useState("");
  const [aiGeneratedTasks, setAIGeneratedTasks] = useState<Task[]>([]);
  const [selectedAITasks, setSelectedAITasks] = useState<string[]>([]);
  const [aiSelectedProject, setAISelectedProject] = useState("");
  
  // State for tasks data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Query data from API or use demo data
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (demoMode) {
        return demoProjects;
      }
      const response = await apiRequest('GET', '/api/projects');
      return await response.json();
    },
  });
  
  const { data: tasksData, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (demoMode) {
        return demoTasks;
      }
      const response = await apiRequest('GET', '/api/tasks');
      return await response.json();
    },
  });
  
  // Update local state when query data changes
  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
      if (!selectedProject && projectsData.length > 0) {
        setSelectedProject(projectsData[0].id);
      }
    }
  }, [projectsData]);
  
  useEffect(() => {
    if (tasksData) {
      setTasks(tasksData);
    }
  }, [tasksData]);
  
  // Filter tasks based on search, project, priority, module, and tags
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      : true;
    
    const matchesProject = selectedProject === "all" || selectedProject === "" || task.projectId === selectedProject;
    
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    const matchesModule = moduleFilter === "all" || task.relatedModule === moduleFilter;
    
    const matchesTags = selectedTags.length === 0 || 
      (task.tags && selectedTags.every(tag => task.tags?.includes(tag)));
    
    return matchesSearch && matchesProject && matchesPriority && matchesModule && matchesTags;
  });
  
  // Group tasks by status for Kanban board
  const todoTasks = filteredTasks.filter(task => task.status === "todo");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const doneTasks = filteredTasks.filter(task => task.status === "done");
  
  // Get unique tags from all tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags || [])));
  
  // Format date string to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days left until due date
  const getDaysLeft = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get appropriate priority badge
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">High</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Task card component
  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <Card className="mb-3">
        <CardHeader className="p-3 pb-0">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-sm font-medium line-clamp-2">{task.title}</CardTitle>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => handleEditTask(task)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-2">
            {getPriorityBadge(task.priority)}
            {task.relatedModule && (
              <Badge variant="outline" className="text-xs">{task.relatedModule}</Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <span className={cn(
                getDaysLeft(task.dueDate) < 0 ? "text-red-500" :
                getDaysLeft(task.dueDate) <= 3 ? "text-amber-500" : ""
              )}>
                {formatDate(task.dueDate)}
              </span>
            </div>
            
            {task.assigneeName && (
              <div className="flex items-center gap-1">
                <span>{task.assigneeName}</span>
                {task.assigneeAvatar && (
                  <div className="h-5 w-5 rounded-full overflow-hidden">
                    <img 
                      src={task.assigneeAvatar} 
                      alt={task.assigneeName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Handle drag end for kanban board
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // If the task is dropped in a different column, update its status
    if (active.id !== over.id && over.id.toString().startsWith('column-')) {
      const taskId = active.id.toString();
      const newStatus = over.id.toString().replace('column-', '') as TaskStatus;
      
      // Update the task status in the state
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      
      // In a real app, you would also send an API request to update the task
      if (!demoMode) {
        // apiRequest('PATCH', `/api/tasks/${taskId}`, { status: newStatus });
        toast({
          title: "Task Updated",
          description: `Task "${tasks.find(t => t.id === taskId)?.title}" moved to ${newStatus.replace('-', ' ')}`,
        });
      }
    }
  };
  
  // Handle create task
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.projectId) {
      toast({
        title: "Invalid Task",
        description: "Please provide a title and select a project",
        variant: "destructive",
      });
      return;
    }
    
    const taskId = `task-${Date.now()}`;
    const task: Task = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as TaskStatus,
      priority: newTask.priority as TaskPriority,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || new Date().toISOString(),
      projectId: newTask.projectId,
      assigneeId: newTask.assigneeId,
      assigneeName: newTask.assigneeId ? demoTeamMembers.find(m => m.id === newTask.assigneeId)?.name : undefined,
      assigneeAvatar: newTask.assigneeId ? demoTeamMembers.find(m => m.id === newTask.assigneeId)?.avatar : undefined,
      relatedModule: newTask.relatedModule,
      tags: newTask.tags,
    };
    
    setTasks([...tasks, task]);
    setIsCreateTaskOpen(false);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: new Date().toISOString(),
      projectId: selectedProject,
      relatedModule: "",
    });
    
    // In a real app, you would also send an API request to create the task
    if (!demoMode) {
      // apiRequest('POST', '/api/tasks', task);
      toast({
        title: "Task Created",
        description: `Task "${task.title}" has been created`,
      });
    }
  };
  
  // Handle edit task
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsEditTaskOpen(true);
  };
  
  // Handle save edited task
  const handleSaveEditedTask = () => {
    if (!taskToEdit) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskToEdit.id) {
        return taskToEdit;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setIsEditTaskOpen(false);
    setTaskToEdit(null);
    
    // In a real app, you would also send an API request to update the task
    if (!demoMode) {
      // apiRequest('PATCH', `/api/tasks/${taskToEdit.id}`, taskToEdit);
      toast({
        title: "Task Updated",
        description: `Task "${taskToEdit.title}" has been updated`,
      });
    }
  };
  
  // Handle task status change
  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus as TaskStatus } 
        : task
    );
    setTasks(updatedTasks);
    
    if (!demoMode) {
      // In a real app, you would also send an API request to update the task
      // apiRequest('PATCH', `/api/tasks/${taskId}`, { status: newStatus });
      toast({
        title: "Task Updated",
        description: `Task status changed to ${newStatus.replace('-', ' ')}`,
      });
    }
  };

  // Handle task priority change
  const handleTaskPriorityChange = (taskId: string, newPriority: TaskPriority) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, priority: newPriority } 
        : task
    );
    setTasks(updatedTasks);
    
    if (!demoMode) {
      // In a real app, you would also send an API request to update the task
      // apiRequest('PATCH', `/api/tasks/${taskId}`, { priority: newPriority });
      toast({
        title: "Task Updated",
        description: `Task priority changed to ${newPriority}`,
      });
    }
  };

  // Handle delete task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    // In a real app, you would also send an API request to delete the task
    if (!demoMode) {
      // apiRequest('DELETE', `/api/tasks/${taskId}`);
      toast({
        title: "Task Deleted",
        description: `Task has been deleted`,
      });
    }
  };
  
  // Handle create project
  const handleCreateProject = () => {
    if (!newProject.name) {
      toast({
        title: "Invalid Project",
        description: "Please provide a project name",
        variant: "destructive",
      });
      return;
    }
    
    const projectId = `project-${Date.now()}`;
    const project: Project = {
      id: projectId,
      name: newProject.name,
      description: newProject.description,
      status: newProject.status as ProjectStatus,
      createdAt: new Date().toISOString(),
      startDate: newProject.startDate || new Date().toISOString(),
      dueDate: newProject.dueDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      teamMembers: newProject.teamMembers || [],
      progress: 0,
      tags: newProject.tags,
      businessEntityId: newProject.businessEntityId,
      businessEntityName: newProject.businessEntityName,
    };
    
    setProjects([...projects, project]);
    setSelectedProject(projectId);
    setIsCreateProjectOpen(false);
    setNewProject({
      name: "",
      description: "",
      status: "active",
      startDate: new Date().toISOString(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      teamMembers: [],
      tags: [],
    });
    
    // In a real app, you would also send an API request to create the project
    if (!demoMode) {
      // apiRequest('POST', '/api/projects', project);
      toast({
        title: "Project Created",
        description: `Project "${project.name}" has been created`,
      });
    }
  };
  
  // Handle mark task as complete
  const handleMarkTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: "done" };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // In a real app, you would also send an API request to update the task
    if (!demoMode) {
      // apiRequest('PATCH', `/api/tasks/${taskId}`, { status: 'done' });
      toast({
        title: "Task Completed",
        description: `Task "${tasks.find(t => t.id === taskId)?.title}" marked as complete`,
      });
    }
  };
  
  // Handle AI task generation
  const handleGenerateAITasks = async () => {
    if (!aiTaskInput) {
      toast({
        title: "Invalid Input",
        description: "Please provide a description of what you want to do",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const generatedTasks = await generateAITasks(aiTaskInput);
      setAIGeneratedTasks(generatedTasks);
      setSelectedAITasks(generatedTasks.map(task => task.id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle add AI generated tasks
  const handleAddAITasks = () => {
    if (!aiSelectedProject) {
      toast({
        title: "Invalid Project",
        description: "Please select a project for the tasks",
        variant: "destructive",
      });
      return;
    }
    
    const selectedTasks = aiGeneratedTasks.filter(task => selectedAITasks.includes(task.id));
    const tasksToAdd = selectedTasks.map(task => ({
      ...task,
      projectId: aiSelectedProject
    }));
    
    setTasks([...tasks, ...tasksToAdd]);
    setIsAITaskOpen(false);
    setAITaskInput("");
    setAIGeneratedTasks([]);
    setSelectedAITasks([]);
    
    // In a real app, you would also send API requests to create the tasks
    if (!demoMode) {
      // tasksToAdd.forEach(task => apiRequest('POST', '/api/tasks', task));
      toast({
        title: "Tasks Added",
        description: `${tasksToAdd.length} tasks have been added to the project`,
      });
    }
  };
  
  // Handle toggle AI task selection
  const handleToggleAITask = (taskId: string) => {
    if (selectedAITasks.includes(taskId)) {
      setSelectedAITasks(selectedAITasks.filter(id => id !== taskId));
    } else {
      setSelectedAITasks([...selectedAITasks, taskId]);
    }
  };
  
  // Calculate project stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "active").length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  
  return (
    <MainLayout>
      <div className="container py-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="h-8 w-8" /> Project Management
            </h1>
            <p className="text-muted-foreground">
              Organize and track your projects and tasks with ease
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input 
                      id="project-name" 
                      value={newProject.name} 
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea 
                      id="project-description" 
                      value={newProject.description} 
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Describe the project"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="border rounded-md">
                        <DatePicker
                          selected={newProject.startDate ? new Date(newProject.startDate) : new Date()}
                          onChange={(date) => setNewProject({...newProject, startDate: date?.toISOString()})}
                          className="w-full p-2"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <div className="border rounded-md">
                        <DatePicker
                          selected={newProject.dueDate ? new Date(newProject.dueDate) : new Date(new Date().setDate(new Date().getDate() + 30))}
                          onChange={(date) => setNewProject({...newProject, dueDate: date?.toISOString()})}
                          className="w-full p-2"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-tags">Tags (comma separated)</Label>
                    <Input 
                      id="project-tags" 
                      placeholder="design, development, marketing, etc."
                      value={newProject.tags?.join(", ")}
                      onChange={(e) => setNewProject({...newProject, tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" /> New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to your project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input 
                      id="task-title" 
                      value={newTask.title} 
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea 
                      id="task-description" 
                      value={newTask.description} 
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Describe the task"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="project">Project</Label>
                      <Select
                        value={newTask.projectId}
                        onValueChange={(value) => setNewTask({...newTask, projectId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <div className="border rounded-md">
                        <DatePicker
                          selected={newTask.dueDate ? new Date(newTask.dueDate) : new Date(new Date().setDate(new Date().getDate() + 7))}
                          onChange={(date) => setNewTask({...newTask, dueDate: date?.toISOString()})}
                          className="w-full p-2"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({...newTask, priority: value as TaskPriority})}
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
                      <Label htmlFor="module">Module/Department</Label>
                      <Select
                        value={newTask.relatedModule}
                        onValueChange={(value) => setNewTask({...newTask, relatedModule: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          {moduleOptions.map((module) => (
                            <SelectItem key={module.value} value={module.value}>
                              {module.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Assignee</Label>
                    <Select
                      value={newTask.assigneeId}
                      onValueChange={(value) => setNewTask({...newTask, assigneeId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {demoTeamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-tags">Tags (comma separated)</Label>
                    <Input 
                      id="task-tags" 
                      placeholder="design, frontend, content, etc."
                      value={newTask.tags?.join(", ")}
                      onChange={(e) => setNewTask({...newTask, tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateTaskOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAITaskOpen} onOpenChange={setIsAITaskOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" /> AI Task Assistant
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>AI Task Generator</DialogTitle>
                  <DialogDescription>
                    Describe what you want to accomplish, and the AI will suggest tasks.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ai-input">What would you like to accomplish?</Label>
                    <div className="flex gap-2">
                      <Textarea 
                        id="ai-input" 
                        value={aiTaskInput} 
                        onChange={(e) => setAITaskInput(e.target.value)}
                        placeholder="e.g., Create a marketing campaign for our new product launch"
                        rows={3}
                        className="flex-1"
                      />
                      <Button onClick={handleGenerateAITasks} className="self-start">
                        <Sparkles className="h-4 w-4 mr-2" /> Generate
                      </Button>
                    </div>
                  </div>
                  
                  {aiGeneratedTasks.length > 0 && (
                    <>
                      <div className="grid gap-2">
                        <Label>Generated Tasks</Label>
                        <div className="border rounded-md p-2 max-h-64 overflow-y-auto">
                          {aiGeneratedTasks.map((task) => (
                            <div key={task.id} className="flex items-center p-2 hover:bg-muted rounded-md">
                              <input
                                type="checkbox"
                                checked={selectedAITasks.includes(task.id)}
                                onChange={() => handleToggleAITask(task.id)}
                                className="mr-2 h-4 w-4"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{task.title}</div>
                                <div className="text-xs text-muted-foreground">{task.description}</div>
                              </div>
                              <div className="ml-2">
                                {getPriorityBadge(task.priority)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="ai-project">Assign to Project</Label>
                        <Select
                          value={aiSelectedProject}
                          onValueChange={setAISelectedProject}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAITaskOpen(false)}>Cancel</Button>
                  {aiGeneratedTasks.length > 0 && (
                    <Button onClick={handleAddAITasks}>
                      Add {selectedAITasks.length} Task{selectedAITasks.length !== 1 ? 's' : ''}
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <h4 className="text-2xl font-bold">{totalProjects}</h4>
                <p className="text-xs text-muted-foreground">
                  {activeProjects} active ({totalProjects ? Math.round((activeProjects / totalProjects) * 100) : 0}%)
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <h4 className="text-2xl font-bold">{totalTasks}</h4>
                <p className="text-xs text-muted-foreground">
                  {completedTasks} completed ({totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%)
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ListTodo className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <h4 className="text-2xl font-bold">{inProgressTasks.length}</h4>
                <p className="text-xs text-muted-foreground">
                  Tasks currently being worked on
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Due</p>
                <h4 className="text-2xl font-bold">
                  {tasks.filter(t => t.status !== "done" && getDaysLeft(t.dueDate) <= 7 && getDaysLeft(t.dueDate) >= 0).length}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Due in the next 7 days
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Project selector and Search */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[150px]">
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
            
            <Select
              value={moduleFilter}
              onValueChange={setModuleFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {moduleOptions.map((module) => (
                  <SelectItem key={module.value} value={module.value}>
                    {module.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {allTags.map((tag) => (
              <Badge 
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
              >
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTags([])}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
        )}
        
        {/* Main tabs for Board and List views */}
        <Tabs defaultValue="board" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="board" className="gap-2">
              <Menu className="h-4 w-4" /> Kanban Board
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <ListTodo className="h-4 w-4" /> List View
            </TabsTrigger>
          </TabsList>
          
          {/* Kanban Board Tab */}
          <TabsContent value="board" className="space-y-4">
            {isLoadingTasks ? (
              <div className="text-center py-8">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-md">
                <ListTodo className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new task</p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => setIsCreateTaskOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setPriorityFilter('all');
                      setModuleFilter('all');
                      setSelectedTags([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* To Do Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-gray-200"></div>
                        <h3 className="font-medium">To Do</h3>
                        <Badge variant="outline">{todoTasks.length}</Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => {
                          setNewTask({...newTask, status: "todo"});
                          setIsCreateTaskOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <SortableContext items={todoTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      <div id="column-todo" className="bg-gray-50 rounded-md p-3 min-h-[200px]">
                        {todoTasks.map((task) => (
                          <SortableTask 
                            key={task.id} 
                            task={task}
                            onStatusChange={handleTaskStatusChange}
                            onPriorityChange={handleTaskPriorityChange}
                            onEdit={() => handleEditTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                  
                  {/* In Progress Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-blue-200"></div>
                        <h3 className="font-medium">In Progress</h3>
                        <Badge variant="outline">{inProgressTasks.length}</Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => {
                          setNewTask({...newTask, status: "in-progress"});
                          setIsCreateTaskOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <SortableContext items={inProgressTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      <div id="column-in-progress" className="bg-blue-50 rounded-md p-3 min-h-[200px]">
                        {inProgressTasks.map((task) => (
                          <SortableTask 
                            key={task.id} 
                            task={task}
                            onStatusChange={handleTaskStatusChange}
                            onPriorityChange={handleTaskPriorityChange}
                            onEdit={() => handleEditTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                  
                  {/* Done Column */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-green-200"></div>
                        <h3 className="font-medium">Done</h3>
                        <Badge variant="outline">{doneTasks.length}</Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => {
                          setNewTask({...newTask, status: "done"});
                          setIsCreateTaskOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <SortableContext items={doneTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                      <div id="column-done" className="bg-green-50 rounded-md p-3 min-h-[200px]">
                        {doneTasks.map((task) => (
                          <SortableTask 
                            key={task.id} 
                            task={task}
                            onStatusChange={handleTaskStatusChange}
                            onPriorityChange={handleTaskPriorityChange}
                            onEdit={() => handleEditTask(task)}
                            onDelete={() => handleDeleteTask(task.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                </div>
              </DndContext>
            )}
          </TabsContent>
          
          {/* List View Tab */}
          <TabsContent value="list">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>View and manage all tasks across your projects</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoadingTasks ? (
                  <div className="text-center py-8">Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <ListTodo className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new task</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-muted p-3 font-medium text-sm">
                      <div className="col-span-5">Task</div>
                      <div className="col-span-2">Assignee</div>
                      <div className="col-span-1 text-center">Priority</div>
                      <div className="col-span-2">Due Date</div>
                      <div className="col-span-1 text-center">Status</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="grid grid-cols-12 p-3 hover:bg-muted/50 border-t text-sm items-center">
                        <div className="col-span-5 pr-4">
                          <div className="font-medium line-clamp-1">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                          )}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="col-span-2">
                          {task.assigneeName ? (
                            <div className="flex items-center gap-2">
                              {task.assigneeAvatar && (
                                <div className="h-6 w-6 rounded-full overflow-hidden">
                                  <img 
                                    src={task.assigneeAvatar} 
                                    alt={task.assigneeName}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <span className="truncate">{task.assigneeName}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </div>
                        
                        <div className="col-span-1 flex justify-center">
                          {getPriorityBadge(task.priority)}
                        </div>
                        
                        <div className="col-span-2">
                          <div className={cn(
                            "flex items-center gap-1",
                            getDaysLeft(task.dueDate) < 0 ? "text-red-500" :
                            getDaysLeft(task.dueDate) <= 3 ? "text-amber-500" : ""
                          )}>
                            <CalendarDays className="h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                            {getDaysLeft(task.dueDate) < 0 && (
                              <Badge variant="outline" className="text-xs bg-red-100 text-red-800 ml-1">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-span-1 flex justify-center">
                          <Badge 
                            className={cn(
                              "capitalize",
                              task.status === "todo" ? "bg-gray-100 text-gray-800 hover:bg-gray-100" : 
                              task.status === "in-progress" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : 
                              task.status === "done" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                            )}
                          >
                            {task.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="col-span-1 flex justify-end gap-1">
                          {task.status !== "done" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => handleMarkTaskComplete(task.id)}
                              title="Mark as completed"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => handleEditTask(task)}
                            title="Edit task"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Delete task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Task Dialog */}
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Task Title</Label>
              <Input 
                id="edit-title" 
                value={taskToEdit?.title} 
                onChange={(e) => setTaskToEdit(taskToEdit ? {...taskToEdit, title: e.target.value} : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={taskToEdit?.description} 
                onChange={(e) => setTaskToEdit(taskToEdit ? {...taskToEdit, description: e.target.value} : null)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-project">Project</Label>
                <Select
                  value={taskToEdit?.projectId}
                  onValueChange={(value) => setTaskToEdit(taskToEdit ? {...taskToEdit, projectId: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={taskToEdit?.status}
                  onValueChange={(value) => setTaskToEdit(taskToEdit ? {...taskToEdit, status: value as TaskStatus} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={taskToEdit?.priority}
                  onValueChange={(value) => setTaskToEdit(taskToEdit ? {...taskToEdit, priority: value as TaskPriority} : null)}
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
                <Label htmlFor="edit-due-date">Due Date</Label>
                <div className="border rounded-md">
                  <DatePicker
                    selected={taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : new Date()}
                    onChange={(date) => setTaskToEdit(taskToEdit ? {...taskToEdit, dueDate: date?.toISOString() || new Date().toISOString()} : null)}
                    className="w-full p-2"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-assignee">Assignee</Label>
              <Select
                value={taskToEdit?.assigneeId}
                onValueChange={(value) => {
                  const assigneeName = value ? demoTeamMembers.find(m => m.id === value)?.name : undefined;
                  const assigneeAvatar = value ? demoTeamMembers.find(m => m.id === value)?.avatar : undefined;
                  setTaskToEdit(taskToEdit ? {
                    ...taskToEdit, 
                    assigneeId: value,
                    assigneeName,
                    assigneeAvatar
                  } : null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {demoTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-module">Module/Department</Label>
              <Select
                value={taskToEdit?.relatedModule}
                onValueChange={(value) => setTaskToEdit(taskToEdit ? {...taskToEdit, relatedModule: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {moduleOptions.map((module) => (
                    <SelectItem key={module.value} value={module.value}>
                      {module.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input 
                id="edit-tags" 
                placeholder="design, frontend, content, etc."
                value={taskToEdit?.tags?.join(", ") || ""}
                onChange={(e) => setTaskToEdit(taskToEdit ? {
                  ...taskToEdit, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTaskOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEditedTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EnhancedProjectManagement;