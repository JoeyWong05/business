import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

type MenuItemKey = string;

interface MenuInteraction {
  key: MenuItemKey;
  count: number;
  lastAccessed: number;
}

interface AdaptiveMenuContextProps {
  trackInteraction: (menuItemKey: MenuItemKey) => void;
  getFrequentItems: (limit?: number) => MenuItemKey[];
  getRecentItems: (limit?: number) => MenuItemKey[];
  getRecommendedItems: (limit?: number) => MenuItemKey[];
  getInteractionData: () => MenuInteraction[];
  clearInteractionData: () => void;
}

const AdaptiveMenuContext = createContext<AdaptiveMenuContextProps | undefined>(undefined);

export function AdaptiveMenuProvider({ children }: { children: React.ReactNode }) {
  const [interactionData, setInteractionData] = useLocalStorage<MenuInteraction[]>(
    'menu-interaction-data',
    []
  );

  // Track a menu interaction
  const trackInteraction = (menuItemKey: MenuItemKey) => {
    setInteractionData(prev => {
      const existingItem = prev.find(item => item.key === menuItemKey);
      
      if (existingItem) {
        // Update existing item
        return prev.map(item => 
          item.key === menuItemKey 
            ? { ...item, count: item.count + 1, lastAccessed: Date.now() }
            : item
        );
      } else {
        // Add new item
        return [...prev, { key: menuItemKey, count: 1, lastAccessed: Date.now() }];
      }
    });
  };

  // Get most frequently accessed items
  const getFrequentItems = (limit = 5): MenuItemKey[] => {
    return [...interactionData]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => item.key);
  };

  // Get most recently accessed items
  const getRecentItems = (limit = 5): MenuItemKey[] => {
    return [...interactionData]
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, limit)
      .map(item => item.key);
  };

  // Get recommended items based on frequency and recency
  const getRecommendedItems = (limit = 5): MenuItemKey[] => {
    // Calculate a score based on frequency and recency
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // ms in a week
    
    return [...interactionData]
      .map(item => {
        const recencyScore = Math.max(0, 1 - (now - item.lastAccessed) / oneWeek);
        const frequencyScore = Math.min(1, item.count / 10); // Cap at 10 interactions
        
        // Combined score, weighted towards recency
        const score = (recencyScore * 0.7) + (frequencyScore * 0.3);
        
        return {
          key: item.key,
          score
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.key);
  };

  // Get the raw interaction data
  const getInteractionData = () => interactionData;

  // Clear all interaction data
  const clearInteractionData = () => {
    setInteractionData([]);
  };

  return (
    <AdaptiveMenuContext.Provider
      value={{
        trackInteraction,
        getFrequentItems,
        getRecentItems,
        getRecommendedItems,
        getInteractionData,
        clearInteractionData
      }}
    >
      {children}
    </AdaptiveMenuContext.Provider>
  );
}

export function useAdaptiveMenu() {
  const context = useContext(AdaptiveMenuContext);
  
  if (context === undefined) {
    throw new Error('useAdaptiveMenu must be used within an AdaptiveMenuProvider');
  }
  
  return context;
}