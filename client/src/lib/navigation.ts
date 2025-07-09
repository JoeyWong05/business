import { ReactNode } from 'react';
import {
  BarChart3,
  BookCopy,
  Building2,
  Calendar,
  CircleDollarSign,
  FileBarChart,
  FileStack,
  FileText,
  Goal,
  GraduationCap,
  Home,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Lock,
  Megaphone,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Target,
  Trello,
  Users,
  Wallet,
  Workflow,
} from 'lucide-react';

export interface BusinessEntity {
  id: number;
  name: string;
  slug: string;
  shortName?: string;
  logo?: any; // This would be a component or string for logo
}

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: any;
  disabled?: boolean;
  external?: boolean;
  badge?: string | number;
  badgeColor?: 'default' | 'success' | 'warning' | 'danger';
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  icon?: any;
  items: NavItem[];
}

// Business entities for the company switcher
export const businessEntities: BusinessEntity[] = [
  {
    id: 1,
    name: 'Digital Merch Pros',
    slug: 'digital-merch-pros',
    shortName: 'DMP',
  },
  {
    id: 2,
    name: 'Mystery Hype',
    slug: 'mystery-hype',
    shortName: 'MH',
  },
  {
    id: 3,
    name: 'Lone Star Custom Clothing',
    slug: 'lone-star-custom',
    shortName: 'LSCC',
  },
  {
    id: 4,
    name: 'Alcoeaze',
    slug: 'alcoeaze',
    shortName: 'Alco',
  },
  {
    id: 5,
    name: 'Hide Cafe Bar',
    slug: 'hide-cafe-bar',
    shortName: 'HCB',
  },
];

// Main navigation following FOMSC order (Finance, Operations, Marketing, Sales, Customer)
export const mainNavigation: NavSection[] = [
  // Finance Section
  {
    title: 'Finance',
    icon: CircleDollarSign,
    items: [
      {
        title: 'Financial Overview',
        href: '/financial-overview',
        icon: BarChart3,
      },
      {
        title: 'Valuation Dashboard',
        href: '/business-valuation',
        icon: Building2,
        badge: 'New',
      },
      {
        title: 'Financial Forecasts',
        href: '/business-forecast',
        icon: LineChart,
      },
      {
        title: 'Profit & Loss',
        href: '/profit-loss',
        icon: FileBarChart,
      },
    ],
  },
  
  // Operations Section
  {
    title: 'Operations',
    icon: Workflow,
    items: [
      {
        title: 'Operations Dashboard',
        href: '/operations-dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Automation Score',
        href: '/department-automation',
        icon: Target,
      },
      {
        title: 'SOP Library',
        href: '/generate-sop',
        icon: BookCopy,
      },
      {
        title: 'Team Activity Log',
        href: '/activity-log',
        icon: Calendar,
      },
      {
        title: 'Integrations',
        href: '/integrations',
        icon: Settings,
      },
    ],
  },
  
  // Marketing Section
  {
    title: 'Marketing',
    icon: Megaphone,
    items: [
      {
        title: 'Outreach Campaigns',
        href: '/campaigns',
        icon: Goal,
      },
      {
        title: 'SEO Dashboard',
        href: '/seo-intelligence',
        icon: BarChart3,
        badge: 'New',
      },
      {
        title: 'Ad Spend Overview',
        href: '/advertising',
        icon: Wallet,
      },
      {
        title: 'Social Metrics',
        href: '/social-media',
        icon: LineChart,
      },
    ],
  },
  
  // Sales Section
  {
    title: 'Sales',
    icon: LineChart,
    items: [
      {
        title: 'Lead Pipeline',
        href: '/sales-dashboard',
        icon: Trello,
      },
      {
        title: 'Sales by Channel',
        href: '/omni-channel-sales',
        icon: BarChart3,
        badge: 'New',
      },
      {
        title: 'Funnel Analysis',
        href: '/sales-funnel',
        icon: LineChart,
      },
      {
        title: 'Orders & Fulfillment',
        href: '/orders',
        icon: ShoppingCart,
        badge: 3,
      },
    ],
  },
  
  // Customer Section
  {
    title: 'Customer',
    icon: Users,
    items: [
      {
        title: 'CRM',
        href: '/client-management',
        icon: Users,
      },
      {
        title: 'Customer Segments',
        href: '/customer-segments',
        icon: Users,
      },
      {
        title: 'Feedback / NPS',
        href: '/customer-feedback',
        icon: Goal,
      },
      {
        title: 'Support Tickets',
        href: '/customer-service',
        icon: HelpCircle,
        badge: 2,
      },
    ],
  },
];

// Other navigation sections
export const otherNavigation: NavSection[] = [
  // Legal & Compliance Section
  {
    title: 'Legal & Compliance',
    icon: Shield,
    items: [
      {
        title: 'Overview',
        href: '/legal-compliance',
        icon: Shield,
      },
      {
        title: 'Document Center',
        href: '/legal-documents',
        icon: FileStack,
      },
      {
        title: 'Compliance Checklist',
        href: '/compliance-checklist',
        icon: Trello,
      },
      {
        title: 'Trademarks & Licensing',
        href: '/trademarks',
        icon: Lock,
        badge: 'New',
      },
    ],
  },
  
  // Strategy Section
  {
    title: 'Strategy',
    icon: Target,
    items: [
      {
        title: 'Company Health Score',
        href: '/business-strategy',
        icon: LineChart,
      },
      {
        title: 'North Star Metrics',
        href: '/north-star-metrics',
        icon: Target,
      },
      {
        title: 'Growth Tracker',
        href: '/growth-tracker',
        icon: LineChart,
      },
      {
        title: 'Weekly Digest',
        href: '/weekly-digest',
        icon: Calendar,
        badge: 'New',
      },
    ],
  },
  
  // Partner Portal Section
  {
    title: 'Partner Portal',
    icon: Building2,
    items: [
      {
        title: 'Updates & Announcements',
        href: '/partner-portal',
        icon: Megaphone,
      },
      {
        title: 'Pitch Decks & Docs',
        href: '/partner-documents',
        icon: FileStack,
      },
    ],
  },
  
  // Agency Killer Section
  {
    title: 'Agency Killer',
    icon: Sparkles,
    items: [
      {
        title: 'Agency Killer Dashboard',
        href: '/agency-killer',
        icon: Sparkles,
        badge: 'New',
      },
      {
        title: 'AI Copy Generator',
        href: '/agency-killer?tool=copy-generator',
        icon: Megaphone,
      },
      {
        title: 'SEO Toolkit',
        href: '/agency-killer?tool=seo-toolkit',
        icon: BarChart3,
      },
      {
        title: 'Ad Campaign Builder',
        href: '/agency-killer?tool=ad-campaign-builder',
        icon: Target,
      },
      {
        title: 'Marketing Funnel Builder',
        href: '/agency-killer?tool=funnel-builder',
        icon: Goal,
      },
      {
        title: 'Performance Simulator',
        href: '/agency-killer?tool=performance-simulator',
        icon: LineChart,
      },
    ],
  },
];

// Footer navigation
export const footerNavigation: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
  },
  {
    title: 'Training',
    href: '/training',
    icon: GraduationCap,
  },
];

// Agency Killer section
export const agencyKillerNavigation: NavSection[] = [
  {
    title: 'Agency Killer',
    icon: Sparkles,
    items: [
      {
        title: 'Agency Killer Dashboard',
        href: '/agency-killer',
        icon: Sparkles,
        badge: 'New',
      },
      {
        title: 'AI Copy Generator',
        href: '/agency-killer?tool=copy-generator',
        icon: Megaphone,
      },
      {
        title: 'SEO Toolkit',
        href: '/agency-killer?tool=seo-toolkit',
        icon: BarChart3,
      },
      {
        title: 'Ad Campaign Builder',
        href: '/agency-killer?tool=ad-campaign-builder',
        icon: Target,
      },
      {
        title: 'Marketing Funnel Builder',
        href: '/agency-killer?tool=funnel-builder',
        icon: Goal,
      },
      {
        title: 'Performance Simulator',
        href: '/agency-killer?tool=performance-simulator',
        icon: LineChart,
      },
    ],
  },
];

// Combined navigation for all sections
export const allNavigation: NavSection[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      {
        title: 'Home',
        href: '/',
        icon: Home,
      },
    ],
  },
  ...mainNavigation,
  ...otherNavigation,
  ...agencyKillerNavigation,
];