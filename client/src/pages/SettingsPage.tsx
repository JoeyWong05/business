import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, User, Bell, Globe, Lock, Palette, 
  Moon, Sun, Monitor, EyeOff, CheckCircle2
} from "lucide-react";
import DemoModeToggle from '@/components/DemoModeToggle';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = React.useState("general");
  
  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "system");
  };
  
  return (
    <MainLayout
      title="Settings"
      description="Configure your account and system preferences"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - tabs */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Settings</CardTitle>
              <CardDescription>Manage your profile and preferences</CardDescription>
            </CardHeader>
            <CardContent className="pl-1 pr-1">
              <TabsList className="flex flex-col h-full items-stretch space-y-1 bg-transparent">
                <TabsTrigger 
                  value="general" 
                  onClick={() => setActiveTab("general")}
                  className={`justify-start px-3 py-2 h-9 ${activeTab === "general" ? "" : "hover:bg-muted"}`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="account" 
                  onClick={() => setActiveTab("account")}
                  className={`justify-start px-3 py-2 h-9 ${activeTab === "account" ? "" : "hover:bg-muted"}`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  onClick={() => setActiveTab("appearance")}
                  className={`justify-start px-3 py-2 h-9 ${activeTab === "appearance" ? "" : "hover:bg-muted"}`}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  onClick={() => setActiveTab("notifications")}
                  className={`justify-start px-3 py-2 h-9 ${activeTab === "notifications" ? "" : "hover:bg-muted"}`}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="language" 
                  onClick={() => setActiveTab("language")}
                  className={`justify-start px-3 py-2 h-9 ${activeTab === "language" ? "" : "hover:bg-muted"}`}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Language
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  onClick={() => setActiveTab("privacy")}
                  className={`justify-start px-3 py-2 h-9 ${activeTab === "privacy" ? "" : "hover:bg-muted"}`}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger 
                  value="demo" 
                  onClick={() => setActiveTab("demo")}
                  className={`justify-start px-3 py-2 h-9 ${activeTab === "demo" ? "" : "hover:bg-muted"}`}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Demo Mode
                  <Badge variant="outline" className="ml-auto">New</Badge>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - content */}
        <div className="lg:col-span-9">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsContent value="general" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage system-wide settings and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Company Name" defaultValue="DMPHQ" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select 
                      id="timezone"
                      className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background"
                      defaultValue="America/New_York"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-save changes</Label>
                      <div className="text-sm text-muted-foreground">Automatically save changes as you make them</div>
                    </div>
                    <Switch id="auto-save" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Usage Analytics</Label>
                      <div className="text-sm text-muted-foreground">Allow system to collect usage data to improve experience</div>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account information and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input id="display-name" placeholder="Display Name" defaultValue="Admin User" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Email" defaultValue="admin@dmphq.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">User Role</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="py-1 px-2">Administrator</Badge>
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Only admins can change roles</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input id="password" type="password" value="••••••••" disabled className="flex-1" />
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-factor authentication</Label>
                      <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Enabled
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of your interface</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Theme Preference</Label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Card
                        className={`w-full sm:w-auto cursor-pointer transition hover:border-primary ${
                          theme === "light" ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => toggleTheme("light")}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <Sun className="h-10 w-10 mb-2 mt-2 text-orange-500" />
                          <div className="font-medium">Light</div>
                          {theme === "light" && (
                            <Badge className="mt-2" variant="secondary">Active</Badge>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card
                        className={`w-full sm:w-auto cursor-pointer transition hover:border-primary ${
                          theme === "dark" ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => toggleTheme("dark")}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <Moon className="h-10 w-10 mb-2 mt-2 text-blue-600" />
                          <div className="font-medium">Dark</div>
                          {theme === "dark" && (
                            <Badge className="mt-2" variant="secondary">Active</Badge>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card
                        className={`w-full sm:w-auto cursor-pointer transition hover:border-primary ${
                          theme === "system" ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => toggleTheme("system")}
                      >
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <Monitor className="h-10 w-10 mb-2 mt-2 text-gray-600 dark:text-gray-400" />
                          <div className="font-medium">System</div>
                          {theme === "system" && (
                            <Badge className="mt-2" variant="secondary">Active</Badge>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Interface animations</Label>
                      <div className="text-sm text-muted-foreground">Enable smooth transitions and effects</div>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-view">Compact view</Label>
                      <div className="text-sm text-muted-foreground">Reduce spacing and padding throughout interface</div>
                    </div>
                    <Switch id="compact-view" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Text Size</Label>
                    <select 
                      id="font-size"
                      className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background"
                      defaultValue="medium"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium (Recommended)</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control when and how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-activity">Activity summary</Label>
                        <div className="text-sm text-muted-foreground">Daily digest of platform activities</div>
                      </div>
                      <Switch id="email-activity" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-mentions">Team mentions</Label>
                        <div className="text-sm text-muted-foreground">When someone @mentions you in comments</div>
                      </div>
                      <Switch id="email-mentions" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-updates">Product updates</Label>
                        <div className="text-sm text-muted-foreground">New features and platform improvements</div>
                      </div>
                      <Switch id="email-updates" />
                    </div>
                    
                    <h3 className="text-sm font-medium pt-4">Platform Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browser-notifications">Browser notifications</Label>
                        <div className="text-sm text-muted-foreground">Show desktop notifications while in browser</div>
                      </div>
                      <Switch id="browser-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sound-alerts">Sound alerts</Label>
                        <div className="text-sm text-muted-foreground">Play sound for important notifications</div>
                      </div>
                      <Switch id="sound-alerts" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="language" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Language Settings</CardTitle>
                  <CardDescription>Set your preferred language and regional formats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Interface Language</Label>
                    <select 
                      id="language"
                      className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background"
                      defaultValue="en-US"
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (United Kingdom)</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="pt">Portuguese</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese (Simplified)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <select 
                      id="date-format"
                      className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background"
                      defaultValue="MM/DD/YYYY"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="number-format">Number Format</Label>
                    <select 
                      id="number-format"
                      className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background"
                      defaultValue="1,234.56"
                    >
                      <option value="1,234.56">1,234.56</option>
                      <option value="1.234,56">1.234,56</option>
                      <option value="1 234.56">1 234.56</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Primary Currency</Label>
                    <select 
                      id="currency"
                      className="w-full h-10 px-3 py-2 border rounded-md border-input bg-background"
                      defaultValue="USD"
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="AUD">Australian Dollar (AUD)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-tracking">Activity tracking</Label>
                      <div className="text-sm text-muted-foreground">Track usage to personalize your experience</div>
                    </div>
                    <Switch id="activity-tracking" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Improvement data collection</Label>
                      <div className="text-sm text-muted-foreground">Share anonymized usage data to improve products</div>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing emails</Label>
                      <div className="text-sm text-muted-foreground">Receive promotional and educational content</div>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Data Management</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="flex-1">Export My Data</Button>
                      <Button variant="destructive" className="flex-1">Delete Account</Button>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Deleting your account will permanently remove all your data and cannot be undone.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="demo" className="m-0">
              <DemoModeToggle />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}