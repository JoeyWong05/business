import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ClipboardCopy,
  FileDown,
  LineChart,
  Copy,
  Search,
  Target,
  BarChart3,
  BarChart,
  Mail,
  MessageSquare,
  PenTool,
  FileText,
  Users,
  Globe,
  Zap,
  Check,
  X,
  BrainCircuit,
  ArrowRight,
  LucideIcon,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

// Define types
interface GeneratedContent {
  emailSubjects: string[];
  emailBody: string;
  landingPage: string;
  socialAdCopy: { headline: string; body: string }[];
  instagramCaptions: string[];
}

interface SEOAudit {
  score: number;
  titleTags: string[];
  metaDescriptions: string[];
  keywords: string[];
  checks: { name: string; passed: boolean; description: string }[];
}

interface AdCampaign {
  audience: string;
  platforms: { name: string; reason: string }[];
  headlines: string[];
  adCopy: string[];
  ctas: string[];
}

interface FunnelStep {
  title: string;
  description: string;
  elements: string[];
  tips: string[];
}

interface MarketingFunnel {
  goal: string;
  steps: FunnelStep[];
}

interface PerformanceMetrics {
  budget: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export default function AgencyKiller() {
  // State for inputs
  const [copyInput, setCopyInput] = useState("");
  const [copyTone, setCopyTone] = useState("professional");
  const [seoUrl, setSeoUrl] = useState("");
  const [seoIndustry, setSeoIndustry] = useState("");
  const [adProduct, setAdProduct] = useState("");
  const [funnelGoal, setFunnelGoal] = useState("lead_generation");
  const [isGenerating, setIsGenerating] = useState({
    copy: false,
    seo: false,
    ad: false,
    funnel: false
  });

  // State for generated content
  const [copyContent, setCopyContent] = useState<GeneratedContent | null>(null);
  const [seoAudit, setSeoAudit] = useState<SEOAudit | null>(null);
  const [keywordResults, setKeywordResults] = useState<string[]>([]);
  const [adCampaign, setAdCampaign] = useState<AdCampaign | null>(null);
  const [funnel, setFunnel] = useState<MarketingFunnel | null>(null);

  // State for performance simulator
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    budget: 1000,
    impressions: 50000,
    clicks: 1000,
    ctr: 2,
    conversions: 50,
    conversionRate: 5,
    cpa: 20,
    revenue: 2500,
    roas: 2.5
  });
  
  // Simulate performance changes based on metrics adjustments
  const simulatePerformance = async () => {
    try {
      const response = await fetch('/api/openai/simulate-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          currentMetrics: performanceMetrics,
          changes: {
            // Simulating 20% increase in budget
            budgetChange: performanceMetrics.budget * 0.2,
            // Other parameters could be added here based on user inputs
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to simulate performance');
      }
      
      const data = await response.json();
      setPerformanceMetrics(data);
      
      toast({
        title: "Simulation Complete",
        description: "Updated metrics based on your changes.",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Performance simulation error:", error);
      toast({
        title: "Simulation Failed",
        description: error.message || "Unable to simulate performance. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Simulated AI generation functions
  const generateCopy = async () => {
    if (!copyInput) {
      toast({
        title: "Input Required",
        description: "Please describe your product or offer first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(prev => ({ ...prev, copy: true }));
    
    try {
      // Call the API endpoint for marketing copy generation
      const response = await fetch('/api/openai/marketing-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: copyInput,
          tone: copyTone
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate marketing copy');
      }
      
      const data = await response.json();
      setCopyContent(data);
      
      toast({
        title: "Copy Generated Successfully",
        description: "Your AI-generated copy is ready to use.",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Marketing copy generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate marketing copy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, copy: false }));
    }
  };

  const generateSEOAudit = async () => {
    if (!seoUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to audit.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(prev => ({ ...prev, seo: true }));
    
    try {
      // Call the API endpoint for SEO audit generation
      const response = await fetch('/api/openai/seo-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: seoUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate SEO audit');
      }
      
      const data = await response.json();
      setSeoAudit(data);
      
      toast({
        title: "SEO Audit Complete",
        description: "Your website audit has been generated.",
        variant: "default"
      });
    } catch (error: any) {
      console.error("SEO audit generation error:", error);
      toast({
        title: "Audit Failed",
        description: error.message || "Unable to generate SEO audit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, seo: false }));
    }
  };

  const generateKeywords = async () => {
    if (!seoIndustry) {
      toast({
        title: "Industry Required",
        description: "Please enter your industry to generate keywords.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Call the API endpoint for SEO keywords generation
      const response = await fetch('/api/openai/seo-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry: seoIndustry }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate SEO keywords');
      }
      
      const data = await response.json();
      setKeywordResults(Array.isArray(data) ? data : []);
      
      toast({
        title: "Keywords Generated",
        description: "Top SEO keywords for your industry.",
        variant: "default"
      });
    } catch (error: any) {
      console.error("SEO keywords generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate SEO keywords. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateAdCampaign = async () => {
    if (!adProduct) {
      toast({
        title: "Product Required",
        description: "Please enter your product or offer name.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(prev => ({ ...prev, ad: true }));
    
    try {
      // Call the API endpoint for ad campaign generation
      const response = await fetch('/api/openai/ad-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: adProduct }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate ad campaign');
      }
      
      const data = await response.json();
      setAdCampaign(data);
      
      toast({
        title: "Ad Campaign Generated",
        description: "Your campaign brief is ready to review.",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Ad campaign generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate ad campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, ad: false }));
    }
  };

  const generateFunnel = async () => {
    if (!funnelGoal) {
      toast({
        title: "Goal Required",
        description: "Please select a funnel goal.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(prev => ({ ...prev, funnel: true }));
    
    try {
      // Call the API endpoint for marketing funnel generation
      const response = await fetch('/api/openai/marketing-funnel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal: funnelGoal }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate marketing funnel');
      }
      
      const data = await response.json();
      setFunnel(data);
      
      toast({
        title: "Marketing Funnel Created",
        description: "Your custom funnel strategy is ready.",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Marketing funnel generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate marketing funnel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, funnel: false }));
    }
  };

  // Helper function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to your clipboard.",
      variant: "default"
    });
  };

  // Helper function to update performance metrics
  const updatePerformanceMetrics = (key: keyof PerformanceMetrics, value: number) => {
    setPerformanceMetrics(prev => {
      const updated = { ...prev, [key]: value };
      
      // Recalculate dependent metrics
      if (key === "budget" || key === "clicks") {
        updated.cpa = updated.budget / updated.conversions;
        updated.roas = updated.revenue / updated.budget;
      }
      
      if (key === "impressions" || key === "clicks") {
        updated.ctr = (updated.clicks / updated.impressions) * 100;
      }
      
      if (key === "clicks" || key === "conversions") {
        updated.conversionRate = (updated.conversions / updated.clicks) * 100;
      }
      
      if (key === "conversions") {
        updated.revenue = updated.conversions * 50; // Assuming $50 per conversion
        updated.cpa = updated.budget / updated.conversions;
        updated.roas = updated.revenue / updated.budget;
      }
      
      return updated;
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-primary" />
          Agency Killer
        </h1>
        <p className="text-muted-foreground">
          Powerful AI tools to replace expensive agencies and consultants. Generate copy, SEO strategies, ad campaigns, and marketing funnels in minutes.
        </p>
      </div>

      <Tabs defaultValue="copy-generator" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="copy-generator" className="flex items-center">
            <PenTool className="h-4 w-4 mr-2" />
            AI Copy Generator
          </TabsTrigger>
          <TabsTrigger value="seo-toolkit" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            SEO Toolkit
          </TabsTrigger>
          <TabsTrigger value="ad-campaign" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Ad Campaign Builder
          </TabsTrigger>
          <TabsTrigger value="funnel-builder" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Marketing Funnel Builder
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance Simulator
          </TabsTrigger>
        </TabsList>
        
        {/* AI Copy Generator */}
        <TabsContent value="copy-generator" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenTool className="h-5 w-5 mr-2 text-primary" />
                AI Copy Generator
              </CardTitle>
              <CardDescription>
                Generate professional marketing copy for multiple platforms with just a few clicks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-description">What are you promoting?</Label>
                <Textarea 
                  id="product-description" 
                  placeholder="Describe your product, service, or offer in detail (e.g., 'Premium leather wallets with RFID protection')"
                  className="min-h-[100px]"
                  value={copyInput}
                  onChange={(e) => setCopyInput(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="copy-tone">Tone of Voice</Label>
                <Select value={copyTone} onValueChange={setCopyTone}>
                  <SelectTrigger id="copy-tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                    <SelectItem value="bold">Bold & Direct</SelectItem>
                    <SelectItem value="luxury">Luxury & Premium</SelectItem>
                    <SelectItem value="technical">Technical & Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateCopy} 
                className="w-full"
                disabled={isGenerating.copy}
              >
                {isGenerating.copy ? (
                  <>Generating Copy <span className="ml-2 animate-pulse">...</span></>
                ) : (
                  <>Generate Marketing Copy <BrainCircuit className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {copyContent && (
            <div className="space-y-6">
              {/* Email Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" /> 
                    Email Marketing Copy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Subject Line Options:</h4>
                    <div className="space-y-2">
                      {copyContent.emailSubjects.map((subject, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded-md bg-muted/30">
                          <p className="text-sm">{subject}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(subject)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Email Body:</h4>
                    <div className="p-4 border rounded-md bg-muted/30 relative">
                      <pre className="text-sm whitespace-pre-wrap">{copyContent.emailBody}</pre>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(copyContent.emailBody)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Landing Page Copy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" /> 
                    Landing Page Copy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md bg-muted/30 relative">
                    <pre className="text-sm whitespace-pre-wrap">{copyContent.landingPage}</pre>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(copyContent.landingPage)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Social Media Ad Copy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-primary" /> 
                    Social Media Ad Copy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {copyContent.socialAdCopy.map((ad, index) => (
                    <div key={index} className="p-4 border rounded-md bg-muted/30 relative space-y-2">
                      <h4 className="font-medium text-sm">Ad Option {index + 1}:</h4>
                      <p className="font-bold text-sm">{ad.headline}</p>
                      <p className="text-sm">{ad.body}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`${ad.headline}\n\n${ad.body}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Instagram Captions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" /> 
                    Instagram Caption Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {copyContent.instagramCaptions.map((caption, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded-md bg-muted/30">
                      <p className="text-sm">{caption}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(caption)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* SEO Toolkit */}
        <TabsContent value="seo-toolkit" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website Audit Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Website SEO Audit
                </CardTitle>
                <CardDescription>
                  Analyze any website for SEO improvements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="website-url" 
                      placeholder="https://example.com" 
                      value={seoUrl}
                      onChange={(e) => setSeoUrl(e.target.value)}
                    />
                    <Button 
                      onClick={generateSEOAudit}
                      disabled={isGenerating.seo}
                    >
                      {isGenerating.seo ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        "Audit"
                      )}
                    </Button>
                  </div>
                </div>
                
                {seoAudit && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">SEO Score</h4>
                        <Badge variant={seoAudit.score >= 80 ? "default" : seoAudit.score >= 60 ? "secondary" : "destructive"}>
                          {seoAudit.score}/100
                        </Badge>
                      </div>
                      <Progress value={seoAudit.score} className="h-2" />
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="title-tags">
                        <AccordionTrigger className="text-sm font-medium">
                          Suggested Title Tags
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {seoAudit.titleTags.map((tag, index) => (
                              <div key={index} className="flex justify-between items-center p-2 border rounded-md bg-muted/30">
                                <p className="text-xs">{tag}</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => copyToClipboard(tag)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="meta-descriptions">
                        <AccordionTrigger className="text-sm font-medium">
                          Meta Descriptions
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {seoAudit.metaDescriptions.map((desc, index) => (
                              <div key={index} className="flex justify-between items-center p-2 border rounded-md bg-muted/30">
                                <p className="text-xs">{desc}</p>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => copyToClipboard(desc)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="keywords">
                        <AccordionTrigger className="text-sm font-medium">
                          Recommended Keywords
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2">
                            {seoAudit.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => copyToClipboard(keyword)}>
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="technical-checks">
                        <AccordionTrigger className="text-sm font-medium">
                          Technical SEO Checks
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {seoAudit.checks.map((check, index) => (
                              <div key={index} className="flex items-start p-2 border rounded-md bg-muted/30">
                                <div className={`p-1 rounded-full ${check.passed ? 'bg-green-100' : 'bg-red-100'} mr-2 mt-0.5`}>
                                  {check.passed ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-medium">{check.name}</p>
                                  <p className="text-xs text-muted-foreground">{check.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <Button variant="outline" className="w-full">
                      <FileDown className="h-4 w-4 mr-2" />
                      Export Full SEO Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Keyword Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Keyword Generator
                </CardTitle>
                <CardDescription>
                  Discover top SEO keywords for your industry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Your Industry</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="industry" 
                      placeholder="e.g., fitness, software, fashion" 
                      value={seoIndustry}
                      onChange={(e) => setSeoIndustry(e.target.value)}
                    />
                    <Button onClick={generateKeywords}>
                      Generate
                    </Button>
                  </div>
                </div>
                
                {keywordResults.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h4 className="font-medium text-sm">Top 10 SEO Keywords:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {keywordResults.map((keyword, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 border rounded-md bg-muted/30"
                        >
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-muted-foreground mr-2">{index + 1}.</span>
                            <p className="text-xs">{keyword}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(keyword)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Alert>
                      <div className="flex items-start">
                        <BrainCircuit className="h-4 w-4 mt-0.5 mr-2 text-primary" />
                        <div>
                          <AlertTitle className="text-xs">Pro Tip</AlertTitle>
                          <AlertDescription className="text-xs">
                            Use these keywords in your page titles, meta descriptions, headers, and naturally throughout your content.
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Ad Campaign Builder */}
        <TabsContent value="ad-campaign" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Ad Campaign Builder
              </CardTitle>
              <CardDescription>
                Generate comprehensive ad campaign strategies and creative briefs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product or Offer Name</Label>
                <Input 
                  id="product-name" 
                  placeholder="e.g., Premium Skincare Bundle, Business Consulting Services" 
                  value={adProduct}
                  onChange={(e) => setAdProduct(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={generateAdCampaign} 
                className="w-full"
                disabled={isGenerating.ad}
              >
                {isGenerating.ad ? (
                  <>Generating Campaign <span className="ml-2 animate-pulse">...</span></>
                ) : (
                  <>Generate Ad Campaign <BrainCircuit className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {adCampaign && (
            <div className="space-y-6">
              {/* Target Audience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" /> 
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md bg-muted/30 relative">
                    <p className="text-sm">{adCampaign.audience}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(adCampaign.audience)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommended Platforms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" /> 
                    Recommended Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {adCampaign.platforms.map((platform, index) => (
                      <div key={index} className="p-3 border rounded-md bg-muted/30">
                        <div className="flex flex-wrap justify-between">
                          <h4 className="font-medium text-sm">{platform.name}</h4>
                          <Badge variant="outline" className="ml-auto">Recommended</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{platform.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Ad Creative */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" /> 
                    Ad Creative
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Headline Options:</h4>
                    <div className="space-y-2">
                      {adCampaign.headlines.map((headline, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded-md bg-muted/30">
                          <p className="text-sm">{headline}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(headline)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Ad Copy Options:</h4>
                    <div className="space-y-2">
                      {adCampaign.adCopy.map((copy, index) => (
                        <div key={index} className="p-3 border rounded-md bg-muted/30 relative">
                          <p className="text-sm pr-8">{copy}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(copy)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Call-to-Action Options:</h4>
                    <div className="flex flex-wrap gap-2">
                      {adCampaign.ctas.map((cta, index) => (
                        <Badge 
                          key={index} 
                          className="cursor-pointer" 
                          onClick={() => copyToClipboard(cta)}
                        >
                          {cta}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export Campaign Brief
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Marketing Funnel Builder */}
        <TabsContent value="funnel-builder" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-primary" />
                Marketing Funnel Builder
              </CardTitle>
              <CardDescription>
                Create custom marketing funnels for different business goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="funnel-goal">Funnel Goal</Label>
                <Select value={funnelGoal} onValueChange={setFunnelGoal}>
                  <SelectTrigger id="funnel-goal">
                    <SelectValue placeholder="Select funnel goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead_generation">Lead Generation</SelectItem>
                    <SelectItem value="email_capture">Email List Building</SelectItem>
                    <SelectItem value="product_launch">Product Launch</SelectItem>
                    <SelectItem value="sales">Direct Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={generateFunnel} 
                className="w-full"
                disabled={isGenerating.funnel}
              >
                {isGenerating.funnel ? (
                  <>Generating Funnel <span className="ml-2 animate-pulse">...</span></>
                ) : (
                  <>Generate Marketing Funnel <BrainCircuit className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {funnel && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {funnel.steps.map((step, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">Step {index + 1}</Badge>
                        {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="elements">
                          <AccordionTrigger className="text-sm py-2">
                            Key Elements
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {step.elements.map((element, elementIndex) => (
                                <li key={elementIndex} className="text-xs flex">
                                  <div className="mr-2 mt-0.5">
                                    <Check className="h-3 w-3 text-primary" />
                                  </div>
                                  {element}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tips">
                          <AccordionTrigger className="text-sm py-2">
                            Pro Tips
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-xs flex">
                                  <div className="mr-2 mt-0.5">
                                    <Zap className="h-3 w-3 text-amber-500" />
                                  </div>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-primary" /> 
                    Implementation Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertTitle>Best Practices for Your {funnelGoal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Funnel</AlertTitle>
                    <AlertDescription className="text-sm space-y-2 mt-2">
                      <p>
                        {funnelGoal === "lead_generation" 
                          ? "Focus on collecting qualified leads rather than maximizing volume. Make sure your landing page clearly communicates the value proposition." 
                          : funnelGoal === "email_capture"
                            ? "Offer valuable content in exchange for email addresses. Keep the form simple with minimal fields to maximize conversion rate."
                            : funnelGoal === "product_launch"
                              ? "Build anticipation with teasers and early access offers. Create urgency with limited time or quantity promotions for the launch."
                              : "Focus on reducing friction in the purchase process. Use trust signals and social proof throughout to increase conversion rate."}
                      </p>
                      <p>
                        Test different variations of each element to optimize performance. Track key metrics at each stage to identify bottlenecks.
                      </p>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-md">
                      <h4 className="text-sm font-medium flex items-center">
                        <LineChart className="h-4 w-4 mr-2 text-primary" />
                        Tracking & Analytics
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set up tracking for each step of the funnel to identify potential bottlenecks. Key metrics include traffic, page views, conversion rate, and drop-off rate between stages.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <h4 className="text-sm font-medium flex items-center">
                        <Target className="h-4 w-4 mr-2 text-primary" />
                        Testing Strategy
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Implement A/B testing at each stage to optimize performance. Test one element at a time (headlines, images, CTAs) to accurately measure the impact of changes.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <h4 className="text-sm font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-primary" />
                        Optimization Tips
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Focus on improving the weakest step in your funnel first. Small improvements early in the funnel can have a significant impact on overall results.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export Funnel Strategy
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Performance Simulator */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Campaign Performance Simulator
              </CardTitle>
              <CardDescription>
                Estimate campaign performance metrics based on different variables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="budget-slider">Monthly Budget</Label>
                      <span className="text-sm font-medium">{formatCurrency(performanceMetrics.budget)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="budget-slider"
                        min={500}
                        max={10000}
                        step={100}
                        value={[performanceMetrics.budget]}
                        onValueChange={(values) => updatePerformanceMetrics('budget', values[0])}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="impressions-slider">Estimated Impressions</Label>
                      <span className="text-sm font-medium">{performanceMetrics.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="impressions-slider"
                        min={1000}
                        max={500000}
                        step={1000}
                        value={[performanceMetrics.impressions]}
                        onValueChange={(values) => updatePerformanceMetrics('impressions', values[0])}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="clicks-slider">Expected Clicks</Label>
                      <span className="text-sm font-medium">{performanceMetrics.clicks.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="clicks-slider"
                        min={0}
                        max={10000}
                        step={10}
                        value={[performanceMetrics.clicks]}
                        onValueChange={(values) => updatePerformanceMetrics('clicks', values[0])}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="conversions-slider">Expected Conversions</Label>
                      <span className="text-sm font-medium">{performanceMetrics.conversions}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="conversions-slider"
                        min={0}
                        max={500}
                        step={1}
                        value={[performanceMetrics.conversions]}
                        onValueChange={(values) => updatePerformanceMetrics('conversions', values[0])}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Performance Metrics</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-muted/40">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Click-Through Rate</span>
                            <span className="text-2xl font-bold">{formatPercentage(performanceMetrics.ctr)}</span>
                            <span className="text-xs text-muted-foreground mt-1">Industry avg: 2.00%</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/40">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Conversion Rate</span>
                            <span className="text-2xl font-bold">{formatPercentage(performanceMetrics.conversionRate)}</span>
                            <span className="text-xs text-muted-foreground mt-1">Industry avg: 3.00%</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/40">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Cost Per Acquisition</span>
                            <span className="text-2xl font-bold">{formatCurrency(performanceMetrics.cpa)}</span>
                            <span className="text-xs text-muted-foreground mt-1">Target: {formatCurrency(50)}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/40">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Return On Ad Spend</span>
                            <span className="text-2xl font-bold">{performanceMetrics.roas.toFixed(2)}x</span>
                            <span className="text-xs text-muted-foreground mt-1">Target: 3.00x</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Estimated Revenue</span>
                            <span className="text-xl font-bold">{formatCurrency(performanceMetrics.revenue)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Total Cost</span>
                            <span className="text-xl font-medium text-muted-foreground">{formatCurrency(performanceMetrics.budget)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Estimated Profit</span>
                            <span className={`text-xl font-bold ${performanceMetrics.revenue - performanceMetrics.budget > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(performanceMetrics.revenue - performanceMetrics.budget)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={simulatePerformance}
                className="w-full"
                variant="default"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Run AI Simulation
              </Button>
              
              {/* Performance Insights */}
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Campaign Insights</h3>
                
                <Alert variant={performanceMetrics.roas >= 2 ? "default" : "destructive"}>
                  <AlertTitle>
                    {performanceMetrics.roas >= 3 
                      ? "Excellent Campaign Potential" 
                      : performanceMetrics.roas >= 2 
                        ? "Good Campaign Potential" 
                        : "Campaign Needs Optimization"}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {performanceMetrics.roas >= 3 
                      ? "This campaign has excellent potential for profitability. Consider scaling your budget to maximize results." 
                      : performanceMetrics.roas >= 2 
                        ? "This campaign shows good return on investment. Look for opportunities to optimize conversion rate or reduce CPA further." 
                        : "This campaign needs optimization before scaling. Focus on improving your conversion rate and reducing your cost per acquisition."}
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 border rounded-md">
                    <h4 className="text-sm font-medium">Optimization Suggestions</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc pl-4">
                      {performanceMetrics.ctr < 1.5 && (
                        <li>Improve ad creative to increase CTR</li>
                      )}
                      {performanceMetrics.conversionRate < 3 && (
                        <li>Optimize landing page for better conversions</li>
                      )}
                      {performanceMetrics.cpa > 30 && (
                        <li>Refine targeting to reduce cost per acquisition</li>
                      )}
                      {performanceMetrics.roas < 2 && (
                        <li>Review offer pricing or value proposition</li>
                      )}
                      <li>Test different ad formats across platforms</li>
                      <li>Implement retargeting to capture lost conversions</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <h4 className="text-sm font-medium">Budget Recommendations</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc pl-4">
                      {performanceMetrics.roas >= 3 ? (
                        <>
                          <li>Consider increasing budget by 25-50%</li>
                          <li>Expand to additional marketing channels</li>
                          <li>Test new audience segments</li>
                        </>
                      ) : performanceMetrics.roas >= 2 ? (
                        <>
                          <li>Maintain current budget level</li>
                          <li>Optimize underperforming ads</li>
                          <li>Test small budget increases (10-15%)</li>
                        </>
                      ) : (
                        <>
                          <li>Reduce budget until metrics improve</li>
                          <li>Focus on highest performing segments</li>
                          <li>Test budget reallocation between platforms</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="p-3 border rounded-md">
                    <h4 className="text-sm font-medium">Next Steps</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc pl-4">
                      <li>Create campaign in your ad platforms of choice</li>
                      <li>Set up proper tracking and conversion goals</li>
                      <li>Implement A/B testing from the start</li>
                      <li>Review performance after 7-14 days</li>
                      <li>Make data-driven adjustments based on results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="h-4 w-4 mr-2" />
                Export Performance Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}