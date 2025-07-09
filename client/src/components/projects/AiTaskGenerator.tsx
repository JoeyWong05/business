import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Plus, X } from "lucide-react";
import { Task, TaskPriority, AiGeneratedTaskGroup } from "@/types/project-types";

export function AiTaskGenerator({ 
  projectId, 
  onTasksGenerated 
}: { 
  projectId: string; 
  onTasksGenerated: (tasks: Task[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Record<string, boolean>>({});
  const [generatedTaskGroups, setGeneratedTaskGroups] = useState<AiGeneratedTaskGroup[]>([]);
  const [businessArea, setBusinessArea] = useState("");
  const { toast } = useToast();

  const generateTasks = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description of what you need help with",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate AI generating tasks (would be replaced with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample generated tasks based on business areas
      const taskGroups: AiGeneratedTaskGroup[] = [];
      
      if (businessArea === "marketing" || businessArea === "") {
        taskGroups.push({
          name: "Marketing Campaign Tasks",
          description: "Essential tasks to launch a successful marketing campaign",
          tasks: [
            {
              id: `ai-task-${Date.now()}-1`,
              title: "Define target audience and campaign goals",
              description: "Research and document the primary and secondary audience segments, and set measurable campaign objectives",
              status: "todo",
              priority: "high" as TaskPriority,
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              projectId,
              relatedModule: "Marketing",
              tags: ["campaign", "planning"],
            },
            {
              id: `ai-task-${Date.now()}-2`,
              title: "Create content calendar and assets list",
              description: "Develop a detailed calendar with content topics, formats, channels, and required assets",
              status: "todo",
              priority: "medium" as TaskPriority,
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              projectId,
              relatedModule: "Marketing",
              tags: ["content", "planning"],
            },
            {
              id: `ai-task-${Date.now()}-3`,
              title: "Set up tracking and analytics",
              description: "Configure UTM parameters, conversion tracking, and reporting dashboards",
              status: "todo",
              priority: "medium" as TaskPriority,
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              projectId,
              relatedModule: "Marketing",
              tags: ["analytics", "setup"],
            }
          ]
        });
      }
      
      if (businessArea === "sales" || businessArea === "") {
        taskGroups.push({
          name: "Sales Process Optimization",
          description: "Tasks to improve sales conversion and efficiency",
          tasks: [
            {
              id: `ai-task-${Date.now()}-4`,
              title: "Update sales qualification criteria",
              description: "Review and refine lead scoring model and qualification process based on recent customer data",
              status: "todo",
              priority: "high" as TaskPriority,
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              projectId,
              relatedModule: "Sales",
              tags: ["process", "leads"],
            },
            {
              id: `ai-task-${Date.now()}-5`,
              title: "Develop sales enablement materials",
              description: "Create objection handling guide, competitor comparison sheets, and product one-pagers",
              status: "todo",
              priority: "medium" as TaskPriority,
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              projectId,
              relatedModule: "Sales",
              tags: ["materials", "enablement"],
            }
          ]
        });
      }
      
      if (businessArea === "operations" || businessArea === "") {
        taskGroups.push({
          name: "Operational Efficiency Tasks",
          description: "Tasks to streamline business operations and reduce costs",
          tasks: [
            {
              id: `ai-task-${Date.now()}-6`,
              title: "Document current workflow processes",
              description: "Create visual flowcharts and written documentation for all key business processes",
              status: "todo",
              priority: "medium" as TaskPriority,
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              projectId,
              relatedModule: "Operations",
              tags: ["documentation", "process"],
              checklists: [
                { id: "cl-1", title: "Identify all key processes", completed: false },
                { id: "cl-2", title: "Create process flowcharts", completed: false },
                { id: "cl-3", title: "Document standard operating procedures", completed: false }
              ]
            },
            {
              id: `ai-task-${Date.now()}-7`,
              title: "Identify automation opportunities",
              description: "Review processes for potential automation and estimate ROI for each opportunity",
              status: "todo",
              priority: "high" as TaskPriority,
              createdAt: new Date().toISOString(),
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              projectId,
              relatedModule: "Operations",
              tags: ["automation", "efficiency"],
            }
          ]
        });
      }
      
      setGeneratedTaskGroups(taskGroups);
      
      // Pre-select all tasks by default
      const newSelectedTasks: Record<string, boolean> = {};
      taskGroups.forEach(group => {
        group.tasks.forEach(task => {
          newSelectedTasks[task.id] = true;
        });
      });
      setSelectedTasks(newSelectedTasks);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTasks = () => {
    const tasksToAdd: Task[] = [];
    
    generatedTaskGroups.forEach(group => {
      group.tasks.forEach(task => {
        if (selectedTasks[task.id]) {
          tasksToAdd.push(task);
        }
      });
    });
    
    if (tasksToAdd.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to add to your project",
        variant: "default",
      });
      return;
    }
    
    onTasksGenerated(tasksToAdd);
    
    toast({
      title: "Tasks added",
      description: `Added ${tasksToAdd.length} tasks to your project`,
      variant: "default",
    });
    
    setIsOpen(false);
    setPrompt("");
    setBusinessArea("");
    setGeneratedTaskGroups([]);
    setSelectedTasks({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Tasks with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Task Generator</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-4">
              <Textarea
                placeholder="Describe what you're working on, and I'll suggest relevant tasks..."
                className="resize-none"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Select value={businessArea} onValueChange={setBusinessArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Focus area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All areas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={generateTasks}
                disabled={isLoading}
                className="w-full mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {generatedTaskGroups.length > 0 && (
            <div className="space-y-6 mt-4">
              {generatedTaskGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                  <h3 className="text-base font-semibold">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                  
                  <div className="space-y-2 mt-3">
                    {group.tasks.map((task, i) => (
                      <Card key={task.id} className="p-3 border border-border">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedTasks[task.id] || false}
                            onCheckedChange={(checked) => {
                              setSelectedTasks(prev => ({
                                ...prev,
                                [task.id]: !!checked
                              }));
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{task.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary/10 text-primary">
                                {task.priority}
                              </span>
                              {task.relatedModule && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">
                                  {task.relatedModule}
                                </span>
                              )}
                              {task.tags?.map((tag, tagIndex) => (
                                <span key={tagIndex} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary/50 text-secondary-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          {generatedTaskGroups.length > 0 && (
            <Button onClick={handleAddTasks}>
              <Plus className="h-4 w-4 mr-2" />
              Add Selected Tasks
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}