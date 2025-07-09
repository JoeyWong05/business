import React, { useState } from 'react';
import { 
  Activity,
  AlignLeft,
  ArrowRight,
  AtSign,
  Bell,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  Edit2,
  ExternalLink,
  File,
  FileText,
  Filter,
  Flag,
  GalleryVertical,
  Hash,
  Heart,
  HelpCircle,
  Image,
  Info,
  Link2,
  Loader2,
  Lock,
  LucideIcon,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Rocket,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  Smile,
  Square,
  Star,
  ThumbsUp,
  Timer,
  Trash,
  Upload,
  User,
  Users,
  X,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

// Type definitions
interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline' | 'do-not-disturb';
  department?: string;
  email?: string;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'team' | 'project' | 'topic' | 'direct' | 'company';
  isPrivate: boolean;
  members: string[];
  unreadCount?: number;
  lastActivity?: Date;
  pinnedItems?: string[];
}

interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  reactions?: Record<string, string[]>;
  mentions?: string[];
  attachments?: {
    id: string;
    type: 'image' | 'file' | 'link';
    name: string;
    url: string;
    previewUrl?: string;
    size?: string;
  }[];
  thread?: Message[];
  isPinned?: boolean;
}

interface DailyUpdate {
  id: string;
  userId: string;
  date: Date;
  accomplished: string[];
  working_on: string[];
  blockers: string[];
  notes?: string;
  mood?: 'great' | 'good' | 'okay' | 'stressed' | 'blocked';
  comments?: Message[];
  isPrivate?: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assignees: string[];
  createdBy: string;
  createdAt: Date;
  tags?: string[];
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
  comments?: Message[];
}

interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  url?: string;
  description?: string;
  attendees: string[];
  organizer: string;
  agenda?: string[];
  notes?: string;
  recurring?: boolean;
  recurringPattern?: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    role: 'Product Manager',
    avatar: '/avatars/alex.jpg',
    status: 'online',
    department: 'Product',
    email: 'alex@company.com'
  },
  {
    id: 'u2',
    name: 'Taylor Smith',
    role: 'Lead Developer',
    avatar: '/avatars/taylor.jpg',
    status: 'online',
    department: 'Engineering',
    email: 'taylor@company.com'
  },
  {
    id: 'u3',
    name: 'Jordan Lee',
    role: 'UI/UX Designer',
    avatar: '/avatars/jordan.jpg',
    status: 'away',
    department: 'Design',
    email: 'jordan@company.com'
  },
  {
    id: 'u4',
    name: 'Morgan Chen',
    role: 'Marketing Director',
    avatar: '/avatars/morgan.jpg',
    status: 'do-not-disturb',
    department: 'Marketing',
    email: 'morgan@company.com'
  },
  {
    id: 'u5',
    name: 'Riley Wilson',
    role: 'Sales Manager',
    avatar: '/avatars/riley.jpg',
    status: 'offline',
    department: 'Sales',
    email: 'riley@company.com'
  },
  {
    id: 'u6',
    name: 'Casey Patel',
    role: 'Customer Support',
    avatar: '/avatars/casey.jpg',
    status: 'online',
    department: 'Support',
    email: 'casey@company.com'
  }
];

const mockChannels: Channel[] = [
  {
    id: 'c1',
    name: 'team-announcements',
    description: 'Company-wide announcements and news',
    type: 'company',
    isPrivate: false,
    members: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    lastActivity: new Date(Date.now() - 3600000 * 2)
  },
  {
    id: 'c2',
    name: 'general',
    description: 'General team discussions',
    type: 'team',
    isPrivate: false,
    members: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    unreadCount: 5,
    lastActivity: new Date(Date.now() - 3600000 * 1)
  },
  {
    id: 'c3',
    name: 'design-team',
    description: 'Design team discussions and updates',
    type: 'team',
    isPrivate: true,
    members: ['u1', 'u3', 'u4'],
    lastActivity: new Date(Date.now() - 3600000 * 4)
  },
  {
    id: 'c4',
    name: 'product-launch',
    description: 'Discussions about the upcoming product launch',
    type: 'project',
    isPrivate: false,
    members: ['u1', 'u2', 'u3', 'u4', 'u5'],
    unreadCount: 2,
    lastActivity: new Date(Date.now() - 3600000 * 0.5)
  },
  {
    id: 'c5',
    name: 'random',
    description: 'Off-topic conversations',
    type: 'topic',
    isPrivate: false,
    members: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    lastActivity: new Date(Date.now() - 3600000 * 12)
  }
];

const mockMessages: Record<string, Message[]> = {
  'c2': [
    {
      id: 'm1',
      channelId: 'c2',
      userId: 'u2',
      content: 'Good morning team! Hope everyone had a great weekend.',
      timestamp: new Date(Date.now() - 3600000 * 2),
      reactions: {
        '👋': ['u1', 'u3', 'u4'],
        '☕': ['u5']
      }
    },
    {
      id: 'm2',
      channelId: 'c2',
      userId: 'u3',
      content: 'Morning! I worked on some new design concepts over the weekend and excited to share them today.',
      timestamp: new Date(Date.now() - 3600000 * 1.9),
      reactions: {
        '🔥': ['u1', 'u2'],
        '👍': ['u4', 'u5']
      },
      attachments: [
        {
          id: 'a1',
          type: 'image',
          name: 'design-concept-v1.png',
          url: '/attachments/design-concept.png',
          previewUrl: '/attachments/design-concept-thumb.png',
        }
      ]
    },
    {
      id: 'm3',
      channelId: 'c2',
      userId: 'u1',
      content: 'These look great, @Jordan! Can we review them in today\'s design meeting?',
      timestamp: new Date(Date.now() - 3600000 * 1.8),
      mentions: ['u3'],
      reactions: {
        '👍': ['u3']
      }
    },
    {
      id: 'm4',
      channelId: 'c2',
      userId: 'u3',
      content: 'Sure thing! I\'ll prepare a presentation.',
      timestamp: new Date(Date.now() - 3600000 * 1.7)
    },
    {
      id: 'm5',
      channelId: 'c2',
      userId: 'u4',
      content: 'Just a reminder that we need to finalize the marketing materials for the upcoming campaign by EOD.',
      timestamp: new Date(Date.now() - 3600000 * 1.5),
      isPinned: true
    },
    {
      id: 'm6',
      channelId: 'c2',
      userId: 'u1',
      content: 'Speaking of campaigns, has anyone seen the latest competitor analysis report?',
      timestamp: new Date(Date.now() - 3600000 * 1.3)
    },
    {
      id: 'm7',
      channelId: 'c2',
      userId: 'u5',
      content: 'I have it. I\'ll share it with everyone right away.',
      timestamp: new Date(Date.now() - 3600000 * 1.2),
      attachments: [
        {
          id: 'a2',
          type: 'file',
          name: 'Competitor_Analysis_Q3_2023.pdf',
          url: '/attachments/competitor-analysis.pdf',
          size: '4.2 MB'
        }
      ],
      reactions: {
        '🙏': ['u1', 'u4'],
        '👍': ['u2']
      }
    },
    {
      id: 'm8',
      channelId: 'c2',
      userId: 'u6',
      content: 'Just wanted to update everyone that we\'ve been receiving great feedback on the customer support improvements we implemented last week.',
      timestamp: new Date(Date.now() - 3600000 * 1),
      reactions: {
        '🎉': ['u1', 'u2', 'u3', 'u4', 'u5'],
        '👏': ['u1', 'u4']
      }
    }
  ],
  'c4': [
    {
      id: 'm9',
      channelId: 'c4',
      userId: 'u1',
      content: 'Team, we\'re two weeks away from the product launch. Let\'s review our checklist and make sure we\'re on track.',
      timestamp: new Date(Date.now() - 3600000 * 5),
      isPinned: true
    },
    {
      id: 'm10',
      channelId: 'c4',
      userId: 'u2',
      content: 'The development team is on schedule. We\'ll have the final build ready for QA by the end of this week.',
      timestamp: new Date(Date.now() - 3600000 * 4.8)
    },
    {
      id: 'm11',
      channelId: 'c4',
      userId: 'u3',
      content: 'Design assets are all finalized and approved. Just waiting on the last marketing copy to update a few landing pages.',
      timestamp: new Date(Date.now() - 3600000 * 4.7)
    },
    {
      id: 'm12',
      channelId: 'c4',
      userId: 'u4',
      content: 'Marketing campaign is ready to go. Press releases are scheduled, and we\'ve got a good lineup of influencers ready to promote.',
      timestamp: new Date(Date.now() - 3600000 * 4.5)
    },
    {
      id: 'm13',
      channelId: 'c4',
      userId: 'u5',
      content: 'Sales team is fully briefed and excited about the new features. We\'re expecting a strong response from existing customers.',
      timestamp: new Date(Date.now() - 3600000 * 4.3)
    },
    {
      id: 'm14',
      channelId: 'c4',
      userId: 'u1',
      content: 'Great updates everyone! @Casey, any updates from the support side?',
      timestamp: new Date(Date.now() - 3600000 * 4),
      mentions: ['u6']
    },
    {
      id: 'm15',
      channelId: 'c4',
      userId: 'u6',
      content: 'We\'ve updated all documentation and trained the support team on the new features. We\'re ready to handle any customer questions.',
      timestamp: new Date(Date.now() - 3600000 * 3.8)
    },
    {
      id: 'm16',
      channelId: 'c4',
      userId: 'u1',
      content: 'Perfect! One last thing - we should have a final go/no-go meeting on Monday. Can everyone make it at 10am?',
      timestamp: new Date(Date.now() - 3600000 * 0.5)
    }
  ]
};

const mockDailyUpdates: DailyUpdate[] = [
  {
    id: 'du1',
    userId: 'u1',
    date: new Date(),
    accomplished: [
      'Finalized Q4 product roadmap',
      'Met with key stakeholders to review launch timeline',
      'Resolved blockers for the engineering team'
    ],
    working_on: [
      'Preparing for the go/no-go meeting on Monday',
      'Reviewing marketing materials for the product launch',
      'Scheduling one-on-ones with team leads'
    ],
    blockers: [],
    mood: 'good',
    notes: 'Overall, we\'re in good shape for the launch. Team morale is high and everyone is focused on the upcoming release.'
  },
  {
    id: 'du2',
    userId: 'u2',
    date: new Date(),
    accomplished: [
      'Fixed critical bug in the authentication flow',
      'Completed code reviews for feature branch',
      'Deployed staging environment with latest changes'
    ],
    working_on: [
      'Optimizing database queries for performance improvement',
      'Finalizing API documentation',
      'Preparing final build for QA'
    ],
    blockers: [
      'Waiting on security team review for the new integration'
    ],
    mood: 'okay'
  },
  {
    id: 'du3',
    userId: 'u3',
    date: new Date(),
    accomplished: [
      'Finalized all design assets for the product launch',
      'Created presentation for today\'s design meeting',
      'Updated design system documentation'
    ],
    working_on: [
      'Working on animations for the onboarding flow',
      'Collaborating with marketing on social media visuals',
      'Planning next iteration of the mobile app UI'
    ],
    blockers: [],
    mood: 'great'
  },
  {
    id: 'du4',
    userId: 'u4',
    date: new Date(Date.now() - 86400000),
    accomplished: [
      'Finalized marketing campaign for product launch',
      'Coordinated with PR team on press releases',
      'Scheduled social media content calendar'
    ],
    working_on: [
      'Finalizing marketing copy for landing pages',
      'Reviewing analytics from previous campaigns',
      'Coordinating with influencers for the launch'
    ],
    blockers: [
      'Waiting on final pricing details from sales'
    ],
    mood: 'good'
  },
  {
    id: 'du5',
    userId: 'u5',
    date: new Date(Date.now() - 86400000),
    accomplished: [
      'Conducted sales team training on new features',
      'Updated pricing strategy based on market research',
      'Closed deal with Enterprise customer'
    ],
    working_on: [
      'Preparing sales materials for the product launch',
      'Updating CRM with new product information',
      'Scheduling follow-ups with interested customers'
    ],
    blockers: [],
    mood: 'good'
  }
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Finalize product launch materials',
    description: 'Review and approve all marketing materials for the upcoming product launch',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2),
    assignees: ['u1', 'u4'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 86400000 * 3),
    tags: ['marketing', 'product-launch'],
    subtasks: [
      { id: 'st1', title: 'Review press release', completed: true },
      { id: 'st2', title: 'Approve social media content', completed: false },
      { id: 'st3', title: 'Finalize landing page copy', completed: false }
    ]
  },
  {
    id: 't2',
    title: 'Fix authentication bug in mobile app',
    description: 'Users are experiencing intermittent login issues on the iOS app',
    status: 'todo',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 86400000 * 1),
    assignees: ['u2'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 86400000 * 1),
    tags: ['bug', 'mobile', 'critical']
  },
  {
    id: 't3',
    title: 'Create new design system documentation',
    description: 'Update the design system docs with the latest components and guidelines',
    status: 'in-review',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5),
    assignees: ['u3'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 86400000 * 5),
    tags: ['design', 'documentation']
  },
  {
    id: 't4',
    title: 'Analyze Q3 marketing campaign results',
    description: 'Prepare a report on the effectiveness of our Q3 marketing campaigns',
    status: 'done',
    priority: 'medium',
    dueDate: new Date(Date.now() - 86400000 * 1),
    assignees: ['u4'],
    createdBy: 'u4',
    createdAt: new Date(Date.now() - 86400000 * 7),
    tags: ['marketing', 'analytics'],
    attachments: [
      { id: 'a3', name: 'Q3_Marketing_Results.pdf', url: '/attachments/q3-marketing.pdf' }
    ]
  },
  {
    id: 't5',
    title: 'Prepare customer support for product launch',
    description: 'Ensure all support team members are trained on the new features',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 3),
    assignees: ['u6'],
    createdBy: 'u1',
    createdAt: new Date(Date.now() - 86400000 * 4),
    tags: ['support', 'product-launch']
  }
];

const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Daily Stand-up',
    startTime: new Date(new Date().setHours(9, 30, 0, 0)),
    endTime: new Date(new Date().setHours(9, 45, 0, 0)),
    location: 'Zoom',
    url: 'https://zoom.us/j/123456789',
    attendees: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    organizer: 'u1',
    recurring: true,
    recurringPattern: 'Weekdays'
  },
  {
    id: 'm2',
    title: 'Product Launch Go/No-Go Meeting',
    startTime: new Date(Date.now() + 86400000 * 3 + 36000000), // 3 days from now, 10am
    endTime: new Date(Date.now() + 86400000 * 3 + 39600000), // 3 days from now, 11am
    location: 'Main Conference Room + Zoom',
    url: 'https://zoom.us/j/987654321',
    description: 'Final decision meeting for the product launch. All teams should be prepared to report on their readiness.',
    attendees: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    organizer: 'u1',
    agenda: [
      'Team readiness reports (5 min each)',
      'Review of outstanding issues',
      'Go/No-Go decision',
      'Next steps'
    ]
  },
  {
    id: 'm3',
    title: 'Design Review',
    startTime: new Date(Date.now() + 3600000 * 3), // 3 hours from now
    endTime: new Date(Date.now() + 3600000 * 4), // 4 hours from now
    location: 'Design Lab',
    attendees: ['u1', 'u3', 'u4'],
    organizer: 'u3',
    description: 'Review the latest design concepts for the mobile app refresh.'
  },
  {
    id: 'm4',
    title: 'Q4 Planning Session',
    startTime: new Date(Date.now() + 86400000 * 5 + 36000000), // 5 days from now, 10am
    endTime: new Date(Date.now() + 86400000 * 5 + 57600000), // 5 days from now, 4pm
    location: 'Offsite - Innovation Center',
    description: 'Full-day planning session for Q4 initiatives and priorities.',
    attendees: ['u1', 'u2', 'u3', 'u4', 'u5'],
    organizer: 'u1',
    agenda: [
      'Review Q3 results',
      'Market and competitive analysis',
      'Product roadmap discussion',
      'Resource allocation',
      'Key initiatives and OKRs'
    ]
  }
];

// Helper functions
const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case 'online':
      return <div className="w-3 h-3 bg-green-500 rounded-full" />;
    case 'away':
      return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
    case 'do-not-disturb':
      return <div className="w-3 h-3 bg-red-500 rounded-full" />;
    case 'offline':
      return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    default:
      return null;
  }
};

const getTaskStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case 'todo':
      return <Square className="h-4 w-4" />;
    case 'in-progress':
      <Loader2 className="h-4 w-4 animate-spin" />;
    case 'in-review':
      return <Eye className="h-4 w-4" />;
    case 'done':
      return <CheckSquare className="h-4 w-4" />;
    default:
      return <Square className="h-4 w-4" />;
  }
};

const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-700';
    case 'in-progress':
      return 'bg-blue-100 text-blue-700';
    case 'in-review':
      return 'bg-purple-100 text-purple-700';
    case 'done':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getTaskPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-700';
    case 'medium':
      return 'bg-blue-100 text-blue-700';
    case 'high':
      return 'bg-amber-100 text-amber-700';
    case 'urgent':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getMoodIcon = (mood?: string): React.ReactNode => {
  switch (mood) {
    case 'great':
      return <span className="text-xl">😄</span>;
    case 'good':
      return <span className="text-xl">🙂</span>;
    case 'okay':
      return <span className="text-xl">😐</span>;
    case 'stressed':
      return <span className="text-xl">😓</span>;
    case 'blocked':
      return <span className="text-xl">😠</span>;
    default:
      return null;
  }
};

const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Component implementations
function ChannelItem({ channel, active, onClick }: { channel: Channel, active: boolean, onClick: () => void }) {
  return (
    <div 
      className={cn(
        "flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted/70",
        active && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="mr-2 text-muted-foreground">
          {channel.type === 'team' && <Users className="h-4 w-4" />}
          {channel.type === 'project' && <Rocket className="h-4 w-4" />}
          {channel.type === 'topic' && <Hash className="h-4 w-4" />}
          {channel.type === 'direct' && <MessageCircle className="h-4 w-4" />}
          {channel.type === 'company' && <Zap className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <div className="font-medium truncate">
              {channel.name}
            </div>
            {channel.isPrivate && (
              <Lock className="h-3 w-3 ml-1 text-muted-foreground" />
            )}
          </div>
          {channel.description && (
            <div className="text-xs text-muted-foreground truncate">
              {channel.description}
            </div>
          )}
        </div>
      </div>
      {channel.unreadCount && channel.unreadCount > 0 && (
        <Badge 
          className="ml-auto bg-primary h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {channel.unreadCount}
        </Badge>
      )}
    </div>
  );
}

function UserItem({ user, active, onClick }: { user: User, active: boolean, onClick: () => void }) {
  return (
    <div 
      className={cn(
        "flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-muted/70",
        active && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="relative mr-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5">
          {getStatusIcon(user.status)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {user.name}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {user.role}
        </div>
      </div>
    </div>
  );
}

function MessageItem({ 
  message, 
  user, 
  showDate = false 
}: { 
  message: Message, 
  user: User, 
  showDate?: boolean 
}) {
  return (
    <div className="py-2 px-4 hover:bg-muted/50">
      {showDate && (
        <div className="flex items-center justify-center my-2">
          <div className="bg-muted px-2 py-1 rounded-md text-xs text-muted-foreground">
            {format(message.timestamp, 'MMMM d, yyyy')}
          </div>
        </div>
      )}
      <div className="flex">
        <Avatar className="h-8 w-8 mr-3 mt-1">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-medium mr-2">{user.name}</span>
            <span className="text-xs text-muted-foreground">
              {format(message.timestamp, 'h:mm a')}
            </span>
            {message.isPinned && (
              <Badge variant="outline" className="ml-2 py-0 h-5">
                <Paperclip className="h-3 w-3 mr-1" />
                <span className="text-xs">Pinned</span>
              </Badge>
            )}
          </div>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map(attachment => (
                <div key={attachment.id} className="bg-muted/50 rounded-md p-2 flex items-center">
                  {attachment.type === 'image' ? (
                    <div className="w-full max-w-xs">
                      <img 
                        src={attachment.previewUrl || attachment.url} 
                        alt={attachment.name} 
                        className="rounded-md max-h-40 object-cover"
                      />
                      <div className="mt-1 text-xs flex items-center justify-between">
                        <span>{attachment.name}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm">
                          {attachment.name}
                        </div>
                        {attachment.size && (
                          <div className="text-xs text-muted-foreground">
                            {attachment.size}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <Badge 
                  key={emoji} 
                  variant="outline" 
                  className="py-0 h-6 flex items-center gap-1 hover:bg-muted cursor-pointer"
                >
                  <span>{emoji}</span>
                  <span className="text-xs">{users.length}</span>
                </Badge>
              ))}
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <MessageCircle className="h-4 w-4 mr-2" />
              Reply in Thread
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Smile className="h-4 w-4 mr-2" />
              Add Reaction
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Paperclip className="h-4 w-4 mr-2" />
              {message.isPinned ? 'Unpin Message' : 'Pin Message'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Message
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="h-4 w-4 mr-2" />
              Delete Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function DailyUpdateCard({ update, user }: { update: DailyUpdate, user: User }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{user.name}</CardTitle>
              <CardDescription>{format(update.date, 'EEEE, MMMM d')}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {update.mood && getMoodIcon(update.mood)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comment
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Like
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Subscribe to Updates
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div>
            <div className="font-medium flex items-center text-green-700 mb-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Accomplished
            </div>
            <ul className="space-y-1 pl-6 list-disc text-sm">
              {update.accomplished.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="font-medium flex items-center text-blue-700 mb-2">
              <Activity className="h-4 w-4 mr-2" />
              Working On
            </div>
            <ul className="space-y-1 pl-6 list-disc text-sm">
              {update.working_on.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          {update.blockers.length > 0 && (
            <div>
              <div className="font-medium flex items-center text-red-700 mb-2">
                <Flag className="h-4 w-4 mr-2" />
                Blockers
              </div>
              <ul className="space-y-1 pl-6 list-disc text-sm">
                {update.blockers.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {update.notes && (
            <div className={cn(!isExpanded && "hidden")}>
              <div className="font-medium flex items-center mb-2">
                <AlignLeft className="h-4 w-4 mr-2" />
                Notes
              </div>
              <p className="text-sm">{update.notes}</p>
            </div>
          )}
        </div>
        
        {update.notes && (
          <Button 
            variant="ghost" 
            className="text-xs mt-2 h-8" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Show more'}
            <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", isExpanded && "rotate-180")} />
          </Button>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">Comment</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <Share2 className="h-4 w-4" />
          <span className="text-xs">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

function TaskCard({ task }: { task: Task }) {
  const assignedUsers = task.assignees.map(id => 
    mockUsers.find(user => user.id === id)
  ).filter(Boolean) as User[];
  
  const creator = mockUsers.find(user => user.id === task.createdBy);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getTaskStatusColor(task.status)}>
              {task.status === 'todo' ? 'To Do' : 
               task.status === 'in-progress' ? 'In Progress' : 
               task.status === 'in-review' ? 'In Review' : 
               'Done'}
            </Badge>
            <Badge variant="outline" className={getTaskPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Check className="h-4 w-4 mr-2" />
                Mark as Complete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Reassign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-base mt-1">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
        )}
        
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-3">
            <div className="text-sm font-medium mb-2">Subtasks</div>
            <div className="space-y-1">
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center">
                  <div className={`h-4 w-4 rounded flex items-center justify-center mr-2 ${
                    subtask.completed ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {subtask.completed ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {task.dueDate ? (
                <span className={cn(
                  task.dueDate < new Date() && task.status !== 'done' && "text-red-600"
                )}>
                  Due {format(task.dueDate, 'MMM d')}
                </span>
              ) : (
                <span className="text-muted-foreground">No due date</span>
              )}
            </span>
          </div>
          <div className="flex -space-x-2">
            {assignedUsers.map(user => (
              <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border-2 border-background">
              <Plus className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Created {format(task.createdAt, 'MMM d')}</span>
          {creator && (
            <>
              <span className="mx-1">by</span>
              <span className="font-medium">{creator.name}</span>
            </>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Paperclip className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const organizer = mockUsers.find(user => user.id === meeting.organizer);
  const attendees = meeting.attendees
    .map(id => mockUsers.find(user => user.id === id))
    .filter(Boolean) as User[];
  
  const isToday = new Date(meeting.startTime).toDateString() === new Date().toDateString();
  const isPast = meeting.endTime < new Date();
  
  return (
    <Card className={cn(
      isPast && "opacity-60"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant={isToday ? "default" : "outline"}>
            {isToday ? 'Today' : format(meeting.startTime, 'EEEE, MMM d')}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                View in Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Meeting
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy Invite
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <X className="h-4 w-4 mr-2" />
                Cancel Meeting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-base mt-1">{meeting.title}</CardTitle>
        <div className="text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
          {meeting.recurring && (
            <Badge variant="outline" className="ml-2 h-5 text-xs">
              Recurring
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {meeting.description && (
          <p className="text-sm text-muted-foreground mb-3">{meeting.description}</p>
        )}
        
        <div className="mb-3">
          <div className="text-sm font-medium mb-2">Location</div>
          <div className="flex items-center bg-muted/50 rounded-md p-2">
            {meeting.url ? (
              <>
                <LinkShare className="h-4 w-4 mr-2 text-blue-600" />
                <div className="flex-1 truncate text-sm">
                  {meeting.location}
                </div>
                <Button variant="ghost" size="sm" className="h-7 gap-1" asChild>
                  <a href={meeting.url} target="_blank" rel="noopener noreferrer">
                    <span className="text-xs">Join</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <div className="flex-1 truncate text-sm">
                  {meeting.location}
                </div>
              </>
            )}
          </div>
        </div>
        
        {meeting.agenda && meeting.agenda.length > 0 && (
          <div className="mb-3">
            <div className="text-sm font-medium mb-2">Agenda</div>
            <ul className="space-y-1 pl-5 list-decimal text-sm">
              {meeting.agenda.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <div className="text-sm font-medium mb-2">Attendees ({attendees.length})</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {attendees.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center bg-muted/50 rounded-full pl-1 pr-2 py-1">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{user.name}</span>
              </div>
            ))}
            {attendees.length > 5 && (
              <div className="flex items-center bg-muted/50 rounded-full px-2 py-1">
                <span className="text-xs">+{attendees.length - 5} more</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <div className="flex items-center text-xs">
          <span className="text-muted-foreground">Organized by</span>
          {organizer && (
            <div className="flex items-center ml-1">
              <Avatar className="h-4 w-4 mr-1">
                <AvatarImage src={organizer.avatar} />
                <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{organizer.name}</span>
            </div>
          )}
        </div>
        {!isPast && (
          <Button variant="outline" size="sm" className="h-7 text-xs">
            {isToday ? 'Join Now' : 'Add to Calendar'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface LinkShareProps {
  className?: string;
}

const LinkShare: React.FC<LinkShareProps> = ({ className }) => {
  return (
    <Link2 className={className} />
  );
};

interface MapPinProps {
  className?: string;
}

const MapPin: React.FC<MapPinProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
};

export default function TeamPulse() {
  const [activeTab, setActiveTab] = useState("feed");
  const [activeChannel, setActiveChannel] = useState(mockChannels[1]);
  const [message, setMessage] = useState("");
  const [taskFilter, setTaskFilter] = useState<string>("all");
  
  const currentMessages = mockMessages[activeChannel.id] || [];
  
  const filteredTasks = taskFilter === "all" 
    ? mockTasks 
    : mockTasks.filter(task => task.status === taskFilter);
  
  const upcomingMeetings = mockMeetings.filter(meeting => 
    meeting.endTime > new Date()
  ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  return (
    <div className="container py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Team Pulse</h1>
        <p className="text-muted-foreground">Collaborate, communicate, and track progress with your team</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="feed" className="gap-1">
              <Activity className="h-4 w-4" />
              Daily Updates
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              Team Chat
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-1">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-1">
              <Calendar className="h-4 w-4" />
              Meetings
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "feed" && (
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Post Update
            </Button>
          )}
          
          {activeTab === "chat" && (
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Users className="h-4 w-4" />
                Add Members
              </Button>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                New Channel
              </Button>
            </div>
          )}
          
          {activeTab === "tasks" && (
            <div className="flex gap-2">
              <Select 
                value={taskFilter} 
                onValueChange={setTaskFilter}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </div>
          )}
          
          {activeTab === "meetings" && (
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Calendar className="h-4 w-4" />
                View Calendar
              </Button>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          )}
        </div>
        
        {/* Daily Updates Tab */}
        <TabsContent value="feed" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {mockDailyUpdates.map(update => {
                const user = mockUsers.find(u => u.id === update.userId);
                if (!user) return null;
                return (
                  <DailyUpdateCard key={update.id} update={update} user={user} />
                );
              })}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Mood</CardTitle>
                  <CardDescription>How everyone is feeling today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsers.map(user => {
                      const update = mockDailyUpdates.find(du => du.userId === user.id && 
                        new Date(du.date).toDateString() === new Date().toDateString());
                      
                      return (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.role}</div>
                            </div>
                          </div>
                          <div>
                            {update?.mood ? getMoodIcon(update.mood) : (
                              <Badge variant="outline" className="text-xs">
                                No update
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Update Stats</CardTitle>
                  <CardDescription>Team participation over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60 flex items-center justify-center bg-muted/30 rounded-md">
                    [Participation Chart Placeholder]
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Last 7 days</span>
                      <span className="font-medium">85% participation</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between items-center text-sm">
                      <span>Last 30 days</span>
                      <span className="font-medium">76% participation</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Team Chat Tab */}
        <TabsContent value="chat" className="h-[calc(100vh-220px)]">
          <div className="grid grid-cols-12 h-full gap-6 rounded-md border overflow-hidden">
            <div className="col-span-3 border-r">
              <div className="p-3 border-b">
                <Input 
                  placeholder="Search channels and people..." 
                  className="h-9"
                  prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
              
              <ScrollArea className="h-[calc(100%-50px)]">
                <div className="p-3">
                  <div className="mb-4">
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-2 px-3">
                      Channels
                    </div>
                    <div className="space-y-1">
                      {mockChannels.map(channel => (
                        <ChannelItem 
                          key={channel.id} 
                          channel={channel} 
                          active={activeChannel.id === channel.id}
                          onClick={() => setActiveChannel(channel)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase mb-2 px-3">
                      Direct Messages
                    </div>
                    <div className="space-y-1">
                      {mockUsers.map(user => (
                        <UserItem 
                          key={user.id} 
                          user={user} 
                          active={false}
                          onClick={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
            
            <div className="col-span-9 flex flex-col">
              <div className="p-3 border-b flex items-center justify-between">
                <div>
                  <div className="font-medium flex items-center">
                    {activeChannel.type === 'team' && <Users className="h-4 w-4 mr-2" />}
                    {activeChannel.type === 'project' && <Rocket className="h-4 w-4 mr-2" />}
                    {activeChannel.type === 'topic' && <Hash className="h-4 w-4 mr-2" />}
                    {activeChannel.type === 'direct' && <MessageCircle className="h-4 w-4 mr-2" />}
                    {activeChannel.type === 'company' && <Zap className="h-4 w-4 mr-2" />}
                    {activeChannel.name}
                    {activeChannel.isPrivate && (
                      <Lock className="h-3 w-3 ml-1" />
                    )}
                  </div>
                  {activeChannel.description && (
                    <div className="text-xs text-muted-foreground">{activeChannel.description}</div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div>
                  {currentMessages.map((message, index) => {
                    const user = mockUsers.find(u => u.id === message.userId);
                    if (!user) return null;
                    
                    // Show date if this is the first message or if the date is different from the previous message
                    const showDate = index === 0 || (
                      index > 0 && 
                      new Date(message.timestamp).toDateString() !== 
                      new Date(currentMessages[index - 1].timestamp).toDateString()
                    );
                    
                    return (
                      <MessageItem 
                        key={message.id} 
                        message={message} 
                        user={user}
                        showDate={showDate}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="relative">
                  <Textarea 
                    placeholder={`Message #${activeChannel.name}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[80px] resize-none pr-10"
                  />
                  <div className="absolute right-3 bottom-3 flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      className={`h-7 w-7 rounded-full ${!message.trim() && "opacity-50"}`}
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <Bold className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <Italic className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <AtSign className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <Smile className="h-3.5 w-3.5" />
                  </Button>
                  <span className="ml-auto">Press Enter to send, Shift+Enter for new line</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </TabsContent>
        
        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/30 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold">{upcomingMeetings.filter(m => 
                    new Date(m.startTime).toDateString() === new Date().toDateString()
                  ).length}</div>
                  <div className="text-sm text-muted-foreground">Today's Meetings</div>
                </div>
                <div className="bg-muted/30 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
                  <div className="text-sm text-muted-foreground">Upcoming Meetings</div>
                </div>
                <div className="bg-muted/30 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold">3.5h</div>
                  <div className="text-sm text-muted-foreground">Meeting Time Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMeetings.map(meeting => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mock components for icons not available in lucide-react
function Bold({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 12a4 4 0 0 0 0-8H6v8" />
      <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
    </svg>
  );
}

function Italic({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="19" x2="10" y1="4" y2="4" />
      <line x1="14" x2="5" y1="20" y2="20" />
      <line x1="15" x2="9" y1="4" y2="20" />
    </svg>
  );
}

function Vote({ className }: { className?: string }) {
  // Using a similar icon to represent voting
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M22 19H2" />
    </svg>
  );
}