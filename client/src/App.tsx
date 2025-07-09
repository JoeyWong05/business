import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from 'react';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MenuAdaptivityProvider } from "@/contexts/MenuAdaptivityContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { PersonalizationProvider } from "@/contexts/PersonalizationContext";
import AdaptiveMenuSuggestions from "@/components/AdaptiveMenuSuggestions";
import NavigationGuideBot from "@/components/NavigationGuideBot";
import CompanyGoals from "@/components/CompanyGoals";
import MobileMenu from "@/components/MobileMenu";

// Load essential components directly 
import NotFound from "@/pages/not-found";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import WorldClassNavigation from "@/components/WorldClassNavigation";
import SaasLayout from "@/components/SaasLayout";
import TemplatePage from "@/pages/TemplatePage";

// Lazy load all pages to improve initial load time
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const EnhancedDashboard = lazy(() => import("@/pages/EnhancedDashboard"));
const PartnerInvestorPortal = lazy(() => import("@/pages/PartnerInvestorPortal"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const ToolDetails = lazy(() => import("@/pages/ToolDetails"));
const GenerateSOP = lazy(() => import("@/pages/GenerateSOP"));
const CostAnalysis = lazy(() => import("@/pages/CostAnalysis"));
const CostOverview = lazy(() => import("@/pages/CostOverview"));
const SOPDetail = lazy(() => import("@/pages/SOPDetail"));
const SOPBuilderPage = lazy(() => import("@/pages/SOPBuilderPage"));
const Meetings = lazy(() => import("@/pages/Meetings"));
const WhatsAppSettings = lazy(() => import("@/pages/WhatsAppSettings"));
const CategoriesOverview = lazy(() => import("@/pages/CategoriesOverview"));
const DepartmentAutomation = lazy(() => import("@/pages/DepartmentAutomation"));
const AutomationScore = lazy(() => import("@/pages/AutomationScore"));
const OrganizationChart = lazy(() => import("@/pages/OrganizationChart"));
const FinancialHealth = lazy(() => import("@/pages/FinancialHealth"));
const BusinessOperations = lazy(() => import("@/pages/BusinessOperations"));
const SocialMediaDashboard = lazy(() => import("@/pages/SocialMediaDashboard"));
const CustomerService = lazy(() => import("@/pages/CustomerService"));
const AdvancedAI = lazy(() => import("@/pages/AdvancedAI"));
const AIInsightsPage = lazy(() => import("@/pages/AIInsightsPage"));
const EntityDashboards = lazy(() => import("@/pages/EntityDashboards"));
const AgencyKiller = lazy(() => import("@/pages/AgencyKiller"));
const ClientManagement = lazy(() => import("@/pages/ClientManagement"));
const InventoryManagement = lazy(() => import("@/pages/InventoryManagement"));
const AdvertisingManagement = lazy(() => import("@/pages/AdvertisingManagement"));
const BusinessStrategy = lazy(() => import("@/pages/BusinessStrategy"));
const BusinessForecast = lazy(() => import("@/pages/BusinessForecast"));
const FinancialOverview = lazy(() => import("@/pages/FinancialOverview"));
const HRDashboard = lazy(() => import("@/pages/HRDashboard"));
const OperatingSystem = lazy(() => import("@/pages/OperatingSystem"));
const WorldClassDashboard = lazy(() => import("@/pages/WorldClassDashboard"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const FomscDashboard = lazy(() => import("@/pages/FomscDashboard"));
const PasswordVault = lazy(() => import("@/pages/PasswordVault"));
const VACommandCenter = lazy(() => import("@/pages/VACommandCenter"));
const WorkflowSuggestions = lazy(() => import("@/pages/WorkflowSuggestions"));
const BrandAssets = lazy(() => import("@/pages/BrandAssets"));
const TrainingAcademy = lazy(() => import("@/pages/TrainingAcademy"));
const EmailMarketing = lazy(() => import("@/pages/EmailMarketing"));
const LegalCompliance = lazy(() => import("@/pages/LegalCompliance"));
const AdaptiveMenuDemo = lazy(() => import("@/pages/AdaptiveMenuDemo"));
const PartnerPortal = lazy(() => import("@/pages/PartnerPortal"));
const OmniChannelSales = lazy(() => import("@/pages/OmniChannelSales"));
const SalesDashboard = lazy(() => import("@/pages/SalesDashboard"));
const ProjectManagement = lazy(() => import("@/pages/EnhancedProjectManagement"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage"));
const VACenterPage = lazy(() => import("@/pages/VACenterPage"));
const SEOIntelligenceSystem = lazy(() => import("@/pages/SEOIntelligenceSystem"));

// Updated HR Pages imports
const TrainingHub = lazy(() => import('@/pages/TrainingHub')); 
const EmployeeDirectory = lazy(() => import('@/pages/EmployeeDirectory'));
const HiringCenter = lazy(() => import('@/pages/HiringCenter'));
const BusinessValuation = lazy(() => import("@/pages/BusinessValuation"));
const ToolsIntegration = lazy(() => import("@/pages/ToolsIntegration"));
const WeeklyDigestPage = lazy(() => import("./pages/WeeklyDigestPage"));
const ProfitLoss = lazy(() => import("@/pages/ProfitLoss"));
const CustomerFeedback = lazy(() => import("@/pages/CustomerFeedback"));
const LaunchTemplates = lazy(() => import("@/pages/LaunchTemplates"));
const CustomerSegments = lazy(() => import("@/pages/CustomerSegments"));
const LegalComplianceDashboard = lazy(() => import("@/pages/LegalComplianceDashboard"));
const LegalDocuments = lazy(() => import("@/pages/LegalDocuments"));
const ComplianceChecklist = lazy(() => import("@/pages/ComplianceChecklist"));
const OperationsDashboard = lazy(() => import("@/pages/OperationsDashboard"));
const StrategyDashboard = lazy(() => import("@/pages/StrategyDashboard"));
const CustomerHub = lazy(() => import("@/pages/CustomerHub"));
const MarketingHub = lazy(() => import("@/pages/MarketingHub"));
const EnhancedCRM = lazy(() => import("@/pages/EnhancedCRM"));
const MarketingAnalytics = lazy(() => import("@/pages/MarketingAnalytics"));
const PrintOnDemand = lazy(() => import("@/pages/PrintOnDemand"));

// Intelligence Section Pages
const Personalization = lazy(() => import("@/pages/Personalization"));
const Recommendations = lazy(() => import("@/pages/Recommendations"));
const PredictiveInsights = lazy(() => import("@/pages/PredictiveInsights"));
const IntelligenceSettings = lazy(() => import("@/pages/IntelligenceSettings"));

// New World-Class Additions
const CommandCenter = lazy(() => import("@/pages/CommandCenter"));
const BuilderMode = lazy(() => import("@/pages/BuilderMode"));
const Pulse = lazy(() => import("@/pages/Pulse"));
const FoundersHub = lazy(() => import("@/pages/FoundersHub"));
const ProductRnD = lazy(() => import("@/pages/ProductRnD"));
const TeamPulse = lazy(() => import("@/pages/TeamPulse"));

// Import the placeholder page component directly instead of lazy loading
import PlaceholderPage from "@/pages/PlaceholderPage";
import { 
  LayoutDashboard, FileText, Users, ShoppingCart, Sparkles, Target, 
  FileImage, Calendar, CreditCard, BarChart, Settings, 
  LineChart, UserCog, Building, Cpu, DollarSign, BarChartHorizontal,
  Menu, X, Search, Bell, User, ChevronDown, LogOut, Moon, Sun, Home, 
  BarChart2, PieChart, History, HelpCircle, Facebook, Twitter, 
  Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle,
  Shield, Map, ListChecks, Lock, MessageSquareText, Handshake, Shirt
} from "lucide-react";
import { useState, useEffect, useMemo, createContext, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

// Import contexts and components properly
import { useUserRole, UserRoleProvider } from "@/contexts/UserRoleContext";
import { OnboardingProvider } from "@/components/onboarding/OnboardingContext";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import DashboardTooltips from "@/components/onboarding/DashboardTooltips";
import { FloatingDemoModeToggle } from "@/components/FloatingDemoModeToggle";

// Template pages for routes not yet implemented
const ToolManagement = () => (
  <TemplatePage
    title="Tool Management"
    description="Manage and organize all your business tools"
    pageName="Tool Management"
    icon={<LayoutDashboard className="h-12 w-12" />}
  />
);

const ROICalculator = () => (
  <TemplatePage
    title="ROI Calculator"
    description="Calculate return on investment for your tools and systems"
    pageName="ROI Calculator"
    icon={<BarChart className="h-12 w-12" />}
  />
);

const ExpenseTracking = () => (
  <TemplatePage
    title="Expense Tracking"
    description="Track and manage expenses across your business"
    pageName="Expense Tracking"
    icon={<CreditCard className="h-12 w-12" />}
  />
);

const CustomerInquiries = () => (
  <TemplatePage
    title="Customer Inquiries"
    description="Manage and respond to customer inquiries"
    pageName="Customer Inquiries"
    icon={<Users className="h-12 w-12" />}
  />
);

const OrderManagement = () => (
  <TemplatePage
    title="Order Management"
    description="Track and manage customer orders"
    pageName="Order Management"
    icon={<ShoppingCart className="h-12 w-12" />}
  />
);

const SalesAnalytics = () => (
  <TemplatePage
    title="Sales Analytics"
    description="Analyze sales performance and trends"
    pageName="Sales Analytics"
    icon={<LineChart className="h-12 w-12" />}
  />
);

const CampaignManager = () => (
  <TemplatePage
    title="Campaign Manager"
    description="Create and manage marketing campaigns"
    pageName="Campaign Manager"
    icon={<Target className="h-12 w-12" />}
  />
);

// Create a wrapper component for redirecting from /assets to /brand-assets
const AssetLibraryRedirect = () => {
  const [_, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/brand-assets");
  }, [setLocation]);
  return null;
};

const TeamMembers = () => (
  <TemplatePage
    title="Team Members"
    description="Manage team members and permissions"
    pageName="Team Members"
    icon={<Users className="h-12 w-12" />}
  />
);

const CompetitorAnalysis = () => (
  <TemplatePage
    title="Competitor Analysis"
    description="Analyze and track competitor activities"
    pageName="Competitor Analysis"
    icon={<Target className="h-12 w-12" />}
  />
);

const SettingsPageTemplate = () => (
  <TemplatePage
    title="Settings"
    description="Configure system settings and preferences"
    pageName="Settings"
    icon={<Settings className="h-12 w-12" />}
  />
);

// Using the actual SettingsPage component
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const BillingPage = lazy(() => import("@/pages/BillingPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));

const HelpResources = () => (
  <TemplatePage
    title="Help & Resources"
    description="Get help and access resources"
    pageName="Help & Resources"
    icon={<FileText className="h-12 w-12" />}
  />
);

// Legacy AccountPage component has been replaced with the new one imported above

// Enhanced Premium Header Component
const EnhancedHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const { userRole } = useUserRole();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Effect to focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);
  
  // Navigation structure with role-based permissions and submenus
  const navigation = useMemo(() => [
    {
      name: 'Dashboard',
      path: '/',
      icon: <Home className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee', 'customer'],
      badge: null,
    },
    {
      name: 'Business Entities',
      path: '/entity-dashboards',
      icon: <Building className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee'],
      badge: null,
    },
    {
      name: 'Operations',
      path: '/operations-dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee'],
      badge: 'New',
      submenu: [
        { name: 'Operations Dashboard', path: '/operations-dashboard', badge: 'New' },
        { name: 'Business Overview', path: '/business-operations', badge: undefined },
        { name: 'Categories', path: '/categories', badge: undefined },
        { name: 'Tool Management', path: '/tool-management', badge: undefined },
        { name: 'Tools & Integrations', path: '/tools-integration', badge: 'New' },
        { name: 'Standard Operating Procedures', path: '/generate-sop', badge: undefined },
        { name: 'AI-Powered SOP Builder', path: '/sop-builder', badge: 'New' },
        { name: 'Project Management', path: '/projects', badge: 'New' },
        { name: 'VA Command Center', path: '/va-command-center', badge: 'New' },
        { name: 'Weekly Digest', path: '/weekly-digest', badge: 'New' },
        { name: 'Launch Library', path: '/launch-templates', badge: 'New' },
        { name: 'Operating System', path: '/operating-system', badge: undefined },
      ]
    },
    {
      name: 'Strategy',
      path: '/strategy-dashboard',
      icon: <PieChart className="h-5 w-5" />,
      roles: ['admin', 'manager'],
      badge: 'New',
      submenu: [
        { name: 'Strategy Dashboard', path: '/strategy-dashboard', badge: 'New' },
        { name: 'Business Strategy', path: '/business-strategy', badge: undefined },
        { name: 'Capacity Planning', path: '/business-strategy?tab=capacity-equation', badge: undefined },
        { name: 'Forecast', path: '/business-forecast', badge: undefined },
      ]
    },
    {
      name: 'Financial',
      path: '/financial-overview',
      icon: <DollarSign className="h-5 w-5" />,
      roles: ['admin', 'manager'],
      badge: null,
      submenu: [
        { name: 'Financial Overview', path: '/financial-overview', badge: 'New' },
        { name: 'Business Valuation', path: '/business-valuation', badge: 'New' },
        { name: 'Profit & Loss', path: '/profit-loss', badge: 'New' },
        { name: 'Financial Health', path: '/financial-health', badge: undefined },
        { name: 'Cost Overview', path: '/cost-overview', badge: undefined },
        { name: 'Cost Analysis', path: '/cost-analysis', badge: undefined },
        { name: 'ROI Calculator', path: '/roi-calculator', badge: undefined },
        { name: 'Expense Tracking', path: '/expense-tracking', badge: undefined },
      ]
    },
    {
      name: 'Sales',
      path: '/sales-analytics',
      icon: <BarChart2 className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      submenu: [
        { name: 'Sales Dashboard', path: '/sales-dashboard', badge: 'New' },
        { name: 'Sales Analytics', path: '/sales-analytics', badge: undefined },
        { name: 'Order Management', path: '/orders', badge: '2' },
        { name: 'Omni-Channel Sales', path: '/omni-channel-sales', badge: 'New' }
      ]
    },
    {
      name: 'Marketing',
      path: '/marketing-hub',
      icon: <Target className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee'],
      badge: null,
      submenu: [
        { name: 'Marketing Hub', path: '/marketing-hub', badge: 'New' },
        { name: 'Marketing Analytics', path: '/marketing-analytics', badge: 'New' },
        { name: 'Campaign Manager', path: '/campaigns', badge: undefined },
        { name: 'Email Marketing', path: '/email-marketing', badge: 'New' },
        { name: 'Social Media', path: '/social-media', badge: undefined },
        { name: 'SEO Intelligence', path: '/seo-intelligence', badge: 'New' },
        { name: 'Asset Library', path: '/assets', badge: undefined },
        { name: 'Brand Assets', path: '/brand-assets', badge: undefined },
        { name: 'Launch Library', path: '/launch-templates', badge: 'New' },
      ]
    },
    {
      name: 'Customer',
      path: '/customer-hub',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee', 'customer'],
      badge: '3',
      submenu: [
        { name: 'Customer Hub', path: '/customer-hub', badge: 'New' },
        { name: 'CRM', path: '/crm', badge: 'New' },
        { name: 'Customer Inquiries', path: '/customer-inquiries', badge: '3' },
        { name: 'Support Tickets', path: '/customer-service', badge: '5' },
        { name: 'Feedback & NPS', path: '/customer-feedback', badge: 'New' },
        { name: 'Customer Segments', path: '/customer-segments', badge: 'New' },
        { name: 'WhatsApp Integration', path: '/whatsapp-settings', badge: '5' },
      ]
    },
    {
      name: 'Team',
      path: '/team',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'manager'],
      badge: null,
      submenu: [
        { name: 'Team Members', path: '/team', badge: undefined },
        { name: 'Meetings', path: '/meetings', badge: '1' },
      ]
    },
    {
      name: 'Automation',
      path: '/department-automation',
      icon: <Cpu className="h-5 w-5" />,
      roles: ['admin', 'manager'],
      badge: null,
      submenu: [
        { name: 'Department Automation', path: '/department-automation', badge: undefined },
        { name: 'Automation Score 2.0', path: '/automation-score', badge: 'New' },
        { name: 'Organization Chart', path: '/organization-chart', badge: undefined },
        { name: 'AI Assistant', path: '/advanced-ai', badge: undefined },
        { name: 'Workflow Suggestions', path: '/workflow-suggestions', badge: 'New' },
        { name: 'Adaptive Menu Demo', path: '/adaptive-menu-demo', badge: 'New' },
      ]
    },
    {
      name: 'Competitors',
      path: '/competitors',
      icon: <Target className="h-5 w-5" />,
      roles: ['admin', 'manager'],
      badge: null,
    },
    {
      name: 'Print on Demand',
      path: '/print-on-demand',
      icon: <Shirt className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee', 'customer'],
      badge: 'New',
      submenu: [
        { name: 'Print on Demand', path: '/print-on-demand', badge: 'New' },
        { name: 'Product Catalog', path: '/print-on-demand?tab=catalog', badge: undefined },
        { name: 'My Store', path: '/print-on-demand?tab=store', badge: undefined },
        { name: 'My Designs', path: '/print-on-demand?tab=designs', badge: undefined },
        { name: 'Orders', path: '/print-on-demand?tab=orders', badge: undefined },
      ]
    },
    {
      name: 'Agency Killer',
      path: '/agency-killer',
      icon: <Sparkles className="h-5 w-5" />,
      roles: ['admin', 'manager', 'employee'],
      badge: 'New',
      submenu: [
        { name: 'Agency Killer Dashboard', path: '/agency-killer', badge: 'New' },
        { name: 'AI Copy Generator', path: '/agency-killer?tool=copy-generator', badge: undefined },
        { name: 'SEO Toolkit', path: '/agency-killer?tool=seo-toolkit', badge: undefined },
        { name: 'Ad Campaign Builder', path: '/agency-killer?tool=ad-campaign-builder', badge: undefined },
        { name: 'Marketing Funnel Builder', path: '/agency-killer?tool=funnel-builder', badge: undefined },
        { name: 'Performance Simulator', path: '/agency-killer?tool=performance-simulator', badge: undefined },
      ]
    },
    {
      name: 'Partner Portal',
      path: '/partner-portal',
      icon: <FileText className="h-5 w-5" />,
      roles: ['admin', 'manager'],
      badge: 'Premium',
    },
    {
      name: 'Partner/Investor Portal',
      path: '/partner-investor-portal',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'manager'],
      badge: 'New',
    },
  ], [userRole]);

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  // Toggle dropdown
  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon" className="lg:hidden relative p-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] overflow-auto">
                <SheetHeader className="border-b pb-4 mb-4">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80">
                      <BarChartHorizontal className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                    <SheetTitle className="ml-3 text-xl">DMPHQ</SheetTitle>
                  </div>
                  <SheetDescription>
                    Complete business execution platform for your organization
                  </SheetDescription>
                </SheetHeader>
                
                {/* Mobile search */}
                <div className="relative my-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search across platform..."
                    className="pl-10 pr-4 py-5"
                  />
                </div>
                
                {/* Mobile navigation */}
                <div className="mt-6 space-y-1.5">
                  {filteredNavigation.map((item) => (
                    <div key={item.name} className="mb-2">
                      <SheetClose asChild>
                        <Link to={item.path}>
                          <Button
                            variant={location === item.path ? "default" : "ghost"}
                            className="w-full justify-start gap-2 mb-1"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <div className="bg-primary/10 p-1.5 rounded-md">
                                {item.icon}
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </SheetClose>
                      
                      {/* Mobile submenu */}
                      {item.submenu && (
                        <div className="ml-11 border-l pl-3 space-y-1 mt-1 border-l-primary/20">
                          {item.submenu.map((subItem) => (
                            <SheetClose asChild key={subItem.path}>
                              <Link to={subItem.path}>
                                <Button
                                  variant={location === subItem.path ? "secondary" : "ghost"}
                                  size="sm"
                                  className="w-full justify-start text-sm"
                                >
                                  <div className="flex-1 text-left">{subItem.name}</div>
                                  {subItem.badge && (
                                    <Badge variant="outline" className="ml-auto h-5 min-w-5 px-1.5">
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </Button>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                {/* Mobile settings, help and logout */}
                <div className="grid grid-cols-2 gap-2">
                  <SheetClose asChild>
                    <Link to="/settings">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/help">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
                
                <div className="mt-8 flex flex-col space-y-2">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground truncate">Administrator</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Logo */}
            <Link to="/">
              <div className="flex items-center gap-2 mr-4">
                <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80 shadow-sm">
                  <BarChartHorizontal className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
                </div>
                <span className="font-bold text-xl hidden sm:inline-block tracking-tight">DMPHQ</span>
              </div>
            </Link>
            
            {/* Desktop navigation - only visible on large screens */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
              {filteredNavigation.slice(0, 5).map((item) => (
                <div 
                  key={item.path}
                  className="relative" 
                  onMouseEnter={() => item.submenu && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link to={item.path}>
                    <Button
                      variant={location === item.path ? "default" : "ghost"}
                      size="sm"
                      className={`px-2 lg:px-3 h-10 ${item.submenu ? 'group' : ''}`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-1 hidden lg:inline-block">{item.name}</span>
                        {item.submenu && (
                          <ChevronDown className="h-4 w-4 ml-0.5 transition duration-200 group-hover:rotate-180" />
                        )}
                      </div>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="ml-1 h-5 min-w-[18px] px-1 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  
                  {/* Dropdown menu */}
                  {item.submenu && activeDropdown === item.name && (
                    <div className="absolute left-0 top-full mt-1 w-64 z-50 bg-background rounded-md border shadow-lg overflow-hidden">
                      <div className="p-2 grid gap-1">
                        {item.submenu.map((subItem) => (
                          <Link key={subItem.path} to={subItem.path}>
                            <Button
                              variant={location === subItem.path ? "secondary" : "ghost"}
                              className="w-full justify-start h-9 px-2.5 text-sm"
                            >
                              <span className="flex-1 text-left">{subItem.name}</span>
                              {subItem.badge && (
                                <Badge variant="outline" className="ml-2 h-5 px-1.5">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* More dropdown for additional navigation items */}
              {filteredNavigation.length > 5 && (
                <div 
                  className="relative"
                  onMouseEnter={() => handleMouseEnter('more')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Button variant="ghost" size="sm" className="group">
                    <span className="lg:mr-1">More</span>
                    <ChevronDown className="h-4 w-4 transition duration-200 group-hover:rotate-180" />
                  </Button>
                  
                  {activeDropdown === 'more' && (
                    <div className="absolute right-0 top-full mt-1 w-64 z-50 bg-background rounded-md border shadow-lg overflow-hidden">
                      <div className="p-2 grid gap-1">
                        {filteredNavigation.slice(5).map((item) => (
                          <Link key={item.path} to={item.path}>
                            <Button
                              variant={location === item.path ? "secondary" : "ghost"}
                              className="w-full justify-start h-9 px-2.5 text-sm"
                            >
                              <div className="flex items-center flex-1">
                                {item.icon}
                                <span className="ml-2">{item.name}</span>
                              </div>
                              {item.badge && (
                                <Badge variant="outline" className="ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
          
          {/* Right side - Search, Theme, Notifications, Profile */}
          <div className="flex items-center gap-0.5 sm:gap-2">
            {/* Search button */}
            <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="flex md:mr-1">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-screen sm:h-[400px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>Search DMPHQ</SheetTitle>
                </SheetHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search for tools, departments, entities..."
                    className="pl-10 pr-4 py-6 text-lg bg-muted/50"
                  />
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Recent Searches</h3>
                    <ul className="space-y-2">
                      <li>
                        <Button variant="ghost" className="w-full justify-start">
                          <History className="mr-2 h-4 w-4" />
                          <span>Marketing department</span>
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start">
                          <History className="mr-2 h-4 w-4" />
                          <span>Cost analysis</span>
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start">
                          <History className="mr-2 h-4 w-4" />
                          <span>Digital Merch Pros</span>
                        </Button>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Quick Access</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/business-operations">
                          <Button variant="ghost" className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Business Operations</span>
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link href="/financial-health">
                          <Button variant="ghost" className="w-full justify-start">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>Financial Health</span>
                          </Button>
                        </Link>
                      </li>
                      <li>
                        <Link href="/department-automation">
                          <Button variant="ghost" className="w-full justify-start">
                            <Cpu className="mr-2 h-4 w-4" />
                            <span>Department Automation</span>
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">Business Entities</h3>
                    <ul className="space-y-2">
                      <li>
                        <Button variant="ghost" className="w-full justify-start">
                          <Building className="mr-2 h-4 w-4" />
                          <span>Digital Merch Pros</span>
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start">
                          <Building className="mr-2 h-4 w-4" />
                          <span>Mystery Hype</span>
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start">
                          <Building className="mr-2 h-4 w-4" />
                          <span>Lone Star Custom Clothing</span>
                        </Button>
                      </li>
                    </ul>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground shadow-sm">
                    7
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[350px]">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Badge variant="outline" className="font-normal">7 new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="max-h-[300px] overflow-auto">
                  <div className="p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New customer inquiry</p>
                        <p className="text-xs text-muted-foreground">John Smith asked about product pricing</p>
                        <p className="text-xs font-semibold text-primary mt-1">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-muted-foreground">Order #2458 needs processing</p>
                        <p className="text-xs font-semibold text-primary mt-1">28 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Team meeting reminder</p>
                        <p className="text-xs text-muted-foreground">Marketing strategy meeting at 2PM</p>
                        <p className="text-xs font-semibold text-primary mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Monthly financial report</p>
                        <p className="text-xs text-muted-foreground">February financial report is ready</p>
                        <p className="text-xs font-semibold text-primary mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 mt-2 text-center border-t">
                  <Button variant="ghost" size="sm" className="w-full">View all notifications</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 flex flex-col items-center justify-center">
                  <Avatar className="h-16 w-16 mb-2">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <DropdownMenuSeparator />
                <Link href="/account">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/help">
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

// New Modern Footer Component
const ModernFooter = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <div className="text-center md:text-left text-sm text-muted-foreground">
          <p>&copy; 2025 DMPHQ. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/help">
            <Button variant="link" size="sm" className="text-muted-foreground">
              Help
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="link" size="sm" className="text-muted-foreground">
              Privacy
            </Button>
          </Link>
          <Link href="/terms">
            <Button variant="link" size="sm" className="text-muted-foreground">
              Terms
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

// Enhanced Premium Footer Component
const EnhancedFooter = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80">
                <BarChartHorizontal className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">DMPHQ</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Comprehensive business execution platform leveraging AI to streamline workflows and enhance operational efficiency.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/business-operations">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Business Operations
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/financial-health">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Financial Management
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/social-media">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Social Media
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/department-automation">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Automation
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/organization-chart">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Organization Chart
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/help/documentation">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/help/tutorials">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    Video Tutorials
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/help/faq">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    FAQs
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/help/api">
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors">
                    API Documentation
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">support@dmphq.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Business Ave, Suite 100<br />
                  Austin, TX 78701
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2023-2025 DMPHQ Business Platform. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Link href="/privacy">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors text-xs">
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors text-xs">
                Terms of Service
              </Button>
            </Link>
            <Link href="/compliance">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors text-xs">
                Compliance
              </Button>
            </Link>
            <Link href="/security">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors text-xs">
                Security
              </Button>
            </Link>
            <Link href="/sitemap">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground transition-colors text-xs">
                Sitemap
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Navigation Guide Bot Trigger
const NavigationGuideTrigger = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return isVisible ? (
    <div className="fixed bottom-4 right-4 z-40 lg:right-8 lg:bottom-8">
      <div className="transform transition-all duration-300 ease-in-out hover:scale-105">
        <button 
          className="chat-button" 
          onClick={() => setIsVisible(false)}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  ) : null;
};

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SaasLayout>
        {children}
        <NavigationGuideTrigger />
      </SaasLayout>
    </>
  );
}

function Router() {
  // Loading fallback UI for lazy-loaded components
  const LoadingFallback = () => (
    <div className="flex h-full w-full items-center justify-center py-24">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          {/* Main pages */}
          <Route path="/" component={FomscDashboard} />
          <Route path="/dashboard/legacy-world-class" component={WorldClassDashboard} />
          <Route path="/dashboard/enhanced" component={EnhancedDashboard} />
          <Route path="/dashboard/legacy" component={Dashboard} />
          <Route path="/category/:slug" component={CategoryPage} />
          <Route path="/tool/:id" component={ToolDetails} />
          <Route path="/sop/:id" component={SOPDetail} />
          
          {/* Business Operations */}
          <Route path="/categories" component={CategoriesOverview} />
          <Route path="/tool-management" component={ToolManagement} />
          <Route path="/generate-sop" component={GenerateSOP} />
          <Route path="/sop-builder" component={SOPBuilderPage} />
          <Route path="/business-operations" component={BusinessOperations} />
          <Route path="/password-vault" component={PasswordVault} />
          <Route path="/project-management" component={ProjectManagement} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/projects/:id" component={ProjectDetailPage} />
          <Route path="/va-center" component={VACenterPage} />
          <Route path="/va-command-center" component={VACommandCenter} />
          <Route path="/weekly-digest" component={WeeklyDigestPage} />
          <Route path="/tools-integration" component={ToolsIntegration} />
          <Route path="/activities" component={Dashboard} />
          
          {/* Financial Management */}
          <Route path="/cost-analysis" component={CostAnalysis} />
          <Route path="/company-goals" component={CompanyGoals} />
          <Route path="/cost-overview" component={CostOverview} />
          <Route path="/financial-overview" component={FinancialOverview} />
          <Route path="/financial-health" component={FinancialHealth} />
          <Route path="/roi-calculator" component={ROICalculator} />
          <Route path="/expense-tracking" component={ExpenseTracking} />
          <Route path="/profit-loss" component={ProfitLoss} />
          
          {/* Customer Management */}
          <Route path="/customer-inquiries" component={CustomerInquiries} />
          <Route path="/customer-service" component={CustomerService} />
          <Route path="/client-management" component={ClientManagement} />
          <Route path="/whatsapp-settings" component={WhatsAppSettings} />

          {/* Notifications Center */}
          <Route path="/notifications" component={NotificationsPage} />
          
          {/* Inventory Management */}
          <Route path="/inventory-management" component={InventoryManagement} />
          
          {/* Sales & Orders */}
          <Route path="/orders" component={OrderManagement} />
          <Route path="/sales-analytics" component={SalesAnalytics} />
          <Route path="/sales-dashboard" component={SalesDashboard} />
          <Route path="/sales-metrics" component={SalesDashboard} />
          <Route path="/omni-channel-sales" component={OmniChannelSales} />
          <Route path="/print-on-demand" component={PrintOnDemand} />
          
          {/* Marketing */}
          <Route path="/campaigns" component={CampaignManager} />
          <Route path="/advertising" component={AdvertisingManagement} />
          <Route path="/advertising/legacy" component={AdvertisingManagement} />
          <Route path="/social-media" component={SocialMediaDashboard} />
          <Route path="/email-marketing" component={EmailMarketing} />
          <Route path="/seo-intelligence" component={SEOIntelligenceSystem} />
          
          {/* Business Strategy */}
          <Route path="/business-strategy" component={BusinessStrategy} />
          <Route path="/business-forecast" component={BusinessForecast} />
          <Route path="/business-valuation" component={BusinessValuation} />
          
          {/* Operating System */}
          <Route path="/operating-system" component={OperatingSystem} />
          <Route path="/assets" component={AssetLibraryRedirect} />
          <Route path="/brand-assets" component={BrandAssets} />
          
          {/* Human Resources */}
          <Route path="/hr-dashboard" component={() => <HRDashboard />} />
          <Route path="/hiring-center" component={() => <HiringCenter />} />
          <Route path="/training-hub" component={() => <TrainingHub />} />
          <Route path="/employee-directory" component={() => <EmployeeDirectory />} />
          
          {/* Legal & Compliance */}
          <Route path="/legal-compliance" component={LegalCompliance} />
          <Route path="/legal-compliance-dashboard" component={LegalComplianceDashboard} />
          <Route path="/legal-documents" component={LegalDocuments} />
          <Route path="/compliance-checklist" component={ComplianceChecklist} />
          
          {/* Operations */}
          <Route path="/operations-dashboard" component={OperationsDashboard} />
          
          {/* Strategy */}
          <Route path="/strategy-dashboard" component={StrategyDashboard} />
          
          {/* Marketing */}
          <Route path="/marketing-hub" component={MarketingHub} />
          <Route path="/marketing-analytics" component={MarketingAnalytics} />
          <Route path="/launch-templates" component={LaunchTemplates} />
          
          {/* Customer */}
          <Route path="/customer-hub" component={CustomerHub} />
          <Route path="/crm" component={EnhancedCRM} />
          <Route path="/customer-health" component={CustomerHub} />
          <Route path="/nps" component={CustomerFeedback} />
          <Route path="/customer-feedback" component={CustomerFeedback} />
          <Route path="/customer-segments" component={CustomerSegments} />
          
          {/* Team Collaboration */}
          <Route path="/meetings" component={Meetings} />
          <Route path="/team" component={TeamMembers} />
          <Route path="/department-automation" component={DepartmentAutomation} />
          <Route path="/automation-score" component={AutomationScore} />
          <Route path="/organization-chart" component={OrganizationChart} />
          <Route path="/academy" component={TrainingAcademy} />
          
          {/* Advanced Features */}
          <Route path="/advanced-ai" component={AdvancedAI} />
          <Route path="/ai-insights" component={AIInsightsPage} />
          <Route path="/entity-dashboards" component={EntityDashboards} />
          <Route path="/workflow-suggestions" component={WorkflowSuggestions} />
          <Route path="/adaptive-menu-demo" component={AdaptiveMenuDemo} />
          <Route path="/partner-portal" component={PartnerPortal} />
          <Route path="/partner-investor-portal" component={PartnerInvestorPortal} />
          
          {/* Other */}
          <Route path="/competitors" component={CompetitorAnalysis} />
          <Route path="/agency-killer" component={AgencyKiller} />

          {/* Intelligence Section */}
          <Route path="/personalization" component={Personalization} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/predictive-insights" component={PredictiveInsights} />
          <Route path="/intelligence-settings" component={IntelligenceSettings} />
          
          {/* New World-Class Additions */}
          <Route path="/command-center" component={CommandCenter} />
          <Route path="/builder-mode" component={BuilderMode} />
          <Route path="/pulse" component={Pulse} />
          <Route path="/founders-hub" component={FoundersHub} />
          <Route path="/product-rnd" component={ProductRnD} />
          <Route path="/team-pulse" component={TeamPulse} />
          
          <Route path="/settings" component={SettingsPage} />
          <Route path="/billing" component={BillingPage} />
          <Route path="/account" component={AccountPage} />
          
          {/* Footer Pages */}
          <Route path="/about" component={() => (
            <PlaceholderPage
              title="About DMPHQ"
              description="Learn about our company mission, values, and the team behind DMPHQ."
              icon={<Building className="h-5 w-5" />}
              pageType="Company Information"
              estimatedAvailability="Coming in Q2 2024"
            />
          )} />
          <Route path="/story" component={() => (
            <PlaceholderPage
              title="Our Story"
              description="Discover the journey of DMPHQ from its inception to becoming a leading business execution platform."
              icon={<History className="h-5 w-5" />}
              pageType="Company History"
              estimatedAvailability="Coming in Q2 2024"
            />
          )} />
          <Route path="/partners" component={() => (
            <PlaceholderPage
              title="Partners"
              description="Learn about our strategic partners and integration ecosystem that helps power DMPHQ."
              icon={<Handshake className="h-5 w-5" />}
              pageType="Partner Directory"
              estimatedAvailability="Coming in Q3 2024"
            />
          )} />
          <Route path="/features" component={() => (
            <PlaceholderPage
              title="Features"
              description="Explore the comprehensive features and capabilities of the DMPHQ platform."
              icon={<ListChecks className="h-5 w-5" />}
              pageType="Product Information"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/pricing" component={() => (
            <PlaceholderPage
              title="Pricing"
              description="View our transparent pricing options for businesses of all sizes."
              icon={<DollarSign className="h-5 w-5" />}
              pageType="Pricing Information"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/roadmap" component={() => (
            <PlaceholderPage
              title="Product Roadmap"
              description="See what's coming next for DMPHQ and our planned feature releases."
              icon={<Map className="h-5 w-5" />}
              pageType="Product Planning"
              estimatedAvailability="Coming in Q2 2024"
            />
          )} />
          <Route path="/updates" component={() => (
            <PlaceholderPage
              title="Product Updates"
              description="Stay informed about the latest features, improvements, and bug fixes in DMPHQ."
              icon={<Bell className="h-5 w-5" />}
              pageType="Release Notes"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/help" component={() => (
            <PlaceholderPage
              title="Help Center"
              description="Find answers to common questions and learn how to use DMPHQ effectively."
              icon={<HelpCircle className="h-5 w-5" />}
              pageType="Support Documentation"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/documentation" component={() => (
            <PlaceholderPage
              title="Documentation"
              description="Comprehensive guides and reference materials for using DMPHQ effectively."
              icon={<FileText className="h-5 w-5" />}
              pageType="Technical Documentation"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/contact" component={() => (
            <PlaceholderPage
              title="Contact Us"
              description="Get in touch with our team for support, feedback, or business inquiries."
              icon={<Mail className="h-5 w-5" />}
              pageType="Contact Information"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/feedback" component={() => (
            <PlaceholderPage
              title="Send Feedback"
              description="We value your input. Share your thoughts, suggestions, and feature requests with our team."
              icon={<MessageSquareText className="h-5 w-5" />}
              pageType="Feedback Form"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/privacy" component={() => (
            <PlaceholderPage
              title="Privacy Policy"
              description="Learn how we collect, use, and protect your personal information in DMPHQ."
              icon={<Shield className="h-5 w-5" />}
              pageType="Legal Documentation"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/terms" component={() => (
            <PlaceholderPage
              title="Terms of Service"
              description="Read our terms of service agreement that governs the use of DMPHQ."
              icon={<FileText className="h-5 w-5" />}
              pageType="Legal Documentation"
              estimatedAvailability="Available Now"
            />
          )} />
          <Route path="/security" component={() => (
            <PlaceholderPage
              title="Security & Compliance"
              description="Learn about our security practices, compliance certifications, and data protection measures."
              icon={<Lock className="h-5 w-5" />}
              pageType="Legal Documentation"
              estimatedAvailability="Available Now"
            />
          )} />
          
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AppLayout>
  );
}

function App() {
  return (
    <>
      {/* Always-visible mobile menu positioned outside the main app */}
      <MobileMenu />
      
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserRoleProvider>
            <MenuAdaptivityProvider>
              <DemoModeProvider>
                <NotificationsProvider>
                  <PersonalizationProvider>
                    <OnboardingProvider>
                      <Router />
                      <OnboardingFlow />
                      <DashboardTooltips />
                      <AdaptiveMenuSuggestions />
                      <FloatingDemoModeToggle />
                      <Toaster />
                    </OnboardingProvider>
                  </PersonalizationProvider>
                </NotificationsProvider>
              </DemoModeProvider>
            </MenuAdaptivityProvider>
          </UserRoleProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
