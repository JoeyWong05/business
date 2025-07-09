export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  projectId: string;
  relatedModule?: string;
  checklists?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  tags?: string[];
}

export interface Project {
  id: string;
  name: string;
  title?: string; // For compatibility with existing code
  description?: string;
  status: ProjectStatus;
  ownerId?: string;
  ownerName?: string;
  createdAt: string;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  teamMembers?: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  }[];
  tasks?: Task[];
  businessEntityId?: string | number;
  businessEntityName?: string;
  relatedModules?: string[];
  lastUpdated?: string;
  progress: number;
  priority?: TaskPriority;
  department?: string;
  tags?: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
    uploadedBy: string;
  }[];
}

export interface AiGeneratedTaskGroup {
  name: string;
  description: string;
  tasks: Task[];
}

export interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  averageCompletionTime: number; // in days
  tasksByStatus: {
    todo: number;
    inProgress: number;
    done: number;
  };
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  teamPerformance: {
    memberId: string;
    memberName: string;
    tasksAssigned: number;
    tasksCompleted: number;
    onTimePercentage: number;
  }[];
}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  estimatedTime?: string;
  tasks: {
    title: string;
    description?: string;
    priority: TaskPriority;
    relativePosition?: number;
    estimatedHours?: number;
    requiredRole?: string;
    checklists?: {
      title: string;
      items: string[];
    }[];
  }[];
}