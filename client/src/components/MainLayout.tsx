import React, { ReactNode, useState } from 'react';
import QuickActionBar from './QuickActionBar';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Settings
} from 'lucide-react';
import DashboardCustomizer from './DashboardCustomizer';
import ProfileSwitcher from './ProfileSwitcher';
import BrandSwitcher, { Brand } from './BrandSwitcher';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hidePersonalizationControls?: boolean;
}

export default function MainLayout({ 
  children, 
  title, 
  description,
  hidePersonalizationControls = false
}: MainLayoutProps) {
  // Using PersonalizationContext properly
  const { 
    settings,
    updateSettings,
    activeBrand,
    setActiveBrand,
    availableBrands,
    activeUserRole,
    setActiveUserRole
  } = usePersonalization();
  
  // Using DemoModeContext for demo mode
  const { demoMode: demoMode, toggleDemoMode } = useDemoMode();
  
  const [isCustomizingWidgets, setIsCustomizingWidgets] = useState(false);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl w-full">
        {!hidePersonalizationControls && (
          <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center space-x-2">
              {activeBrand && availableBrands && (
                <BrandSwitcher className="min-w-[200px]" />
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="demo-mode" 
                  checked={demoMode} 
                  onCheckedChange={toggleDemoMode} 
                />
                <Label htmlFor="demo-mode" className="text-sm">Demo Mode</Label>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setIsCustomizingWidgets(true)}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Customize</span>
              </Button>
            </div>
          </div>
        )}
        
        {(title || description) && (
          <div className="mb-4 sm:mb-6">
            {title && <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>}
            {description && <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-3xl">{description}</p>}
          </div>
        )}
        
        {children}
        
        {/* Quick Action Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <QuickActionBar />
        </div>
        
        {/* Dashboard Customization Dialog */}
        <DashboardCustomizer
          isOpen={isCustomizingWidgets}
          onClose={() => setIsCustomizingWidgets(false)}
          widgets={settings.widgets}
          onSaveWidgets={(updatedWidgets) => {
            updateSettings(prev => ({
              ...prev,
              widgets: updatedWidgets
            }))
          }}
        />
      </div>
    </main>
  );
}