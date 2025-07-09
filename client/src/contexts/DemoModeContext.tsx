import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define the context type
interface DemoModeContextType {
  demoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (enabled: boolean) => void;
}

// Create the context
export const DemoModeContext = createContext<DemoModeContextType | null>(null);

// Hook for accessing demo mode
export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
}

// Provider component
interface DemoModeProviderProps {
  children: ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  // Initialize state from localStorage or default to false
  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    const storedValue = localStorage.getItem('demoMode');
    return storedValue ? JSON.parse(storedValue) : false;
  });
  
  // Toggle demo mode
  const toggleDemoMode = () => {
    setDemoModeState(prev => !prev);
  };
  
  // Set demo mode explicitly
  const setDemoMode = (enabled: boolean) => {
    setDemoModeState(enabled);
  };
  
  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('demoMode', JSON.stringify(demoMode));
  }, [demoMode]);
  
  return (
    <DemoModeContext.Provider
      value={{
        demoMode,
        toggleDemoMode,
        setDemoMode
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};