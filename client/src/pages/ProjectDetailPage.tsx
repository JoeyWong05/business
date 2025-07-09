import { useState, useMemo, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { 
  ArrowLeft, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Edit3,
  Flag,
  MoreHorizontal, 
  Plus, 
  Search,
  Trash2, 
  Users
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectStatus, Task, TaskStatus, TaskPriority } from "@/types/project-types";
import { TaskCard } from "@/components/projects/TaskCard";
import { AiTaskGenerator } from "@/components/projects/AiTaskGenerator";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Simulated project data (would be fetched from API)
  const [project, setProject] = useState<Project>({
    id: id || "1",
    name: "2025 Q1 Marketing Campaign",
    description: "Comprehensive marketing campaign for the first quarter focusing on new product launch",
    status: "active" as ProjectStatus,
    createdAt: new Date().toISOString(),
    startDate: new Date(2025, 0, 1).toISOString(),
    dueDate: new Date(2025, 2, 31).toISOString(),
    progress: 25,
    teamMembers: [
      { id: "1", name: "John Doe", avatar: "/assets/avatars/avatar-1.jpg" },
      { id: "2", name: "Jane Smith", avatar: "/assets/avatars/avatar-2.jpg" },
      { id: "3", name: "Alex Johnson", avatar: "/assets/avatars/avatar-3.jpg" }
    ],
    tags: ["marketing", "campaign", "Q1"],
    businessEntityName: "Digital Merch Pros"
  });
  
  // Simulated task data (would be fetched from API)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Define campaign objectives and KPIs",
      description: "Establish clear, measurable goals for the Q1 marketing campaign including target metrics for leads, conversions, and ROI",
      status: "done" as TaskStatus,
      priority: "high" as TaskPriority,
      createdAt: new Date(2024, 11, 15).toISOString(),
      dueDate: new Date(2024, 11, 25).toISOString(),
      assigneeId: "1",
      assigneeName: "John Doe",
      assigneeAvatar: "/assets/avatars/avatar-1.jpg",
      projectId: id || "1",
      tags: ["planning", "strategy"]
    },
    {
      id: "task-2",
      title: "Conduct audience research",
      description: "Research target demographics, behavior patterns, and needs to ensure campaign messaging resonates with intended audience",
      status: "in-progress" as TaskStatus,
      priority: "medium" as TaskPriority,
      createdAt: new Date(2024, 11, 18).toISOString(),
      dueDate: new Date(2025, 0, 15).toISOString(),
      assigneeId: "2",
      assigneeName: "Jane Smith",
      assigneeAvatar: "/assets/avatars/avatar-2.jpg",
      projectId: id || "1",
      tags: ["research", "audience"]
    },
    {
      id: "task-3",
      title: "Develop creative brief",
      description: "Create a comprehensive brief outlining campaign requirements, brand guidelines, messaging, and deliverables",
      status: "todo" as TaskStatus,
      priority: "high" as TaskPriority,
      createdAt: new Date(2024, 11, 20).toISOString(),
      dueDate: new Date(2025, 0, 10).toISOString(),
      assigneeId: "3",
      assigneeName: "Alex Johnson",
      assigneeAvatar: "/assets/avatars/avatar-3.jpg",
      projectId: id || "1",
      tags: ["creative", "brief"]
    },
    {
      id: "task-4",
      title: "Design campaign assets",
      description: "Create visual assets including social media graphics, email templates, and landing page designs",
      status: "todo" as TaskStatus,
      priority: "medium" as TaskPriority,
      createdAt: new Date(2024, 11, 22).toISOString(),
      dueDate: new Date(2025, 0, 25).toISOString(),
      projectId: id || "1",
      tags: ["design", "assets"]
    },
    {
      id: "task-5",
      title: "Develop content calendar",
      description: "Create a detailed content release schedule for all campaign channels including social, email, and blog",
      status: "todo" as TaskStatus,
      priority: "medium" as TaskPriority,
      createdAt: new Date(2024, 11, 23).toISOString(),
      dueDate: new Date(2025, 0, 20).toISOString(),
      projectId: id || "1",
      tags: ["content", "planning"],
      checklists: [
        { id: "cl-1", title: "Define content themes", completed: false },
        { id: "cl-2", title: "Map content to buyer journey", completed: false },
        { id: "cl-3", title: "Identify content formats", completed: false },
        { id: "cl-4", title: "Set publication dates", completed: false }
      ]
    },
    {
      id: "task-6",
      title: "Set up tracking and analytics",
      description: "Configure UTM parameters, conversion tracking, and reporting dashboards to measure campaign performance",
      status: "todo" as TaskStatus,
      priority: "high" as TaskPriority,
      createdAt: new Date(2024, 11, 27).toISOString(),
      dueDate: new Date(2025, 1, 5).toISOString(),
      projectId: id || "1",
      relatedModule: "Analytics",
      tags: ["analytics", "tracking"]
    },
    {
      id: "task-7",
      title: "Review and approve campaign materials",
      description: "Final review of all campaign assets, messaging, and scheduling before launch",
      status: "todo" as TaskStatus,
      priority: "high" as TaskPriority,
      createdAt: new Date(2024, 12, 1).toISOString(),
      dueDate: new Date(2025, 1, 25).toISOString(),
      projectId: id || "1",
      tags: ["review", "approval"]
    }
  ]);
  
  const [activeTab, setActiveTab] = useState("all");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");
  
  const updateProject = (updatedData: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updatedData }));
    
    toast({
      title: "Project updated",
      description: "Project details have been updated successfully",
    });
  };
  
  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus } 
          : task
      )
    );
    
    // Recalculate project progress
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    const totalTasks = updatedTasks.length;
    const completedTasks = updatedTasks.filter(task => task.status === "done").length;
    const progress = Math.round((completedTasks / totalTasks) * 100);
    
    setProject(prev => ({ ...prev, progress }));
  };
  
  const handleAddTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    setIsAddTaskDialogOpen(false);
    
    toast({
      title: "Task added",
      description: "New task has been added to the project",
    });
    
    // Update project progress
    const totalTasks = tasks.length + 1;
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const progress = Math.round((completedTasks / totalTasks) * 100);
    
    setProject(prev => ({ ...prev, progress }));
  };
  
  // Calculate project statistics
  const projectStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "done").length;
    const inProgressTasks = tasks.filter(task => task.status === "in-progress").length;
    const todoTasks = tasks.filter(task => task.status === "todo").length;
    
    const highPriorityTasks = tasks.filter(task => task.priority === "high").length;
    const mediumPriorityTasks = tasks.filter(task => task.priority === "medium").length;
    const lowPriorityTasks = tasks.filter(task => task.priority === "low").length;
    
    const today = new Date();
    const overdueTasks = tasks.filter(
      task => task.status !== "done" && new Date(task.dueDate) < today
    ).length;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      overdueTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }, [tasks]);
  
  // Filtered tasks based on active tab, search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Tab filter
      if (activeTab === "todo" && task.status !== "todo") return false;
      if (activeTab === "in-progress" && task.status !== "in-progress") return false;
      if (activeTab === "done" && task.status !== "done") return false;
      
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Status filter
      if (statusFilter && task.status !== statusFilter) return false;
      
      // Priority filter
      if (priorityFilter && task.priority !== priorityFilter) return false;
      
      // Assignee filter
      if (assigneeFilter && task.assigneeId !== assigneeFilter) return false;
      
      return true;
    });
  }, [tasks, activeTab, searchQuery, statusFilter, priorityFilter, assigneeFilter]);
  
  // Team members for assignee filter dropdown
  const teamMembers = useMemo(() => {
    const members = new Set<string>();
    tasks.forEach(task => {
      if (task.assigneeId) {
        members.add(task.assigneeId);
      }
    });
    
    return tasks
      .filter(task => task.assigneeId && members.has(task.assigneeId))
      .map(task => ({
        id: task.assigneeId!,
        name: task.assigneeName!,
        avatar: task.assigneeAvatar
      }))
      .filter((member, index, self) => 
        index === self.findIndex(m => m.id === member.id)
      );
  }, [tasks]);
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Back button and project actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Button variant="outline" size="icon" onClick={() => setLocation('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground text-sm">
              {project.businessEntityName && `${project.businessEntityName} • `}
              Created on {format(new Date(project.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Users className="h-4 w-4 mr-2" />
                Manage Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant={project.status === "active" ? "default" : "outline"}
            className="gap-2"
            onClick={() => updateProject({ status: project.status === "active" ? "completed" as ProjectStatus : "active" as ProjectStatus })}
          >
            {project.status === "active" ? "Mark as Complete" : "Reopen Project"}
          </Button>
          
          <Button className="gap-2" onClick={() => setIsAddTaskDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      {/* Project details and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Project Details</h2>
            
            {project.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p className="text-sm">{project.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <Badge 
                  className={`${
                    project.status === "active" 
                      ? "bg-green-500/10 text-green-600 border-green-500/20" 
                      : project.status === "completed" 
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                  } capitalize`}
                >
                  {project.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(project.startDate), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(project.dueDate), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Team</h3>
              <div className="flex items-center -space-x-2">
                {project.teamMembers.map((member, index) => (
                  <Avatar key={index} className="border-2 border-background h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full ml-1">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Progress</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-sm">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="text-sm font-medium">{projectStats.totalTasks}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium">{projectStats.completedTasks}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-sm font-medium">{projectStats.inProgressTasks}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">To Do</span>
                <span className="text-sm font-medium">{projectStats.todoTasks}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">High Priority</span>
                <span className="text-sm font-medium">{projectStats.highPriorityTasks}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <span className="text-sm font-medium">{projectStats.overdueTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              
              {teamMembers.length > 0 && (
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All assignees</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">
                All <Badge variant="secondary" className="ml-2">{tasks.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="todo">
                To Do <Badge variant="secondary" className="ml-2">{projectStats.todoTasks}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress <Badge variant="secondary" className="ml-2">{projectStats.inProgressTasks}</Badge>
              </TabsTrigger>
              <TabsTrigger value="done">
                Done <Badge variant="secondary" className="ml-2">{projectStats.completedTasks}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg border">
              <CheckSquare className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all" && statusFilter === "" && priorityFilter === "" && assigneeFilter === "" && !searchQuery
                  ? "This project doesn't have any tasks yet"
                  : "Try adjusting your search or filter criteria"}
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
                setPriorityFilter("");
                setAssigneeFilter("");
              }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleTaskStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Task Generator */}
      <div className="flex justify-center mb-8">
        <AiTaskGenerator 
          projectId={id || "1"} 
          onTasksGenerated={(generatedTasks) => {
            setTasks(prev => [...generatedTasks, ...prev]);
            
            // Update project progress
            const totalTasks = tasks.length + generatedTasks.length;
            const completedTasks = tasks.filter(t => t.status === "done").length;
            const progress = Math.round((completedTasks / totalTasks) * 100);
            
            setProject(prev => ({ ...prev, progress }));
            
            toast({
              title: "Tasks generated",
              description: `Added ${generatedTasks.length} tasks to your project`,
            });
          }}
        />
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for this project. Tasks help break down project work into manageable pieces.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium block mb-1">
                Task Title
              </label>
              <Input id="title" placeholder="Enter task title" />
            </div>
            
            <div>
              <label htmlFor="description" className="text-sm font-medium block mb-1">
                Description
              </label>
              <Input id="description" placeholder="Enter task description" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="text-sm font-medium block mb-1">
                  Priority
                </label>
                <Select defaultValue="medium">
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
              
              <div>
                <label htmlFor="dueDate" className="text-sm font-medium block mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="assignee" className="text-sm font-medium block mb-1">
                Assignee
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {project.teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="tags" className="text-sm font-medium block mb-1">
                Tags (comma separated)
              </label>
              <Input id="tags" placeholder="E.g. design, review, content" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              const newTask: Task = {
                id: `task-${Date.now()}`,
                title: "New Task",
                description: "Task description",
                status: "todo" as TaskStatus,
                priority: "medium" as TaskPriority,
                createdAt: new Date().toISOString(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                projectId: id || "1",
                tags: ["new"]
              };
              
              handleAddTask(newTask);
            }}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}