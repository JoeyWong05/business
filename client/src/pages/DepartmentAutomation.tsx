import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/MainLayout";
import DepartmentAutomationCard from "@/components/DepartmentAutomationCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Info, Download, Filter } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function DepartmentAutomation() {
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [processView, setProcessView] = useState("all"); // "all", "ai", "team", "hybrid"

  // Fetch business entities
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
  });

  // Fetch department automation data
  const { data: deptData, isLoading: isLoadingDeptData } = useQuery({
    queryKey: ['/api/department-automation'],
  });

  const entities = entitiesData?.entities || [];
  
  // Get department automation data from API response
  const departmentAutomationData = deptData?.departments || [];

  // Loading state
  const isLoading = isLoadingEntities || isLoadingDeptData;
  
  // Filter departments by selected process type
  const filteredDepartments = departmentAutomationData.filter(dept => {
    if (processView === "all") return true;
    return dept.processes?.some(p => p.handledBy === processView);
  });

  // Data for overall charts
  const pieData = [
    { name: "AI Processes", value: departmentAutomationData.reduce((acc, dept) => acc + (dept.processes?.filter(p => p.handledBy === 'ai')?.length || 0), 0) },
    { name: "Team Processes", value: departmentAutomationData.reduce((acc, dept) => acc + (dept.processes?.filter(p => p.handledBy === 'team')?.length || 0), 0) },
    { name: "Hybrid Processes", value: departmentAutomationData.reduce((acc, dept) => acc + (dept.processes?.filter(p => p.handledBy === 'hybrid')?.length || 0), 0) }
  ];

  const barData = departmentAutomationData.map(dept => ({
    name: dept.name,
    score: dept.overallAutomationScore,
    timeSaved: dept.monthlyTimeSaved
  }));

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#9333ea', '#22c55e'];

  // Calculate overall automation score
  const overallScore = departmentAutomationData.reduce((sum, dept) => sum + dept.overallAutomationScore, 0) / departmentAutomationData.length;
  
  // Helper function to get random process names based on department
  function getRandomProcessName(deptSlug: string, index: number): string {
    const processesByDept: Record<string, string[]> = {
      'finance': [
        'Invoice Processing', 'Budget Allocation', 'Financial Reporting', 
        'Expense Approval', 'Tax Calculation', 'Investment Analysis'
      ],
      'operations': [
        'Inventory Management', 'Resource Scheduling', 'Quality Control',
        'Supply Chain Oversight', 'Logistics Planning', 'Production Monitoring'
      ],
      'marketing': [
        'Campaign Scheduling', 'Content Creation', 'Analytics Review',
        'Ad Placement', 'Social Media Management', 'SEO Optimization'
      ],
      'sales': [
        'Lead Qualification', 'Proposal Generation', 'CRM Updates',
        'Sales Forecasting', 'Client Outreach', 'Deal Negotiation'
      ],
      'customer': [
        'Support Ticket Processing', 'Feedback Collection', 'Satisfaction Surveys',
        'Return Processing', 'Onboarding', 'Loyalty Program Management'
      ]
    };
    
    // Get process list for this department, or use a generic list
    const processList = processesByDept[deptSlug] || [
      'Documentation', 'Data Entry', 'Review Process', 
      'Approval Workflow', 'Tracking', 'Reporting'
    ];
    
    // Pick a process name based on the index, or randomly if index exceeds list length
    return processList[index % processList.length];
  }

  return (
    <MainLayout 
      title="Department Automation" 
      description="See how each department is automated and which processes are handled by AI vs. team members"
    >
      <div className="mb-6">
        <Tabs defaultValue="overview">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="departments">By Department</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Select value={processView} onValueChange={setProcessView}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  <SelectItem value="ai">AI Processes</SelectItem>
                  <SelectItem value="team">Team Processes</SelectItem>
                  <SelectItem value="hybrid">Hybrid Processes</SelectItem>
                </SelectContent>
              </Select>
              
              {entities.length > 0 && (
                <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    {entities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Overall Automation Score</h3>
                <div className="flex items-center mb-6">
                  <div className="text-5xl font-bold text-primary mr-4">{Math.round(overallScore)}%</div>
                  <div className="flex-1">
                    <Progress value={overallScore} className="h-4 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {overallScore < 30 && "Significant automation potential remains"}
                      {overallScore >= 30 && overallScore < 60 && "Good progress with automation, room for improvement"}
                      {overallScore >= 60 && overallScore < 80 && "Strong automation foundation established"}
                      {overallScore >= 80 && "Excellent automation across departments"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">AI Processes</div>
                    <div className="text-2xl font-semibold">{pieData[0].value}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Team Processes</div>
                    <div className="text-2xl font-semibold">{pieData[1].value}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Hybrid Processes</div>
                    <div className="text-2xl font-semibold">{pieData[2].value}</div>
                  </div>
                </div>
                
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis yAxisId="left" orientation="left" label={{ value: 'Automation %', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Hours Saved', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="score" name="Automation Score" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="timeSaved" name="Hours Saved Monthly" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Process Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-sm bg-blue-500 mr-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">AI Processes</span>
                        <span className="text-sm">{Math.round((pieData[0].value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100)}%</span>
                      </div>
                      <Progress value={(pieData[0].value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100} className="h-1.5 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-sm bg-purple-500 mr-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Team Processes</span>
                        <span className="text-sm">{Math.round((pieData[1].value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100)}%</span>
                      </div>
                      <Progress value={(pieData[1].value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100} className="h-1.5 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-sm bg-green-500 mr-2"></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Hybrid Processes</span>
                        <span className="text-sm">{Math.round((pieData[2].value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100)}%</span>
                      </div>
                      <Progress value={(pieData[2].value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100} className="h-1.5 mt-1" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Automation Insights</span>
                  </div>
                  <p className="text-muted-foreground">
                    {pieData[0].value > pieData[1].value ? 
                      "Most processes are handled by AI, reducing manual workload." : 
                      "There's potential to automate more team-managed processes."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">Department Quick Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {departmentAutomationData.map(dept => (
                    <div key={dept.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className={`w-8 h-8 rounded-md bg-${dept.color.replace("text-", "")}/10 flex items-center justify-center mr-2`}>
                          <span className={`material-icons text-sm ${dept.color}`}>{dept.icon}</span>
                        </div>
                        <h4 className="font-medium">{dept.name}</h4>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Automation</span>
                          <span className={getAutomationColor(dept.overallAutomationScore)}>{dept.overallAutomationScore}%</span>
                        </div>
                        <Progress value={dept.overallAutomationScore} className="h-1.5" />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processes: {dept.processes?.length || 0}</span>
                        <span>{dept.teamSize} Team</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDepartments.map(dept => (
                <DepartmentAutomationCard
                  key={dept.id}
                  name={dept.name}
                  slug={dept.slug}
                  icon={dept.icon}
                  iconColor={dept.color}
                  overallAutomationScore={dept.overallAutomationScore}
                  processes={dept.processes}
                  teamSize={dept.teamSize}
                  monthlyTimeSaved={dept.monthlyTimeSaved}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-6">Automation Analytics</h3>
              <p className="text-muted-foreground mb-4">Detailed analytics about department automation will be displayed here.</p>
              
              <div className="flex justify-center items-center h-[400px]">
                <div className="text-center p-10 border border-dashed rounded-lg">
                  <span className="material-icons text-4xl text-muted-foreground mb-4">analytics</span>
                  <h4 className="text-lg font-medium mb-2">Analytics Coming Soon</h4>
                  <p className="text-sm text-muted-foreground">Detailed automation analytics will be available in a future update.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Helper function to get color for automation score
function getAutomationColor(score: number) {
  if (score < 30) return "text-red-500";
  if (score < 60) return "text-amber-500";
  if (score < 80) return "text-blue-500";
  return "text-green-500";
}