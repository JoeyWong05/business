import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMemberManagement from '@/components/TeamMemberManagement';
import SecureCredentialsManager from '@/components/SecureCredentialsManager';
import SalesChannelTracker from '@/components/SalesChannelTracker';
import SocialMediaManager from '@/components/SocialMediaManager';
import UpcomingBillsTable from '@/components/UpcomingBillsTable';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UsersRound,
  KeyRound,
  ShoppingCart,
  Share2,
  CreditCard,
  BarChartHorizontal,
  Calendar,
  PlusCircle,
  UserCog,
  ListChecks,
  Users,
  ArrowRight
} from 'lucide-react';

// Import relevant types
import { 
  ChannelStatus, 
  ChannelType,
  SalesChannel
} from '@/components/SalesChannelTracker';

import {
  CredentialType,
  Credential
} from '@/components/SecureCredentialsManager';

import {
  TeamMember
} from '@/components/TeamMemberManagement';

import {
  SocialPlatform,
  ContentType,
  PostStatus,
  SocialAccount,
  SocialPost
} from '@/components/SocialMediaManager';

import {
  BillItem
} from '@/components/UpcomingBillsTable';

export default function BusinessOperations() {
  const [selectedTab, setSelectedTab] = useState('team');

  // Fetch business entities
  const { data: entitiesData, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/business-entities'],
    queryFn: () => apiRequest('/api/business-entities')
  });

  // Mock data for presentation purposes
  // In a real implementation, these would be fetched from API endpoints
  const mockEntities = entitiesData?.entities || [
    { id: 1, name: "Digital Merch Pros" },
    { id: 2, name: "Mystery Hype" },
    { id: 3, name: "Lone Star Custom Clothing" },
    { id: 4, name: "Alcoeaze" },
    { id: 5, name: "Hide Cafe Bars" }
  ];

  // Team members
  const mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "Social Media Manager",
      source: "internal",
      status: "active",
      accessLevel: "admin",
      entityAccess: [1, 2, 3, 4, 5],
      platformAccess: ["instagram", "facebook", "tiktok"],
      startDate: "2023-01-15",
      avatarUrl: "https://ui-avatars.com/api/?name=John+Smith",
      lastActive: "2025-03-20T09:30:00.000Z"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      email: "maria@abcagency.com",
      role: "Content Creator",
      source: "agency",
      status: "active",
      accessLevel: "editor",
      entityAccess: [1, 2],
      platformAccess: ["instagram", "tiktok"],
      startDate: "2024-06-01",
      agencyName: "ABC Digital Agency",
      avatarUrl: "https://ui-avatars.com/api/?name=Maria+Rodriguez"
    },
    {
      id: 3,
      name: "David Kim",
      email: "davidk@upwork.com",
      role: "Graphic Designer",
      source: "upwork",
      status: "active",
      accessLevel: "limited",
      entityAccess: [1],
      platformAccess: ["instagram"],
      startDate: "2024-02-15",
      hourlyRate: 35,
      avatarUrl: "https://ui-avatars.com/api/?name=David+Kim"
    }
  ];

  // Credentials
  const mockCredentials: Credential[] = [
    {
      id: "cred1",
      name: "Instagram Account",
      username: "digitalmерchpros",
      platform: "Instagram",
      entityId: 1,
      entityName: "Digital Merch Pros",
      type: CredentialType.PASSWORD,
      lastModified: "2025-02-15",
      sharedWith: [
        { userId: 1, userName: "John Smith" },
        { userId: 2, userName: "Maria Rodriguez" }
      ]
    },
    {
      id: "cred2",
      name: "Shopify Admin",
      username: "admin@digitalmерchpros.com",
      platform: "Shopify",
      platformUrl: "https://digitalmерchpros.myshopify.com",
      entityId: 1,
      entityName: "Digital Merch Pros",
      type: CredentialType.PASSWORD,
      lastModified: "2025-01-20",
      accessCount: 14
    },
    {
      id: "cred3",
      name: "Mystery Hype TikTok",
      username: "mysteryhype",
      platform: "TikTok",
      entityId: 2,
      entityName: "Mystery Hype",
      type: CredentialType.PASSWORD,
      lastModified: "2025-03-05"
    },
    {
      id: "cred4",
      name: "AWS Access Key",
      platform: "AWS",
      entityId: 1,
      entityName: "Digital Merch Pros",
      type: CredentialType.API_KEY,
      lastModified: "2024-12-12",
      expiresAt: "2025-12-12"
    },
    {
      id: "cred5",
      name: "Google Authenticator",
      platform: "Google Workspace",
      entityId: 1,
      entityName: "Digital Merch Pros",
      type: CredentialType.OTP_SEED,
      lastModified: "2025-01-10"
    }
  ];

  // Sales channels
  const mockSalesChannels: SalesChannel[] = [
    {
      id: "ch1",
      name: "Main Shopify Store",
      platform: "Shopify",
      platformUrl: "https://digitalmерchpros.myshopify.com",
      type: ChannelType.ECOMMERCE,
      entityId: 1,
      entityName: "Digital Merch Pros",
      status: ChannelStatus.ACTIVE,
      monthlyRevenue: 32450,
      revenueGoal: 40000,
      monthlySales: 428,
      healthScore: 85,
      integrationStatus: "connected",
      lastSync: "2025-03-20T08:30:00.000Z",
      inventory: {
        productCount: 215,
        outOfStockCount: 5,
        lowStockCount: 12
      }
    },
    {
      id: "ch2",
      name: "Amazon Store",
      platform: "Amazon",
      type: ChannelType.MARKETPLACE,
      entityId: 1,
      entityName: "Digital Merch Pros",
      status: ChannelStatus.ACTIVE,
      monthlyRevenue: 18750,
      revenueGoal: 25000,
      monthlySales: 159,
      healthScore: 78,
      integrationStatus: "connected",
      lastSync: "2025-03-20T08:30:00.000Z",
      fees: {
        transactionPercentage: 15
      }
    },
    {
      id: "ch3",
      name: "Mystery Hype Shopify",
      platform: "Shopify",
      type: ChannelType.ECOMMERCE,
      entityId: 2,
      entityName: "Mystery Hype",
      status: ChannelStatus.ACTIVE,
      monthlyRevenue: 21350,
      revenueGoal: 30000,
      monthlySales: 187,
      healthScore: 73,
      integrationStatus: "connected"
    },
    {
      id: "ch4",
      name: "Walmart Marketplace",
      platform: "Walmart",
      type: ChannelType.MARKETPLACE,
      entityId: 1,
      entityName: "Digital Merch Pros",
      status: ChannelStatus.SETUP_REQUIRED,
      revenueGoal: 15000,
      healthScore: 20,
      integrationStatus: "issue"
    },
    {
      id: "ch5",
      name: "eBay Store",
      platform: "eBay",
      type: ChannelType.MARKETPLACE,
      entityId: 2,
      entityName: "Mystery Hype",
      status: ChannelStatus.ACTIVE,
      monthlyRevenue: 5280,
      revenueGoal: 8000,
      monthlySales: 42,
      healthScore: 65,
      integrationStatus: "connected"
    }
  ];

  // Social accounts
  const mockSocialAccounts: SocialAccount[] = [
    {
      id: "sa1",
      platform: SocialPlatform.INSTAGRAM,
      profileName: "@digitalmерchpros",
      profileUrl: "https://instagram.com/digitalmерchpros",
      entityId: 1,
      entityName: "Digital Merch Pros",
      metrics: {
        followers: 12500,
        engagement: 3.2,
        reachWeekly: 45000,
        growthRate: 2.1
      },
      hasPostingPermission: true,
      hasAnalyticsPermission: true,
      lastUpdated: "2025-03-19T15:30:00.000Z"
    },
    {
      id: "sa2",
      platform: SocialPlatform.TIKTOK,
      profileName: "@digitalmерchpros",
      profileUrl: "https://tiktok.com/@digitalmерchpros",
      entityId: 1,
      entityName: "Digital Merch Pros",
      metrics: {
        followers: 8750,
        engagement: 5.8,
        reachWeekly: 65000,
        growthRate: 4.2
      },
      hasPostingPermission: true,
      hasAnalyticsPermission: true,
      lastUpdated: "2025-03-19T15:30:00.000Z"
    },
    {
      id: "sa3",
      platform: SocialPlatform.INSTAGRAM,
      profileName: "@mysteryhype",
      profileUrl: "https://instagram.com/mysteryhype",
      entityId: 2,
      entityName: "Mystery Hype",
      metrics: {
        followers: 22800,
        engagement: 4.1,
        reachWeekly: 78000,
        growthRate: 1.8
      },
      hasPostingPermission: true,
      hasAnalyticsPermission: true,
      lastUpdated: "2025-03-19T15:30:00.000Z"
    },
    {
      id: "sa4",
      platform: SocialPlatform.FACEBOOK,
      profileName: "Digital Merch Pros",
      profileUrl: "https://facebook.com/digitalmерchpros",
      entityId: 1,
      entityName: "Digital Merch Pros",
      metrics: {
        followers: 5200,
        engagement: 1.5,
        reachWeekly: 12000,
        growthRate: 0.8
      },
      hasPostingPermission: true,
      hasAnalyticsPermission: true,
      lastUpdated: "2025-03-19T15:30:00.000Z"
    }
  ];

  // Social posts
  const mockSocialPosts: SocialPost[] = [
    {
      id: "sp1",
      accountId: "sa1",
      platform: SocialPlatform.INSTAGRAM,
      entityId: 1,
      entityName: "Digital Merch Pros",
      contentType: ContentType.IMAGE,
      content: "Our new spring collection has arrived! Check out our website for exclusive discounts. #fashion #newcollection",
      mediaUrls: ["https://example.com/image1.jpg"],
      status: PostStatus.PUBLISHED,
      publishedAt: "2025-03-15T12:00:00.000Z",
      createdBy: "John Smith",
      createdAt: "2025-03-14T10:30:00.000Z",
      metrics: {
        likes: 543,
        comments: 32,
        shares: 15,
        reach: 4500,
        engagement: 4.2
      },
      tags: ["fashion", "newcollection", "spring"],
      campaign: "Spring Launch 2025"
    },
    {
      id: "sp2",
      accountId: "sa1",
      platform: SocialPlatform.INSTAGRAM,
      entityId: 1,
      entityName: "Digital Merch Pros",
      contentType: ContentType.CAROUSEL,
      content: "Behind the scenes look at our design process. Swipe to see the magic happen! #behindthescenes #design",
      mediaUrls: ["https://example.com/image2.jpg", "https://example.com/image3.jpg"],
      status: PostStatus.PUBLISHED,
      publishedAt: "2025-03-18T14:30:00.000Z",
      createdBy: "Maria Rodriguez",
      createdAt: "2025-03-17T09:15:00.000Z",
      metrics: {
        likes: 378,
        comments: 28,
        shares: 8,
        reach: 3800,
        engagement: 3.5
      },
      tags: ["behindthescenes", "design", "process"],
      campaign: "Brand Storytelling"
    },
    {
      id: "sp3",
      accountId: "sa2",
      platform: SocialPlatform.TIKTOK,
      entityId: 1,
      entityName: "Digital Merch Pros",
      contentType: ContentType.VIDEO,
      content: "Watch how our t-shirts are made from start to finish. #manufacturing #sustainablefashion",
      mediaUrls: ["https://example.com/video1.mp4"],
      status: PostStatus.PUBLISHED,
      publishedAt: "2025-03-16T16:45:00.000Z",
      createdBy: "John Smith",
      createdAt: "2025-03-15T11:20:00.000Z",
      metrics: {
        likes: 4250,
        comments: 215,
        shares: 820,
        views: 28500,
        reach: 32000,
        engagement: 5.8
      },
      tags: ["manufacturing", "sustainablefashion", "behindthescenes"],
      campaign: "Brand Storytelling"
    },
    {
      id: "sp4",
      accountId: "sa1",
      platform: SocialPlatform.INSTAGRAM,
      entityId: 1,
      entityName: "Digital Merch Pros",
      contentType: ContentType.IMAGE,
      content: "Don't miss our weekend flash sale! 24 hours only. Use code FLASH25 for 25% off. #flashsale #discount",
      mediaUrls: ["https://example.com/image4.jpg"],
      status: PostStatus.SCHEDULED,
      scheduledFor: "2025-03-22T09:00:00.000Z",
      createdBy: "John Smith",
      createdAt: "2025-03-20T08:45:00.000Z",
      tags: ["flashsale", "discount", "weekend"],
      campaign: "Weekend Flash Sales"
    }
  ];

  // Upcoming bills
  const mockBills: BillItem[] = [
    {
      id: 1,
      name: "Shopify Advanced Plan",
      amount: 299,
      dueDate: new Date(2025, 3, 5),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "E-commerce",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 2,
      name: "AWS Hosting",
      amount: 245.80,
      dueDate: new Date(2025, 3, 12),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "IT Infrastructure",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 3,
      name: "Canva Pro Team",
      amount: 119.99,
      dueDate: new Date(2025, 3, 8),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Design Tools",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 4,
      name: "Mailchimp Premium",
      amount: 350,
      dueDate: new Date(2025, 3, 15),
      entityId: 2,
      entityName: "Mystery Hype",
      category: "Marketing",
      status: "pending",
      recurringType: "monthly"
    },
    {
      id: 5,
      name: "Adobe Creative Cloud",
      amount: 79.99,
      dueDate: new Date(2025, 3, 2),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Design Tools",
      status: "overdue",
      recurringType: "monthly"
    },
    {
      id: 6,
      name: "Facebook Ads",
      amount: 2000,
      dueDate: new Date(2025, 3, 1),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Advertising",
      status: "paid",
      recurringType: "monthly"
    },
    {
      id: 7,
      name: "QuickBooks Online",
      amount: 70,
      dueDate: new Date(2025, 3, 8),
      entityId: 1,
      entityName: "Digital Merch Pros",
      category: "Finance",
      status: "pending",
      recurringType: "monthly"
    }
  ];

  // Platform data
  const mockPlatforms = [
    { id: "instagram", name: "Instagram", type: "social", url: "https://instagram.com", iconUrl: "https://cdn.icon-icons.com/icons2/2037/PNG/512/ig_instagram_media_social_icon_124260.png" },
    { id: "facebook", name: "Facebook", type: "social", url: "https://facebook.com", iconUrl: "https://cdn.icon-icons.com/icons2/2037/PNG/512/fb_facebook_facebook_logo_social_media_icon_124262.png" },
    { id: "tiktok", name: "TikTok", type: "social", url: "https://tiktok.com", iconUrl: "https://cdn.icon-icons.com/icons2/2859/PNG/512/tiktok_icon_181359.png" },
    { id: "twitter", name: "Twitter", type: "social", url: "https://twitter.com", iconUrl: "https://cdn.icon-icons.com/icons2/2037/PNG/512/tw_twitter_twitter_logo_icon_124242.png" },
    { id: "shopify", name: "Shopify", type: "ecommerce", url: "https://shopify.com", iconUrl: "https://cdn.icon-icons.com/icons2/2407/PNG/512/shopify_icon_146101.png" },
    { id: "amazon", name: "Amazon", type: "marketplace", url: "https://amazon.com", iconUrl: "https://cdn.icon-icons.com/icons2/729/PNG/512/amazon_icon-icons.com_62714.png" },
    { id: "walmart", name: "Walmart", type: "marketplace", url: "https://marketplace.walmart.com", iconUrl: "https://cdn.icon-icons.com/icons2/2699/PNG/512/walmart_logo_icon_169208.png" },
    { id: "ebay", name: "eBay", type: "marketplace", url: "https://ebay.com", iconUrl: "https://cdn.icon-icons.com/icons2/729/PNG/512/ebay_icon-icons.com_62730.png" },
    { id: "etsy", name: "Etsy", type: "marketplace", url: "https://etsy.com", iconUrl: "https://cdn.icon-icons.com/icons2/729/PNG/512/etsy_icon-icons.com_62729.png" }
  ];

  // Campaign data
  const mockCampaigns = [
    { id: "camp1", name: "Spring Launch 2025" },
    { id: "camp2", name: "Summer Sale" },
    { id: "camp3", name: "Back to School" },
    { id: "camp4", name: "Holiday Season" },
    { id: "camp5", name: "Brand Storytelling" },
    { id: "camp6", name: "Weekend Flash Sales" }
  ];

  // Tab navigation
  const tabConfig = [
    { id: 'team', label: 'Team', icon: <UsersRound className="h-4 w-4" /> },
    { id: 'credentials', label: 'Credentials', icon: <KeyRound className="h-4 w-4" /> },
    { id: 'sales', label: 'Sales Channels', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'social', label: 'Social Media', icon: <Share2 className="h-4 w-4" /> },
    { id: 'bills', label: 'Bills & Expenses', icon: <CreditCard className="h-4 w-4" /> }
  ];

  // Handle adding a team member
  const handleAddTeamMember = (member: Omit<TeamMember, 'id'>) => {
    // Console log removed for performance optimization
    // In a real implementation, this would call an API endpoint
  };

  // Handle adding a credential
  const handleAddCredential = (credential: Omit<Credential, 'id'>) => {
    // Console log removed for performance optimization
    // In a real implementation, this would call an API endpoint
  };

  // Handle adding a sales channel
  const handleAddSalesChannel = (channel: Omit<SalesChannel, 'id'>) => {
    // Console log removed for performance optimization
    // In a real implementation, this would call an API endpoint
  };

  // Handle adding a social account
  const handleAddSocialAccount = (account: Omit<SocialAccount, 'id'>) => {
    // Console log removed for performance optimization
    // In a real implementation, this would call an API endpoint
  };

  // Handle adding a social post
  const handleAddSocialPost = (post: Omit<SocialPost, 'id'>) => {
    // Console log removed for performance optimization
    // In a real implementation, this would call an API endpoint
  };

  return (
    <MainLayout
      title="Business Operations"
      description="Manage teams, credentials, sales channels, and social media accounts across all your business entities."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Business Operations Dashboard</h1>
            <p className="text-muted-foreground">
              Centralized management for all your operational needs
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ListChecks className="h-4 w-4 mr-1" />
              Automations
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Permissions
            </Button>
            <Button size="sm">
              <UserCog className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UsersRound className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Team</h3>
                </div>
                <div className="text-3xl font-bold">{mockTeamMembers.length}</div>
                <div className="text-sm text-muted-foreground">Active team members</div>
                <div className="flex gap-1">
                  <Badge variant="outline">Internal</Badge>
                  <Badge variant="outline">Agencies</Badge>
                  <Badge variant="outline">Upwork</Badge>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedTab('team')}>
                  Manage <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Credentials</h3>
                </div>
                <div className="text-3xl font-bold">{mockCredentials.length}</div>
                <div className="text-sm text-muted-foreground">Secure passwords & keys</div>
                <div className="flex gap-1">
                  <Badge variant="outline">Passwords</Badge>
                  <Badge variant="outline">API Keys</Badge>
                  <Badge variant="outline">2FA</Badge>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedTab('credentials')}>
                  Manage <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Sales Channels</h3>
                </div>
                <div className="text-3xl font-bold">{mockSalesChannels.length}</div>
                <div className="text-sm text-muted-foreground">Active sales platforms</div>
                <div className="flex gap-1">
                  <Badge variant="outline">E-commerce</Badge>
                  <Badge variant="outline">Marketplaces</Badge>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedTab('sales')}>
                  Manage <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Social Media</h3>
                </div>
                <div className="text-3xl font-bold">{mockSocialAccounts.length}</div>
                <div className="text-sm text-muted-foreground">Connected accounts</div>
                <div className="flex gap-1">
                  <Badge variant="outline">Instagram</Badge>
                  <Badge variant="outline">TikTok</Badge>
                  <Badge variant="outline">Facebook</Badge>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedTab('social')}>
                  Manage <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium">Upcoming Bills</h3>
                </div>
                <div className="text-3xl font-bold">{mockBills.filter(b => b.status !== 'paid').length}</div>
                <div className="text-sm text-muted-foreground">Pending payments</div>
                <div className="flex gap-1">
                  <Badge variant="destructive">{mockBills.filter(b => b.status === 'overdue').length} Overdue</Badge>
                  <Badge variant="outline">${mockBills.reduce((sum, bill) => bill.status !== 'paid' ? sum + bill.amount : sum, 0).toFixed(2)}</Badge>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedTab('bills')}>
                  Manage <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="mb-6 w-full md:w-auto">
            {tabConfig.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex gap-2">
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="team" className="space-y-6">
            <TeamMemberManagement 
              teamMembers={mockTeamMembers}
              entities={mockEntities}
              platforms={mockPlatforms}
              onAddMember={handleAddTeamMember}
            />
          </TabsContent>
          
          <TabsContent value="credentials" className="space-y-6">
            <SecureCredentialsManager
              credentials={mockCredentials}
              entities={mockEntities}
              platforms={mockPlatforms}
              teamMembers={mockTeamMembers}
              onAddCredential={handleAddCredential}
              onGenerateTemporaryAccess={async (id) => `https://credentials.example.com/access/${id}?token=temp-${Date.now()}`}
              onGenerateOtp={async () => `${Math.floor(100000 + Math.random() * 900000)}`}
            />
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-6">
            <SalesChannelTracker
              channels={mockSalesChannels}
              entities={mockEntities}
              platforms={mockPlatforms.filter(p => p.type !== 'social')}
              teamMembers={mockTeamMembers}
              onAddChannel={handleAddSalesChannel}
              onSyncChannel={async () => new Promise(resolve => setTimeout(resolve, 1500))}
            />
          </TabsContent>
          
          <TabsContent value="social" className="space-y-6">
            <SocialMediaManager
              accounts={mockSocialAccounts}
              posts={mockSocialPosts}
              entities={mockEntities}
              teamMembers={mockTeamMembers}
              campaigns={mockCampaigns}
              onAddAccount={handleAddSocialAccount}
              onAddPost={handleAddSocialPost}
              onRefreshAnalytics={async () => new Promise(resolve => setTimeout(resolve, 1500))}
            />
          </TabsContent>
          
          <TabsContent value="bills" className="space-y-6">
            <UpcomingBillsTable
              bills={mockBills}
              showHeader={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}