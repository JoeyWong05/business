import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { CheckCircle2, ChevronRight, Award, Rocket, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import confetti from 'canvas-confetti';

export const OnboardingComplete: React.FC = () => {
  const { onboardingState, completeOnboarding } = useOnboarding();

  // Celebrate with confetti effect on mount
  React.useEffect(() => {
    // Only show confetti if the component is mounted
    const timer = setTimeout(() => {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (error) {
        console.error('Confetti error:', error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="h-9 w-9 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">You're all set!</h3>
        <p className="text-muted-foreground">
          Your workspace is ready to use. Here's what you've accomplished:
        </p>
      </div>

      <div className="space-y-4">
        {/* Setup summary */}
        <Card className="bg-muted/10">
          <CardContent className="p-4 space-y-4">
            {onboardingState.businessInfo.name && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Business profile set up</p>
                  <p className="text-sm text-muted-foreground">
                    {onboardingState.businessInfo.name} • {onboardingState.businessInfo.industry}
                  </p>
                </div>
              </div>
            )}

            {Object.values(onboardingState.toolConnections).some(
              status => status === 'connected'
            ) && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Tools connected</p>
                  <p className="text-sm text-muted-foreground">
                    {Object.values(onboardingState.toolConnections).filter(
                      status => status === 'connected'
                    ).length} tools connected to your workspace
                  </p>
                </div>
              </div>
            )}

            {onboardingState.teamInvites.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Team members invited</p>
                  <p className="text-sm text-muted-foreground">
                    {onboardingState.teamInvites.length} team {onboardingState.teamInvites.length === 1 ? 'member' : 'members'} ready to collaborate
                  </p>
                </div>
              </div>
            )}

            {onboardingState.selectedModules.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Modules selected</p>
                  <p className="text-sm text-muted-foreground">
                    {onboardingState.selectedModules.length} modules ready for use
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Workspace setup progress</p>
            <p className="text-sm font-medium">{onboardingState.onboardingProgress}%</p>
          </div>
          <Progress value={onboardingState.onboardingProgress} className="h-2" />
        </div>

        <Separator className="my-4" />

        {/* Next steps */}
        <div className="space-y-4">
          <h4 className="font-medium">Recommended next steps:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <div className="text-left">
                  <p className="font-medium mb-0.5">Complete your profile</p>
                  <p className="text-xs text-muted-foreground">Add more details about your business</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-3 px-4">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium mb-0.5">Explore the dashboard</p>
                  <p className="text-xs text-muted-foreground">Get familiar with your workspace</p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-6 flex gap-3">
        <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-primary">Need help getting started?</h4>
          <p className="text-sm text-muted-foreground">
            Our AI assistant can guide you through features and answer your questions anytime.
            Just click the "Help" button in the bottom corner of your screen.
          </p>
        </div>
      </div>
    </div>
  );
};