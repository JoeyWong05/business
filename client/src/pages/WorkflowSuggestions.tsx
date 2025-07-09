import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle, ChevronRight, Clock, Zap, 
  FileText, FileCode, RefreshCw, Boxes,
  ArrowRight, LayoutTemplate, Brain, 
  Workflow, Sparkles, Check, UserCog
} from 'lucide-react';

// Form schema for generating workflow suggestions
const formSchema = z.object({
  userRole: z.string().min(2, "Please select your role"),
  activities: z.array(
    z.object({
      type: z.string().min(2, "Activity type is required"),
      frequency: z.number().min(1, "Frequency must be at least 1"),
      context: z.string().optional(),
      duration: z.number().optional(),
    })
  ).min(1, "At least one activity is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Common activity presets for different roles
const ACTIVITY_PRESETS = {
  manager: [
    { type: "review_team_reports", frequency: 5, context: "Weekly status reports", duration: 30 },
    { type: "client_calls", frequency: 8, context: "Project updates and proposals", duration: 45 },
    { type: "approve_expenses", frequency: 3, context: "Team expense reports", duration: 20 },
    { type: "team_meetings", frequency: 5, context: "Team coordination and planning", duration: 60 },
    { type: "performance_reviews", frequency: 1, context: "Monthly performance tracking", duration: 90 },
  ],
  sales: [
    { type: "outreach_emails", frequency: 25, context: "Cold prospects", duration: 15 },
    { type: "follow_up_calls", frequency: 15, context: "Warm leads", duration: 20 },
    { type: "proposal_writing", frequency: 5, context: "Custom client proposals", duration: 60 },
    { type: "crm_updates", frequency: 10, context: "Lead status and notes", duration: 10 },
    { type: "sales_meetings", frequency: 8, context: "Product demos", duration: 45 },
  ],
  marketing: [
    { type: "content_creation", frequency: 10, context: "Blog posts and articles", duration: 120 },
    { type: "social_scheduling", frequency: 15, context: "Multiple platforms", duration: 30 },
    { type: "campaign_reports", frequency: 3, context: "Performance metrics", duration: 45 },
    { type: "graphic_design", frequency: 8, context: "Social media assets", duration: 60 },
    { type: "competitor_research", frequency: 2, context: "Industry analysis", duration: 90 },
  ],
  customer_service: [
    { type: "ticket_resolution", frequency: 35, context: "Customer support platform", duration: 15 },
    { type: "client_calls", frequency: 20, context: "Issue resolution", duration: 15 },
    { type: "follow_up_emails", frequency: 15, context: "Resolved tickets", duration: 10 },
    { type: "knowledge_base_updates", frequency: 3, context: "Documentation", duration: 45 },
    { type: "team_handoffs", frequency: 8, context: "Complex issues", duration: 15 },
  ],
  operations: [
    { type: "inventory_management", frequency: 7, context: "Stock levels", duration: 30 },
    { type: "process_documentation", frequency: 5, context: "SOPs", duration: 60 },
    { type: "vendor_management", frequency: 6, context: "Orders and logistics", duration: 45 },
    { type: "quality_checks", frequency: 10, context: "Production outputs", duration: 30 },
    { type: "team_coordination", frequency: 8, context: "Cross-department", duration: 45 },
  ],
};

// Available user roles
const USER_ROLES = [
  { value: "manager", label: "Manager" },
  { value: "sales", label: "Sales Representative" },
  { value: "marketing", label: "Marketing Specialist" },
  { value: "customer_service", label: "Customer Service Agent" },
  { value: "operations", label: "Operations Coordinator" },
  { value: "admin", label: "Administrative Assistant" },
  { value: "finance", label: "Finance/Accounting" },
  { value: "hr", label: "HR Specialist" },
  { value: "product", label: "Product Manager" },
  { value: "development", label: "Developer" },
];

export default function WorkflowSuggestions() {
  const [formState, setFormState] = useState<"input" | "results">("input");
  const [workflowResults, setWorkflowResults] = useState<any>(null);
  
  // Set up the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userRole: "",
      activities: [
        { type: "", frequency: 1, context: "", duration: 0 }
      ],
    },
  });
  
  // Tech stack query for showing existing tools
  const { data: techStackData, isLoading: isTechStackLoading } = useQuery({ 
    queryKey: ['/api/tech-stack'],
    enabled: true,
  });
  
  // Mutation for generating workflow suggestions
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const existingTools = techStackData?.techStack.map((item: any) => ({
        name: item.tool.name,
        category: item.tool.categoryName || "Uncategorized"
      })) || [];
      
      const response = await apiRequest("/api/workflow/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userActivities: data.activities,
          userRole: USER_ROLES.find(role => role.value === data.userRole)?.label || data.userRole,
          existingTools
        }),
      });
      
      // Invalidate the relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      
      return response;
    },
    onSuccess: (data) => {
      setWorkflowResults(data);
      setFormState("results");
    },
  });
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };
  
  // Load preset activities based on role
  const handleRoleChange = (role: string) => {
    form.setValue("userRole", role);
    
    if (ACTIVITY_PRESETS[role as keyof typeof ACTIVITY_PRESETS]) {
      form.setValue("activities", ACTIVITY_PRESETS[role as keyof typeof ACTIVITY_PRESETS]);
    }
  };
  
  // Add a new activity field
  const addActivity = () => {
    const currentActivities = form.getValues("activities");
    form.setValue("activities", [
      ...currentActivities,
      { type: "", frequency: 1, context: "", duration: 0 }
    ]);
  };
  
  // Remove an activity field
  const removeActivity = (index: number) => {
    const currentActivities = form.getValues("activities");
    if (currentActivities.length > 1) {
      form.setValue(
        "activities",
        currentActivities.filter((_, i) => i !== index)
      );
    }
  };
  
  // Reset the form and go back to input state
  const handleReset = () => {
    form.reset();
    setFormState("input");
    setWorkflowResults(null);
  };
  
  // Get implementation difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'complex':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  // Get suggestion type icon
  const getSuggestionTypeIcon = (type: string) => {
    switch (type) {
      case 'automation':
        return <RefreshCw className="h-4 w-4" />;
      case 'template':
        return <LayoutTemplate className="h-4 w-4" />;
      case 'integration':
        return <Boxes className="h-4 w-4" />;
      case 'process':
        return <Workflow className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflow Automation</h1>
            <p className="text-muted-foreground">Discover personalized automation suggestions based on your work habits</p>
          </div>
        </div>
        
        {formState === "input" ? (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Workflow Analysis
              </CardTitle>
              <CardDescription>
                Tell us about your regular activities, and we'll suggest automation opportunities to save you time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <Select onValueChange={handleRoleChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {USER_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the role that best matches your work responsibilities
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Your Regular Activities</FormLabel>
                      <Button type="button" variant="outline" size="sm" onClick={addActivity}>
                        Add Activity
                      </Button>
                    </div>
                    
                    {form.watch("activities").map((_, index) => (
                      <div key={index} className="border rounded-md p-4 bg-background">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Activity {index + 1}</h4>
                          {form.watch("activities").length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeActivity(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`activities.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Activity Type</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g., Email processing, data entry" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`activities.${index}.frequency`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Frequency (times per week)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name={`activities.${index}.context`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Context (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g., Client communications, reporting" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`activities.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Average Duration (minutes)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="flex items-center"
                    >
                      {mutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Generate Suggestions
                          <Zap className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <UserCog className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <CardTitle>Workflow Analysis Results</CardTitle>
                      <CardDescription>
                        Based on your role as {USER_ROLES.find(r => r.value === form.getValues().userRole)?.label}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleReset}>
                    New Analysis
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-secondary/30 rounded-lg mb-6">
                  <p className="text-base">{workflowResults?.summary}</p>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Automation Opportunities</h3>
                <div className="space-y-4">
                  {workflowResults?.suggestions.map((suggestion: any, index: number) => (
                    <Card key={index} className="border border-border/60">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base font-medium flex items-center">
                            {getSuggestionTypeIcon(suggestion.type)}
                            <span className="ml-2">{suggestion.title}</span>
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority} priority
                            </Badge>
                            <Badge variant="outline" className={getDifficultyColor(suggestion.implementationDifficulty)}>
                              {suggestion.implementationDifficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Time savings: {suggestion.estimatedTimeSaving}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{suggestion.description}</p>
                        
                        {suggestion.steps && suggestion.steps.length > 0 && (
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="implementation-steps">
                              <AccordionTrigger className="text-sm py-2">
                                Implementation Steps
                              </AccordionTrigger>
                              <AccordionContent>
                                <ol className="pl-6 space-y-2 text-sm list-decimal">
                                  {suggestion.steps.map((step: string, stepIndex: number) => (
                                    <li key={stepIndex} className="pl-1">{step}</li>
                                  ))}
                                </ol>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {workflowResults?.suggestions.length} automation opportunities
                </p>
                <Button onClick={handleReset} variant="outline">
                  Start New Analysis
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}