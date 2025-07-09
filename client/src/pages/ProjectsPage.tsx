import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { 
  Filter, 
  Plus, 
  Search,
  SlidersHorizontal,
  BarChart4,
  Calendar,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectStatus, ProjectStats } from "@/types/project-types";

export default function ProjectsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("dueDate-asc");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectEntityId, setNewProjectEntityId] = useState("");
  
  // Simulated project data (would be fetched from API)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "2025 Q1 Marketing Campaign",
      description: "Comprehensive marketing campaign for the first quarter focusing on new product launch",
      status: "active" as ProjectStatus,
      createdAt: new Date().toISOString(),
      startDate: new Date(2025, 0, 1).toISOString(),
      dueDate: new Date(2025, 2, 31).toISOString(),
      progress: 25,
      teamMembers: [
        { id: "1", name: "John Doe", avatar: "/assets/avatars/avatar-1.jpg" },
        { id: "2", name: "Jane Smith", avatar: "/assets/avatars/avatar-2.jpg" }
      ],
      tags: ["marketing", "campaign", "Q1"],
      businessEntityId: "1",
      businessEntityName: "Digital Merch Pros"
    },
    {
      id: "2",
      name: "Website Redesign",
      description: "Complete overhaul of the company website with improved UX/UI and mobile responsiveness",
      status: "active" as ProjectStatus,
      createdAt: new Date(2024, 10, 15).toISOString(),
      startDate: new Date(2024, 11, 1).toISOString(),
      dueDate: new Date(2025, 1, 28).toISOString(),
      progress: 60,
      teamMembers: [
        { id: "3", name: "Alex Johnson", avatar: "/assets/avatars/avatar-3.jpg" },
        { id: "4", name: "Sarah Williams", avatar: "/assets/avatars/avatar-4.jpg" },
        { id: "5", name: "Mike Brown", avatar: "/assets/avatars/avatar-5.jpg" }
      ],
      tags: ["website", "design", "development"],
      businessEntityId: "2",
      businessEntityName: "Mystery Hype"
    },
    {
      id: "3",
      name: "New Product Launch",
      description: "Coordinating the launch of our new flagship product line including marketing, sales, and distribution",
      status: "active" as ProjectStatus,
      createdAt: new Date(2024, 9, 10).toISOString(),
      startDate: new Date(2024, 10, 1).toISOString(),
      dueDate: new Date(2025, 3, 15).toISOString(),
      progress: 35,
      teamMembers: [
        { id: "1", name: "John Doe", avatar: "/assets/avatars/avatar-1.jpg" },
        { id: "3", name: "Alex Johnson", avatar: "/assets/avatars/avatar-3.jpg" },
        { id: "6", name: "Emily Davis", avatar: "/assets/avatars/avatar-6.jpg" }
      ],
      tags: ["product", "launch", "sales"],
      businessEntityId: "3",
      businessEntityName: "Lone Star Custom Clothing"
    },
    {
      id: "4",
      name: "Annual Financial Audit",
      description: "Preparing for and conducting the annual financial audit with external auditors",
      status: "completed" as ProjectStatus,
      createdAt: new Date(2024, 8, 1).toISOString(),
      startDate: new Date(2024, 9, 1).toISOString(),
      dueDate: new Date(2024, 11, 15).toISOString(),
      completedAt: new Date(2024, 11, 12).toISOString(),
      progress: 100,
      teamMembers: [
        { id: "7", name: "David Wilson", avatar: "/assets/avatars/avatar-7.jpg" },
        { id: "8", name: "Lisa Thompson", avatar: "/assets/avatars/avatar-8.jpg" }
      ],
      tags: ["finance", "audit", "compliance"],
      businessEntityId: "1",
      businessEntityName: "Digital Merch Pros"
    },
    {
      id: "5",
      name: "Customer Loyalty Program",
      description: "Developing and implementing a new customer loyalty program to improve retention",
      status: "active" as ProjectStatus,
      createdAt: new Date(2024, 10, 5).toISOString(),
      startDate: new Date(2024, 11, 10).toISOString(),
      dueDate: new Date(2025, 4, 1).toISOString(),
      progress: 15,
      teamMembers: [
        { id: "2", name: "Jane Smith", avatar: "/assets/avatars/avatar-2.jpg" },
        { id: "6", name: "Emily Davis", avatar: "/assets/avatars/avatar-6.jpg" },
        { id: "9", name: "Ryan Garcia", avatar: "/assets/avatars/avatar-9.jpg" }
      ],
      tags: ["customer", "loyalty", "marketing"],
      businessEntityId: "4",
      businessEntityName: "Alcoeaze"
    },
    {
      id: "6",
      name: "Inventory Management System",
      description: "Implementing a new inventory management system to improve efficiency and reduce costs",
      status: "archived" as ProjectStatus,
      createdAt: new Date(2024, 7, 1).toISOString(),
      startDate: new Date(2024, 7, 15).toISOString(),
      dueDate: new Date(2024, 10, 30).toISOString(),
      completedAt: new Date(2024, 10, 25).toISOString(),
      progress: 100,
      teamMembers: [
        { id: "5", name: "Mike Brown", avatar: "/assets/avatars/avatar-5.jpg" },
        { id: "8", name: "Lisa Thompson", avatar: "/assets/avatars/avatar-8.jpg" },
        { id: "10", name: "Chris Martin", avatar: "/assets/avatars/avatar-10.jpg" }
      ],
      tags: ["inventory", "operations", "system"],
      businessEntityId: "5",
      businessEntityName: "Hide Cafe Bars"
    }
  ]);
  
  // Simulated business entities (would be fetched from API)
  const businessEntities = useMemo(() => [
    { id: "1", name: "Digital Merch Pros" },
    { id: "2", name: "Mystery Hype" },
    { id: "3", name: "Lone Star Custom Clothing" },
    { id: "4", name: "Alcoeaze" },
    { id: "5", name: "Hide Cafe Bars" }
  ], []);
  
  // Project statistics
  const projectStats: ProjectStats = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const overdueProjects = projects.filter(
      p => p.status === 'active' && new Date(p.dueDate) < new Date()
    ).length;
    
    // Simulated task stats (would be calculated from actual tasks)
    const totalTasks = 45;
    const completedTasks = 18;
    const highPriorityTasks = 12;
    const overdueHighPriorityTasks = 3;
    
    return {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      overdueProjects,
      totalTasks,
      completedTasks,
      highPriorityTasks,
      overdueHighPriorityTasks
    };
  }, [projects]);
  
  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        // Search filter
        if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !project.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
          return false;
        }
        
        // Status filter
        if (statusFilter && statusFilter !== 'all' && project.status !== statusFilter) {
          return false;
        }
        
        // Entity filter
        if (entityFilter && entityFilter !== 'all' && project.businessEntityId !== entityFilter) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sorting
        const [field, order] = sortOption.split('-');
        
        if (field === 'name') {
          return order === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (field === 'dueDate') {
          return order === 'asc'
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        } else if (field === 'progress') {
          return order === 'asc'
            ? a.progress - b.progress
            : b.progress - a.progress;
        } else if (field === 'createdAt') {
          return order === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        
        return 0;
      });
  }, [projects, searchQuery, statusFilter, entityFilter, sortOption]);
  
  const handleCreateProject = () => {
    // Validate form
    if (!newProjectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }
    
    // Create new project (in a real app, this would make an API call)
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName,
      description: newProjectDescription.trim() || undefined,
      status: "active" as ProjectStatus,
      createdAt: new Date().toISOString(),
      startDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      progress: 0,
      teamMembers: [],
      tags: [],
    };
    
    if (newProjectEntityId && newProjectEntityId !== 'none') {
      const entity = businessEntities.find(e => e.id === newProjectEntityId);
      if (entity) {
        newProject.businessEntityId = entity.id;
        newProject.businessEntityName = entity.name;
      }
    }
    
    setProjects(prev => [newProject, ...prev]);
    setIsCreateProjectOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");
    setNewProjectEntityId("");
    
    toast({
      title: "Project created",
      description: "Your new project has been created successfully",
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your business projects across all entities
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateProjectOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Total Projects</p>
                  <p className="text-3xl font-bold">{projectStats.totalProjects}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Active Projects</p>
                  <p className="text-3xl font-bold">{projectStats.activeProjects}</p>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Completed Projects</p>
                  <p className="text-3xl font-bold">{projectStats.completedProjects}</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Team Members</p>
                  <p className="text-3xl font-bold">14</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters and search */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10 w-full sm:w-[280px]"
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
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Business Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entities</SelectItem>
                  {businessEntities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[240px]">
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate-asc">Due date (earliest first)</SelectItem>
                <SelectItem value="dueDate-desc">Due date (latest first)</SelectItem>
                <SelectItem value="name-asc">Project name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Project name (Z-A)</SelectItem>
                <SelectItem value="progress-asc">Progress (lowest first)</SelectItem>
                <SelectItem value="progress-desc">Progress (highest first)</SelectItem>
                <SelectItem value="createdAt-desc">Recently created</SelectItem>
                <SelectItem value="createdAt-asc">Oldest created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Projects grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg border">
            <div className="inline-flex h-20 w-20 rounded-full bg-muted/30 items-center justify-center mb-4">
              <Filter className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {searchQuery || statusFilter || entityFilter 
                ? "Try adjusting your filters or search query" 
                : "Start by creating your first project"}
            </p>
            {(searchQuery || statusFilter || entityFilter) ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setEntityFilter("");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => setIsCreateProjectOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
      
      {/* Create project dialog */}
      <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
            <DialogDescription>
              Add a new project to track tasks and collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project name<span className="text-destructive"> *</span>
              </label>
              <Input
                id="project-name"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="project-description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="project-description"
                placeholder="Brief description of the project"
                value={newProjectDescription}
                onChange={e => setNewProjectDescription(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="business-entity" className="text-sm font-medium">
                Business entity
              </label>
              <Select value={newProjectEntityId} onValueChange={setNewProjectEntityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a business entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {businessEntities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateProjectOpen(false);
                setNewProjectName("");
                setNewProjectDescription("");
                setNewProjectEntityId("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}