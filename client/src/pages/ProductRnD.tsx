import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Download, 
  ExternalLink, 
  FileText, 
  Filter, 
  GitCommit, 
  GitFork, 
  GitMerge, 
  GitPullRequest, 
  Globe, 
  History, 
  ImageIcon, 
  Info, 
  Lightbulb, 
  Link, 
  MessageCircle, 
  MoreHorizontal, 
  Package, 
  Pencil, 
  Plus, 
  Rocket, 
  Search, 
  Send, 
  Settings, 
  Share2, 
  Star, 
  ThumbsDown, 
  ThumbsUp, 
  Timer, 
  Trash, 
  TrendingUp, 
  Users,
  Vote,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

// Type Definitions
type FeatureStatus = 'idea' | 'planning' | 'in_progress' | 'testing' | 'released';
type FeaturePriority = 'low' | 'medium' | 'high' | 'critical';
type FeedbackType = 'bug' | 'feature_request' | 'improvement' | 'praise' | 'other';
type LaunchPhase = 'planning' | 'development' | 'beta' | 'soft_launch' | 'full_launch' | 'post_launch';

interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  department?: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: FeaturePriority;
  votes: number;
  hasVoted?: boolean;
  createdAt: Date;
  targetDate?: Date;
  assignedTo?: User;
  tags: string[];
  progress?: number;
  commentCount: number;
}

interface Feedback {
  id: string;
  title: string;
  description: string;
  type: FeedbackType;
  createdAt: Date;
  customer: {
    name: string;
    company?: string;
    avatar?: string;
  };
  status: 'new' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'wont_do';
  votes: number;
  comments: number;
  product: string;
}

interface IdeaVaultItem {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: User;
  votes: {
    team: number;
    customer: number;
    partner: number;
    investor: number;
  };
  status: 'new' | 'under_review' | 'approved' | 'declined';
  source: 'team' | 'customer' | 'partner' | 'investor' | 'ai';
  tags: string[];
  potentialImpact: 'low' | 'medium' | 'high';
  effortEstimate: 'small' | 'medium' | 'large';
}

interface LaunchPlan {
  id: string;
  name: string;
  description: string;
  phase: LaunchPhase;
  startDate: Date;
  targetLaunchDate: Date;
  actualLaunchDate?: Date;
  progress: number;
  features: string[];
  owner: User;
  teamMembers: User[];
  milestones: {
    id: string;
    title: string;
    dueDate: Date;
    isComplete: boolean;
  }[];
}

// Sample Data
const sampleFeatures: Feature[] = [
  {
    id: 'f1',
    title: 'Bulk Order Processing System',
    description: 'Allow customers to place and manage bulk orders through a specialized interface',
    status: 'in_progress',
    priority: 'high',
    votes: 42,
    hasVoted: true,
    createdAt: new Date(2023, 9, 15),
    targetDate: new Date(2023, 11, 20),
    assignedTo: {
      id: 'u1',
      name: 'Alex Morgan',
      role: 'Lead Developer',
      avatar: '/avatars/alex.jpg'
    },
    tags: ['b2b', 'orders', 'efficiency'],
    progress: 65,
    commentCount: 8
  },
  {
    id: 'f2',
    title: 'Custom Design Upload Wizard',
    description: 'Guided step-by-step process for customers to upload and preview their custom designs',
    status: 'planning',
    priority: 'medium',
    votes: 31,
    createdAt: new Date(2023, 10, 5),
    targetDate: new Date(2024, 1, 15),
    tags: ['design', 'ux', 'customer-facing'],
    commentCount: 12
  },
  {
    id: 'f3',
    title: 'AI-Powered Design Recommendations',
    description: 'Use machine learning to suggest design improvements or options based on customer preferences',
    status: 'idea',
    priority: 'low',
    votes: 27,
    createdAt: new Date(2023, 10, 20),
    tags: ['ai', 'personalization', 'innovation'],
    commentCount: 5
  },
  {
    id: 'f4',
    title: 'Quote System Overhaul',
    description: 'Redesign the quote generation system to improve accuracy and include more customization options',
    status: 'testing',
    priority: 'high',
    votes: 38,
    hasVoted: true,
    createdAt: new Date(2023, 8, 10),
    targetDate: new Date(2023, 11, 5),
    assignedTo: {
      id: 'u2',
      name: 'Jamie Lee',
      role: 'Product Manager',
      avatar: '/avatars/jamie.jpg'
    },
    tags: ['sales', 'pricing', 'quotes'],
    progress: 90,
    commentCount: 15
  },
  {
    id: 'f5',
    title: 'Mobile App for Order Tracking',
    description: 'Create a dedicated mobile app that allows customers to track their orders in real-time',
    status: 'released',
    priority: 'critical',
    votes: 63,
    hasVoted: false,
    createdAt: new Date(2023, 6, 15),
    assignedTo: {
      id: 'u3',
      name: 'Taylor Kim',
      role: 'Mobile Developer',
      avatar: '/avatars/taylor.jpg'
    },
    tags: ['mobile', 'tracking', 'customer-experience'],
    progress: 100,
    commentCount: 24
  }
];

const sampleFeedback: Feedback[] = [
  {
    id: 'fb1',
    title: 'Need better image resolution options',
    description: 'When uploading designs, the low-resolution preview makes it hard to check details. Could we have a zoom or high-res preview option?',
    type: 'improvement',
    createdAt: new Date(2023, 10, 18),
    customer: {
      name: 'Madison West',
      company: 'West Fitness',
      avatar: '/avatars/madison.jpg'
    },
    status: 'planned',
    votes: 12,
    comments: 3,
    product: 'Design Portal'
  },
  {
    id: 'fb2',
    title: 'Bug: Cart emptying on refresh',
    description: 'When I refresh the page while customizing an order, my cart empties and I lose all my work.',
    type: 'bug',
    createdAt: new Date(2023, 10, 19),
    customer: {
      name: 'Carlos Rodriguez',
      company: 'Rodriguez Family Shop',
    },
    status: 'in_progress',
    votes: 18,
    comments: 7,
    product: 'Store Frontend'
  },
  {
    id: 'fb3',
    title: 'Love the new order tracking!',
    description: 'The new real-time order tracking is fantastic. Being able to see exactly where my order is has improved our planning substantially.',
    type: 'praise',
    createdAt: new Date(2023, 10, 15),
    customer: {
      name: 'Aisha Johnson',
      company: 'Bright Events Co.',
      avatar: '/avatars/aisha.jpg'
    },
    status: 'completed',
    votes: 6,
    comments: 1,
    product: 'Order System'
  },
  {
    id: 'fb4',
    title: 'Request: Bulk discount tier options',
    description: 'Would love to see more flexible bulk discount options, perhaps with customizable tiers based on quantity.',
    type: 'feature_request',
    createdAt: new Date(2023, 10, 12),
    customer: {
      name: 'Thomas Baker',
      company: 'Baker University',
    },
    status: 'under_review',
    votes: 21,
    comments: 5,
    product: 'Pricing System'
  }
];

const sampleIdeas: IdeaVaultItem[] = [
  {
    id: 'i1',
    title: 'AR visualization for custom apparel',
    description: 'Create an AR feature that lets customers "try on" custom designs virtually before ordering.',
    createdAt: new Date(2023, 10, 5),
    createdBy: {
      id: 'u4',
      name: 'Jordan Lee',
      role: 'UX Designer',
      avatar: '/avatars/jordan.jpg'
    },
    votes: {
      team: 12,
      customer: 8,
      partner: 3,
      investor: 2
    },
    status: 'under_review',
    source: 'team',
    tags: ['ar', 'customer-experience', 'innovation'],
    potentialImpact: 'high',
    effortEstimate: 'large'
  },
  {
    id: 'i2',
    title: 'Sustainability impact calculator',
    description: 'Show customers the positive environmental impact of choosing eco-friendly materials or production methods.',
    createdAt: new Date(2023, 10, 10),
    createdBy: {
      id: 'u5',
      name: 'Sam Patel',
      role: 'Marketing Lead',
      avatar: '/avatars/sam.jpg'
    },
    votes: {
      team: 9,
      customer: 15,
      partner: 4,
      investor: 3
    },
    status: 'approved',
    source: 'customer',
    tags: ['sustainability', 'transparency', 'marketing'],
    potentialImpact: 'medium',
    effortEstimate: 'medium'
  },
  {
    id: 'i3',
    title: 'Print shop marketplace',
    description: 'Create a platform connecting customers with local print shops for faster turnaround times on certain orders.',
    createdAt: new Date(2023, 10, 15),
    createdBy: {
      id: 'u6',
      name: 'Morgan Chen',
      role: 'Business Development',
      avatar: '/avatars/morgan.jpg'
    },
    votes: {
      team: 7,
      customer: 3,
      partner: 11,
      investor: 5
    },
    status: 'new',
    source: 'partner',
    tags: ['marketplace', 'network', 'service-expansion'],
    potentialImpact: 'high',
    effortEstimate: 'large'
  },
  {
    id: 'i4',
    title: 'AI-generated design variations',
    description: 'Use AI to automatically generate variations of customer-submitted designs with different color schemes or style adjustments.',
    createdAt: new Date(2023, 10, 18),
    createdBy: {
      id: 'system',
      name: 'AI Assistant',
      role: 'System',
    },
    votes: {
      team: 14,
      customer: 6,
      partner: 2,
      investor: 4
    },
    status: 'new',
    source: 'ai',
    tags: ['ai', 'design', 'automation'],
    potentialImpact: 'medium',
    effortEstimate: 'medium'
  }
];

const sampleLaunches: LaunchPlan[] = [
  {
    id: 'l1',
    name: 'Custom Design Portal 2.0',
    description: 'Major update to the design upload and customization system',
    phase: 'development',
    startDate: new Date(2023, 9, 1),
    targetLaunchDate: new Date(2023, 11, 15),
    progress: 60,
    features: ['f2', 'f4'],
    owner: {
      id: 'u2',
      name: 'Jamie Lee',
      role: 'Product Manager',
      avatar: '/avatars/jamie.jpg'
    },
    teamMembers: [
      {
        id: 'u1',
        name: 'Alex Morgan',
        role: 'Lead Developer',
        avatar: '/avatars/alex.jpg'
      },
      {
        id: 'u4',
        name: 'Jordan Lee',
        role: 'UX Designer',
        avatar: '/avatars/jordan.jpg'
      }
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Design System Complete',
        dueDate: new Date(2023, 9, 20),
        isComplete: true
      },
      {
        id: 'm2',
        title: 'Backend API Development',
        dueDate: new Date(2023, 10, 15),
        isComplete: true
      },
      {
        id: 'm3',
        title: 'Frontend Implementation',
        dueDate: new Date(2023, 11, 1),
        isComplete: false
      },
      {
        id: 'm4',
        title: 'QA & Testing',
        dueDate: new Date(2023, 11, 10),
        isComplete: false
      }
    ]
  },
  {
    id: 'l2',
    name: 'Mobile App Launch',
    description: 'First release of our dedicated mobile application',
    phase: 'post_launch',
    startDate: new Date(2023, 6, 1),
    targetLaunchDate: new Date(2023, 8, 15),
    actualLaunchDate: new Date(2023, 8, 12),
    progress: 100,
    features: ['f5'],
    owner: {
      id: 'u7',
      name: 'Riley Smith',
      role: 'Product Manager',
      avatar: '/avatars/riley.jpg'
    },
    teamMembers: [
      {
        id: 'u3',
        name: 'Taylor Kim',
        role: 'Mobile Developer',
        avatar: '/avatars/taylor.jpg'
      },
      {
        id: 'u8',
        name: 'Casey Jones',
        role: 'QA Engineer',
        avatar: '/avatars/casey.jpg'
      }
    ],
    milestones: [
      {
        id: 'm5',
        title: 'App Architecture Definition',
        dueDate: new Date(2023, 6, 15),
        isComplete: true
      },
      {
        id: 'm6',
        title: 'Core Functionality Development',
        dueDate: new Date(2023, 7, 15),
        isComplete: true
      },
      {
        id: 'm7',
        title: 'Beta Testing',
        dueDate: new Date(2023, 8, 1),
        isComplete: true
      },
      {
        id: 'm8',
        title: 'App Store Submission',
        dueDate: new Date(2023, 8, 8),
        isComplete: true
      }
    ]
  },
  {
    id: 'l3',
    name: 'Bulk Order System',
    description: 'New system for processing and managing high-volume bulk orders',
    phase: 'beta',
    startDate: new Date(2023, 8, 1),
    targetLaunchDate: new Date(2023, 11, 30),
    progress: 75,
    features: ['f1'],
    owner: {
      id: 'u9',
      name: 'Avery Washington',
      role: 'Product Manager',
      avatar: '/avatars/avery.jpg'
    },
    teamMembers: [
      {
        id: 'u1',
        name: 'Alex Morgan',
        role: 'Lead Developer',
        avatar: '/avatars/alex.jpg'
      },
      {
        id: 'u10',
        name: 'Dylan Patel',
        role: 'Backend Developer',
        avatar: '/avatars/dylan.jpg'
      }
    ],
    milestones: [
      {
        id: 'm9',
        title: 'Requirements Gathering',
        dueDate: new Date(2023, 8, 15),
        isComplete: true
      },
      {
        id: 'm10',
        title: 'Database Schema Design',
        dueDate: new Date(2023, 9, 1),
        isComplete: true
      },
      {
        id: 'm11',
        title: 'API Development',
        dueDate: new Date(2023, 10, 15),
        isComplete: true
      },
      {
        id: 'm12',
        title: 'UI Implementation',
        dueDate: new Date(2023, 11, 15),
        isComplete: false
      }
    ]
  }
];

// Helper Functions
const getStatusLabel = (status: FeatureStatus): string => {
  const statusMap: Record<FeatureStatus, string> = {
    idea: 'Idea',
    planning: 'Planning',
    in_progress: 'In Progress',
    testing: 'Testing',
    released: 'Released'
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: FeatureStatus): string => {
  const colorMap: Record<FeatureStatus, string> = {
    idea: 'bg-blue-100 text-blue-700',
    planning: 'bg-purple-100 text-purple-700',
    in_progress: 'bg-amber-100 text-amber-700',
    testing: 'bg-orange-100 text-orange-700',
    released: 'bg-green-100 text-green-700'
  };
  return colorMap[status] || '';
};

const getPriorityLabel = (priority: FeaturePriority): string => {
  const priorityMap: Record<FeaturePriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };
  return priorityMap[priority] || priority;
};

const getPriorityColor = (priority: FeaturePriority): string => {
  const colorMap: Record<FeaturePriority, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700'
  };
  return colorMap[priority] || '';
};

const getFeedbackStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    new: 'New',
    under_review: 'Under Review',
    planned: 'Planned',
    in_progress: 'In Progress',
    completed: 'Completed',
    wont_do: 'Won\'t Do'
  };
  return statusMap[status] || status;
};

const getFeedbackStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    under_review: 'bg-purple-100 text-purple-700',
    planned: 'bg-indigo-100 text-indigo-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    wont_do: 'bg-gray-100 text-gray-700'
  };
  return colorMap[status] || '';
};

const getIdeaStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    under_review: 'bg-purple-100 text-purple-700',
    approved: 'bg-green-100 text-green-700',
    declined: 'bg-gray-100 text-gray-700'
  };
  return colorMap[status] || '';
};

const getSourceColor = (source: string): string => {
  const colorMap: Record<string, string> = {
    team: 'bg-indigo-100 text-indigo-700',
    customer: 'bg-green-100 text-green-700',
    partner: 'bg-amber-100 text-amber-700',
    investor: 'bg-blue-100 text-blue-700',
    ai: 'bg-purple-100 text-purple-700'
  };
  return colorMap[source] || '';
};

const getImpactColor = (impact: string): string => {
  const colorMap: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700'
  };
  return colorMap[impact] || '';
};

const getLaunchPhaseColor = (phase: LaunchPhase): string => {
  const colorMap: Record<LaunchPhase, string> = {
    planning: 'bg-blue-100 text-blue-700',
    development: 'bg-purple-100 text-purple-700',
    beta: 'bg-amber-100 text-amber-700',
    soft_launch: 'bg-indigo-100 text-indigo-700',
    full_launch: 'bg-green-100 text-green-700',
    post_launch: 'bg-gray-100 text-gray-700'
  };
  return colorMap[phase] || '';
};

// Component Implementations
function FeatureCard({ feature }: { feature: Feature }) {
  const [votes, setVotes] = useState(feature.votes);
  const [hasVoted, setHasVoted] = useState(feature.hasVoted || false);

  const handleVote = () => {
    if (hasVoted) {
      setVotes(votes - 1);
      setHasVoted(false);
    } else {
      setVotes(votes + 1);
      setHasVoted(true);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${getStatusColor(feature.status)}`}>
                {feature.status === 'idea' && <Lightbulb className="h-3.5 w-3.5" />}
                {feature.status === 'planning' && <FileText className="h-3.5 w-3.5" />}
                {feature.status === 'in_progress' && <Activity className="h-3.5 w-3.5" />}
                {feature.status === 'testing' && <GitMerge className="h-3.5 w-3.5" />}
                {feature.status === 'released' && <Rocket className="h-3.5 w-3.5" />}
              </div>
              <Badge variant="outline" className={getStatusColor(feature.status)}>
                {getStatusLabel(feature.status)}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(feature.priority)}>
                {getPriorityLabel(feature.priority)}
              </Badge>
            </div>
            <CardTitle className="mt-2">{feature.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Feature</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Change Status</DropdownMenuItem>
              <DropdownMenuItem>Add to Launch Plan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete Feature
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{feature.description}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {feature.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {feature.progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Progress</span>
              <span>{feature.progress}%</span>
            </div>
            <Progress value={feature.progress} className="h-2" />
          </div>
        )}
        
        {feature.assignedTo && (
          <div className="flex items-center mt-4">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={feature.assignedTo.avatar} />
              <AvatarFallback>{feature.assignedTo.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{feature.assignedTo.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-1">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1 h-8 ${hasVoted ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={handleVote}
          >
            <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-primary' : ''}`} />
            <span>{votes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 h-8 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{feature.commentCount}</span>
          </Button>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          {feature.targetDate ? (
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Due {feature.targetDate.toLocaleDateString()}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Created {feature.createdAt.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function FeedbackItem({ feedback }: { feedback: Feedback }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getFeedbackStatusColor(feedback.status)}>
              {getFeedbackStatus(feedback.status)}
            </Badge>
            <Badge variant="outline">
              {feedback.type === 'bug' ? 'Bug' : 
               feedback.type === 'feature_request' ? 'Feature Request' : 
               feedback.type === 'improvement' ? 'Improvement' : 
               feedback.type === 'praise' ? 'Praise' : 
               'Other'}
            </Badge>
          </div>
          <Badge variant="outline">{feedback.product}</Badge>
        </div>
        <CardTitle className="text-base mt-2">{feedback.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{feedback.description}</p>
        
        <div className="flex items-center mt-4">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={feedback.customer.avatar} />
            <AvatarFallback>{feedback.customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{feedback.customer.name}</div>
            {feedback.customer.company && (
              <div className="text-xs text-muted-foreground">{feedback.customer.company}</div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-1">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1 h-8 text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>{feedback.votes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 h-8 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{feedback.comments}</span>
          </Button>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{feedback.createdAt.toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

function IdeaCard({ idea }: { idea: IdeaVaultItem }) {
  const totalVotes = Object.values(idea.votes).reduce((acc, count) => acc + count, 0);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getIdeaStatusColor(idea.status)}>
              {idea.status === 'new' ? 'New' : 
               idea.status === 'under_review' ? 'Under Review' : 
               idea.status === 'approved' ? 'Approved' : 
               'Declined'}
            </Badge>
            <Badge variant="outline" className={getSourceColor(idea.source)}>
              {idea.source === 'team' ? 'Team' : 
               idea.source === 'customer' ? 'Customer' : 
               idea.source === 'partner' ? 'Partner' : 
               idea.source === 'investor' ? 'Investor' : 
               'AI Generated'}
            </Badge>
          </div>
          <Badge variant="outline" className={getImpactColor(idea.potentialImpact)}>
            {idea.potentialImpact.charAt(0).toUpperCase() + idea.potentialImpact.slice(1)} Impact
          </Badge>
        </div>
        <CardTitle className="text-base mt-2">{idea.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{idea.description}</p>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {idea.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="bg-blue-50 rounded p-2 text-center">
            <div className="text-sm font-medium text-blue-700">{idea.votes.team}</div>
            <div className="text-xs text-blue-600">Team</div>
          </div>
          <div className="bg-green-50 rounded p-2 text-center">
            <div className="text-sm font-medium text-green-700">{idea.votes.customer}</div>
            <div className="text-xs text-green-600">Customer</div>
          </div>
          <div className="bg-amber-50 rounded p-2 text-center">
            <div className="text-sm font-medium text-amber-700">{idea.votes.partner}</div>
            <div className="text-xs text-amber-600">Partner</div>
          </div>
          <div className="bg-purple-50 rounded p-2 text-center">
            <div className="text-sm font-medium text-purple-700">{idea.votes.investor}</div>
            <div className="text-xs text-purple-600">Investor</div>
          </div>
        </div>
        
        <div className="flex items-center mt-4">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={idea.createdBy.avatar} />
            <AvatarFallback>{idea.createdBy.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{idea.createdBy.name}</div>
            <div className="text-xs text-muted-foreground">{idea.createdBy.role}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1 h-8 text-muted-foreground">
            <Vote className="h-4 w-4" />
            <span>{totalVotes} total votes</span>
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function LaunchCard({ launch }: { launch: LaunchPlan }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getLaunchPhaseColor(launch.phase)}>
            {launch.phase === 'planning' ? 'Planning' : 
             launch.phase === 'development' ? 'Development' : 
             launch.phase === 'beta' ? 'Beta Testing' : 
             launch.phase === 'soft_launch' ? 'Soft Launch' : 
             launch.phase === 'full_launch' ? 'Full Launch' : 
             'Post Launch'}
          </Badge>
          <div className="text-sm flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            {launch.targetLaunchDate.toLocaleDateString()}
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{launch.name}</CardTitle>
        <CardDescription>{launch.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Progress</span>
            <span>{launch.progress}%</span>
          </div>
          <Progress value={launch.progress} className="h-2" />
        </div>
        
        <div className="space-y-3">
          <div className="text-sm font-medium">Milestones</div>
          {launch.milestones.map(milestone => (
            <div key={milestone.id} className="flex items-center">
              <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-2 ${
                milestone.isComplete ? 'bg-green-100 border-green-200 text-green-700' : 'bg-muted border-border'
              }`}>
                {milestone.isComplete && <Check className="h-3 w-3" />}
              </div>
              <div className="flex-1">
                <div className={`text-sm ${milestone.isComplete ? 'line-through text-muted-foreground' : ''}`}>
                  {milestone.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  Due {milestone.dueDate.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t flex justify-between">
        <div className="flex -space-x-2">
          <Avatar className="h-7 w-7 border-2 border-background">
            <AvatarImage src={launch.owner.avatar} />
            <AvatarFallback>{launch.owner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {launch.teamMembers.slice(0, 2).map(member => (
            <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {launch.teamMembers.length > 2 && (
            <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
              +{launch.teamMembers.length - 2}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ProductRnD() {
  const [activeTab, setActiveTab] = useState("roadmap");
  const [featureStatusFilter, setFeatureStatusFilter] = useState<FeatureStatus | "all">("all");
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState<FeedbackType | "all">("all");
  const [ideaStatusFilter, setIdeaStatusFilter] = useState<string | "all">("all");
  const [launchStatusFilter, setLaunchStatusFilter] = useState<LaunchPhase | "all">("all");
  
  // Filter features based on selected status
  const filteredFeatures = featureStatusFilter === "all" 
    ? sampleFeatures 
    : sampleFeatures.filter(f => f.status === featureStatusFilter);
    
  // Filter feedback based on selected type
  const filteredFeedback = feedbackTypeFilter === "all"
    ? sampleFeedback
    : sampleFeedback.filter(f => f.type === feedbackTypeFilter);
    
  // Filter ideas based on selected status
  const filteredIdeas = ideaStatusFilter === "all"
    ? sampleIdeas
    : sampleIdeas.filter(i => i.status === ideaStatusFilter);
    
  // Filter launches based on selected phase
  const filteredLaunches = launchStatusFilter === "all"
    ? sampleLaunches
    : sampleLaunches.filter(l => l.phase === launchStatusFilter);

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product & R&D</h1>
          <p className="text-muted-foreground">Manage product roadmap, customer feedback, and launch plans</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                New Feature
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Feature</DialogTitle>
                <DialogDescription>
                  Create a new feature to add to your product roadmap
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Feature Title</Label>
                  <Input id="title" placeholder="Enter feature title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the feature..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="idea">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Idea</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="released">Released</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="e.g. mobile, ux, customer-facing" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Feature</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>More</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New Feedback</DropdownMenuItem>
              <DropdownMenuItem>New Idea</DropdownMenuItem>
              <DropdownMenuItem>New Launch Plan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Import Features</DropdownMenuItem>
              <DropdownMenuItem>Export Roadmap</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="roadmap" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="roadmap" className="gap-1">
              <GitMerge className="h-4 w-4" />
              Feature Roadmap
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              Feedback Loop
            </TabsTrigger>
            <TabsTrigger value="ideas" className="gap-1">
              <Lightbulb className="h-4 w-4" />
              Idea Vault
            </TabsTrigger>
            <TabsTrigger value="launches" className="gap-1">
              <Rocket className="h-4 w-4" />
              Launch Library
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {activeTab === "roadmap" && (
              <Select 
                value={featureStatusFilter} 
                onValueChange={(value) => setFeatureStatusFilter(value as FeatureStatus | "all")}
              >
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                </SelectContent>
              </Select>
            )}
            {activeTab === "feedback" && (
              <Select 
                value={feedbackTypeFilter} 
                onValueChange={(value) => setFeedbackTypeFilter(value as FeedbackType | "all")}
              >
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bug">Bugs</SelectItem>
                  <SelectItem value="feature_request">Feature Requests</SelectItem>
                  <SelectItem value="improvement">Improvements</SelectItem>
                  <SelectItem value="praise">Praise</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
            {activeTab === "ideas" && (
              <Select 
                value={ideaStatusFilter} 
                onValueChange={(value) => setIdeaStatusFilter(value as string | "all")}
              >
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            )}
            {activeTab === "launches" && (
              <Select 
                value={launchStatusFilter} 
                onValueChange={(value) => setLaunchStatusFilter(value as LaunchPhase | "all")}
              >
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Filter by phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="beta">Beta Testing</SelectItem>
                  <SelectItem value="soft_launch">Soft Launch</SelectItem>
                  <SelectItem value="full_launch">Full Launch</SelectItem>
                  <SelectItem value="post_launch">Post Launch</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="roadmap" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeedback.map(feedback => (
              <FeedbackItem key={feedback.id} feedback={feedback} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ideas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="launches" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaunches.map(launch => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}