import { Task } from './project-types';

export type TemplateCategory = 'product_launch' | 'campaign' | 'sop' | 'sale_event';

export interface LaunchTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tasks: Task[];
  timeline: {
    startDate: string | null;
    endDate: string | null;
    duration: number; // in days
    milestones: {
      name: string;
      date: string | null;
      completed: boolean;
    }[];
  };
  placeholderCopy?: string;
  campaignNotes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  entityId?: number | null;
  entityName?: string | null;
  tags: string[];
  starred?: boolean;
}

export interface LaunchTemplateFilters {
  search: string;
  category: string;
  entity: string | number;
}