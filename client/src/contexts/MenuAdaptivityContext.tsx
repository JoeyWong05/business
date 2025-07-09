import React, { createContext, useContext, useState, useEffect } from 'react';

type MenuItemUsage = {
  path: string;
  name: string;
  clickCount: number;
  lastClicked: Date;
  // Score calculated based on recency and frequency
  score: number;
};

interface MenuAdaptivityContextType {
  // Track when a menu item is clicked
  trackMenuItemClick: (path: string, name: string) => void;
  
  // Get most frequently used menu items for quick access
  getFrequentlyUsedItems: (limit?: number) => MenuItemUsage[];
  
  // Get recently used menu items
  getRecentlyUsedItems: (limit?: number) => MenuItemUsage[];
  
  // Get personalized suggestions based on usage patterns
  getPersonalizedSuggestions: (currentPath: string, limit?: number) => MenuItemUsage[];
  
  // Reset all usage data (for testing or user preference)
  resetUsageData: () => void;
}

const MenuAdaptivityContext = createContext<MenuAdaptivityContextType | undefined>(undefined);

export function useMenuAdaptivity() {
  const context = useContext(MenuAdaptivityContext);
  if (context === undefined) {
    throw new Error('useMenuAdaptivity must be used within a MenuAdaptivityProvider');
  }
  return context;
}

export const MENU_USAGE_STORAGE_KEY = 'dmphq_menu_usage_data';

export function MenuAdaptivityProvider({ children }: { children: React.ReactNode }) {
  const [menuItemsUsage, setMenuItemsUsage] = useState<Record<string, MenuItemUsage>>({});
  
  // Load usage data from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(MENU_USAGE_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Convert string dates back to Date objects and recalculate scores
        const processedData: Record<string, MenuItemUsage> = {};
        for (const key in parsedData) {
          processedData[key] = {
            ...parsedData[key],
            lastClicked: new Date(parsedData[key].lastClicked),
            // Recalculate score
            score: calculateScore(
              parsedData[key].clickCount, 
              new Date(parsedData[key].lastClicked)
            )
          };
        }
        
        setMenuItemsUsage(processedData);
      }
    } catch (error) {
      console.error('Error loading menu usage data:', error);
      // If there's an error loading, start fresh
      setMenuItemsUsage({});
    }
  }, []);
  
  // Save to localStorage whenever the data changes
  useEffect(() => {
    if (Object.keys(menuItemsUsage).length > 0) {
      localStorage.setItem(MENU_USAGE_STORAGE_KEY, JSON.stringify(menuItemsUsage));
    }
  }, [menuItemsUsage]);
  
  // Calculate score based on recency and frequency
  const calculateScore = (clickCount: number, lastClicked: Date): number => {
    const now = new Date();
    const daysSinceLastClick = Math.max(
      0, 
      (now.getTime() - lastClicked.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Recency factor: Exponential decay over time (0.8^days)
    const recencyFactor = Math.pow(0.8, Math.min(daysSinceLastClick, 30));
    
    // Frequency factor: Log scale to prevent very frequent items from dominating
    const frequencyFactor = Math.log10(clickCount + 1);
    
    // Combined score
    return recencyFactor * frequencyFactor * 10;
  };
  
  // Track a menu item click
  const trackMenuItemClick = (path: string, name: string) => {
    setMenuItemsUsage(prev => {
      const now = new Date();
      const currentItem = prev[path] || {
        path,
        name,
        clickCount: 0,
        lastClicked: now,
        score: 0
      };
      
      const updatedItem = {
        ...currentItem,
        clickCount: currentItem.clickCount + 1,
        lastClicked: now,
        score: calculateScore(currentItem.clickCount + 1, now)
      };
      
      return { ...prev, [path]: updatedItem };
    });
  };
  
  // Get frequently used items sorted by click count
  const getFrequentlyUsedItems = (limit = 5): MenuItemUsage[] => {
    return Object.values(menuItemsUsage)
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, limit);
  };
  
  // Get recently used items sorted by last clicked time
  const getRecentlyUsedItems = (limit = 5): MenuItemUsage[] => {
    return Object.values(menuItemsUsage)
      .sort((a, b) => b.lastClicked.getTime() - a.lastClicked.getTime())
      .slice(0, limit);
  };
  
  // Get personalized suggestions based on current path and usage patterns
  const getPersonalizedSuggestions = (currentPath: string, limit = 3): MenuItemUsage[] => {
    // First, look for paths that are commonly accessed after the current path
    // This would require path transition tracking which we can add later
    
    // For now, just return items with the highest overall score
    return Object.values(menuItemsUsage)
      .filter(item => item.path !== currentPath) // Exclude current path
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };
  
  // Reset all usage data
  const resetUsageData = () => {
    setMenuItemsUsage({});
    localStorage.removeItem(MENU_USAGE_STORAGE_KEY);
  };
  
  const value = {
    trackMenuItemClick,
    getFrequentlyUsedItems,
    getRecentlyUsedItems,
    getPersonalizedSuggestions,
    resetUsageData
  };
  
  return (
    <MenuAdaptivityContext.Provider value={value}>
      {children}
    </MenuAdaptivityContext.Provider>
  );
}