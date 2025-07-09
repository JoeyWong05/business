import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  LayoutDashboard, 
  Code, 
  Settings, 
  Users, 
  BarChart, 
  FileText,
  Sparkles,
  Zap,
  X
} from "lucide-react";
import { useOnboarding } from "./OnboardingContext";
import OnboardingHighlight from "./OnboardingHighlight";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserRole } from "@/contexts/UserRoleContext";
import { UserRole } from "@shared/schema";

const steps = [
  {
    id: "welcome",
    title: "Welcome to DMPHQ",
    description: "The Business Execution System that streamlines your operations and enhances productivity.",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
        </div>
        <p>
          Thank you for choosing DMPHQ! We're excited to help you optimize your business operations.
          This quick tour will guide you through key features and help you get started.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" /> 
            AI-Powered Assistant
          </h4>
          <p className="text-sm text-muted-foreground">
            Our platform uses AI to provide personalized guidance and recommendations.
            You'll discover intelligent features throughout this tour.
          </p>
        </div>
      </div>
    ),
    showHighlight: false,
    highlightSelector: null,
  },
  {
    id: "dashboard",
    title: "Dashboard Overview",
    description: "Your central command center for business intelligence",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p>
          The Dashboard provides a real-time snapshot of your business performance across all departments. 
          Key metrics, recent activities, and recommendations are displayed here.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">Key Metrics</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Track business tools, costs, SOPs, and automation score 
            </p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">Business Entities</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Switch between entities or view enterprise-wide data
            </p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">AI Recommendations</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Get intelligent suggestions to optimize workflows
            </p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">Recent Activities</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Stay updated on the latest changes and updates
            </p>
          </div>
        </div>
      </div>
    ),
    showHighlight: true,
    highlightSelector: ".dashboard-highlight",
  },
  {
    id: "navigation",
    title: "Smart Navigation",
    description: "Access all business functions from one place",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <Code className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <p>
          The sidebar navigation provides quick access to all platform modules. 
          It adapts to your usage patterns and highlights the features most relevant to your role.
        </p>
        <div className="space-y-2 mt-3">
          <div className="flex justify-between items-center bg-muted p-2.5 rounded-lg">
            <div className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
            <Badge variant="outline">Most used</Badge>
          </div>
          <div className="flex justify-between items-center bg-muted p-2.5 rounded-lg">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">Team</span>
            </div>
          </div>
          <div className="flex justify-between items-center bg-muted p-2.5 rounded-lg">
            <div className="flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">Reports</span>
            </div>
            <Badge variant="secondary">New</Badge>
          </div>
        </div>
      </div>
    ),
    showHighlight: true,
    highlightSelector: ".sidebar-highlight",
  },
  {
    id: "operations",
    title: "Operations Hub",
    description: "Streamline and automate business processes",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p>
          The Operations Hub is where you'll manage your business processes, SOPs, 
          and workflow automation. Create and optimize standard procedures to ensure consistency.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 mt-1">
          <h4 className="font-medium">Key Operations Features:</h4>
          <ul className="space-y-1.5 text-sm pl-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span>SOP Builder for documenting processes</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Automation scoring to identify opportunities</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Tool integration management</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              <span>VA Command Center for delegation</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    showHighlight: true,
    highlightSelector: ".operations-highlight",
  },
  {
    id: "agency-killer",
    title: "Agency Killer",
    description: "AI-powered marketing tools to eliminate agency dependencies",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <p>
          The Agency Killer module provides powerful AI-driven marketing tools that help you eliminate 
          dependencies on expensive agencies. Create professional content and campaigns in minutes.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">Copy Generator</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Create compelling copy for ads, emails, and more
            </p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">SEO Toolkit</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Optimize content for search engines
            </p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">Ad Campaign Builder</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Design and launch effective ad campaigns
            </p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm">Marketing Funnel</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Create end-to-end marketing funnels
            </p>
          </div>
        </div>
      </div>
    ),
    showHighlight: true,
    highlightSelector: ".agency-killer-highlight",
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    description: "Gain insights with custom reports and visualizations",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <BarChart className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <p>
          Get detailed analytics and reports across all business functions. Track performance, 
          identify trends, and make data-driven decisions with our advanced visualization tools.
        </p>
        <div className="bg-primary/10 p-4 rounded-lg space-y-2">
          <h4 className="font-medium">Analytics Available For:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
              <span>Financial</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
              <span>Marketing</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
              <span>Sales</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
              <span>Operations</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
              <span>Customer</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-primary" />
              <span>Teams</span>
            </div>
          </div>
        </div>
      </div>
    ),
    showHighlight: true,
    highlightSelector: ".analytics-highlight",
  },
  {
    id: "help-resources",
    title: "Help & Resources",
    description: "Get support when you need it",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p>
          Access help documentation, tutorials, and customer support whenever you need assistance.
          We're committed to ensuring your success with DMPHQ.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-3 mt-1">
          <div className="flex items-start">
            <div className="bg-background p-2 rounded mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Documentation</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comprehensive guides for all features
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-background p-2 rounded mr-3">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">AI Assistant</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get contextual help and suggestions
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-background p-2 rounded mr-3">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Support Team</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Contact our team for personalized help
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    showHighlight: false,
    highlightSelector: null,
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Next steps to optimize your business",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p>
          You're all set! Here are some recommended next steps to get the most out of DMPHQ:
        </p>
        <div className="space-y-3 mt-1">
          <div className="bg-muted p-3 rounded-lg flex items-start">
            <div className="bg-primary/20 p-1.5 rounded-full mr-3 mt-0.5">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <div>
              <h4 className="text-sm font-medium">Complete Your Profile</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add your business details and preferences
              </p>
            </div>
          </div>
          <div className="bg-muted p-3 rounded-lg flex items-start">
            <div className="bg-primary/20 p-1.5 rounded-full mr-3 mt-0.5">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <div>
              <h4 className="text-sm font-medium">Connect Your Tools</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Integrate your existing business tools
              </p>
            </div>
          </div>
          <div className="bg-muted p-3 rounded-lg flex items-start">
            <div className="bg-primary/20 p-1.5 rounded-full mr-3 mt-0.5">
              <span className="text-xs font-bold text-primary">3</span>
            </div>
            <div>
              <h4 className="text-sm font-medium">Create Your First SOP</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Document and optimize a business process
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    showHighlight: false,
    highlightSelector: null,
  },
];

export function OnboardingWizard() {
  const { isOpen, setIsOpen, isFirstVisit, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("tour");
  const { theme } = useTheme();
  const { userRole } = useUserRole();
  
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  useEffect(() => {
    // Skip feature highlight step and move to the next one if we don't have the feature
    // or if it's not relevant to current user role
    const shouldSkipStep = step.showHighlight && step.highlightSelector ? !document.querySelector(step.highlightSelector) : false;
    
    if (shouldSkipStep) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeOnboarding();
        setIsOpen(false);
      }
    }
  }, [currentStep, step, completeOnboarding, setIsOpen]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      setIsOpen(false);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    completeOnboarding();
    setIsOpen(false);
  };
  
  const handleCustomizeFlow = () => {
    setActiveTab("customize");
  };
  
  const resetTutorial = () => {
    setCurrentStep(0);
    setActiveTab("tour");
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {step.showHighlight && step.highlightSelector && (
        <OnboardingHighlight 
          selector={step.highlightSelector} 
          onClose={() => setIsOpen(false)}
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
          <div className="absolute right-4 top-4 z-10">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tour">Interactive Tour</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tour" className="p-0">
              <div className="bg-primary h-1.5">
                <Progress value={progress} className="h-full rounded-none" />
              </div>
              
              <DialogHeader className="pt-6 pb-2 px-6">
                <DialogTitle className="text-xl">{step.title}</DialogTitle>
                <DialogDescription>{step.description}</DialogDescription>
              </DialogHeader>
              
              <div className="px-6 py-4">
                {step.content}
              </div>
              
              <DialogFooter className="flex justify-between px-6 py-4 border-t">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={handleSkip} variant="ghost">Skip</Button>
                  ) : null}
                </div>
                
                <Button onClick={handleNext}>
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    "Complete"
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>
            
            <TabsContent value="customize" className="p-6 space-y-4">
              <h3 className="text-lg font-medium">Customize Your Experience</h3>
              <p className="text-muted-foreground">
                Tailor the onboarding process to your role and interests
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Your Role</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`px-3 py-1 cursor-pointer ${userRole && userRole === UserRole.ADMIN ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                      Owner/Executive
                    </Badge>
                    <Badge className={`px-3 py-1 cursor-pointer ${userRole && userRole === UserRole.MANAGER ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                      Manager
                    </Badge>
                    <Badge className={`px-3 py-1 cursor-pointer ${userRole && userRole === UserRole.VIEWER ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
                      Team Member
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="px-3 py-1 cursor-pointer bg-primary text-primary-foreground">
                      Operations
                    </Badge>
                    <Badge className="px-3 py-1 cursor-pointer bg-muted hover:bg-muted/80">
                      Marketing
                    </Badge>
                    <Badge className="px-3 py-1 cursor-pointer bg-muted hover:bg-muted/80">
                      Sales
                    </Badge>
                    <Badge className="px-3 py-1 cursor-pointer bg-primary text-primary-foreground">
                      Finance
                    </Badge>
                    <Badge className="px-3 py-1 cursor-pointer bg-muted hover:bg-muted/80">
                      HR
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Experience Level</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="px-3 py-1 cursor-pointer bg-primary text-primary-foreground">
                      Beginner
                    </Badge>
                    <Badge className="px-3 py-1 cursor-pointer bg-muted hover:bg-muted/80">
                      Intermediate
                    </Badge>
                    <Badge className="px-3 py-1 cursor-pointer bg-muted hover:bg-muted/80">
                      Advanced
                    </Badge>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between pt-4">
                <Button onClick={resetTutorial} variant="outline">
                  Reset Tutorial
                </Button>
                <Button onClick={() => setActiveTab("tour")}>
                  Continue Tour
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OnboardingWizard;