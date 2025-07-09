import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  Target, 
  Users, 
  Cpu, 
  Home, 
  Building, 
  LayoutDashboard,
  RefreshCw,
  Sparkles,
  Clock,
  Star,
  History,
  Settings
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import NavMenuLink from '@/components/NavMenuLink';
import { useMenuAdaptivity } from '@/contexts/MenuAdaptivityContext';

export default function AdaptiveMenuDemo() {
  const [activeTab, setActiveTab] = useState('explanation');
  const { 
    getFrequentlyUsedItems, 
    getRecentlyUsedItems, 
    getPersonalizedSuggestions,
    resetUsageData
  } = useMenuAdaptivity();

  // Sample navigation items to demo with
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Business Entities',
      path: '/entity-dashboards',
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: 'Operations',
      path: '/business-operations',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Strategy',
      path: '/business-strategy',
      icon: <PieChart className="h-5 w-5" />,
      badge: 'New',
    },
    {
      name: 'Sales',
      path: '/sales-analytics',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: 'Marketing',
      path: '/campaigns',
      icon: <Target className="h-5 w-5" />,
    },
    {
      name: 'Customer',
      path: '/customer-service',
      icon: <Users className="h-5 w-5" />,
      badge: '3',
    },
    {
      name: 'Automation',
      path: '/automation',
      icon: <Cpu className="h-5 w-5" />,
    },
  ];

  // Get usage data for display
  const frequentItems = getFrequentlyUsedItems(5);
  const recentItems = getRecentlyUsedItems(5);
  const suggestedItems = getPersonalizedSuggestions(window.location.pathname, 3);
  const hasUsageData = frequentItems.length > 0 || recentItems.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Adaptive Navigation System</h1>
        <p className="text-muted-foreground">
          A smart navigation system that learns from user behavior and provides personalized menu suggestions
        </p>
      </header>

      <Tabs 
        defaultValue="explanation" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="explanation">How It Works</TabsTrigger>
          <TabsTrigger value="demo">Try It Out</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="explanation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Navigation</CardTitle>
              <CardDescription>
                The adaptive menu system learns from your navigation patterns and provides personalized suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <History className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Usage Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    The system anonymously tracks which pages you visit most often
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Smart Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Personalized menu suggestions based on your usage patterns
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <RefreshCw className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium">Continuous Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    The system gets better over time as you use the platform
                  </p>
                </div>
              </div>
              
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Privacy-Focused Design</AlertTitle>
                <AlertDescription>
                  All adaptive learning happens locally in your browser. No personal data is sent to servers.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab('demo')} className="w-full">
                Try it yourself
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Navigation Menu Demo</CardTitle>
                <CardDescription>
                  Click on different menu items to see how the system learns your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {navigationItems.map((item) => (
                    <NavMenuLink
                      key={item.path}
                      path={item.path}
                      name={item.name}
                      icon={item.icon}
                      badge={item.badge}
                      // Note: we're staying on this page, not actually navigating
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {hasUsageData 
                    ? "Click links to see recommendations change" 
                    : "Click on menu items to start building usage patterns"}
                </p>
                <Button variant="outline" size="sm" onClick={resetUsageData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Data
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Suggestions</CardTitle>
                <CardDescription>
                  Based on your navigation patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="smart">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="smart">
                      <Sparkles className="h-3 w-3 mr-1" /> Smart
                    </TabsTrigger>
                    <TabsTrigger value="frequent">
                      <Star className="h-3 w-3 mr-1" /> Frequent
                    </TabsTrigger>
                    <TabsTrigger value="recent">
                      <Clock className="h-3 w-3 mr-1" /> Recent
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="smart" className="min-h-[300px]">
                    <ScrollArea className="h-[300px]">
                      {suggestedItems.length > 0 ? (
                        <div className="space-y-2 mt-4">
                          {suggestedItems.map(item => (
                            <div 
                              key={item.path}
                              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                            >
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2 px-1 bg-primary/5">
                                  <Sparkles className="h-3 w-3 text-primary" />
                                </Badge>
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Score: {item.score.toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-center text-muted-foreground py-8">
                            Click some menu items to get personalized suggestions
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="frequent" className="min-h-[300px]">
                    <ScrollArea className="h-[300px]">
                      {frequentItems.length > 0 ? (
                        <div className="space-y-2 mt-4">
                          {frequentItems.map(item => (
                            <div 
                              key={item.path}
                              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                            >
                              <span className="text-sm">{item.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.clickCount} visits
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-center text-muted-foreground py-8">
                            No frequently visited pages yet
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="recent" className="min-h-[300px]">
                    <ScrollArea className="h-[300px]">
                      {recentItems.length > 0 ? (
                        <div className="space-y-2 mt-4">
                          {recentItems.map(item => (
                            <div 
                              key={item.path}
                              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors"
                            >
                              <span className="text-sm">{item.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(item.lastClicked)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-center text-muted-foreground py-8">
                            No recently visited pages yet
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Analytics</CardTitle>
              <CardDescription>Insights into how users navigate the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Most Frequently Accessed</h3>
                  <ul className="space-y-2">
                    {frequentItems.length > 0 ? (
                      frequentItems.map((item, i) => (
                        <li key={item.path} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                              {i + 1}
                            </Badge>
                            <span>{item.name}</span>
                          </div>
                          <Badge variant="secondary">{item.clickCount} visits</Badge>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No data available yet</p>
                    )}
                  </ul>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Navigation Score Factors</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Frequency: How often a page is visited</li>
                      <li>• Recency: When the page was last accessed</li>
                      <li>• Patterns: Sequences of pages visited together</li>
                      <li>• Session context: Time spent on pages</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recently Accessed</h3>
                  <ul className="space-y-2">
                    {recentItems.length > 0 ? (
                      recentItems.map((item) => (
                        <li key={item.path} className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatTimeAgo(item.lastClicked)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No data available yet</p>
                    )}
                  </ul>
                  
                  <Separator className="my-4" />
                  
                  <div className="mt-6 space-y-2">
                    <h3 className="text-lg font-medium">Benefits</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Faster navigation to frequently used features</li>
                      <li>• Reduced cognitive load for users</li>
                      <li>• Personalized experience without manual configuration</li>
                      <li>• Adaptive to changing work patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Menu Settings</CardTitle>
              <CardDescription>Configure how the adaptive menu system works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Management</h3>
                  <div className="space-y-2">
                    <Button onClick={resetUsageData} variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset All Usage Data
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This will clear all your navigation history and relearn your patterns from scratch.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Information</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Storage Location:</span>
                      <span>Browser LocalStorage</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Data Points Collected:</span>
                      <span>{Object.keys(localStorage).filter(key => key.includes('dmphq_menu')).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Algorithm:</span>
                      <span>Recency-weighted frequency scoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Settings are automatically saved locally in your browser
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to format time ago for display
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs} sec ago`;
  } else if (diffMins < 60) {
    return `${diffMins} min ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hr ago`;
  } else if (diffDays === 1) {
    return `Yesterday`;
  } else {
    return `${diffDays} days ago`;
  }
}