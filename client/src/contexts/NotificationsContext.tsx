import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string; // ISO string or relative time
  read: boolean;
  type: 'recommendation' | 'meeting' | 'sop' | 'message' | 'analytics' | 'alert' | 'update';
  priority?: 'low' | 'medium' | 'high';
  entityId?: number;
  entityName?: string;
  actionUrl?: string;
  createdAt: string;
  userId: number;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (id: number) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  clearNotification: async () => {},
  addNotification: async () => {},
  isLoading: false
});

export const useNotifications = () => useContext(NotificationsContext);

interface NotificationsProviderProps {
  children: ReactNode;
}

// Sample notifications - would come from API in a real app
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New recommendation",
    description: "AI suggested a new tool for your marketing stack",
    time: "5 min ago",
    read: false,
    type: "recommendation",
    priority: "medium",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    userId: 1
  },
  {
    id: 2,
    title: "Meeting Reminder",
    description: "Team standup starts in 15 minutes",
    time: "15 min ago",
    read: false,
    type: "meeting",
    priority: "high",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    userId: 1
  },
  {
    id: 3,
    title: "SOP Updated",
    description: "Customer Onboarding Process was updated by Craig",
    time: "3 hours ago",
    read: true,
    type: "sop",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    userId: 1
  },
  {
    id: 4,
    title: "Valuation Updated",
    description: "Business valuation for Mystery Hype has been updated",
    time: "1 day ago",
    read: false,
    type: "update",
    entityId: 2,
    entityName: "Mystery Hype",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: 1
  },
  {
    id: 5,
    title: "Campaign Launched",
    description: "Spring Drop campaign was successfully launched",
    time: "2 days ago",
    read: true,
    type: "analytics",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 1
  },
  {
    id: 6,
    title: "SOP Overdue",
    description: "Weekly inventory check SOP is overdue",
    time: "5 hours ago",
    read: false,
    type: "alert",
    priority: "high",
    actionUrl: "/operations/sops/weekly-inventory",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    userId: 1
  },
  {
    id: 7,
    title: "Weekly Forecast Not Submitted",
    description: "Please submit your weekly sales forecast",
    time: "1 day ago",
    read: false,
    type: "alert",
    priority: "medium",
    actionUrl: "/forecasting/weekly",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: 1
  }
];

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Memoize function references to prevent unnecessary re-renders
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API
      // const response = await apiRequest('GET', '/api/notifications');
      // const data = await response.json();
      // setNotifications(data);
      
      // Using mock data for now - simulating network delay
      await new Promise(resolve => setTimeout(resolve, 300)); // Reduced timeout for mobile performance
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      // Optimistic UI update for better perceived performance
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      // In a real app, this would call an API
      // await apiRequest('PATCH', `/api/notifications/${id}`, { read: true });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert optimistic update on error
      await fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistic UI update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // In a real app, this would call an API
      // await apiRequest('PATCH', '/api/notifications/mark-all-read');
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      });
      // Revert optimistic update on error
      await fetchNotifications();
    }
  }, [fetchNotifications, toast]);

  const clearNotification = useCallback(async (id: number) => {
    try {
      // Optimistic UI update
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      // In a real app, this would call an API
      // await apiRequest('DELETE', `/api/notifications/${id}`);
    } catch (error) {
      console.error("Failed to clear notification:", error);
      toast({
        title: "Error",
        description: "Failed to remove notification",
        variant: "destructive",
      });
      // Revert optimistic update on error
      await fetchNotifications();
    }
  }, [fetchNotifications, toast]);
  
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      // Create a new notification with generated ID and timestamp
      const newNotification: Notification = {
        ...notification,
        id: Date.now(), // Use timestamp as a simple ID generator
        createdAt: new Date().toISOString(),
        time: "Just now"
      };
      
      // Add to the notifications list
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast for new notification
      toast({
        title: notification.title,
        description: notification.description,
        variant: notification.priority === 'high' ? 'destructive' : 'default',
      });
      
      // In a real app, this would call an API
      // await apiRequest('POST', '/api/notifications', newNotification);
    } catch (error) {
      console.error("Failed to add notification:", error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    addNotification,
    isLoading
  }), [
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    addNotification,
    isLoading
  ]);

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
}