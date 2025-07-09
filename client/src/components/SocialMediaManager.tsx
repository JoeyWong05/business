import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  Filter, 
  ArrowUpDown,
  ExternalLink,
  BarChart3,
  RefreshCw,
  Calendar,
  Image,
  Video,
  FileText,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  BarChart,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  File,
  Clock,
  CheckCircle,
  AlertCircle,
  Palette
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

export enum SocialPlatform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  TIKTOK = 'tiktok',
  LINKEDIN = 'linkedin',
  PINTEREST = 'pinterest',
  YOUTUBE = 'youtube',
  SNAPCHAT = 'snapchat'
}

export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  STORY = 'story',
  REEL = 'reel',
  TWEET = 'tweet',
  ARTICLE = 'article',
  LIVE = 'live'
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
  ARCHIVED = 'archived'
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  profileName: string;
  profileUrl: string;
  profileImageUrl?: string;
  entityId: number;
  entityName: string;
  metrics?: {
    followers: number;
    engagement: number;
    reachWeekly: number;
    growthRate: number;
  };
  lastUpdated?: Date | string;
  connectedBy?: string;
  hasPostingPermission: boolean;
  hasAnalyticsPermission: boolean;
}

export interface SocialPost {
  id: string;
  accountId: string;
  platform: SocialPlatform;
  entityId: number;
  entityName: string;
  contentType: ContentType;
  content: string;
  mediaUrls?: string[];
  thumbnailUrl?: string;
  status: PostStatus;
  scheduledFor?: Date | string;
  publishedAt?: Date | string;
  createdBy: string;
  createdAt: Date | string;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    saves?: number;
    views?: number;
    reach?: number;
    engagement?: number;
  };
  targetUrl?: string;
  tags?: string[];
  campaign?: string;
}

export interface SocialMediaManagerProps {
  accounts: SocialAccount[];
  posts: SocialPost[];
  entities: Array<{id: number, name: string}>;
  teamMembers: Array<{id: number, name: string, avatarUrl?: string}>;
  campaigns?: Array<{id: string, name: string}>;
  onAddAccount?: (account: Omit<SocialAccount, 'id'>) => void;
  onUpdateAccount?: (id: string, updates: Partial<SocialAccount>) => void;
  onDeleteAccount?: (id: string) => void;
  onAddPost?: (post: Omit<SocialPost, 'id'>) => void;
  onUpdatePost?: (id: string, updates: Partial<SocialPost>) => void;
  onDeletePost?: (id: string) => void;
  onSchedulePost?: (id: string, date: Date) => void;
  onRefreshAnalytics?: (accountId: string) => Promise<void>;
}

export default function SocialMediaManager({
  accounts,
  posts,
  entities,
  teamMembers,
  campaigns = [],
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onSchedulePost,
  onRefreshAnalytics
}: SocialMediaManagerProps) {
  const [activeTab, setActiveTab] = useState<string>('posts');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isEditPost, setIsEditPost] = useState<string | null>(null);
  const [isEditAccount, setIsEditAccount] = useState<string | null>(null);
  const [isCalendarView, setIsCalendarView] = useState(false);
  
  const [currentPost, setCurrentPost] = useState<Partial<SocialPost>>({
    platform: SocialPlatform.INSTAGRAM,
    contentType: ContentType.IMAGE,
    status: PostStatus.DRAFT,
    content: '',
    entityId: entities.length > 0 ? entities[0].id : -1,
    tags: [],
    createdBy: teamMembers.length > 0 ? teamMembers[0].name : '',
    createdAt: new Date().toISOString()
  });
  
  const [currentAccount, setCurrentAccount] = useState<Partial<SocialAccount>>({
    platform: SocialPlatform.INSTAGRAM,
    profileName: '',
    profileUrl: '',
    entityId: entities.length > 0 ? entities[0].id : -1,
    hasPostingPermission: true,
    hasAnalyticsPermission: true
  });
  
  // Apply filters for posts
  const filteredPosts = posts
    .filter(post => {
      if (searchTerm === '') return true;
      
      return (
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false) ||
        (post.campaign?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    })
    .filter(post => {
      if (platformFilter === 'all') return true;
      return post.platform === platformFilter;
    })
    .filter(post => {
      if (entityFilter === 'all') return true;
      return post.entityId === parseInt(entityFilter);
    })
    .filter(post => {
      if (statusFilter === 'all') return true;
      return post.status === statusFilter;
    });
  
  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'date': {
        const dateA = a.scheduledFor || a.publishedAt || a.createdAt;
        const dateB = b.scheduledFor || b.publishedAt || b.createdAt;
        return direction * (new Date(dateA).getTime() - new Date(dateB).getTime());
      }
      case 'engagement': {
        const engagementA = calculateEngagement(a);
        const engagementB = calculateEngagement(b);
        return direction * (engagementA - engagementB);
      }
      default:
        return 0;
    }
  });
  
  // Filter accounts
  const filteredAccounts = accounts
    .filter(account => {
      if (searchTerm === '') return true;
      
      return (
        account.profileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.entityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter(account => {
      if (platformFilter === 'all') return true;
      return account.platform === platformFilter;
    })
    .filter(account => {
      if (entityFilter === 'all') return true;
      return account.entityId === parseInt(entityFilter);
    });
  
  // Handle post submission
  const handlePostSubmit = () => {
    const selectedEntity = entities.find(e => e.id === currentPost.entityId);
    const selectedAccount = accounts.find(a => a.id === currentPost.accountId);
    
    if (isEditPost && onUpdatePost) {
      onUpdatePost(isEditPost, {
        ...currentPost,
        entityName: selectedEntity?.name || 'Unknown',
        platform: selectedAccount?.platform || SocialPlatform.INSTAGRAM
      });
      setIsEditPost(null);
    } else if (onAddPost) {
      onAddPost({
        ...currentPost as Omit<SocialPost, 'id'>,
        entityName: selectedEntity?.name || 'Unknown',
        platform: selectedAccount?.platform || SocialPlatform.INSTAGRAM,
        createdAt: new Date().toISOString()
      });
    }
    
    setIsAddPostOpen(false);
    setCurrentPost({
      platform: SocialPlatform.INSTAGRAM,
      contentType: ContentType.IMAGE,
      status: PostStatus.DRAFT,
      content: '',
      entityId: entities.length > 0 ? entities[0].id : -1,
      tags: [],
      createdBy: teamMembers.length > 0 ? teamMembers[0].name : '',
      createdAt: new Date().toISOString()
    });
  };
  
  // Handle account submission
  const handleAccountSubmit = () => {
    const selectedEntity = entities.find(e => e.id === currentAccount.entityId);
    
    if (isEditAccount && onUpdateAccount) {
      onUpdateAccount(isEditAccount, {
        ...currentAccount,
        entityName: selectedEntity?.name || 'Unknown'
      });
      setIsEditAccount(null);
    } else if (onAddAccount) {
      onAddAccount({
        ...currentAccount as Omit<SocialAccount, 'id'>,
        entityName: selectedEntity?.name || 'Unknown'
      });
    }
    
    setIsAddAccountOpen(false);
    setCurrentAccount({
      platform: SocialPlatform.INSTAGRAM,
      profileName: '',
      profileUrl: '',
      entityId: entities.length > 0 ? entities[0].id : -1,
      hasPostingPermission: true,
      hasAnalyticsPermission: true
    });
  };
  
  // Edit post
  const handleEditPost = (post: SocialPost) => {
    setCurrentPost({
      ...post
    });
    setIsEditPost(post.id);
    setIsAddPostOpen(true);
  };
  
  // Delete post
  const handleDeletePost = (id: string) => {
    if (onDeletePost) {
      onDeletePost(id);
    }
  };
  
  // Edit account
  const handleEditAccount = (account: SocialAccount) => {
    setCurrentAccount({
      ...account
    });
    setIsEditAccount(account.id);
    setIsAddAccountOpen(true);
  };
  
  // Delete account
  const handleDeleteAccount = (id: string) => {
    if (onDeleteAccount) {
      onDeleteAccount(id);
    }
  };
  
  // Refresh analytics
  const handleRefreshAnalytics = async (id: string) => {
    if (onRefreshAnalytics) {
      try {
        await onRefreshAnalytics(id);
        // Success notification would go here
      } catch (error) {
        console.error("Error refreshing analytics:", error);
        // Error notification would go here
      }
    }
  };
  
  // Format date
  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    return format(new Date(date), 'MMM dd, yyyy h:mm a');
  };
  
  // Format metrics
  const formatNumber = (num?: number) => {
    if (num === undefined) return '0';
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    
    return num.toString();
  };
  
  // Get platform details (name, icon, color)
  const getPlatformDetails = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM:
        return {
          name: 'Instagram',
          icon: Instagram,
          color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
        };
      case SocialPlatform.FACEBOOK:
        return {
          name: 'Facebook',
          icon: Facebook,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        };
      case SocialPlatform.TWITTER:
        return {
          name: 'Twitter',
          icon: Twitter,
          color: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300'
        };
      case SocialPlatform.LINKEDIN:
        return {
          name: 'LinkedIn',
          icon: Linkedin,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        };
      case SocialPlatform.TIKTOK:
        return {
          name: 'TikTok',
          icon: Video,
          color: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
        };
      case SocialPlatform.PINTEREST:
        return {
          name: 'Pinterest',
          icon: Image,
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
      case SocialPlatform.YOUTUBE:
        return {
          name: 'YouTube',
          icon: Video,
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        };
      case SocialPlatform.SNAPCHAT:
        return {
          name: 'Snapchat',
          icon: Image,
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        };
      default:
        return {
          name: 'Unknown',
          icon: ExternalLink,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        };
    }
  };
  
  // Get content type icon and label
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.IMAGE:
        return { icon: <Image className="h-4 w-4" />, label: 'Image' };
      case ContentType.VIDEO:
        return { icon: <Video className="h-4 w-4" />, label: 'Video' };
      case ContentType.CAROUSEL:
        return { icon: <Palette className="h-4 w-4" />, label: 'Carousel' };
      case ContentType.STORY:
        return { icon: <Clock className="h-4 w-4" />, label: 'Story' };
      case ContentType.REEL:
        return { icon: <Video className="h-4 w-4" />, label: 'Reel' };
      case ContentType.TWEET:
        return { icon: <Twitter className="h-4 w-4" />, label: 'Tweet' };
      case ContentType.ARTICLE:
        return { icon: <FileText className="h-4 w-4" />, label: 'Article' };
      case ContentType.LIVE:
        return { icon: <Video className="h-4 w-4" />, label: 'Live' };
      default:
        return { icon: <File className="h-4 w-4" />, label: 'Content' };
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case PostStatus.DRAFT:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Draft</Badge>;
      case PostStatus.SCHEDULED:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</Badge>;
      case PostStatus.PUBLISHED:
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Published</Badge>;
      case PostStatus.FAILED:
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Failed</Badge>;
      case PostStatus.ARCHIVED:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Calculate engagement
  const calculateEngagement = (post: SocialPost) => {
    if (!post.metrics) return 0;
    
    const { likes = 0, comments = 0, shares = 0, saves = 0 } = post.metrics;
    return likes + comments + shares + (saves || 0);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Social Media Manager</CardTitle>
          <CardDescription>
            Schedule, publish, and track social media content across platforms
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCalendarView(!isCalendarView)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {isCalendarView ? 'List View' : 'Calendar View'}
          </Button>
          
          <Button onClick={() => activeTab === 'posts' ? setIsAddPostOpen(true) : setIsAddAccountOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === 'posts' ? 'New Post' : 'Add Account'}
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Content & Posts</TabsTrigger>
            <TabsTrigger value="accounts">Social Accounts</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={activeTab === 'posts' ? "Search posts..." : "Search accounts..."}
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {Object.values(SocialPlatform).map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {getPlatformDetails(platform).name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {activeTab === 'posts' && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.values(PostStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {activeTab === 'posts' && (
                <Select 
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value);
                    if (sortBy === value) {
                      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
                    }
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date {sortBy === 'date' && (sortDirection === 'asc' ? '(Oldest)' : '(Newest)')}</SelectItem>
                    <SelectItem value="engagement">Engagement {sortBy === 'engagement' && (sortDirection === 'asc' ? '(Lowest)' : '(Highest)')}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <TabsContent value="posts" className="mt-0">
            {isCalendarView ? (
              <div className="border rounded-md p-4">
                <p className="text-center text-muted-foreground">Calendar view would be implemented here</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Content</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Type/Status</TableHead>
                      <TableHead>Scheduled/Published</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPosts.length > 0 ? (
                      sortedPosts.map(post => (
                        <TableRow key={post.id}>
                          <TableCell className="align-top">
                            <div className="flex gap-3">
                              {post.thumbnailUrl ? (
                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={post.thumbnailUrl} 
                                    alt={`Thumbnail for ${post.content.substring(0, 20)}...`} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                                  {getContentTypeIcon(post.contentType).icon}
                                </div>
                              )}
                              <div>
                                <p className="line-clamp-3 text-sm">{post.content}</p>
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {post.tags.slice(0, 3).map((tag, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                        #{tag}
                                      </Badge>
                                    ))}
                                    {post.tags.length > 3 && (
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        +{post.tags.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                {post.campaign && (
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    Campaign: {post.campaign}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`rounded-full p-1 ${getPlatformDetails(post.platform).color}`}>
                                {React.createElement(getPlatformDetails(post.platform).icon, { className: "h-4 w-4" })}
                              </div>
                              <span>{getPlatformDetails(post.platform).name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{post.entityName}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getContentTypeIcon(post.contentType).icon}
                                {getContentTypeIcon(post.contentType).label}
                              </Badge>
                              <div>{getStatusBadge(post.status)}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {post.status === PostStatus.SCHEDULED && post.scheduledFor && (
                              <div className="text-blue-600 dark:text-blue-400">
                                {formatDate(post.scheduledFor)}
                              </div>
                            )}
                            {post.status === PostStatus.PUBLISHED && post.publishedAt && (
                              <div>
                                {formatDate(post.publishedAt)}
                              </div>
                            )}
                            {post.status === PostStatus.DRAFT && (
                              <div className="text-muted-foreground">
                                Not scheduled
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              Created by: {post.createdBy}
                            </div>
                          </TableCell>
                          <TableCell>
                            {post.metrics ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <span>{formatNumber(post.metrics.likes)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-blue-500" />
                                  <span>{formatNumber(post.metrics.comments)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Share2 className="h-4 w-4 text-green-500" />
                                  <span>{formatNumber(post.metrics.shares)}</span>
                                </div>
                                {post.metrics.views !== undefined && (
                                  <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-purple-500" />
                                    <span>{formatNumber(post.metrics.views)}</span>
                                  </div>
                                )}
                              </div>
                            ) : post.status === PostStatus.PUBLISHED ? (
                              <span className="text-muted-foreground">No data</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPost(post)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {post.status === PostStatus.DRAFT && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                    >
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Schedule Post</DialogTitle>
                                      <DialogDescription>
                                        Choose when this post should be published
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <Label htmlFor="schedule-date">Date and Time</Label>
                                      <Input
                                        id="schedule-date"
                                        type="datetime-local"
                                        className="mt-1"
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button>Schedule</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                              
                              {post.status === PostStatus.PUBLISHED && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(post.targetUrl || '#', '_blank')}
                                  disabled={!post.targetUrl}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {post.status === PostStatus.PUBLISHED && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                >
                                  <BarChart className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                            <h3 className="text-lg font-medium mb-1">No posts found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {searchTerm || platformFilter !== 'all' || entityFilter !== 'all' || statusFilter !== 'all' 
                                ? "Try adjusting your search filters"
                                : "Start by creating your first social media post"}
                            </p>
                            <Button onClick={() => setIsAddPostOpen(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Post
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="accounts" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map(account => (
                  <Card key={account.id} className="overflow-hidden">
                    <div className={`h-3 ${getPlatformDetails(account.platform).color}`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {account.profileImageUrl ? (
                              <AvatarImage src={account.profileImageUrl} alt={account.profileName} />
                            ) : (
                              <AvatarFallback>
                                {React.createElement(getPlatformDetails(account.platform).icon, { className: "h-6 w-6" })}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{account.profileName}</CardTitle>
                            <CardDescription>{getPlatformDetails(account.platform).name}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => window.open(account.profileUrl, '_blank')}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatNumber(account.metrics?.followers || 0)}</div>
                          <div className="text-xs text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{account.metrics?.engagement.toFixed(1) || 0}%</div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatNumber(account.metrics?.reachWeekly || 0)}</div>
                          <div className="text-xs text-muted-foreground">Weekly Reach</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Entity</span>
                          <span className="text-sm font-medium">{account.entityName}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Connected by</span>
                          <span className="text-sm font-medium">{account.connectedBy || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Permissions</span>
                          <div className="flex gap-1">
                            {account.hasPostingPermission && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">Posting</Badge>
                            )}
                            {account.hasAnalyticsPermission && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">Analytics</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="text-xs text-muted-foreground">
                        {account.lastUpdated ? `Last updated: ${format(new Date(account.lastUpdated), 'MMM dd, yyyy')}` : 'Never updated'}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRefreshAnalytics(account.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Sync
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No social accounts found</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                    {searchTerm || platformFilter !== 'all' || entityFilter !== 'all'
                      ? "Try adjusting your search filters"
                      : "Connect your social media accounts to start tracking performance"}
                  </p>
                  <Button onClick={() => setIsAddAccountOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Social Account
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {activeTab === 'posts' 
            ? `${filteredPosts.length} post${filteredPosts.length === 1 ? '' : 's'}`
            : `${filteredAccounts.length} account${filteredAccounts.length === 1 ? '' : 's'}`}
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </CardFooter>
      
      {/* Add/Edit Post Dialog */}
      <Dialog open={isAddPostOpen} onOpenChange={setIsAddPostOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>
              {isEditPost ? 'Update your social media post' : 'Create and schedule content for your social channels'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="col-span-1">
              <Label htmlFor="post-account">Account</Label>
              <Select
                value={currentPost.accountId}
                onValueChange={(value) => {
                  const account = accounts.find(a => a.id === value);
                  setCurrentPost({
                    ...currentPost,
                    accountId: value,
                    platform: account?.platform || SocialPlatform.INSTAGRAM
                  });
                }}
              >
                <SelectTrigger id="post-account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.profileName} ({getPlatformDetails(account.platform).name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="post-entity">Business Entity</Label>
              <Select
                value={String(currentPost.entityId)}
                onValueChange={(value) => setCurrentPost({...currentPost, entityId: parseInt(value)})}
              >
                <SelectTrigger id="post-entity">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="post-type">Content Type</Label>
              <Select
                value={currentPost.contentType}
                onValueChange={(value) => setCurrentPost({...currentPost, contentType: value as ContentType})}
              >
                <SelectTrigger id="post-type">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ContentType).map(type => (
                    <SelectItem key={type} value={type}>
                      {getContentTypeIcon(type).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="post-status">Status</Label>
              <Select
                value={currentPost.status}
                onValueChange={(value) => setCurrentPost({...currentPost, status: value as PostStatus})}
              >
                <SelectTrigger id="post-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PostStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={PostStatus.SCHEDULED}>Scheduled</SelectItem>
                  {isEditPost && (
                    <>
                      <SelectItem value={PostStatus.PUBLISHED}>Published</SelectItem>
                      <SelectItem value={PostStatus.FAILED}>Failed</SelectItem>
                      <SelectItem value={PostStatus.ARCHIVED}>Archived</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {currentPost.status === PostStatus.SCHEDULED && (
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="post-schedule">Schedule Date/Time</Label>
                <Input
                  id="post-schedule"
                  type="datetime-local"
                  value={currentPost.scheduledFor ? new Date(currentPost.scheduledFor).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setCurrentPost({...currentPost, scheduledFor: e.target.value})}
                />
              </div>
            )}
            
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                value={currentPost.content || ''}
                onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                rows={5}
                placeholder="Write your post content here..."
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="post-tags">Tags (comma separated)</Label>
              <Input
                id="post-tags"
                value={(currentPost.tags || []).join(', ')}
                onChange={(e) => setCurrentPost({
                  ...currentPost,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            {campaigns.length > 0 && (
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="post-campaign">Campaign</Label>
                <Select
                  value={currentPost.campaign}
                  onValueChange={(value) => setCurrentPost({...currentPost, campaign: value})}
                >
                  <SelectTrigger id="post-campaign">
                    <SelectValue placeholder="Select campaign (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Campaign</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.name}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="post-media">Upload Media</Label>
              <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                <div className="flex flex-col items-center">
                  <Image className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here or click to browse
                  </p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddPostOpen(false);
              if (isEditPost) setIsEditPost(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handlePostSubmit}>
              {isEditPost ? 'Save Changes' : 'Create Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Account Dialog */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditAccount ? 'Edit Social Account' : 'Add Social Account'}</DialogTitle>
            <DialogDescription>
              {isEditAccount ? 'Update your social media account details' : 'Connect a new social media account to your dashboard'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div>
              <Label htmlFor="account-platform">Platform</Label>
              <Select
                value={currentAccount.platform}
                onValueChange={(value) => setCurrentAccount({...currentAccount, platform: value as SocialPlatform})}
              >
                <SelectTrigger id="account-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SocialPlatform).map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {getPlatformDetails(platform).name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="account-name">Profile Name</Label>
              <Input
                id="account-name"
                value={currentAccount.profileName || ''}
                onChange={(e) => setCurrentAccount({...currentAccount, profileName: e.target.value})}
                placeholder="@yourbrand"
              />
            </div>
            
            <div>
              <Label htmlFor="account-url">Profile URL</Label>
              <Input
                id="account-url"
                value={currentAccount.profileUrl || ''}
                onChange={(e) => setCurrentAccount({...currentAccount, profileUrl: e.target.value})}
                placeholder="https://instagram.com/yourbrand"
              />
            </div>
            
            <div>
              <Label htmlFor="account-entity">Business Entity</Label>
              <Select
                value={String(currentAccount.entityId)}
                onValueChange={(value) => setCurrentAccount({...currentAccount, entityId: parseInt(value)})}
              >
                <SelectTrigger id="account-entity">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map(entity => (
                    <SelectItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="post-permission"
                  checked={currentAccount.hasPostingPermission}
                  onCheckedChange={(checked) => 
                    setCurrentAccount({...currentAccount, hasPostingPermission: !!checked})
                  }
                />
                <Label htmlFor="post-permission">Posting permission</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics-permission"
                  checked={currentAccount.hasAnalyticsPermission}
                  onCheckedChange={(checked) => 
                    setCurrentAccount({...currentAccount, hasAnalyticsPermission: !!checked})
                  }
                />
                <Label htmlFor="analytics-permission">Analytics permission</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="account-image">Profile Image URL (optional)</Label>
              <Input
                id="account-image"
                value={currentAccount.profileImageUrl || ''}
                onChange={(e) => setCurrentAccount({...currentAccount, profileImageUrl: e.target.value})}
                placeholder="https://example.com/profile.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddAccountOpen(false);
              if (isEditAccount) setIsEditAccount(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAccountSubmit}>
              {isEditAccount ? 'Save Changes' : 'Add Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}