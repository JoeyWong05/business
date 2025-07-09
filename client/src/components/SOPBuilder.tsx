import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ListChecks,
  Calendar,
  BrainCircuit,
  Sparkles,
  Clock,
  Info,
  Users,
  Workflow,
} from "lucide-react";

const sopSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  description: z.string().min(10, { message: "Please provide a brief description." }),
  department: z.string().min(1, { message: "Please select a department." }),
  detailLevel: z.enum(["basic", "standard", "detailed"], {
    required_error: "Please select detail level.",
  }),
  includeSections: z.object({
    purpose: z.boolean().default(true),
    scope: z.boolean().default(true),
    definitions: z.boolean().default(true),
    responsibilities: z.boolean().default(true),
    procedures: z.boolean().default(true),
    references: z.boolean().default(false),
    approvals: z.boolean().default(true),
    revisionHistory: z.boolean().default(false),
  }),
  additionalInfo: z.string().optional(),
});

type SopFormValues = z.infer<typeof sopSchema>;

// SOP categories
const categories = [
  { value: "operations", label: "Operations" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "customer_service", label: "Customer Service" },
  { value: "it", label: "IT" },
  { value: "legal", label: "Legal" },
  { value: "compliance", label: "Compliance" },
];

// Departments
const departments = [
  { value: "all", label: "All Departments" },
  { value: "executive", label: "Executive" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "customer_service", label: "Customer Service" },
  { value: "it", label: "IT" },
  { value: "hr", label: "Human Resources" },
];

// SOP templates to suggest
const sopTemplates = [
  {
    id: 1,
    title: "Customer Onboarding",
    category: "customer_service",
    description: "Standard process for onboarding new customers",
    department: "customer_service",
    detailLevel: "standard" as const,
  },
  {
    id: 2,
    title: "Social Media Content Calendar",
    category: "marketing",
    description: "Process for creating and scheduling social media content",
    department: "marketing",
    detailLevel: "detailed" as const,
  },
  {
    id: 3,
    title: "Employee Offboarding",
    category: "hr",
    description: "Procedures for when an employee leaves the company",
    department: "hr",
    detailLevel: "standard" as const,
  },
  {
    id: 4,
    title: "Monthly Financial Reporting",
    category: "finance",
    description: "Process for generating and reviewing monthly financial reports",
    department: "finance",
    detailLevel: "detailed" as const,
  },
];

export interface GeneratedSop {
  id: number;
  title: string;
  category: string;
  description: string;
  department: string;
  dateCreated: string;
  createdBy: string;
  content: {
    purpose?: string;
    scope?: string;
    definitions?: Record<string, string>;
    responsibilities?: Record<string, string[]>;
    procedures: {
      title: string;
      steps: {
        step: string;
        description: string;
        additionalInfo?: string;
      }[];
    }[];
    references?: string[];
    approvals?: { name: string; role: string; date: string }[];
    revisionHistory?: { version: string; date: string; changes: string }[];
  };
}

interface SOPBuilderProps {
  onSopGenerated?: (sop: GeneratedSop) => void;
}

export default function SOPBuilder({ onSopGenerated }: SOPBuilderProps) {
  const [activeTab, setActiveTab] = useState("create");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSop, setGeneratedSop] = useState<GeneratedSop | null>(null);
  const { toast } = useToast();

  const form = useForm<SopFormValues>({
    resolver: zodResolver(sopSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      department: "",
      detailLevel: "standard",
      includeSections: {
        purpose: true,
        scope: true,
        definitions: true,
        responsibilities: true,
        procedures: true,
        references: false,
        approvals: true,
        revisionHistory: false,
      },
      additionalInfo: "",
    },
  });

  const loadTemplate = useCallback((template: typeof sopTemplates[0]) => {
    form.reset({
      ...form.getValues(),
      title: template.title,
      category: template.category,
      description: template.description,
      department: template.department,
      detailLevel: template.detailLevel,
    });
  }, [form]);

  const mockGenerateSOP = useCallback(async (values: SopFormValues): Promise<GeneratedSop> => {
    // For now we'll use a mock - in a real implementation this would call the OpenAI API
    return {
      id: Date.now(),
      title: values.title,
      category: values.category,
      description: values.description,
      department: values.department,
      dateCreated: new Date().toISOString(),
      createdBy: "Alex Johnson",
      content: {
        purpose: values.includeSections.purpose 
          ? `The purpose of this ${values.title} SOP is to establish a standardized process for handling ${values.title.toLowerCase()} activities within the organization.`
          : undefined,
        scope: values.includeSections.scope
          ? `This SOP applies to all ${departments.find(d => d.value === values.department)?.label || values.department} staff involved in ${values.title.toLowerCase()} processes.`
          : undefined,
        definitions: values.includeSections.definitions
          ? {
              "SOP": "Standard Operating Procedure",
              [values.title]: `A structured process for ${values.description.toLowerCase()}`,
            }
          : undefined,
        responsibilities: values.includeSections.responsibilities
          ? {
              "Manager": [`Oversee the ${values.title} process`, "Review and approve outcomes"],
              "Staff": [`Execute the ${values.title} process according to this SOP`, "Document all activities"],
            }
          : undefined,
        procedures: [
          {
            title: "Initial Assessment",
            steps: [
              { 
                step: "Step 1", 
                description: "Gather all necessary information" 
              },
              { 
                step: "Step 2", 
                description: "Review available documentation" 
              },
              { 
                step: "Step 3", 
                description: "Consult with relevant stakeholders" 
              },
            ]
          },
          {
            title: "Execution",
            steps: [
              { 
                step: "Step 1", 
                description: "Implement approved process" 
              },
              { 
                step: "Step 2", 
                description: "Document all actions taken" 
              },
              { 
                step: "Step 3", 
                description: "Review outcomes against expected results" 
              },
            ]
          },
          {
            title: "Follow-up",
            steps: [
              { 
                step: "Step 1", 
                description: "Communicate results to stakeholders" 
              },
              { 
                step: "Step 2", 
                description: "Address any issues or concerns" 
              },
              { 
                step: "Step 3", 
                description: "Document lessons learned for future reference" 
              },
            ]
          }
        ],
        references: values.includeSections.references
          ? [
              "Company Handbook",
              "Industry Best Practices Guide",
              "Regulatory Framework"
            ]
          : undefined,
        approvals: values.includeSections.approvals
          ? [
              { name: "Jane Smith", role: "Department Head", date: new Date().toISOString() },
              { name: "John Doe", role: "Compliance Officer", date: new Date().toISOString() }
            ]
          : undefined,
        revisionHistory: values.includeSections.revisionHistory
          ? [
              { version: "1.0", date: new Date().toISOString(), changes: "Initial creation" }
            ]
          : undefined
      }
    };
  }, []);

  async function onSubmit(values: SopFormValues) {
    setIsGenerating(true);

    try {
      // In a real implementation, we'd call our backend API which would use OpenAI
      // For now, use the mock implementation
      const sop = await mockGenerateSOP(values);
      
      setGeneratedSop(sop);
      setActiveTab("preview");
      
      if (onSopGenerated) {
        onSopGenerated(sop);
      }
      
      toast({
        title: "SOP Generated Successfully",
        description: `"${values.title}" has been created with ${values.detailLevel} detail level.`,
      });
    } catch (error) {
      toast({
        title: "Error Generating SOP",
        description: "There was an error generating your SOP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">AI-Powered SOP Builder</h2>
        <p className="text-muted-foreground">
          Create comprehensive SOPs in minutes using our intelligent AI assistant.
        </p>
      </div>
      
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Create SOP</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedSop}>
            <ListChecks className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>
        
        {/* CREATE TAB */}
        <TabsContent value="create" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>SOP Details</CardTitle>
                  <CardDescription>
                    Provide information about the Standard Operating Procedure you want to create.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SOP Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Customer Onboarding Process" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category.value} value={category.value}>
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departments.map(dept => (
                                    <SelectItem key={dept.value} value={dept.value}>
                                      {dept.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brief Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the purpose and scope of this SOP in a few sentences."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="detailLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detail Level</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              <Label
                                htmlFor="detail-basic"
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${
                                  field.value === "basic"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/20 hover:border-muted-foreground/30"
                                }`}
                                onClick={() => form.setValue("detailLevel", "basic")}
                              >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-primary/20">
                                  {field.value === "basic" && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div className="mt-4 space-y-1 text-center">
                                  <div className="text-sm font-medium">Basic</div>
                                  <div className="text-xs text-muted-foreground">
                                    Essential steps
                                  </div>
                                </div>
                              </Label>
                              <Label
                                htmlFor="detail-standard"
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${
                                  field.value === "standard"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/20 hover:border-muted-foreground/30"
                                }`}
                                onClick={() => form.setValue("detailLevel", "standard")}
                              >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-primary/20">
                                  {field.value === "standard" && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div className="mt-4 space-y-1 text-center">
                                  <div className="text-sm font-medium">Standard</div>
                                  <div className="text-xs text-muted-foreground">
                                    Comprehensive
                                  </div>
                                </div>
                              </Label>
                              <Label
                                htmlFor="detail-detailed"
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer ${
                                  field.value === "detailed"
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/20 hover:border-muted-foreground/30"
                                }`}
                                onClick={() => form.setValue("detailLevel", "detailed")}
                              >
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-primary/20">
                                  {field.value === "detailed" && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div className="mt-4 space-y-1 text-center">
                                  <div className="text-sm font-medium">Detailed</div>
                                  <div className="text-xs text-muted-foreground">
                                    Thorough & complete
                                  </div>
                                </div>
                              </Label>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Accordion type="single" collapsible defaultValue="included-sections">
                        <AccordionItem value="included-sections">
                          <AccordionTrigger>Included Sections</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="includeSections.purpose"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Purpose</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="includeSections.scope"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Scope</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="includeSections.definitions"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Definitions</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="includeSections.responsibilities"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Responsibilities</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="includeSections.procedures"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Procedures</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="includeSections.references"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>References</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="includeSections.approvals"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Approvals</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="includeSections.revisionHistory"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Revision History</FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="additional-info">
                          <AccordionTrigger>Additional Information</AccordionTrigger>
                          <AccordionContent>
                            <FormField
                              control={form.control}
                              name="additionalInfo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormDescription>
                                    Add any specific requirements, notes, or context that will help the AI generate a more tailored SOP.
                                  </FormDescription>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Add any additional details here..."
                                      className="min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      <Button 
                        type="submit" 
                        className="w-full mt-6"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Generating SOP...
                          </>
                        ) : (
                          <>
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Generate SOP with AI
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Templates</span>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </CardTitle>
                  <CardDescription>
                    Quick-start with one of these templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {sopTemplates.map((template) => (
                    <div 
                      key={template.id} 
                      className="flex flex-col space-y-1 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => loadTemplate(template)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{template.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {departments.find(d => d.value === template.department)?.label || template.department}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Info className="mr-2 h-4 w-4" />
                    <span>View all templates</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">AI-Powered Features</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Workflow className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <span className="font-medium">Step Generation</span>
                      <p className="text-xs text-muted-foreground">
                        Automatic step-by-step procedures with explanations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <span className="font-medium">Role Assignment</span>
                      <p className="text-xs text-muted-foreground">
                        Clear responsibility definition for each role
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <span className="font-medium">Timeline Creation</span>
                      <p className="text-xs text-muted-foreground">
                        Automatic timeline suggestion for complex processes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* PREVIEW TAB */}
        <TabsContent value="preview" className="mt-6">
          {generatedSop && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{generatedSop.title}</h2>
                    <p className="text-muted-foreground mt-1">{generatedSop.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline">
                        {categories.find(c => c.value === generatedSop.category)?.label || generatedSop.category}
                      </Badge>
                      <Badge variant="outline">
                        {departments.find(d => d.value === generatedSop.department)?.label || generatedSop.department}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(generatedSop.dateCreated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      Edit SOP
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Purpose Section */}
                  {generatedSop.content.purpose && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Purpose</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{generatedSop.content.purpose}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Scope Section */}
                  {generatedSop.content.scope && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Scope</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{generatedSop.content.scope}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Procedures Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Procedures</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {generatedSop.content.procedures.map((procedure, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-lg font-medium">{index + 1}. {procedure.title}</h3>
                          <div className="space-y-3">
                            {procedure.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex gap-4 items-start">
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                                  {stepIndex + 1}
                                </div>
                                <div>
                                  <div className="font-medium">{step.description}</div>
                                  {step.additionalInfo && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {step.additionalInfo}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  {/* Approvals Section */}
                  {generatedSop.content.approvals && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Approvals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-muted">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-muted bg-background">
                              {generatedSop.content.approvals.map((approval, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{approval.name}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{approval.role}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(approval.date).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="md:col-span-1 space-y-6">
                  {/* Responsibilities Section */}
                  {generatedSop.content.responsibilities && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Responsibilities</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(generatedSop.content.responsibilities).map(([role, tasks], index) => (
                          <div key={index}>
                            <h4 className="font-medium mb-2">{role}</h4>
                            <ul className="space-y-1">
                              {tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="text-sm flex items-start gap-2">
                                  <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] flex-shrink-0 mt-0.5">
                                    ✓
                                  </div>
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Definitions Section */}
                  {generatedSop.content.definitions && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Definitions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(generatedSop.content.definitions).map(([term, definition], index) => (
                          <div key={index}>
                            <span className="font-medium">{term}: </span>
                            <span className="text-sm">{definition}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* References Section */}
                  {generatedSop.content.references && (
                    <Card>
                      <CardHeader>
                        <CardTitle>References</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {generatedSop.content.references.map((reference, index) => (
                            <li key={index} className="text-sm">{reference}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Revision History Section */}
                  {generatedSop.content.revisionHistory && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Revision History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-muted">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Version</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Changes</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-muted bg-background">
                              {generatedSop.content.revisionHistory.map((revision, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">{revision.version}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">{new Date(revision.date).toLocaleDateString()}</td>
                                  <td className="px-3 py-2 text-sm">{revision.changes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button>
                  Save to Library
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}