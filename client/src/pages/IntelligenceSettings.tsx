import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Lock,
  Timer,
  Brain,
  BadgePercent,
  RefreshCcw,
  Bell
} from 'lucide-react';
import CloudSync from '@/components/icons/CloudSync';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { useToast } from '@/hooks/use-toast';

const IntelligenceSettings = () => {
  const { personalizationSettings, updatePersonalizationSettings } = usePersonalization();
  const { toast } = useToast();
  const [aiSettings, setAiSettings] = useState({
    modelType: 'gpt-4',
    refreshInterval: 24,
    dataPrivacy: 'enhanced',
    automationLevel: 70,
    insightSources: {
      internal: true,
      market: true,
      competitors: true,
      trends: true
    }
  });
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your intelligence settings have been updated successfully.",
      duration: 3000,
    });
  };
  
  const handleReset = () => {
    toast({
      title: "Settings reset",
      description: "Your intelligence settings have been reset to defaults.",
      duration: 3000,
    });
  };
  
  return (
    <div className="container px-4 mx-auto max-w-7xl">
      <PageHeader 
        title="Intelligence Settings" 
        subtitle="Configure how AI and intelligence features work in your DMPHQ system"
        icon={<Settings className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="default" size="sm" onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Activation</CardTitle>
              <CardDescription>
                Enable or disable intelligence features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Smart Recommendations</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive AI-powered suggestions to optimize your business
                  </p>
                </div>
                <Switch 
                  checked={personalizationSettings.enableSmartRecommendations} 
                  onCheckedChange={(value) => updatePersonalizationSettings({ enableSmartRecommendations: value })} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Predictive Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Forecast future trends and anticipate business changes
                  </p>
                </div>
                <Switch 
                  checked={personalizationSettings.enablePredictiveInsights} 
                  onCheckedChange={(value) => updatePersonalizationSettings({ enablePredictiveInsights: value })} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Prioritization AI</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically prioritize tasks and activities based on business impact
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Premium</Badge>
                  <Switch 
                    checked={personalizationSettings.enablePrioritization} 
                    onCheckedChange={(value) => updatePersonalizationSettings({ enablePrioritization: value })} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Refresh Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep dashboards updated with latest data automatically
                  </p>
                </div>
                <Switch 
                  checked={personalizationSettings.autoRefresh} 
                  onCheckedChange={(value) => updatePersonalizationSettings({ autoRefresh: value })} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Refresh Settings</CardTitle>
              <CardDescription>
                Configure how often your data refreshes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="refresh-interval">Refresh Interval (minutes)</Label>
                  <span className="text-sm">{personalizationSettings.refreshInterval} min</span>
                </div>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="refresh-interval"
                    min={1} 
                    max={60} 
                    step={1} 
                    value={[personalizationSettings.refreshInterval]} 
                    onValueChange={(value) => updatePersonalizationSettings({ refreshInterval: value[0] })}
                    disabled={!personalizationSettings.autoRefresh}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This affects how frequently your dashboard data will refresh. Lower values provide more up-to-date information but may use more system resources.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="refresh-method">Refresh Method</Label>
                </div>
                <Select defaultValue="automatic">
                  <SelectTrigger id="refresh-method" disabled={!personalizationSettings.autoRefresh}>
                    <SelectValue placeholder="Select refresh method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic (Background)</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                    <SelectItem value="scheduled">Scheduled Times</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Choose how you want data to refresh across the platform
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Model Configuration
              </CardTitle>
              <CardDescription>
                Configure which AI models power your intelligence features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="model-type" className="mb-2 block">Model Type</Label>
                <RadioGroup 
                  id="model-type" 
                  defaultValue={aiSettings.modelType}
                  className="flex flex-col gap-2"
                  onValueChange={(value) => setAiSettings({...aiSettings, modelType: value})}
                >
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="gpt-4" id="gpt-4" />
                      <div>
                        <Label htmlFor="gpt-4" className="text-base font-medium">GPT-4</Label>
                        <p className="text-sm text-muted-foreground">
                          Latest large language model with advanced reasoning capabilities
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="gpt-3.5" id="gpt-3.5" />
                      <div>
                        <Label htmlFor="gpt-3.5" className="text-base font-medium">GPT-3.5</Label>
                        <p className="text-sm text-muted-foreground">
                          Faster response times but less advanced capabilities
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Standard</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="enterprise" id="enterprise" />
                      <div>
                        <Label htmlFor="enterprise" className="text-base font-medium">Enterprise Model</Label>
                        <p className="text-sm text-muted-foreground">
                          Dedicated model with domain-specific knowledge and customized training
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="automation-level">Automation Level</Label>
                  <span className="text-sm">{aiSettings.automationLevel}%</span>
                </div>
                <Slider 
                  id="automation-level"
                  min={0} 
                  max={100} 
                  step={5} 
                  value={[aiSettings.automationLevel]} 
                  onValueChange={(value) => setAiSettings({...aiSettings, automationLevel: value[0]})}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Controls how much the system will automate vs. requiring manual approval. Higher values mean more decisions made autonomously.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudSync className="h-5 w-5 text-primary" />
                API Integration
              </CardTitle>
              <CardDescription>
                Connect with external AI and data services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">OpenAI</span>
                  <span className="text-sm text-muted-foreground">Connected and active</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">Google AI</span>
                  <span className="text-sm text-muted-foreground">Not connected</span>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">Claude by Anthropic</span>
                  <span className="text-sm text-muted-foreground">Not connected</span>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Add New API Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Configure which data sources are used for insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">Internal Business Data</span>
                  <span className="text-sm text-muted-foreground">Your DMPHQ business data and history</span>
                </div>
                <Switch 
                  checked={aiSettings.insightSources.internal} 
                  onCheckedChange={(value) => setAiSettings({
                    ...aiSettings, 
                    insightSources: {...aiSettings.insightSources, internal: value}
                  })} 
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">Market Data</span>
                  <span className="text-sm text-muted-foreground">General market trends and statistics</span>
                </div>
                <Switch 
                  checked={aiSettings.insightSources.market} 
                  onCheckedChange={(value) => setAiSettings({
                    ...aiSettings, 
                    insightSources: {...aiSettings.insightSources, market: value}
                  })} 
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">Competitor Analysis</span>
                  <span className="text-sm text-muted-foreground">Public data about competitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Premium</Badge>
                  <Switch 
                    checked={aiSettings.insightSources.competitors} 
                    onCheckedChange={(value) => setAiSettings({
                      ...aiSettings, 
                      insightSources: {...aiSettings.insightSources, competitors: value}
                    })} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">Industry Trends</span>
                  <span className="text-sm text-muted-foreground">Latest industry developments and forecasts</span>
                </div>
                <Switch 
                  checked={aiSettings.insightSources.trends} 
                  onCheckedChange={(value) => setAiSettings({
                    ...aiSettings, 
                    insightSources: {...aiSettings.insightSources, trends: value}
                  })} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCcw className="h-5 w-5 text-primary" />
                Data Sync Settings
              </CardTitle>
              <CardDescription>
                Configure how data is synced across your system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sync-frequency" className="block mb-1">Sync Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="sync-frequency">
                    <SelectValue placeholder="Select sync frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="sync-time" className="block mb-1">Preferred Sync Time</Label>
                <Select defaultValue="midnight">
                  <SelectTrigger id="sync-time">
                    <SelectValue placeholder="Select sync time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midnight">Midnight</SelectItem>
                    <SelectItem value="early-morning">Early Morning (3 AM)</SelectItem>
                    <SelectItem value="morning">Morning (9 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (3 PM)</SelectItem>
                    <SelectItem value="evening">Evening (9 PM)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Choose when you want larger data syncs to occur to minimize disruption
                </p>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button variant="outline">
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control how your data is used and protected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="data-privacy" className="mb-2 block">Data Privacy Level</Label>
                <RadioGroup 
                  id="data-privacy" 
                  defaultValue={aiSettings.dataPrivacy}
                  className="flex flex-col gap-2"
                  onValueChange={(value) => setAiSettings({...aiSettings, dataPrivacy: value})}
                >
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <div>
                        <Label htmlFor="standard" className="text-base font-medium">Standard</Label>
                        <p className="text-sm text-muted-foreground">
                          Basic data protection with standard anonymization
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="enhanced" id="enhanced" />
                      <div>
                        <Label htmlFor="enhanced" className="text-base font-medium">Enhanced</Label>
                        <p className="text-sm text-muted-foreground">
                          Additional data protection with advanced anonymization techniques
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="maximum" id="maximum" />
                      <div>
                        <Label htmlFor="maximum" className="text-base font-medium">Maximum</Label>
                        <p className="text-sm text-muted-foreground">
                          Highest level of data protection with strict processing controls
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <Label>Data Retention</Label>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Keep processing data for</span>
                    <Select defaultValue="90days">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 days</SelectItem>
                        <SelectItem value="90days">90 days</SelectItem>
                        <SelectItem value="180days">180 days</SelectItem>
                        <SelectItem value="365days">1 year</SelectItem>
                        <SelectItem value="forever">Indefinitely</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-delete unused data after</span>
                    <Select defaultValue="180days">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="90days">90 days</SelectItem>
                        <SelectItem value="180days">180 days</SelectItem>
                        <SelectItem value="365days">1 year</SelectItem>
                        <SelectItem value="730days">2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="px-0">View Data Privacy Policy</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure alerts and notifications for intelligence features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Recommendations</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new recommendations are available
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Prediction Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get alerts for significant changes in business predictions
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Risk Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Be alerted when AI detects potential business risks
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly AI Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of all AI insights and recommendations
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligenceSettings;