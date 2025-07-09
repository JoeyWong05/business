import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Calculator, SaveAll, Trash2, Plus, ArrowRight } from 'lucide-react';

interface CostAnalysisSimulatorProps {
  businessEntities?: Array<{id: number, name: string}>;
  existingTools?: Array<{id: number, name: string, monthlyPrice: number, category: string}>;
  onSaveScenario?: (scenarioData: any) => void;
  selectedEntityId?: string;
}

export default function CostAnalysisSimulator({ 
  businessEntities = [], 
  existingTools = [],
  onSaveScenario,
  selectedEntityId = 'all'
}: CostAnalysisSimulatorProps) {
  // State for the new tool/idea/switch
  const [selectedTab, setSelectedTab] = useState("new-tool");
  const [toolName, setToolName] = useState("");
  const [ideaName, setIdeaName] = useState("");
  const [oldToolId, setOldToolId] = useState<string>("");
  const [switchJustification, setSwitchJustification] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState<number | ''>(0);
  const [setupFee, setSetupFee] = useState<number | ''>(0);
  const [selectedEntity, setSelectedEntity] = useState<string>(selectedEntityId !== 'all' ? selectedEntityId : "");
  const [businessImpact, setBusinessImpact] = useState<number[]>([0]);
  const [timeRequired, setTimeRequired] = useState<number | ''>(0);
  const [employeeCount, setEmployeeCount] = useState<number | ''>(1);
  const [employeeRate, setEmployeeRate] = useState<number | ''>(20);
  const [implementationMonths, setImplementationMonths] = useState<number | ''>(1);
  const [recurringTimeMonthly, setRecurringTimeMonthly] = useState<number | ''>(0);
  const [revenueImpact, setRevenueImpact] = useState<number | ''>(0);
  const [efficiencyGain, setEfficiencyGain] = useState<number | ''>(0);
  const [isRecurring, setIsRecurring] = useState(true);
  const [comparisonTool, setComparisonTool] = useState<string>("");

  // Cost projections
  const [projectionMonths, setProjectionMonths] = useState(24);

  // Calculate total implementation cost
  const implementationCost = 
    Number(setupFee) + 
    (Number(timeRequired) * Number(employeeCount) * Number(employeeRate)) + 
    (Number(monthlyPrice) * Number(implementationMonths));

  // Calculate monthly recurring cost
  const monthlyRecurringCost = 
    (isRecurring ? Number(monthlyPrice) : 0) + 
    (Number(recurringTimeMonthly) * Number(employeeRate));

  // Calculate ROI over time
  const calculateROI = (months: number) => {
    const totalCost = implementationCost + (monthlyRecurringCost * months);
    const totalEfficiencySavings = (Number(efficiencyGain) * months);
    const totalRevenueGain = (Number(revenueImpact) * months);
    
    return {
      totalCost,
      totalEfficiencySavings,
      totalRevenueGain,
      netImpact: totalRevenueGain + totalEfficiencySavings - totalCost,
      roi: totalCost > 0 
        ? ((totalRevenueGain + totalEfficiencySavings - totalCost) / totalCost) * 100 
        : 0
    };
  };

  // ROI at the end of projection period
  const roi = calculateROI(projectionMonths);

  // Generate data for charts
  const generateTimelineData = () => {
    const data = [];
    
    for (let month = 0; month <= projectionMonths; month++) {
      const monthlyCost = month === 0 
        ? implementationCost 
        : monthlyRecurringCost;
      
      const monthlyEfficiency = month === 0 
        ? 0 
        : Number(efficiencyGain);
      
      const monthlyRevenue = month === 0 
        ? 0 
        : Number(revenueImpact);
      
      const cumulativeCost = month === 0 
        ? implementationCost 
        : data[month - 1].cumulativeCost + monthlyCost;
      
      const cumulativeBenefit = month === 0 
        ? 0 
        : data[month - 1].cumulativeBenefit + monthlyEfficiency + monthlyRevenue;
      
      const netValue = cumulativeBenefit - cumulativeCost;
      
      data.push({
        month,
        monthlyCost,
        monthlyEfficiency,
        monthlyRevenue,
        cumulativeCost,
        cumulativeBenefit,
        netValue
      });
    }
    
    return data;
  };

  const timelineData = generateTimelineData();
  
  // Generate comparison data
  const generateComparisonData = () => {
    if (!comparisonTool) return [];
    
    const selectedToolData = existingTools.find(t => t.id.toString() === comparisonTool);
    if (!selectedToolData) return [];
    
    return [
      { name: selectedTab === "new-tool" ? toolName : ideaName, value: Number(monthlyPrice) },
      { name: selectedToolData.name, value: selectedToolData.monthlyPrice }
    ];
  };
  
  const comparisonData = generateComparisonData();

  // Function to handle saving the scenario
  const handleSaveScenario = () => {
    if (onSaveScenario) {
      const scenarioData = {
        type: selectedTab,
        name: selectedTab === "new-tool" ? toolName : ideaName,
        entityId: selectedEntity,
        implementationCost,
        monthlyRecurringCost,
        projectionMonths,
        roi: roi.roi,
        netImpact: roi.netImpact,
        timelineData,
        savedAt: new Date().toISOString()
      };
      
      onSaveScenario(scenarioData);
      
      // Reset form
      if (selectedTab === "new-tool") {
        setToolName("");
      } else {
        setIdeaName("");
      }
      setMonthlyPrice(0);
      setSetupFee(0);
      setBusinessImpact([0]);
      setTimeRequired(0);
      setEmployeeCount(1);
      setRecurringTimeMonthly(0);
      setRevenueImpact(0);
      setEfficiencyGain(0);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-tool">Add New Tool</TabsTrigger>
          <TabsTrigger value="switch-tool">Switch Tools</TabsTrigger>
          <TabsTrigger value="new-idea">Cost Business Idea</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-tool">
          <Card>
            <CardHeader>
              <CardTitle>New Tool Information</CardTitle>
              <CardDescription>
                Analyze the costs and benefits of adding a new tool to your tech stack
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Quick Example
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Try evaluating a CRM tool with a $50/month subscription, 10 hours of setup time, 
                  and projected efficiency savings of $200/month.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tool-name">Tool Name</Label>
                  <Input 
                    id="tool-name" 
                    placeholder="Enter tool name" 
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business-entity">Business Entity</Label>
                  <Select 
                    value={selectedEntity} 
                    onValueChange={setSelectedEntity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessEntities.map(entity => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly-price">Monthly Subscription ($)</Label>
                  <Input 
                    id="monthly-price" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setup-fee">Setup/Onboarding Fee ($)</Label>
                  <Input 
                    id="setup-fee" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={setupFee}
                    onChange={(e) => setSetupFee(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="implementation-time">Implementation Time (hours)</Label>
                  <Input 
                    id="implementation-time" 
                    type="number"
                    min="0"
                    placeholder="0" 
                    value={timeRequired}
                    onChange={(e) => setTimeRequired(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee-count">Employees Involved</Label>
                  <Input 
                    id="employee-count" 
                    type="number"
                    min="1"
                    placeholder="1" 
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recurring-time">Monthly Maintenance (hours)</Label>
                  <Input 
                    id="recurring-time" 
                    type="number"
                    min="0"
                    placeholder="0" 
                    value={recurringTimeMonthly}
                    onChange={(e) => setRecurringTimeMonthly(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee-rate">Average Hourly Rate ($)</Label>
                  <Input 
                    id="employee-rate" 
                    type="number"
                    min="0"
                    placeholder="20.00" 
                    value={employeeRate}
                    onChange={(e) => setEmployeeRate(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="efficiency-gain">Monthly Efficiency Savings ($)</Label>
                  <Input 
                    id="efficiency-gain" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={efficiencyGain}
                    onChange={(e) => setEfficiencyGain(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="revenue-impact">Monthly Revenue Impact ($)</Label>
                  <Input 
                    id="revenue-impact" 
                    type="number"
                    placeholder="0.00" 
                    value={revenueImpact}
                    onChange={(e) => setRevenueImpact(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Business Impact Level</Label>
                  <Slider
                    value={businessImpact}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={setBusinessImpact}
                    className="pt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Compare with Existing Tool</Label>
                  <Select 
                    value={comparisonTool} 
                    onValueChange={setComparisonTool}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select for comparison" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {existingTools.map(tool => (
                        <SelectItem key={tool.id} value={tool.id.toString()}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                    id="recurring-cost"
                  />
                  <Label htmlFor="recurring-cost">Recurring Monthly Cost</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="switch-tool">
          <Card>
            <CardHeader>
              <CardTitle>Switch Tools</CardTitle>
              <CardDescription>
                Analyze the costs and benefits of switching from one tool to another
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Quick Example
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Try evaluating switching from a $90/month CRM tool to a new $50/month option, with 8 hours of 
                  migration time and 3 hours of training. Calculate the long-term savings.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="old-tool">Current Tool</Label>
                  <Select 
                    value={oldToolId} 
                    onValueChange={setOldToolId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select current tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingTools.map(tool => (
                        <SelectItem key={tool.id} value={tool.id.toString()}>
                          {tool.name} (${tool.monthlyPrice}/mo)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tool-name">New Tool Name</Label>
                  <Input 
                    id="tool-name" 
                    placeholder="Enter new tool name" 
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business-entity">Business Entity</Label>
                  <Select 
                    value={selectedEntity} 
                    onValueChange={setSelectedEntity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessEntities.map(entity => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly-price">New Tool Monthly Cost ($)</Label>
                  <Input 
                    id="monthly-price" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setup-fee">Migration & Setup Fee ($)</Label>
                  <Input 
                    id="setup-fee" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={setupFee}
                    onChange={(e) => setSetupFee(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="implementation-time">Migration Time (hours)</Label>
                  <Input 
                    id="implementation-time" 
                    type="number"
                    min="0"
                    placeholder="0" 
                    value={timeRequired}
                    onChange={(e) => setTimeRequired(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee-count">Employees Impacted</Label>
                  <Input 
                    id="employee-count" 
                    type="number"
                    min="1"
                    placeholder="1" 
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recurring-time">Training Required (hours/employee)</Label>
                  <Input 
                    id="recurring-time" 
                    type="number"
                    min="0"
                    placeholder="0" 
                    value={recurringTimeMonthly}
                    onChange={(e) => setRecurringTimeMonthly(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee-rate">Average Hourly Rate ($)</Label>
                  <Input 
                    id="employee-rate" 
                    type="number"
                    min="0"
                    placeholder="20.00" 
                    value={employeeRate}
                    onChange={(e) => setEmployeeRate(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="efficiency-gain">Monthly Efficiency Savings ($)</Label>
                  <Input 
                    id="efficiency-gain" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={efficiencyGain}
                    onChange={(e) => setEfficiencyGain(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="switch-justification">Justification</Label>
                  <Input 
                    id="switch-justification" 
                    placeholder="Why switch to this tool?" 
                    value={switchJustification}
                    onChange={(e) => setSwitchJustification(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Business Impact Level</Label>
                  <Slider
                    value={businessImpact}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={setBusinessImpact}
                    className="pt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new-idea">
          <Card>
            <CardHeader>
              <CardTitle>New Business Idea</CardTitle>
              <CardDescription>
                Analyze the costs and potential returns of implementing a new business idea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Quick Example
                </h3>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Try evaluating a new marketing campaign with $1,000 initial investment, 
                  20 hours of team time, and expected monthly revenue of $500.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idea-name">Idea Name</Label>
                  <Input 
                    id="idea-name" 
                    placeholder="Enter idea name" 
                    value={ideaName}
                    onChange={(e) => setIdeaName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business-entity">Business Entity</Label>
                  <Select 
                    value={selectedEntity} 
                    onValueChange={setSelectedEntity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessEntities.map(entity => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setup-costs">Initial Investment ($)</Label>
                  <Input 
                    id="setup-costs" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={setupFee}
                    onChange={(e) => setSetupFee(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly-costs">Monthly Operating Costs ($)</Label>
                  <Input 
                    id="monthly-costs" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="implementation-months">Implementation Period (months)</Label>
                  <Input 
                    id="implementation-months" 
                    type="number"
                    min="1"
                    placeholder="1" 
                    value={implementationMonths}
                    onChange={(e) => setImplementationMonths(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="implementation-time">Development Time (hours)</Label>
                  <Input 
                    id="implementation-time" 
                    type="number"
                    min="0"
                    placeholder="0" 
                    value={timeRequired}
                    onChange={(e) => setTimeRequired(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee-count">Team Size</Label>
                  <Input 
                    id="employee-count" 
                    type="number"
                    min="1"
                    placeholder="1" 
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee-rate">Average Hourly Rate ($)</Label>
                  <Input 
                    id="employee-rate" 
                    type="number"
                    min="0"
                    placeholder="20.00" 
                    value={employeeRate}
                    onChange={(e) => setEmployeeRate(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recurring-time">Ongoing Time Commitment (hours/month)</Label>
                  <Input 
                    id="recurring-time" 
                    type="number"
                    min="0"
                    placeholder="0" 
                    value={recurringTimeMonthly}
                    onChange={(e) => setRecurringTimeMonthly(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="revenue-impact">Expected Monthly Revenue ($)</Label>
                  <Input 
                    id="revenue-impact" 
                    type="number"
                    placeholder="0.00" 
                    value={revenueImpact}
                    onChange={(e) => setRevenueImpact(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="efficiency-gain">Monthly Cost Savings ($)</Label>
                  <Input 
                    id="efficiency-gain" 
                    type="number"
                    min="0"
                    placeholder="0.00" 
                    value={efficiencyGain}
                    onChange={(e) => setEfficiencyGain(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Business Impact Level</Label>
                  <Slider
                    value={businessImpact}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={setBusinessImpact}
                    className="pt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Financial projections */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Projections</CardTitle>
          <CardDescription>
            Cost-benefit analysis and return on investment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Implementation Cost</h3>
              <p className="text-2xl font-bold">${implementationCost.toFixed(2)}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Recurring</h3>
              <p className="text-2xl font-bold">${monthlyRecurringCost.toFixed(2)}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Projection Period</h3>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number"
                  min="1"
                  max="60"
                  value={projectionMonths}
                  onChange={(e) => setProjectionMonths(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm">months</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Cost (Projection Period)</h3>
              <p className="text-2xl font-bold">${roi.totalCost.toFixed(2)}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Benefits</h3>
              <p className="text-2xl font-bold">${(roi.totalEfficiencySavings + roi.totalRevenueGain).toFixed(2)}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${roi.netImpact >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Net Impact</h3>
              <p className={`text-2xl font-bold ${roi.netImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${roi.netImpact.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">ROI Calculation</h3>
            <div className="flex items-center space-x-4">
              <div className={`text-3xl font-bold ${roi.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {roi.roi.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500">
                {roi.roi >= 0 ? "Return on Investment" : "Loss on Investment"} over {projectionMonths} months
              </div>
              <div className="flex-grow"></div>
              <Button 
                variant="outline" 
                className="ml-auto"
                onClick={handleSaveScenario}
              >
                <SaveAll className="mr-2 h-4 w-4" /> Save Scenario
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* ROI Over Time Chart */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">ROI Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }} 
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, '']}
                    labelFormatter={(label) => `Month ${label}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeCost" 
                    name="Cumulative Cost"
                    stackId="1"
                    fill="#ef4444" 
                    stroke="#ef4444"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeBenefit" 
                    name="Cumulative Benefit"
                    stackId="2"
                    fill="#22c55e" 
                    stroke="#22c55e"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netValue" 
                    name="Net Value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Comparison Chart */}
          {comparisonData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cost Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Monthly Cost']} />
                    <Legend />
                    <Bar dataKey="value" name="Monthly Cost" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}