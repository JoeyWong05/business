import React, { useState, createContext, useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Context for managing demo mode state
interface DemoModeContextType {
  demoMode: boolean;
  toggleDemoMode: () => void;
  resetDemoData: () => void;
  populateDemoData: () => void;
  isResetting: boolean;
  isPopulating: boolean;
}

const DemoModeContext = createContext<DemoModeContextType>({
  demoMode: true, // Default to demo mode enabled for initial experience
  toggleDemoMode: () => {},
  resetDemoData: () => {},
  populateDemoData: () => {},
  isResetting: false,
  isPopulating: false
});

// DEPRECATED: Use the hook from @/hooks/use-demo-mode instead
// This is kept for backward compatibility
export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoMode, setDemoMode] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const { toast } = useToast();

  // Load demo mode state from localStorage
  useEffect(() => {
    const storedDemoMode = localStorage.getItem('demoMode');
    if (storedDemoMode !== null) {
      setDemoMode(storedDemoMode === 'true');
    }
  }, []);

  // Save demo mode state to localStorage
  useEffect(() => {
    localStorage.setItem('demoMode', demoMode.toString());
  }, [demoMode]);

  const toggleDemoMode = async () => {
    const newDemoMode = !demoMode;
    setDemoMode(newDemoMode);
    
    if (newDemoMode) {
      // When turning on demo mode, we should populate with impressive demo data
      setIsPopulating(true);
      try {
        // In a real implementation, this would call an API endpoint to populate demo data
        // await apiRequest('POST', '/api/populate-demo-data');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Invalidate all queries to refresh data with demo content
        queryClient.invalidateQueries();
        
        toast({
          title: "Demo Mode Enabled",
          description: "Impressive demo data is now being displayed across the platform.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Demo Mode Error",
          description: "There was an error enabling demo mode. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsPopulating(false);
      }
    } else {
      // When turning off demo mode, we should revert to real data
      toast({
        title: "Demo Mode Disabled",
        description: "You are now viewing actual data from your connected systems.",
        variant: "default",
      });
      // Invalidate queries to refresh with real data
      queryClient.invalidateQueries();
    }
  };

  const resetDemoData = async () => {
    setIsResetting(true);
    try {
      // In a real implementation, this would call an API endpoint to reset demo data
      // await apiRequest('POST', '/api/reset-demo-data');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
      
      toast({
        title: "Demo Data Reset",
        description: "All demo data has been reset to its initial state.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "There was an error resetting the demo data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const populateDemoData = async () => {
    setIsPopulating(true);
    try {
      // In a real implementation, this would call an API endpoint to populate demo data
      // await apiRequest('POST', '/api/populate-demo-data');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
      
      toast({
        title: "Demo Data Populated",
        description: "Demo data has been populated across all sections of the platform.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Population Failed",
        description: "There was an error populating the demo data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <DemoModeContext.Provider value={{ 
      demoMode, 
      toggleDemoMode, 
      resetDemoData, 
      populateDemoData,
      isResetting,
      isPopulating
    }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const DemoModeToggle: React.FC = () => {
  const { demoMode, toggleDemoMode, resetDemoData, populateDemoData, isResetting, isPopulating } = useDemoMode();
  const [activeTab, setActiveTab] = useState<string>("controls");

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Demo Mode</CardTitle>
          <CardDescription>
            Toggle between demo and real data
          </CardDescription>
        </div>
        <Badge variant={demoMode ? "default" : "outline"} className="px-3 py-1">
          {demoMode ? "Enabled" : "Disabled"}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="demo-mode" 
                checked={demoMode} 
                onCheckedChange={toggleDemoMode}
              />
              <Label htmlFor="demo-mode" className="font-medium">
                {demoMode ? "Demo Mode Active" : "Demo Mode Inactive"}
              </Label>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={resetDemoData}
                disabled={!demoMode || isResetting}
              >
                {isResetting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Reset Demo Data
              </Button>
              
              <Button 
                variant="default" 
                className="w-full flex items-center justify-center gap-2"
                onClick={populateDemoData}
                disabled={!demoMode || isPopulating}
              >
                {isPopulating ? (
                  <Sparkles className="h-4 w-4 animate-pulse" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Populate Demo Data
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Demo mode shows placeholder data to demonstrate platform capabilities.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Use "Populate Demo Data" to generate comprehensive sample data across all sections.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Disable Demo Mode when you're ready to connect your real business data sources.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground w-full text-center">
          {demoMode ? "You're viewing simulated data for demonstration purposes" : "You're viewing actual business data"}
        </p>
      </CardFooter>
    </Card>
  );
};

// Floating demo mode toggle
export const FloatingDemoModeToggle: React.FC = () => {
  const { demoMode, toggleDemoMode } = useDemoMode();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-card border rounded-lg shadow-lg p-4 mb-2 w-72 animate-in fade-in slide-in-from-right-5 duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Demo Mode {demoMode ? "Active" : "Inactive"}</h3>
            <Badge variant={demoMode ? "default" : "outline"} className="px-2 py-0">
              {demoMode ? "On" : "Off"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {demoMode 
              ? "You're viewing simulated data for demonstration purposes." 
              : "You're viewing actual business data."}
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="demo-mode-floating" 
                checked={demoMode} 
                onCheckedChange={toggleDemoMode}
              />
              <Label htmlFor="demo-mode-floating" className="text-sm">
                {demoMode ? "Enabled" : "Disabled"}
              </Label>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(prev => !prev)}
        size="sm"
        variant={demoMode ? "default" : "outline"}
        className={`flex items-center gap-2 rounded-full shadow-md px-4 py-2 ${!isOpen && demoMode ? 'animate-pulse' : ''}`}
      >
        <Sparkles className="h-5 w-5" />
        <span className="font-medium">Demo Mode {demoMode ? "ON" : "OFF"}</span>
      </Button>
    </div>
  );
};

export default DemoModeToggle;