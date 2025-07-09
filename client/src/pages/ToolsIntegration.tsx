import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import MainLayout from '@/components/MainLayout';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Layers, 
  Link as LinkIcon, 
  Settings, 
  Plus, 
  ArrowRight,
  RefreshCw,
  Check,
  AlertCircle,
  AppWindow
} from 'lucide-react';
import { 
  SiGoogledrive, 
  SiDropbox, 
  SiAirtable, 
  SiSlack, 
  SiZoom, 
  SiAsana, 
  SiGithub, 
  SiZapier,
  SiMailchimp,
  SiStripe,
  SiQuickbooks,
  SiWordpress,
  SiFacebook,
  SiGoogle,
  SiHubspot,
  SiSendgrid,
  SiTwilio,
  SiShopify
} from 'react-icons/si';
import { IntegrationPlatform, IntegrationPlatformProps } from '@/components/integrations/IntegrationPlatform';
import { ConnectorHub } from '@/components/integrations/ConnectorHub';
import { DataMappingInterface } from '@/components/integrations/DataMappingInterface';
import type { DataField } from '@/components/integrations/DataMappingInterface';
import GoHighLevelIcon from '@/components/icons/GoHighLevelIcon';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'needs_attention';
  logo: string;
}

interface UserIntegration extends IntegrationPlatformProps {
  lastSyncTime?: string;
  connected: boolean;
}

export default function ToolsIntegration() {
  const [activeTab, setActiveTab] = useState('active-integrations');
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<UserIntegration | null>(null);
  
  // Sample user integrations data
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([
    {
      id: "shopify",
      name: "Shopify",
      description: "E-commerce platform integration",
      logo: <SiShopify className="h-6 w-6" />,
      category: "ecommerce",
      status: "connected",
      connected: true,
      lastSyncTime: "2025-03-24T15:45:00Z",
      featuresList: [
        "Product synchronization",
        "Order management",
        "Customer data integration",
        "Inventory tracking"
      ],
      dataTypes: [
        { name: "Products", canRead: true, canWrite: true },
        { name: "Orders", canRead: true, canWrite: false },
        { name: "Customers", canRead: true, canWrite: true },
        { name: "Inventory", canRead: true, canWrite: true }
      ]
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing platform",
      logo: <SiMailchimp className="h-6 w-6" />,
      category: "marketing",
      status: "connected",
      connected: true,
      lastSyncTime: "2025-03-25T09:30:00Z",
      featuresList: [
        "Email campaign automation",
        "Customer segmentation",
        "Analytics and reporting",
        "Template management"
      ],
      dataTypes: [
        { name: "Subscribers", canRead: true, canWrite: true },
        { name: "Campaigns", canRead: true, canWrite: true },
        { name: "Templates", canRead: true, canWrite: true },
        { name: "Analytics", canRead: true, canWrite: false }
      ]
    },
    {
      id: "googleanalytics",
      name: "Google Analytics",
      description: "Web analytics service",
      logo: <SiGoogle className="h-6 w-6" />,
      category: "analytics",
      status: "needs_attention",
      connected: true,
      lastSyncTime: "2025-03-20T11:15:00Z",
      featuresList: [
        "Website analytics",
        "User behavior tracking",
        "Conversion analytics",
        "Traffic source analysis"
      ],
      dataTypes: [
        { name: "Pageviews", canRead: true, canWrite: false },
        { name: "Events", canRead: true, canWrite: true },
        { name: "Conversions", canRead: true, canWrite: false },
        { name: "User data", canRead: true, canWrite: false }
      ]
    }
  ]);

  // Sample integration data (legacy)
  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Shopify',
      description: 'E-commerce platform integration',
      category: 'sales',
      status: 'connected',
      logo: 'shopify'
    },
    {
      id: '2',
      name: 'Stripe',
      description: 'Payment processing integration',
      category: 'finance',
      status: 'connected',
      logo: 'stripe'
    },
    {
      id: '3',
      name: 'Google Analytics',
      description: 'Analytics and reporting',
      category: 'marketing',
      status: 'needs_attention',
      logo: 'google'
    },
    {
      id: '4',
      name: 'Mailchimp',
      description: 'Email marketing platform',
      category: 'marketing',
      status: 'connected',
      logo: 'mailchimp'
    },
    {
      id: '5',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'operations',
      status: 'disconnected',
      logo: 'slack'
    },
    {
      id: '6',
      name: 'QuickBooks',
      description: 'Accounting and financial tracking',
      category: 'finance',
      status: 'connected',
      logo: 'quickbooks'
    },
    {
      id: '7',
      name: 'HubSpot',
      description: 'CRM and marketing hub',
      category: 'sales',
      status: 'connected',
      logo: 'hubspot'
    },
    {
      id: '8',
      name: 'Zapier',
      description: 'Workflow automation',
      category: 'operations',
      status: 'connected',
      logo: 'zapier'
    }
  ];

  // Sample data field mapping data for the Dialog
  const sourceSystem = {
    name: "DMPHQ",
    fields: [
      { 
        id: "customer_id", 
        name: "Customer ID", 
        type: "string" as const, 
        required: true,
        description: "Unique identifier for customer in DMPHQ"
      },
      { 
        id: "customer_name", 
        name: "Customer Name", 
        type: "string" as const, 
        required: true,
        description: "Full name of the customer"
      },
      { 
        id: "customer_email", 
        name: "Customer Email", 
        type: "string" as const, 
        required: true,
        description: "Primary email address for customer"
      },
      { 
        id: "customer_phone", 
        name: "Customer Phone", 
        type: "string" as const, 
        required: false,
        description: "Primary phone number for customer"
      },
      { 
        id: "customer_status", 
        name: "Customer Status", 
        type: "string" as const, 
        required: false,
        description: "Current status of the customer relationship"
      },
      { 
        id: "created_date", 
        name: "Created Date", 
        type: "date" as const, 
        required: true,
        description: "Date customer was created in system"
      }
    ]
  };

  const targetSystem = {
    name: selectedIntegration?.name || "Integration",
    fields: [
      { 
        id: "id", 
        name: "ID", 
        type: "string" as const, 
        required: true,
        description: "Unique identifier in target system"
      },
      { 
        id: "name", 
        name: "Name", 
        type: "string" as const, 
        required: true,
        description: "Contact name in target system"
      },
      { 
        id: "email", 
        name: "Email", 
        type: "string" as const, 
        required: true,
        description: "Contact email in target system"
      },
      { 
        id: "phone", 
        name: "Phone", 
        type: "string" as const, 
        required: false,
        description: "Contact phone in target system"
      },
      { 
        id: "status", 
        name: "Status", 
        type: "string" as const, 
        required: false,
        description: "Status in target system"
      },
      { 
        id: "tags", 
        name: "Tags", 
        type: "array" as const, 
        required: false,
        description: "Tags or labels in target system"
      }
    ]
  };
  
  // Filter integrations based on active tab (legacy)
  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === activeTab);

  const handleAddIntegration = (integration: IntegrationPlatformProps) => {
    // Convert the marketplace integration to a user integration
    const newIntegration: UserIntegration = {
      ...integration,
      connected: true,
      status: 'connected',
      lastSyncTime: new Date().toISOString()
    };
    
    // Add to user integrations if it doesn't already exist
    if (!userIntegrations.some(ui => ui.id === integration.id)) {
      setUserIntegrations([...userIntegrations, newIntegration]);
    }
    
    setShowAddIntegration(false);
  };

  const openMappingDialog = (integration: UserIntegration) => {
    setSelectedIntegration(integration);
    setShowMappingDialog(true);
  };

  // Count integrations by category (legacy)
  const marketingCount = integrations.filter(i => i.category === 'marketing').length;
  const salesCount = integrations.filter(i => i.category === 'sales').length;
  const financeCount = integrations.filter(i => i.category === 'finance').length;
  const operationsCount = integrations.filter(i => i.category === 'operations').length;

  // Count connected integrations
  const connectedCount = userIntegrations.filter(i => i.status === 'connected').length;
  const needsAttentionCount = userIntegrations.filter(i => i.status === 'needs_attention').length;
  const totalIntegrations = userIntegrations.length;

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tools & Integrations</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Connect your business systems and manage data flow between platforms
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="mr-2" onClick={() => setShowAddIntegration(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync All
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Integrations</p>
                <h3 className="text-2xl font-bold">{totalIntegrations}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Layers className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected</p>
                <h3 className="text-2xl font-bold">{connectedCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Not Connected</p>
                <h3 className="text-2xl font-bold">{totalIntegrations - connectedCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                <h3 className="text-2xl font-bold">{needsAttentionCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="active-integrations">
          <TabsList className="mb-4">
            <TabsTrigger value="active-integrations">Active Integrations</TabsTrigger>
            <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="api-connectors">API Connectors</TabsTrigger>
            <TabsTrigger value="sync-history">Sync History</TabsTrigger>
          </TabsList>
          
          {/* Active Integrations Tab */}
          <TabsContent value="active-integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userIntegrations.map((integration) => (
                <IntegrationPlatform
                  key={integration.id}
                  {...integration}
                  connectAction={() => openMappingDialog(integration)}
                />
              ))}
              
              {/* Add Integration Card */}
              <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer h-full" onClick={() => setShowAddIntegration(true)}>
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Add Integration</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Connect with third-party services and expand capabilities
                </p>
                <Button variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Browse Integrations
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          {/* Data Mapping Tab */}
          <TabsContent value="data-mapping">
            <Card>
              <CardHeader>
                <CardTitle>Data Mapping Configuration</CardTitle>
                <CardDescription>
                  Define how data flows between your connected systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="md:w-1/2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Source System</CardTitle>
                          <CardDescription>Select your data source</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center space-x-3 p-3 border rounded-md bg-muted/50">
                              <AppWindow className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">DMPHQ Platform</p>
                                <p className="text-xs text-muted-foreground">Primary data source</p>
                              </div>
                            </div>
                            
                            {userIntegrations.slice(0, 2).map((integration) => (
                              <div key={integration.id} className="flex items-center space-x-3 p-3 border rounded-md">
                                <div className="h-5 w-5 text-primary">
                                  {integration.logo}
                                </div>
                                <div>
                                  <p className="font-medium">{integration.name}</p>
                                  <p className="text-xs text-muted-foreground">{integration.category}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="md:w-1/2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Target System</CardTitle>
                          <CardDescription>Select your data destination</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-4">
                            {userIntegrations.map((integration) => (
                              <div 
                                key={integration.id} 
                                className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:border-primary/50"
                                onClick={() => openMappingDialog(integration)}
                              >
                                <div className="h-5 w-5 text-primary">
                                  {integration.logo}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{integration.name}</p>
                                  <p className="text-xs text-muted-foreground">{integration.category}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  Configure
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Data Mappings</CardTitle>
                      <CardDescription>
                        Data synchronization configurations between systems
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-4 flex items-center space-x-2">
                              <AppWindow className="h-5 w-5 text-primary" />
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <SiMailchimp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">DMPHQ to Mailchimp</h3>
                              <p className="text-sm text-muted-foreground">
                                Customer data synced to marketing contacts
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className="bg-green-500 text-white">Active</Badge>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-4 flex items-center space-x-2">
                              <SiZapier className="h-5 w-5 text-primary" />
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <AppWindow className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">Shopify to DMPHQ</h3>
                              <p className="text-sm text-muted-foreground">
                                Orders and products synced to platform
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className="bg-green-500 text-white">Active</Badge>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="mr-4 flex items-center space-x-2">
                              <AppWindow className="h-5 w-5 text-primary" />
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <SiGithub className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">DMPHQ to Google Analytics</h3>
                              <p className="text-sm text-muted-foreground">
                                Campaign data synced for analytics
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="destructive">Needs Attention</Badge>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Connectors Tab */}
          <TabsContent value="api-connectors">
            <Card>
              <CardHeader>
                <CardTitle>API Connectors</CardTitle>
                <CardDescription>
                  Manage API connections and webhooks for custom integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">API Keys</CardTitle>
                        <CardDescription>Manage authentication credentials</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                              <p className="font-medium">DMPHQ Public API</p>
                              <p className="text-xs text-muted-foreground">Created: March 12, 2025</p>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                          </li>
                          <li className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                              <p className="font-medium">Integration API</p>
                              <p className="text-xs text-muted-foreground">Created: March 20, 2025</p>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                          </li>
                        </ul>
                        <Button className="w-full mt-3" variant="outline">
                          <Plus className="h-4 w-4 mr-2" /> Create New API Key
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Webhooks</CardTitle>
                        <CardDescription>Manage event-based triggers</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                              <p className="font-medium">New Order Webhook</p>
                              <p className="text-xs text-muted-foreground">Trigger: Order Created</p>
                            </div>
                            <Badge className="bg-green-500 text-white">Active</Badge>
                          </li>
                          <li className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                              <p className="font-medium">Customer Update Webhook</p>
                              <p className="text-xs text-muted-foreground">Trigger: Customer Updated</p>
                            </div>
                            <Badge className="bg-green-500 text-white">Active</Badge>
                          </li>
                        </ul>
                        <Button className="w-full mt-3" variant="outline">
                          <Plus className="h-4 w-4 mr-2" /> Create New Webhook
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Custom API Documentation</CardTitle>
                      <CardDescription>Resources for developers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium mb-1">API Reference</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Complete documentation for all API endpoints
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            View Documentation
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium mb-1">SDKs & Libraries</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Client libraries for multiple languages
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Download SDKs
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium mb-1">Integration Tutorials</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Step-by-step guides for common use cases
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            View Tutorials
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sync History Tab */}
          <TabsContent value="sync-history">
            <Card>
              <CardHeader>
                <CardTitle>Sync History</CardTitle>
                <CardDescription>
                  View the history of data synchronization between your systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-4 py-3">Date & Time</th>
                        <th className="px-4 py-3">Integration</th>
                        <th className="px-4 py-3">Direction</th>
                        <th className="px-4 py-3">Data Type</th>
                        <th className="px-4 py-3">Records</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="bg-card">
                        <td className="px-4 py-3">Mar 25, 2025 9:30 AM</td>
                        <td className="px-4 py-3">Mailchimp</td>
                        <td className="px-4 py-3">Export</td>
                        <td className="px-4 py-3">Contacts</td>
                        <td className="px-4 py-3">241</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-500 text-white">Success</Badge>
                        </td>
                      </tr>
                      <tr className="bg-card">
                        <td className="px-4 py-3">Mar 24, 2025 3:45 PM</td>
                        <td className="px-4 py-3">Shopify</td>
                        <td className="px-4 py-3">Import</td>
                        <td className="px-4 py-3">Orders</td>
                        <td className="px-4 py-3">56</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-500 text-white">Success</Badge>
                        </td>
                      </tr>
                      <tr className="bg-card">
                        <td className="px-4 py-3">Mar 22, 2025 11:15 AM</td>
                        <td className="px-4 py-3">Google Analytics</td>
                        <td className="px-4 py-3">Export</td>
                        <td className="px-4 py-3">Events</td>
                        <td className="px-4 py-3">1,520</td>
                        <td className="px-4 py-3">
                          <Badge variant="destructive">Failed</Badge>
                        </td>
                      </tr>
                      <tr className="bg-card">
                        <td className="px-4 py-3">Mar 20, 2025 5:10 PM</td>
                        <td className="px-4 py-3">Mailchimp</td>
                        <td className="px-4 py-3">Export</td>
                        <td className="px-4 py-3">Campaign Data</td>
                        <td className="px-4 py-3">12</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-500 text-white">Success</Badge>
                        </td>
                      </tr>
                      <tr className="bg-card">
                        <td className="px-4 py-3">Mar 19, 2025 1:30 PM</td>
                        <td className="px-4 py-3">Shopify</td>
                        <td className="px-4 py-3">Import</td>
                        <td className="px-4 py-3">Products</td>
                        <td className="px-4 py-3">78</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-green-500 text-white">Success</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add Integration Dialog */}
        <Dialog open={showAddIntegration} onOpenChange={setShowAddIntegration}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Integration Marketplace</DialogTitle>
              <DialogDescription>
                Browse and connect with your favorite tools and platforms
              </DialogDescription>
            </DialogHeader>
            
            <ConnectorHub onAddIntegration={handleAddIntegration} />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddIntegration(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Data Mapping Dialog */}
        <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Configure Data Mapping</DialogTitle>
              <DialogDescription>
                {selectedIntegration ? `Define how data flows between DMPHQ and ${selectedIntegration.name}` : 'Define how data flows between systems'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <DataMappingInterface 
                sourceSystem={sourceSystem} 
                targetSystem={targetSystem}
                initialMappings={[
                  {
                    id: "mapping-1",
                    sourceField: "customer_id",
                    targetField: "id"
                  },
                  {
                    id: "mapping-2",
                    sourceField: "customer_name",
                    targetField: "name"
                  },
                  {
                    id: "mapping-3",
                    sourceField: "customer_email",
                    targetField: "email"
                  }
                ]}
                onSave={() => setShowMappingDialog(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}