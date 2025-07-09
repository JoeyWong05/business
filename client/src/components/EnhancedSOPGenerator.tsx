import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Clock,
  Download,
  FileText,
  Filter,
  Image,
  Info,
  Link2,
  ListFilter,
  MessageSquare,
  Pencil,
  Plus,
  Puzzle,
  RefreshCw,
  Save,
  Share2,
  Sparkles,
  Tag,
  Upload,
  Video,
  Wand2,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SOPStep {
  id: string;
  title: string;
  description: string;
  hasImage?: boolean;
  imageUrl?: string;
  hasVideo?: boolean;
  videoUrl?: string;
  estimatedTime?: number;
  assignedRole?: string;
  requiredTools?: string[];
}

interface SOPTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: 'simple' | 'moderate' | 'complex';
  popularity: number;
}

const EnhancedSOPGenerator: React.FC = () => {
  const [sopTitle, setSopTitle] = useState<string>('');
  const [sopDescription, setSopDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [contextual, setContextual] = useState<boolean>(true);
  const [complexity, setComplexity] = useState<string>('medium');
  const [format, setFormat] = useState<string>('standard');
  const [steps, setSteps] = useState<SOPStep[]>([]);
  const [generationInProgress, setGenerationInProgress] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('generate');
  const { toast } = useToast();
  
  // Mock data for entities, categories, and roles
  const entities = [
    { id: 1, name: 'Digital Merch Pros' },
    { id: 2, name: 'Mystery Hype' },
    { id: 3, name: 'Lone Star Custom Clothing' },
    { id: 4, name: 'Alcoeaze' },
    { id: 5, name: 'Hide Cafe Bars' },
  ];
  
  const categories = [
    { id: 1, name: 'Marketing', slug: 'marketing', icon: 'target' },
    { id: 2, name: 'Operations', slug: 'operations', icon: 'settings' },
    { id: 3, name: 'Finance', slug: 'finance', icon: 'dollar-sign' },
    { id: 4, name: 'Sales', slug: 'sales', icon: 'shopping-cart' },
    { id: 5, name: 'Customer Support', slug: 'customer-support', icon: 'message-circle' },
    { id: 6, name: 'Human Resources', slug: 'hr', icon: 'users' },
    { id: 7, name: 'IT', slug: 'it', icon: 'code' },
  ];

  const roles = [
    'Manager',
    'Team Lead',
    'Marketing Specialist',
    'Operations Coordinator', 
    'Customer Support Agent',
    'Sales Representative',
    'Finance Analyst',
    'HR Specialist',
    'IT Support',
    'Content Creator',
    'Any Team Member'
  ];
  
  // Mock SOP templates
  const sopTemplates: SOPTemplate[] = [
    { 
      id: 'template1', 
      title: 'Customer Onboarding Process', 
      description: 'Step-by-step guide for bringing new customers into your business ecosystem.',
      category: 'Customer Support',
      complexity: 'moderate',
      popularity: 95
    },
    { 
      id: 'template2', 
      title: 'Social Media Content Publishing', 
      description: 'Workflow for creating, approving, and publishing content to social media platforms.',
      category: 'Marketing',
      complexity: 'moderate',
      popularity: 88
    },
    { 
      id: 'template3', 
      title: 'Monthly Financial Reporting', 
      description: 'Process for gathering, analyzing, and presenting monthly financial data.',
      category: 'Finance',
      complexity: 'complex',
      popularity: 82
    },
    { 
      id: 'template4', 
      title: 'New Employee Onboarding', 
      description: 'Steps for successfully integrating new team members into the organization.',
      category: 'Human Resources',
      complexity: 'moderate',
      popularity: 91
    },
    { 
      id: 'template5', 
      title: 'Order Fulfillment Process', 
      description: 'End-to-end workflow for processing and fulfilling customer orders.',
      category: 'Operations',
      complexity: 'moderate',
      popularity: 93
    },
    { 
      id: 'template6', 
      title: 'Customer Complaint Resolution', 
      description: 'Systematic approach to addressing and resolving customer complaints.',
      category: 'Customer Support',
      complexity: 'moderate',
      popularity: 87
    },
    { 
      id: 'template7', 
      title: 'Lead Qualification Process', 
      description: 'Method for evaluating and qualifying sales leads.',
      category: 'Sales',
      complexity: 'simple',
      popularity: 85
    },
    { 
      id: 'template8', 
      title: 'IT Incident Response', 
      description: 'Protocol for responding to and resolving IT incidents and outages.',
      category: 'IT',
      complexity: 'complex',
      popularity: 79
    },
  ];
  
  // Sample generated SOP
  const sampleGeneratedSOP: SOPStep[] = [
    {
      id: '1',
      title: 'Define Campaign Objectives',
      description: 'Clearly articulate the goals of the social media campaign. Include specific KPIs such as engagement rate, reach, click-through rate, or conversion targets. Document these objectives in the campaign brief template.',
      assignedRole: 'Marketing Specialist',
      estimatedTime: 60,
      requiredTools: ['Campaign Brief Template', 'Analytics Platform']
    },
    {
      id: '2',
      title: 'Identify Target Audience',
      description: 'Analyze customer data to identify the specific audience segments for this campaign. Create detailed personas including demographics, interests, behaviors, and preferred platforms. Use the audience research template to document findings.',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
      assignedRole: 'Marketing Specialist',
      estimatedTime: 90,
      requiredTools: ['Customer Database', 'Audience Research Template', 'Analytics Platform']
    },
    {
      id: '3',
      title: 'Content Planning and Creation',
      description: 'Develop a content calendar outlining post topics, formats, and publishing schedule. Create content that aligns with brand guidelines and campaign objectives. Prepare copy, images, videos, and any other assets needed.',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
      assignedRole: 'Content Creator',
      estimatedTime: 180,
      requiredTools: ['Content Calendar', 'Design Software', 'Brand Guidelines']
    },
    {
      id: '4',
      title: 'Review and Approval Process',
      description: 'Submit all campaign content for review through the content approval system. The Marketing Manager will review for brand consistency, messaging, and strategic alignment. Make any requested revisions and resubmit if needed.',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      assignedRole: 'Team Lead',
      estimatedTime: 120,
      requiredTools: ['Content Approval System', 'Feedback Tracking Tool']
    },
    {
      id: '5',
      title: 'Schedule and Publish Content',
      description: 'Once approved, schedule all content through the social media management platform. Verify publishing dates and times align with the content calendar. Ensure all links are working and tracking parameters are properly set up.',
      assignedRole: 'Marketing Specialist',
      estimatedTime: 60,
      requiredTools: ['Social Media Management Platform', 'Link Tracking Tool']
    },
    {
      id: '6',
      title: 'Monitor and Engage',
      description: 'Actively monitor campaign performance and audience engagement. Respond to comments, messages, and mentions according to the community management guidelines. Document any notable feedback or issues that arise.',
      assignedRole: 'Marketing Specialist',
      estimatedTime: 30,
      requiredTools: ['Social Media Management Platform', 'Community Management Guidelines']
    },
    {
      id: '7',
      title: 'Analyze and Report Results',
      description: 'After the campaign period ends, compile comprehensive analytics including reach, engagement, click-through rates, conversions, and ROI. Compare results against initial objectives and prepare a campaign performance report.',
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
      assignedRole: 'Marketing Specialist',
      estimatedTime: 120,
      requiredTools: ['Analytics Platform', 'Reporting Template']
    },
  ];
  
  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = sopTemplates.find(t => t.id === templateId);
    if (template) {
      setSopTitle(template.title);
      setSopDescription(template.description);
      
      // Find category from template
      const category = categories.find(c => c.name === template.category);
      if (category) {
        setSelectedCategory(category.slug);
      }
      
      // Set complexity based on template
      switch(template.complexity) {
        case 'simple':
          setComplexity('low');
          break;
        case 'moderate':
          setComplexity('medium');
          break;
        case 'complex':
          setComplexity('high');
          break;
      }
    }
  };
  
  // Simulate AI SOP generation
  const generateSOP = () => {
    if (!sopTitle || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a category before generating.",
        variant: "destructive",
      });
      return;
    }
    
    setGenerationInProgress(true);
    setGenerationProgress(0);
    setSteps([]);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerationInProgress(false);
          setSteps(sampleGeneratedSOP);
          toast({
            title: "SOP Generated Successfully",
            description: "Your AI-powered SOP has been created with contextual awareness.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };
  
  // Save the SOP
  const saveSOP = () => {
    if (steps.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Please generate a SOP first before saving.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "SOP Saved Successfully",
      description: `"${sopTitle}" has been saved to your library.`,
    });
  };
  
  // Handle downloading SOP in various formats
  const downloadSOP = (format: 'pdf' | 'docx' | 'html') => {
    toast({
      title: `Downloading SOP as ${format.toUpperCase()}`,
      description: "Your document will be ready in a moment.",
    });
  };
  
  // Getting complexity badge color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI-Powered SOP Generator</h2>
          <p className="text-muted-foreground">
            Create comprehensive standard operating procedures with contextual awareness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCurrentTab('templates')}>
            <BookOpen className="mr-2 h-4 w-4" />
            Templates
          </Button>
          <Button variant="outline" onClick={() => setCurrentTab('library')}>
            <FileText className="mr-2 h-4 w-4" />
            My SOPs
          </Button>
          <Button onClick={() => setCurrentTab('generate')}>
            <Wand2 className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate SOP</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="library">SOP Library</TabsTrigger>
        </TabsList>
        
        {/* Generate SOP Tab */}
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SOP Details</CardTitle>
              <CardDescription>
                Provide information about the SOP you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sop-title">SOP Title</Label>
                  <Input 
                    id="sop-title" 
                    placeholder="e.g., Customer Onboarding Process" 
                    value={sopTitle}
                    onChange={(e) => setSopTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sop-category">Category</Label>
                  <Select 
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="sop-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sop-entity">Business Entity</Label>
                  <Select 
                    value={selectedEntity}
                    onValueChange={setSelectedEntity}
                  >
                    <SelectTrigger id="sop-entity">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.name}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sop-complexity">Complexity Level</Label>
                  <Select 
                    value={complexity}
                    onValueChange={setComplexity}
                  >
                    <SelectTrigger id="sop-complexity">
                      <SelectValue placeholder="Select complexity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Basic steps for simple tasks</SelectItem>
                      <SelectItem value="medium">Medium - Detailed process with multiple roles</SelectItem>
                      <SelectItem value="high">High - Complex procedure with dependencies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sop-description">Description</Label>
                <Textarea 
                  id="sop-description" 
                  placeholder="Briefly describe the purpose and scope of this SOP..." 
                  rows={3}
                  value={sopDescription}
                  onChange={(e) => setSopDescription(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sop-format">Output Format</Label>
                  <Select 
                    value={format}
                    onValueChange={setFormat}
                  >
                    <SelectTrigger id="sop-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Format</SelectItem>
                      <SelectItem value="checklist">Checklist</SelectItem>
                      <SelectItem value="flowchart">Flowchart</SelectItem>
                      <SelectItem value="detailed">Detailed with Examples</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="contextual-awareness">Contextual Awareness</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="contextual-awareness" 
                        checked={contextual}
                        onCheckedChange={setContextual}
                      />
                      <Label htmlFor="contextual-awareness" className="text-sm">
                        {contextual ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI will analyze your organization's existing SOPs and tools to create contextually relevant procedures.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>AI Generation Settings</Label>
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    <Brain className="mr-1 h-3 w-3" />
                    OpenAI Powered
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-3 rounded-md">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="include-images" />
                      <Label htmlFor="include-images" className="text-sm">Include relevant images</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="include-videos" />
                      <Label htmlFor="include-videos" className="text-sm">Include tutorial videos</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="assign-roles" checked={true} />
                      <Label htmlFor="assign-roles" className="text-sm">Assign appropriate roles</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="estimate-time" checked={true} />
                      <Label htmlFor="estimate-time" className="text-sm">Estimate time requirements</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="identify-tools" checked={true} />
                      <Label htmlFor="identify-tools" className="text-sm">Identify required tools</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="compliance-check" />
                      <Label htmlFor="compliance-check" className="text-sm">Add compliance references</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab('templates')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Templates
              </Button>
              <Button onClick={generateSOP} disabled={generationInProgress}>
                {generationInProgress ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate SOP
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Progress indicator during generation */}
          {generationInProgress && (
            <Card>
              <CardHeader>
                <CardTitle>Generating Your SOP</CardTitle>
                <CardDescription>
                  Our AI is creating a contextually-aware SOP based on your specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={generationProgress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Analyzing existing content</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex items-start gap-2">
                      <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">AI is working on your SOP</p>
                        <p className="text-sm text-muted-foreground">
                          {generationProgress < 30 && "Analyzing your organization's existing SOPs and tools..."}
                          {generationProgress >= 30 && generationProgress < 60 && "Identifying best practices for your industry..."}
                          {generationProgress >= 60 && generationProgress < 90 && "Creating detailed process steps with role assignments..."}
                          {generationProgress >= 90 && "Finalizing your SOP with visual elements and time estimates..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Display generated SOP */}
          {!generationInProgress && steps.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{sopTitle}</CardTitle>
                    <CardDescription>
                      {sopDescription}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline" className={getComplexityColor(complexity)}>
                      {complexity.charAt(0).toUpperCase() + complexity.slice(1)} Complexity
                    </Badge>
                    <Badge variant="outline">
                      {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                    </Badge>
                    {contextual && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        <Brain className="mr-1 h-3 w-3" />
                        Context-Aware
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-8">
                    {steps.map((step, index) => (
                      <div key={step.id} className="relative pl-8 pb-6 border-l border-muted">
                        <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium -translate-x-1/2">
                          {index + 1}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                          
                          {step.hasImage && step.imageUrl && (
                            <div className="mt-3 rounded-md overflow-hidden border">
                              <img 
                                src={step.imageUrl}
                                alt={`Illustration for ${step.title}`}
                                className="w-full h-auto max-h-64 object-cover"
                              />
                            </div>
                          )}
                          
                          {step.hasVideo && step.videoUrl && (
                            <div className="mt-3 rounded-md overflow-hidden border aspect-video">
                              <iframe
                                width="100%"
                                height="100%"
                                src={step.videoUrl}
                                title={`Video tutorial for ${step.title}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {step.assignedRole && (
                              <div className="flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded-md">
                                <UserCog className="h-3.5 w-3.5" />
                                <span>{step.assignedRole}</span>
                              </div>
                            )}
                            
                            {step.estimatedTime && (
                              <div className="flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded-md">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{step.estimatedTime} min</span>
                              </div>
                            )}
                          </div>
                          
                          {step.requiredTools && step.requiredTools.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-1">Required Tools:</p>
                              <div className="flex flex-wrap gap-1">
                                {step.requiredTools.map((tool, i) => (
                                  <Badge key={i} variant="outline">
                                    <Puzzle className="mr-1 h-3 w-3" />
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => downloadSOP('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" onClick={() => downloadSOP('docx')}>
                    <Download className="mr-2 h-4 w-4" />
                    DOCX
                  </Button>
                  <Button variant="outline" onClick={() => downloadSOP('html')}>
                    <Download className="mr-2 h-4 w-4" />
                    HTML
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button onClick={saveSOP}>
                    <Save className="mr-2 h-4 w-4" />
                    Save SOP
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SOP Templates</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Select defaultValue="popular">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="a-z">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>
                Browse and select from professionally designed templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sopTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{template.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">
                          {template.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={
                            template.complexity === 'simple' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : template.complexity === 'moderate'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }
                        >
                          {template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>{template.popularity}% popular</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between flex border-t pt-6">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Template
              </Button>
              <Button 
                onClick={() => {
                  if (selectedTemplate) {
                    setCurrentTab('generate');
                  } else {
                    toast({
                      title: "No template selected",
                      description: "Please select a template first.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!selectedTemplate}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Use Selected Template
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* SOP Library Tab */}
        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your SOP Library</CardTitle>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </div>
              <CardDescription>
                Access and manage your saved standard operating procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="py-3 px-4 border-b flex items-center justify-between bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search SOPs..." 
                      className="w-[250px]"
                    />
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select defaultValue="updated">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Last Updated</SelectItem>
                      <SelectItem value="created">Date Created</SelectItem>
                      <SelectItem value="a-z">Alphabetical</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="divide-y">
                  <div className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 mt-0.5 text-blue-500" />
                        <div>
                          <h3 className="font-medium">Social Media Campaign Process</h3>
                          <p className="text-sm text-muted-foreground">
                            Complete workflow for planning, executing, and analyzing social campaigns
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline">Marketing</Badge>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              Medium Complexity
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                              <Brain className="mr-1 h-3 w-3" />
                              AI Generated
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated 2 days ago
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 mt-0.5 text-green-500" />
                        <div>
                          <h3 className="font-medium">Customer Onboarding Process</h3>
                          <p className="text-sm text-muted-foreground">
                            Step-by-step guide for bringing new customers into your business ecosystem
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline">Customer Support</Badge>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              Medium Complexity
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated 1 week ago
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 mt-0.5 text-purple-500" />
                        <div>
                          <h3 className="font-medium">Monthly Financial Reporting</h3>
                          <p className="text-sm text-muted-foreground">
                            Process for gathering, analyzing, and presenting monthly financial data
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline">Finance</Badge>
                            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              High Complexity
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                              <Brain className="mr-1 h-3 w-3" />
                              AI Generated
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Updated 2 weeks ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-muted-foreground">
                  Showing 3 of 12 SOPs
                </p>
                <Button onClick={() => setCurrentTab('generate')}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Create New SOP
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSOPGenerator;