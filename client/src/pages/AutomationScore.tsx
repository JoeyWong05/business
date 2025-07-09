import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  Award,
  BarChart2,
  Check,
  ChevronRight,
  ChevronsUp,
  CircleSlash2,
  Cpu,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Gauge,
  GitBranch,
  GitMerge,
  HelpCircle,
  Info,
  Layers,
  LayoutDashboard,
  Zap,
  ListChecks,
  Megaphone,
  Palette,
  PanelRight,
  PencilRuler,
  Plus,
  RefreshCw,
  Repeat,
  Search,
  Settings,
  Share2,
  Shuffle,
  Sparkles,
  Star,
  Timer,
  Wrench,
  Workflow,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ModuleAutomationScore, 
  AutomationRecommendation, 
  ToolIntegration, 
  AutomationTool,
  AutomationScoreDetails
} from "@/types/automation-score-types";

// Mock data for demo mode
const demoModuleScores: ModuleAutomationScore[] = [
  {
    moduleId: "finance",
    moduleName: "Finance",
    score: 68,
    color: "bg-blue-500",
    automatedProcessCount: 7,
    manualProcessCount: 3,
    totalProcesses: 10,
    recommendations: [
      {
        id: "fin-rec-1",
        moduleId: "finance",
        title: "Connect invoice approvals to Slack",
        description: "Automate invoice approval notifications and approvals through Slack to reduce manual checks.",
        difficulty: "easy",
        impactScore: 7,
        timeToImplement: "1-2 hours",
        toolsRequired: ["Slack", "Accounting Software"],
        implemented: false,
        inProgress: false
      },
      {
        id: "fin-rec-2",
        moduleId: "finance",
        title: "Setup weekly financial report automation",
        description: "Create an automated weekly report that pulls data from your financial software and generates a standardized report.",
        difficulty: "medium",
        impactScore: 8,
        timeToImplement: "3-4 hours",
        implemented: false,
        inProgress: false
      }
    ]
  },
  {
    moduleId: "operations",
    moduleName: "Operations",
    score: 82,
    color: "bg-green-500",
    automatedProcessCount: 14,
    manualProcessCount: 3,
    totalProcesses: 17,
    recommendations: [
      {
        id: "ops-rec-1",
        moduleId: "operations",
        title: "Build SOP check-in automation",
        description: "Create automated check-ins for SOP compliance through MS Teams or Slack.",
        difficulty: "medium",
        impactScore: 9,
        timeToImplement: "2-3 hours",
        toolsRequired: ["Slack", "MS Teams", "Zapier"],
        implemented: false,
        inProgress: false
      }
    ]
  },
  {
    moduleId: "marketing",
    moduleName: "Marketing",
    score: 56,
    color: "bg-amber-500",
    automatedProcessCount: 6,
    manualProcessCount: 5,
    totalProcesses: 11,
    recommendations: [
      {
        id: "mkt-rec-1",
        moduleId: "marketing",
        title: "Connect Klaviyo to track email opens",
        description: "Integrate Klaviyo with your CRM to automatically track and record email campaign performance.",
        difficulty: "easy",
        impactScore: 8,
        timeToImplement: "1-2 hours",
        toolsRequired: ["Klaviyo", "CRM"],
        implemented: false,
        inProgress: false
      },
      {
        id: "mkt-rec-2",
        moduleId: "marketing",
        title: "Schedule social posts with Buffer",
        description: "Set up Buffer to automate social media posting schedules across platforms.",
        difficulty: "easy",
        impactScore: 7,
        timeToImplement: "1 hour",
        toolsRequired: ["Buffer"],
        implemented: false,
        inProgress: false
      }
    ]
  },
  {
    moduleId: "sales",
    moduleName: "Sales",
    score: 73,
    color: "bg-purple-500",
    automatedProcessCount: 8,
    manualProcessCount: 3,
    totalProcesses: 11,
    recommendations: [
      {
        id: "sales-rec-1",
        moduleId: "sales",
        title: "Automate follow-up emails",
        description: "Create email sequence automation for prospect follow-ups based on engagement triggers.",
        difficulty: "medium",
        impactScore: 9,
        timeToImplement: "2-4 hours",
        toolsRequired: ["CRM", "Email Marketing Tool"],
        implemented: false,
        inProgress: false
      }
    ]
  },
  {
    moduleId: "customer",
    moduleName: "Customer",
    score: 62,
    color: "bg-cyan-500",
    automatedProcessCount: 5,
    manualProcessCount: 3,
    totalProcesses: 8,
    recommendations: [
      {
        id: "cust-rec-1",
        moduleId: "customer",
        title: "Implement chatbot for common queries",
        description: "Set up a basic chatbot to handle common customer questions and support requests.",
        difficulty: "medium",
        impactScore: 8,
        timeToImplement: "4-6 hours",
        toolsRequired: ["Chatbot Software", "Knowledge Base"],
        costEstimate: "$15-50/month",
        implemented: false,
        inProgress: false
      }
    ]
  }
];

const demoToolIntegrations: ToolIntegration[] = [
  {
    sourceToolId: "slack",
    sourceToolName: "Slack",
    targetToolId: "asana",
    targetToolName: "Asana",
    integrationStatus: "active",
    dataFlow: "bi-directional"
  },
  {
    sourceToolId: "excel",
    sourceToolName: "Excel",
    targetToolId: "powerbi",
    targetToolName: "Power BI",
    integrationStatus: "active",
    dataFlow: "one-way"
  },
  {
    sourceToolId: "crm",
    sourceToolName: "CRM",
    targetToolId: "emailmarketing",
    targetToolName: "Email Marketing",
    integrationStatus: "active",
    dataFlow: "bi-directional"
  },
  {
    sourceToolId: "shopify",
    sourceToolName: "Shopify",
    targetToolId: "accounting",
    targetToolName: "Accounting Software",
    integrationStatus: "active",
    dataFlow: "one-way"
  },
  {
    sourceToolId: "slack",
    sourceToolName: "Slack",
    targetToolId: "googlecalendar",
    targetToolName: "Google Calendar",
    integrationStatus: "active",
    dataFlow: "bi-directional"
  },
  {
    sourceToolId: "crm",
    sourceToolName: "CRM",
    targetToolId: "slack",
    targetToolName: "Slack",
    integrationStatus: "partial",
    dataFlow: "one-way"
  },
  {
    sourceToolId: "googleanalytics",
    sourceToolName: "Google Analytics",
    targetToolId: "googlesheets",
    targetToolName: "Google Sheets",
    integrationStatus: "active",
    dataFlow: "one-way"
  }
];

const demoAutomationTools: AutomationTool[] = [
  {
    id: "slack",
    name: "Slack",
    moduleId: "operations",
    moduleName: "Operations",
    category: "Communication",
    automationTier: "intermediate",
    integratedWith: ["asana", "googlecalendar", "crm"],
    processesAutomated: ["Team notifications", "Approval workflows"],
    implementationStatus: "implemented"
  },
  {
    id: "zapier",
    name: "Zapier",
    moduleId: "operations",
    moduleName: "Operations",
    category: "Integration",
    automationTier: "advanced",
    integratedWith: ["slack", "googlesheets", "asana", "trello"],
    processesAutomated: ["Cross-platform workflows", "Data synchronization"],
    implementationStatus: "implemented"
  },
  {
    id: "asana",
    name: "Asana",
    moduleId: "operations",
    moduleName: "Operations",
    category: "Project Management",
    automationTier: "intermediate",
    integratedWith: ["slack", "googlecalendar"],
    processesAutomated: ["Task assignments", "Project tracking"],
    implementationStatus: "implemented"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    moduleId: "marketing",
    moduleName: "Marketing",
    category: "Email Marketing",
    automationTier: "intermediate",
    integratedWith: ["crm", "shopify"],
    processesAutomated: ["Email campaigns", "Customer segmentation"],
    implementationStatus: "implemented"
  },
  {
    id: "buffer",
    name: "Buffer",
    moduleId: "marketing",
    moduleName: "Marketing",
    category: "Social Media",
    automationTier: "basic",
    integratedWith: [],
    processesAutomated: ["Social media scheduling"],
    implementationStatus: "in-progress"
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    moduleId: "finance",
    moduleName: "Finance",
    category: "Accounting",
    automationTier: "intermediate",
    integratedWith: ["shopify", "excel"],
    processesAutomated: ["Invoice generation", "Expense tracking"],
    implementationStatus: "implemented"
  },
  {
    id: "hubspot",
    name: "HubSpot",
    moduleId: "sales",
    moduleName: "Sales",
    category: "CRM",
    automationTier: "advanced",
    integratedWith: ["slack", "mailchimp", "googlecalendar"],
    processesAutomated: ["Lead tracking", "Sales pipeline", "Email sequences"],
    implementationStatus: "implemented"
  },
  {
    id: "zendesk",
    name: "Zendesk",
    moduleId: "customer",
    moduleName: "Customer",
    category: "Customer Support",
    automationTier: "intermediate",
    integratedWith: ["slack", "hubspot"],
    processesAutomated: ["Ticket management", "Customer communication"],
    implementationStatus: "implemented"
  }
];

const demoAutomationScore: AutomationScoreDetails = {
  overallScore: 68,
  moduleScores: demoModuleScores,
  toolsCoverageScore: 75,
  toolsIntegrationScore: 62,
  automationSophisticationScore: 58,
  processDocumentationScore: 70,
  integrationMap: demoToolIntegrations,
  automationTools: demoAutomationTools,
  recommendations: demoModuleScores.flatMap(module => module.recommendations)
};

// Main Component
const AutomationScore = () => {
  const { demoMode } = useDemoMode();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [implementRecommendationId, setImplementRecommendationId] = useState<string | null>(null);
  const [improveScoreDialogOpen, setImproveScoreDialogOpen] = useState<boolean>(false);
  const [scoreDescriptionOpen, setScoreDescriptionOpen] = useState<boolean>(false);
  
  // Fetch business entities
  const { data: businessEntities } = useQuery({
    queryKey: ["/api/business-entities"],
    enabled: !demoMode,
  });
  
  // Fetch automation score data
  const { data: automationData, isLoading } = useQuery<AutomationScoreDetails>({
    queryKey: ["/api/automation-score", selectedEntity !== "all" ? selectedEntity : undefined],
    enabled: !demoMode,
  });
  
  // Use demo data in demo mode, otherwise use fetched data
  const scoreData = demoMode ? demoAutomationScore : automationData;
  
  // Get the selected recommendation for implementation dialog
  const selectedRecommendation = scoreData?.recommendations.find(rec => rec.id === implementRecommendationId);
  
  // Filter modules based on selection
  const filteredModules = selectedModule === "all" 
    ? scoreData?.moduleScores 
    : scoreData?.moduleScores.filter(module => module.moduleId === selectedModule);
  
  // Filter tools based on module selection
  const filteredTools = selectedModule === "all"
    ? scoreData?.automationTools
    : scoreData?.automationTools.filter(tool => tool.moduleId === selectedModule);
  
  // Color mapping for automation tiers
  const tierColorMap = {
    basic: "bg-gray-500",
    intermediate: "bg-blue-500",
    advanced: "bg-purple-500"
  };
  
  // Handle starting implementation of a recommendation
  const handleImplementRecommendation = () => {
    if (selectedRecommendation) {
      toast({
        title: "Implementation Started",
        description: `Started implementation of: ${selectedRecommendation.title}`,
      });
      setImplementRecommendationId(null);
    }
  };
  
  // Manual loading state to show skeletons
  if (isLoading && !demoMode) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Helmet>
        <title>Automation Score 2.0 | DMPHQ</title>
      </Helmet>
      
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Page heading */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automation Score 2.0</h1>
            <p className="text-muted-foreground mt-1">
              Measure, analyze and improve your business automation
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[180px]">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select business entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Enterprise-wide</SelectItem>
                {demoMode ? [
                  <SelectItem key="1" value="1">Digital Merch Pros</SelectItem>,
                  <SelectItem key="2" value="2">Mystery Hype</SelectItem>,
                  <SelectItem key="3" value="3">Lone Star Custom Clothing</SelectItem>,
                  <SelectItem key="4" value="4">Alcoeaze</SelectItem>,
                  <SelectItem key="5" value="5">Hide Cafe Bars</SelectItem>
                ] : (
                  businessEntities?.entities?.map(entity => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {scoreData?.moduleScores.map(module => (
                  <SelectItem key={module.moduleId} value={module.moduleId}>
                    {module.moduleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => toast({
              title: "Score Recalculated",
              description: "Your automation score has been updated with the latest data."
            })}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Recalculate
            </Button>
            
            <Button onClick={() => setImproveScoreDialogOpen(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Improve Score
            </Button>
          </div>
        </div>
        
        {/* Overall Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Overall Score</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64">
                        Your automation score is calculated based on tools coverage, integration level, automation sophistication, and process documentation.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardDescription>
                Business Automation Maturity
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative h-40 w-40 mx-auto mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-bold">
                    {scoreData?.overallScore}%
                  </div>
                </div>
                <svg 
                  viewBox="0 0 100 100" 
                  className="h-full w-full transform -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeOpacity="0.1"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (scoreData?.overallScore || 0)) / 100}
                    className="text-primary"
                  />
                </svg>
              </div>
              
              <div className="space-y-2 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tools Coverage</span>
                  <span className="text-sm font-medium">{scoreData?.toolsCoverageScore}%</span>
                </div>
                <Progress value={scoreData?.toolsCoverageScore} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tools Integration</span>
                  <span className="text-sm font-medium">{scoreData?.toolsIntegrationScore}%</span>
                </div>
                <Progress value={scoreData?.toolsIntegrationScore} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Automation Sophistication</span>
                  <span className="text-sm font-medium">{scoreData?.automationSophisticationScore}%</span>
                </div>
                <Progress value={scoreData?.automationSophisticationScore} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Process Documentation</span>
                  <span className="text-sm font-medium">{scoreData?.processDocumentationScore}%</span>
                </div>
                <Progress value={scoreData?.processDocumentationScore} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/department-automation">
                  <span className="flex items-center">
                    View Score Breakdown
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Automation by Module</CardTitle>
              <CardDescription>
                Module-specific automation levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules?.map(module => (
                  <Card key={module.moduleId} className="overflow-hidden">
                    <div className={`h-2 ${module.color}`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{module.moduleName}</CardTitle>
                        <Badge variant={module.score >= 75 ? "default" : module.score >= 50 ? "secondary" : "outline"}>
                          {module.score}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-0">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Automation Progress</span>
                          <span className="text-sm">
                            {module.automatedProcessCount}/{module.totalProcesses} Processes
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${module.color}`} 
                            style={{ width: `${(module.automatedProcessCount / module.totalProcesses) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${module.color} mr-1.5`}></div>
                          <span>Automated</span>
                        </div>
                        <span className="font-medium">{module.automatedProcessCount}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-300 mr-1.5"></div>
                          <span>Manual</span>
                        </div>
                        <span className="font-medium">{module.manualProcessCount}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t mt-4 pt-3 pb-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => {
                          setSelectedModule(module.moduleId);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          View Module Details
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Next Automation Steps</CardTitle>
                    <Badge variant="outline" className="font-normal">AI Suggested</Badge>
                  </div>
                  <CardDescription>
                    Recommended automations to implement next
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scoreData?.recommendations.slice(0, 3).map((rec, idx) => (
                      <div key={rec.id} className="flex items-start gap-4 p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-center bg-primary/10 p-2 rounded-full text-primary">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-base font-medium">{rec.title}</h4>
                            <Badge variant="outline" className="ml-2">
                              {rec.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 mb-2">{rec.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
                              Impact: {rec.impactScore}/10
                            </div>
                            <div className="flex items-center">
                              <Timer className="h-3.5 w-3.5 mr-1 text-blue-500" />
                              Time: {rec.timeToImplement}
                            </div>
                            {rec.toolsRequired && (
                              <div className="flex items-center">
                                <Wrench className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                Tools: {rec.toolsRequired.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Zap className="h-3.5 w-3.5 mr-1.5" />
                                Implement
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Implement Automation</DialogTitle>
                                <DialogDescription>
                                  Start implementing this automation recommendation.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="mb-4 p-3 border rounded-lg bg-muted/30">
                                  <h3 className="font-medium">{rec.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                                </div>
                                
                                <div className="space-y-3 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Difficulty:</span>
                                    <span className="font-medium">{rec.difficulty}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Estimated time:</span>
                                    <span className="font-medium">{rec.timeToImplement}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Impact score:</span>
                                    <span className="font-medium">{rec.impactScore}/10</span>
                                  </div>
                                  {rec.toolsRequired && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Required tools:</span>
                                      <span className="font-medium">{rec.toolsRequired.join(', ')}</span>
                                    </div>
                                  )}
                                  {rec.costEstimate && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Estimated cost:</span>
                                      <span className="font-medium">{rec.costEstimate}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {}}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => {
                                    toast({
                                      title: "Implementation Started",
                                      description: `Started implementation of: ${rec.title}`,
                                    });
                                  }}
                                >
                                  Start Implementation
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/automation-score?tab=recommendations">
                      <span className="flex items-center">
                        View All Recommendations
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh recommendations</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Automation Levels</CardTitle>
                  <CardDescription>
                    Breakdown by sophistication level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400 mr-1.5"></div>
                          <span className="text-sm">Basic</span>
                        </div>
                        <span className="text-sm font-medium">
                          {scoreData?.automationTools.filter(t => t.automationTier === 'basic').length} tools
                        </span>
                      </div>
                      <Progress 
                        value={
                          (scoreData?.automationTools.filter(t => t.automationTier === 'basic').length || 0) / 
                          (scoreData?.automationTools.length || 1) * 100
                        } 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                          <span className="text-sm">Intermediate</span>
                        </div>
                        <span className="text-sm font-medium">
                          {scoreData?.automationTools.filter(t => t.automationTier === 'intermediate').length} tools
                        </span>
                      </div>
                      <Progress 
                        value={
                          (scoreData?.automationTools.filter(t => t.automationTier === 'intermediate').length || 0) / 
                          (scoreData?.automationTools.length || 1) * 100
                        } 
                        className="h-2 bg-muted"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-1.5"></div>
                          <span className="text-sm">Advanced</span>
                        </div>
                        <span className="text-sm font-medium">
                          {scoreData?.automationTools.filter(t => t.automationTier === 'advanced').length} tools
                        </span>
                      </div>
                      <Progress 
                        value={
                          (scoreData?.automationTools.filter(t => t.automationTier === 'advanced').length || 0) / 
                          (scoreData?.automationTools.length || 1) * 100
                        } 
                        className="h-2 bg-muted"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Integrated vs Standalone</h4>
                    
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">
                          {
                            scoreData?.automationTools.filter(t => t.integratedWith.length > 0).length
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">Integrated Tools</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">
                          {
                            scoreData?.automationTools.filter(t => t.integratedWith.length === 0).length
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">Standalone Tools</div>
                      </div>
                    </div>
                    
                    <div className="h-8 rounded-md overflow-hidden bg-muted">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${
                            (scoreData?.automationTools.filter(t => t.integratedWith.length > 0).length || 0) /
                            (scoreData?.automationTools.length || 1) * 100
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/tools-integration">
                      <span className="flex items-center justify-center">
                        Manage Tools & Integrations
                        <ExternalLink className="ml-2 h-4 w-4" />  
                      </span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Integration Pathways</CardTitle>
                <CardDescription>
                  Active connections between your tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {scoreData?.integrationMap.slice(0, 8).map((integration, idx) => (
                    <div 
                      key={`${integration.sourceToolId}-${integration.targetToolId}`} 
                      className="border rounded-lg p-3 flex flex-col"
                    >
                      <div className="flex justify-center items-center h-24">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <LayoutDashboard className="h-6 w-6" />
                          </div>
                          <div className="mx-2">
                            {integration.dataFlow === 'bi-directional' ? (
                              <GitMerge className="h-5 w-5 text-green-500" />
                            ) : (
                              <ArrowRight className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Layers className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <h4 className="font-medium text-sm">{integration.sourceToolName} → {integration.targetToolName}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {integration.dataFlow === 'bi-directional' ? 'Bi-directional' : 'One-way'} integration
                        </p>
                        <Badge 
                          variant={integration.integrationStatus === 'active' ? 'default' : 'secondary'} 
                          className="mt-2"
                        >
                          {integration.integrationStatus === 'active' ? 'Active' : 'Partial'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6 mt-6">
            <div className="space-y-4">
              {filteredModules?.map(module => (
                <div key={module.moduleId}>
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full ${module.color} mr-2`}></div>
                    <h3 className="text-xl font-semibold">{module.moduleName} Recommendations</h3>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {module.recommendations.length > 0 ? (
                      module.recommendations.map(rec => (
                        <Card key={rec.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                              <Badge variant="outline" className="ml-2">
                                {rec.difficulty}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-muted-foreground mb-4">{rec.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="border rounded-md p-3">
                                <div className="flex items-center text-sm text-muted-foreground mb-1">
                                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                                  Impact Score
                                </div>
                                <div className="text-2xl font-semibold">{rec.impactScore}/10</div>
                              </div>
                              
                              <div className="border rounded-md p-3">
                                <div className="flex items-center text-sm text-muted-foreground mb-1">
                                  <Timer className="h-4 w-4 mr-2 text-blue-500" />
                                  Implementation Time
                                </div>
                                <div className="text-2xl font-semibold">{rec.timeToImplement}</div>
                              </div>
                              
                              <div className="border rounded-md p-3">
                                <div className="flex items-center text-sm text-muted-foreground mb-1">
                                  <Wrench className="h-4 w-4 mr-2 text-purple-500" />
                                  Required Tools
                                </div>
                                <div className="text-lg font-medium">
                                  {rec.toolsRequired ? rec.toolsRequired.join(', ') : 'None'}
                                </div>
                              </div>
                            </div>
                            
                            {rec.costEstimate && (
                              <div className="mt-2 flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">Estimated cost:</span>
                                <Badge variant="outline">{rec.costEstimate}</Badge>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex justify-end border-t pt-3">
                            <Button 
                              onClick={() => setImplementRecommendationId(rec.id)}
                              className="gap-2"
                            >
                              <Zap className="h-4 w-4" />
                              Implement Now
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 border rounded-lg bg-muted/10">
                        <Sparkles className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                        <h3 className="text-lg font-medium mb-1">No recommendations</h3>
                        <p className="text-sm text-muted-foreground">
                          No automation recommendations for this module yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Integration Map</CardTitle>
                  <Badge variant="outline" className="font-normal">
                    {scoreData?.integrationMap.length} Active Connections
                  </Badge>
                </div>
                <CardDescription>
                  Connections between your tools and systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-1 gap-4">
                      {scoreData?.integrationMap.map((integration, idx) => (
                        <div key={idx} className="flex items-center border rounded-lg p-4">
                          <div className="flex-1 flex items-center">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300">
                              <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <span className="font-medium ml-3">{integration.sourceToolName}</span>
                          </div>
                          
                          <div className="flex-1 flex items-center justify-center">
                            {integration.dataFlow === 'bi-directional' ? (
                              <div className="flex items-center">
                                <div className="h-1 w-12 bg-green-400"></div>
                                <div className="mx-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-1.5 rounded-full">
                                  <GitMerge className="h-4 w-4" />
                                </div>
                                <div className="h-1 w-12 bg-green-400"></div>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <div className="h-1 w-16 bg-blue-400"></div>
                                <ArrowRight className="h-4 w-4 text-blue-500 mx-2" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 flex items-center">
                            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300">
                              <Layers className="h-5 w-5" />
                            </div>
                            <span className="font-medium ml-3">{integration.targetToolName}</span>
                          </div>
                          
                          <div className="ml-6 w-24">
                            <Badge variant={integration.integrationStatus === 'active' ? 'default' : 'secondary'}>
                              {integration.integrationStatus === 'active' ? 'Active' : 'Partial'}
                            </Badge>
                          </div>
                          
                          <div className="ml-4">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {scoreData?.integrationMap.length === 0 && (
                  <div className="text-center py-12">
                    <GitBranch className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                    <h3 className="text-lg font-medium mb-1">No integrations found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You haven't set up any tool integrations yet.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Integration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Integration Opportunities</CardTitle>
                  <Badge variant="outline" className="font-normal">AI Suggested</Badge>
                </div>
                <CardDescription>
                  Potential new connections to improve your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center bg-muted/20">
                    <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-300 mr-4">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Connect Mailchimp to Slack</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get campaign performance notifications in your marketing Slack channel
                      </p>
                    </div>
                    <div className="ml-4">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center bg-muted/20">
                    <div className="h-10 w-10 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center text-cyan-600 dark:text-cyan-300 mr-4">
                      <Shuffle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Connect Asana to Google Calendar</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sync task deadlines to your calendar automatically
                      </p>
                    </div>
                    <div className="ml-4">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-center bg-muted/20">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-green-600 dark:text-green-300 mr-4">
                      <Repeat className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Upgrade Slack-CRM Integration</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enhance your current integration to support bi-directional updates
                      </p>
                    </div>
                    <div className="ml-4">
                      <Button size="sm">
                        <ChevronsUp className="h-4 w-4 mr-2" />
                        Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools?.map(tool => (
                <Card key={tool.id} className="overflow-hidden">
                  <div className={`h-2 ${tierColorMap[tool.automationTier]}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <Badge variant="outline">
                        {tool.implementationStatus === 'implemented' ? 'Active' : 'In Progress'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {tool.moduleName} • {tool.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Processes Automated</h4>
                      <div className="space-y-1.5">
                        {tool.processesAutomated.map((process, idx) => (
                          <div key={idx} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-sm">{process}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Integrations</h4>
                        <Badge variant="outline" className="text-xs">
                          {tool.integratedWith.length} connected
                        </Badge>
                      </div>
                      
                      {tool.integratedWith.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {tool.integratedWith.map(toolId => {
                            const connectedTool = scoreData?.automationTools.find(t => t.id === toolId);
                            return (
                              <Badge key={toolId} variant="secondary" className="text-xs font-normal">
                                {connectedTool?.name || toolId}
                              </Badge>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          <CircleSlash2 className="h-4 w-4 inline mr-1.5" />
                          No integrations yet
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge 
                          variant={
                            tool.automationTier === 'advanced' 
                              ? 'default' 
                              : tool.automationTier === 'intermediate' 
                                ? 'secondary' 
                                : 'outline'
                          }
                          className="text-xs"
                        >
                          {tool.automationTier.charAt(0).toUpperCase() + tool.automationTier.slice(1)}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/tools/${tool.id}`}>
                          <span className="flex items-center">
                            Manage Tool
                            <ChevronRight className="ml-1.5 h-4 w-4" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Tool
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Implementation Dialog */}
      <Dialog open={!!implementRecommendationId} onOpenChange={(open) => !open && setImplementRecommendationId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Implement Automation</DialogTitle>
            <DialogDescription>
              Start implementing this automation recommendation.
            </DialogDescription>
          </DialogHeader>
          {selectedRecommendation && (
            <div className="py-4">
              <div className="mb-4 p-3 border rounded-lg bg-muted/30">
                <h3 className="font-medium">{selectedRecommendation.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedRecommendation.description}</p>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-medium">{selectedRecommendation.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated time:</span>
                  <span className="font-medium">{selectedRecommendation.timeToImplement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Impact score:</span>
                  <span className="font-medium">{selectedRecommendation.impactScore}/10</span>
                </div>
                {selectedRecommendation.toolsRequired && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Required tools:</span>
                    <span className="font-medium">{selectedRecommendation.toolsRequired.join(', ')}</span>
                  </div>
                )}
                {selectedRecommendation.costEstimate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated cost:</span>
                    <span className="font-medium">{selectedRecommendation.costEstimate}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setImplementRecommendationId(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleImplementRecommendation}>
              Start Implementation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Improve Score Dialog */}
      <Dialog open={improveScoreDialogOpen} onOpenChange={setImproveScoreDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[initial]">
          <DialogHeader>
            <DialogTitle>Automation Score Improvement Plan</DialogTitle>
            <DialogDescription>
              Start implementing these recommendations to improve your automation score.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">Current Score: {scoreData?.overallScore}%</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here are personalized recommendations to improve your automation score:
            </p>
            
            <div className="space-y-4">
              {scoreData?.recommendations && scoreData.recommendations.slice(0, 5).map((rec, idx) => (
                <div key={rec.id} className="flex flex-col sm:flex-row items-start gap-3 p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center bg-primary/10 h-8 w-8 rounded-full text-primary shrink-0">
                    <span className="font-semibold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-base font-medium">{rec.title}</h4>
                      <Badge variant="outline" className="w-fit">
                        {rec.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Estimated impact: +{Math.round(rec.impactScore / 2)}% to score
                      </div>
                      <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={() => {
                        setImplementRecommendationId(rec.id);
                        setImproveScoreDialogOpen(false);
                      }}>
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setImproveScoreDialogOpen(false)}>Close</Button>
            <Button className="w-full sm:w-auto" onClick={() => {
              setScoreDescriptionOpen(true);
              setImproveScoreDialogOpen(false);
            }}>
              <Info className="h-4 w-4 mr-2" />
              What does this score mean?
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Score Description Dialog */}
      <Dialog open={scoreDescriptionOpen} onOpenChange={setScoreDescriptionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[initial]">
          <DialogHeader>
            <DialogTitle>Understanding Your Automation Score</DialogTitle>
            <DialogDescription>
              What your score means and how it's calculated
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Your Score: {scoreData?.overallScore}%</h3>
              <Progress value={scoreData?.overallScore} className="h-3 mb-2" />
              
              {scoreData?.overallScore && (
                <p className="text-sm">
                  {scoreData.overallScore >= 80 ? (
                    <span className="font-medium text-green-600">Excellent!</span>
                  ) : scoreData.overallScore >= 60 ? (
                    <span className="font-medium text-blue-600">Good</span>
                  ) : scoreData.overallScore >= 40 ? (
                    <span className="font-medium text-amber-600">Fair</span>
                  ) : (
                    <span className="font-medium text-red-600">Needs Improvement</span>
                  )}
                  {' '}
                  {scoreData.overallScore >= 80 ? 
                    "Your business has highly mature automation systems in place. Focus on continuous improvement and innovation." :
                   scoreData.overallScore >= 60 ? 
                    "Your business has solid automation foundations. Work on integrating existing tools and expanding coverage." :
                   scoreData.overallScore >= 40 ? 
                    "Your business has started automation but has significant opportunities for improvement." :
                    "Your business is in the early stages of automation. Focus on implementing basic automation tools."
                  }
                </p>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-base font-medium flex flex-wrap items-center">
                  <div className="bg-green-100 text-green-700 p-1.5 rounded-full mr-2">
                    <Gauge className="h-4 w-4" />
                  </div>
                  <span>Tools Coverage</span> <span className="ml-2 text-sm">({scoreData?.toolsCoverageScore}%)</span>
                </h4>
                <p className="text-sm mt-1 ml-0 sm:ml-8">
                  Measures how many business functions have automated tools. Higher scores mean more areas of your business have appropriate tools implemented.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-base font-medium flex flex-wrap items-center">
                  <div className="bg-blue-100 text-blue-700 p-1.5 rounded-full mr-2">
                    <GitMerge className="h-4 w-4" />
                  </div>
                  <span>Tools Integration</span> <span className="ml-2 text-sm">({scoreData?.toolsIntegrationScore}%)</span>
                </h4>
                <p className="text-sm mt-1 ml-0 sm:ml-8">
                  Measures how well your tools work together. Higher scores indicate fewer manual steps between tools and more automated data flow.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-base font-medium flex flex-wrap items-center">
                  <div className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-2">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <span>Automation Sophistication</span> <span className="ml-2 text-sm">({scoreData?.automationSophisticationScore}%)</span>
                </h4>
                <p className="text-sm mt-1 ml-0 sm:ml-8">
                  Measures the level of sophistication in your automations. Higher scores indicate more advanced automations that require less human intervention.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-base font-medium flex flex-wrap items-center">
                  <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full mr-2">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span>Process Documentation</span> <span className="ml-2 text-sm">({scoreData?.processDocumentationScore}%)</span>
                </h4>
                <p className="text-sm mt-1 ml-0 sm:ml-8">
                  Measures how well business processes are documented in SOPs. Higher scores indicate better documented and standardized processes.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setScoreDescriptionOpen(false)}>Close</Button>
            <Button className="w-full sm:w-auto" onClick={() => {
              setImproveScoreDialogOpen(true);
              setScoreDescriptionOpen(false);
            }}>
              <Sparkles className="h-4 w-4 mr-2" />
              Improve Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AutomationScore;