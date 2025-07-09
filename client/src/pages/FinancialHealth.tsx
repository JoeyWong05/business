import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import MainLayout from '@/components/MainLayout';
import UpcomingBillsTable, { BillItem } from '@/components/UpcomingBillsTable';
import SalesPipelineChart, { PipelineData } from '@/components/SalesPipelineChart';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function FinancialHealth() {
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedView, setSelectedView] = useState<string>('all');

  // Fetch business entities
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: () => apiRequest<{ entities: Array<{ id: number; name: string }> }>('/api/business-entities')
  });

  // Fetch financial data (bills and subscriptions)
  const { data: financialData, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['/api/financial-data', selectedEntity],
    queryFn: () => apiRequest<{ 
      bills: BillItem[];
      upcomingRenewals: BillItem[];
    }>(`/api/financial-data${selectedEntity !== 'all' ? `?entityId=${selectedEntity}` : ''}`)
  });

  // Fetch sales pipeline data
  const { data: pipelineData, isLoading: isLoadingPipeline } = useQuery({
    queryKey: ['/api/sales-pipeline', selectedEntity],
    queryFn: () => apiRequest<{ 
      pipelines: PipelineData[] 
    }>(`/api/sales-pipeline${selectedEntity !== 'all' ? `?entityId=${selectedEntity}` : ''}`)
  });

  // Mock data until the API endpoints are fully implemented
  const mockBills: BillItem[] = [
    {
      id: 1,
      name: "QuickBooks Subscription",
      amount: 70,
      dueDate: new Date(2025, 3, 15),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Finance",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 2,
      name: "Adobe Creative Cloud",
      amount: 52.99,
      dueDate: new Date(2025, 3, 10),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Design Tools",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 3,
      name: "Shopify Advanced Plan",
      amount: 299,
      dueDate: new Date(2025, 3, 5),
      entityId: 2,
      entityName: "Mystery Hype",
      category: "E-commerce",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 4,
      name: "Office Rent",
      amount: 2500,
      dueDate: new Date(2025, 3, 1),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Operations",
      status: "overdue",
      recurringType: "monthly"
    },
    {
      id: 5,
      name: "G Suite Business",
      amount: 12 * 18,
      dueDate: new Date(2025, 3, 15),
      entityId: 3,
      entityName: "Lone Star Custom Clothing",
      category: "Productivity",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 6,
      name: "Web Hosting",
      amount: 29.99,
      dueDate: new Date(2025, 3, 20),
      entityId: 2,
      entityName: "Mystery Hype",
      category: "IT Infrastructure",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 7,
      name: "Insurance Premium",
      amount: 450,
      dueDate: new Date(2025, 5, 15),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Insurance",
      status: "paid",
      recurringType: "quarterly"
    }
  ];
  
  const mockPipelines: PipelineData[] = [
    {
      entityId: 1,
      entityName: "Digital Merch Pros",
      totalValue: 187500,
      stages: [
        { name: "Lead", value: 60000, count: 12, color: "#8884d8" },
        { name: "Qualified", value: 45000, count: 6, color: "#83a6ed" },
        { name: "Proposal", value: 37500, count: 3, color: "#8dd1e1" },
        { name: "Negotiation", value: 25000, count: 2, color: "#82ca9d" },
        { name: "Closed Won", value: 20000, count: 1, color: "#a4de6c" }
      ]
    },
    {
      entityId: 2,
      entityName: "Mystery Hype",
      totalValue: 142000,
      stages: [
        { name: "Lead", value: 50000, count: 10, color: "#8884d8" },
        { name: "Qualified", value: 40000, count: 5, color: "#83a6ed" },
        { name: "Proposal", value: 25000, count: 2, color: "#8dd1e1" },
        { name: "Negotiation", value: 15000, count: 1, color: "#82ca9d" },
        { name: "Closed Won", value: 12000, count: 1, color: "#a4de6c" }
      ]
    },
    {
      entityId: 3,
      entityName: "Lone Star Custom Clothing",
      totalValue: 95000,
      stages: [
        { name: "Lead", value: 35000, count: 7, color: "#8884d8" },
        { name: "Qualified", value: 25000, count: 4, color: "#83a6ed" },
        { name: "Proposal", value: 20000, count: 2, color: "#8dd1e1" },
        { name: "Negotiation", value: 10000, count: 1, color: "#82ca9d" },
        { name: "Closed Won", value: 5000, count: 1, color: "#a4de6c" }
      ]
    },
    {
      entityId: 4,
      entityName: "Alcoeaze",
      totalValue: 75000,
      stages: [
        { name: "Lead", value: 30000, count: 6, color: "#8884d8" },
        { name: "Qualified", value: 20000, count: 3, color: "#83a6ed" },
        { name: "Proposal", value: 15000, count: 2, color: "#8dd1e1" },
        { name: "Negotiation", value: 10000, count: 1, color: "#82ca9d" },
        { name: "Closed Won", value: 0, count: 0, color: "#a4de6c" }
      ]
    },
    {
      entityId: 5,
      entityName: "Hide Cafe Bars",
      totalValue: 60000,
      stages: [
        { name: "Lead", value: 25000, count: 5, color: "#8884d8" },
        { name: "Qualified", value: 15000, count: 2, color: "#83a6ed" },
        { name: "Proposal", value: 10000, count: 1, color: "#8dd1e1" },
        { name: "Negotiation", value: 10000, count: 1, color: "#82ca9d" },
        { name: "Closed Won", value: 0, count: 0, color: "#a4de6c" }
      ]
    }
  ];

  // Filter bills and pipelines based on selected entity
  const filteredBills = selectedEntity === 'all' 
    ? mockBills 
    : mockBills.filter(bill => bill.entityId === parseInt(selectedEntity));

  const filteredPipelines = selectedEntity === 'all'
    ? mockPipelines
    : mockPipelines.filter(pipeline => pipeline.entityId === parseInt(selectedEntity));

  // Calculate total upcoming expenses for all filtered bills
  const totalUpcomingExpenses = filteredBills
    .filter(bill => bill.status !== 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  // Calculate total pipeline value for filtered entities
  const totalPipelineValue = filteredPipelines.reduce((sum, pipeline) => sum + pipeline.totalValue, 0);

  return (
    <MainLayout
      title="Financial Health"
      description="Track upcoming bills, subscription costs, and sales pipeline across all business entities."
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor costs and revenue opportunities by entity</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 self-end">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Financial Data</SelectItem>
              <SelectItem value="bills">Upcoming Bills</SelectItem>
              <SelectItem value="pipeline">Sales Pipeline</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {isLoadingEntities ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                entitiesData?.entities.map(entity => (
                  <SelectItem key={entity.id} value={entity.id.toString()}>
                    {entity.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Expenses</p>
                <h2 className="text-3xl font-bold mt-2">${totalUpcomingExpenses.toLocaleString()}</h2>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-red-600">account_balance_wallet</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {filteredBills.filter(bill => bill.status === 'overdue').length} overdue bills totaling 
              ${filteredBills.filter(bill => bill.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sales Pipeline Value</p>
                <h2 className="text-3xl font-bold mt-2">${totalPipelineValue.toLocaleString()}</h2>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-green-600">trending_up</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {filteredPipelines.reduce((sum, pipeline) => sum + pipeline.stages.reduce((total, stage) => total + stage.count, 0), 0)} active deals across all stages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Financial Health Ratio</p>
                <h2 className="text-3xl font-bold mt-2">
                  {totalUpcomingExpenses > 0 
                    ? (totalPipelineValue / totalUpcomingExpenses).toFixed(1) 
                    : "∞"}x
                </h2>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-icons text-blue-600">health_and_safety</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {totalPipelineValue > totalUpcomingExpenses * 3 
                ? "Excellent financial outlook" 
                : totalPipelineValue > totalUpcomingExpenses 
                  ? "Good financial balance" 
                  : "Needs attention"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Financial Data</TabsTrigger>
          <TabsTrigger value="bills">Upcoming Bills</TabsTrigger>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Upcoming Bills Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Bills & Subscriptions</h2>
            <UpcomingBillsTable 
              bills={filteredBills} 
              entityId={selectedEntity === 'all' ? 'all' : parseInt(selectedEntity)}
              limit={5}
              showHeader={false}
            />
          </div>

          {/* Sales Pipeline Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Sales Pipeline</h2>
            <div className="grid grid-cols-1 gap-6">
              {selectedEntity === 'all' ? (
                // Show all pipelines
                filteredPipelines.map(pipeline => (
                  <SalesPipelineChart 
                    key={pipeline.entityId} 
                    data={pipeline}
                    showHeader={true}
                  />
                ))
              ) : filteredPipelines.length > 0 ? (
                // Show specific entity pipeline
                <SalesPipelineChart 
                  data={filteredPipelines[0]}
                  showHeader={true}
                />
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No pipeline data available for this entity</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bills">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bills & Subscriptions</h2>
          <UpcomingBillsTable 
            bills={filteredBills} 
            entityId={selectedEntity === 'all' ? 'all' : parseInt(selectedEntity)}
            limit={20}
            showHeader={false}
          />
        </TabsContent>

        <TabsContent value="pipeline">
          <h2 className="text-xl font-semibold mb-4">Sales Pipeline</h2>
          <div className="grid grid-cols-1 gap-6">
            {selectedEntity === 'all' ? (
              // Show all pipelines
              filteredPipelines.map(pipeline => (
                <SalesPipelineChart 
                  key={pipeline.entityId} 
                  data={pipeline}
                  showHeader={true}
                />
              ))
            ) : filteredPipelines.length > 0 ? (
              // Show specific entity pipeline
              <SalesPipelineChart 
                data={filteredPipelines[0]}
                showHeader={true}
              />
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No pipeline data available for this entity</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}