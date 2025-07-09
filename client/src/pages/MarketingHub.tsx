import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Activity,
  AlertTriangle, 
  ArrowUp, 
  Coins, 
  ClipboardList,
  Lightbulb, 
  RefreshCw,
  Sliders,
  Webhook,
  XCircle,
  Zap 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoMode } from '@/contexts/DemoModeContext';
import {
  Search,
  PlusCircle,
  Target,
  Mail,
  MessageSquare,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  Bell,
  Copy,
  ExternalLink,
  Share2,
  Globe,
  Eye,
  MousePointer,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Twitter,
  Instagram,
  Facebook,
  BarChart,
  PieChart,
  Link,
  LineChart,
  Smartphone,
  Database,
  MoveUpRight,
  Settings,
  Linkedin
} from 'lucide-react';

// Import platform-specific icons
import { 
  SiFacebook, 
  SiTiktok, 
  SiGoogleads, 
  SiMailchimp, 
  SiHubspot
} from 'react-icons/si';

// Create custom components for missing icons
const SiKlaviyo: React.FC<{ className?: string }> = ({ className }) => <Mail className={className || "h-4 w-4"} />;
const SiConstantcontact: React.FC<{ className?: string }> = ({ className }) => <Mail className={className || "h-4 w-4"} />;
const SiLinkedin: React.FC<{ className?: string }> = ({ className }) => <Mail className={className || "h-4 w-4 text-blue-700"} />;

// Helper functions for ad campaigns
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getStatusColor = (status: AdCampaign['status']): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'paused':
      return 'bg-yellow-100 text-yellow-700';
    case 'completed':
      return 'bg-blue-100 text-blue-700';
    case 'draft':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getPlatformIcon = (platform: AdCampaign['platform']) => {
  switch (platform) {
    case 'facebook':
      return <SiFacebook className="h-4 w-4 text-blue-600" />;
    case 'instagram':
      return <SiFacebook className="h-4 w-4 text-pink-500" />;
    case 'google':
      return <SiGoogleads className="h-4 w-4 text-red-500" />;
    case 'tiktok':
      return <SiTiktok className="h-4 w-4" />;
    case 'linkedin':
      return <SiLinkedin className="h-4 w-4 text-blue-700" />;
    case 'twitter':
      return <Twitter className="h-4 w-4 text-blue-400" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
};

// Types
interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'archived';
  scheduledFor?: string;
  sentAt?: string;
  type: 'promotional' | 'newsletter' | 'abandoned_cart' | 'welcome' | 'other';
  platform: 'klaviyo' | 'mailchimp' | 'hubspot' | 'constant_contact' | 'custom';
  metrics?: {
    recipients: number;
    opens: number;
    openRate: number;
    clicks: number;
    clickRate: number;
    conversions?: number;
    conversionRate?: number;
    revenue?: number;
  };
  abTest?: boolean;
  lastEdited: string;
  entityId?: number;
  entityName?: string;
  tags?: string[];
}

interface SmsTemplate {
  id: number;
  name: string;
  content: string;
  status: 'active' | 'inactive' | 'draft';
  platform: 'klaviyo' | 'twilio' | 'custom';
  metrics?: {
    sends: number;
    deliveryRate: number;
    responses: number;
    conversions?: number;
    conversionRate?: number;
  };
  createdAt: string;
  updatedAt: string;
  entityId?: number;
  entityName?: string;
}

interface SeoKeyword {
  id: number;
  keyword: string;
  position: number;
  previousPosition: number;
  change: number;
  volume: number;
  difficulty: number;
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  url?: string;
  ctr?: number;
  impressions?: number;
  priority: 'high' | 'medium' | 'low';
  lastUpdated: string;
  entityId?: number;
  entityName?: string;
}

interface AdCampaign {
  id: number;
  name: string;
  platform: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'linkedin' | 'twitter';
  status: 'active' | 'paused' | 'completed' | 'draft' | 'scheduled';
  startDate: string;
  endDate?: string;
  budget: number;
  budgetSpent: number;
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversions?: number;
    conversionRate?: number;
    revenue?: number;
    roas?: number;
  };
  lastUpdated: string;
  entityId?: number;
  entityName?: string;
}

interface MarketingOptimization {
  summary: string;
  optimizations: {
    campaignId: number;
    campaignName: string;
    suggestion: string;
    reasoning: string;
    expectedImpact: string;
    priority: 'high' | 'medium' | 'low';
    implementationComplexity: 'easy' | 'moderate' | 'complex';
  }[];
  budgetReallocation?: {
    campaignId: number;
    campaignName: string;
    currentBudget: number;
    suggestedBudget: number;
    reasoning: string;
  }[];
  creativeRecommendations?: {
    platform: string;
    recommendation: string;
    bestPractices: string[];
  }[];
}

// Campaign list item component
const CampaignItem: React.FC<{ campaign: EmailCampaign }> = ({ campaign }) => {
  const getStatusBadge = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      case 'sent':
        return <Badge className="bg-green-500">Sent</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
    }
  };
  
  const getPlatformIcon = (platform: EmailCampaign['platform']) => {
    switch (platform) {
      case 'klaviyo':
        return <SiKlaviyo className="h-4 w-4" />;
      case 'mailchimp':
        return <SiMailchimp className="h-4 w-4" />;
      case 'hubspot':
        return <SiHubspot className="h-4 w-4" />;
      case 'constant_contact':
        return <SiConstantcontact className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col space-y-2 p-4 rounded-md border hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-2">
          <div className="mt-0.5">
            {getPlatformIcon(campaign.platform)}
          </div>
          <div>
            <h4 className="font-medium">{campaign.name}</h4>
            <p className="text-xs text-muted-foreground">{campaign.subject}</p>
          </div>
        </div>
        {getStatusBadge(campaign.status)}
      </div>
      
      {campaign.status === 'sent' && campaign.metrics && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
          <div className="flex flex-col p-2 bg-muted/50 rounded-md">
            <span className="text-muted-foreground">Opens</span>
            <span className="font-medium">{campaign.metrics.openRate.toFixed(1)}%</span>
            <span className="text-muted-foreground text-[10px]">{campaign.metrics.opens} of {campaign.metrics.recipients}</span>
          </div>
          <div className="flex flex-col p-2 bg-muted/50 rounded-md">
            <span className="text-muted-foreground">Clicks</span>
            <span className="font-medium">{campaign.metrics.clickRate.toFixed(1)}%</span>
            <span className="text-muted-foreground text-[10px]">{campaign.metrics.clicks} clicks</span>
          </div>
          <div className="flex flex-col p-2 bg-muted/50 rounded-md">
            <span className="text-muted-foreground">Revenue</span>
            <span className="font-medium">${campaign.metrics.revenue?.toFixed(0) || '0'}</span>
            <span className="text-muted-foreground text-[10px]">{campaign.metrics.conversions || 0} orders</span>
          </div>
        </div>
      )}
      
      {campaign.status === 'scheduled' && campaign.scheduledFor && (
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Scheduled for {formatDate(campaign.scheduledFor)} at {formatTime(campaign.scheduledFor)}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
        <span>
          {campaign.entityName && `${campaign.entityName} • `}
          Last edited {new Date(campaign.lastEdited).toLocaleDateString()}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

// SMS Template Item
const SmsTemplateItem: React.FC<{ template: SmsTemplate }> = ({ template }) => {
  return (
    <div className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{template.name}</h4>
          <Badge variant={template.status === 'active' ? 'default' : template.status === 'draft' ? 'outline' : 'secondary'} className="mt-1">
            {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
          </Badge>
        </div>
        <div className="bg-muted p-2 rounded-full">
          <Smartphone className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-muted rounded-md text-sm">
        <p className="line-clamp-3">{template.content}</p>
      </div>
      
      {template.metrics && (
        <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
          <div className="flex flex-col p-1.5 border rounded-md">
            <span className="text-muted-foreground">Sends</span>
            <span className="font-medium">{template.metrics.sends}</span>
          </div>
          <div className="flex flex-col p-1.5 border rounded-md">
            <span className="text-muted-foreground">Delivery Rate</span>
            <span className="font-medium">{template.metrics.deliveryRate}%</span>
          </div>
          <div className="flex flex-col p-1.5 border rounded-md">
            <span className="text-muted-foreground">Responses</span>
            <span className="font-medium">{template.metrics.responses}</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
        <span>{template.platform.charAt(0).toUpperCase() + template.platform.slice(1)}</span>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <ExternalLink className="h-3 w-3 mr-1" />
          View
        </Button>
      </div>
    </div>
  );
};

// SEO Keyword Row
const KeywordRow: React.FC<{ keyword: SeoKeyword }> = ({ keyword }) => {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{keyword.keyword}</div>
        {keyword.url && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Link className="h-3 w-3 mr-1" />
            <span className="truncate max-w-[200px]">{keyword.url.replace(/^https?:\/\//, '')}</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className="font-medium text-lg">{keyword.position}</span>
          <div className="ml-2">
            {keyword.change > 0 ? (
              <div className="flex items-center text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-xs">+{keyword.change}</span>
              </div>
            ) : keyword.change < 0 ? (
              <div className="flex items-center text-red-500">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-xs">{keyword.change}</span>
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
                <span className="text-xs">0</span>
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {keyword.volume.toLocaleString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <div className="w-full max-w-[60px]">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-2 ${keyword.difficulty < 30 ? 'bg-green-500' : keyword.difficulty < 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                style={{ width: `${keyword.difficulty}%` }}
              />
            </div>
          </div>
          <span>{keyword.difficulty}/100</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={keyword.priority === 'high' ? 'default' : keyword.priority === 'medium' ? 'outline' : 'secondary'}>
          {keyword.priority.charAt(0).toUpperCase() + keyword.priority.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};

// Campaign Optimizer Component
const CampaignOptimizer: React.FC<{ campaigns: AdCampaign[] }> = ({ campaigns }) => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<MarketingOptimization | null>(null);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([]);
  
  const optimizationMutation = useMutation({
    mutationFn: async (data: { campaignIds: number[] }) => {
      const res = await apiRequest("POST", "/api/marketing/optimize-campaigns", data);
      return res.json();
    },
    onSuccess: (data: MarketingOptimization) => {
      setOptimization(data);
      toast({
        title: "Optimization Complete",
        description: "AI-powered marketing campaign optimization suggestions are ready.",
        variant: "default",
      });
      setIsOptimizing(false);
    },
    onError: (error) => {
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to generate optimization suggestions.",
        variant: "destructive",
      });
      setIsOptimizing(false);
    }
  });
  
  const handleOptimize = () => {
    if (selectedCampaignIds.length === 0) {
      toast({
        title: "Select Campaigns",
        description: "Please select at least one campaign to optimize.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizing(true);
    optimizationMutation.mutate({ campaignIds: selectedCampaignIds });
  };
  
  const toggleCampaignSelection = (id: number) => {
    setSelectedCampaignIds(prev => 
      prev.includes(id) 
        ? prev.filter(campaignId => campaignId !== id) 
        : [...prev, id]
    );
  };
  
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
    }
  };
  
  const getComplexityBadge = (complexity: 'easy' | 'moderate' | 'complex') => {
    switch (complexity) {
      case 'easy':
        return <Badge variant="outline" className="border-green-500 text-green-500">Easy</Badge>;
      case 'moderate':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Moderate</Badge>;
      case 'complex':
        return <Badge variant="outline" className="border-red-500 text-red-500">Complex</Badge>;
    }
  };
  
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Campaign Optimizer</CardTitle>
            <CardDescription>AI-powered marketing campaign optimization</CardDescription>
          </div>
          <Button 
            onClick={handleOptimize} 
            disabled={isOptimizing}
            className="gap-2"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Optimize Campaigns
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!optimization ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {campaigns.slice(0, 6).map((campaign) => (
                <div 
                  key={campaign.id} 
                  className={`
                    p-3 rounded-md border flex items-center gap-3 cursor-pointer
                    ${selectedCampaignIds.includes(campaign.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
                  `}
                  onClick={() => toggleCampaignSelection(campaign.id)}
                >
                  <div className={`p-1.5 rounded-full ${getStatusColor(campaign.status)}`}>
                    {getPlatformIcon(campaign.platform)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <span>{formatCurrency(campaign.budget)}</span>
                      <span>•</span>
                      <span>{campaign.metrics.impressions.toLocaleString()} impressions</span>
                    </div>
                  </div>
                  <Checkbox 
                    checked={selectedCampaignIds.includes(campaign.id)}
                    onCheckedChange={() => toggleCampaignSelection(campaign.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center pt-2">
              <Lightbulb className="h-4 w-4 inline-block mr-1" />
              Select campaigns and click "Optimize Campaigns" to get AI-powered recommendations
            </p>
          </>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Optimization Summary</h3>
              <p className="text-sm text-muted-foreground">{optimization.summary}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Campaign Optimizations</h3>
              <div className="space-y-3">
                {optimization.optimizations.map((opt, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{opt.campaignName}</h4>
                      <div className="flex gap-2">
                        {getPriorityBadge(opt.priority)}
                        {getComplexityBadge(opt.implementationComplexity)}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{opt.suggestion}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="p-2 bg-muted/50 rounded-md">
                        <span className="font-medium block mb-1">Reasoning:</span>
                        <span className="text-muted-foreground">{opt.reasoning}</span>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-md">
                        <span className="font-medium block mb-1">Expected Impact:</span>
                        <span className="text-muted-foreground">{opt.expectedImpact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {optimization.budgetReallocation && optimization.budgetReallocation.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Budget Reallocation Suggestions</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Current Budget</TableHead>
                      <TableHead>Suggested Budget</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Reasoning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {optimization.budgetReallocation.map((realloc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{realloc.campaignName}</TableCell>
                        <TableCell>{formatCurrency(realloc.currentBudget)}</TableCell>
                        <TableCell>{formatCurrency(realloc.suggestedBudget)}</TableCell>
                        <TableCell>
                          <div className={`flex items-center ${realloc.suggestedBudget > realloc.currentBudget ? 'text-green-500' : 'text-red-500'}`}>
                            {realloc.suggestedBudget > realloc.currentBudget ? (
                              <ArrowUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {formatCurrency(Math.abs(realloc.suggestedBudget - realloc.currentBudget))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{realloc.reasoning}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {optimization.creativeRecommendations && optimization.creativeRecommendations.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Creative Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optimization.creativeRecommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                          {rec.platform} Creative Best Practices
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{rec.recommendation}</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {rec.bestPractices.map((practice, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500 mt-0.5" />
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setOptimization(null);
                  setSelectedCampaignIds([]);
                }}
              >
                Start New Optimization
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Ad Campaign Card
const AdCampaignCard: React.FC<{ campaign: AdCampaign }> = ({ campaign }) => {
  const getPlatformIcon = (platform: AdCampaign['platform']) => {
    switch (platform) {
      case 'facebook':
        return <SiFacebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'google':
        return <SiGoogleads className="h-4 w-4" />;
      case 'tiktok':
        return <SiTiktok className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: AdCampaign['status']) => {
    switch (status) {
      case 'active':
        return "bg-green-500";
      case 'paused':
        return "bg-yellow-500";
      case 'completed':
        return "bg-blue-500";
      case 'draft':
        return "bg-muted";
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-full ${getStatusColor(campaign.status)}`}>
              {getPlatformIcon(campaign.platform)}
            </div>
            <div>
              <CardTitle className="text-base">{campaign.name}</CardTitle>
              <CardDescription className="text-xs">
                {formatDate(campaign.startDate)} - {campaign.endDate ? formatDate(campaign.endDate) : 'Ongoing'}
              </CardDescription>
            </div>
          </div>
          <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'draft' ? 'outline' : 'secondary'}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Budget Spent</span>
            <div className="flex items-center">
              <span className="font-medium">{formatCurrency(campaign.budgetSpent)}</span>
              <span className="text-xs text-muted-foreground ml-1">/ {formatCurrency(campaign.budget)}</span>
            </div>
          </div>
          <Progress value={(campaign.budgetSpent / campaign.budget) * 100} className="h-2" />
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-0.5">
              <div className="flex items-center text-xs text-muted-foreground">
                <MousePointer className="h-3 w-3 mr-1" />
                <span>CTR</span>
              </div>
              <div className="font-medium">{formatPercentage(campaign.metrics.ctr)}</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center text-xs text-muted-foreground">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>CPC</span>
              </div>
              <div className="font-medium">${campaign.metrics.cpc.toFixed(2)}</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center text-xs text-muted-foreground">
                <Eye className="h-3 w-3 mr-1" />
                <span>Impressions</span>
              </div>
              <div className="font-medium">{campaign.metrics.impressions.toLocaleString()}</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>Clicks</span>
              </div>
              <div className="font-medium">{campaign.metrics.clicks.toLocaleString()}</div>
            </div>
          </div>
          
          {campaign.metrics.roas !== undefined && (
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-border">
              <span className="text-sm text-muted-foreground">ROAS</span>
              <span className={`font-bold ${campaign.metrics.roas >= 2 ? 'text-green-500' : campaign.metrics.roas > 1 ? 'text-yellow-500' : 'text-red-500'}`}>
                {campaign.metrics.roas.toFixed(1)}x
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(campaign.lastUpdated).toLocaleDateString()}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

// Email Platform Integration Card
const PlatformIntegrationCard: React.FC<{ 
  title: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSynced?: string;
  metrics?: { 
    subscribers: number;
    campaigns: number;
    avgOpenRate: number;
  };
}> = ({ title, description, icon, connected, lastSynced, metrics }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-muted rounded-md">
              {icon}
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          <Badge variant={connected ? "default" : "outline"}>
            {connected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {connected && metrics ? (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col p-2 rounded-md bg-muted/50">
              <span className="text-xs text-muted-foreground">Subscribers</span>
              <span className="font-semibold">{metrics.subscribers.toLocaleString()}</span>
            </div>
            <div className="flex flex-col p-2 rounded-md bg-muted/50">
              <span className="text-xs text-muted-foreground">Campaigns</span>
              <span className="font-semibold">{metrics.campaigns}</span>
            </div>
            <div className="flex flex-col p-2 rounded-md bg-muted/50">
              <span className="text-xs text-muted-foreground">Avg. Open Rate</span>
              <span className="font-semibold">{metrics.avgOpenRate}%</span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">Connect to view data and send campaigns</p>
            <Button variant="default" size="sm">
              Connect {title}
            </Button>
          </div>
        )}
      </CardContent>
      {connected && lastSynced && (
        <CardFooter className="border-t text-xs text-muted-foreground pt-2">
          <div className="flex justify-between w-full">
            <span>Last synced: {new Date(lastSynced).toLocaleString()}</span>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              View Dashboard
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Marketing Performance Summary Card
const MarketingPerformanceSummary: React.FC<{
  emailStats: {
    campaigns: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    revenue: number;
  };
  adStats: {
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    revenue: number;
    roas: number;
  };
  seoStats: {
    organicTraffic: number;
    avgPosition: number;
    keywordsRanked: number;
    conversionRate: number;
    revenue: number;
  };
}> = ({ emailStats, adStats, seoStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Marketing Performance</CardTitle>
        <CardDescription>30-day summary across all channels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center">
            <Mail className="h-4 w-4 mr-1.5" />
            Email Marketing
          </h3>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Campaigns</p>
              <p className="text-2xl font-bold">{emailStats.campaigns}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Open Rate</p>
              <p className="text-2xl font-bold">{emailStats.openRate}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Conv. Rate</p>
              <p className="text-2xl font-bold">{emailStats.conversionRate}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">${emailStats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center">
            <Target className="h-4 w-4 mr-1.5" />
            Paid Advertising
          </h3>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ad Spend</p>
              <p className="text-2xl font-bold">${adStats.spend.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Clicks</p>
              <p className="text-2xl font-bold">{adStats.clicks.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="text-2xl font-bold">{adStats.conversions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ROAS</p>
              <p className={`text-2xl font-bold ${adStats.roas >= 2 ? 'text-green-500' : adStats.roas > 1 ? 'text-yellow-500' : 'text-red-500'}`}>
                {adStats.roas.toFixed(1)}x
              </p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center">
            <Globe className="h-4 w-4 mr-1.5" />
            SEO Performance
          </h3>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Organic Traffic</p>
              <p className="text-2xl font-bold">{seoStats.organicTraffic.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg. Position</p>
              <p className="text-2xl font-bold">{seoStats.avgPosition.toFixed(1)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Keywords</p>
              <p className="text-2xl font-bold">{seoStats.keywordsRanked}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">${seoStats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Marketing Hub Component
export default function MarketingHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaignType, setCampaignType] = useState('all');
  const [seoKeywordFilter, setSeoKeywordFilter] = useState('all');
  const [adPlatformFilter, setAdPlatformFilter] = useState('all');
  const { demoMode } = useDemoMode();
  
  // Fetch data from API
  const { data: emailCampaignsData, isLoading: isLoadingEmailCampaigns } = useQuery({
    queryKey: ['/api/email-campaigns', campaignType],
    queryFn: () => apiRequest(`/api/email-campaigns?type=${campaignType}`),
    enabled: activeTab === 'campaigns' || activeTab === 'overview'
  });
  
  const { data: smsTemplatesData, isLoading: isLoadingSmsTemplates } = useQuery({
    queryKey: ['/api/sms-templates'],
    queryFn: () => apiRequest('/api/sms-templates'),
    enabled: activeTab === 'campaigns'
  });
  
  const { data: seoKeywordsData, isLoading: isLoadingSeoKeywords } = useQuery({
    queryKey: ['/api/seo-keywords', seoKeywordFilter],
    queryFn: () => apiRequest(`/api/seo-keywords?filter=${seoKeywordFilter}`),
    enabled: activeTab === 'seo' || activeTab === 'overview'
  });
  
  const { data: adCampaignsData, isLoading: isLoadingAdCampaigns } = useQuery({
    queryKey: ['/api/ad-campaigns', adPlatformFilter],
    queryFn: () => apiRequest(`/api/ad-campaigns?platform=${adPlatformFilter}`),
    enabled: activeTab === 'ads' || activeTab === 'overview'
  });
  
  const { data: marketingPerformanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['/api/marketing-performance'],
    queryFn: () => apiRequest('/api/marketing-performance'),
    enabled: activeTab === 'overview'
  });

  // Default demo data
  const defaultEmailCampaigns: EmailCampaign[] = demoMode ? [
    {
      id: 1,
      name: "Spring Collection Launch",
      subject: "Introducing Our Spring Collection - Shop Now!",
      status: "sent",
      sentAt: "2025-03-15T09:00:00Z",
      type: "promotional",
      platform: "klaviyo",
      metrics: {
        recipients: 15420,
        opens: 5397,
        openRate: 35.0,
        clicks: 1080,
        clickRate: 7.0,
        conversions: 216,
        conversionRate: 1.4,
        revenue: 10800
      },
      abTest: false,
      lastEdited: "2025-03-14T16:30:00Z",
      entityName: "Digital Merch Pros",
      tags: ["promotion", "seasonal"]
    },
    {
      id: 2,
      name: "Weekly Newsletter - Issue #23",
      subject: "The Latest Trends & Style Tips from Digital Merch Pros",
      status: "sent",
      sentAt: "2025-03-10T10:30:00Z",
      type: "newsletter",
      platform: "klaviyo",
      metrics: {
        recipients: 14870,
        opens: 4758,
        openRate: 32.0,
        clicks: 832,
        clickRate: 5.6,
        conversions: 104,
        conversionRate: 0.7,
        revenue: 5200
      },
      abTest: false,
      lastEdited: "2025-03-09T17:45:00Z",
      entityName: "Digital Merch Pros",
      tags: ["newsletter", "weekly"]
    },
    {
      id: 3,
      name: "Abandoned Cart Recovery",
      subject: "Hey {{first_name}}, you left something behind!",
      status: "scheduled",
      scheduledFor: "2025-03-25T08:00:00Z",
      type: "abandoned_cart",
      platform: "klaviyo",
      abTest: true,
      lastEdited: "2025-03-20T14:10:00Z",
      entityName: "Digital Merch Pros",
      tags: ["automated", "cart-recovery"]
    },
    {
      id: 4,
      name: "Mystery Box Announcement",
      subject: "Introducing Mystery Hype Boxes - Limited Time Offer!",
      status: "draft",
      type: "promotional",
      platform: "mailchimp",
      abTest: false,
      lastEdited: "2025-03-18T11:20:00Z",
      entityName: "Mystery Hype",
      tags: ["promotion", "product-launch"]
    },
    {
      id: 5,
      name: "Customer Feedback Survey",
      subject: "We value your opinion - Take our 2-minute survey",
      status: "sent",
      sentAt: "2025-03-05T11:00:00Z",
      type: "other",
      platform: "klaviyo",
      metrics: {
        recipients: 12500,
        opens: 3750,
        openRate: 30.0,
        clicks: 625,
        clickRate: 5.0
      },
      abTest: false,
      lastEdited: "2025-03-04T16:30:00Z",
      entityName: "Digital Merch Pros",
      tags: ["survey", "feedback"]
    }
  ] : [];

  const defaultSmsTemplates: SmsTemplate[] = demoMode ? [
    {
      id: 1,
      name: "Order Confirmation",
      content: "Thank you for your order with {{company_name}}! Your order #{{order_number}} has been confirmed and is being processed. Track your order at {{tracking_url}}",
      status: "active",
      platform: "klaviyo",
      metrics: {
        sends: 2450,
        deliveryRate: 98.5,
        responses: 125,
        conversions: 0,
        conversionRate: 0
      },
      createdAt: "2024-11-15T10:30:00Z",
      updatedAt: "2025-01-20T14:15:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      name: "Flash Sale Alert",
      content: "FLASH SALE ALERT! 🔥 24 HOURS ONLY: Get 30% off all merchandise with code FLASH30. Shop now: {{short_url}}. Reply STOP to opt out.",
      status: "active",
      platform: "klaviyo",
      metrics: {
        sends: 8750,
        deliveryRate: 97.2,
        responses: 420,
        conversions: 312,
        conversionRate: 3.6
      },
      createdAt: "2025-01-05T09:45:00Z",
      updatedAt: "2025-03-10T11:30:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      name: "Abandoned Cart Reminder",
      content: "Hey {{first_name}}! Your cart is waiting for you at Mystery Hype. Complete your purchase in the next 4 hours and get free shipping with code FREESHIP. {{cart_url}}",
      status: "active",
      platform: "twilio",
      metrics: {
        sends: 1850,
        deliveryRate: 98.9,
        responses: 95,
        conversions: 203,
        conversionRate: 11.0
      },
      createdAt: "2024-12-10T13:20:00Z",
      updatedAt: "2025-02-05T16:45:00Z",
      entityName: "Mystery Hype"
    },
    {
      id: 4,
      name: "Welcome Message",
      content: "Welcome to the {{company_name}} community! Get 15% off your first order with code WELCOME15. Shop now: {{shop_url}}. Text HELP for help or STOP to opt out.",
      status: "draft",
      platform: "klaviyo",
      createdAt: "2025-03-12T10:10:00Z",
      updatedAt: "2025-03-12T10:10:00Z",
      entityName: "Digital Merch Pros"
    }
  ] : [];

  const defaultSeoKeywords: SeoKeyword[] = demoMode ? [
    {
      id: 1,
      keyword: "custom merch for businesses",
      position: 3,
      previousPosition: 5,
      change: 2,
      volume: 4800,
      difficulty: 42,
      intent: "commercial",
      url: "https://digitalmерchpros.com/business-merch/",
      ctr: 6.7,
      impressions: 3200,
      priority: "high",
      lastUpdated: "2025-03-20T10:15:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      keyword: "branded merchandise suppliers",
      position: 7,
      previousPosition: 9,
      change: 2,
      volume: 5900,
      difficulty: 56,
      intent: "commercial",
      url: "https://digitalmерchpros.com/about-us/",
      ctr: 3.2,
      impressions: 2100,
      priority: "high",
      lastUpdated: "2025-03-20T10:15:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      keyword: "custom t-shirts bulk order",
      position: 4,
      previousPosition: 4,
      change: 0,
      volume: 8700,
      difficulty: 48,
      intent: "transactional",
      url: "https://digitalmерchpros.com/product/custom-tshirts/",
      ctr: 5.3,
      impressions: 4500,
      priority: "high",
      lastUpdated: "2025-03-20T10:15:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 4,
      keyword: "mystery box clothing",
      position: 2,
      previousPosition: 4,
      change: 2,
      volume: 12500,
      difficulty: 35,
      intent: "transactional",
      url: "https://mysteryhype.com/mystery-boxes/",
      ctr: 8.1,
      impressions: 9700,
      priority: "high",
      lastUpdated: "2025-03-20T10:15:00Z",
      entityName: "Mystery Hype"
    },
    {
      id: 5,
      keyword: "sustainable branded merchandise",
      position: 12,
      previousPosition: 18,
      change: 6,
      volume: 2800,
      difficulty: 61,
      intent: "informational",
      url: "https://digitalmерchpros.com/blog/sustainable-merch/",
      ctr: 1.8,
      impressions: 1200,
      priority: "medium",
      lastUpdated: "2025-03-20T10:15:00Z",
      entityName: "Digital Merch Pros"
    }
  ] : [];

  const defaultAdCampaigns: AdCampaign[] = demoMode ? [
    {
      id: 1,
      name: "Spring Collection - Facebook",
      platform: "facebook",
      status: "active",
      startDate: "2025-03-01T00:00:00Z",
      endDate: "2025-04-01T00:00:00Z",
      budget: 5000,
      budgetSpent: 3750,
      metrics: {
        impressions: 420000,
        clicks: 18900,
        ctr: 4.5,
        cpc: 0.20,
        conversions: 756,
        conversionRate: 4.0,
        revenue: 22680,
        roas: 6.05
      },
      lastUpdated: "2025-03-21T09:30:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 2,
      name: "Product Showcase - TikTok",
      platform: "tiktok",
      status: "active",
      startDate: "2025-03-10T00:00:00Z",
      budget: 3000,
      budgetSpent: 1200,
      metrics: {
        impressions: 850000,
        clicks: 25500,
        ctr: 3.0,
        cpc: 0.05,
        conversions: 510,
        conversionRate: 2.0,
        revenue: 15300,
        roas: 12.75
      },
      lastUpdated: "2025-03-21T10:15:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 3,
      name: "Retargeting Campaign - Google",
      platform: "google",
      status: "active",
      startDate: "2025-02-15T00:00:00Z",
      endDate: "2025-03-31T00:00:00Z",
      budget: 2500,
      budgetSpent: 2100,
      metrics: {
        impressions: 175000,
        clicks: 9625,
        ctr: 5.5,
        cpc: 0.22,
        conversions: 481,
        conversionRate: 5.0,
        revenue: 14430,
        roas: 6.87
      },
      lastUpdated: "2025-03-21T08:45:00Z",
      entityName: "Digital Merch Pros"
    },
    {
      id: 4,
      name: "Mystery Box Launch - Instagram",
      platform: "instagram",
      status: "scheduled",
      startDate: "2025-04-01T00:00:00Z",
      endDate: "2025-05-01T00:00:00Z",
      budget: 4000,
      budgetSpent: 0,
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        conversions: 0,
        conversionRate: 0
      },
      lastUpdated: "2025-03-20T15:30:00Z",
      entityName: "Mystery Hype"
    },
    {
      id: 5,
      name: "Brand Awareness - Twitter",
      platform: "twitter",
      status: "paused",
      startDate: "2025-02-01T00:00:00Z",
      budget: 1500,
      budgetSpent: 750,
      metrics: {
        impressions: 120000,
        clicks: 3600,
        ctr: 3.0,
        cpc: 0.21,
        conversions: 72,
        conversionRate: 2.0,
        revenue: 2160,
        roas: 2.88
      },
      lastUpdated: "2025-03-15T11:20:00Z",
      entityName: "Mystery Hype"
    }
  ] : [];

  const defaultMarketingPerformance = demoMode ? {
    emailStats: {
      campaigns: 12,
      openRate: 32.5,
      clickRate: 5.8,
      conversionRate: 1.2,
      revenue: 28500
    },
    adStats: {
      spend: 15200,
      impressions: 2450000,
      clicks: 73500,
      ctr: 3.0,
      conversions: 2940,
      revenue: 88200,
      roas: 5.8
    },
    seoStats: {
      organicTraffic: 45800,
      avgPosition: 5.3,
      keywordsRanked: 68,
      conversionRate: 2.1,
      revenue: 32450
    }
  } : {
    emailStats: { campaigns: 0, openRate: 0, clickRate: 0, conversionRate: 0, revenue: 0 },
    adStats: { spend: 0, impressions: 0, clicks: 0, ctr: 0, conversions: 0, revenue: 0, roas: 0 },
    seoStats: { organicTraffic: 0, avgPosition: 0, keywordsRanked: 0, conversionRate: 0, revenue: 0 }
  };
  
  // Process data
  const emailCampaigns = emailCampaignsData?.campaigns || defaultEmailCampaigns;
  const smsTemplates = smsTemplatesData?.templates || defaultSmsTemplates;
  const seoKeywords = seoKeywordsData?.keywords || defaultSeoKeywords;
  const adCampaigns = adCampaignsData?.campaigns || defaultAdCampaigns;
  const marketingPerformance = marketingPerformanceData?.performance || defaultMarketingPerformance;
  
  // Filter campaigns based on campaign type
  const filteredEmailCampaigns = campaignType === 'all' 
    ? emailCampaigns 
    : emailCampaigns.filter((campaign: EmailCampaign) => campaign.type === campaignType);
  
  // Filter keywords based on priority
  const filteredSeoKeywords = seoKeywordFilter === 'all' 
    ? seoKeywords 
    : seoKeywords.filter((keyword: SeoKeyword) => keyword.priority === seoKeywordFilter);
  
  // Filter ad campaigns based on platform
  const filteredAdCampaigns = adPlatformFilter === 'all' 
    ? adCampaigns 
    : adCampaigns.filter((campaign: AdCampaign) => campaign.platform === adPlatformFilter);
  
  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl bg-background min-h-screen">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Marketing Hub</h1>
            <p className="text-muted-foreground">
              Manage all your marketing campaigns, SEO, and advertising in one place
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>Email & SMS</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>SEO</span>
                </TabsTrigger>
                <TabsTrigger value="ads" className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Ads</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  <span>Integrations</span>
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'campaigns' && (
                <div className="flex items-center gap-2">
                  <Select value={campaignType} onValueChange={setCampaignType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Campaign Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campaigns</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                      <SelectItem value="welcome">Welcome Series</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="default">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Campaign
                  </Button>
                </div>
              )}
              
              {activeTab === 'seo' && (
                <div className="flex items-center gap-2">
                  <Select value={seoKeywordFilter} onValueChange={setSeoKeywordFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Keywords</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="default">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Keywords
                  </Button>
                </div>
              )}
              
              {activeTab === 'ads' && (
                <div className="flex items-center gap-2">
                  <Select value={adPlatformFilter} onValueChange={setAdPlatformFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="default">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Ad Campaign
                  </Button>
                </div>
              )}
            </div>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Marketing Performance Summary */}
              {isLoadingPerformance ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                  </div>
                </div>
              ) : (
                <MarketingPerformanceSummary 
                  emailStats={marketingPerformance.emailStats}
                  adStats={marketingPerformance.adStats}
                  seoStats={marketingPerformance.seoStats}
                />
              )}
              
              {/* Recent Email Campaigns */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Recent Email Campaigns</h2>
                  <Button variant="ghost" size="sm" asChild onClick={() => setActiveTab('campaigns')}>
                    <div className="flex items-center">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </Button>
                </div>
                
                {isLoadingEmailCampaigns ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emailCampaigns
                      .filter((campaign: EmailCampaign) => campaign.status === 'sent')
                      .sort((a: EmailCampaign, b: EmailCampaign) => new Date(b.sentAt || '').getTime() - new Date(a.sentAt || '').getTime())
                      .slice(0, 2)
                      .map((campaign: EmailCampaign) => (
                        <CampaignItem key={campaign.id} campaign={campaign} />
                      ))
                    }
                  </div>
                )}
              </div>
              
              {/* SEO and Ads Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold">SEO Highlights</CardTitle>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setActiveTab('seo')}>
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Volume</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingSeoKeywords ? (
                          Array(3).fill(0).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            </TableRow>
                          ))
                        ) : (
                          seoKeywords
                            .sort((a: SeoKeyword, b: SeoKeyword) => a.position - b.position)
                            .slice(0, 3)
                            .map((keyword: SeoKeyword) => (
                              <TableRow key={keyword.id}>
                                <TableCell className="font-medium">{keyword.keyword}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <span>{keyword.position}</span>
                                    {keyword.change !== 0 && (
                                      <div className={`ml-2 ${keyword.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {keyword.change > 0 ? (
                                          <TrendingUp className="h-4 w-4" />
                                        ) : (
                                          <TrendingDown className="h-4 w-4" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{keyword.volume.toLocaleString()}</TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold">Top Ad Campaigns</CardTitle>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setActiveTab('ads')}>
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    {isLoadingAdCampaigns ? (
                      <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : (
                      adCampaigns
                        .filter((campaign: AdCampaign) => campaign.status === 'active')
                        .sort((a: AdCampaign, b: AdCampaign) => (b.metrics.roas || 0) - (a.metrics.roas || 0))
                        .slice(0, 2)
                        .map((campaign: AdCampaign) => (
                          <div key={campaign.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${
                                campaign.platform === 'facebook' ? 'bg-blue-100' : 
                                campaign.platform === 'instagram' ? 'bg-purple-100' : 
                                campaign.platform === 'tiktok' ? 'bg-black/10' : 
                                'bg-gray-100'
                              }`}>
                                {campaign.platform === 'facebook' && <SiFacebook className="h-5 w-5 text-blue-600" />}
                                {campaign.platform === 'instagram' && <Instagram className="h-5 w-5 text-purple-600" />}
                                {campaign.platform === 'tiktok' && <SiTiktok className="h-5 w-5" />}
                                {campaign.platform === 'google' && <SiGoogleads className="h-5 w-5 text-red-600" />}
                                {campaign.platform === 'twitter' && <Twitter className="h-5 w-5 text-blue-400" />}
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{campaign.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Spent: ${campaign.budgetSpent} of ${campaign.budget}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${
                                (campaign.metrics.roas || 0) >= 2 ? 'text-green-500' : 
                                (campaign.metrics.roas || 0) > 1 ? 'text-yellow-500' : 
                                'text-red-500'
                              }`}>
                                {campaign.metrics.roas?.toFixed(1) || 0}x
                              </div>
                              <p className="text-xs text-muted-foreground">ROAS</p>
                            </div>
                          </div>
                        ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Email & SMS Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-medium text-base">Campaign Metrics</CardTitle>
                      <Select defaultValue="30-days">
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7-days">Last 7 days</SelectItem>
                          <SelectItem value="30-days">Last 30 days</SelectItem>
                          <SelectItem value="90-days">Last 90 days</SelectItem>
                          <SelectItem value="year">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Open Rate</span>
                          <span className="font-medium">35.2%</span>
                        </div>
                        <Progress value={35.2} className="h-1.5" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Industry avg: 21.5%</span>
                          <span className="text-green-500">+13.7%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Click Rate</span>
                          <span className="font-medium">4.8%</span>
                        </div>
                        <Progress value={4.8 * 10} className="h-1.5" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Industry avg: 2.3%</span>
                          <span className="text-green-500">+2.5%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Conversion Rate</span>
                          <span className="font-medium">1.2%</span>
                        </div>
                        <Progress value={1.2 * 33.3} className="h-1.5" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Industry avg: 0.5%</span>
                          <span className="text-green-500">+0.7%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="ghost" size="sm" className="w-full text-xs h-7">
                      View Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="shadow-sm md:col-span-2">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-medium text-base">Platforms</CardTitle>
                        <CardDescription className="text-xs">Connected email marketing services</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="h-8">
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        Connect Platform
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center p-3 border rounded-lg space-x-3">
                        <div className="rounded-full bg-muted p-2">
                          <SiKlaviyo className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Klaviyo</h3>
                          <div className="flex justify-between">
                            <p className="text-xs text-muted-foreground">15,420 subscribers</p>
                            <Badge className="bg-green-500 text-[10px] px-1 py-0 h-4">Connected</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg space-x-3 border-dashed">
                        <div className="rounded-full bg-muted p-2">
                          <SiMailchimp className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Mailchimp</h3>
                          <div className="flex justify-between">
                            <p className="text-xs text-muted-foreground">Not connected</p>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Connect</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg space-x-3 border-dashed">
                        <div className="rounded-full bg-muted p-2">
                          <SiConstantcontact className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Constant Contact</h3>
                          <div className="flex justify-between">
                            <p className="text-xs text-muted-foreground">Not connected</p>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Connect</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-lg space-x-3 border-dashed">
                        <div className="rounded-full bg-muted p-2">
                          <SiHubspot className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">HubSpot</h3>
                          <div className="flex justify-between">
                            <p className="text-xs text-muted-foreground">Not connected</p>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Connect</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-bold">Email Campaigns</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your email marketing campaigns across all platforms
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="default" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Campaign
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {isLoadingEmailCampaigns ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              ) : filteredEmailCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Email Campaigns</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You haven't created any email campaigns yet.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create First Campaign
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEmailCampaigns.map((campaign: EmailCampaign) => (
                    <CampaignItem key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mt-8">
                <div>
                  <h2 className="text-xl font-bold">SMS Templates</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your SMS marketing templates
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="default" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create SMS Template
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {isLoadingSmsTemplates ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              ) : smsTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No SMS Templates</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You haven't created any SMS templates yet.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create First Template
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {smsTemplates.map((template: SmsTemplate) => (
                    <SmsTemplateItem key={template.id} template={template} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">SEO Performance</CardTitle>
                    <CardDescription className="text-xs">Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Organic Traffic</span>
                        <span className="font-medium">45,820</span>
                      </div>
                      <div className="flex items-center text-xs text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>12.3% from last month</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Average Position</span>
                        <span className="font-medium">5.3</span>
                      </div>
                      <div className="flex items-center text-xs text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>0.8 positions from last month</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Keywords in Top 10</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex items-center text-xs text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>+3 from last month</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Organic Conversion Rate</span>
                        <span className="font-medium">2.1%</span>
                      </div>
                      <div className="flex items-center text-xs text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>0.3% from last month</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <BarChart className="h-4 w-4 mr-1" />
                      View SEO Analytics
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">SEO Tasks</CardTitle>
                        <CardDescription className="text-xs">Priority tasks to improve rankings</CardDescription>
                      </div>
                      <Badge>3 High Priority</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="p-4 space-y-2">
                        <div className="flex p-3 border rounded-md space-x-3 bg-muted/20">
                          <div className="rounded-full p-1.5 bg-red-100 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">Missing Meta Descriptions</h4>
                              <Badge variant="outline" className="text-xs">High</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">12 pages missing meta descriptions including high-traffic product pages</p>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Fix Issues</Button>
                          </div>
                        </div>
                        
                        <div className="flex p-3 border rounded-md space-x-3 bg-muted/20">
                          <div className="rounded-full p-1.5 bg-red-100 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">Slow Page Load Speed</h4>
                              <Badge variant="outline" className="text-xs">High</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Mobile page speed score of 58/100 on product listing pages</p>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View Report</Button>
                          </div>
                        </div>
                        
                        <div className="flex p-3 border rounded-md space-x-3 bg-muted/20">
                          <div className="rounded-full p-1.5 bg-red-100 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">Broken Internal Links</h4>
                              <Badge variant="outline" className="text-xs">High</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">8 broken internal links found on high-authority pages</p>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Fix Links</Button>
                          </div>
                        </div>
                        
                        <div className="flex p-3 border rounded-md space-x-3">
                          <div className="rounded-full p-1.5 bg-yellow-100 text-yellow-600">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">Low Word Count Content</h4>
                              <Badge variant="outline" className="text-xs">Medium</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">5 category pages with less than 300 words of content</p>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View Pages</Button>
                          </div>
                        </div>
                        
                        <div className="flex p-3 border rounded-md space-x-3">
                          <div className="rounded-full p-1.5 bg-yellow-100 text-yellow-600">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm">Missing Alt Text</h4>
                              <Badge variant="outline" className="text-xs">Medium</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">23 images missing alt text across the website</p>
                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Fix Issues</Button>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-bold">Keyword Rankings</h2>
                  <p className="text-sm text-muted-foreground">
                    Track your organic rankings for important keywords
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search keywords..."
                      className="w-full pl-8"
                    />
                  </div>
                  <Select value={seoKeywordFilter} onValueChange={setSeoKeywordFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Keywords</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="default">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Keywords
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {isLoadingSeoKeywords ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : filteredSeoKeywords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Keywords Found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You haven't added any keywords to track yet.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add First Keyword
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Volume</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSeoKeywords.map((keyword: SeoKeyword) => (
                          <KeywordRow key={keyword.id} keyword={keyword} />
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredSeoKeywords.length} of {seoKeywords.length} keywords
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Ads Tab */}
            <TabsContent value="ads" className="space-y-6">
              {/* Campaign Optimizer */}
              <CampaignOptimizer campaigns={adCampaigns} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Ad Spend</CardTitle>
                    <CardDescription className="text-xs">Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold flex items-baseline">
                      $15,200
                      <span className="text-sm text-muted-foreground ml-2">
                        / $18,000 budget
                      </span>
                    </div>
                    <Progress value={(15200 / 18000) * 100} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">CTR</div>
                        <div className="text-lg font-medium">3.2%</div>
                        <div className="text-xs text-green-500 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          0.4%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">CPC</div>
                        <div className="text-lg font-medium">$0.21</div>
                        <div className="text-xs text-green-500 flex items-center">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          $0.03
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Conversions</div>
                        <div className="text-lg font-medium">2,940</div>
                        <div className="text-xs text-green-500 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          18.5%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">ROAS</div>
                        <div className="text-lg font-medium text-green-500">5.8x</div>
                        <div className="text-xs text-green-500 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          0.3x
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <LineChart className="h-4 w-4 mr-1" />
                      View Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base font-medium">Ad Platforms</CardTitle>
                          <CardDescription className="text-xs">Connected advertising platforms</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                          <PlusCircle className="h-3.5 w-3.5 mr-1" />
                          Connect Platform
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="flex flex-col items-center p-4 border rounded-lg space-y-2">
                          <div className="rounded-full bg-blue-100 p-2.5">
                            <SiFacebook className="h-6 w-6 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-sm">Facebook</h3>
                          <Badge className="bg-green-500">Connected</Badge>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 border rounded-lg space-y-2">
                          <div className="rounded-full bg-gradient-to-tr from-purple-600 to-yellow-500 p-2.5">
                            <Instagram className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-medium text-sm">Instagram</h3>
                          <Badge className="bg-green-500">Connected</Badge>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 border rounded-lg space-y-2">
                          <div className="rounded-full bg-red-100 p-2.5">
                            <SiGoogleads className="h-6 w-6 text-red-600" />
                          </div>
                          <h3 className="font-medium text-sm">Google Ads</h3>
                          <Badge className="bg-green-500">Connected</Badge>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 border rounded-lg space-y-2">
                          <div className="rounded-full bg-black/10 p-2.5">
                            <SiTiktok className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium text-sm">TikTok</h3>
                          <Badge className="bg-green-500">Connected</Badge>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 border rounded-lg space-y-2 border-dashed">
                          <div className="rounded-full bg-blue-100 p-2.5">
                            <Twitter className="h-6 w-6 text-blue-400" />
                          </div>
                          <h3 className="font-medium text-sm">Twitter</h3>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Connect</Button>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 border rounded-lg space-y-2 border-dashed">
                          <div className="rounded-full bg-blue-100 p-2.5">
                            <Target className="h-6 w-6 text-blue-500" />
                          </div>
                          <h3 className="font-medium text-sm">Other</h3>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Connect</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-bold">Ad Campaigns</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your ad campaigns across all platforms
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={adPlatformFilter} onValueChange={setAdPlatformFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="default">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create Campaign
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {isLoadingAdCampaigns ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              ) : filteredAdCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Ad Campaigns</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    You haven't created any ad campaigns for this platform yet.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Create First Campaign
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredAdCampaigns.map((campaign: AdCampaign) => (
                    <AdCampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-bold">Marketing Integrations</h2>
                  <p className="text-sm text-muted-foreground">
                    Connect your marketing tools and platforms
                  </p>
                </div>
                <Button variant="default">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Connect New Tool
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Email Marketing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PlatformIntegrationCard
                      title="Klaviyo"
                      description="Email, SMS, and marketing automation"
                      icon={<SiKlaviyo className="h-5 w-5" />}
                      connected={true}
                      lastSynced="2025-03-21T10:30:00Z"
                      metrics={{
                        subscribers: 15420,
                        campaigns: 32,
                        avgOpenRate: 35.8
                      }}
                    />
                    
                    <PlatformIntegrationCard
                      title="Mailchimp"
                      description="Email marketing platform"
                      icon={<SiMailchimp className="h-5 w-5" />}
                      connected={false}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Advertising</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PlatformIntegrationCard
                      title="Facebook Ads"
                      description="Facebook & Instagram advertising"
                      icon={<SiFacebook className="h-5 w-5 text-blue-600" />}
                      connected={true}
                      lastSynced="2025-03-21T09:15:00Z"
                      metrics={{
                        subscribers: 0,
                        campaigns: 5,
                        avgOpenRate: 0
                      }}
                    />
                    
                    <PlatformIntegrationCard
                      title="Google Ads"
                      description="Search & display advertising"
                      icon={<SiGoogleads className="h-5 w-5 text-red-500" />}
                      connected={true}
                      lastSynced="2025-03-21T11:45:00Z"
                      metrics={{
                        subscribers: 0,
                        campaigns: 3,
                        avgOpenRate: 0
                      }}
                    />
                    
                    <PlatformIntegrationCard
                      title="TikTok Ads"
                      description="TikTok advertising platform"
                      icon={<SiTiktok className="h-5 w-5" />}
                      connected={true}
                      lastSynced="2025-03-21T08:30:00Z"
                      metrics={{
                        subscribers: 0,
                        campaigns: 2,
                        avgOpenRate: 0
                      }}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Analytics & SEO</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-md">
                              <Globe className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold">Google Analytics</CardTitle>
                              <CardDescription className="text-xs">Website analytics platform</CardDescription>
                            </div>
                          </div>
                          <Badge variant="default">Connected</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Properties Connected</span>
                            <span className="font-medium">2</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last Sync</span>
                            <span className="font-medium">2 hours ago</span>
                          </div>
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                              View Analytics Dashboard
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span>GA4 Property</span>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1" />
                          Active
                        </div>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-md">
                              <Search className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold">Google Search Console</CardTitle>
                              <CardDescription className="text-xs">SEO performance metrics</CardDescription>
                            </div>
                          </div>
                          <Badge variant="default">Connected</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Properties</span>
                            <span className="font-medium">3</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last Report</span>
                            <span className="font-medium">1 day ago</span>
                          </div>
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                              <LineChart className="h-3.5 w-3.5 mr-1.5" />
                              View Keyword Rankings
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span>HTTP & HTTPS verified</span>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1" />
                          Active
                        </div>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-md">
                              <LineChart className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold">Ahrefs</CardTitle>
                              <CardDescription className="text-xs">SEO and backlink analysis</CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline">Not Connected</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-6 text-center">
                        <p className="text-sm text-muted-foreground mb-3">Connect to analyze backlinks and monitor keywords</p>
                        <Button variant="default" size="sm">
                          Connect Ahrefs
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-md">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold">Data Sync Scheduler</CardTitle>
                              <CardDescription className="text-xs">Automate platform data synchronization</CardDescription>
                            </div>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 pt-4">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Next Sync</span>
                            <span className="font-medium">In 2 hours</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Schedule</span>
                            <span className="font-medium">Every 6 hours</span>
                          </div>
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="h-3.5 w-3.5 mr-1.5" />
                              Configure Schedule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Webhooks & API Connections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-md">
                              <Webhook className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold">Webhook Manager</CardTitle>
                              <CardDescription className="text-xs">Configure and monitor API webhooks</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-medium">Klaviyo Order Updates</span>
                            </div>
                            <Badge variant="outline" className="text-xs">Active</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-medium">Facebook Lead Sync</span>
                            </div>
                            <Badge variant="outline" className="text-xs">Active</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span className="text-sm font-medium">Google Analytics Events</span>
                            </div>
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">Warning</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span className="text-sm font-medium">TikTok Conversion API</span>
                            </div>
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Error</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="flex justify-between w-full">
                          <Button variant="outline" size="sm">
                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                            Add Webhook
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-3.5 w-3.5 mr-1.5" />
                            Manage
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-muted rounded-md">
                              <Activity className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold">Webhook Activity</CardTitle>
                              <CardDescription className="text-xs">Recent webhook traffic and events</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[220px]">
                          <div className="p-4 space-y-3">
                            <div className="flex p-2 border rounded-md text-xs">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                  <span className="font-medium">Klaviyo Order Updates</span>
                                </div>
                                <p className="text-muted-foreground ml-5.5 mt-1">
                                  Webhook triggered successfully for order #3854
                                </p>
                              </div>
                              <div className="text-muted-foreground text-right">
                                5m ago
                              </div>
                            </div>
                            
                            <div className="flex p-2 border rounded-md text-xs">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                  <span className="font-medium">Facebook Lead Sync</span>
                                </div>
                                <p className="text-muted-foreground ml-5.5 mt-1">
                                  New lead captured and synced to database
                                </p>
                              </div>
                              <div className="text-muted-foreground text-right">
                                23m ago
                              </div>
                            </div>
                            
                            <div className="flex p-2 border rounded-md text-xs bg-yellow-50">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                                  <span className="font-medium">Google Analytics Events</span>
                                </div>
                                <p className="text-muted-foreground ml-5.5 mt-1">
                                  Webhook timeout after 30s, retrying (2/3)
                                </p>
                              </div>
                              <div className="text-muted-foreground text-right">
                                43m ago
                              </div>
                            </div>
                            
                            <div className="flex p-2 border rounded-md text-xs bg-red-50">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                                  <span className="font-medium">TikTok Conversion API</span>
                                </div>
                                <p className="text-muted-foreground ml-5.5 mt-1">
                                  401 Unauthorized: Invalid API credentials
                                </p>
                              </div>
                              <div className="text-muted-foreground text-right">
                                1h ago
                              </div>
                            </div>
                            
                            <div className="flex p-2 border rounded-md text-xs">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                  <span className="font-medium">Klaviyo Order Updates</span>
                                </div>
                                <p className="text-muted-foreground ml-5.5 mt-1">
                                  Webhook triggered successfully for order #3853
                                </p>
                              </div>
                              <div className="text-muted-foreground text-right">
                                2h ago
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </CardContent>
                      <CardFooter className="border-t pt-3">
                        <Button variant="outline" size="sm" className="w-full">
                          <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
                          View Full History
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base font-semibold">Data Synchronization</CardTitle>
                            <CardDescription className="text-xs">Configure API synchronization settings</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync All Data Now
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Sliders className="h-4 w-4 mr-2" />
                                Advanced Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ClipboardList className="h-4 w-4 mr-2" />
                                View Sync History
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 pb-2">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">Automatic Synchronization</div>
                              <div className="text-xs text-muted-foreground">Sync data between platforms automatically</div>
                            </div>
                            <Switch checked={true} />
                          </div>
                          
                          <Separator />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="syncInterval" className="text-xs">Sync Interval</Label>
                              <Select defaultValue="6">
                                <SelectTrigger id="syncInterval">
                                  <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">Every hour</SelectItem>
                                  <SelectItem value="3">Every 3 hours</SelectItem>
                                  <SelectItem value="6">Every 6 hours</SelectItem>
                                  <SelectItem value="12">Every 12 hours</SelectItem>
                                  <SelectItem value="24">Daily</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="failureRetries" className="text-xs">Failure Retries</Label>
                              <Select defaultValue="3">
                                <SelectTrigger id="failureRetries">
                                  <SelectValue placeholder="Select retries" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 retry</SelectItem>
                                  <SelectItem value="3">3 retries</SelectItem>
                                  <SelectItem value="5">5 retries</SelectItem>
                                  <SelectItem value="0">No retries</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="notificationEmail" className="text-xs">Notification Email</Label>
                              <Input id="notificationEmail" placeholder="admin@example.com" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3">
                        <div className="flex justify-between w-full">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Last sync completed 28 minutes ago
                          </div>
                          <Button size="sm">Save Settings</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}