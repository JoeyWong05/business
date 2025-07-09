import { Task, TaskStatus } from "@/types/project-types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CheckSquare, Clock, Link as LinkIcon, Tag, CheckCircle, Circle, ArrowRight } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
}

export function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'urgent':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      case 'in-progress':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'done':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  const handleStatusChange = () => {
    if (!onStatusChange) return;
    
    const newStatus = task.status === 'done' 
      ? 'todo' as TaskStatus
      : task.status === 'todo' 
        ? 'in-progress' as TaskStatus
        : 'done' as TaskStatus;
    
    onStatusChange(task.id, newStatus);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const completedChecklistItems = task.checklists?.filter(item => item.completed).length || 0;
  const totalChecklistItems = task.checklists?.length || 0;

  return (
    <Card 
      className="h-full hover:shadow-md transition-all duration-200 border-opacity-80 hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-start gap-2">
        <div 
          className="mt-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange();
          }}
        >
          {getStatusIcon(task.status)}
        </div>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold line-clamp-1">{task.title}</CardTitle>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge className={`${getPriorityColor(task.priority)} capitalize`}>
            {task.priority}
          </Badge>
          
          {task.relatedModule && (
            <Badge variant="outline" className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              {task.relatedModule}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Clock className="h-4 w-4" />
          <span className={isOverdue ? 'text-destructive font-medium' : ''}>
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {formatDate(task.dueDate)}
          </span>
        </div>
        
        {totalChecklistItems > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <CheckSquare className="h-4 w-4" />
            <span>
              {completedChecklistItems} of {totalChecklistItems} items
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        {task.assigneeName && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
              <AvatarFallback className="text-xs">
                {task.assigneeName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
          </div>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <div className="flex gap-1">
              {task.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}