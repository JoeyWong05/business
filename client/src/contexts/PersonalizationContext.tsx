import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define types
export interface DashboardWidget {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  type: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
}

// Define the PersonalizationSettings type
export interface PersonalizationSettings {
  // General settings
  enableSmartRecommendations: boolean;
  enablePredictiveInsights: boolean;
  enablePrioritization: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  
  // Dashboard behavior
  dashboardLayout?: 'grid' | 'list' | 'cards';
  enableAutoRefresh?: boolean;
  enableCompactView?: boolean;
  enableAnimations?: boolean;
  
  // AI settings
  aiModel: string;
  automationLevel: number;
  
  // Data source settings
  dataSources: {
    internal: boolean;
    market: boolean;
    competitors: boolean;
    trends: boolean;
  };
  
  // Security settings
  dataPrivacyLevel: string;
  retentionPeriod: number;
  
  // Notification settings
  notifications?: {
    enabled?: boolean;
    criticalAlerts?: boolean;
    emailDigest?: boolean;
  };
  
  // Dashboard settings
  widgets: DashboardWidget[];
}

// Define the type for the context
interface PersonalizationContextType {
  personalizationSettings: PersonalizationSettings;
  updatePersonalizationSettings: (update: Partial<PersonalizationSettings>) => void;
  resetToDefaults: () => void;
  
  // These properties are used in MainLayout
  settings: PersonalizationSettings;
  updateSettings: (updateFn: (prev: PersonalizationSettings) => PersonalizationSettings) => void;
  activeBrand: Brand | null;
  setActiveBrand: (brand: Brand) => void;
  availableBrands: Brand[];
  activeUserRole: UserRole | null;
  setActiveUserRole: (role: UserRole) => void;
}

// Create the context
export const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

// Hook for using personalization
export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}

// Default settings
const defaultSettings: PersonalizationSettings = {
  // General settings
  enableSmartRecommendations: true,
  enablePredictiveInsights: true,
  enablePrioritization: false,
  autoRefresh: true,
  refreshInterval: 5,
  
  // Dashboard behavior
  dashboardLayout: 'grid',
  enableAutoRefresh: true,
  enableCompactView: false,
  enableAnimations: true,
  
  // AI settings
  aiModel: 'gpt-4',
  automationLevel: 50,
  
  // Data source settings
  dataSources: {
    internal: true,
    market: true,
    competitors: false,
    trends: true,
  },
  
  // Security settings
  dataPrivacyLevel: 'enhanced',
  retentionPeriod: 90,
  
  // Notification settings
  notifications: {
    enabled: true,
    criticalAlerts: true,
    emailDigest: false
  },
  
  // Dashboard widgets
  widgets: [
    { id: 'revenueChart', name: 'Revenue Chart', enabled: true, order: 1, type: 'chart' },
    { id: 'teamActivity', name: 'Team Activity', enabled: true, order: 2, type: 'feed' },
    { id: 'recommendations', name: 'Recommendations', enabled: true, order: 3, type: 'list' },
    { id: 'statusCards', name: 'Status Cards', enabled: true, order: 4, type: 'card' },
    { id: 'tasksOverview', name: 'Tasks Overview', enabled: true, order: 5, type: 'list' },
    { id: 'businessEntities', name: 'Business Entities', enabled: false, order: 6, type: 'grid' },
    { id: 'toolsByCategory', name: 'Tools by Category', enabled: false, order: 7, type: 'grid' },
    { id: 'recentSops', name: 'Recent SOPs', enabled: false, order: 8, type: 'list' },
    { id: 'predictiveInsights', name: 'Predictive Insights', enabled: true, order: 9, type: 'chart' },
    { id: 'marketingSocial', name: 'Marketing & Social', enabled: false, order: 10, type: 'chart' }
  ]
};

// Default brands
const defaultBrands: Brand[] = [
  { id: '1', name: 'Digital Merch Pros', primaryColor: '#6366f1' },
  { id: '2', name: 'Mystery Hype', primaryColor: '#8b5cf6' },
  { id: '3', name: 'Lone Star Custom Clothing', primaryColor: '#ec4899' },
  { id: '4', name: 'Alcoeaze', primaryColor: '#14b8a6' },
  { id: '5', name: 'Hide Cafe Bars', primaryColor: '#f59e0b' }
];

// Default user roles
const defaultUserRoles: UserRole[] = [
  { id: '1', name: 'Owner', permissions: ['admin', 'edit', 'view'] },
  { id: '2', name: 'Manager', permissions: ['edit', 'view'] },
  { id: '3', name: 'Employee', permissions: ['view'] }
];

// Provider component
interface PersonalizationProviderProps {
  children: ReactNode;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({ children }) => {
  // Initialize personalization settings
  const [settings, setSettings] = useState<PersonalizationSettings>(() => {
    const storedSettings = localStorage.getItem('personalizationSettings');
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });
  
  // Initialize brands and active brand
  const [availableBrands, setAvailableBrands] = useState<Brand[]>(defaultBrands);
  const [activeBrand, setActiveBrand] = useState<Brand | null>(defaultBrands[0]);
  
  // Initialize user roles
  const [availableUserRoles, setAvailableUserRoles] = useState<UserRole[]>(defaultUserRoles);
  const [activeUserRole, setActiveUserRole] = useState<UserRole | null>(defaultUserRoles[0]);
  
  // Update settings - this is the function used by personalizationSettings consumers
  const updatePersonalizationSettings = (update: Partial<PersonalizationSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...update };
      
      // Handle nested objects separately
      if (update.dataSources) {
        newSettings.dataSources = { ...prev.dataSources, ...update.dataSources };
      }
      
      if (update.notifications) {
        newSettings.notifications = { 
          ...prev.notifications || {}, 
          ...update.notifications 
        };
      }
      
      return newSettings;
    });
  };
  
  // Update settings - this is the function used with functional updates for widget customization
  const updateSettings = (updateFn: (prev: PersonalizationSettings) => PersonalizationSettings) => {
    setSettings(prev => updateFn(prev));
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('personalizationSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Save active brand to localStorage
  useEffect(() => {
    if (activeBrand) {
      localStorage.setItem('activeBrand', JSON.stringify(activeBrand));
    }
  }, [activeBrand]);
  
  // Save active user role to localStorage
  useEffect(() => {
    if (activeUserRole) {
      localStorage.setItem('activeUserRole', JSON.stringify(activeUserRole));
    }
  }, [activeUserRole]);
  
  return (
    <PersonalizationContext.Provider
      value={{
        // Original interface
        personalizationSettings: settings,
        updatePersonalizationSettings,
        resetToDefaults,
        
        // Additional properties used in MainLayout and other components
        settings,
        updateSettings,
        activeBrand,
        setActiveBrand,
        availableBrands,
        activeUserRole,
        setActiveUserRole
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};