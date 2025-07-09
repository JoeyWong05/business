import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskPriority, Task } from "@/types/project-types";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle,
  Tag,
  GripVertical,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface SortableTaskProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onPriorityChange?: (taskId: string, newPriority: TaskPriority) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export default function SortableTask({
  task,
  onStatusChange,
  onPriorityChange,
  onEdit,
  onDelete
}: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get priority class
  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-slate-100 text-slate-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-amber-100 text-amber-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // Calculate days remaining or overdue
  const getDaysRemaining = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    
    // Reset time to compare dates only
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Badge variant="destructive">{Math.abs(diffDays)}d overdue</Badge>;
    } else if (diffDays === 0) {
      return <Badge className="bg-amber-100 text-amber-800">Due today</Badge>;
    } else if (diffDays <= 2) {
      return <Badge className="bg-amber-100 text-amber-800">{diffDays}d left</Badge>;
    } else {
      return <Badge variant="outline">{diffDays}d left</Badge>;
    }
  };

  // Calculate completion percentage based on checklist items
  const getCompletionPercentage = () => {
    if (!task.checklists || task.checklists.length === 0) return 0;
    
    const completedItems = task.checklists.filter(item => item.completed).length;
    return Math.round((completedItems / task.checklists.length) * 100);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative mb-3"
    >
      <Card className="shadow-sm border hover:shadow-md transition-shadow">
        {/* Drag handle */}
        <div 
          className="absolute top-0 left-0 h-full flex items-center px-2 cursor-grab opacity-50 hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <CardHeader className="pb-2 pl-10">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium line-clamp-2">{task.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onStatusChange && (
                  <>
                    <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
                      Move to Todo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>
                      Move to In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
                      Mark as Done
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {onPriorityChange && (
                  <>
                    <DropdownMenuItem onClick={() => onPriorityChange(task.id, 'low')}>
                      Set Low Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPriorityChange(task.id, 'medium')}>
                      Set Medium Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPriorityChange(task.id, 'high')}>
                      Set High Priority
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPriorityChange(task.id, 'urgent')}>
                      Set Urgent
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(task.id)}>
                    Edit Task
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    Delete Task
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2 pl-10">
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline" className={getPriorityClass(task.priority)}>
              {task.priority}
            </Badge>
            
            {getDaysRemaining()}
            
            {task.tags && task.tags.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {task.tags[0]}{task.tags.length > 1 ? ` +${task.tags.length - 1}` : ''}
              </Badge>
            )}
          </div>
          
          {task.checklists && task.checklists.length > 0 && (
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{getCompletionPercentage()}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-1.5" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pl-10 pb-3">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {task.assigneeId && (
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={task.assigneeAvatar || undefined} 
                    alt={task.assigneeName || "Assignee"} 
                  />
                  <AvatarFallback className="text-xs">
                    {task.assigneeName ? task.assigneeName.substring(0, 2).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(task.dueDate)}
              </div>
            </div>
            
            <div>
              {task.status === 'done' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : task.priority === 'urgent' ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}