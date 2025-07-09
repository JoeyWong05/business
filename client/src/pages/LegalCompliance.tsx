import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileCheck,
  Shield,
  BookOpen,
  Upload,
  Download,
  Book,
  AlertCircle,
  CheckCircle,
  LucideIcon,
  HelpCircle,
  Search,
  Briefcase,
  Globe2,
  Building,
  Home,
  User,
  ClipboardCheck,
  BarChart,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WorldClassPageHeader from "@/components/WorldClassPageHeader";

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: LucideIcon;
  downloadUrl?: string;
  status?: "draft" | "completed" | "pending" | "approved";
}

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: "completed" | "pending" | "not-started" | "in-progress";
  dueDate?: string;
  importance: "high" | "medium" | "low";
  entityId?: number;
}

interface BusinessEntity {
  id: number;
  name: string;
  type: string;
  state: string;
  businessStructure: string;
  ein?: string;
  formationDate?: string;
  complianceItems: ComplianceItem[];
  documentCount: number;
  compliancePercent: number;
}

const templateItems: TemplateItem[] = [
  {
    id: "nda-standard",
    name: "Standard Non-Disclosure Agreement",
    description: "Protect your business information with this comprehensive NDA template.",
    type: "agreement",
    icon: FileCheck,
  },
  {
    id: "contractor-agreement",
    name: "Independent Contractor Agreement",
    description: "Clear terms for working with contractors and freelancers.",
    type: "agreement",
    icon: FileText,
  },
  {
    id: "client-service-agreement",
    name: "Client Service Agreement",
    description: "Professional service agreement for client engagements.",
    type: "agreement",
    icon: FileText,
  },
  {
    id: "privacy-policy",
    name: "Website Privacy Policy",
    description: "CCPA and GDPR compliant privacy policy template.",
    type: "policy",
    icon: Shield,
  },
  {
    id: "terms-of-service",
    name: "Terms of Service",
    description: "Website terms of service agreement to protect your business.",
    type: "policy",
    icon: Shield,
  },
  {
    id: "operating-agreement-llc",
    name: "LLC Operating Agreement",
    description: "Comprehensive operating agreement for Limited Liability Companies.",
    type: "formation",
    icon: Book,
  },
  {
    id: "bylaws-corporation",
    name: "Corporate Bylaws",
    description: "Bylaws template for C-Corporations and S-Corporations.",
    type: "formation",
    icon: Book,
  },
  {
    id: "trademark-application",
    name: "Trademark Application Checklist",
    description: "Step-by-step guide for trademark registration with the USPTO.",
    type: "trademark",
    icon: ClipboardCheck,
  },
  {
    id: "copyright-registration",
    name: "Copyright Registration Guide",
    description: "Instructions for registering copyrights for creative works.",
    type: "copyright",
    icon: BookOpen,
  },
  {
    id: "data-breach-response",
    name: "Data Breach Response Plan",
    description: "Template for responding to data breaches and security incidents.",
    type: "compliance",
    icon: AlertCircle,
  },
  {
    id: "employee-handbook",
    name: "Employee Handbook Template",
    description: "Comprehensive employee handbook with policies and procedures.",
    type: "hr",
    icon: Book,
  },
  {
    id: "sales-tax-guide",
    name: "Multi-State Sales Tax Guide",
    description: "Guide for managing sales tax compliance across multiple states.",
    type: "tax",
    icon: Globe2,
  },
];

const entities: BusinessEntity[] = [
  {
    id: 1,
    name: "Digital Merch Pros",
    type: "Primary",
    state: "Florida",
    businessStructure: "LLC",
    ein: "XX-XXXXXXX",
    formationDate: "2018-05-12",
    complianceItems: [
      {
        id: "annual-report-dmp",
        name: "Annual Report Filing",
        description: "File annual report with the Florida Division of Corporations",
        status: "completed",
        dueDate: "2023-05-01",
        importance: "high",
      },
      {
        id: "trademark-renewal-dmp",
        name: "Trademark Renewal",
        description: "Renew Digital Merch Pros trademark with USPTO",
        status: "in-progress",
        dueDate: "2023-09-15",
        importance: "high",
      },
      {
        id: "sales-tax-report-q2",
        name: "Q2 Sales Tax Report",
        description: "File Q2 sales tax report for all nexus states",
        status: "pending",
        dueDate: "2023-07-31",
        importance: "high",
      },
    ],
    documentCount: 15,
    compliancePercent: 85,
  },
  {
    id: 2,
    name: "Mystery Hype",
    type: "Subsidiary",
    state: "Florida",
    businessStructure: "LLC",
    ein: "XX-XXXXXXX",
    formationDate: "2020-03-18",
    complianceItems: [
      {
        id: "annual-report-mh",
        name: "Annual Report Filing",
        description: "File annual report with the Florida Division of Corporations",
        status: "completed",
        dueDate: "2023-03-01",
        importance: "high",
      },
      {
        id: "inventory-compliance",
        name: "Inventory Compliance Audit",
        description: "Conduct internal audit of inventory compliance procedures",
        status: "not-started",
        dueDate: "2023-08-30",
        importance: "medium",
      },
      {
        id: "privacy-policy-update",
        name: "Privacy Policy Update",
        description: "Update website privacy policy to reflect new regulations",
        status: "pending",
        dueDate: "2023-07-15",
        importance: "medium",
      },
    ],
    documentCount: 12,
    compliancePercent: 70,
  },
  {
    id: 3,
    name: "Lone Star Custom Clothing",
    type: "Subsidiary",
    state: "Texas",
    businessStructure: "LLC",
    ein: "XX-XXXXXXX",
    formationDate: "2021-08-22",
    complianceItems: [
      {
        id: "franchise-tax-ls",
        name: "Texas Franchise Tax Report",
        description: "File annual franchise tax report with Texas Comptroller",
        status: "pending",
        dueDate: "2023-05-15",
        importance: "high",
      },
      {
        id: "sales-tax-permit-renewal",
        name: "Sales Tax Permit Renewal",
        description: "Renew Texas sales tax permit",
        status: "completed",
        dueDate: "2023-01-31",
        importance: "high",
      },
    ],
    documentCount: 8,
    compliancePercent: 65,
  },
];

const entityTypes = [
  { id: "sole-prop", name: "Sole Proprietorship", description: "A business owned and run by one person", advantages: ["Simple to form", "Complete control", "Direct tax reporting on personal return"], disadvantages: ["Unlimited personal liability", "Limited capital raising ability", "Business ends with owner"] },
  { id: "llc", name: "Limited Liability Company (LLC)", description: "A business structure that combines pass-through taxation with limited liability", advantages: ["Limited personal liability", "Pass-through taxation", "Management flexibility", "Fewer formalities"], disadvantages: ["Self-employment taxes", "State filing requirements", "More complex than sole proprietorship"] },
  { id: "s-corp", name: "S Corporation", description: "A corporation that passes corporate income, losses, deductions, and credits through to shareholders", advantages: ["Limited personal liability", "Pass-through taxation", "Potential tax savings on self-employment tax"], disadvantages: ["Strict qualification requirements", "Shareholder limitations", "More formalities and paperwork"] },
  { id: "c-corp", name: "C Corporation", description: "A legal entity separate from its owners with its own tax liability", advantages: ["Limited personal liability", "Unlimited shareholders", "Attractive to investors", "Perpetual existence"], disadvantages: ["Double taxation", "Extensive formalities", "More expensive to form and maintain"] },
  { id: "closed-llc", name: "Closed LLC (Series LLC)", description: "An LLC structure that allows multiple separate LLCs to operate under one umbrella LLC", advantages: ["Asset protection between series", "Potential cost savings", "Administrative simplicity"], disadvantages: ["Not recognized in all states", "Legal uncertainty in some jurisdictions", "Complex tax reporting"] },
];

export default function LegalCompliance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [templateType, setTemplateType] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState<BusinessEntity | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<TemplateItem | null>(null);

  const filteredTemplates = templateItems.filter(
    (template) =>
      (templateType === "all" || template.type === templateType) &&
      (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "not-started":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case "not-started":
        return <Badge className="bg-gray-300 hover:bg-gray-400">Not Started</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const renderTemplateIcon = (Icon: LucideIcon) => {
    return <Icon className="h-5 w-5 mr-2" />;
  };

  return (
    <div className="container mx-auto py-6">
      <WorldClassPageHeader
        title="Legal & Compliance Center"
        description="Manage your legal documents, business entities, and compliance requirements"
        icon={<Shield className="h-10 w-10 text-primary" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="entities">Business Entities</TabsTrigger>
          <TabsTrigger value="documents">Legal Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="education">Legal Education</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  Business Entities
                </CardTitle>
                <CardDescription>Manage your business entities and structures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Entity Setup</span>
                    <span className="font-medium">3/3</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Overall Compliance</span>
                    <span className="font-medium">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
                <ul className="mt-4 space-y-2">
                  {entities.map((entity) => (
                    <li key={entity.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{entity.name}</span>
                      <Badge variant={entity.compliancePercent >= 80 ? "default" : "secondary"}>
                        {entity.businessStructure}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setActiveTab("entities")}
                >
                  Manage Entities
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Legal Documents
                </CardTitle>
                <CardDescription>Access and manage legal document templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted rounded-md p-3 text-center">
                      <p className="text-2xl font-bold">{templateItems.length}</p>
                      <p className="text-xs text-muted-foreground">Templates</p>
                    </div>
                    <div className="bg-muted rounded-md p-3 text-center">
                      <p className="text-2xl font-bold">35</p>
                      <p className="text-xs text-muted-foreground">Documents</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recently Used</p>
                    <ul className="space-y-1">
                      <li className="text-sm text-muted-foreground flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Client Service Agreement
                      </li>
                      <li className="text-sm text-muted-foreground flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy Policy
                      </li>
                      <li className="text-sm text-muted-foreground flex items-center">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Contractor NDA
                      </li>
                    </ul>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("documents")}
                  >
                    Browse Documents
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                  Compliance Alerts
                </CardTitle>
                <CardDescription>Upcoming deadlines and compliance requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-3 bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-600 text-sm font-medium">Upcoming Deadline</AlertTitle>
                  <AlertDescription className="text-xs">
                    Q2 Sales Tax Report due in 12 days
                  </AlertDescription>
                </Alert>
                <Alert className="mb-3 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-600 text-sm font-medium">Attention Required</AlertTitle>
                  <AlertDescription className="text-xs">
                    Trademark Renewal for Digital Merch Pros pending
                  </AlertDescription>
                </Alert>
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600 text-sm font-medium">Recommendation</AlertTitle>
                  <AlertDescription className="text-xs">
                    Consider updating Privacy Policy for new regulations
                  </AlertDescription>
                </Alert>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setActiveTab("compliance")}
                >
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>
                Key steps to establish and maintain legal compliance for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Choose the Right Business Structure</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select the appropriate legal structure (LLC, S-Corp, C-Corp) based on your business needs, tax considerations, and liability protection requirements.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-primary"
                      onClick={() => setActiveTab("education")}
                    >
                      Compare Business Structures →
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Prepare Essential Legal Documents</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create and maintain fundamental legal documents including operating agreements, client contracts, NDAs, and website policies.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-primary"
                      onClick={() => setActiveTab("documents")}
                    >
                      Access Document Templates →
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Globe2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Manage Multi-State Compliance</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Understand and comply with requirements for operating in multiple states, including sales tax collection, foreign qualification, and annual reports.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-primary"
                      onClick={() => setActiveTab("compliance")}
                    >
                      Review Compliance Requirements →
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Protect Intellectual Property</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Safeguard your brand and creative assets through trademarks, copyrights, and proper IP protection strategies.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-primary"
                      onClick={() => setActiveTab("education")}
                    >
                      Learn About IP Protection →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BUSINESS ENTITIES TAB */}
        <TabsContent value="entities">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {entities.map((entity) => (
              <Card key={entity.id} className="overflow-hidden">
                <CardHeader className="pb-2 relative">
                  <CardTitle>{entity.name}</CardTitle>
                  <CardDescription>
                    {entity.businessStructure} • {entity.state}
                  </CardDescription>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="font-normal">
                      {entity.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EIN</span>
                      <span className="font-medium">{entity.ein}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Formation Date</span>
                      <span className="font-medium">{entity.formationDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Documents</span>
                      <span className="font-medium">{entity.documentCount}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Compliance</span>
                        <span className="font-medium">{entity.compliancePercent}%</span>
                      </div>
                      <Progress value={entity.compliancePercent} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <div className="mt-4 px-6 py-2 bg-muted/50">
                  <p className="text-sm font-medium mb-2">Upcoming Tasks</p>
                  <div className="space-y-2">
                    {entity.complianceItems
                      .filter((item) => item.status !== "completed")
                      .slice(0, 2)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(item.status)}`}></div>
                            <span className="text-xs truncate max-w-[180px]">{item.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {item.dueDate}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="flex-1"
                      onClick={() => setSelectedEntity(entity)}
                    >
                      Manage
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-dashed border-2 flex items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-center mb-2">Add New Business Entity</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Set up a new company, subsidiary, or related business entity
                </p>
                <Button>Add Entity</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Structures Comparison</CardTitle>
              <CardDescription>
                Compare different business structures to find the right one for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  {entityTypes.map((type) => (
                    <AccordionItem key={type.id} value={type.id}>
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <span className="font-medium text-left">{type.name}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="p-4 rounded-md bg-muted/50">
                          <p className="text-sm mb-4">{type.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                Advantages
                              </h4>
                              <ul className="space-y-1">
                                {type.advantages.map((adv, i) => (
                                  <li key={i} className="text-sm flex items-start">
                                    <span className="text-green-500 mr-2">•</span>
                                    <span>{adv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                                Disadvantages
                              </h4>
                              <ul className="space-y-1">
                                {type.disadvantages.map((disadv, i) => (
                                  <li key={i} className="text-sm flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    <span>{disadv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Best For</h4>
                            <p className="text-sm text-muted-foreground">
                              {type.id === "sole-prop" && "Individual entrepreneurs with low-risk businesses, freelancers, consultants."}
                              {type.id === "llc" && "Small to medium businesses seeking liability protection with simplified taxation."}
                              {type.id === "s-corp" && "Small businesses with a single class of stock and U.S. citizen shareholders looking to minimize self-employment taxes."}
                              {type.id === "c-corp" && "Larger businesses planning to raise capital, go public, or have significant growth plans."}
                              {type.id === "closed-llc" && "Businesses with multiple distinct ventures that want to isolate liability between different activities."}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>

          {/* Entity Detail Dialog */}
          {selectedEntity && (
            <Dialog open={!!selectedEntity} onOpenChange={() => setSelectedEntity(null)}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedEntity.name} Details</DialogTitle>
                  <DialogDescription>
                    Manage business entity information and compliance requirements
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Entity Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="business-type">Business Type</Label>
                          <Select defaultValue={selectedEntity.businessStructure}>
                            <SelectTrigger id="business-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LLC">LLC</SelectItem>
                              <SelectItem value="S-Corp">S-Corporation</SelectItem>
                              <SelectItem value="C-Corp">C-Corporation</SelectItem>
                              <SelectItem value="Sole Prop">Sole Proprietorship</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Select defaultValue={selectedEntity.state}>
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Florida">Florida</SelectItem>
                              <SelectItem value="Texas">Texas</SelectItem>
                              <SelectItem value="California">California</SelectItem>
                              <SelectItem value="New York">New York</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="ein">EIN</Label>
                        <Input id="ein" defaultValue={selectedEntity.ein} />
                      </div>
                      
                      <div>
                        <Label htmlFor="formation-date">Formation Date</Label>
                        <Input id="formation-date" type="date" defaultValue={selectedEntity.formationDate} />
                      </div>
                      
                      <div>
                        <Label htmlFor="entity-type">Entity Type</Label>
                        <Select defaultValue={selectedEntity.type}>
                          <SelectTrigger id="entity-type">
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Primary">Primary</SelectItem>
                            <SelectItem value="Subsidiary">Subsidiary</SelectItem>
                            <SelectItem value="Affiliate">Affiliate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Compliance Tasks</h3>
                      <Button size="sm" variant="outline" className="h-8">Add Task</Button>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedEntity.complianceItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                        >
                          <div>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(item.status)}`}></div>
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(item.status)}
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Tax Filing Status</h4>
                      <div className="p-3 rounded-md bg-muted/50">
                        <p className="text-sm">Next Filing: <span className="font-medium">Q3 Estimated Tax (Sep 15)</span></p>
                        <p className="text-sm mt-1">Tax Election: <span className="font-medium">Pass-through</span></p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Registered Agent</h4>
                      <div className="p-3 rounded-md bg-muted/50">
                        <p className="text-sm">Name: <span className="font-medium">Registered Agents Inc.</span></p>
                        <p className="text-sm mt-1">Renewal: <span className="font-medium">March 15, 2024</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedEntity(null)}>
                    Cancel
                  </Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* LEGAL DOCUMENTS TAB */}
        <TabsContent value="documents">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="agreement">Agreements</SelectItem>
                  <SelectItem value="policy">Policies</SelectItem>
                  <SelectItem value="formation">Formation Documents</SelectItem>
                  <SelectItem value="trademark">Trademark</SelectItem>
                  <SelectItem value="copyright">Copyright</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="hr">HR Documents</SelectItem>
                  <SelectItem value="tax">Tax & Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="ml-4">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedDocument(template)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    {renderTemplateIcon(template.icon)}
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="font-normal">
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4 mr-2" />
                      Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Document Viewer Dialog */}
          {selectedDocument && (
            <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    {selectedDocument.icon && <selectedDocument.icon className="h-5 w-5 mr-2" />}
                    {selectedDocument.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedDocument.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex space-x-4">
                  <div className="flex-1 space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Template Preview</h3>
                      <div className="border rounded-md p-4 bg-white h-[300px] overflow-y-auto">
                        {selectedDocument.id === "nda-standard" && (
                          <div className="text-sm space-y-4">
                            <h2 className="text-lg font-bold text-center">NON-DISCLOSURE AGREEMENT</h2>
                            <p>This Non-Disclosure Agreement (the "Agreement") is entered into as of [DATE] by and between:</p>
                            <p><strong>[COMPANY NAME]</strong>, with its principal offices at [ADDRESS] ("Disclosing Party"), and</p>
                            <p><strong>[RECIPIENT NAME]</strong>, located at [ADDRESS] ("Receiving Party").</p>
                            <p>1. <strong>Purpose</strong>. The parties wish to explore a business opportunity of mutual interest, and in connection with this opportunity, Disclosing Party may disclose to Receiving Party certain confidential technical and business information that Disclosing Party desires Receiving Party to treat as confidential.</p>
                            <p>2. <strong>Confidential Information</strong> means any information disclosed by Disclosing Party to Receiving Party, either directly or indirectly, in writing, orally or by inspection of tangible objects, including without limitation documents, business plans, source code, software, documentation, financial analysis, marketing plans, customer names, customer list, customer data...</p>
                            <p><em>[Additional template content would appear here]</em></p>
                          </div>
                        )}
                        
                        {selectedDocument.id === "privacy-policy" && (
                          <div className="text-sm space-y-4">
                            <h2 className="text-lg font-bold text-center">PRIVACY POLICY</h2>
                            <p><strong>Last Updated:</strong> [DATE]</p>
                            <p>This Privacy Policy describes how [COMPANY NAME] ("we," "us," or "our") collects, uses, and discloses your information when you use our services, website, and applications (collectively, the "Services").</p>
                            <p><strong>1. INFORMATION WE COLLECT</strong></p>
                            <p>We collect several types of information from and about users of our Services, including:</p>
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Personal identifiers (such as name, email address, phone number)</li>
                              <li>Payment information</li>
                              <li>Usage data and analytics</li>
                              <li>Device information</li>
                            </ul>
                            <p><em>[Additional template content would appear here]</em></p>
                          </div>
                        )}
                        
                        {selectedDocument.id !== "nda-standard" && selectedDocument.id !== "privacy-policy" && (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Preview not available. Click "Download Template" to view full document.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Customize
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-1/3 space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-2">Document Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="text-sm font-medium">
                            {selectedDocument.type.charAt(0).toUpperCase() + selectedDocument.type.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Format</p>
                          <p className="text-sm font-medium">DOCX, PDF</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Last Updated</p>
                          <p className="text-sm font-medium">June 15, 2023</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-xs text-muted-foreground">Usage</p>
                          <p className="text-sm font-medium">12 times</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="text-sm font-medium mb-2">When To Use</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedDocument.id === "nda-standard" && 
                          "Use this NDA when sharing confidential information with potential partners, contractors, or employees."}
                        {selectedDocument.id === "contractor-agreement" && 
                          "Use this agreement when hiring independent contractors for project-based work."}
                        {selectedDocument.id === "privacy-policy" && 
                          "Required for websites that collect user data. Ensures GDPR and CCPA compliance."}
                        {selectedDocument.id === "terms-of-service" && 
                          "Required for websites and applications to establish rules for usage and limit liability."}
                        {selectedDocument.id === "operating-agreement-llc" && 
                          "Essential document for multi-member LLCs to define ownership and operating procedures."}
                        {selectedDocument.id === "trademark-application" && 
                          "Use when preparing to register your business name, logo, or slogan with the USPTO."}
                        {selectedDocument.id === "data-breach-response" && 
                          "Essential for businesses that collect customer data to comply with breach notification laws."}
                        {selectedDocument.id !== "nda-standard" && 
                         selectedDocument.id !== "contractor-agreement" &&
                         selectedDocument.id !== "privacy-policy" &&
                         selectedDocument.id !== "terms-of-service" &&
                         selectedDocument.id !== "operating-agreement-llc" &&
                         selectedDocument.id !== "trademark-application" &&
                         selectedDocument.id !== "data-breach-response" &&
                          "This document helps establish proper legal protections for your business operations."}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* COMPLIANCE TAB */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Business Entity Compliance</CardTitle>
                <CardDescription>
                  State filing requirements for your business entities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Annual Reports</p>
                      <Badge variant="outline">2/3 Complete</Badge>
                    </div>
                    <Progress value={66} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Next due: Lone Star Custom Clothing (Texas) - May 15, 2023
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Business Licenses</p>
                      <Badge variant="outline">3/3 Complete</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      All business licenses are current
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Registered Agent</p>
                      <Badge variant="outline">3/3 Complete</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      All registered agents are current
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tax Compliance</CardTitle>
                <CardDescription>
                  Federal, state, and local tax filing requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Sales Tax Filings</p>
                      <Badge variant="outline">3/6 Current</Badge>
                    </div>
                    <Progress value={50} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Q2 Sales Tax Reports due for 3 states by July 31
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Income Tax Filings</p>
                      <Badge variant="outline">Complete</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Next estimated tax payment due September 15
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Payroll Tax Filings</p>
                      <Badge variant="outline">Current</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Next 941 filing due July 31
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Intellectual Property</CardTitle>
                <CardDescription>
                  Trademark, copyright, and IP protection status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Trademarks</p>
                      <Badge variant="outline">2/3 Active</Badge>
                    </div>
                    <Progress value={66} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Digital Merch Pros trademark renewal due September 15
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Copyrights</p>
                      <Badge variant="outline">5 Registered</Badge>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      All copyrights current, no pending actions
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Domain Names</p>
                      <Badge variant="outline">7/8 Current</Badge>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      lonestarclothing.com renewal due August 12
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Multi-State Sales Tax Compliance</CardTitle>
              <CardDescription>
                Monitor sales tax requirements across states where you have economic nexus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">State</th>
                        <th className="text-left py-3 px-4 font-medium">Nexus Status</th>
                        <th className="text-left py-3 px-4 font-medium">Filing Frequency</th>
                        <th className="text-left py-3 px-4 font-medium">Next Due Date</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">Florida</td>
                        <td className="py-3 px-4">Physical Presence</td>
                        <td className="py-3 px-4">Monthly</td>
                        <td className="py-3 px-4">July 20, 2023</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Due Soon</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Texas</td>
                        <td className="py-3 px-4">Physical Presence</td>
                        <td className="py-3 px-4">Quarterly</td>
                        <td className="py-3 px-4">July 31, 2023</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Due Soon</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">California</td>
                        <td className="py-3 px-4">Economic Nexus</td>
                        <td className="py-3 px-4">Quarterly</td>
                        <td className="py-3 px-4">July 31, 2023</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Due Soon</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">New York</td>
                        <td className="py-3 px-4">Economic Nexus</td>
                        <td className="py-3 px-4">Quarterly</td>
                        <td className="py-3 px-4">June 20, 2023</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500 hover:bg-green-600">Filed</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">Georgia</td>
                        <td className="py-3 px-4">Economic Nexus</td>
                        <td className="py-3 px-4">Quarterly</td>
                        <td className="py-3 px-4">July 31, 2023</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Due Soon</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Ohio</td>
                        <td className="py-3 px-4">Economic Nexus</td>
                        <td className="py-3 px-4">Monthly</td>
                        <td className="py-3 px-4">July 23, 2023</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Due Soon</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Sales Tax Nexus Guidelines</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Economic nexus is typically established when a business exceeds specific sales thresholds in a state:
                  </p>
                  <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                    <li>Most states: $100,000 in sales or 200 transactions</li>
                    <li>California: $500,000 in sales</li>
                    <li>Texas: $500,000 in sales</li>
                    <li>New York: $500,000 in sales and 100 transactions</li>
                  </ul>
                  <div className="mt-3">
                    <Button variant="link" className="p-0 h-auto text-sm">
                      View Complete Sales Tax Guide →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Compliance Tasks</CardTitle>
              <CardDescription>
                Prioritized list of compliance requirements and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* High Priority Tasks */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    High Priority
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-md border bg-red-50 border-red-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe2 className="h-5 w-5 mr-3 text-red-500" />
                          <div>
                            <h4 className="font-medium">Q2 Sales Tax Filings</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              File Q2 sales tax reports for FL, TX, CA, GA, OH (5 states)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Due Jul 31</p>
                          <p className="text-xs text-muted-foreground">12 days remaining</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ClipboardCheck className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Trademark Renewal</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Renew Digital Merch Pros trademark with USPTO
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Due Sep 15</p>
                          <p className="text-xs text-muted-foreground">58 days remaining</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Texas Franchise Tax Report</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              File annual franchise tax report for Lone Star Custom Clothing
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Past Due</p>
                          <p className="text-xs text-red-500">60 days overdue</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Medium Priority Tasks */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                    Medium Priority
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Privacy Policy Update</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Update website privacy policy for Mystery Hype
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Due Jul 15</p>
                          <p className="text-xs text-red-500">3 days overdue</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BarChart className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Inventory Compliance Audit</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Conduct internal audit of inventory compliance procedures
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Due Aug 30</p>
                          <p className="text-xs text-muted-foreground">43 days remaining</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Low Priority Tasks */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Upcoming / Low Priority
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe2 className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Domain Name Renewal</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Renew lonestarclothing.com domain name
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Due Aug 12</p>
                          <p className="text-xs text-muted-foreground">25 days remaining</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Briefcase className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Q3 Estimated Tax Payment</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Submit Q3 estimated tax payments for all entities
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Due Sep 15</p>
                          <p className="text-xs text-muted-foreground">58 days remaining</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LEGAL EDUCATION TAB */}
        <TabsContent value="education">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Business Formation</CardTitle>
                <CardDescription>
                  Learn about different business structures and formation processes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Entity Comparison Guide</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Compare LLCs, S-Corps, C-Corps, and Sole Proprietorships
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Multi-State Business Operations</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Foreign qualification, nexus, and compliance requirements
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">LLC Operating Agreements</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Essential provisions for multiple-member LLCs
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Intellectual Property</CardTitle>
                <CardDescription>
                  Protect your brand, content, and innovations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Trademark Registration Process</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Step-by-step guide to federal trademark registration
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Copyright Protection for Digital Content</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Securing rights for websites, graphics, and digital media
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Social Media IP Issues</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Managing intellectual property across social platforms
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">E-Commerce Law</CardTitle>
                <CardDescription>
                  Legal requirements for online businesses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Website Legal Requirements</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Essential policies and disclosures for e-commerce sites
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Multi-State Sales Tax Guide</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Post-Wayfair compliance requirements for e-commerce
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Data Privacy Compliance</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        GDPR, CCPA, and other privacy regulations
                      </p>
                      <Button variant="link" className="p-0 h-auto text-xs">Read Article</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Featured Topic: Multi-State Sales Tax Compliance</CardTitle>
              <CardDescription>
                Understanding economic nexus and sales tax obligations after South Dakota v. Wayfair
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p>
                    Since the 2018 Supreme Court decision in <strong>South Dakota v. Wayfair</strong>, businesses selling products online must navigate complex sales tax requirements across multiple states. Unlike the previous physical presence standard, companies now have <em>economic nexus</em> obligations based on their sales volume in each state.
                  </p>
                  
                  <h3>Key Economic Nexus Thresholds</h3>
                  <p>
                    Most states have adopted economic nexus thresholds that create sales tax collection obligations when certain sales levels are reached:
                  </p>
                  <ul>
                    <li><strong>Common threshold:</strong> $100,000 in sales or 200 separate transactions</li>
                    <li><strong>California, Texas, New York:</strong> Higher threshold of $500,000 in sales</li>
                    <li><strong>Kansas, Missouri:</strong> No minimum threshold</li>
                  </ul>
                  
                  <h3>Compliance Steps for E-Commerce Businesses</h3>
                  <ol>
                    <li><strong>Monitor sales by state</strong> to identify when you cross economic nexus thresholds</li>
                    <li><strong>Register for sales tax permits</strong> in states where you have nexus</li>
                    <li><strong>Configure your e-commerce platform</strong> to collect the correct tax rates</li>
                    <li><strong>File returns and remit taxes</strong> according to each state's filing schedule</li>
                    <li><strong>Keep detailed records</strong> of all transactions and tax collected</li>
                  </ol>
                  
                  <h3>Marketplace Facilitator Laws</h3>
                  <p>
                    Most states have enacted marketplace facilitator laws requiring platforms like Amazon, eBay, and Walmart to collect and remit sales tax on behalf of third-party sellers. However, sellers may still have reporting obligations and direct collection requirements for sales made through their own websites.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Resources for Sales Tax Compliance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Download className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <h4 className="text-sm font-medium">State-by-State Guide</h4>
                        <p className="text-xs text-muted-foreground">
                          Comprehensive PDF with threshold and filing requirements for all 50 states
                        </p>
                        <Button variant="link" className="p-0 h-auto text-xs">Download PDF</Button>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Download className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <h4 className="text-sm font-medium">Sales Tax Checklist</h4>
                        <p className="text-xs text-muted-foreground">
                          Step-by-step process to achieve and maintain compliance
                        </p>
                        <Button variant="link" className="p-0 h-auto text-xs">Download PDF</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Legal Resource Library</CardTitle>
              <CardDescription>
                Comprehensive guides and articles on business legal topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formation" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="formation">Formation</TabsTrigger>
                  <TabsTrigger value="contracts">Contracts</TabsTrigger>
                  <TabsTrigger value="ip">Intellectual Property</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="formation" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">How to Choose the Right Business Structure</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Compare the tax, liability, and operational implications of different entity types
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">LLC Formation Checklist</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Step-by-step guide to forming an LLC in any state
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">S-Corporation Election Guide</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requirements, process, and tax implications of S-Corp election
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Registered Agent Requirements</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Understanding registered agent responsibilities and requirements
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Operating Agreement Essentials</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Critical provisions for multi-member LLC operating agreements
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Foreign Qualification Process</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            How to register your business to operate in multiple states
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Business Owner Liability Protection</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Strategies to maximize personal liability protection
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Business Name Selection & Protection</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Legal considerations for choosing and protecting your business name
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contracts" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Client Service Agreement Guide</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Essential provisions for service-based business contracts
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Independent Contractor Agreements</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Legal considerations and key provisions for contractor relationships
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">E-Commerce Terms & Conditions</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Critical website legal agreements for online businesses
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Non-Disclosure Agreement Best Practices</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Protect confidential information with proper NDA implementation
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Employment Contract Essentials</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Key provisions for legally sound employee agreements
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Partnership & Joint Venture Agreements</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Legal structure for business collaborations and partnerships
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ip" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* IP Content */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Trademark Registration Process</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Complete guide to federal trademark registration with the USPTO
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Copyright Protection for Digital Businesses</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Protecting websites, content, and digital assets
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Intellectual Property Licensing</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Structuring agreements to monetize your intellectual property
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Domain Name Protection Strategies</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Securing and defending your online brand presence
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Trade Secret Protection</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Safeguarding confidential business information and processes
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Intellectual Property Audits</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Identifying and cataloging your business IP assets
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="compliance" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Compliance Content */}
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Multi-State Sales Tax Guide</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Economic nexus requirements and compliance strategies
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Data Privacy Compliance</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            GDPR, CCPA, and global privacy regulation requirements
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Employment Law Compliance</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Federal and state employment regulations for small businesses
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">ADA Website Compliance</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Accessibility requirements for business websites
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Annual Filing Requirements</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            State annual reports and ongoing compliance obligations
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-primary shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium">Data Breach Response Planning</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Legal requirements and steps for responding to data breaches
                          </p>
                          <Button variant="link" className="p-0 h-auto text-xs">Read Guide</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}