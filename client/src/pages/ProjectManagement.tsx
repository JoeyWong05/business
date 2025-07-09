import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Project status type
type ProjectStatus = "not_started" | "in_progress" | "on_hold" | "completed" | "cancelled";

// Project priority type
type ProjectPriority = "low" | "medium" | "high" | "urgent";

// Project type
interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  dueDate?: string;
  startDate?: string;
  clientId?: number;
  clientName?: string;
  assignedTo: string[];
  tags: string[];
  tasks: Task[];
  platform: "asana" | "trello" | "notion" | "clickup" | "internal";
  externalUrl?: string;
  createdAt: string;
  updatedAt: string;
  entityId: number;
  entityName: string;
}

// Task type
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "to_do" | "in_progress" | "in_review" | "completed";
  assignedTo?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "urgent";
  checklist?: {item: string, completed: boolean}[];
  comments?: {author: string, text: string, timestamp: string}[];
  attachments?: {name: string, url: string, type: string}[];
  tags?: string[];
  timeEstimate?: number;
  timeSpent?: number;
  projectId: string;
}

// Integration type
interface Integration {
  id: string;
  name: string;
  platform: "asana" | "trello" | "notion" | "clickup";
  status: "active" | "disconnected" | "error";
  lastSynced?: string;
  projects: number;
  tasks: number;
  entityId?: number;
}

export default function ProjectManagement() {
  const [activeTab, setActiveTab] = useState<string>("projects");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  
  // Demo data for projects
  const { data: projectData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      // In a real implementation, we would fetch from the API
      // This is mock data for demonstration purposes
      return {
        projects: [
          {
            id: "project-1",
            name: "Website Redesign",
            description: "Complete overhaul of client website with new branding",
            status: "in_progress",
            priority: "high",
            progress: 65,
            dueDate: "2025-04-15",
            startDate: "2025-02-20",
            clientId: 1,
            clientName: "Tech Solutions Inc.",
            assignedTo: ["Alex Johnson", "Maria Garcia"],
            tags: ["design", "development", "branding"],
            tasks: [
              {
                id: "task-1",
                title: "Create wireframes",
                status: "completed",
                priority: "high",
                projectId: "project-1",
                assignedTo: "Alex Johnson",
                dueDate: "2025-03-01",
                timeEstimate: 8,
                timeSpent: 10
              },
              {
                id: "task-2",
                title: "Design homepage mockup",
                status: "completed",
                priority: "high",
                projectId: "project-1",
                assignedTo: "Maria Garcia",
                dueDate: "2025-03-10",
                timeEstimate: 12,
                timeSpent: 14
              },
              {
                id: "task-3",
                title: "Front-end development",
                status: "in_progress",
                priority: "high",
                projectId: "project-1",
                assignedTo: "Alex Johnson",
                dueDate: "2025-03-31",
                timeEstimate: 40,
                timeSpent: 22
              },
              {
                id: "task-4",
                title: "Content migration",
                status: "to_do",
                priority: "medium",
                projectId: "project-1",
                dueDate: "2025-04-05",
                timeEstimate: 16,
                timeSpent: 0
              }
            ],
            platform: "asana",
            externalUrl: "https://app.asana.com/project/12345",
            createdAt: "2025-02-15",
            updatedAt: "2025-03-22",
            entityId: 1,
            entityName: "Digital Merch Pros"
          },
          {
            id: "project-2",
            name: "Product Launch Campaign",
            description: "Marketing campaign for new product line",
            status: "in_progress",
            priority: "urgent",
            progress: 40,
            dueDate: "2025-05-01",
            startDate: "2025-03-01",
            clientId: 2,
            clientName: "Fashion Forward",
            assignedTo: ["James Wilson", "Emma Thompson"],
            tags: ["marketing", "social media", "advertising"],
            tasks: [
              {
                id: "task-5",
                title: "Create marketing plan",
                status: "completed",
                priority: "high",
                projectId: "project-2",
                assignedTo: "James Wilson",
                dueDate: "2025-03-10",
                timeEstimate: 12,
                timeSpent: 14
              },
              {
                id: "task-6",
                title: "Design social media assets",
                status: "in_progress",
                priority: "high",
                projectId: "project-2",
                assignedTo: "Emma Thompson",
                dueDate: "2025-03-25",
                timeEstimate: 20,
                timeSpent: 15
              }
            ],
            platform: "trello",
            externalUrl: "https://trello.com/b/abc123",
            createdAt: "2025-02-25",
            updatedAt: "2025-03-21",
            entityId: 1,
            entityName: "Digital Merch Pros"
          },
          {
            id: "project-3",
            name: "Inventory Management System",
            description: "Custom inventory tracking solution",
            status: "not_started",
            priority: "medium",
            progress: 0,
            dueDate: "2025-07-15",
            startDate: "2025-04-01",
            clientId: 3,
            clientName: "Retail Solutions Co.",
            assignedTo: ["David Kim"],
            tags: ["development", "backend", "database"],
            tasks: [],
            platform: "clickup",
            externalUrl: "https://app.clickup.com/12345",
            createdAt: "2025-03-15",
            updatedAt: "2025-03-20",
            entityId: 3,
            entityName: "Lone Star Custom Clothing"
          }
        ],
        integrations: [
          {
            id: "integration-1",
            name: "Asana",
            platform: "asana",
            status: "active",
            lastSynced: "2025-03-22T10:30:00Z",
            projects: 8,
            tasks: 64,
            entityId: 1
          },
          {
            id: "integration-2",
            name: "Trello",
            platform: "trello",
            status: "active",
            lastSynced: "2025-03-22T10:25:00Z",
            projects: 5,
            tasks: 37,
            entityId: 2
          },
          {
            id: "integration-3",
            name: "ClickUp",
            platform: "clickup",
            status: "active",
            lastSynced: "2025-03-22T09:15:00Z",
            projects: 3,
            tasks: 29,
            entityId: 3
          },
          {
            id: "integration-4",
            name: "Notion",
            platform: "notion",
            status: "disconnected",
            lastSynced: "2025-03-15T14:20:00Z",
            projects: 0,
            tasks: 0
          }
        ],
        stats: {
          totalProjects: 16,
          totalTasks: 130,
          completedTasks: 42,
          upcomingDeadlines: 8,
          overdueItems: 3,
          projectsByStatus: {
            not_started: 3,
            in_progress: 9,
            on_hold: 1,
            completed: 2,
            cancelled: 1
          },
          tasksByStatus: {
            to_do: 45,
            in_progress: 38,
            in_review: 5,
            completed: 42
          }
        }
      };
    },
  });

  // Get projects, integrations and stats from data or use empty defaults if data is not loaded yet
  const projects: Project[] = projectData?.projects || [];
  const integrations: Integration[] = projectData?.integrations || [];
  const stats = projectData?.stats || {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    overdueItems: 0,
    projectsByStatus: {},
    tasksByStatus: {}
  };

  // Filter projects based on search, status, priority, platform, and tags
  const filteredProjects = projects.filter(project => {
    // Search filter
    const matchesSearch = searchQuery
      ? project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    // Platform filter
    const matchesPlatform = platformFilter === 'all' || project.platform === platformFilter;
    
    // Tags filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => project.tags.includes(tag));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesPlatform && matchesTags;
  });

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));

  // Format date string to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days left until due date
  const getDaysLeft = (dueDate?: string) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get appropriate status badge
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "not_started":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Not Started</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "on_hold":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get appropriate priority badge
  const getPriorityBadge = (priority: ProjectPriority) => {
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

  // Get appropriate platform badge
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "asana":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Asana</Badge>;
      case "trello":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Trello</Badge>;
      case "notion":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Notion</Badge>;
      case "clickup":
        return <Badge variant="outline" className="bg-green-100 text-green-800">ClickUp</Badge>;
      case "internal":
        return <Badge variant="outline" className="bg-primary/10 text-primary">Internal</Badge>;
      default:
        return <Badge variant="outline">{platform}</Badge>;
    }
  };

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-8 w-8" /> Project Management
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your projects across multiple platforms
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Project
          </Button>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" /> Connect Platform
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <h4 className="text-2xl font-bold">{stats.totalProjects}</h4>
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
              <h4 className="text-2xl font-bold">{stats.totalTasks}</h4>
              <p className="text-xs text-muted-foreground">
                {stats.completedTasks} completed ({stats.completedTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%)
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
              <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
              <h4 className="text-2xl font-bold">{stats.upcomingDeadlines}</h4>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue Items</p>
              <h4 className="text-2xl font-bold">{stats.overdueItems}</h4>
              <p className="text-xs text-red-500 font-medium">Requires attention</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlarmClock className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main tabs for Projects, Tasks, and Integrations */}
      <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="projects" className="gap-2">
            <Briefcase className="h-4 w-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <ArrowUpRight className="h-4 w-4" /> Integrations
          </TabsTrigger>
        </TabsList>
        
        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                className="rounded-md border px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select 
                className="rounded-md border px-3 py-2 text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              
              <select 
                className="rounded-md border px-3 py-2 text-sm"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="asana">Asana</option>
                <option value="trello">Trello</option>
                <option value="notion">Notion</option>
                <option value="clickup">ClickUp</option>
                <option value="internal">Internal</option>
              </select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
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
          
          {/* Projects list */}
          {isLoadingProjects ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-md">
              <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setPlatformFilter('all');
                  setSelectedTags([]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{project.name}</CardTitle>
                          {project.externalUrl && (
                            <a 
                              href={project.externalUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <CardDescription className="mt-1 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <div className="flex gap-2">
                          {getStatusBadge(project.status as ProjectStatus)}
                          {getPriorityBadge(project.priority as ProjectPriority)}
                          {getPlatformBadge(project.platform)}
                        </div>
                        {project.clientName && (
                          <div className="text-sm text-muted-foreground">
                            Client: {project.clientName}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col md:flex-row gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        {project.startDate && (
                          <div>
                            <div className="text-muted-foreground">Start Date</div>
                            <div className="font-medium">{formatDate(project.startDate)}</div>
                          </div>
                        )}
                        
                        {project.dueDate && (
                          <div>
                            <div className="text-muted-foreground">Due Date</div>
                            <div className="font-medium flex items-center gap-1">
                              {formatDate(project.dueDate)}
                              {getDaysLeft(project.dueDate) !== null && (
                                <span className={cn(
                                  "text-xs px-1.5 py-0.5 rounded",
                                  getDaysLeft(project.dueDate)! < 0 
                                    ? "bg-red-100 text-red-800" 
                                    : getDaysLeft(project.dueDate)! <= 3
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                )}>
                                  {getDaysLeft(project.dueDate)! < 0 
                                    ? `${Math.abs(getDaysLeft(project.dueDate)!)}d overdue` 
                                    : `${getDaysLeft(project.dueDate)}d left`}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div className="text-muted-foreground">Tasks</div>
                          <div className="font-medium">
                            {project.tasks.filter(t => t.status === 'completed').length}/{project.tasks.length}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Show task summary if tasks exist */}
                    {project.tasks.length > 0 && (
                      <Accordion type="single" collapsible className="border rounded-md">
                        <AccordionItem value="tasks" className="border-none">
                          <AccordionTrigger className="py-3 px-4">
                            <span className="text-sm font-medium">Tasks ({project.tasks.length})</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3">
                            <div className="space-y-2">
                              {project.tasks.map((task) => (
                                <div key={task.id} className="flex items-center gap-2 text-sm border-b pb-2 last:border-0 last:pb-0">
                                  <div className={cn(
                                    "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0",
                                    task.status === 'completed' ? "bg-green-100" : "bg-gray-100"
                                  )}>
                                    {task.status === 'completed' ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Clock className="h-3 w-3 text-gray-600" />
                                    )}
                                  </div>
                                  <div className="flex-1 truncate">
                                    <span className={task.status === 'completed' ? "line-through text-muted-foreground" : ""}>
                                      {task.title}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {task.assignedTo || '-'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {task.dueDate ? formatDate(task.dueDate) : '-'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                    
                    {/* Tags */}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Assigned to */}
                    {project.assignedTo.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{project.assignedTo.join(', ')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>View and manage tasks across all projects and platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ListTodo className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Task Management</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  This tab will display all tasks from your connected project management platforms.
                </p>
                <div className="flex justify-center gap-4">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" /> Filter Tasks
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                    <Badge 
                      variant={integration.status === 'active' ? 'default' : 'destructive'}
                      className={cn(
                        integration.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : '',
                        integration.status === 'disconnected' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : '',
                        integration.status === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''
                      )}
                    >
                      {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {integration.status === 'active' 
                      ? `Last synced: ${new Date(integration.lastSynced!).toLocaleString()}`
                      : 'Not currently connected'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Projects</div>
                      <div className="text-2xl font-bold mt-1">{integration.projects}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Tasks</div>
                      <div className="text-2xl font-bold mt-1">{integration.tasks}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {integration.status === 'active' ? (
                      <Button variant="outline" size="sm">
                        <SquarePen className="h-4 w-4 mr-2" /> Configure
                      </Button>
                    ) : (
                      <Button size="sm">
                        <ArrowUpRight className="h-4 w-4 mr-2" /> Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* New integration card */}
            <Card className="border-dashed">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-[242px]">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Connect New Platform</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                  Add another project management platform to bring all your projects together.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Integration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}