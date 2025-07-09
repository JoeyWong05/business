import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CostBreakdownChart from '@/components/CostBreakdownChart';
import CostBreakdownTable from '@/components/CostBreakdownTable';
import CostForecastChart from '@/components/CostForecastChart';
import UpcomingBillsTable from '@/components/UpcomingBillsTable';
import SalesPipelineChart from '@/components/SalesPipelineChart';
import { 
  Banknote, 
  BarChart, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download,
  LineChart, 
  PiggyBank, 
  Plus, 
  RefreshCw, 
  Share2,
  Wallet
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Interface for integration status
interface IntegrationStatus {
  name: string;
  status: 'connected' | 'pending' | 'error';
  lastSync: string;
  icon: React.ReactNode;
}

// Financial Dashboard component
const FinancialDashboard = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Mock financial data
  const costData = [
    { name: 'Marketing Tools', value: 2350, color: '#8884d8' },
    { name: 'Operations', value: 1890, color: '#83a6ed' },
    { name: 'Sales', value: 2800, color: '#8dd1e1' },
    { name: 'Finance', value: 1200, color: '#82ca9d' },
    { name: 'Customer Support', value: 980, color: '#a4de6c' },
  ];
  
  const forecastData = [
    { name: 'Jan', value: 4000, projection: 4000 },
    { name: 'Feb', value: 4200, projection: 4200 },
    { name: 'Mar', value: 4500, projection: 4500 },
    { name: 'Apr', value: 4800, projection: 4800 },
    { name: 'May', value: 5100, projection: 5100 },
    { name: 'Jun', value: 5400, projection: 5400 },
    { name: 'Jul', value: 0, projection: 5700 },
    { name: 'Aug', value: 0, projection: 6000 },
    { name: 'Sep', value: 0, projection: 6300 },
    { name: 'Oct', value: 0, projection: 6600 },
    { name: 'Nov', value: 0, projection: 6900 },
    { name: 'Dec', value: 0, projection: 7200 },
  ];
  
  // Integration status
  const integrations: IntegrationStatus[] = [
    { 
      name: 'QuickBooks', 
      status: 'connected', 
      lastSync: 'Today at 09:45 AM',
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
    },
    { 
      name: 'Shopify', 
      status: 'connected', 
      lastSync: 'Today at 09:45 AM',
      icon: <Wallet className="h-5 w-5 text-green-500" />,
    },
    { 
      name: 'Stripe', 
      status: 'connected', 
      lastSync: 'Today at 09:45 AM',
      icon: <CreditCard className="h-5 w-5 text-green-500" />,
    },
    { 
      name: 'PayPal', 
      status: 'pending', 
      lastSync: 'Connection required',
      icon: <PiggyBank className="h-5 w-5 text-yellow-500" />,
    },
    { 
      name: 'Square', 
      status: 'error', 
      lastSync: 'Authentication failed',
      icon: <CreditCard className="h-5 w-5 text-red-500" />,
    },
  ];
  
  // Sample pipeline data
  const pipelineData = {
    entityId: 1,
    entityName: selectedEntity === 'all' ? 'All Entities' : selectedEntity,
    totalValue: 125000,
    stages: [
      { name: 'Leads', value: 45000, count: 15, color: '#8884d8' },
      { name: 'Qualified', value: 30000, count: 8, color: '#83a6ed' },
      { name: 'Proposal', value: 25000, count: 5, color: '#8dd1e1' },
      { name: 'Negotiation', value: 15000, count: 3, color: '#82ca9d' },
      { name: 'Closed', value: 10000, count: 2, color: '#a4de6c' },
    ],
  };
  
  // Sample tool cost data
  const toolCostItems = [
    { id: 1, name: 'Shopify', category: 'Sales', monthlyPrice: 299, businessEntityId: 1, businessEntityName: 'Digital Merch Pros' },
    { id: 2, name: 'QuickBooks', category: 'Finance', monthlyPrice: 75, businessEntityId: 1, businessEntityName: 'Digital Merch Pros' },
    { id: 3, name: 'Mailchimp', category: 'Marketing', monthlyPrice: 149, businessEntityId: 2, businessEntityName: 'Mystery Hype' },
    { id: 4, name: 'Salesforce', category: 'Sales', monthlyPrice: 150, businessEntityId: 2, businessEntityName: 'Mystery Hype' },
    { id: 5, name: 'Zoom', category: 'Operations', monthlyPrice: 25, businessEntityId: 3, businessEntityName: 'Lone Star Custom Clothing' },
    { id: 6, name: 'Monday.com', category: 'Operations', monthlyPrice: 39, businessEntityId: 3, businessEntityName: 'Lone Star Custom Clothing' },
    { id: 7, name: 'Slack', category: 'Operations', monthlyPrice: 12, businessEntityId: 4, businessEntityName: 'Alcoeaze' },
    { id: 8, name: 'Google Workspace', category: 'Operations', monthlyPrice: 18, businessEntityId: 5, businessEntityName: 'Hide Cafe Bars' },
  ];
  
  // Sample bills
  const bills = [
    { id: 1, name: 'Rent - Main Office', amount: 3500, dueDate: new Date(2025, 3, 1), entityId: 1, entityName: 'Digital Merch Pros', category: 'Operations', status: 'pending', recurringType: 'monthly' },
    { id: 2, name: 'Digital Ocean', amount: 125, dueDate: new Date(2025, 3, 5), entityId: 2, entityName: 'Mystery Hype', category: 'Technology', status: 'pending', recurringType: 'monthly' },
    { id: 3, name: 'Adobe Creative Cloud', amount: 79.99, dueDate: new Date(2025, 3, 7), entityId: 3, entityName: 'Lone Star Custom Clothing', category: 'Marketing', status: 'pending', recurringType: 'monthly' },
    { id: 4, name: 'Shopify Annual Plan', amount: 1068, dueDate: new Date(2025, 4, 12), entityId: 1, entityName: 'Digital Merch Pros', category: 'Sales', status: 'pending', recurringType: 'annual' },
    { id: 5, name: 'Warehouse Lease', amount: 2200, dueDate: new Date(2025, 3, 15), entityId: 4, entityName: 'Alcoeaze', category: 'Operations', status: 'pending', recurringType: 'monthly' },
  ];
  
  // Business entities
  const entities = [
    { id: 1, name: 'Digital Merch Pros' },
    { id: 2, name: 'Mystery Hype' },
    { id: 3, name: 'Lone Star Custom Clothing' },
    { id: 4, name: 'Alcoeaze' },
    { id: 5, name: 'Hide Cafe Bars' },
  ];
  
  // Calculate total monthly costs
  const totalMonthlyCost = toolCostItems.reduce((sum, item) => sum + item.monthlyPrice, 0);
  
  // Filter bills based on selected entity
  const filteredBills = selectedEntity === 'all' 
    ? bills 
    : bills.filter(bill => bill.entityName === selectedEntity);
  
  // Filter tool costs based on selected entity
  const filteredToolCosts = selectedEntity === 'all'
    ? toolCostItems
    : toolCostItems.filter(item => item.businessEntityName === selectedEntity);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
          <p className="text-muted-foreground">
            Track your financial health across all business entities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedEntity}
            onValueChange={setSelectedEntity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {entities.map(entity => (
                <SelectItem key={entity.id} value={entity.name}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={timeframe}
            onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setTimeframe(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +5.1% from last month
            </p>
            <div className="mt-3">
              <Progress value={75} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                75% of planned budget
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$85,245</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
            <div className="mt-3">
              <Progress value={85} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                85% toward quarterly goal
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profit Margin
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.6%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
            <div className="mt-3">
              <Progress value={68} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                68% of target margin
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
            <div className="mt-3 flex gap-1">
              <Badge variant="outline" className="text-xs">
                8 renewing soon
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 text-xs">
                3 at risk
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Cost Forecast</CardTitle>
                <CardDescription>
                  Projected expenses for the next 12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <CostForecastChart data={forecastData} />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>
                  Current month expense distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <CostBreakdownChart
                  data={costData}
                  timeframe={timeframe}
                  entityName={selectedEntity === 'all' ? 'All Entities' : selectedEntity}
                  totalCost={totalMonthlyCost}
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Bills</CardTitle>
                <CardDescription>
                  Bills due in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingBillsTable
                  bills={filteredBills}
                  showHeader={true}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>
                  Current sales opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <SalesPipelineChart
                  data={pipelineData}
                  showHeader={false}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tool & Subscription Costs</CardTitle>
                  <CardDescription>
                    All active subscriptions and recurring costs
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CostBreakdownTable
                data={filteredToolCosts}
                timeframe="monthly"
                showEntities={selectedEntity === 'all'}
                title={selectedEntity === 'all' ? 'All Entities' : selectedEntity}
              />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <CostBreakdownChart
                  data={costData}
                  timeframe={timeframe}
                  entityName={selectedEntity === 'all' ? 'All Entities' : selectedEntity}
                  totalCost={totalMonthlyCost}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
                <CardDescription>
                  6-month expense trend by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="mx-auto h-10 w-10 opacity-50" />
                  <p className="mt-2">Trend chart visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Channel</CardTitle>
                <CardDescription>
                  Distribution across sales channels
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="mx-auto h-10 w-10 opacity-50" />
                  <p className="mt-2">Revenue channel chart</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>
                  Year-over-year revenue comparison
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="mx-auto h-10 w-10 opacity-50" />
                  <p className="mt-2">Revenue growth chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sales Pipeline</CardTitle>
                  <CardDescription>
                    Current sales opportunities and conversion rates
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Opportunity
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SalesPipelineChart
                data={pipelineData}
                showHeader={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connected Financial Services</CardTitle>
                  <CardDescription>
                    Manage your financial data integrations
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Integration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {integration.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          integration.status === 'connected' 
                            ? 'default' 
                            : integration.status === 'pending' 
                            ? 'outline' 
                            : 'destructive'
                        }
                      >
                        {integration.status === 'connected' 
                          ? 'Connected' 
                          : integration.status === 'pending' 
                          ? 'Pending' 
                          : 'Error'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">
                  Last sync: Today at 09:45 AM
                </p>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync All
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>
                  Connected bank accounts and balances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                      <span>Main Business Checking</span>
                    </div>
                    <div className="font-medium">$42,892.65</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>Savings Account</span>
                    </div>
                    <div className="font-medium">$125,430.20</div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      <span>Business Credit Card</span>
                    </div>
                    <div className="font-medium text-red-500">-$8,245.33</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Automated financial reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Income Statement</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span>Balance Sheet</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg p-3 hover:bg-secondary">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span>Cash Flow Statement</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>
                    Generate and download financial reports
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Profit & Loss</h3>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Income statement showing revenue, expenses, and profit/loss
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Balance Sheet</h3>
                    <Badge variant="outline">Quarterly</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Snapshot of assets, liabilities, and shareholder equity
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Cash Flow</h3>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Statement of cash inflows and outflows
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Expense Report</h3>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Detailed breakdown of all business expenses
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Sales Tax</h3>
                    <Badge variant="outline">Quarterly</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Sales tax collected and owed by jurisdiction
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Entity Comparison</h3>
                    <Badge variant="outline">Custom</Badge>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Financial comparison across all business entities
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automated report delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Monthly Financial Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Sent on the 1st of every month to 3 recipients
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">Weekly Cash Position</h3>
                    <p className="text-sm text-muted-foreground">
                      Sent every Monday to 2 recipients
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;