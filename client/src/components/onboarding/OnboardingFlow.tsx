import { useEffect } from 'react';
import { useOnboarding } from './OnboardingContext';
import OnboardingWizard from './OnboardingWizard';
import { 
  HelpCircle,
  Settings,
  RefreshCw,
  Play
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const OnboardingFlow = () => {
  const { setIsOpen, resetOnboarding, onboardingCompleted } = useOnboarding();
  const [location] = useLocation();

  useEffect(() => {
    // Add classes to key UI elements for highlighting during onboarding
    const setupHighlightClasses = () => {
      // Dashboard highlight
      const dashboardArea = document.querySelector('.dashboard-stats-grid, .dashboard-main-grid');
      if (dashboardArea) {
        dashboardArea.classList.add('dashboard-highlight');
      }

      // Sidebar highlight
      const sidebar = document.querySelector('.main-sidebar, nav');
      if (sidebar) {
        sidebar.classList.add('sidebar-highlight');
      }

      // Operations highlight
      const operationsLinks = document.querySelectorAll('a[href*="operations"], a[href*="sop"]');
      operationsLinks.forEach(link => {
        link.classList.add('operations-highlight');
      });

      // Agency Killer highlight
      const agencyKillerLinks = document.querySelectorAll('a[href*="agency-killer"]');
      agencyKillerLinks.forEach(link => {
        link.classList.add('agency-killer-highlight');
      });

      // Analytics highlight
      const analyticsLinks = document.querySelectorAll('a[href*="analytics"], a[href*="reports"]');
      analyticsLinks.forEach(link => {
        link.classList.add('analytics-highlight');
      });
    };

    setupHighlightClasses();
  }, [location]);

  return (
    <>
      {/* Render the onboarding wizard component */}
      <OnboardingWizard />

      {/* Help button with restart onboarding option */}
      <div className="fixed right-4 bottom-16 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              className="h-9 w-9 rounded-full shadow-md"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help & Onboarding</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56"
          >
            <DropdownMenuLabel>Help & Guidance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              <Play className="mr-2 h-4 w-4" />
              <span>{onboardingCompleted ? 'Restart Tutorial' : 'Continue Onboarding'}</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={resetOnboarding}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Reset All Guidance</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help Center</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Onboarding Preferences</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default OnboardingFlow;