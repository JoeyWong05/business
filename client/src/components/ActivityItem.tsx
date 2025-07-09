import { formatDistanceToNow } from "date-fns";
import { 
  FileText, 
  Bell, 
  Clock, 
  Star, 
  Calendar, 
  BarChart, 
  Settings, 
  Users,
  Wrench,
  CheckCircle
} from "lucide-react";

interface ActivityProps {
  // Support both direct activity and props passed individually
  activity?: {
    id: number;
    userId: number;
    type: string;
    description: string;
    metadata?: any;
    createdAt: string;
  };
  // For direct prop passing
  icon?: string;
  iconBgClass?: string;
  iconColor?: string;
  description?: string;
  timestamp?: string;
}

export default function ActivityItem({ 
  activity, 
  icon, 
  iconBgClass, 
  iconColor, 
  description, 
  timestamp 
}: ActivityProps) {
  // Format time if a valid date string is provided
  let formattedTime = "Just now";
  try {
    if (activity?.createdAt) {
      formattedTime = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });
    } else if (timestamp) {
      formattedTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    }
  } catch (error) {
    console.error("Invalid date format:", activity?.createdAt || timestamp);
  }

  // If direct activity object is provided, use that
  const displayDescription = description || activity?.description;
  const activityType = activity?.type;

  // Determine icon based on activity type or direct prop
  const getActivityIcon = (type?: string) => {
    // If material icon name is passed directly, use it
    if (icon) {
      return <span className={`material-icons text-base ${iconColor || 'text-primary'}`}>{icon}</span>;
    }
    
    // Otherwise use lucide icons based on activity type
    switch (type) {
      case "added_tool":
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case "generated_sop":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "subscription_renewed":
        return <CheckCircle className="h-4 w-4 text-amber-500" />;
      case "meeting_scheduled":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "notification":
        return <Bell className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get activity icon background color based on type or direct prop
  const getIconBgClass = (type?: string) => {
    // If bg class is passed directly, use it
    if (iconBgClass) {
      return iconBgClass;
    }
    
    // Otherwise determine based on activity type
    switch (type) {
      case "added_tool":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "generated_sop":
        return "bg-green-100 dark:bg-green-900/30";
      case "subscription_renewed":
        return "bg-amber-100 dark:bg-amber-900/30";
      case "meeting_scheduled":
        return "bg-purple-100 dark:bg-purple-900/30";
      case "task_completed":
        return "bg-green-100 dark:bg-green-900/30";
      case "notification":
        return "bg-red-100 dark:bg-red-900/30";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${getIconBgClass(activityType)} rounded-full p-2`}>
          {getActivityIcon(activityType)}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-foreground">
            {displayDescription}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
}
