import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Edit,
  Edit2,
  Eye,
  Globe,
  Instagram,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
  Youtube
} from 'lucide-react';
import { format, addMonths, subMonths, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { SiFacebook, SiLinkedin, SiPinterest, SiTiktok } from 'react-icons/si';
import { BsTwitter } from 'react-icons/bs';

// Import these types from your EnhancedSocialMediaManager component
// Or define them here if you prefer standalone components
import { SocialPlatform, ContentType, PostStatus } from './EnhancedSocialMediaManager';

interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  contentType: ContentType;
  status: PostStatus;
  scheduledFor?: Date | string;
  publishedAt?: Date | string;
  entityId: number;
  entityName: string;
}

interface SocialMediaContentCalendarProps {
  posts: SocialPost[];
  entities: Array<{ id: number, name: string, type: string }>;
  onCreatePost?: () => void;
  onEditPost?: (postId: string) => void;
  onViewPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onPublishPost?: (postId: string) => void;
}

const SocialMediaContentCalendar: React.FC<SocialMediaContentCalendarProps> = ({
  posts,
  entities,
  onCreatePost,
  onEditPost,
  onViewPost,
  onDeletePost,
  onPublishPost
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedEntity, setSelectedEntity] = useState<number | 'all'>('all');
  const [filterPlatform, setFilterPlatform] = useState<SocialPlatform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showPostDetail, setShowPostDetail] = useState<boolean>(false);

  // Filter posts based on selected entity and filters
  const filteredPosts = posts.filter(post => {
    // Filter by entity
    if (selectedEntity !== 'all' && post.entityId !== selectedEntity) {
      return false;
    }
    
    // Filter by platform
    if (filterPlatform !== 'all' && post.platform !== filterPlatform) {
      return false;
    }
    
    // Filter by status
    if (filterStatus !== 'all' && post.status !== filterStatus) {
      return false;
    }
    
    return true;
  });

  // Group posts by date for calendar view
  const postsByDate = filteredPosts.reduce((acc, post) => {
    const dateKey = post.scheduledFor 
      ? new Date(post.scheduledFor).toDateString() 
      : post.publishedAt 
        ? new Date(post.publishedAt).toDateString()
        : 'Unscheduled';
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(post);
    return acc;
  }, {} as Record<string, SocialPost[]>);

  // Get platform icon
  const getPlatformIcon = (platform: SocialPlatform, className = 'h-4 w-4') => {
    switch (platform) {
      case SocialPlatform.FACEBOOK:
        return <SiFacebook className={className} style={{ color: '#1877F2' }} />;
      case SocialPlatform.INSTAGRAM:
        return <Instagram className={className} style={{ color: '#E1306C' }} />;
      case SocialPlatform.TWITTER:
        return <BsTwitter className={className} style={{ color: '#1DA1F2' }} />;
      case SocialPlatform.LINKEDIN:
        return <SiLinkedin className={className} style={{ color: '#0A66C2' }} />;
      case SocialPlatform.PINTEREST:
        return <SiPinterest className={className} style={{ color: '#E60023' }} />;
      case SocialPlatform.TIKTOK:
        return <SiTiktok className={className} style={{ color: '#000000' }} />;
      case SocialPlatform.YOUTUBE:
        return <Youtube className={className} style={{ color: '#FF0000' }} />;
      default:
        return <Globe className={className} />;
    }
  };

  // Get platform color
  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.FACEBOOK:
        return '#1877F2';
      case SocialPlatform.INSTAGRAM:
        return '#E1306C';
      case SocialPlatform.TWITTER:
        return '#1DA1F2';
      case SocialPlatform.LINKEDIN:
        return '#0A66C2';
      case SocialPlatform.PINTEREST:
        return '#E60023';
      case SocialPlatform.TIKTOK:
        return '#000000';
      case SocialPlatform.YOUTUBE:
        return '#FF0000';
      default:
        return '#6E6E6E';
    }
  };

  // Format date
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format time
  const formatTime = (date: string | Date) => {
    try {
      return format(new Date(date), 'h:mm a');
    } catch (e) {
      return 'Invalid time';
    }
  };

  // Get post date time (formatted)
  const getPostDateTime = (post: SocialPost) => {
    if (post.scheduledFor) {
      return `Scheduled for ${formatDate(post.scheduledFor)} at ${formatTime(post.scheduledFor)}`;
    } else if (post.publishedAt) {
      return `Published on ${formatDate(post.publishedAt)} at ${formatTime(post.publishedAt)}`;
    }
    return 'Draft';
  };

  // Get post count badge for calendar days
  const getPostCountBadgeForDay = (day: Date) => {
    const dayPosts = postsByDate[day.toDateString()];
    if (!dayPosts || dayPosts.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.values(SocialPlatform).reduce((acc, platform) => {
          const platformPosts = dayPosts.filter(post => post.platform === platform);
          if (platformPosts.length === 0) return acc;
          
          acc.push(
            <Badge 
              key={platform}
              variant="outline" 
              className="flex items-center gap-1 text-xs"
              style={{ 
                color: getPlatformColor(platform as SocialPlatform),
                borderColor: getPlatformColor(platform as SocialPlatform) 
              }}
            >
              {getPlatformIcon(platform as SocialPlatform, 'h-3 w-3')}
              <span>{platformPosts.length}</span>
            </Badge>
          );
          
          return acc;
        }, [] as React.ReactNode[])}
      </div>
    );
  };

  // Get selected day posts
  const getSelectedDayPosts = () => {
    return postsByDate[selectedDate.toDateString()] || [];
  };

  // Get selected post
  const getSelectedPostDetails = () => {
    return filteredPosts.find(post => post.id === selectedPost) || null;
  };

  // Render month view calendar
  const renderMonthView = () => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('month')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Month
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium py-2">
              {day}
            </div>
          ))}
          
          {daysInMonth.map((day, i) => {
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[100px] p-2 border rounded-md",
                  isToday && "bg-muted/50",
                  isSelected && "border-primary",
                  "cursor-pointer hover:bg-muted/30 transition-colors"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-sm font-medium",
                    isToday && "text-primary"
                  )}>
                    {format(day, 'd')}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(day);
                      if (onCreatePost) onCreatePost();
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                {getPostCountBadgeForDay(day)}
                
                <ScrollArea className="h-[60px] mt-1">
                  {postsByDate[day.toDateString()]?.slice(0, 3).map((post) => (
                    <div 
                      key={post.id}
                      className="flex items-center gap-1 text-xs p-1 rounded-sm hover:bg-muted mb-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post.id);
                        setShowPostDetail(true);
                      }}
                    >
                      {getPlatformIcon(post.platform, 'h-3 w-3')}
                      <span className="truncate">{post.content.substring(0, 20)}{post.content.length > 20 ? '...' : ''}</span>
                    </div>
                  ))}
                  {(postsByDate[day.toDateString()]?.length || 0) > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{postsByDate[day.toDateString()].length - 3} more
                    </div>
                  )}
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Content Schedule
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('month')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Month
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="scheduled">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scheduled">
            <ScrollArea className="h-[500px]">
              {renderPostList(filteredPosts.filter(post => post.status === PostStatus.SCHEDULED))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="published">
            <ScrollArea className="h-[500px]">
              {renderPostList(filteredPosts.filter(post => post.status === PostStatus.PUBLISHED))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="drafts">
            <ScrollArea className="h-[500px]">
              {renderPostList(filteredPosts.filter(post => post.status === PostStatus.DRAFT))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="all">
            <ScrollArea className="h-[500px]">
              {renderPostList(filteredPosts)}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Render post list
  const renderPostList = (posts: SocialPost[]) => {
    if (posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No posts found</p>
          {onCreatePost && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onCreatePost}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>
      );
    }
    
    // Group posts by date
    const postsByDateForList = posts.reduce((acc, post) => {
      const dateKey = post.scheduledFor 
        ? format(new Date(post.scheduledFor), 'yyyy-MM-dd')
        : post.publishedAt
          ? format(new Date(post.publishedAt), 'yyyy-MM-dd')
          : 'Unscheduled';
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      
      acc[dateKey].push(post);
      return acc;
    }, {} as Record<string, SocialPost[]>);
    
    return (
      <div className="space-y-6">
        {Object.entries(postsByDateForList)
          .sort(([dateA], [dateB]) => {
            if (dateA === 'Unscheduled') return 1;
            if (dateB === 'Unscheduled') return -1;
            return dateA > dateB ? 1 : -1;
          })
          .map(([dateKey, datePosts]) => (
            <div key={dateKey} className="space-y-2">
              <h3 className="text-sm font-medium sticky top-0 bg-background py-2">
                {dateKey === 'Unscheduled' 
                  ? 'Unscheduled (Drafts)' 
                  : formatDate(dateKey)}
              </h3>
              <div className="space-y-2">
                {datePosts.map((post) => (
                  <Card 
                    key={post.id}
                    className="hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedPost(post.id);
                      setShowPostDetail(true);
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(post.platform)}
                          <span className="text-sm font-medium">{post.entityName}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              post.status === PostStatus.DRAFT && "bg-orange-100 text-orange-800 border-orange-200",
                              post.status === PostStatus.SCHEDULED && "bg-blue-100 text-blue-800 border-blue-200",
                              post.status === PostStatus.PUBLISHED && "bg-green-100 text-green-800 border-green-200",
                              post.status === PostStatus.FAILED && "bg-red-100 text-red-800 border-red-200"
                            )}
                          >
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onViewPost && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onViewPost(post.id);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEditPost && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onEditPost(post.id);
                              }}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onPublishPost && post.status !== PostStatus.PUBLISHED && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onPublishPost(post.id);
                              }}>
                                <Check className="h-4 w-4 mr-2" />
                                Publish Now
                              </DropdownMenuItem>
                            )}
                            {onDeletePost && (
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeletePost(post.id);
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {post.scheduledFor && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatTime(post.scheduledFor)}
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm line-clamp-2">
                        {post.content}
                      </div>
                      
                      {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1).toLowerCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {post.mediaUrls.length} media item{post.mediaUrls.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Social Media Content Calendar</CardTitle>
              <CardDescription>
                Schedule and manage your social media content across platforms
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={selectedEntity === 'all' ? 'all' : selectedEntity.toString()}
                onValueChange={(value) => setSelectedEntity(value === 'all' ? 'all' : parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={filterPlatform}
                onValueChange={(value) => setFilterPlatform(value as SocialPlatform | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {Object.values(SocialPlatform).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(platform as SocialPlatform)}
                        <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {onCreatePost && (
                <Button onClick={onCreatePost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'month' ? renderMonthView() : renderListView()}
        </CardContent>
      </Card>
      
      {/* Post Detail Dialog */}
      <Dialog open={showPostDetail} onOpenChange={setShowPostDetail}>
        <DialogContent className="max-w-2xl">
          {getSelectedPostDetails() && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  {getPlatformIcon(getSelectedPostDetails()!.platform)}
                  <DialogTitle>Post Details</DialogTitle>
                </div>
                <DialogDescription>
                  {getPostDateTime(getSelectedPostDetails()!)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        getSelectedPostDetails()!.status === PostStatus.DRAFT && "bg-orange-100 text-orange-800 border-orange-200",
                        getSelectedPostDetails()!.status === PostStatus.SCHEDULED && "bg-blue-100 text-blue-800 border-blue-200",
                        getSelectedPostDetails()!.status === PostStatus.PUBLISHED && "bg-green-100 text-green-800 border-green-200",
                        getSelectedPostDetails()!.status === PostStatus.FAILED && "bg-red-100 text-red-800 border-red-200"
                      )}
                    >
                      {getSelectedPostDetails()!.status.charAt(0).toUpperCase() + getSelectedPostDetails()!.status.slice(1).toLowerCase()}
                    </Badge>
                    <Badge variant="secondary">
                      {getSelectedPostDetails()!.contentType.charAt(0).toUpperCase() + getSelectedPostDetails()!.contentType.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getSelectedPostDetails()!.entityName}
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted">
                  <div className="whitespace-pre-wrap">{getSelectedPostDetails()!.content}</div>
                </div>
                
                {getSelectedPostDetails()!.mediaUrls && getSelectedPostDetails()!.mediaUrls.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Media</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {getSelectedPostDetails()!.mediaUrls.map((url, index) => (
                        <div 
                          key={index} 
                          className="aspect-square bg-muted rounded-md overflow-hidden"
                        >
                          <img 
                            src={url} 
                            alt={`Media ${index}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="gap-2">
                {onEditPost && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowPostDetail(false);
                      onEditPost(getSelectedPostDetails()!.id);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                
                {onDeletePost && (
                  <Button 
                    variant="outline"
                    className="text-red-600"
                    onClick={() => {
                      setShowPostDetail(false);
                      onDeletePost(getSelectedPostDetails()!.id);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
                
                {onPublishPost && getSelectedPostDetails()!.status !== PostStatus.PUBLISHED && (
                  <Button 
                    onClick={() => {
                      setShowPostDetail(false);
                      onPublishPost(getSelectedPostDetails()!.id);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Publish Now
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SocialMediaContentCalendar;