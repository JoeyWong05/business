import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  BarChart4,
  Bell,
  Briefcase,
  Building,
  Calendar,
  ChevronDown, 
  ChevronLeft,
  Clipboard,
  Cpu,
  CreditCard,
  DollarSign,
  FileImage,
  FileText,
  GanttChart,
  HeartPulse,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Megaphone,
  MessageSquare,
  PieChart,
  Settings,
  ShoppingCart,
  Sparkles,
  Target,
  UserCog,
  Users,
  Zap
} from "lucide-react";

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

interface NotificationCount {
  inquiries: number;
  orders: number;
  meetings: number;
  messages: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

// Define sidebar menu sections with submenus
interface MenuItem {
  name: string;
  slug: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  children?: {
    name: string;
    path: string;
    icon?: React.ReactNode;
    badge?: string;
  }[];
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    // Default expanded menus
    businessOps: true
  });
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const [notificationCounts, setNotificationCounts] = useState<NotificationCount>({
    inquiries: 3,
    orders: 2,
    meetings: 1,
    messages: 5
  });

  // Fetching data
  const { data: categoriesData } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()),
  });

  const { data: subcategoriesData } = useQuery({
    queryKey: ['/api/subcategories'],
    queryFn: () => fetch('/api/subcategories').then(res => res.json()),
  });

  // Parse data
  const categories: Category[] = (categoriesData && typeof categoriesData === 'object' && 
    categoriesData !== null && 'categories' in categoriesData && 
    Array.isArray(categoriesData.categories)) ? categoriesData.categories : [];
  
  const subcategories: Subcategory[] = (subcategoriesData && typeof subcategoriesData === 'object' && 
    subcategoriesData !== null && 'subcategories' in subcategoriesData && 
    Array.isArray(subcategoriesData.subcategories)) ? subcategoriesData.subcategories : [];
  
  // Auto-expand menus based on current location
  useEffect(() => {
    // Auto-expand parent menu of current location
    menuItems.forEach((menuItem) => {
      if (menuItem.children) {
        const isChildActive = menuItem.children.some(child => child.path === location);
        if (isChildActive) {
          setExpandedMenus(prev => ({ ...prev, [menuItem.slug]: true }));
          setActiveParent(menuItem.slug);
        }
      }
    });
    
    // Auto-expand category if a subcategory is active
    const categoryMatch = location.match(/\/category\/([^?]+)/);
    if (categoryMatch && categoryMatch[1]) {
      setExpandedCategories(prev => ({ ...prev, [categoryMatch[1]]: true }));
    }
  }, [location]);

  // Define the advanced menu structure
  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      slug: "dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-3 text-blue-500" />,
      path: "/"
    },
    {
      name: "Business Operations",
      slug: "businessOps",
      icon: <Briefcase className="h-5 w-5 mr-3 text-amber-600" />,
      children: [
        {
          name: "Categories Overview",
          path: "/categories",
          icon: <Layers className="h-4 w-4 text-amber-500" />
        },
        {
          name: "Tool Management",
          path: "/tool-management",
          icon: <GanttChart className="h-4 w-4 text-amber-500" />
        },
        {
          name: "Generate SOP",
          path: "/generate-sop",
          icon: <FileText className="h-4 w-4 text-amber-500" />
        },
        {
          name: "Automation Score 2.0",
          path: "/automation-score",
          icon: <Zap className="h-4 w-4 text-amber-500" />,
          badge: "New"
        },
        {
          name: "Weekly Digest",
          path: "/weekly-digest",
          icon: <FileText className="h-4 w-4 text-amber-500" />,
          badge: "New"
        },
        {
          name: "VA Command Center",
          path: "/va-center",
          icon: <Users className="h-4 w-4 text-amber-500" />,
          badge: "New"
        }
      ]
    },
    {
      name: "Financial Management",
      slug: "finance",
      icon: <DollarSign className="h-5 w-5 mr-3 text-green-600" />,
      children: [
        {
          name: "Cost Overview",
          path: "/cost-overview",
          icon: <LineChart className="h-4 w-4 text-green-500" />
        },
        {
          name: "Cost Analysis",
          path: "/cost-analysis",
          icon: <BarChart4 className="h-4 w-4 text-green-500" />
        },
        {
          name: "ROI Calculator",
          path: "/roi-calculator",
          icon: <PieChart className="h-4 w-4 text-green-500" />
        },
        {
          name: "Expense Tracking",
          path: "/expense-tracking",
          icon: <DollarSign className="h-4 w-4 text-green-500" />
        }
      ]
    },
    {
      name: "Customer Management",
      slug: "customer",
      icon: <Users className="h-5 w-5 mr-3 text-purple-600" />,
      children: [
        {
          name: "Customer Inquiries",
          path: "/customer-inquiries",
          icon: <MessageSquare className="h-4 w-4 text-purple-500" />
        },
        {
          name: "WhatsApp Integration",
          path: "/whatsapp-settings",
          icon: <MessageSquare className="h-4 w-4 text-purple-500" />
        }
      ]
    },
    {
      name: "Sales & Orders",
      slug: "sales",
      icon: <ShoppingCart className="h-5 w-5 mr-3 text-blue-600" />,
      children: [
        {
          name: "Order Management",
          path: "/orders",
          icon: <ShoppingCart className="h-4 w-4 text-blue-500" />
        },
        {
          name: "Sales Analytics",
          path: "/sales-analytics",
          icon: <BarChart4 className="h-4 w-4 text-blue-500" />
        }
      ]
    },
    {
      name: "Marketing",
      slug: "marketing",
      icon: <Megaphone className="h-5 w-5 mr-3 text-red-600" />,
      children: [
        {
          name: "Campaign Manager",
          path: "/campaigns",
          icon: <Target className="h-4 w-4 text-red-500" />
        },
        {
          name: "Brand Asset Hub",
          path: "/brand-assets",
          icon: <FileImage className="h-4 w-4 text-red-500" />,
          badge: "New"
        }
      ]
    },
    {
      name: "Team Collaboration",
      slug: "collaboration",
      icon: <Users className="h-5 w-5 mr-3 text-indigo-600" />,
      children: [
        {
          name: "Meetings",
          path: "/meetings",
          icon: <Calendar className="h-4 w-4 text-indigo-500" />
        },
        {
          name: "Team Members",
          path: "/team",
          icon: <Users className="h-4 w-4 text-indigo-500" />
        },
        {
          name: "Department Automation",
          path: "/department-automation",
          icon: <Cpu className="h-4 w-4 text-indigo-500" />
        }
      ]
    },
    {
      name: "Competitor Analysis",
      slug: "competitors",
      icon: <Target className="h-5 w-5 mr-3 text-orange-600" />,
      path: "/competitors"
    },
    {
      name: "Agency Killer",
      slug: "agencyKiller",
      icon: <Sparkles className="h-5 w-5 mr-3 text-purple-600" />,
      path: "/agency-killer"
    },
    {
      name: "Projects",
      slug: "projects",
      icon: <Clipboard className="h-5 w-5 mr-3 text-cyan-600" />,
      path: "/projects"
    },
    {
      name: "VA Command Center",
      slug: "va-center",
      icon: <Users className="h-5 w-5 mr-3 text-emerald-600" />,
      path: "/va-center",
      badge: "New"
    },
    {
      name: "Weekly Digest",
      slug: "weekly-digest",
      icon: <Activity className="h-5 w-5 mr-3 text-cyan-600" />,
      path: "/weekly-digest",
      badge: "New"
    }
  ];

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const toggleMenu = (slug: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const getCategorySubcategories = (categoryId: number) => {
    return subcategories.filter((sub) => sub.categoryId === categoryId);
  };

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo and App Name */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="ml-2 font-semibold text-lg">DMPHQ</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost" 
            size="icon"
            onClick={onToggle}
          >
            <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {/* New Menu Structure with vertical navigation */}
        <div className="flex flex-col">
          {menuItems.map((menuItem) => (
            <div key={menuItem.slug} className="mb-1">
              {/* Menu Item with no children (direct link) */}
              {!menuItem.children && menuItem.path && (
                <Link href={menuItem.path}>
                  <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location === menuItem.path 
                      ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-white" 
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}>
                    {menuItem.icon}
                    <span>{menuItem.name}</span>
                  </a>
                </Link>
              )}

              {/* Menu Item with children (dropdown) */}
              {menuItem.children && (
                <>
                  <button 
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${
                      activeParent === menuItem.slug 
                        ? "bg-gray-50 dark:bg-gray-800 text-primary dark:text-primary border-l-2 border-primary" 
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                    onClick={() => toggleMenu(menuItem.slug)}
                  >
                    <div className="flex items-center">
                      {menuItem.icon}
                      <span>{menuItem.name}</span>
                      
                      {/* Notification badges for certain sections */}
                      {menuItem.slug === 'customer' && notificationCounts.inquiries > 0 && (
                        <Badge variant="destructive" className="ml-2 px-1.5 py-0.5">
                          {notificationCounts.inquiries}
                        </Badge>
                      )}
                      {menuItem.slug === 'sales' && notificationCounts.orders > 0 && (
                        <Badge variant="destructive" className="ml-2 px-1.5 py-0.5">
                          {notificationCounts.orders}
                        </Badge>
                      )}
                      {menuItem.slug === 'collaboration' && notificationCounts.meetings > 0 && (
                        <Badge variant="destructive" className="ml-2 px-1.5 py-0.5">
                          {notificationCounts.meetings}
                        </Badge>
                      )}
                    </div>
                    
                    <ChevronDown
                      className={`h-5 w-5 transform transition-transform duration-200 ${
                        expandedMenus[menuItem.slug] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {/* Submenu Items */}
                  <div 
                    className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ${
                      expandedMenus[menuItem.slug] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {menuItem.children.map((subItem) => {
                      // Check for notifications on specific items
                      const hasNotification = 
                        (subItem.path === '/customer-inquiries' && notificationCounts.inquiries > 0) ||
                        (subItem.path === '/orders' && notificationCounts.orders > 0) ||
                        (subItem.path === '/meetings' && notificationCounts.meetings > 0) ||
                        (subItem.path === '/whatsapp-settings' && notificationCounts.messages > 0);
                      
                      return (
                        <Link key={subItem.path} href={subItem.path}>
                          <a className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                            location === subItem.path 
                              ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-white" 
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}>
                            <div className="flex items-center">
                              {subItem.icon && (
                                <div className="w-5 mr-2 inline-flex justify-center">
                                  {subItem.icon}
                                </div>
                              )}
                              <span>{subItem.name}</span>
                            </div>
                            
                            {/* Show badge if this item has notifications */}
                            {hasNotification && (
                              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5">
                                {subItem.path === '/customer-inquiries' ? notificationCounts.inquiries : 
                                 subItem.path === '/orders' ? notificationCounts.orders :
                                 subItem.path === '/meetings' ? notificationCounts.meetings :
                                 subItem.path === '/whatsapp-settings' ? notificationCounts.messages : 0}
                              </Badge>
                            )}
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Original DMPHQ Categories */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Business Categories</span>
            <Badge variant="outline" className="text-xs font-normal">
              {categories.length}
            </Badge>
          </div>
          
          {categories.map((category) => {
            const subcats = getCategorySubcategories(category.id);
            const hasSubcats = subcats.length > 0;
            
            return (
              <div key={category.id} className="mt-1">
                <button 
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none ${
                    location.includes(`/category/${category.slug}`) 
                      ? "bg-gray-50 dark:bg-gray-800 text-primary dark:text-primary border-l-2 border-primary" 
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => toggleCategory(category.slug)}
                >
                  <div className="flex items-center">
                    <span className={`material-icons mr-3 ${category.color}`}>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    {hasSubcats && (
                      <Badge variant="outline" className="mr-2 px-1.5 py-0.5 text-xs">
                        {subcats.length}
                      </Badge>
                    )}
                    <ChevronDown
                      className={`h-5 w-5 transform transition-transform duration-200 ${
                        expandedCategories[category.slug] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                
                {/* Subcategories */}
                <div 
                  className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ${
                    expandedCategories[category.slug] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {subcats.map((subcategory) => {
                    const subUrl = `/category/${category.slug}?subcategory=${subcategory.slug}`;
                    const isActive = location.includes(subUrl);
                    
                    return (
                      <Link key={subcategory.id} href={subUrl}>
                        <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          isActive 
                            ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-white" 
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}>
                          <span>{subcategory.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Settings & Help */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>System</span>
            <Badge variant="secondary" className="text-xs px-1.5">
              Admin
            </Badge>
          </div>
          
          {/* System Menu Items */}
          <div className="space-y-1">
            <Link href="/settings">
              <a className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                location === "/settings" 
                  ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-white border-l-2 border-primary" 
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Settings</span>
                </div>
              </a>
            </Link>
            
            <Link href="/help">
              <a className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                location === "/help" 
                  ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-white border-l-2 border-primary" 
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
                <div className="flex items-center">
                  <LifeBuoy className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Help & Resources</span>
                </div>
              </a>
            </Link>
            
            <Link href="/account">
              <a className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                location === "/account" 
                  ? "bg-gray-100 dark:bg-gray-700 text-primary dark:text-white border-l-2 border-primary" 
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>
                <div className="flex items-center">
                  <UserCog className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Account</span>
                </div>
              </a>
            </Link>
          </div>
          
          {/* Version Info */}
          <div className="mt-6 pt-2 px-3 flex items-center justify-between text-xs text-gray-500">
            <span>Version 2.3.0</span>
            <span className="px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
              Online
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
}
