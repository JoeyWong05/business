import React, { useState } from 'react';
import { 
  Hammer, 
  Plus, 
  Rocket, 
  Edit, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  ThumbsUp, 
  Filter,
  Calendar,
  Clock,
  Users,
  Lightbulb,
  Sparkles,
  Tag,
  ListFilter,
  CheckCircle2,
  CircleDashed
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDemoMode } from '@/hooks/use-demo-mode';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

// Feature stage options
enum FeatureStage {
  IDEA = 'idea',
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  LAUNCHED = 'launched'
}

// Feature type options
enum FeatureType {
  NEW_FEATURE = 'new_feature',
  ENHANCEMENT = 'enhancement',
  BUG_FIX = 'bug_fix',
  INFRASTRUCTURE = 'infrastructure'
}

// Feature priority options
enum FeaturePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface Feature {
  id: string;
  title: string;
  description: string;
  stage: FeatureStage;
  priority: FeaturePriority;
  type: FeatureType;
  votes: number;
  comments: number;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  progress?: number;
  tags: string[];
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Demo data for features
const DEMO_FEATURES: Feature[] = [
  {
    id: 'f1',
    title: 'AI-Powered Marketing Assistant',
    description: 'Integrate GPT-4 to generate marketing content, email copy, and social media posts automatically based on brand guidelines.',
    stage: FeatureStage.IN_PROGRESS,
    priority: FeaturePriority.HIGH,
    type: FeatureType.NEW_FEATURE,
    votes: 24,
    comments: 8,
    assignee: {
      id: 'u1',
      name: 'Emily Chen',
    },
    dueDate: '2023-12-15',
    progress: 65,
    tags: ['ai', 'marketing', 'automation'],
    createdAt: '2023-09-12T14:30:00Z',
    createdBy: {
      id: 'u2',
      name: 'David Kim',
    }
  },
  {
    id: 'f2',
    title: 'Advanced Analytics Dashboard',
    description: 'Create a comprehensive analytics dashboard with customizable widgets and real-time data visualization.',
    stage: FeatureStage.PLANNING,
    priority: FeaturePriority.MEDIUM,
    type: FeatureType.ENHANCEMENT,
    votes: 18,
    comments: 12,
    assignee: {
      id: 'u3',
      name: 'Sarah Johnson',
    },
    dueDate: '2024-01-30',
    progress: 25,
    tags: ['analytics', 'dashboard', 'data'],
    createdAt: '2023-10-05T09:15:00Z',
    createdBy: {
      id: 'u4',
      name: 'Michael Lee',
    }
  },
  {
    id: 'f3',
    title: 'Mobile App Performance Optimization',
    description: 'Improve load times and reduce memory usage in the mobile app for better user experience.',
    stage: FeatureStage.TESTING,
    priority: FeaturePriority.HIGH,
    type: FeatureType.BUG_FIX,
    votes: 15,
    comments: 6,
    assignee: {
      id: 'u5',
      name: 'Alex Taylor',
    },
    dueDate: '2023-11-20',
    progress: 90,
    tags: ['mobile', 'performance', 'optimization'],
    createdAt: '2023-10-18T11:45:00Z',
    createdBy: {
      id: 'u6',
      name: 'Jessica Brown',
    }
  },
  {
    id: 'f4',
    title: 'Integration with Shopify',
    description: 'Create a seamless integration with Shopify to sync products, orders, and customer data.',
    stage: FeatureStage.LAUNCHED,
    priority: FeaturePriority.MEDIUM,
    type: FeatureType.NEW_FEATURE,
    votes: 32,
    comments: 14,
    assignee: {
      id: 'u7',
      name: 'Ryan Wilson',
    },
    dueDate: '2023-10-30',
    progress: 100,
    tags: ['integration', 'e-commerce', 'shopify'],
    createdAt: '2023-08-22T13:20:00Z',
    createdBy: {
      id: 'u8',
      name: 'Nicole Martinez',
    }
  },
  {
    id: 'f5',
    title: 'Customizable Email Templates',
    description: 'Develop a library of customizable email templates for various marketing and customer communication scenarios.',
    stage: FeatureStage.IDEA,
    priority: FeaturePriority.LOW,
    type: FeatureType.ENHANCEMENT,
    votes: 9,
    comments: 3,
    tags: ['email', 'templates', 'marketing'],
    createdAt: '2023-10-25T15:10:00Z',
    createdBy: {
      id: 'u9',
      name: 'Brian Parker',
    }
  },
  {
    id: 'f6',
    title: 'Database Performance Optimization',
    description: 'Optimize database queries and implement caching to improve overall system performance.',
    stage: FeatureStage.IN_PROGRESS,
    priority: FeaturePriority.CRITICAL,
    type: FeatureType.INFRASTRUCTURE,
    votes: 12,
    comments: 7,
    assignee: {
      id: 'u10',
      name: 'Jennifer Liu',
    },
    dueDate: '2023-11-30',
    progress: 40,
    tags: ['database', 'performance', 'infrastructure'],
    createdAt: '2023-10-10T10:30:00Z',
    createdBy: {
      id: 'u11',
      name: 'Robert Chen',
    }
  },
  {
    id: 'f7',
    title: 'Multi-language Support',
    description: 'Add support for multiple languages to expand our market reach globally.',
    stage: FeatureStage.PLANNING,
    priority: FeaturePriority.MEDIUM,
    type: FeatureType.ENHANCEMENT,
    votes: 28,
    comments: 15,
    assignee: {
      id: 'u12',
      name: 'Laura Garcia',
    },
    dueDate: '2024-02-15',
    progress: 10,
    tags: ['localization', 'international', 'language'],
    createdAt: '2023-10-20T14:00:00Z',
    createdBy: {
      id: 'u13',
      name: 'Daniel Kim',
    }
  },
  {
    id: 'f8',
    title: 'Customer Feedback Portal',
    description: 'Develop a dedicated portal for customers to submit feedback, feature requests, and bug reports.',
    stage: FeatureStage.TESTING,
    priority: FeaturePriority.HIGH,
    type: FeatureType.NEW_FEATURE,
    votes: 21,
    comments: 9,
    assignee: {
      id: 'u14',
      name: 'Chris Johnson',
    },
    dueDate: '2023-12-05',
    progress: 85,
    tags: ['feedback', 'customer', 'portal'],
    createdAt: '2023-09-30T11:20:00Z',
    createdBy: {
      id: 'u15',
      name: 'Stephanie Wong',
    }
  }
];

// Helper function to get stage label
const getStageLabel = (stage: FeatureStage): string => {
  switch(stage) {
    case FeatureStage.IDEA: return 'Idea';
    case FeatureStage.PLANNING: return 'Planning';
    case FeatureStage.IN_PROGRESS: return 'In Progress';
    case FeatureStage.TESTING: return 'Testing';
    case FeatureStage.LAUNCHED: return 'Launched';
    default: return 'Unknown';
  }
};

// Helper function to get stage icon
const getStageIcon = (stage: FeatureStage) => {
  switch(stage) {
    case FeatureStage.IDEA: return <Lightbulb className="h-4 w-4" />;
    case FeatureStage.PLANNING: return <Calendar className="h-4 w-4" />;
    case FeatureStage.IN_PROGRESS: return <Clock className="h-4 w-4" />;
    case FeatureStage.TESTING: return <CircleDashed className="h-4 w-4" />;
    case FeatureStage.LAUNCHED: return <CheckCircle2 className="h-4 w-4" />;
    default: return null;
  }
};

// Helper function to get priority badge variant
const getPriorityVariant = (priority: FeaturePriority): string => {
  switch(priority) {
    case FeaturePriority.LOW: return 'outline';
    case FeaturePriority.MEDIUM: return 'secondary';
    case FeaturePriority.HIGH: return 'warning';
    case FeaturePriority.CRITICAL: return 'destructive';
    default: return 'outline';
  }
};

// Helper function to get type badge variant
const getTypeVariant = (type: FeatureType): string => {
  switch(type) {
    case FeatureType.NEW_FEATURE: return 'default';
    case FeatureType.ENHANCEMENT: return 'secondary';
    case FeatureType.BUG_FIX: return 'destructive';
    case FeatureType.INFRASTRUCTURE: return 'outline';
    default: return 'outline';
  }
};

// Feature Card Component
const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={getPriorityVariant(feature.priority)} className="capitalize">
                {feature.priority.replace('_', ' ')}
              </Badge>
              <Badge variant={getTypeVariant(feature.type)} className="capitalize">
                {feature.type.replace('_', ' ')}
              </Badge>
              {feature.tags.map(tag => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Feature</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ChevronUp className="mr-2 h-4 w-4" />
                <span>Move to Next Stage</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ChevronDown className="mr-2 h-4 w-4" />
                <span>Move to Previous Stage</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Feature</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
        {feature.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{feature.progress}%</span>
            </div>
            <Progress value={feature.progress} className="h-2" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{feature.votes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{feature.comments}</span>
            </div>
          </div>
          {feature.dueDate && (
            <div className="text-sm text-muted-foreground">
              Due: {new Date(feature.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{feature.createdBy.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Created by {feature.createdBy.name}
            </span>
          </div>
          {feature.assignee && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Assigned to</span>
              <Avatar className="h-6 w-6">
                <AvatarFallback>{feature.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// New Feature Dialog Component
const NewFeatureDialog: React.FC<{ onAdd: (feature: Partial<Feature>) => void }> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<FeatureStage>(FeatureStage.IDEA);
  const [priority, setPriority] = useState<FeaturePriority>(FeaturePriority.MEDIUM);
  const [type, setType] = useState<FeatureType>(FeatureType.NEW_FEATURE);
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onAdd({
      title,
      description,
      stage,
      priority,
      type,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    
    setTitle('');
    setDescription('');
    setStage(FeatureStage.IDEA);
    setPriority(FeaturePriority.MEDIUM);
    setType(FeatureType.NEW_FEATURE);
    setTags('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Feature
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Feature</DialogTitle>
          <DialogDescription>
            Create a new feature, enhancement, or bug fix for your product roadmap.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Feature title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe the feature..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="stage" className="text-sm font-medium">
                Stage
              </label>
              <Select
                value={stage}
                onValueChange={(value) => setStage(value as FeatureStage)}
              >
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(FeatureStage).map((s) => (
                    <SelectItem key={s} value={s}>
                      {getStageLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as FeaturePriority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(FeaturePriority).map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as FeatureType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(FeatureType).map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                placeholder="ui, mobile, auth..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Feature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Filter Component
const FeatureFilters: React.FC<{
  activeFilters: any;
  onFilterChange: (filters: any) => void;
}> = ({ activeFilters, onFilterChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select
              value={activeFilters.type || "all"}
              onValueChange={(value) => onFilterChange({ ...activeFilters, type: value === "all" ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(FeatureType).map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select
              value={activeFilters.priority || "all"}
              onValueChange={(value) => onFilterChange({ ...activeFilters, priority: value === "all" ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.values(FeaturePriority).map((priority) => (
                  <SelectItem key={priority} value={priority} className="capitalize">
                    {priority.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={activeFilters.sortBy || "votes"}
              onValueChange={(value) => onFilterChange({ ...activeFilters, sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Search Tags</label>
          <div className="flex gap-2 mt-2">
            {['ui', 'mobile', 'performance', 'analytics', 'api', 'security'].map(tag => (
              <Badge 
                key={tag} 
                variant={activeFilters.tags?.includes(tag) ? 'default' : 'outline'} 
                className="cursor-pointer capitalize"
                onClick={() => {
                  const currentTags = activeFilters.tags || [];
                  const newTags = currentTags.includes(tag) 
                    ? currentTags.filter((t: string) => t !== tag)
                    : [...currentTags, tag];
                  onFilterChange({ ...activeFilters, tags: newTags.length ? newTags : null });
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onFilterChange({ sortBy: 'votes' })}
          className="ml-auto"
        >
          Clear Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main Builder Mode Component
const BuilderMode = () => {
  const { demoMode } = useDemoMode();
  const [features, setFeatures] = useState<Feature[]>(DEMO_FEATURES);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: 'votes',
    tags: null,
    type: null,
    priority: null
  });
  
  // Function to filter and sort features based on activeFilters
  const getFilteredFeatures = () => {
    if (!demoMode) return [];
    
    return features.filter(feature => {
      // Filter by type
      if (activeFilters.type && feature.type !== activeFilters.type) {
        return false;
      }
      
      // Filter by priority
      if (activeFilters.priority && feature.priority !== activeFilters.priority) {
        return false;
      }
      
      // Filter by tags
      if (activeFilters.tags && activeFilters.tags.length > 0) {
        if (!activeFilters.tags.some((tag: string) => feature.tags.includes(tag))) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by selected criteria
      switch(activeFilters.sortBy) {
        case 'votes':
          return b.votes - a.votes;
        case 'comments':
          return b.comments - a.comments;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          const priorityOrder = {
            [FeaturePriority.CRITICAL]: 0,
            [FeaturePriority.HIGH]: 1,
            [FeaturePriority.MEDIUM]: 2,
            [FeaturePriority.LOW]: 3
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });
  };
  
  // Calculate features for each stage
  const ideaFeatures = getFilteredFeatures().filter(f => f.stage === FeatureStage.IDEA);
  const planningFeatures = getFilteredFeatures().filter(f => f.stage === FeatureStage.PLANNING);
  const inProgressFeatures = getFilteredFeatures().filter(f => f.stage === FeatureStage.IN_PROGRESS);
  const testingFeatures = getFilteredFeatures().filter(f => f.stage === FeatureStage.TESTING);
  const launchedFeatures = getFilteredFeatures().filter(f => f.stage === FeatureStage.LAUNCHED);
  
  // Handler for adding a new feature
  const handleAddFeature = (newFeature: Partial<Feature>) => {
    if (!demoMode) return;
    
    const feature: Feature = {
      id: `f${features.length + 1}`,
      title: newFeature.title || 'Untitled Feature',
      description: newFeature.description || '',
      stage: newFeature.stage || FeatureStage.IDEA,
      priority: newFeature.priority || FeaturePriority.MEDIUM,
      type: newFeature.type || FeatureType.NEW_FEATURE,
      votes: 0,
      comments: 0,
      tags: newFeature.tags || [],
      createdAt: new Date().toISOString(),
      createdBy: {
        id: 'current-user',
        name: 'Current User',
      }
    };
    
    setFeatures([feature, ...features]);
  };
  
  return (
    <div className="container px-4 mx-auto max-w-7xl space-y-8">
      <PageHeader 
        title="Builder Mode" 
        subtitle="Product & R&D roadmap, feedback, and feature planning"
        icon={<Hammer className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            {demoMode && <NewFeatureDialog onAdd={handleAddFeature} />}
            <Button variant="outline">
              <Rocket className="h-4 w-4 mr-2" />
              View Roadmap
            </Button>
          </div>
        }
      />
      
      {demoMode ? (
        <>
          <FeatureFilters 
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
          
          <Tabs defaultValue="kanban" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="bg-card">
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4" />
                  Kanban View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="ideas" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Idea Vault
                </TabsTrigger>
              </TabsList>
              
              <div className="text-sm text-muted-foreground">
                {getFilteredFeatures().length} features
              </div>
            </div>
            
            <TabsContent value="kanban" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Idea Stage */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-card p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <h3 className="font-medium">Ideas</h3>
                    </div>
                    <Badge variant="outline">{ideaFeatures.length}</Badge>
                  </div>
                  {ideaFeatures.map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
                
                {/* Planning Stage */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-card p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <h3 className="font-medium">Planning</h3>
                    </div>
                    <Badge variant="outline">{planningFeatures.length}</Badge>
                  </div>
                  {planningFeatures.map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
                
                {/* In Progress Stage */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-card p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <h3 className="font-medium">In Progress</h3>
                    </div>
                    <Badge variant="outline">{inProgressFeatures.length}</Badge>
                  </div>
                  {inProgressFeatures.map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
                
                {/* Testing Stage */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-card p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <CircleDashed className="h-4 w-4 text-orange-500" />
                      <h3 className="font-medium">Testing</h3>
                    </div>
                    <Badge variant="outline">{testingFeatures.length}</Badge>
                  </div>
                  {testingFeatures.map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
                
                {/* Launched Stage */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-card p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <h3 className="font-medium">Launched</h3>
                    </div>
                    <Badge variant="outline">{launchedFeatures.length}</Badge>
                  </div>
                  {launchedFeatures.map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>All Features</CardTitle>
                  <CardDescription>
                    List view of all features across all stages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getFilteredFeatures().map(feature => (
                      <div key={feature.id} className="flex justify-between items-center p-3 border rounded-md bg-card hover:bg-accent/50 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="whitespace-nowrap">
                            {getStageLabel(feature.stage)}
                          </Badge>
                          <div>
                            <h4 className="font-medium">{feature.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant={getPriorityVariant(feature.priority)} className="capitalize text-xs">
                                {feature.priority.replace('_', ' ')}
                              </Badge>
                              <span>•</span>
                              <span>Votes: {feature.votes}</span>
                              <span>•</span>
                              <span>Comments: {feature.comments}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {feature.assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{feature.assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ideas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Idea Vault
                      </CardTitle>
                      <CardDescription>
                        Collect and vote on ideas before they enter the development pipeline
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {ideaFeatures.map(feature => (
                          <div key={feature.id} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex flex-col items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <span className="font-medium">{feature.votes}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                            <div>
                              <h4 className="font-medium">{feature.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {feature.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="capitalize">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 mt-3">
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Comment
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                  Submitted by {feature.createdBy.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit New Idea</CardTitle>
                      <CardDescription>
                        Share your ideas for features or improvements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <Input placeholder="Your idea in a few words..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea placeholder="Describe your idea in detail..." rows={4} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Tags</label>
                          <Input placeholder="ui, mobile, performance..." />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Submit Idea
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Top Contributors
                      </CardTitle>
                      <CardDescription>
                        Users with the most submitted and implemented ideas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: 'Sarah Johnson', ideas: 12, implemented: 5, avatar: '' },
                          { name: 'David Kim', ideas: 8, implemented: 4, avatar: '' },
                          { name: 'Emily Chen', ideas: 7, implemented: 3, avatar: '' },
                          { name: 'Michael Lee', ideas: 6, implemented: 3, avatar: '' },
                        ].map((contributor, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-sm font-medium">{contributor.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {contributor.ideas} ideas, {contributor.implemented} implemented
                                </p>
                              </div>
                            </div>
                            <Badge variant={index === 0 ? 'default' : 'outline'}>
                              #{index + 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <Hammer className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No Data Available</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Enable demo mode to explore the Builder Mode features or connect your product management system
            to visualize your actual product roadmap.
          </p>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => window.location.href = '/intelligence/personalization'}>
              Customize Dashboard
            </Button>
            <Button>Connect Data Source</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BuilderMode;