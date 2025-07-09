import { useEffect, useState } from 'react';
import { useOnboarding } from './OnboardingContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileSpreadsheet, MessageSquare, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dashboard tooltips that appear after the initial onboarding walkthrough
const DashboardTooltips = () => {
  const { onboardingCompleted, lastInteraction, updateLastInteraction } = useOnboarding();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentTooltip, setCurrentTooltip] = useState<string | null>(null);
  const [tooltipShown, setTooltipShown] = useState(false);
  
  // Default tooltips to show after onboarding
  const tooltips = [
    {
      id: 'dashboard-metrics',
      selector: '.dashboard-metrics',
      content: 'These metrics provide a real-time snapshot of your business performance.',
      icon: <BarChart3 className="h-4 w-4 mr-1" />,
      delay: 3000,
    },
    {
      id: 'create-sop',
      selector: '.create-sop-card, .sop-button',
      content: 'Create your first SOP to document important business processes.',
      icon: <FileSpreadsheet className="h-4 w-4 mr-1" />,
      delay: 8000,
    },
    {
      id: 'ai-assistant',
      selector: '.ai-assistant, .ai-button',
      content: 'Ask our AI assistant for help with any task or business challenge.',
      icon: <Zap className="h-4 w-4 mr-1 text-yellow-500" />,
      delay: 5000,
    },
    {
      id: 'notifications',
      selector: '.notifications-button',
      content: 'Stay updated with important changes and announcements.',
      icon: <MessageSquare className="h-4 w-4 mr-1" />,
      delay: 10000,
    }
  ];
  
  // Load completed steps from localStorage
  useEffect(() => {
    const savedSteps = localStorage.getItem('dmphq_tooltip_steps');
    if (savedSteps) {
      setCompletedSteps(JSON.parse(savedSteps));
    } else {
      setCompletedSteps([]);
    }
  }, []);
  
  // Save completed steps to localStorage
  useEffect(() => {
    if (completedSteps.length > 0) {
      localStorage.setItem('dmphq_tooltip_steps', JSON.stringify(completedSteps));
    }
  }, [completedSteps]);
  
  // Show tooltips with dynamic timing
  useEffect(() => {
    if (!onboardingCompleted || tooltipShown || currentTooltip) return;
    
    // Find next tooltip that hasn't been shown
    const availableTooltips = tooltips.filter(tooltip => 
      !completedSteps.includes(tooltip.id) && 
      document.querySelector(tooltip.selector)
    );
    
    if (availableTooltips.length === 0) return;
    
    // Choose the first available tooltip
    const nextTooltip = availableTooltips[0];
    
    // Set a timeout to show the tooltip
    const timer = setTimeout(() => {
      setCurrentTooltip(nextTooltip.id);
      setTooltipShown(true);
    }, nextTooltip.delay);
    
    return () => clearTimeout(timer);
  }, [onboardingCompleted, completedSteps, tooltipShown, currentTooltip]);
  
  const dismissTooltip = (tooltipId: string) => {
    setCompletedSteps([...completedSteps, tooltipId]);
    setCurrentTooltip(null);
    setTooltipShown(false);
    
    // Update last interaction in context
    updateLastInteraction(tooltipId);
  };
  
  if (!currentTooltip) return null;
  
  const tooltip = tooltips.find(t => t.id === currentTooltip);
  if (!tooltip) return null;
  
  const targetElement = document.querySelector(tooltip.selector);
  if (!targetElement) return null;
  
  return (
    <TooltipProvider>
      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <div 
            className="absolute" 
            style={{ 
              position: 'absolute',
              top: targetElement.getBoundingClientRect().top + window.scrollY,
              left: targetElement.getBoundingClientRect().left + window.scrollX,
              width: targetElement.getBoundingClientRect().width,
              height: targetElement.getBoundingClientRect().height,
              pointerEvents: 'none',
              zIndex: 50
            }} 
          />
        </TooltipTrigger>
        <TooltipContent 
          align="center" 
          className="p-4 max-w-xs"
          sideOffset={10}
        >
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium">
              {tooltip.icon}
              <span>Pro Tip</span>
            </div>
            <p className="text-sm text-muted-foreground">{tooltip.content}</p>
            <div className="flex justify-end pt-1">
              <Button 
                size="sm"
                variant="outline" 
                onClick={() => dismissTooltip(tooltip.id)}
              >
                Got it
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DashboardTooltips;