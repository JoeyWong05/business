import React, { useState } from 'react';
import { 
  Activity, 
  MessageSquare, 
  Send, 
  User, 
  Users, 
  Clock, 
  Plus, 
  Search, 
  Heart, 
  Edit, 
  Trash2,
  Image,
  Paperclip,
  Smile,
  AtSign,
  Hash,
  ChevronDown
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDemoMode } from '@/hooks/use-demo-mode';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types
interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status?: 'online' | 'away' | 'offline';
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: number;
  unreadCount?: number;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  user: User;
  reactions?: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  isEdited?: boolean;
  replyTo?: {
    id: string;
    preview: string;
    user: User;
  };
}

interface Thread {
  parentMessage: Message;
  replies: Message[];
}

interface DailyUpdate {
  id: string;
  user: User;
  date: string;
  content: string;
  accomplished: string[];
  working_on: string[];
  blockers: string[];
  comments: number;
  likes: number;
}

// Demo data
const DEMO_USERS: User[] = [
  { id: '1', name: 'Emily Chen', role: 'Marketing Director', avatar: '', status: 'online' },
  { id: '2', name: 'David Kim', role: 'Operations Manager', avatar: '', status: 'online' },
  { id: '3', name: 'Sarah Johnson', role: 'Sales Director', avatar: '', status: 'away' },
  { id: '4', name: 'Michael Lee', role: 'Finance Manager', avatar: '', status: 'offline' },
  { id: '5', name: 'Jessica Wang', role: 'Product Designer', avatar: '', status: 'online' },
  { id: '6', name: 'Ryan Smith', role: 'Software Engineer', avatar: '', status: 'away' },
  { id: '7', name: 'Nicole Martinez', role: 'Customer Support', avatar: '', status: 'offline' },
  { id: '8', name: 'Kevin Taylor', role: 'Content Strategist', avatar: '', status: 'online' },
];

const DEMO_CHANNELS: Channel[] = [
  { id: 'general', name: 'general', description: 'Company-wide announcements and discussions', isPrivate: false, members: 24, unreadCount: 2 },
  { id: 'marketing', name: 'marketing', description: 'Marketing team discussions and campaigns', isPrivate: false, members: 8 },
  { id: 'operations', name: 'operations', description: 'Operations and logistics coordination', isPrivate: false, members: 6 },
  { id: 'sales', name: 'sales', description: 'Sales team updates and leads', isPrivate: false, members: 5 },
  { id: 'product', name: 'product', description: 'Product development and roadmap', isPrivate: false, members: 7, unreadCount: 4 },
  { id: 'tech', name: 'tech', description: 'Technical discussions and issues', isPrivate: false, members: 9 },
  { id: 'founders', name: 'founders', description: 'Private channel for company founders', isPrivate: true, members: 3, unreadCount: 1 },
  { id: 'random', name: 'random', description: 'Off-topic conversations and fun stuff', isPrivate: false, members: 22 },
];

const DEMO_MESSAGES: Message[] = [
  {
    id: 'm1',
    content: "Team, I'm excited to share that our Q3 marketing campaign exceeded all goals! We saw a 32% increase in conversions and a 24% decrease in CAC. Great work everyone!",
    timestamp: '2023-10-25T10:30:00Z',
    user: DEMO_USERS[0],
    reactions: [
      { emoji: '🎉', count: 5, userIds: ['2', '3', '5', '6', '8'] },
      { emoji: '👍', count: 3, userIds: ['1', '4', '7'] }
    ]
  },
  {
    id: 'm2',
    content: "Amazing results! Do you think we can replicate this success for Q4?",
    timestamp: '2023-10-25T10:35:00Z',
    user: DEMO_USERS[1]
  },
  {
    id: 'm3',
    content: "The new inventory management system will be going live next Monday. Please make sure your teams are prepared for the transition. Training sessions will be available Thursday and Friday.",
    timestamp: '2023-10-25T11:15:00Z',
    user: DEMO_USERS[1]
  },
  {
    id: 'm4',
    content: "Just closed the deal with Enterprise Solutions! This is our biggest contract of the year. 🎉",
    timestamp: '2023-10-25T13:45:00Z',
    user: DEMO_USERS[2],
    reactions: [
      { emoji: '🎉', count: 7, userIds: ['1', '2', '3', '4', '5', '6', '7'] },
      { emoji: '💰', count: 4, userIds: ['2', '3', '5', '8'] }
    ]
  },
  {
    id: 'm5',
    content: "Here are the updated mockups for the new dashboard design. Let me know your thoughts!",
    timestamp: '2023-10-25T14:20:00Z',
    user: DEMO_USERS[4],
    attachments: [
      { type: 'image', url: 'https://placehold.co/600x400', name: 'dashboard-mockup.png' }
    ]
  },
  {
    id: 'm6',
    content: "Reminder: All expense reports for October are due by the 5th of November.",
    timestamp: '2023-10-25T15:10:00Z',
    user: DEMO_USERS[3]
  },
  {
    id: 'm7',
    content: "Looking at these numbers, I think we should consider shifting more budget to our digital campaigns next quarter.",
    timestamp: '2023-10-25T15:45:00Z',
    user: DEMO_USERS[0],
    replyTo: {
      id: 'm1',
      preview: "Team, I'm excited to share that our Q3 marketing campaign exceeded all goals!",
      user: DEMO_USERS[0]
    }
  },
  {
    id: 'm8',
    content: "Has anyone tested the new feature in staging yet? Getting some reports of unexpected behavior.",
    timestamp: '2023-10-25T16:00:00Z',
    user: DEMO_USERS[5]
  }
];

const DEMO_THREADS: Thread[] = [
  {
    parentMessage: DEMO_MESSAGES[3],
    replies: [
      {
        id: 'r1',
        content: "Congratulations! What was the contract value?",
        timestamp: '2023-10-25T13:50:00Z',
        user: DEMO_USERS[3]
      },
      {
        id: 'r2',
        content: "$480K annually with a 3-year commitment! They're also interested in our premium support package.",
        timestamp: '2023-10-25T13:55:00Z',
        user: DEMO_USERS[2]
      },
      {
        id: 'r3',
        content: "This is fantastic news! Great job Sarah and team. Let's discuss how to leverage this win for our marketing materials.",
        timestamp: '2023-10-25T14:05:00Z',
        user: DEMO_USERS[0]
      }
    ]
  },
  {
    parentMessage: DEMO_MESSAGES[4],
    replies: [
      {
        id: 'r4',
        content: "Love the new layout! The information hierarchy is much clearer now.",
        timestamp: '2023-10-25T14:30:00Z',
        user: DEMO_USERS[7]
      },
      {
        id: 'r5',
        content: "Could we adjust the color scheme a bit? The blue might be too strong for extended use.",
        timestamp: '2023-10-25T14:40:00Z',
        user: DEMO_USERS[5]
      },
      {
        id: 'r6',
        content: "Great point Ryan, I'll create a version with a softer palette as well.",
        timestamp: '2023-10-25T14:45:00Z',
        user: DEMO_USERS[4]
      }
    ]
  }
];

const DEMO_DAILY_UPDATES: DailyUpdate[] = [
  {
    id: 'du1',
    user: DEMO_USERS[0],
    date: '2023-10-25',
    content: "Focus today is on finalizing the Q4 marketing strategy and reviewing campaign performance.",
    accomplished: [
      "Completed Q3 marketing report and shared with leadership",
      "Finalized budget allocations for Q4 campaigns",
      "Met with agency partners to review creative direction"
    ],
    working_on: [
      "Drafting content calendar for November",
      "Reviewing analytics for recent email campaigns",
      "Planning holiday promotion strategy"
    ],
    blockers: [
      "Need marketing automation software approval from finance"
    ],
    comments: 3,
    likes: 5
  },
  {
    id: 'du2',
    user: DEMO_USERS[1],
    date: '2023-10-25',
    content: "Today I'm focused on inventory management system implementation and vendor negotiations.",
    accomplished: [
      "Completed final testing phase for inventory system",
      "Negotiated improved terms with two key suppliers",
      "Streamlined warehouse processing procedures"
    ],
    working_on: [
      "Preparing training materials for inventory system rollout",
      "Coordinating with IT on integration requirements",
      "Reviewing Q4 inventory projections"
    ],
    blockers: [],
    comments: 2,
    likes: 4
  },
  {
    id: 'du3',
    user: DEMO_USERS[2],
    date: '2023-10-25',
    content: "Celebrating our big win with Enterprise Solutions and focusing on pipeline management today.",
    accomplished: [
      "Closed Enterprise Solutions deal ($480K annually)",
      "Conducted 3 discovery calls with potential clients",
      "Updated sales forecast for Q4"
    ],
    working_on: [
      "Preparing proposal for NexGen Technologies",
      "Following up with leads from recent webinar",
      "Working with customer success on Enterprise Solutions onboarding"
    ],
    blockers: [
      "Need updated product roadmap for enterprise clients"
    ],
    comments: 6,
    likes: 8
  },
  {
    id: 'du4',
    user: DEMO_USERS[4],
    date: '2023-10-25',
    content: "Focusing on dashboard redesign and user testing for our next release.",
    accomplished: [
      "Completed initial mockups for dashboard redesign",
      "Ran usability testing session with 5 participants",
      "Finalized icon set for new UI components"
    ],
    working_on: [
      "Incorporating feedback into dashboard design",
      "Creating alternative color schemes",
      "Preparing design handoff documentation for engineers"
    ],
    blockers: [
      "Waiting on final decision about analytics integration"
    ],
    comments: 4,
    likes: 6
  }
];

// Helper components
const ChannelItem: React.FC<{ channel: Channel; isActive: boolean; onClick: () => void }> = ({ channel, isActive, onClick }) => {
  return (
    <div 
      className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-5">
          {channel.isPrivate ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            : 
            <Hash className="h-4 w-4 text-muted-foreground" />
          }
        </div>
        <span className="text-sm truncate">{channel.name}</span>
      </div>
      {channel.unreadCount && (
        <Badge variant="default" className="ml-2 h-5 min-w-5 px-1 flex items-center justify-center">
          {channel.unreadCount}
        </Badge>
      )}
    </div>
  );
};

const UserItem: React.FC<{ user: User; isActive: boolean; onClick: () => void }> = ({ user, isActive, onClick }) => {
  return (
    <div 
      className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-6 w-6">
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div 
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background
            ${user.status === 'online' ? 'bg-green-500' : 
              user.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'}`}
        />
      </div>
      <span className="text-sm truncate">{user.name}</span>
    </div>
  );
};

const ChatMessage: React.FC<{ 
  message: Message; 
  isThreadParent?: boolean;
  onReply?: (message: Message) => void;
  onViewThread?: (message: Message) => void;
}> = ({ 
  message, 
  isThreadParent = false,
  onReply,
  onViewThread
}) => {
  return (
    <div className={`group py-2 px-3 hover:bg-accent/50 rounded-md -mx-3 ${isThreadParent ? 'bg-accent/30' : ''}`}>
      {message.replyTo && (
        <div className="mb-1 pl-12 text-xs text-muted-foreground flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-corner-down-right rotate-180"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
          <span>replied to </span>
          <span className="font-medium">{message.replyTo.user.name}</span>
        </div>
      )}
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 mt-0.5">
          <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-baseline">
            <span className="font-medium">{message.user.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {message.isEdited && (
              <span className="text-xs text-muted-foreground ml-1">(edited)</span>
            )}
          </div>
          <div className="mt-0.5">{message.content}</div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              {message.attachments.map((attachment, index) => (
                attachment.type === 'image' ? (
                  <div key={index} className="mt-2 rounded-md overflow-hidden border max-w-md">
                    <img src={attachment.url} alt={attachment.name} className="w-full h-auto" />
                  </div>
                ) : (
                  <div key={index} className="mt-2 flex items-center gap-2 p-2 rounded-md border max-w-xs">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{attachment.name}</span>
                  </div>
                )
              ))}
            </div>
          )}
          
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.reactions.map((reaction, index) => (
                <Badge key={index} variant="outline" className="h-6 pl-1 pr-2 flex items-center gap-1 bg-accent/50">
                  <span>{reaction.emoji}</span>
                  <span className="text-xs">{reaction.count}</span>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="mt-1 invisible group-hover:visible flex items-center gap-1">
            {!isThreadParent && onViewThread && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-muted-foreground"
                onClick={() => onViewThread(message)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                {/* If message has replies, show count, otherwise show "Reply in thread" */}
                {message.reactions?.some(r => r.emoji === '💬') ? `${message.reactions.find(r => r.emoji === '💬')?.count} replies` : "Reply in thread"}
              </Button>
            )}
            {onReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-muted-foreground"
                onClick={() => onReply(message)}
              >
                Reply
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
              Add Reaction
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Message</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Message</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

const DailyUpdateCard: React.FC<{ update: DailyUpdate }> = ({ update }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{update.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{update.user.name}</CardTitle>
              <CardDescription>
                {update.user.role} • {new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </CardDescription>
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
                <span>Edit Update</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Update</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-muted-foreground mb-4">{update.content}</p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Accomplished
            </h4>
            <ul className="space-y-1 pl-5 list-disc text-sm">
              {update.accomplished.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              Working On
            </h4>
            <ul className="space-y-1 pl-5 list-disc text-sm">
              {update.working_on.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          
          {update.blockers.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-octagon text-red-500"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                Blockers
              </h4>
              <ul className="space-y-1 pl-5 list-disc text-sm">
                {update.blockers.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            <Heart className="h-4 w-4" />
            <span>{update.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{update.comments}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const AddDailyUpdateDialog: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [accomplished, setAccomplished] = useState(['']);
  const [workingOn, setWorkingOn] = useState(['']);
  const [blockers, setBlockers] = useState(['']);
  
  const handleAddItem = (listSetter: React.Dispatch<React.SetStateAction<string[]>>, list: string[]) => {
    listSetter([...list, '']);
  };
  
  const handleRemoveItem = (listSetter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number) => {
    if (list.length === 1) return;
    const newList = [...list];
    newList.splice(index, 1);
    listSetter(newList);
  };
  
  const handleItemChange = (listSetter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number, value: string) => {
    const newList = [...list];
    newList[index] = value;
    listSetter(newList);
  };
  
  const handleSubmit = () => {
    onSubmit({
      content,
      accomplished: accomplished.filter(Boolean),
      working_on: workingOn.filter(Boolean),
      blockers: blockers.filter(Boolean)
    });
    
    // Reset form
    setContent('');
    setAccomplished(['']);
    setWorkingOn(['']);
    setBlockers(['']);
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Daily Update</DialogTitle>
          <DialogDescription>
            Share what you've accomplished, what you're working on, and any blockers you're facing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              Overall Focus
            </label>
            <Textarea
              id="content"
              placeholder="What's your main focus today?"
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                What have you accomplished?
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleAddItem(setAccomplished, accomplished)}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {accomplished.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="What did you accomplish?"
                    value={item}
                    onChange={(e) => handleItemChange(setAccomplished, accomplished, index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleRemoveItem(setAccomplished, accomplished, index)}
                    disabled={accomplished.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                What are you working on?
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleAddItem(setWorkingOn, workingOn)}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {workingOn.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="What are you working on today?"
                    value={item}
                    onChange={(e) => handleItemChange(setWorkingOn, workingOn, index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleRemoveItem(setWorkingOn, workingOn, index)}
                    disabled={workingOn.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-octagon text-red-500"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                Any blockers?
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleAddItem(setBlockers, blockers)}
                className="h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {blockers.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="What's blocking your progress?"
                    value={item}
                    onChange={(e) => handleItemChange(setBlockers, blockers, index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => handleRemoveItem(setBlockers, blockers, index)}
                    disabled={blockers.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Post Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Pulse Component
const Pulse = () => {
  const { demoMode } = useDemoMode();
  const { activeBrand } = usePersonalization();
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeDirectMessage, setActiveDirectMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [showAddDailyUpdate, setShowAddDailyUpdate] = useState(false);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // In a real app, this would send a message to the server
    console.log('Sending message:', messageInput);
    
    setMessageInput('');
    setReplyToMessage(null);
  };
  
  const handleViewThread = (message: Message) => {
    // Find the thread for this message if it exists
    const thread = DEMO_THREADS.find(t => t.parentMessage.id === message.id);
    if (thread) {
      setActiveThread(thread);
    } else {
      // Create a new thread
      setActiveThread({
        parentMessage: message,
        replies: []
      });
    }
  };
  
  const handleAddDailyUpdate = (data: any) => {
    // In a real app, this would add a daily update to the server
    console.log('Adding daily update:', data);
  };
  
  // Get current channel name for display
  const currentChannelName = demoMode ? 
    DEMO_CHANNELS.find(c => c.id === activeChannel)?.name || 'general' : 
    'general';
  
  // Get current DM user for display
  const currentDMUser = demoMode && activeDirectMessage ? 
    DEMO_USERS.find(u => u.id === activeDirectMessage) : 
    null;
  
  return (
    <div className="container px-0 mx-auto max-w-7xl h-[calc(100vh-10rem)]">
      <PageHeader 
        title="Pulse" 
        subtitle="Team Chat, Comments, and Daily Updates"
        icon={<Activity className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            {activeTab === 'updates' && (
              <Button onClick={() => setShowAddDailyUpdate(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Daily Update
              </Button>
            )}
            {activeTab === 'chat' && (
              <Button variant="outline" onClick={() => setShowSidebar(!showSidebar)}>
                {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
              </Button>
            )}
          </div>
        }
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="flex justify-center">
          <TabsList className="bg-card">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Team Chat
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Daily Updates
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chat" className="h-[calc(100%-2rem)] mt-4">
          <div className="flex h-full border rounded-lg overflow-hidden">
            {/* Chat Sidebar */}
            {showSidebar && (
              <div className="w-60 border-r p-3 flex flex-col h-full">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search" 
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1 px-2">
                      <h3 className="text-sm font-semibold text-muted-foreground">Channels</h3>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      {demoMode ? (
                        DEMO_CHANNELS.map(channel => (
                          <ChannelItem 
                            key={channel.id} 
                            channel={channel} 
                            isActive={activeChannel === channel.id && !activeDirectMessage} 
                            onClick={() => {
                              setActiveChannel(channel.id);
                              setActiveDirectMessage('');
                              setActiveThread(null);
                            }}
                          />
                        ))
                      ) : (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          No channels available
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1 px-2">
                      <h3 className="text-sm font-semibold text-muted-foreground">Direct Messages</h3>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px]">
                      {demoMode ? (
                        DEMO_USERS.map(user => (
                          <UserItem 
                            key={user.id} 
                            user={user} 
                            isActive={activeDirectMessage === user.id} 
                            onClick={() => {
                              setActiveDirectMessage(user.id);
                              setActiveChannel('');
                              setActiveThread(null);
                            }}
                          />
                        ))
                      ) : (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          No team members available
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
                
                {/* User Status */}
                <div className="mt-auto pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">Current User</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Online</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                          <span>Away</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                          <span>Offline</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell mr-2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                          <span>Notification Settings</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Chat Area */}
            <div className={`${activeThread ? 'w-1/2' : 'flex-1'} flex flex-col h-full`}>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeDirectMessage ? (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{currentDMUser?.name.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{currentDMUser?.name || 'User'}</div>
                        <div className="text-xs text-muted-foreground">{currentDMUser?.role || ''}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Hash className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{currentChannelName}</div>
                        <div className="text-xs text-muted-foreground">
                          {demoMode ? DEMO_CHANNELS.find(c => c.id === activeChannel)?.description || '' : ''}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Users className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-off mr-2"><path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 1.4-3"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        <span>Mute Notifications</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark mr-2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                        <span>Save to Bookmarks</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search mr-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <span>Search in {activeDirectMessage ? 'Conversation' : 'Channel'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-3">
                {demoMode ? (
                  <div className="space-y-0">
                    {DEMO_MESSAGES.map(message => (
                      <ChatMessage 
                        key={message.id} 
                        message={message} 
                        onReply={setReplyToMessage}
                        onViewThread={handleViewThread}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No messages yet</h3>
                    <p className="text-muted-foreground max-w-md mt-2">
                      Enable demo mode to see example messages or start a conversation to see it appear here.
                    </p>
                  </div>
                )}
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-3 border-t">
                {replyToMessage && (
                  <div className="mb-2 pl-4 border-l-2 border-muted flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex-1 overflow-hidden">
                      <span className="font-medium">{replyToMessage.user.name}</span>
                      <span className="mx-1">:</span>
                      <span className="truncate">{replyToMessage.content}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => setReplyToMessage(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Plus className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Input 
                      placeholder={`Message ${activeDirectMessage ? currentDMUser?.name : "#" + currentChannelName}`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="pr-24"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 top-2 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <AtSign className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    className="h-10 w-10"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Thread Panel */}
            {activeThread && (
              <div className="w-1/2 border-l flex flex-col h-full">
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Thread</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setActiveThread(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 p-3">
                  <ChatMessage 
                    message={activeThread.parentMessage} 
                    isThreadParent
                  />
                  
                  {activeThread.replies.length > 0 ? (
                    <div className="mt-4 space-y-0 pl-3 border-l-2 border-muted-foreground/20">
                      {activeThread.replies.map(reply => (
                        <ChatMessage 
                          key={reply.id} 
                          message={reply} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 text-center text-sm text-muted-foreground py-6">
                      No replies yet
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input 
                        placeholder="Reply in thread..."
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button size="icon" className="h-10 w-10">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="updates" className="h-[calc(100%-2rem)] mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Daily Updates List */}
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Daily Updates</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar View</span>
                  </Button>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="comments">Most Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100%-3rem)] pr-4">
                {demoMode ? (
                  DEMO_DAILY_UPDATES.map(update => (
                    <DailyUpdateCard key={update.id} update={update} />
                  ))
                ) : (
                  <Card className="p-8 flex flex-col items-center justify-center text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No updates yet</h3>
                    <p className="text-muted-foreground max-w-md mt-2">
                      Enable demo mode to see example updates or add your daily update to get started.
                    </p>
                    <Button className="mt-6" onClick={() => setShowAddDailyUpdate(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Daily Update
                    </Button>
                  </Card>
                )}
              </ScrollArea>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share Update Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Update</CardTitle>
                  <CardDescription>
                    Let your team know what you're working on
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Daily updates help keep everyone informed and aligned, making meetings more efficient.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setShowAddDailyUpdate(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Daily Update
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Team Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                  <CardDescription>
                    Recent activity and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {demoMode ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-semibold">Updates Today</h4>
                          <Badge>{DEMO_DAILY_UPDATES.length}</Badge>
                        </div>
                        <Progress value={
                          Math.round((DEMO_DAILY_UPDATES.length / DEMO_USERS.length) * 100)
                        } className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {DEMO_DAILY_UPDATES.length} out of {DEMO_USERS.length} team members
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 border rounded-md">
                            <p className="text-sm text-muted-foreground">Accomplishments</p>
                            <p className="text-xl font-bold">
                              {DEMO_DAILY_UPDATES.reduce(
                                (sum, update) => sum + update.accomplished.length, 0
                              )}
                            </p>
                          </div>
                          <div className="p-3 border rounded-md">
                            <p className="text-sm text-muted-foreground">Blockers</p>
                            <p className="text-xl font-bold">
                              {DEMO_DAILY_UPDATES.reduce(
                                (sum, update) => sum + update.blockers.length, 0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Active Team Members</h4>
                        <div className="flex flex-wrap gap-1">
                          {DEMO_USERS.slice(0, 5).map(user => (
                            <Avatar key={user.id} className="h-8 w-8">
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {DEMO_USERS.length > 5 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm">
                              +{DEMO_USERS.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Team stats will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  {demoMode && (
                    <Button variant="outline" size="sm" className="w-full">
                      View Team Analytics
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Calendar Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Update Calendar</CardTitle>
                  <CardDescription>
                    Track team member updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {demoMode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-7 text-center gap-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                          <div key={i} className="text-xs text-muted-foreground">
                            {day}
                          </div>
                        ))}
                        
                        {Array.from({ length: 31 }, (_, i) => {
                          const isToday = i + 1 === 25;
                          const hasUpdates = [23, 24, 25].includes(i + 1);
                          return (
                            <div 
                              key={i}
                              className={`
                                h-8 flex items-center justify-center rounded-md text-xs
                                ${isToday ? 'bg-primary text-primary-foreground' : 
                                  hasUpdates ? 'bg-accent' : 'border hover:bg-accent/50'}
                              `}
                            >
                              {i + 1}
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span>Today</span>
                        <div className="w-3 h-3 bg-accent rounded-full ml-2"></div>
                        <span>Has Updates</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Calendar view will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {demoMode && (
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Calendar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Daily Update Dialog */}
      <AddDailyUpdateDialog 
        isOpen={showAddDailyUpdate}
        onClose={() => setShowAddDailyUpdate(false)}
        onSubmit={handleAddDailyUpdate}
      />
    </div>
  );
};

export default Pulse;