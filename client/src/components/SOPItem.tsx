import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface SOPItemProps {
  id: number;
  title: string;
  category: {
    name: string;
    color: string;
  };
  stepCount: number;
  isAiGenerated: boolean;
  createdAt: string;
}

export default function SOPItem({ id, title, category, stepCount, isAiGenerated, createdAt }: SOPItemProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };

  return (
    <Link href={`/sop/${id}`}>
      <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
        <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-300">
          <FileText className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{title}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge 
              variant="outline"
              className={`text-[10px] h-5 bg-${category.color.replace('text-', '')}/10 border-${category.color.replace('text-', '')}/30 ${category.color}`}
            >
              {category.name}
            </Badge>
            {isAiGenerated && (
              <Badge variant="secondary" className="text-[10px] h-5">
                <span className="material-icons text-xs mr-1">auto_awesome</span>
                AI Generated
              </Badge>
            )}
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="mr-2">{stepCount} {stepCount === 1 ? 'step' : 'steps'}</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center ml-auto">
              <Clock className="inline-block h-3 w-3 mr-1" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}