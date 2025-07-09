import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  Download,
  Share2,
  Code,
  ExternalLink,
  Zap
} from "lucide-react";

export default function Automation() {
  const [activeTab, setActiveTab] = useState("workflows");
  
  // Example automation workflows
  const automationWorkflows = [
    { 
      id: 1, 
      name: "New Customer Onboarding", 
      description: "Automates customer welcome emails, documentation, and follow-up tasks",
      status: "active",
      lastRun: "2 hours ago",
      successRate: 98,
      triggerType: "event",
      trigger: "New Customer Created",
      steps: 8,
    },
    { 
      id: 2, 
      name: "Invoice Payment Reminder", 
      description: "Sends payment reminders for unpaid invoices at 3, 7, and 14 days",
      status: "active",
      lastRun: "1 day ago",
      successRate: 100,
      triggerType: "schedule",
      trigger: "Daily at 9:00 AM",
      steps: 5,
    },
    { 
      id: 3, 
      name: "Social Media Content Distribution", 
      description: "Distributes approved content across multiple social platforms",
      status: "paused",
      lastRun: "5 days ago",
      successRate: 85,
      triggerType: "manual",
      trigger: "Manual Trigger",
      steps: 12,
    },
    { 
      id: 4, 
      name: "Inventory Restock Alerts", 
      description: "Notifies team when inventory levels drop below thresholds",
      status: "error",
      lastRun: "Failed 3 hours ago",
      successRate: 62,
      triggerType: "event",
      trigger: "Inventory Update",
      steps: 6,
    },
  ];
  
  // Example integrations
  const integrations = [
    {
      id: 1,
      name: "Zapier",
      description: "Connect apps and automate workflows",
      status: "connected",
      lastSync: "10 minutes ago",
      connectedApps: 12,
      icon: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.svg"
    },
    {
      id: 2,
      name: "Make (Integromat)",
      description: "Advanced workflow automation platform",
      status: "connected",
      lastSync: "1 hour ago",
      connectedApps: 8,
      icon: "https://make.com/en/icon.svg"
    },
    {
      id: 3,
      name: "n8n",
      description: "Workflow automation tool with fair code license",
      status: "disconnected",
      lastSync: "Never",
      connectedApps: 0,
      icon: "https://n8n.io/favicon.ico"
    },
    {
      id: 4,
      name: "Tray.io",
      description: "Enterprise automation platform",
      status: "connected",
      lastSync: "2 days ago",
      connectedApps: 5,
      icon: "https://tray.io/favicon.ico"
    }
  ];
  
  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Paused</Badge>;
      case "error":
        return <Badge className="bg-red-500 hover:bg-red-600">Error</Badge>;
      case "connected":
        return <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>;
      case "disconnected":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Disconnected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Automation & Workflows</h1>
        <p className="text-muted-foreground">
          Create, manage, and monitor your business automation workflows
        </p>
      </header>
      
      <Tabs 
        defaultValue="workflows" 
        className="w-full" 
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="workflows" className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <Cpu className="mr-2 h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflows" className="space-y-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input 
                placeholder="Search workflows..." 
                className="w-[250px] pl-8" 
              />
            </div>
          </div>
          
          {/* Workflow List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationWorkflows.map((workflow) => (
              <Card key={workflow.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    {renderStatusBadge(workflow.status)}
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Trigger:</p>
                      <p className="font-medium">{workflow.trigger}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Run:</p>
                      <p className="font-medium">{workflow.lastRun}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate:</p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={workflow.successRate} 
                          className="h-2 flex-1"
                          indicatorClassName={
                            workflow.successRate > 90 ? "bg-green-500" :
                            workflow.successRate > 75 ? "bg-yellow-500" :
                            "bg-red-500"
                          }
                        />
                        <span className="font-medium">{workflow.successRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Steps:</p>
                      <p className="font-medium">{workflow.steps} steps</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 pt-2">
                  <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {workflow.status === "active" ? (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          {/* Integrations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md flex-shrink-0 bg-gray-100 flex items-center justify-center">
                        {integration.icon ? (
                          <img 
                            src={integration.icon} 
                            alt={integration.name} 
                            className="h-8 w-8 object-contain" 
                          />
                        ) : (
                          <Code className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                    </div>
                    {renderStatusBadge(integration.status)}
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last Sync:</p>
                      <p className="font-medium">{integration.lastSync}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Connected Apps:</p>
                      <p className="font-medium">{integration.connectedApps}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {integration.status === "connected" ? (
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Manage Connection
                    </Button>
                  ) : (
                    <Button className="bg-primary" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Platform
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Logs</CardTitle>
              <CardDescription>View logs of your automation workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-4">
                  {/* Example log entries */}
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <p className="font-medium">New Customer Onboarding</p>
                      <span className="text-sm text-muted-foreground">Today, 11:32 AM</span>
                    </div>
                    <p className="text-sm">Workflow completed successfully for customer #10053</p>
                    <div className="flex items-center mt-1 text-green-600 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Success
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Inventory Restock Alerts</p>
                      <span className="text-sm text-muted-foreground">Today, 9:18 AM</span>
                    </div>
                    <p className="text-sm">Failed to connect to inventory API</p>
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" /> Error
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Invoice Payment Reminder</p>
                      <span className="text-sm text-muted-foreground">Today, 9:00 AM</span>
                    </div>
                    <p className="text-sm">Sent 8 payment reminders</p>
                    <div className="flex items-center mt-1 text-green-600 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Success
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <p className="font-medium">Social Media Content Distribution</p>
                      <span className="text-sm text-muted-foreground">Yesterday, 4:45 PM</span>
                    </div>
                    <p className="text-sm">Workflow was manually paused</p>
                    <div className="flex items-center mt-1 text-yellow-600 text-xs">
                      <Pause className="h-3 w-3 mr-1" /> Paused
                    </div>
                  </div>
                  
                  {/* Add more logs as needed */}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export Logs
              </Button>
              <Button variant="ghost">
                <RotateCcw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure global automation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Email notifications for failures</label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Slack notifications</label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">API & Webhooks</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">API credentials</label>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Webhook endpoints</label>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Runtime Settings</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Default timeouts</label>
                      <div className="flex">
                        <Input 
                          type="number" 
                          className="w-16 text-right mr-2" 
                          defaultValue={30} 
                          min={1}
                        />
                        <span className="text-sm self-center">seconds</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Rate limiting</label>
                      <div className="flex">
                        <Input 
                          type="number" 
                          className="w-16 text-right mr-2" 
                          defaultValue={100} 
                          min={1}
                        />
                        <span className="text-sm self-center">per minute</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Retry Logic</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Maximum retries</label>
                      <Input 
                        type="number" 
                        className="w-16 text-right" 
                        defaultValue={3} 
                        min={0}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Retry backoff</label>
                      <Select defaultValue="exponential">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="exponential">Exponential</SelectItem>
                          <SelectItem value="constant">Constant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button className="bg-primary">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}