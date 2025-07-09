import React, { ReactNode } from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Users,
  CreditCard,
  Calendar,
  ShoppingCart,
  Search,
  Info,
  Building,
  BarChart,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface RoleBasedLayoutProps {
  children: ReactNode;
  showRoleSelector?: boolean;
}

interface RoleView {
  key: string;
  title: string;
  description: string;
  icon: ReactNode;
  primaryActions: {
    name: string;
    path: string;
    description: string;
    icon: ReactNode;
  }[];
  secondaryContent?: ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ 
  children, 
  showRoleSelector = true 
}) => {
  const { userRole, setUserRole } = useUserRole();

  // Define role views for different user types
  const roleViews: Record<string, RoleView> = {
    admin: {
      key: 'admin',
      title: 'Admin Dashboard',
      description: 'Manage all aspects of your business ecosystem',
      icon: <Settings className="h-6 w-6" />,
      primaryActions: [
        {
          name: 'Financial Overview',
          path: '/financial-health',
          description: 'Track revenues, expenses, and financial metrics',
          icon: <CreditCard className="h-5 w-5" />,
        },
        {
          name: 'Team Management',
          path: '/team',
          description: 'Manage team members and permissions',
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: 'Business Operations',
          path: '/business-operations',
          description: 'Oversee day-to-day operations and tools',
          icon: <Building className="h-5 w-5" />,
        },
      ],
    },
    manager: {
      key: 'manager',
      title: 'Manager View',
      description: 'Monitor and optimize your department operations',
      icon: <Users className="h-6 w-6" />,
      primaryActions: [
        {
          name: 'Team Performance',
          path: '/team',
          description: 'Track team productivity and assignments',
          icon: <BarChart className="h-5 w-5" />,
        },
        {
          name: 'Department Operations',
          path: '/business-operations',
          description: 'Manage department tools and workflows',
          icon: <Building className="h-5 w-5" />,
        },
        {
          name: 'Calendar & Meetings',
          path: '/meetings',
          description: 'Schedule and manage team meetings',
          icon: <Calendar className="h-5 w-5" />,
        },
      ],
    },
    employee: {
      key: 'employee',
      title: 'Employee Portal',
      description: 'Access tools and information for your daily tasks',
      icon: <FileText className="h-6 w-6" />,
      primaryActions: [
        {
          name: 'My Tasks',
          path: '/department-automation',
          description: 'View and manage your assigned tasks',
          icon: <FileText className="h-5 w-5" />,
        },
        {
          name: 'Team Directory',
          path: '/team',
          description: 'Connect with your teammates',
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: 'SOPs & Documentation',
          path: '/categories',
          description: 'Access standard operating procedures',
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    customer: {
      key: 'customer',
      title: 'Customer Portal',
      description: 'Manage your account and track orders',
      icon: <ShoppingCart className="h-6 w-6" />,
      primaryActions: [
        {
          name: 'My Orders',
          path: '/orders',
          description: 'View and track your order history',
          icon: <ShoppingCart className="h-5 w-5" />,
        },
        {
          name: 'Support',
          path: '/customer-inquiries',
          description: 'Get help with your orders or products',
          icon: <MessageSquare className="h-5 w-5" />,
        },
        {
          name: 'Account Settings',
          path: '/account',
          description: 'Manage your account information',
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  };

  // Get current role view
  const currentView = roleViews[userRole];

  // Role selector for demonstration/testing purposes
  const RoleSelector = () => (
    <div className="mb-6 flex justify-end">
      <Select
        value={userRole}
        onValueChange={(value: 'admin' | 'manager' | 'employee' | 'customer') => 
          setUserRole(value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="employee">Employee</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {showRoleSelector && <RoleSelector />}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">{currentView.title}</CardTitle>
                <CardDescription>{currentView.description}</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {currentView.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {children}
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions for {userRole === 'admin' ? 'administrators' : 
                  userRole === 'manager' ? 'managers' : 
                  userRole === 'employee' ? 'employees' : 'customers'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentView.primaryActions.map((action, index) => (
                <a key={index} href={action.path} className="block">
                  <div className="flex items-start space-x-4 rounded-md p-3 transition-all hover:bg-secondary">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background">
                      {action.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{action.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Find more tools
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Tips for your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <Info className="h-5 w-5 text-blue-500" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userRole === 'admin' 
                      ? 'As an admin, you have full access to configure all aspects of the system.' 
                      : userRole === 'manager' 
                      ? 'As a manager, you can oversee your team and department operations.' 
                      : userRole === 'employee' 
                      ? 'As an employee, you can access tools and resources for your daily tasks.' 
                      : 'As a customer, you can manage your orders and account information.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLayout;