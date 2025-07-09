import React, { useState } from 'react';
import { 
  Brain, 
  Settings, 
  LayoutDashboard, 
  Sparkles, 
  Zap, 
  ArrowRight,
  Bell,
  Palette,
  Grid3X3,
  List,
  Layout,
  Type
} from 'lucide-react';
import { Lightbulb } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { usePersonalization, PersonalizationSettings } from '@/contexts/PersonalizationContext';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Personalization = () => {
  const { settings, updateSettings, activeBrand, availableBrands, setActiveBrand, activeUserRole, setActiveUserRole, availableUserRoles, resetPersonalizationSettings } = usePersonalization();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleSetting = (setting: keyof PersonalizationSettings) => {
    if (typeof settings[setting] === 'boolean') {
      updateSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };

  const handleChangeTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSettings(prev => ({
      ...prev,
      theme
    }));
  };

  const handleDashboardLayoutChange = (layout: 'grid' | 'list' | 'cards') => {
    updateSettings(prev => ({
      ...prev,
      dashboardLayout: layout
    }));
  };

  const handleRefreshRateChange = (value: number[]) => {
    updateSettings(prev => ({
      ...prev,
      dashboardRefreshRate: value[0]
    }));
  };

  const handleNotificationFrequencyChange = (frequency: 'real-time' | 'hourly' | 'daily' | 'weekly') => {
    updateSettings(prev => ({
      ...prev,
      notificationFrequency: frequency
    }));
  };

  const handleFontSizeChange = (size: 'default' | 'compact' | 'large') => {
    updateSettings(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  const handleColorSchemeChange = (scheme: string) => {
    updateSettings(prev => ({
      ...prev,
      colorScheme: scheme
    }));
  };

  const handleReset = () => {
    resetPersonalizationSettings();
    setShowConfirmReset(false);
  };

  return (
    <div className="container px-4 mx-auto max-w-7xl">
      <PageHeader 
        title="Personalization" 
        subtitle="Customize your DMPHQ experience for optimal productivity"
        icon={<Brain className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmReset(true)}>
              Reset Defaults
            </Button>
            <Button variant="default">
              Save Preferences
            </Button>
          </div>
        }
      />
      
      {showConfirmReset && (
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Reset Confirmation</CardTitle>
            <CardDescription>
              Are you sure you want to reset all personalization settings to defaults?
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmReset(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset All Settings
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard Widgets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Dashboard Widgets
                  </CardTitle>
                </div>
                <CardDescription>
                  Customize which widgets appear on your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.widgets?.map(widget => (
                    <div key={widget.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{widget.name}</p>
                        <p className="text-xs text-muted-foreground">{widget.type}</p>
                      </div>
                      <Switch 
                        checked={widget.enabled}
                        onCheckedChange={(checked) => {
                          updateSettings(prev => ({
                            ...prev,
                            widgets: prev.widgets?.map(w => 
                              w.id === widget.id ? { ...w, enabled: checked } : w
                            ) || []
                          }));
                        }}
                      />
                    </div>
                  )) || (
                    <div className="py-2 text-sm text-muted-foreground">
                      No dashboard widgets configured
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Smart Recommendations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Smart Recommendations
                  </CardTitle>
                  <Switch 
                    checked={settings.showRecommendations}
                    onCheckedChange={() => handleToggleSetting('showRecommendations')}
                  />
                </div>
                <CardDescription>
                  AI-powered recommendations based on your usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get personalized suggestions for optimizing workflows, improving efficiency, and uncovering opportunities
                </p>
              </CardContent>
            </Card>
            
            {/* Predictive Insights */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Predictive Insights
                  </CardTitle>
                  <Switch 
                    checked={settings.showPredictiveInsights}
                    onCheckedChange={() => handleToggleSetting('showPredictiveInsights')}
                  />
                </div>
                <CardDescription>
                  Advanced analytics that predict trends and forecast metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Leverage AI to anticipate business needs, identify potential issues before they arise, and predict growth opportunities
                </p>
              </CardContent>
            </Card>
            
            {/* AI Prioritization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Prioritization
                    </CardTitle>
                    <Badge variant="outline" className="ml-2">Premium</Badge>
                  </div>
                  <Switch 
                    checked={settings.enablePrioritization}
                    onCheckedChange={() => handleToggleSetting('enablePrioritization')}
                  />
                </div>
                <CardDescription>
                  Let AI intelligently prioritize your tasks and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes deadlines, dependencies, and business impact to suggest optimal task sequencing for maximum productivity
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard Layout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  Dashboard Layout
                </CardTitle>
                <CardDescription>
                  Choose how information is presented on your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue={settings.dashboardLayout}
                  onValueChange={(value) => handleDashboardLayoutChange(value as 'grid' | 'list' | 'cards')}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grid" id="layout-grid" />
                    <Label htmlFor="layout-grid" className="flex items-center">
                      <Grid3X3 className="h-4 w-4 mr-2" /> Grid View
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="list" id="layout-list" />
                    <Label htmlFor="layout-list" className="flex items-center">
                      <List className="h-4 w-4 mr-2" /> List View
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cards" id="layout-cards" />
                    <Label htmlFor="layout-cards" className="flex items-center">
                      <Layout className="h-4 w-4 mr-2" /> Card View
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Menu Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Menu Settings</CardTitle>
                <CardDescription>
                  Customize your navigation experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="menu-collapsed" className="text-sm font-medium">Collapsed Menu</Label>
                    <Switch
                      id="menu-collapsed"
                      checked={settings.menuCollapsed}
                      onCheckedChange={() => handleToggleSetting('menuCollapsed')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="favorite-modules" className="text-sm font-medium">Favorite Modules</Label>
                    <div className="flex flex-wrap gap-2">
                      {settings.favoriteModules?.map(module => (
                        <Badge key={module} variant="secondary" className="cursor-pointer">
                          {module}
                        </Badge>
                      )) || (
                        <div className="text-sm text-muted-foreground py-1">
                          No favorite modules selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Auto-Refresh Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Auto-Refresh Rate
                </CardTitle>
                <CardDescription>
                  Set how frequently dashboard data refreshes (in minutes)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[settings.dashboardRefreshRate]}
                    min={1}
                    max={60}
                    step={1}
                    onValueChange={handleRefreshRateChange}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">1 min</span>
                    <span className="text-sm font-medium">{settings.dashboardRefreshRate} min</span>
                    <span className="text-sm text-muted-foreground">60 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Active Brand</CardTitle>
                <CardDescription>
                  Switch between different business entities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select 
                  value={activeBrand.id} 
                  onValueChange={(value) => {
                    const brand = availableBrands.find(b => b.id === value);
                    if (brand) setActiveBrand(brand);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: brand.primaryColor }}
                          />
                          {brand.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {activeBrand && (
                  <div className="mt-4 p-4 border rounded-md" style={{ borderColor: activeBrand.primaryColor + '40' }}>
                    <h3 className="text-sm font-medium" style={{ color: activeBrand.primaryColor }}>{activeBrand.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{activeBrand.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* User Role Selection */}
            <Card>
              <CardHeader>
                <CardTitle>User Role</CardTitle>
                <CardDescription>
                  Change your active role within the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue={activeUserRole}
                  onValueChange={(value) => setActiveUserRole(value as any)}
                  className="flex flex-col space-y-3"
                >
                  {availableUserRoles?.map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <RadioGroupItem value={role} id={`role-${role}`} />
                      <Label htmlFor={`role-${role}`} className="capitalize">
                        {role.replace('_', ' ')}
                      </Label>
                    </div>
                  )) || (
                    <div className="text-sm text-muted-foreground py-1">
                      No roles available
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Choose your preferred color theme and scheme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Color Theme</Label>
                    <RadioGroup 
                      defaultValue={settings.theme}
                      onValueChange={(value) => handleChangeTheme(value as 'light' | 'dark' | 'system')}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Color Scheme</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {['blue', 'green', 'purple', 'orange', 'red'].map(color => (
                        <div 
                          key={color}
                          className={`w-full aspect-square rounded-md cursor-pointer transition-all hover:scale-110 ${settings.colorScheme === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                          style={{ backgroundColor: getColorForScheme(color) }}
                          onClick={() => handleColorSchemeChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary" />
                  Typography
                </CardTitle>
                <CardDescription>
                  Adjust text size for better readability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue={settings.fontSize}
                  onValueChange={(value) => handleFontSizeChange(value as 'default' | 'compact' | 'large')}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="font-compact" />
                    <Label htmlFor="font-compact" className="text-xs">Compact</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="font-default" />
                    <Label htmlFor="font-default" className="text-sm">Default</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="font-large" />
                    <Label htmlFor="font-large" className="text-base">Large</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                  <Switch 
                    checked={settings.enableNotifications}
                    onCheckedChange={() => handleToggleSetting('enableNotifications')}
                  />
                </div>
                <CardDescription>
                  Enable or disable system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Notification Frequency</Label>
                    <Select 
                      value={settings.notificationFrequency}
                      onValueChange={(value) => handleNotificationFrequencyChange(value as any)}
                      disabled={!settings.enableNotifications}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-time">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly digest</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                        <SelectItem value="weekly">Weekly digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Pinned Items */}
            <Card>
              <CardHeader>
                <CardTitle>Pinned Items</CardTitle>
                <CardDescription>
                  Items that appear in your quick access area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {settings.pinnedItems?.map((item: string) => (
                    <Badge key={item} variant="secondary" className="cursor-pointer">
                      {item.replace(/-/g, ' ')}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => {
                          updateSettings(prev => ({
                            ...prev,
                            pinnedItems: prev.pinnedItems?.filter((i: string) => i !== item) || []
                          }));
                        }}
                      >
                        ×
                      </Button>
                    </Badge>
                  )) || (
                    <div className="text-sm text-muted-foreground py-1">
                      No pinned items
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get a color value based on scheme name
function getColorForScheme(scheme: string): string {
  const colors = {
    blue: '#4f46e5',
    green: '#16a34a',
    purple: '#9333ea',
    orange: '#f59e0b',
    red: '#b91c1c'
  };
  return colors[scheme as keyof typeof colors] || colors.blue;
}

export default Personalization;