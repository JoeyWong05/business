import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganizationChartComponent from "@/components/OrganizationChart";
import { 
  Building, Share2, Network, Cpu, Users, DollarSign, LineChart, 
  BarChart, Settings, MessageSquare, Target, FileText, Info, Download 
} from "lucide-react";

// Mock data for business entities
const businessEntities = [
  { id: "entity-1", name: "Digital Merch Pros", color: "#0ea5e9" },
  { id: "entity-2", name: "Mystery Hype", color: "#8b5cf6" },
  { id: "entity-3", name: "Lone Star Custom Clothing", color: "#f59e0b" },
  { id: "entity-4", name: "Alcoeaze", color: "#10b981" },
  { id: "entity-5", name: "Hide Cafe Bars", color: "#ec4899" },
];

// Department categories
const departmentCategories = [
  { name: "Finance", icon: <DollarSign className="h-5 w-5 text-emerald-500" />, color: "text-emerald-500" },
  { name: "Marketing", icon: <BarChart className="h-5 w-5 text-purple-500" />, color: "text-purple-500" },
  { name: "Sales", icon: <LineChart className="h-5 w-5 text-amber-500" />, color: "text-amber-500" },
  { name: "Operations", icon: <Settings className="h-5 w-5 text-blue-500" />, color: "text-blue-500" },
  { name: "Customer Service", icon: <MessageSquare className="h-5 w-5 text-red-500" />, color: "text-red-500" },
  { name: "IT", icon: <Cpu className="h-5 w-5 text-indigo-500" />, color: "text-indigo-500" },
];

// Mock automation scores for departments
type AutomationScoreData = {
  [entity: string]: {
    [department: string]: number;
  };
};

const automationScores: AutomationScoreData = {
  "Digital Merch Pros": {
    "Finance": 78,
    "Marketing": 85,
    "Sales": 62,
    "Operations": 71,
    "Customer Service": 67,
    "IT": 93,
  },
  "Mystery Hype": {
    "Finance": 65,
    "Marketing": 92,
    "Sales": 78,
    "Operations": 58,
    "Customer Service": 61,
    "IT": 85,
  },
  "Lone Star Custom Clothing": {
    "Finance": 46,
    "Marketing": 74,
    "Sales": 75,
    "Operations": 83,
    "Customer Service": 52,
    "IT": 67,
  },
  "Alcoeaze": {
    "Finance": 81,
    "Marketing": 68,
    "Sales": 55,
    "Operations": 76,
    "Customer Service": 73,
    "IT": 89,
  },
  "Hide Cafe Bars": {
    "Finance": 59,
    "Marketing": 71,
    "Sales": 66,
    "Operations": 68,
    "Customer Service": 80,
    "IT": 55,
  },
};

export default function OrganizationChartPage() {
  const [selectedEntity, setSelectedEntity] = useState<string | undefined>(undefined);
  const [selectedView, setSelectedView] = useState<string>("integrated");

  // Get average automation score for each entity
  const getEntityAutomationScore = (entityName: string) => {
    const scores = automationScores[entityName];
    if (!scores) return 0;
    
    const total = Object.values(scores).reduce((sum: number, score: number) => sum + score, 0);
    return Math.round(total / Object.values(scores).length);
  };
  
  // Get automation score color class
  const getScoreColorClass = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 max-w-[1400px]">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Organization & Automation Chart</h1>
        <p className="text-muted-foreground">
          Interactive visualization of how your business entities, departments, and automation processes connect together
        </p>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs 
          defaultValue={selectedView} 
          onValueChange={setSelectedView}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integrated">Integrated View</TabsTrigger>
            <TabsTrigger value="by-entity">By Entity</TabsTrigger>
            <TabsTrigger value="by-department">By Department</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Select
            value={selectedEntity || "all"}
            onValueChange={(value) => setSelectedEntity(value === "all" ? undefined : value)}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {businessEntities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Key statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{businessEntities.length}</div>
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{Object.keys(departmentCategories).length * businessEntities.length}</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Automation Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">32</div>
              <Cpu className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">
                {Math.round(
                  businessEntities.reduce((sum, entity) => {
                    return sum + getEntityAutomationScore(entity.name);
                  }, 0) / businessEntities.length
                )}%
              </div>
              <Network className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Automation Overview */}
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Entity Automation Overview</CardTitle>
          <CardDescription>
            Automation scores and departmental breakdown for each business entity
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
            {businessEntities.map((entity) => {
              const entityScores = automationScores[entity.name];
              const avgScore = getEntityAutomationScore(entity.name);
              
              return (
                <Card key={entity.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: entity.color }} />
                        <CardTitle className="text-lg">{entity.name}</CardTitle>
                      </div>
                      <Badge
                        className={`${getScoreColorClass(avgScore)} text-white`}
                      >
                        {avgScore}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      {Object.entries(entityScores || {}).map(([dept, score]) => {
                        const deptInfo = departmentCategories.find(d => d.name === dept);
                        return (
                          <div key={dept} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {deptInfo?.icon}
                              <span className="text-sm truncate">{dept}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getScoreColorClass(score)}`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8 text-right">{score}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="gap-1 w-full" onClick={() => setSelectedEntity(entity.id)}>
                      <Share2 className="h-4 w-4" />
                      View Connections
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Organization Chart */}
      <Card className="overflow-hidden border h-[700px]">
        <CardHeader className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              {selectedView === "integrated" 
                ? "Integrated Organization Visualization" 
                : selectedView === "by-entity" 
                  ? "Entity-Based View" 
                  : "Department-Based View"}
              {selectedEntity && " - " + businessEntities.find(e => e.id === selectedEntity)?.name}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              Interactive
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-57px)]">
          <OrganizationChartComponent
            viewMode={
              selectedView === "integrated" 
                ? "default" 
                : selectedView === "by-entity" 
                  ? "entity" 
                  : "department"
            }
            selectedEntity={selectedEntity}
          />
        </CardContent>
      </Card>

      {/* Help section */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">How to Use This Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="font-medium flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span>Entities</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Rectangle nodes represent business entities. These are the top-level organizational units.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Departments</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Rounded rectangles represent departments within entities, like Finance or Marketing.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Process Connections</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Hexagons show cross-entity processes. Lines indicate relationships between components.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}