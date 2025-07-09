import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, PlusCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DashboardProgressTracker: React.FC = () => {
  const { onboardingState, showOnboarding } = useOnboarding();

  // Only show the tracker if the user has completed onboarding
  if (!onboardingState.hasCompletedOnboarding) {
    return null;
  }

  // Define the setup tasks
  const setupTasks = [
    {
      id: 'business_info',
      name: 'Complete business profile',
      completed: Object.values(onboardingState.businessInfo).filter(Boolean).length >= 3,
      action: () => showOnboarding()
    },
    {
      id: 'tools_connection',
      name: 'Connect tools',
      completed: Object.values(onboardingState.toolConnections).some(status => status === 'connected'),
      action: () => showOnboarding()
    },
    {
      id: 'team_members',
      name: 'Invite team members',
      completed: onboardingState.teamInvites.length > 0,
      action: () => showOnboarding()
    },
    {
      id: 'modules',
      name: 'Select modules',
      completed: onboardingState.selectedModules.length > 0,
      action: () => showOnboarding()
    }
  ];

  // Count completed tasks
  const completedTasks = setupTasks.filter(task => task.completed).length;
  const progress = Math.round((completedTasks / setupTasks.length) * 100);

  // Don't show the tracker if all tasks are completed
  if (completedTasks === setupTasks.length) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          Getting Started
          <span className="text-sm font-normal ml-auto">
            {completedTasks} of {setupTasks.length}
          </span>
        </CardTitle>
        <CardDescription>
          Complete these steps to set up your workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <div className="space-y-2">
          {setupTasks.map(task => (
            <div key={task.id} className="flex items-center">
              <div className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                task.completed ? "text-green-600" : "text-muted-foreground"
              )}>
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <PlusCircle className="h-5 w-5" />
                )}
              </div>
              <span className={cn(
                "ml-2 text-sm",
                task.completed ? "line-through text-muted-foreground" : ""
              )}>
                {task.name}
              </span>
              {!task.completed && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={task.action}
                  className="ml-auto text-primary text-xs h-6 px-2"
                >
                  Set up
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs h-7"
            onClick={showOnboarding}
          >
            Continue Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};