import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import MainLayout from '@/components/MainLayout';
import { PageTitle } from '@/components/PageTitle';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CalendarCheck,
  ChevronDown,
  Clock,
  Copy,
  FileText,
  Filter,
  ListChecks,
  Loader2,
  Plus,
  Search,
  Star,
  Tag,
  Zap,
} from 'lucide-react';
import { LaunchTemplate, TemplateCategory } from '@/types/template-types';
import { toast } from '@/hooks/use-toast';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useMediaQuery } from '@/hooks/use-media-query';

// Mock data for templates - to be replaced with API calls
const mockTemplates: LaunchTemplate[] = [
  {
    id: "template1",
    name: "Digital Product Launch Blueprint",
    description: "A comprehensive template for launching digital products, covering from pre-launch preparations to post-launch monitoring.",
    category: "product_launch",
    tasks: [
      {
        id: "task1",
        title: "Create product landing page",
        description: "Design and develop the product landing page with key features, pricing, and call-to-action buttons.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template1",
      },
      {
        id: "task2",
        title: "Set up email sequences",
        description: "Create pre-launch, launch day, and follow-up email sequences for your subscriber list.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template1",
      },
      {
        id: "task3",
        title: "Prepare social media content calendar",
        description: "Create 2 weeks worth of social media announcements and content for the product launch.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template1",
      },
      {
        id: "task4",
        title: "Set up analytics tracking",
        description: "Implement conversion tracking, goal setup, and UTM parameters for launch campaign.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template1",
      },
      {
        id: "task5",
        title: "Prepare customer onboarding materials",
        description: "Create help documentation, tutorial videos, and FAQ for new customers.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template1",
      },
    ],
    timeline: {
      startDate: null, // To be set when applying the template
      endDate: null, // To be set when applying the template
      duration: 21, // 21 days
      milestones: [
        {
          name: "Pre-launch Phase Complete",
          date: null,
          completed: false,
        },
        {
          name: "Launch Day",
          date: null,
          completed: false,
        },
        {
          name: "Post-launch Review",
          date: null,
          completed: false,
        },
      ],
    },
    placeholderCopy: "Introducing [PRODUCT NAME] - the revolutionary [PRODUCT CATEGORY] that helps you [PRIMARY BENEFIT]. With [KEY FEATURE 1], [KEY FEATURE 2], and [KEY FEATURE 3], you'll be able to [SOLVE PROBLEM] faster than ever before.\n\nFor a limited time, get [DISCOUNT/OFFER] when you sign up during our launch week!",
    campaignNotes: "This launch template is optimal for SaaS products, digital courses, and subscription-based services. It focuses on building anticipation and maximizing first-week sales through time-limited offers.",
    createdAt: "2025-01-15T12:00:00Z",
    updatedAt: "2025-03-01T15:30:00Z",
    entityId: 1,
    entityName: "Digital Merch Pros",
    tags: ["digital", "product launch", "marketing", "email sequence"],
    starred: true,
  },
  {
    id: "template2",
    name: "Seasonal Sale Campaign",
    description: "Template for running seasonal sales events (holiday, back-to-school, summer, etc.) with promotional strategies.",
    category: "sale_event",
    tasks: [
      {
        id: "task1",
        title: "Define sale parameters",
        description: "Determine discount structure, eligible products, and sale duration.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template2",
      },
      {
        id: "task2",
        title: "Create promotional graphics",
        description: "Design banners, social media graphics, and email headers for the sale.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template2",
      },
      {
        id: "task3",
        title: "Set up promotional codes",
        description: "Create and test discount codes in your e-commerce platform.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template2",
      },
      {
        id: "task4",
        title: "Schedule email announcements",
        description: "Create and schedule announcement, reminder, and last-chance emails.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template2",
      },
      {
        id: "task5",
        title: "Prepare customer service team",
        description: "Brief team on sale details and prepare for increased support volume.",
        status: "todo",
        priority: "low",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template2",
      },
    ],
    timeline: {
      startDate: null,
      endDate: null,
      duration: 14, // 14 days
      milestones: [
        {
          name: "Sale Announcement",
          date: null,
          completed: false,
        },
        {
          name: "Sale Launch",
          date: null,
          completed: false,
        },
        {
          name: "Last Chance Reminder",
          date: null,
          completed: false,
        },
        {
          name: "Sale End & Analysis",
          date: null,
          completed: false,
        },
      ],
    },
    placeholderCopy: "🔥 [SEASONAL] SALE ALERT! 🔥\n\nFor a limited time, enjoy [DISCOUNT]% off all [PRODUCT CATEGORY] at [COMPANY NAME]! \n\nUse code [PROMO CODE] at checkout. Sale ends [END DATE]. Don't miss out!",
    campaignNotes: "This template works best when scheduled 14-21 days before the actual sale date to ensure proper preparation. Adapt the discount messaging based on your margin requirements.",
    createdAt: "2025-02-01T09:15:00Z",
    updatedAt: "2025-03-08T10:45:00Z",
    entityId: 2,
    entityName: "Lone Star Custom Clothing",
    tags: ["seasonal", "sale", "promotion", "discount"],
  },
  {
    id: "template3",
    name: "New Service Line Launch",
    description: "Blueprint for announcing and launching a new service offering to existing customers and prospects.",
    category: "product_launch",
    tasks: [
      {
        id: "task1",
        title: "Create service offering page",
        description: "Design and develop detailed service information page with process, benefits, and pricing.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template3",
      },
      {
        id: "task2",
        title: "Develop service delivery SOP",
        description: "Create detailed SOP for team to ensure consistent service delivery.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template3",
      },
      {
        id: "task3",
        title: "Create case studies/examples",
        description: "Prepare sample deliverables or case studies to showcase service quality.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template3",
      },
      {
        id: "task4",
        title: "Train team members",
        description: "Conduct training sessions for all team members involved in service delivery.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template3",
      },
      {
        id: "task5",
        title: "Create announcement campaign",
        description: "Develop emails, social posts, and press release for service announcement.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template3",
      },
    ],
    timeline: {
      startDate: null,
      endDate: null,
      duration: 30, // 30 days
      milestones: [
        {
          name: "Service Definition Complete",
          date: null,
          completed: false,
        },
        {
          name: "Team Onboarding Complete",
          date: null,
          completed: false,
        },
        {
          name: "Public Announcement",
          date: null,
          completed: false,
        },
        {
          name: "First Client Onboarding",
          date: null,
          completed: false,
        },
      ],
    },
    placeholderCopy: "Introducing [SERVICE NAME]: Our Newest Offering\n\nWe're excited to announce [SERVICE NAME], our latest service designed to help [TARGET AUDIENCE] achieve [PRIMARY BENEFIT].\n\nWith [SERVICE NAME], you'll receive:\n- [KEY BENEFIT 1]\n- [KEY BENEFIT 2]\n- [KEY BENEFIT 3]\n\nSchedule a consultation today to learn how [SERVICE NAME] can transform your [RELEVANT AREA].",
    campaignNotes: "This template assumes your service delivery process is already defined. Focus on communicating value proposition clearly and ensure your team is fully prepared before announcement.",
    createdAt: "2025-01-20T14:30:00Z",
    updatedAt: "2025-03-05T11:20:00Z",
    entityId: 1,
    entityName: "Digital Merch Pros",
    tags: ["service", "launch", "announcement"],
  },
  {
    id: "template4",
    name: "Content Marketing Campaign",
    description: "Structured campaign template for planning and executing a cohesive content marketing initiative.",
    category: "campaign",
    tasks: [
      {
        id: "task1",
        title: "Define campaign theme and goals",
        description: "Establish campaign topic, key messages, target audience, and success metrics.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template4",
      },
      {
        id: "task2",
        title: "Create content calendar",
        description: "Plan content pieces, formats, publishing schedule and distribution channels.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template4",
      },
      {
        id: "task3",
        title: "Develop pillar content",
        description: "Create the main content asset (whitepaper, guide, or video series).",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template4",
      },
      {
        id: "task4",
        title: "Create supporting content",
        description: "Develop blog posts, social media content, emails, and other supporting materials.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template4",
      },
      {
        id: "task5",
        title: "Set up lead capture and nurturing",
        description: "Create lead magnets, landing pages, and follow-up email sequences.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template4",
      },
    ],
    timeline: {
      startDate: null,
      endDate: null,
      duration: 45, // 45 days
      milestones: [
        {
          name: "Campaign Strategy Finalized",
          date: null,
          completed: false,
        },
        {
          name: "Pillar Content Complete",
          date: null,
          completed: false,
        },
        {
          name: "Campaign Launch",
          date: null,
          completed: false,
        },
        {
          name: "Campaign End & Analysis",
          date: null,
          completed: false,
        },
      ],
    },
    placeholderCopy: "Content Campaign: [CAMPAIGN NAME]\n\nCore Message: [PRIMARY MESSAGE]\n\nTarget Audience: [AUDIENCE DESCRIPTION]\n\nCall to Action: [PRIMARY CTA]\n\nKey Performance Indicators:\n- [KPI 1]\n- [KPI 2]\n- [KPI 3]",
    campaignNotes: "This template works best for educational content campaigns focused on establishing authority in your niche. Allow sufficient time for content creation and approvals before launch.",
    createdAt: "2025-02-10T16:45:00Z",
    updatedAt: "2025-03-12T09:30:00Z",
    entityId: 3,
    entityName: "Mystery Hype",
    tags: ["content", "marketing", "campaign", "lead generation"],
  },
  {
    id: "template5",
    name: "Customer Onboarding Process",
    description: "SOP template for efficiently onboarding new customers to ensure satisfaction and retention.",
    category: "sop",
    tasks: [
      {
        id: "task1",
        title: "Welcome email sequence setup",
        description: "Create and configure welcome emails with account information and next steps.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template5",
      },
      {
        id: "task2",
        title: "Account setup guide",
        description: "Create step-by-step instructions for new customers to configure their account.",
        status: "todo",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template5",
      },
      {
        id: "task3",
        title: "Schedule kickoff call",
        description: "Create template and process for scheduling initial onboarding calls with new customers.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template5",
      },
      {
        id: "task4",
        title: "Training resources compilation",
        description: "Gather and organize all training materials, videos, and documentation for new customers.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template5",
      },
      {
        id: "task5",
        title: "Follow-up check-in process",
        description: "Create system for 7-day, 30-day, and 90-day check-ins with new customers.",
        status: "todo",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        projectId: "template5",
      },
    ],
    timeline: {
      startDate: null,
      endDate: null,
      duration: 90, // 90 days
      milestones: [
        {
          name: "Initial Setup Complete",
          date: null,
          completed: false,
        },
        {
          name: "Training Complete",
          date: null,
          completed: false,
        },
        {
          name: "30-Day Assessment",
          date: null,
          completed: false,
        },
        {
          name: "90-Day Review",
          date: null,
          completed: false,
        },
      ],
    },
    placeholderCopy: "Customer Onboarding Process\n\nPhase 1: Welcome & Setup (Days 1-7)\n- Send welcome email & account credentials\n- Schedule kickoff call\n- Complete initial setup\n\nPhase 2: Training (Days 8-30)\n- Complete core feature training\n- Review customer goals & implementation plan\n- Address initial questions\n\nPhase 3: Adoption & Growth (Days 31-90)\n- Check-in at 30, 60, and 90 days\n- Identify expansion opportunities\n- Collect initial feedback",
    campaignNotes: "This SOP should be tailored based on your product/service complexity. Adjust touchpoints and timeline accordingly. Customer success metrics should be defined and monitored throughout the process.",
    createdAt: "2025-01-05T11:30:00Z",
    updatedAt: "2025-03-10T14:15:00Z",
    entityId: 1,
    entityName: "Digital Merch Pros",
    tags: ["onboarding", "sop", "customer success", "retention"],
  }
];

// Component for the template details dialog
const TemplateDetailsDialog = ({ template, onApply }: { template: LaunchTemplate, onApply: (template: LaunchTemplate) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleApplyTemplate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onApply(template);
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <DialogTitle className="text-xl font-bold">{template.name}</DialogTitle>
          {template.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        </div>
        <DialogDescription>
          {template.description}
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="flex-1 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-primary" />
                Tasks ({template.tasks.length})
              </h3>
              <div className="space-y-2">
                {template.tasks.map((task, index) => (
                  <div key={index} className="p-3 bg-muted/40 rounded-md border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <div className="h-4 w-4 rounded-full border-2 border-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        </div>
                      </div>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' : 
                        task.priority === 'medium' ? 'outline' : 'secondary'
                      } className="text-[10px]">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-primary" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {template.campaignNotes && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Campaign Notes
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {template.campaignNotes}
                </p>
              </div>
            )}
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
                Timeline
              </h3>
              <div className="p-3 bg-muted/40 rounded-md border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Duration</span>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {template.timeline.duration} days
                  </Badge>
                </div>
                <Separator className="my-3" />
                <h4 className="text-sm font-medium mb-2">Milestones</h4>
                <div className="space-y-2">
                  {template.timeline.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-xs">{milestone.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {milestone.date ? format(new Date(milestone.date), 'MMM d, yyyy') : 'To be scheduled'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {template.placeholderCopy && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Placeholder Copy
                </h3>
                <div className="p-3 bg-muted/40 rounded-md border relative">
                  <pre className="text-xs overflow-auto whitespace-pre-wrap font-sans">
                    {template.placeholderCopy}
                  </pre>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 right-2 h-7 w-7 p-0"
                    onClick={() => {
                      navigator.clipboard.writeText(template.placeholderCopy || '');
                      toast({
                        title: "Copy Copied",
                        description: "Placeholder text copied to clipboard."
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                Template Information
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">
                    {template.category === 'product_launch' ? 'Product Launch' : 
                     template.category === 'campaign' ? 'Marketing Campaign' :
                     template.category === 'sop' ? 'Standard Operating Procedure' :
                     template.category === 'sale_event' ? 'Sale Event' : template.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Entity:</span>
                  <span className="font-medium">{template.entityName || 'Organization-wide'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{format(new Date(template.updatedAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => {}}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>
        <Button onClick={handleApplyTemplate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Apply Template
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Component for displaying template cards
const TemplateCard = ({ template, onClick }: { template: LaunchTemplate, onClick: () => void }) => {
  const isTablet = useMediaQuery("(min-width: 768px)");
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-md transition-all border-border/60 overflow-hidden flex flex-col"
      onClick={onClick}
    >
      <CardHeader className="pb-2 relative">
        {template.starred && (
          <div className="absolute top-3 right-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        )}
        <CardTitle className="text-base md:text-lg font-bold line-clamp-1 pr-4">
          {template.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs md:text-sm">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-2 gap-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 text-[10px]">
            {template.category === 'product_launch' ? 'Product Launch' : 
             template.category === 'campaign' ? 'Marketing Campaign' :
             template.category === 'sop' ? 'Standard Operating Procedure' :
             template.category === 'sale_event' ? 'Sale Event' : template.category}
          </Badge>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {template.tasks.length} tasks
          </span>
        </div>
        
        {isTablet && (
          <div className="space-y-1 mt-3">
            {template.tasks.slice(0, 3).map((task, index) => (
              <div key={index} className="flex items-start text-xs gap-1.5">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="h-3 w-3 rounded-full border border-primary" />
                </div>
                <p className="line-clamp-1 text-muted-foreground">{task.title}</p>
              </div>
            ))}
            {template.tasks.length > 3 && (
              <div className="text-xs text-muted-foreground pl-4">+{template.tasks.length - 3} more tasks</div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 mt-auto border-t text-xs flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
          <span>{template.timeline.duration} days</span>
        </div>
        <div>
          {template.entityName ? (
            <span className="text-muted-foreground">{template.entityName}</span>
          ) : (
            <span className="text-muted-foreground">Organization</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Main component
export default function LaunchTemplates() {
  const { demoMode } = useDemoMode();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    entity: "all",
  });
  const [selectedTemplate, setSelectedTemplate] = useState<LaunchTemplate | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Get templates based on filters and active tab
  const getFilteredTemplates = () => {
    let filtered = [...mockTemplates];
    
    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(template => template.category === filters.category);
    }
    
    // Apply entity filter
    if (filters.entity !== "all") {
      filtered = filtered.filter(template => 
        template.entityId === Number(filters.entity) || 
        (!template.entityId && filters.entity === "none")
      );
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchLower) || 
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "starred") {
        filtered = filtered.filter(template => template.starred);
      } else {
        filtered = filtered.filter(template => template.category === activeTab);
      }
    }
    
    return filtered;
  };
  
  const filteredTemplates = getFilteredTemplates();
  
  // Handle applying a template
  const handleApplyTemplate = (template: LaunchTemplate) => {
    // In a real application, this would create tasks in the Task Manager
    toast({
      title: "Template Applied",
      description: `${template.name} has been added to your Task Manager.`,
    });
    
    setIsDetailsOpen(false);
  };
  
  return (
    <MainLayout>
      <PageTitle 
        title="Launch Templates"
        description="Ready-to-use blueprints for product launches, campaigns, SOPs, and sales events"
        icon={<Zap className="h-5 w-5" />}
      />
      
      <div className="container max-w-7xl py-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <TabsList className="bg-muted/40">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="product_launch">Product Launch</TabsTrigger>
              <TabsTrigger value="campaign">Campaigns</TabsTrigger>
              <TabsTrigger value="sop">SOPs</TabsTrigger>
              <TabsTrigger value="sale_event">Sale Events</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" className="h-9 gap-1">
              <Plus className="h-4 w-4" />
              <span>Create Template</span>
            </Button>
          </div>
          
          {/* Filters row */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <div className="flex gap-3">
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({...filters, category: value})}
              >
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="product_launch">Product Launch</SelectItem>
                  <SelectItem value="campaign">Marketing Campaign</SelectItem>
                  <SelectItem value="sop">SOP</SelectItem>
                  <SelectItem value="sale_event">Sale Event</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.entity.toString()}
                onValueChange={(value) => setFilters({...filters, entity: value})}
              >
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="1">Digital Merch Pros</SelectItem>
                  <SelectItem value="2">Lone Star Custom Clothing</SelectItem>
                  <SelectItem value="3">Mystery Hype</SelectItem>
                  <SelectItem value="4">Alcoeaze</SelectItem>
                  <SelectItem value="5">Hide Cafe Bars</SelectItem>
                  <SelectItem value="none">Organization-wide</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setFilters({
                search: "",
                category: "all",
                entity: "all",
              })}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Templates grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsDetailsOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {filters.search || filters.category !== "all" || filters.entity !== "all" 
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Get started by creating your first template or switching to Demo Mode."}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
                {!demoMode && (
                  <Button variant="default">
                    Enable Demo Mode
                  </Button>
                )}
              </div>
            </div>
          )}
        </Tabs>
      </div>
      
      {/* Template details dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedTemplate && (
          <TemplateDetailsDialog 
            template={selectedTemplate}
            onApply={handleApplyTemplate}
          />
        )}
      </Dialog>
    </MainLayout>
  );
}