import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  ThumbsUp, 
  Share, 
  Flag, 
  ChevronDown, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle,
  Tag,
  Plus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnnouncementsProps {
  companyId: string;
  companyBranding: {
    name: string;
    logo: string;
    logoFallback: string;
    primaryColor: string;
    secondaryColor: string;
    gradient: string;
  };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'milestone' | 'product' | 'hiring' | 'news' | 'update';
  date: Date;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  important: boolean;
  hasAttachment: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  readBy: string[];
  reactions: {
    thumbsUp: number;
    celebrate: number;
    insightful: number;
  };
  comments: {
    id: string;
    author: string;
    authorAvatar?: string;
    content: string;
    date: Date;
  }[];
  tags: string[];
}

// Sample announcements data
const getSampleAnnouncements = (companyId: string): Announcement[] => {
  const commonAnnouncements = [
    {
      id: '1',
      title: 'Q2 Business Review Meeting',
      content: 'We will be hosting our quarterly business review on July 15th at 2 PM EST. All partners and investors are invited to join. The agenda includes financial performance, growth metrics, and upcoming initiatives. A calendar invite will be sent separately.',
      type: 'update' as const,
      date: new Date(2023, 6, 10),
      author: 'Sarah Johnson',
      authorRole: 'CEO',
      authorAvatar: '/avatars/sarah.jpg',
      important: true,
      hasAttachment: false,
      readBy: ['user1', 'user3'],
      reactions: {
        thumbsUp: 12,
        celebrate: 5,
        insightful: 3
      },
      comments: [
        {
          id: 'c1',
          author: 'Michael Chen',
          authorAvatar: '/avatars/michael.jpg',
          content: 'Looking forward to the review. Will the meeting be recorded for those who cannot attend live?',
          date: new Date(2023, 6, 10, 14, 35)
        },
        {
          id: 'c2',
          author: 'Sarah Johnson',
          authorAvatar: '/avatars/sarah.jpg',
          content: 'Yes, we will record the session and share it afterward along with the slide deck.',
          date: new Date(2023, 6, 10, 15, 20)
        }
      ],
      tags: ['meeting', 'quarterly', 'business-review']
    },
    {
      id: '2',
      title: 'New Funding Round Closed',
      content: 'We\'re excited to announce the successful closing of our Series A funding round, raising $5 million led by Venture Partners with participation from existing investors. This investment will accelerate our growth, expand our team, and enhance our product development efforts.',
      type: 'milestone' as const,
      date: new Date(2023, 5, 28),
      author: 'David Wilson',
      authorRole: 'CFO',
      authorAvatar: '/avatars/david.jpg',
      important: true,
      hasAttachment: true,
      attachmentUrl: '/attachments/funding-press-release.pdf',
      attachmentType: 'pdf',
      readBy: ['user1', 'user2', 'user3', 'user4'],
      reactions: {
        thumbsUp: 24,
        celebrate: 18,
        insightful: 7
      },
      comments: [
        {
          id: 'c3',
          author: 'Jennifer Lopez',
          authorAvatar: '/avatars/jennifer.jpg',
          content: 'Congratulations to the team! This is a significant milestone for the company.',
          date: new Date(2023, 5, 28, 13, 15)
        }
      ],
      tags: ['funding', 'series-a', 'growth']
    }
  ];

  // Company-specific announcements
  const companyAnnouncements: Record<string, Announcement[]> = {
    'dmp': [
      {
        id: '3',
        title: 'New Product Line Launch',
        content: 'Digital Merch Pros is launching a new premium line of customizable digital merchandise next month. The new collection features enhanced design options, AR capabilities, and blockchain verification for authenticity. Pre-orders will open for partners on August 1st.',
        type: 'product' as const,
        date: new Date(2023, 6, 25),
        author: 'Marcus Chen',
        authorRole: 'Product Director',
        authorAvatar: '/avatars/marcus.jpg',
        important: true,
        hasAttachment: true,
        attachmentUrl: '/attachments/product-preview.png',
        attachmentType: 'image',
        readBy: ['user1'],
        reactions: {
          thumbsUp: 15,
          celebrate: 8,
          insightful: 4
        },
        comments: [],
        tags: ['product-launch', 'digital-merchandise', 'premium']
      }
    ],
    'mystery-hype': [
      {
        id: '3',
        title: 'Expansion to European Market',
        content: 'Mystery Hype is officially expanding to the European market in Q3 2023. We have secured partnerships with key distributors in France, Germany, and the UK. This expansion is projected to increase our revenue by 30% over the next fiscal year.',
        type: 'news' as const,
        date: new Date(2023, 6, 20),
        author: 'Daniel Kim',
        authorRole: 'CEO',
        authorAvatar: '/avatars/daniel.jpg',
        important: true,
        hasAttachment: false,
        readBy: [],
        reactions: {
          thumbsUp: 19,
          celebrate: 11,
          insightful: 5
        },
        comments: [],
        tags: ['expansion', 'europe', 'international']
      }
    ],
    'lonestar': [
      {
        id: '3',
        title: 'New Design Studio Opening',
        content: 'Lone Star Custom Clothing is proud to announce the opening of our new design studio in Austin, TX on August 15th. The 5,000 sq ft facility will house our design team and showcase custom apparel creation with cutting-edge technology. Partners are invited to an exclusive preview event on August 10th.',
        type: 'milestone' as const,
        date: new Date(2023, 7, 2),
        author: 'Sarah Johnson',
        authorRole: 'CEO',
        authorAvatar: '/avatars/sarah.jpg',
        important: false,
        hasAttachment: true,
        attachmentUrl: '/attachments/studio-rendering.jpg',
        attachmentType: 'image',
        readBy: ['user3'],
        reactions: {
          thumbsUp: 13,
          celebrate: 7,
          insightful: 2
        },
        comments: [],
        tags: ['facility', 'design-studio', 'expansion']
      }
    ],
    'alcoease': [
      {
        id: '3',
        title: 'FDA Approval Progress',
        content: 'We\'re pleased to share that AlcoEaze has passed the second phase of FDA review process for our flagship product. The final approval is expected within 90 days, which will allow us to market our product with health benefit claims. This achievement is the result of two years of rigorous testing and documentation.',
        type: 'update' as const,
        date: new Date(2023, 6, 15),
        author: 'Ryan Cooper',
        authorRole: 'CEO',
        authorAvatar: '/avatars/ryan.jpg',
        important: true,
        hasAttachment: false,
        readBy: ['user1', 'user2'],
        reactions: {
          thumbsUp: 16,
          celebrate: 9,
          insightful: 6
        },
        comments: [],
        tags: ['fda-approval', 'regulation', 'milestone']
      }
    ],
    'hide-cafe': [
      {
        id: '3',
        title: 'Key Executive Hire',
        content: 'Hide Cafe Bars is excited to welcome Jessica Martinez as our new Chief Marketing Officer. Jessica brings over 15 years of experience in hospitality marketing, having previously led successful campaigns for national restaurant chains. She will oversee our brand strategy, digital presence, and customer acquisition initiatives.',
        type: 'hiring' as const,
        date: new Date(2023, 6, 18),
        author: 'Emma Wong',
        authorRole: 'CEO',
        authorAvatar: '/avatars/emma.jpg',
        important: false,
        hasAttachment: true,
        attachmentUrl: '/attachments/press-release-cmo.pdf',
        attachmentType: 'pdf',
        readBy: ['user4'],
        reactions: {
          thumbsUp: 11,
          celebrate: 14,
          insightful: 3
        },
        comments: [],
        tags: ['hiring', 'executive', 'marketing']
      }
    ]
  };

  const companySpecificAnnouncements = companyAnnouncements[companyId] || [];
  return [...commonAnnouncements, ...companySpecificAnnouncements].sort((a, b) => b.date.getTime() - a.date.getTime());
};

export function Announcements({ companyId, companyBranding }: AnnouncementsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);
  const [savedAnnouncements, setSavedAnnouncements] = useState<string[]>([]);
  
  const announcements = getSampleAnnouncements(companyId);
  
  // Format date relative to now (e.g., "2 days ago", "just now")
  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };
  
  // Format full date
  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Toggle save status for an announcement
  const toggleSaveAnnouncement = (id: string) => {
    setSavedAnnouncements(prev => 
      prev.includes(id) 
        ? prev.filter(announcementId => announcementId !== id)
        : [...prev, id]
    );
  };
  
  // Filter announcements based on active tab
  const filteredAnnouncements = announcements.filter(announcement => {
    if (activeTab === 'all') return true;
    if (activeTab === 'important') return announcement.important;
    if (activeTab === 'unread') return !announcement.readBy.includes('user1'); // Assuming current user is user1
    if (activeTab === 'saved') return savedAnnouncements.includes(announcement.id);
    return announcement.type === activeTab;
  });
  
  // Get badge color based on announcement type
  const getAnnouncementBadgeVariant = (type: string) => {
    switch (type) {
      case 'milestone': return 'default';
      case 'product': return 'secondary';
      case 'hiring': return 'outline';
      case 'news': return 'destructive';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header with action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Announcements & Updates</h3>
          <p className="text-muted-foreground">Stay informed about company news and important updates</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Announcement</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Share news, updates, or important information with all partners and investors.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="title">Title</label>
                <input id="title" className="col-span-3 p-2 border rounded" placeholder="Announcement title" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="type">Type</label>
                <select id="type" className="col-span-3 p-2 border rounded">
                  <option value="update">General Update</option>
                  <option value="milestone">Milestone</option>
                  <option value="product">Product News</option>
                  <option value="hiring">Hiring News</option>
                  <option value="news">Company News</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right mt-2" htmlFor="content">Content</label>
                <textarea id="content" className="col-span-3 p-2 border rounded" rows={6} placeholder="Write your announcement here..."></textarea>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="tags">Tags</label>
                <input id="tags" className="col-span-3 p-2 border rounded" placeholder="Comma-separated tags" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right" htmlFor="file">Attachment</label>
                <input type="file" id="file" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Options</div>
                <div className="col-span-3 flex items-center gap-2">
                  <input type="checkbox" id="important" />
                  <label htmlFor="important">Mark as important</label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setCreateDialogOpen(false)}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filter tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="milestone">Milestones</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {/* Announcements list */}
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No announcements found</h3>
                <p className="text-muted-foreground">There are no announcements in this category yet.</p>
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className={`overflow-hidden ${announcement.important && !announcement.readBy.includes('user1') ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={announcement.authorAvatar} alt={announcement.author} />
                          <AvatarFallback>{announcement.author.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{announcement.author}</div>
                          <div className="text-xs text-muted-foreground">{announcement.authorRole}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getAnnouncementBadgeVariant(announcement.type)}>
                          {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                        </Badge>
                        {announcement.important && !announcement.readBy.includes('user1') && (
                          <Badge variant="destructive">Important</Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => toggleSaveAnnouncement(announcement.id)}
                        >
                          {savedAnnouncements.includes(announcement.id) ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 space-y-4">
                    <div className={expandedAnnouncement === announcement.id ? '' : 'line-clamp-3'}>
                      {announcement.content}
                    </div>
                    {announcement.content.length > 280 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-0 h-auto font-normal text-muted-foreground"
                        onClick={() => setExpandedAnnouncement(
                          expandedAnnouncement === announcement.id ? null : announcement.id
                        )}
                      >
                        {expandedAnnouncement === announcement.id ? 'Read less' : 'Read more'}
                      </Button>
                    )}
                    
                    {announcement.hasAttachment && (
                      <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span>Attachment: {announcement.attachmentType?.toUpperCase()}</span>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    )}
                    
                    {announcement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {announcement.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{tag}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatRelativeDate(announcement.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{announcement.comments.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{announcement.reactions.thumbsUp + announcement.reactions.celebrate + announcement.reactions.insightful}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            <span>React</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            <span>Like ({announcement.reactions.thumbsUp})</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <span className="mr-2">🎉</span>
                            <span>Celebrate ({announcement.reactions.celebrate})</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <span className="mr-2">💡</span>
                            <span>Insightful ({announcement.reactions.insightful})</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Comment</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </CardFooter>
                  
                  {announcement.comments.length > 0 && (
                    <>
                      <Separator />
                      <div className="p-4 bg-muted/30">
                        <h4 className="text-sm font-medium mb-3">Comments</h4>
                        <div className="space-y-4">
                          {announcement.comments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                                <AvatarFallback>{comment.author.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-background rounded-md p-3">
                                  <div className="font-medium text-sm">{comment.author}</div>
                                  <div className="text-sm mt-1">{comment.content}</div>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                  <span>{formatRelativeDate(comment.date)}</span>
                                  <Button variant="ghost" size="sm" className="h-auto px-0 py-0">Like</Button>
                                  <Button variant="ghost" size="sm" className="h-auto px-0 py-0">Reply</Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>ME</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 rounded-md border bg-background">
                            <input 
                              type="text" 
                              placeholder="Write a comment..." 
                              className="w-full px-3 py-2 bg-transparent border-none focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}