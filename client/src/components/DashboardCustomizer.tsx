import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePersonalization, PersonalizationSettings } from '@/contexts/PersonalizationContext';
import { ChevronRight, Layout, Briefcase, Bell, PieChart, Users, BarChart, LineChart, Zap, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Dashboard widget types
type WidgetType = 
  | 'revenueChart' 
  | 'teamActivity' 
  | 'recommendations' 
  | 'statusCards' 
  | 'tasksOverview'
  | 'businessEntities'
  | 'toolsByCategory'
  | 'recentSops'
  | 'predictiveInsights'
  | 'marketingSocial';

interface WidgetConfig {
  id: WidgetType;
  name: string;
  description: string;
  category: 'analytics' | 'management' | 'intelligence';
  icon: React.ReactNode;
}

// Widget configurations
const widgetConfigs: WidgetConfig[] = [
  {
    id: 'revenueChart',
    name: 'Revenue & Expenses',
    description: 'Financial performance visualization',
    category: 'analytics',
    icon: <BarChart className="h-4 w-4" />
  },
  {
    id: 'teamActivity',
    name: 'Team Activity',
    description: 'Recent user actions and events',
    category: 'management',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'recommendations',
    name: 'Recommendations',
    description: 'AI-powered business suggestions',
    category: 'intelligence',
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: 'statusCards',
    name: 'Status Cards',
    description: 'Key performance indicators',
    category: 'analytics',
    icon: <PieChart className="h-4 w-4" />
  },
  {
    id: 'tasksOverview',
    name: 'Tasks Overview',
    description: 'Pending and completed tasks',
    category: 'management',
    icon: <Briefcase className="h-4 w-4" />
  },
  {
    id: 'businessEntities',
    name: 'Business Entities',
    description: 'Companies and organizations overview',
    category: 'management',
    icon: <Layout className="h-4 w-4" />
  },
  {
    id: 'toolsByCategory',
    name: 'Tools by Category',
    description: 'Organized tools and integrations',
    category: 'management',
    icon: <Layout className="h-4 w-4" />
  },
  {
    id: 'recentSops',
    name: 'Recent SOPs',
    description: 'Standard operating procedures',
    category: 'management',
    icon: <Layout className="h-4 w-4" />
  },
  {
    id: 'predictiveInsights',
    name: 'Predictive Insights',
    description: 'AI forecasting and trends',
    category: 'intelligence',
    icon: <LineChart className="h-4 w-4" />
  },
  {
    id: 'marketingSocial',
    name: 'Marketing & Social',
    description: 'Social media metrics and campaigns',
    category: 'analytics',
    icon: <BarChart className="h-4 w-4" />
  }
];

interface DashboardCustomizerProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  widgets: any[];
  onSaveWidgets: (updatedWidgets: any) => void;
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ 
  className = '',
  isOpen,
  onClose,
  widgets,
  onSaveWidgets
}) => {
  // Get personalization context
  const { settings, updateSettings } = usePersonalization();
  const [activeTab, setActiveTab] = useState('layout');
  
  // Get widget visibility from settings or provide defaults
  const getWidgetVisibility = (widgetId: WidgetType): boolean => {
    const widget = widgets.find(w => w.id === widgetId);
    return widget ? widget.enabled : true;
  };
  
  const handleWidgetToggle = (widgetId: WidgetType) => {
    const updatedWidgets = widgets.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, enabled: !widget.enabled };
      }
      return widget;
    });
    
    // Update local state for immediate UI feedback
    // We don't immediately call onSaveWidgets here to allow for multiple changes before saving
    updateSettings(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => {
        if (widget.id === widgetId) {
          return { ...widget, enabled: !widget.enabled };
        }
        return widget;
      })
    }));
  };
  
  const handleDashboardLayoutChange = (layout: 'grid' | 'list' | 'cards') => {
    updateSettings(prev => ({ ...prev, dashboardLayout: layout }));
  };
  
  const handleFeatureToggle = (feature: string, value: boolean) => {
    if (feature.includes('.')) {
      // Handle nested properties, like 'notifications.enabled'
      const [parentKey, childKey] = feature.split('.');
      updateSettings(prev => {
        // Create a new settings object
        const newSettings = { ...prev };
        
        // Handle notifications specifically
        if (parentKey === 'notifications') {
          newSettings.notifications = {
            ...(prev.notifications || {}),
            [childKey]: value
          };
        }
        
        return newSettings;
      });
    } else {
      // Handle top-level properties
      updateSettings(prev => ({ ...prev, [feature]: value }));
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dashboard Customizer</DialogTitle>
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className={`space-y-6 ${className}`}>
          <Tabs 
            defaultValue="layout" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="widgets">Widgets</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dashboard Layout</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    defaultValue={settings.dashboardLayout || 'grid'}
                    onValueChange={(value) => handleDashboardLayoutChange(value as 'grid' | 'list' | 'cards')}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value="grid"
                        id="layout-grid"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="layout-grid"
                        className="flex flex-col items-center p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent transition-colors"
                      >
                        <div className="grid grid-cols-2 gap-2 mb-3 w-full">
                          <div className="border rounded-md bg-background p-2 aspect-video"></div>
                          <div className="border rounded-md bg-background p-2 aspect-video"></div>
                          <div className="border rounded-md bg-background p-2 aspect-video"></div>
                          <div className="border rounded-md bg-background p-2 aspect-video"></div>
                        </div>
                        <span className="font-medium">Grid</span>
                        <span className="text-xs text-muted-foreground">Balanced layout with equal sections</span>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem
                        value="list"
                        id="layout-list"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="layout-list"
                        className="flex flex-col items-center p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent transition-colors"
                      >
                        <div className="flex flex-col gap-2 mb-3 w-full">
                          <div className="border rounded-md bg-background p-2 h-7"></div>
                          <div className="border rounded-md bg-background p-2 h-7"></div>
                          <div className="border rounded-md bg-background p-2 h-7"></div>
                          <div className="border rounded-md bg-background p-2 h-7"></div>
                        </div>
                        <span className="font-medium">List</span>
                        <span className="text-xs text-muted-foreground">Stacked sections with details</span>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem
                        value="cards"
                        id="layout-cards"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="layout-cards"
                        className="flex flex-col items-center p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent transition-colors"
                      >
                        <div className="grid grid-cols-2 gap-2 mb-3 w-full">
                          <div className="border rounded-md bg-background p-2 aspect-square"></div>
                          <div className="border rounded-md bg-background p-2 aspect-square"></div>
                          <div className="border rounded-md bg-background p-2 aspect-square"></div>
                          <div className="border rounded-md bg-background p-2 aspect-square"></div>
                        </div>
                        <span className="font-medium">Cards</span>
                        <span className="text-xs text-muted-foreground">Compact visual card layout</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dashboard Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoRefresh" className="font-medium">
                        Auto Refresh
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically refresh dashboard data periodically
                      </p>
                    </div>
                    <Switch 
                      id="autoRefresh" 
                      checked={settings.enableAutoRefresh || false}
                      onCheckedChange={(checked) => handleFeatureToggle('enableAutoRefresh', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compactView" className="font-medium">
                        Compact View
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing and show more content
                      </p>
                    </div>
                    <Switch 
                      id="compactView" 
                      checked={settings.enableCompactView || false}
                      onCheckedChange={(checked) => handleFeatureToggle('enableCompactView', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations" className="font-medium">
                        Animations
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable UI animations and transitions
                      </p>
                    </div>
                    <Switch 
                      id="animations" 
                      checked={settings.enableAnimations || false}
                      onCheckedChange={(checked) => handleFeatureToggle('enableAnimations', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="widgets" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Widget Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      widgetConfigs.reduce((result: Record<string, WidgetConfig[]>, widget) => {
                        if (!result[widget.category]) {
                          result[widget.category] = [];
                        }
                        result[widget.category].push(widget);
                        return result;
                      }, {})
                    ).map(([category, widgets]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {category}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {(widgets as WidgetConfig[]).map(widget => (
                            <div key={widget.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                  {widget.icon}
                                </div>
                                <div>
                                  <Label htmlFor={`widget-${widget.id}`} className="font-medium cursor-pointer">
                                    {widget.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">
                                    {widget.description}
                                  </p>
                                </div>
                              </div>
                              <Switch 
                                id={`widget-${widget.id}`} 
                                checked={getWidgetVisibility(widget.id)}
                                onCheckedChange={() => handleWidgetToggle(widget.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI & Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="recommendations" className="font-medium">
                        AI Recommendations
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show business improvement suggestions
                      </p>
                    </div>
                    <Switch 
                      id="recommendations" 
                      checked={settings.enableSmartRecommendations || false}
                      onCheckedChange={(checked) => handleFeatureToggle('enableSmartRecommendations', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="predictiveInsights" className="font-medium">
                        Predictive Insights
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Display AI forecasting and trend analysis
                      </p>
                    </div>
                    <Switch 
                      id="predictiveInsights" 
                      checked={settings.enablePredictiveInsights || false}
                      onCheckedChange={(checked) => handleFeatureToggle('enablePredictiveInsights', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="prioritization" className="font-medium">
                        AI Prioritization
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Use AI to prioritize tasks and activities
                      </p>
                    </div>
                    <Switch 
                      id="prioritization" 
                      checked={settings.enablePrioritization || false}
                      onCheckedChange={(checked) => handleFeatureToggle('enablePrioritization', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notifications & Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show system notifications for events
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={settings.notifications?.enabled || false}
                      onCheckedChange={(checked) => handleFeatureToggle('notifications.enabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="criticalAlerts" className="font-medium">
                        Critical Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show high-priority alerts immediately
                      </p>
                    </div>
                    <Switch 
                      id="criticalAlerts" 
                      checked={settings.notifications?.criticalAlerts || false}
                      onCheckedChange={(checked) => handleFeatureToggle('notifications.criticalAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="font-medium">
                        Email Digest
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email summaries of activities
                      </p>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      checked={settings.notifications?.emailDigest || false}
                      onCheckedChange={(checked) => handleFeatureToggle('notifications.emailDigest', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Save the widgets from the updated settings
            onSaveWidgets(settings.widgets);
            onClose();
          }}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizer;