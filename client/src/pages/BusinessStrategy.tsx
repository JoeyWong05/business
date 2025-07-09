import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BriefcaseIcon, ChartBarIcon, TrendingUpIcon, XIcon, PlusIcon, Trash2Icon, SettingsIcon, DownloadIcon, Activity } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BusinessEntity {
  id: number;
  name: string;
  type: string;
  description?: string;
}

interface BlueOceanStrategy {
  id: number;
  entityId: number;
  industryFactors: {
    factorName: string;
    currentIndustryLevel: number;
    ourStrategy: number;
  }[];
  keyCompetitors: string[];
  eliminateFactors: string[];
  reduceFactors: string[];
  raiseFactors: string[];
  createFactors: string[];
  valueProposition: string;
  lastUpdated: string;
}

interface CapacityEquation {
  id: number;
  entityId: number;
  productivityMetrics: {
    role: string;
    hoursPerWeek: number;
    billablePercent: number;
    capacityUtilization: number;
    maxClientLoad: number;
    currentClientLoad: number;
  }[];
  bottlenecks: string[];
  nextHireThreshold: {
    role: string;
    utilizationThreshold: number;
    requiredClientIncrease: number;
    projectedDate: string;
  }[];
  lastUpdated: string;
}

export default function BusinessStrategy() {
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("blue-ocean");

  // Query to fetch business entities
  const { data: entitiesData } = useQuery({
    queryKey: ['/api/business-entities'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const entities = entitiesData?.entities || [];

  // Mock blue ocean strategies data (would come from API in production)
  const blueOceanStrategies: BlueOceanStrategy[] = [
    {
      id: 1,
      entityId: 1, // Digital Merch Pros
      industryFactors: [
        { factorName: "Price", currentIndustryLevel: 8, ourStrategy: 5 },
        { factorName: "Quality", currentIndustryLevel: 6, ourStrategy: 9 },
        { factorName: "Service Speed", currentIndustryLevel: 5, ourStrategy: 8 },
        { factorName: "Design Innovation", currentIndustryLevel: 3, ourStrategy: 9 },
        { factorName: "Customer Support", currentIndustryLevel: 4, ourStrategy: 8 },
        { factorName: "Technical Complexity", currentIndustryLevel: 7, ourStrategy: 4 }
      ],
      keyCompetitors: ["Generic Merch Co", "Print On Demand Inc", "Bulk Apparel Solutions"],
      eliminateFactors: ["Complex approval processes", "Minimum order quantities"],
      reduceFactors: ["Design revisions", "Technical complexity", "Price"],
      raiseFactors: ["Design quality", "Speed to market", "Customer support availability"],
      createFactors: ["AI-powered design suggestions", "Real-time revision collaboration", "Sustainability tracking"],
      valueProposition: "We help businesses create high-quality branded merchandise with faster turnaround times and simplified processes at competitive prices.",
      lastUpdated: "2023-12-15"
    },
    {
      id: 2,
      entityId: 2, // Mystery Hype
      industryFactors: [
        { factorName: "Exclusivity", currentIndustryLevel: 7, ourStrategy: 10 },
        { factorName: "Price", currentIndustryLevel: 9, ourStrategy: 9 },
        { factorName: "Product Range", currentIndustryLevel: 6, ourStrategy: 4 },
        { factorName: "Unboxing Experience", currentIndustryLevel: 4, ourStrategy: 10 },
        { factorName: "Brand Collaboration", currentIndustryLevel: 5, ourStrategy: 8 },
        { factorName: "Customization", currentIndustryLevel: 3, ourStrategy: 2 }
      ],
      keyCompetitors: ["Surprise Box Co", "Luxury Monthly", "Exclusive Drops Inc"],
      eliminateFactors: ["Predictable products", "Mass market items", "Customer choice paralysis"],
      reduceFactors: ["Product range", "Customization options", "Long-term subscriptions"],
      raiseFactors: ["Exclusivity", "Unboxing experience", "Social media shareability"],
      createFactors: ["Digital collectible twins", "Community-exclusive events", "Artificial scarcity drops"],
      valueProposition: "We deliver exclusive, limited-edition mystery boxes that create excitement, social currency, and unforgettable unboxing experiences for customers seeking the thrill of curated surprise.",
      lastUpdated: "2023-11-30"
    }
  ];

  // Mock capacity equation data (would come from API in production)
  const capacityEquations: CapacityEquation[] = [
    {
      id: 1,
      entityId: 1, // Digital Merch Pros
      productivityMetrics: [
        { role: "Designer", hoursPerWeek: 40, billablePercent: 75, capacityUtilization: 85, maxClientLoad: 12, currentClientLoad: 10 },
        { role: "Project Manager", hoursPerWeek: 40, billablePercent: 80, capacityUtilization: 90, maxClientLoad: 15, currentClientLoad: 14 },
        { role: "Production Specialist", hoursPerWeek: 40, billablePercent: 90, capacityUtilization: 75, maxClientLoad: 20, currentClientLoad: 15 },
        { role: "Customer Success Rep", hoursPerWeek: 40, billablePercent: 60, capacityUtilization: 70, maxClientLoad: 25, currentClientLoad: 18 }
      ],
      bottlenecks: ["Design approval process", "Project manager capacity", "Custom artwork creation"],
      nextHireThreshold: [
        { role: "Project Manager", utilizationThreshold: 90, requiredClientIncrease: 2, projectedDate: "2024-02-15" },
        { role: "Designer", utilizationThreshold: 85, requiredClientIncrease: 3, projectedDate: "2024-04-01" }
      ],
      lastUpdated: "2024-01-10"
    },
    {
      id: 2,
      entityId: 2, // Mystery Hype
      productivityMetrics: [
        { role: "Curator", hoursPerWeek: 40, billablePercent: 70, capacityUtilization: 80, maxClientLoad: 0, currentClientLoad: 0 },
        { role: "Procurement Specialist", hoursPerWeek: 40, billablePercent: 85, capacityUtilization: 95, maxClientLoad: 0, currentClientLoad: 0 },
        { role: "Packing & Fulfillment", hoursPerWeek: 40, billablePercent: 95, capacityUtilization: 65, maxClientLoad: 0, currentClientLoad: 0 },
        { role: "Community Manager", hoursPerWeek: 30, billablePercent: 60, capacityUtilization: 90, maxClientLoad: 0, currentClientLoad: 0 }
      ],
      bottlenecks: ["Product procurement", "Product selection process", "Community engagement"],
      nextHireThreshold: [
        { role: "Procurement Specialist", utilizationThreshold: 95, requiredClientIncrease: 150, projectedDate: "2024-03-01" },
        { role: "Community Manager", utilizationThreshold: 90, requiredClientIncrease: 200, projectedDate: "2024-05-15" }
      ],
      lastUpdated: "2024-01-05"
    }
  ];

  // Get the selected entity's blue ocean strategy
  const selectedEntityStrategy = blueOceanStrategies.find(strategy => 
    strategy.entityId === selectedEntityId
  );

  // Get the selected entity's capacity equation
  const selectedEntityCapacity = capacityEquations.find(capacity => 
    capacity.entityId === selectedEntityId
  );

  // Get the selected entity name
  const selectedEntity = entities.find(entity => entity.id === selectedEntityId);
  const entityName = selectedEntity?.name || "Select an entity";

  return (
    <MainLayout title="Business Strategy">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Strategy</h1>
            <p className="text-muted-foreground">
              Strategic planning and capacity management for your business entities
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select
              value={selectedEntityId?.toString() || ""}
              onValueChange={(value) => setSelectedEntityId(parseInt(value))}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a business entity" />
              </SelectTrigger>
              <SelectContent>
                {entities.map((entity: BusinessEntity) => (
                  <SelectItem key={entity.id} value={entity.id.toString()}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedEntityId && (
              <Button variant="outline">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export Strategy
              </Button>
            )}
          </div>
        </div>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blue-ocean">Blue Ocean Strategy</TabsTrigger>
            <TabsTrigger value="capacity-equation">Capacity Equation</TabsTrigger>
          </TabsList>
          
          {/* Blue Ocean Strategy */}
          <TabsContent value="blue-ocean" className="space-y-6">
            {!selectedEntityId ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto">
                    <ChartBarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a Business Entity</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Choose an entity from the dropdown above to view or create a Blue Ocean Strategy.
                  </p>
                </CardContent>
              </Card>
            ) : selectedEntityStrategy ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartBarIcon className="h-5 w-5" />
                      Strategy Canvas
                    </CardTitle>
                    <CardDescription>
                      Visualize how {entityName}'s strategy differs from industry standards across key factors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      {/* Replace with actual chart component */}
                      <div className="border rounded-lg h-full bg-muted/20 flex items-center justify-center">
                        <div className="space-y-6 w-full px-6">
                          {selectedEntityStrategy.industryFactors.map((factor, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{factor.factorName}</span>
                                <div className="flex gap-2">
                                  <Badge variant="outline">Industry: {factor.currentIndustryLevel}/10</Badge>
                                  <Badge variant="default">Our Strategy: {factor.ourStrategy}/10</Badge>
                                </div>
                              </div>
                              <div className="relative h-2 w-full rounded-full bg-secondary">
                                <div
                                  className="absolute top-0 left-0 h-full rounded-full bg-primary"
                                  style={{ width: `${factor.ourStrategy * 10}%` }}
                                />
                                <div 
                                  className="absolute top-0 left-0 h-full rounded-full bg-muted-foreground/30 border-r-2 border-muted-foreground"
                                  style={{ width: `${factor.currentIndustryLevel * 10}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Key Competitors</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntityStrategy.keyCompetitors.map((competitor, index) => (
                          <Badge key={index} variant="secondary">
                            {competitor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Four Actions Framework
                    </CardTitle>
                    <CardDescription>
                      Key strategic actions to create uncontested market space
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-red-500">Eliminate</h3>
                      <div className="space-y-1">
                        {selectedEntityStrategy.eliminateFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <XIcon className="h-3 w-3 text-red-500" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-amber-500">Reduce</h3>
                      <div className="space-y-1">
                        {selectedEntityStrategy.reduceFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <TrendingUpIcon className="h-3 w-3 rotate-180 text-amber-500" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-blue-500">Raise</h3>
                      <div className="space-y-1">
                        {selectedEntityStrategy.raiseFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <TrendingUpIcon className="h-3 w-3 text-blue-500" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-green-500">Create</h3>
                      <div className="space-y-1">
                        {selectedEntityStrategy.createFactors.map((factor, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <PlusIcon className="h-3 w-3 text-green-500" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Value Proposition</CardTitle>
                    <CardDescription>
                      The unique value {entityName} offers to the market
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-primary pl-4 italic">
                      "{selectedEntityStrategy.valueProposition}"
                    </blockquote>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    Last updated: {new Date(selectedEntityStrategy.lastUpdated).toLocaleDateString()}
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto">
                    <PlusIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create Blue Ocean Strategy</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    No strategy found for {entityName}. Create a new Blue Ocean Strategy to identify uncontested market space.
                  </p>
                  <Button>
                    Create Strategy
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Capacity Equation */}
          <TabsContent value="capacity-equation" className="space-y-6">
            {!selectedEntityId ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto">
                    <BriefcaseIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select a Business Entity</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Choose an entity from the dropdown above to view or create a Capacity Equation.
                  </p>
                </CardContent>
              </Card>
            ) : selectedEntityCapacity ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Team Capacity & Utilization</CardTitle>
                    <CardDescription>
                      Current capacity utilization across roles for {entityName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Role</TableHead>
                          <TableHead>Hours/Week</TableHead>
                          <TableHead>Billable %</TableHead>
                          <TableHead>Utilization</TableHead>
                          <TableHead className="text-right">Client Capacity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEntityCapacity.productivityMetrics.map((metric, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{metric.role}</TableCell>
                            <TableCell>{metric.hoursPerWeek}</TableCell>
                            <TableCell>{metric.billablePercent}%</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full max-w-xs">
                                  <div className="h-2 w-full rounded-full bg-secondary">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        metric.capacityUtilization > 90 
                                          ? 'bg-red-500' 
                                          : metric.capacityUtilization > 75 
                                            ? 'bg-amber-500' 
                                            : 'bg-green-500'
                                      }`}
                                      style={{ width: `${metric.capacityUtilization}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="text-sm">{metric.capacityUtilization}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {metric.maxClientLoad > 0 ? (
                                <>
                                  <Badge variant={
                                    metric.currentClientLoad / metric.maxClientLoad > 0.9 
                                      ? "destructive" 
                                      : metric.currentClientLoad / metric.maxClientLoad > 0.7 
                                        ? "default" 
                                        : "secondary"
                                  }>
                                    {metric.currentClientLoad} / {metric.maxClientLoad}
                                  </Badge>
                                </>
                              ) : (
                                <span>N/A</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Next Hire Thresholds</CardTitle>
                    <CardDescription>
                      When to hire based on capacity utilization and client growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Role</TableHead>
                          <TableHead>Threshold</TableHead>
                          <TableHead>Client Growth Needed</TableHead>
                          <TableHead>Projected Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEntityCapacity.nextHireThreshold.map((threshold, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{threshold.role}</TableCell>
                            <TableCell>{threshold.utilizationThreshold}%</TableCell>
                            <TableCell>+{threshold.requiredClientIncrease}</TableCell>
                            <TableCell>
                              <Badge variant={
                                new Date(threshold.projectedDate) <= new Date() 
                                  ? "destructive" 
                                  : new Date(threshold.projectedDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                    ? "default"
                                    : "outline"
                              }>
                                {new Date(threshold.projectedDate).toLocaleDateString()}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>System Bottlenecks</CardTitle>
                    <CardDescription>
                      Current capacity constraints to address
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedEntityCapacity.bottlenecks.map((bottleneck, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-0.5 bg-red-100 dark:bg-red-900/30 p-1 rounded-full text-red-500">
                            <XIcon className="h-3 w-3" />
                          </div>
                          <div>
                            <p className="text-sm">{bottleneck}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    Last updated: {new Date(selectedEntityCapacity.lastUpdated).toLocaleDateString()}
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto">
                    <PlusIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create Capacity Equation</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    No capacity data found for {entityName}. Create a new Capacity Equation to determine optimal team size and hiring timelines.
                  </p>
                  <Button>
                    Create Capacity Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}