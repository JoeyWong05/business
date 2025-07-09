export type TaskStatus = 'assigned' | 'in-progress' | 'blocked' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface VirtualAssistant {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: string;
  status: 'active' | 'offline' | 'busy';
  hourlyRate: number;
  hoursThisWeek: number;
  lastActive: string;
  skills: string[];
  performanceRating?: number;
}

export interface VATask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string; // VA ID
  assignedToName: string;
  assignedBy: string; // User ID
  assignedByName: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  blockedReason?: string;
  module: string; // Which module this task is related to (CRM, Finance, etc.)
  notes?: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  checklistItems?: {
    id: string;
    text: string;
    isComplete: boolean;
  }[];
  tags?: string[];
}

export interface VADailySummary {
  vaId: string;
  date: string;
  tasksAssigned: number;
  tasksCompleted: number;
  tasksOverdue: number;
  hoursLogged: number;
  performanceScore?: number;
  notes?: string;
}

export interface AITaskSuggestion {
  id: string;
  vaId: string;
  taskTitle: string;
  taskDescription: string;
  priority: TaskPriority;
  suggestedDueDate: string;
  module: string;
  reasonForSuggestion: string;
  isApplied: boolean;
}