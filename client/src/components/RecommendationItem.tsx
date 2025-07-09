import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  AlertCircle, 
  ArrowUpCircle, 
  CheckCircle2, 
  Info, 
  PlusCircle, 
  RefreshCw, 
  UploadIcon 
} from 'lucide-react';

interface Recommendation {
  id: number;
  userId: number;
  title: string;
  description: string;
  categoryId: number;
  type: string;
  status: string;
  createdAt: string;
}

interface RecommendationItemProps {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
}

// This component handles the safe rendering of recommendation data
const RecommendationItem = ({ id, title, description, type, status }: RecommendationItemProps) => {
  // Check if recommendation data is valid
  if (!title || !description) {
    return <div className="py-3 border-b border-border last:border-0">Error: Invalid recommendation data</div>;
  }
  
  const getRecommendationIcon = () => {
    if (!type) return <Info className="h-4 w-4" />;
    
    switch (type) {
      case 'new_tool':
        return <PlusCircle className="h-4 w-4 text-green-500" />;
      case 'upgrade':
        return <ArrowUpCircle className="h-4 w-4 text-amber-500" />;
      case 'improvement':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (statusValue: string) => {
    switch(statusValue) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{statusValue}</Badge>;
    }
  };
  
  return (
    <Link href={`/recommendation/${id}`}>
      <div className="flex space-x-4 py-3 border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer">
        <div className="p-1 rounded-full bg-muted">
          {getRecommendationIcon()}
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="font-medium text-sm">{title}</div>
            {status && (
              <div className="mt-1 sm:mt-0">
                {getStatusBadge(status)}
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {description}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecommendationItem;