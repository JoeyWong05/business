import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bot, 
  Zap, 
  Search, 
  ArrowRight, 
  Image, 
  FileText, 
  BarChart, 
  Code, 
  ChevronDown, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle,
  Sparkles,
  PenTool,
  MessageSquare,
  Users,
  Package,
  CreditCard,
  Calendar,
  PieChart,
  Layers,
  Rocket
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Type for AI assistant responses
interface AIAssistantResponse {
  id: string;
  content: string;
  type: 'text' | 'image' | 'analysis' | 'code' | 'marketing' | 'financial' | 'process' | 'sales';
  metadata?: {
    sources?: {
      name: string;
      url: string;
    }[];
    code?: {
      language: string;
      explanation: string;
    };
    images?: {
      url: string;
      alt: string;
    }[];
    analysis?: {
      data: {
        key: string;
        value: number | string;
        change?: number;
      }[];
      summary: string;
    };
    marketing?: {
      audience: string;
      channels: string[];
      metrics: {
        name: string;
        value: string | number;
      }[];
    };
    financials?: {
      metrics: {
        name: string;
        value: string | number;
        trend?: 'up' | 'down' | 'stable';
      }[];
      summary: string;
    };
    process?: {
      steps: {
        name: string;
        description: string;
        assignedTo?: string;
      }[];
      duration: string;
      tools: string[];
    };
    sales?: {
      products: {
        name: string;
        price: number;
        recommendedPrice?: number;
      }[];
      tactics: string[];
      potentialRevenue: number;
    };
  };
  createdAt: Date;
}

// Type for entity types for specialized prompts
interface BusinessEntity {
  id: number;
  name: string;
  type: 'agency' | 'physical' | 'products' | 'ecommerce';
  slug: string;
}

// Entity-specific prompt templates
const entityPromptTemplates: Record<string, string[]> = {
  agency: [
    "Generate a client proposal for [service] that highlights our agency expertise",
    "Create a social media content calendar for our agency for the next two weeks",
    "Design a client onboarding workflow that reduces friction and improves client satisfaction",
    "Analyze our agency's service pricing compared to competitors and suggest improvements",
    "Write a follow-up email sequence for potential clients who haven't responded"
  ],
  physical: [
    "Create an in-store promotion strategy to increase foot traffic during weekdays",
    "Design a store layout optimization plan to improve customer flow and increase sales",
    "Develop an inventory management process to reduce stockouts and overstock situations",
    "Create a local marketing campaign to attract customers within a 5-mile radius",
    "Design a loyalty program specifically for in-store shoppers"
  ],
  products: [
    "Create product descriptions for our new product line that highlight key benefits",
    "Develop a distribution strategy to get our products into more retail locations",
    "Design packaging copy that appeals to our target market and conveys our value proposition",
    "Write a product launch email sequence to announce our newest product to existing customers",
    "Create a product bundling strategy to increase average order value"
  ],
  ecommerce: [
    "Optimize our product page layout for better conversion rates",
    "Create an abandoned cart email sequence to recover lost sales",
    "Develop a holiday promotion calendar for our online store",
    "Design a customer feedback survey to improve our online shopping experience",
    "Create a cross-sell strategy based on purchase history patterns"
  ]
};

// Function to generate business-specific prompt suggestions
function getPromptSuggestions(entityType: string): string[] {
  return entityPromptTemplates[entityType] || entityPromptTemplates.agency;
}

// Common prompt templates for all business types
const commonPromptTemplates = [
  "Analyze our recent sales data and identify growth opportunities",
  "Create a content marketing strategy for Q3",
  "Design a customer feedback process to improve satisfaction",
  "Develop a competitive analysis of our top 3 competitors",
  "Create an employee onboarding checklist for new team members",
  "Draft a professional email to request a meeting with a potential partner",
  "Generate ideas for increasing customer retention",
  "Create a social media post calendar for the next month"
];

// Sample AI response for demonstration purpose
// In a real app, this would come from your AI provider (e.g., OpenAI API)
const sampleAIResponses: AIAssistantResponse[] = [
  {
    id: '1',
    content: 'Based on your recent sales data, I\'ve identified several growth opportunities for your business:',
    type: 'analysis',
    metadata: {
      analysis: {
        data: [
          { key: 'Customer Retention Rate', value: '68%', change: -2 },
          { key: 'Average Order Value', value: '$75.50', change: 5 },
          { key: 'Conversion Rate', value: '3.2%', change: 0.5 },
          { key: 'Cart Abandonment', value: '72%', change: 3 }
        ],
        summary: 'Your average order value is trending upward, which is positive. However, customer retention has decreased slightly, and cart abandonment has increased. Focus on improving the checkout experience and implementing a retention strategy targeting customers who haven\'t purchased in 30-60 days.'
      }
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    content: 'Here\'s a content marketing strategy for Q3 focusing on your core products:',
    type: 'marketing',
    metadata: {
      marketing: {
        audience: 'Small business owners (25-45), tech-savvy professionals, marketing managers',
        channels: ['Blog', 'Instagram', 'LinkedIn', 'Email Newsletter'],
        metrics: [
          { name: 'Content Pieces', value: 24 },
          { name: 'Expected Reach', value: '50,000+' },
          { name: 'Estimated Conversion', value: '3.5%' }
        ]
      }
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '3',
    content: 'I\'ve created a comprehensive customer feedback collection and analysis process:',
    type: 'process',
    metadata: {
      process: {
        steps: [
          { name: 'Survey Design', description: 'Create targeted surveys using NPS and CSAT metrics', assignedTo: 'Marketing Team' },
          { name: 'Collection Points', description: 'Implement feedback collection at 4 critical touchpoints', assignedTo: 'Web Development' },
          { name: 'Analysis Workflow', description: 'Weekly review of feedback with sentiment analysis', assignedTo: 'Customer Experience Manager' },
          { name: 'Action Plan', description: 'Prioritize improvements based on impact/effort matrix', assignedTo: 'Department Heads' },
          { name: 'Follow-up', description: 'Close the loop with customers who provided feedback', assignedTo: 'Customer Support' }
        ],
        duration: '6-8 weeks for implementation, ongoing execution',
        tools: ['SurveyMonkey', 'Hotjar', 'Salesforce Service Cloud', 'Power BI']
      }
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
  }
];

// Entity-specific assistant features
interface EntityFeatures {
  title: string;
  description: string;
  icon: React.ReactNode;
  capabilities: string[];
}

const entityFeatures: Record<string, EntityFeatures> = {
  agency: {
    title: "Agency Intelligence",
    description: "Advanced AI features tailored for digital marketing and creative agencies",
    icon: <PenTool className="h-5 w-5 text-purple-500" />,
    capabilities: [
      "Client proposal generation with ROI projections",
      "Creative brief development with brand alignment",
      "Campaign performance analysis with optimization recommendations",
      "Creative asset management and recommendation",
      "Client communication templates personalized to your agency voice"
    ]
  },
  physical: {
    title: "Retail Intelligence",
    description: "AI capabilities designed for physical retail and storefront management",
    icon: <Package className="h-5 w-5 text-blue-500" />,
    capabilities: [
      "Store layout optimization suggestions",
      "Foot traffic analysis and forecasting",
      "Inventory management recommendations",
      "In-store promotion and display strategies",
      "Staff scheduling optimization based on traffic patterns"
    ]
  },
  products: {
    title: "Product Intelligence",
    description: "Smart features for product-based businesses and manufacturers",
    icon: <CreditCard className="h-5 w-5 text-green-500" />,
    capabilities: [
      "Product description generation optimized for conversions",
      "Pricing strategy recommendations based on market analysis",
      "Supply chain optimization suggestions",
      "Product bundling strategies to increase average order value",
      "Competitive product analysis and differentiation opportunities"
    ]
  },
  ecommerce: {
    title: "E-commerce Intelligence",
    description: "Specialized AI features for online stores and digital commerce",
    icon: <ShoppingCart className="h-5 w-5 text-amber-500" />,
    capabilities: [
      "Conversion rate optimization recommendations",
      "Abandoned cart recovery strategies",
      "Product page optimization suggestions",
      "Seasonal promotion planning and scheduling",
      "Cross-sell and upsell strategy development"
    ]
  }
};

// Main component
export default function AdvancedAIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [results, setResults] = useState<AIAssistantResponse[]>(sampleAIResponses);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<string>('chat');
  
  // Fetch business entities
  const { data: entitiesData } = useQuery({
    queryKey: ['/api/business-entities'],
  });
  
  const entities: BusinessEntity[] = (entitiesData?.entities || []) as BusinessEntity[];
  
  // Get current entity
  const currentEntity = selectedEntityId 
    ? entities.find(e => e.id.toString() === selectedEntityId) 
    : null;
  
  const entityType = currentEntity?.type || 'agency';
  const entityFeature = entityFeatures[entityType];
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, you would call your AI API here
      // For demo purposes, we'll just simulate a response after a delay
      setTimeout(() => {
        // Create a new response
        const newResponse: AIAssistantResponse = {
          id: Date.now().toString(),
          content: `Here's a response to: "${prompt}"`,
          type: 'text',
          createdAt: new Date()
        };
        
        // Add new response to the list
        setResults(prev => [...prev, newResponse]);
        setPrompt('');
        
        toast({
          title: "AI response generated",
          description: "A new response has been created based on your prompt",
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Error generating response",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle selecting a prompt template
  const handleSelectPrompt = (templatePrompt: string) => {
    setPrompt(templatePrompt);
  };
  
  // Get suggested prompts based on the selected entity
  const getSuggestedPrompts = () => {
    if (!currentEntity) return commonPromptTemplates;
    
    const entityPrompts = getPromptSuggestions(currentEntity.type);
    return [...entityPrompts.slice(0, 3), ...commonPromptTemplates.slice(0, 3)];
  };
  
  // Render different types of AI responses
  const renderResponseContent = (response: AIAssistantResponse) => {
    switch (response.type) {
      case 'analysis':
        return (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {response.metadata?.analysis?.data.map((item, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">{item.key}</div>
                  <div className="text-xl font-bold">{item.value}</div>
                  {item.change !== undefined && (
                    <div className={cn(
                      "text-sm flex items-center mt-1",
                      item.change > 0 ? "text-green-500" : item.change < 0 ? "text-red-500" : "text-yellow-500"
                    )}>
                      {item.change > 0 ? "↑" : item.change < 0 ? "↓" : "→"}
                      {Math.abs(item.change)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground">{response.metadata?.analysis?.summary}</p>
          </div>
        );
      
      case 'marketing':
        return (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Target Audience</h4>
              <p>{response.metadata?.marketing?.audience}</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Channels</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {response.metadata?.marketing?.channels.map((channel, index) => (
                  <Badge key={index} variant="secondary">{channel}</Badge>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Expected Results</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {response.metadata?.marketing?.metrics.map((metric, index) => (
                  <div key={index}>
                    <div className="text-sm text-muted-foreground">{metric.name}</div>
                    <div className="font-bold">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'process':
        return (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Implementation Steps</h4>
              <ol className="mt-2 space-y-3">
                {response.metadata?.process?.steps.map((step, index) => (
                  <li key={index} className="flex flex-col">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">{index + 1}</Badge>
                      <span className="font-medium">{step.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    {step.assignedTo && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Assigned to: {step.assignedTo}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Timeline</h4>
              <p className="mt-1">{response.metadata?.process?.duration}</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Recommended Tools</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {response.metadata?.process?.tools.map((tool, index) => (
                  <Badge key={index} variant="secondary">{tool}</Badge>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return <p>{response.content}</p>;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="container mx-auto py-6 flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main AI Assistant Panel */}
          <div className="flex-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white"></span>
                    </div>
                    <div>
                      <CardTitle>
                        Business Intelligence AI
                        <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                          GPT-4o
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {currentEntity ? `Customized for ${currentEntity.name}` : 'Tailored business insights and automation'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedEntityId || ""} onValueChange={setSelectedEntityId}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select business entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id.toString()}>
                            {entity.name} 
                            <Badge variant="outline" className="ml-2 text-xs">
                              {entity.type}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
                <div className="border-b">
                  <TabsList className="w-full flex justify-start p-0 h-auto bg-transparent border-b">
                    <TabsTrigger 
                      value="chat" 
                      className="data-[state=active]:border-b-2 border-primary rounded-none data-[state=active]:shadow-none px-4 py-2"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Assistant
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analysis" 
                      className="data-[state=active]:border-b-2 border-primary rounded-none data-[state=active]:shadow-none px-4 py-2"
                    >
                      <BarChart className="h-4 w-4 mr-2" />
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tools" 
                      className="data-[state=active]:border-b-2 border-primary rounded-none data-[state=active]:shadow-none px-4 py-2"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Tools
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden px-0 py-0 m-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {results.map((result) => (
                        <div key={result.id} className="flex flex-col">
                          <div className="flex items-start">
                            <Avatar className="mr-2">
                              <AvatarImage src="/ai-assistant.png" />
                              <AvatarFallback className="bg-primary/20">AI</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1.5">
                              <p className="font-medium text-sm text-foreground">
                                Business Intelligence
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {new Date(result.createdAt).toLocaleTimeString()}
                                </span>
                              </p>
                              <div className="p-3 rounded-lg bg-muted/80 text-foreground">
                                <p>{result.content}</p>
                                {renderResponseContent(result)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <Separator />
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <Label className="text-muted-foreground mb-2 block text-sm">Suggested Prompts</Label>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestedPrompts().map((templatePrompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPrompt(templatePrompt)}
                            className="text-xs text-left justify-start"
                          >
                            <span className="truncate">{templatePrompt}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid w-full gap-2">
                        <Textarea
                          placeholder="Ask me anything about your business operations, marketing, finances, or customer insights..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" variant="outline" size="icon" disabled>
                                  <Image className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Attach images (Coming soon)
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" variant="outline" size="icon" disabled>
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Attach documents (Coming soon)
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Select disabled>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="GPT-4o" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt4">GPT-4o</SelectItem>
                              <SelectItem value="gpt3">GPT-3.5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" disabled={isGenerating || !prompt.trim()}>
                          {isGenerating ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              Generate
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="flex flex-col p-4 space-y-4 m-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Business Analysis</h3>
                      <p className="text-sm text-muted-foreground">AI-powered insights from your business data</p>
                    </div>
                    <Button disabled>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Analysis
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Performance Metrics</CardTitle>
                        <CardDescription>Last 30 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Revenue</span>
                            <Badge variant="outline" className="text-green-600">+12%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">New Customers</span>
                            <Badge variant="outline" className="text-green-600">+8%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Churn Rate</span>
                            <Badge variant="outline" className="text-red-600">+2%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Opportunities</CardTitle>
                        <CardDescription>AI-identified growth areas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Email marketing optimization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Customer retention program</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Product bundling strategy</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Risk Factors</CardTitle>
                        <CardDescription>Areas requiring attention</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm">Increasing customer acquisition cost</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Seasonal inventory planning</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Employee retention rates</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Recommended Actions</h3>
                    <p className="text-sm text-muted-foreground">AI-suggested next steps based on your data</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/20">High Impact</Badge>
                          <span className="text-sm font-medium">Implement Customer Retention Program</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Your customer churn increased by 2%. Implement targeted offers for at-risk customers to increase retention.</p>
                        <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                          Generate detailed plan &rarr;
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Medium Impact</Badge>
                          <span className="text-sm font-medium">Optimize Product Pricing Strategy</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Analysis shows potential for 15% increased revenue with optimized pricing across product categories.</p>
                        <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                          Generate pricing recommendations &rarr;
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Medium Impact</Badge>
                          <span className="text-sm font-medium">Email Marketing Optimization</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Your email open rates are below industry average. Improve subject lines and segmentation.</p>
                        <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                          Generate email strategy &rarr;
                        </Button>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Long Term</Badge>
                          <span className="text-sm font-medium">Employee Development Program</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Implement structured training to improve employee satisfaction and reduce turnover.</p>
                        <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                          Generate program outline &rarr;
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tools" className="p-4 space-y-4 m-0">
                  <div>
                    <h3 className="text-lg font-medium mb-1">AI Tools & Automations</h3>
                    <p className="text-sm text-muted-foreground">Specialized tools to streamline your business operations</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Content Generator</CardTitle>
                        <CardDescription>Create marketing content with AI</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Generate blog posts, social media captions, email newsletters and more.</p>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Brand voice customization</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Multiple formats supported</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Financial Forecaster</CardTitle>
                        <CardDescription>Predict financial performance</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Generate financial projections and scenarios based on historical data.</p>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Multiple scenario modeling</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Visual reports & trends</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Customer Insights</CardTitle>
                        <CardDescription>Analyze customer behavior</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Discover patterns and opportunities in your customer data.</p>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Segment identification</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Personalization suggestions</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Process Optimizer</CardTitle>
                        <CardDescription>Streamline business workflows</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Identify bottlenecks and optimize your business processes.</p>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Workflow visualization</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Automation opportunities</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Competitive Analysis</CardTitle>
                        <CardDescription>Track competitor activities</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Monitor competitors and identify market opportunities.</p>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Price comparison</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Marketing strategy insights</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Market Opportunity Finder</CardTitle>
                        <CardDescription>Discover untapped markets</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">Identify new market segments and expansion opportunities.</p>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Demographic analysis</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Potential market sizing</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Launch Tool</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Entity-specific features panel */}
          {entityFeature && currentEntity && (
            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {entityFeature.icon}
                    <CardTitle>{entityFeature.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {entityFeature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <h3 className="font-medium text-sm">Specialized Capabilities</h3>
                      <Badge className="ml-2" variant="outline">
                        {currentEntity.type}
                      </Badge>
                    </div>
                    <ul className="space-y-2">
                      {entityFeature.capabilities.map((capability, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                          <span className="text-sm">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-sm mb-2">Recent Insights</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-md text-sm">
                        <div className="flex items-center gap-1 mb-1 text-muted-foreground text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>Yesterday</span>
                        </div>
                        <p>Your {currentEntity.type === 'agency' ? 'client acquisition' : currentEntity.type === 'physical' ? 'foot traffic' : 'conversion rate'} has increased by 8% compared to last month.</p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded-md text-sm">
                        <div className="flex items-center gap-1 mb-1 text-muted-foreground text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>Last week</span>
                        </div>
                        <p>Recommended focus: {currentEntity.type === 'agency' ? 'Social media management services' : currentEntity.type === 'physical' ? 'Weekend promotional events' : 'Product bundle optimization'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">Try These Prompts</h3>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {entityPromptTemplates[entityType].slice(0, 3).map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectPrompt(prompt)}
                          className="w-full justify-start text-sm h-auto py-2 text-left"
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Training in progress",
                        description: `Training the AI on ${currentEntity.name}'s specific data...`,
                      });
                    }}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Train on {currentEntity.name} Data
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Import for ShoppingCart icon
import { ShoppingCart } from "lucide-react";