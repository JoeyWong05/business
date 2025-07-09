import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useOnboarding } from '../OnboardingContext';
import { Lightbulb, UsersRound, LineChart, Workflow, Building2 } from 'lucide-react';

export const Welcome: React.FC = () => {
  const { onboardingState } = useOnboarding();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Your all-in-one business command center</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          DMPHQ helps you manage every aspect of your business in one place - from sales and operations to marketing and compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-4 flex gap-3">
            <div className="bg-primary/10 p-2 rounded-full h-fit">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Add your business</h4>
              <p className="text-sm text-muted-foreground">Set up the basic details about your business to get started.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-4 flex gap-3">
            <div className="bg-primary/10 p-2 rounded-full h-fit">
              <Workflow className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Connect your tools</h4>
              <p className="text-sm text-muted-foreground">Integrate with the tools you already use or try our built-in options.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-4 flex gap-3">
            <div className="bg-primary/10 p-2 rounded-full h-fit">
              <UsersRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Invite your team</h4>
              <p className="text-sm text-muted-foreground">Bring in your team members and assign them roles within the system.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-4 flex gap-3">
            <div className="bg-primary/10 p-2 rounded-full h-fit">
              <LineChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Start growing</h4>
              <p className="text-sm text-muted-foreground">Use our tools and insights to streamline operations and grow your business.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg border mt-6 flex gap-3">
        <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium">Quick Setup Mode Available</h4>
          <p className="text-sm text-muted-foreground">
            Not ready to connect everything right now? Use Quick Setup to explore features with sample data and connect your tools later.
          </p>
        </div>
      </div>
    </div>
  );
};