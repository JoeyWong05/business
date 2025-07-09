import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  ShoppingCart,
  FileText,
  PieChart,
  Settings,
  Megaphone,
  Globe,
  ClipboardList,
  Calendar,
  DollarSign,
  Shield,
  Briefcase,
  Cpu,
  CreditCard,
  LineChart,
  Target,
  Award,
  Network,
  TrendingUp,
  Truck,
  Banknote,
  Brain,
  Image,
  School,
  Lock,
  BookOpen
} from 'lucide-react';

export type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  submenu?: {
    name: string;
    path: string;
    badge?: string;
  }[];
};

export const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard className="h-4 w-4" />,
    badge: 'New',
  },
  {
    name: 'Business Entities',
    path: '/business-entities',
    icon: <Building2 className="h-4 w-4" />,
    submenu: [
      { name: 'Digital Merch Pros', path: '/entity/digital-merch-pros' },
      { name: 'Mystery Hype', path: '/entity/mystery-hype' },
      { name: 'Lone Star Custom', path: '/entity/lone-star-custom' },
      { name: 'All Entities', path: '/entity-dashboards' },
    ],
  },
  {
    name: 'Finance',
    path: '/financial-health',
    icon: <DollarSign className="h-4 w-4" />,
    submenu: [
      { name: 'Financial Health', path: '/financial-health' },
      { name: 'Cost Analysis', path: '/cost-analysis' },
      { name: 'Cost Overview', path: '/cost-overview' },
      { name: 'Business Forecast', path: '/business-forecast' },
      { name: 'Business Valuation', path: '/business-valuation' },
      { name: 'Profit & Loss', path: '/profit-loss' },
    ],
  },
  {
    name: 'Operations',
    path: '/business-operations',
    icon: <BarChart3 className="h-4 w-4" />,
    submenu: [
      { name: 'Business Operations', path: '/business-operations' },
      { name: 'Department Automation', path: '/department-automation' },
      { name: 'Organization Chart', path: '/organization-chart' },
      { name: 'Workflow Suggestions', path: '/workflow-suggestions' },
      { name: 'SOPs', path: '/sop-detail' },
      { name: 'Inventory', path: '/inventory-management' },
    ],
  },
  {
    name: 'Sales',
    path: '/client-management',
    icon: <ShoppingCart className="h-4 w-4" />,
    badge: '3',
    submenu: [
      { name: 'Client Management', path: '/client-management' },
      { name: 'Sales Pipeline', path: '/sales-pipeline' },
      { name: 'Omni-Channel Sales', path: '/omni-channel-sales' },
      { name: 'Deal Tracking', path: '/deal-tracking' },
    ],
  },
  {
    name: 'Marketing',
    path: '/social-media-dashboard',
    icon: <Megaphone className="h-4 w-4" />,
    submenu: [
      { name: 'Social Media', path: '/social-media-dashboard' },
      { name: 'Advertising', path: '/advertising-management' },
      { name: 'SEO Intelligence', path: '/seo-intelligence' },
      { name: 'Brand Assets', path: '/brand-assets' },
      { name: 'Content Calendar', path: '/content-calendar' },
    ],
  },
  {
    name: 'Customer',
    path: '/customer-service',
    icon: <Users className="h-4 w-4" />,
    submenu: [
      { name: 'Customer Service', path: '/customer-service' },
      { name: 'Customer Feedback', path: '/customer-feedback' },
      { name: 'Customer Segments', path: '/customer-segments' },
      { name: 'Support Tickets', path: '/support-tickets' },
    ],
  },
  {
    name: 'Strategy',
    path: '/business-strategy',
    icon: <Target className="h-4 w-4" />,
    submenu: [
      { name: 'Business Strategy', path: '/business-strategy' },
      { name: 'Operating System', path: '/operating-system' },
      { name: 'Company Goals', path: '/company-goals' },
      { name: 'Training Academy', path: '/training-academy' },
    ],
  },
  {
    name: 'Legal & Compliance',
    path: '/legal-compliance',
    icon: <Shield className="h-4 w-4" />,
    submenu: [
      { name: 'Legal Documents', path: '/legal-documents' },
      { name: 'Password Vault', path: '/password-vault' },
      { name: 'Compliance', path: '/compliance' },
    ],
  },
  {
    name: 'Partners & Investors',
    path: '/partner-portal',
    icon: <Briefcase className="h-4 w-4" />,
    badge: 'Premium',
    submenu: [
      { name: 'Partner Portal', path: '/partner-portal' },
      { name: 'Investor Dashboard', path: '/investor-dashboard' },
      { name: 'Cap Table', path: '/cap-table' },
      { name: 'Pitch Decks', path: '/pitch-decks' },
    ],
  },
  {
    name: 'AI Tools',
    path: '/advanced-ai',
    icon: <Brain className="h-4 w-4" />,
    badge: 'New',
    submenu: [
      { name: 'Advanced AI', path: '/advanced-ai' },
      { name: 'Generate SOP', path: '/generate-sop' },
      { name: 'AI Assistant', path: '/ai-assistant' },
    ],
  },
  {
    name: 'Intelligence',
    path: '/personalization',
    icon: <TrendingUp className="h-4 w-4" />,
    badge: 'New',
    submenu: [
      { name: 'Personalization', path: '/personalization' },
      { name: 'Smart Recommendations', path: '/recommendations' },
      { name: 'Predictive Insights', path: '/predictive-insights' },
      { name: 'Intelligence Settings', path: '/intelligence-settings' },
    ],
  },
];