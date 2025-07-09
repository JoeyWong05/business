import React, { useState, useRef, ReactNode } from 'react';
import { useLocation, Link } from 'wouter';
import { useTheme } from "@/contexts/ThemeContext";
import WorldClassHeader from '@/components/WorldClassHeader';
import NewWorldClassSidebar from '@/components/NewWorldClassSidebar';
import WorldClassFooter from '@/components/WorldClassFooter';
import Aria from '@/components/Aria';
import { 
  Sheet, 
  SheetContent, 
  SheetClose
} from "@/components/ui/sheet";
import { 
  BarChartHorizontal, 
  Search,
  Menu,
  X,
  LineChart,
  Users,
  BarChart,
  ClipboardList,
  DollarSign,
  Cpu,
  Heart,
  Settings,
  FileText,
  Grid2x2
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorldClassNavigationProps {
  children: ReactNode;
}

export default function WorldClassNavigation({ children }: WorldClassNavigationProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const [location] = useLocation();
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  
  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden md:block sticky top-0 h-screen">
        <NewWorldClassSidebar expanded={isSidebarExpanded} onToggle={handleSidebarToggle} />
      </aside>
      
      {/* Mobile Menu - Improved for easier navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 flex flex-col w-[85vw] sm:max-w-md">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/80">
                <BarChartHorizontal className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">DMPHQ</h2>
                <p className="text-xs text-muted-foreground">Digital Merch Pros HQ</p>
              </div>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>
          
          {/* Search at top of mobile menu */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search across platform..."
                className="pl-10 pr-4 h-9"
              />
            </div>
          </div>
          
          {/* Mobile navigation (scrollable) */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Quick Categories as Cards */}
              <div className="grid grid-cols-2 gap-3">
                <SheetClose asChild>
                  <Link to="/financial-health" className="no-underline">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3 hover:shadow-md transition-all shadow-sm overflow-hidden relative group">
                      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-blue-500/20 -m-2 transition-all group-hover:scale-125 group-hover:rotate-[15deg]" />
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-blue-500/20 text-blue-600 dark:text-blue-300 mb-2">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-xs text-blue-600/70 dark:text-blue-300/70 font-medium">Finance</div>
                        </div>
                        <h3 className="text-base font-medium text-blue-700 dark:text-blue-300">Financial Health</h3>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Budgeting, Costs & Reports</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/business-operations" className="no-underline">
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/20 border border-purple-200 dark:border-purple-900/50 rounded-lg p-3 hover:shadow-md transition-all shadow-sm overflow-hidden relative group">
                      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-purple-500/20 -m-2 transition-all group-hover:scale-125 group-hover:rotate-[15deg]" />
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-purple-500/20 text-purple-600 dark:text-purple-300 mb-2">
                            <Cpu className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-xs text-purple-600/70 dark:text-purple-300/70 font-medium">Operations</div>
                        </div>
                        <h3 className="text-base font-medium text-purple-700 dark:text-purple-300">Business Ops</h3>
                        <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">Automation & Workflows</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/social-media" className="no-underline">
                    <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/20 border border-pink-200 dark:border-pink-900/50 rounded-lg p-3 hover:shadow-md transition-all shadow-sm overflow-hidden relative group">
                      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-pink-500/20 -m-2 transition-all group-hover:scale-125 group-hover:rotate-[15deg]" />
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-pink-500/20 text-pink-600 dark:text-pink-300 mb-2">
                            <BarChart className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-xs text-pink-600/70 dark:text-pink-300/70 font-medium">Marketing</div>
                        </div>
                        <h3 className="text-base font-medium text-pink-700 dark:text-pink-300">Social & Email</h3>
                        <p className="text-xs text-pink-600/70 dark:text-pink-400/70 mt-1">Campaigns & Analytics</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/sales-dashboard" className="no-underline">
                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/20 border border-green-200 dark:border-green-900/50 rounded-lg p-3 hover:shadow-md transition-all shadow-sm overflow-hidden relative group">
                      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-green-500/20 -m-2 transition-all group-hover:scale-125 group-hover:rotate-[15deg]" />
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-500/20 text-green-600 dark:text-green-300 mb-2">
                            <LineChart className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-xs text-green-600/70 dark:text-green-300/70 font-medium">Sales</div>
                        </div>
                        <h3 className="text-base font-medium text-green-700 dark:text-green-300">Sales Pipeline</h3>
                        <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Deals & Forecasts</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/client-management" className="no-underline">
                    <div className="bg-gradient-to-br from-red-500/10 to-red-500/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 hover:shadow-md transition-all shadow-sm overflow-hidden relative group">
                      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-red-500/20 -m-2 transition-all group-hover:scale-125 group-hover:rotate-[15deg]" />
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-red-500/20 text-red-600 dark:text-red-300 mb-2">
                            <Heart className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-xs text-red-600/70 dark:text-red-300/70 font-medium">Customers</div>
                        </div>
                        <h3 className="text-base font-medium text-red-700 dark:text-red-300">Client Relations</h3>
                        <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">Support & Management</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/team" className="no-underline">
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/20 border border-orange-200 dark:border-orange-900/50 rounded-lg p-3 hover:shadow-md transition-all shadow-sm overflow-hidden relative group">
                      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-orange-500/20 -m-2 transition-all group-hover:scale-125 group-hover:rotate-[15deg]" />
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-orange-500/20 text-orange-600 dark:text-orange-300 mb-2">
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-xs text-orange-600/70 dark:text-orange-300/70 font-medium">Team</div>
                        </div>
                        <h3 className="text-base font-medium text-orange-700 dark:text-orange-300">Team Members</h3>
                        <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">Tasks & Assignments</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link to="/agency-killer" className="no-underline">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 hover:shadow-md transition-all shadow-sm overflow-hidden relative group">
                      <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-xl bg-emerald-500/20 -m-2 transition-all group-hover:scale-125 group-hover:rotate-[15deg]" />
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 mb-2">
                            <Grid2x2 className="h-5 w-5" />
                          </div>
                          <div className="ml-2 text-xs text-emerald-600/70 dark:text-emerald-300/70 font-medium">Marketing</div>
                        </div>
                        <h3 className="text-base font-medium text-emerald-700 dark:text-emerald-300">Agency Killer</h3>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">DIY Marketing Tools</p>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
              </div>
              
              {/* Legal & Compliance */}
              <div className="mt-4">
                <SheetClose asChild>
                  <Link to="/legal-compliance" className="no-underline">
                    <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 border border-indigo-200 dark:border-indigo-900/50 rounded-lg p-3 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md flex items-center justify-center bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-indigo-700 dark:text-indigo-300">Legal & Compliance</h3>
                          <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Licenses & Documents</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SheetClose>
              </div>
              
              {/* Full Menu Categories - Links to All Sections */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold px-1 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Complete Menu</span>
                </h3>
                
                {/* Grid-based navigation for all categories */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Marketing & Email Platforms Section - Expanded */}
                  <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/20 border border-pink-200 dark:border-pink-900/50 rounded-lg p-3 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center bg-pink-500/20 text-pink-600 dark:text-pink-300 transition-all group-hover:scale-110">
                        <BarChart className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-pink-700 dark:text-pink-300">Marketing Hub</h3>
                        <p className="text-xs text-pink-600/70 dark:text-pink-400/70">Platforms & Analytics</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-11 mt-3 border-l-2 border-pink-200 dark:border-pink-800">
                      <SheetClose asChild>
                        <Link to="/email-marketing" className="no-underline">
                          <div className="px-3 py-2 hover:bg-pink-500/10 rounded-md text-pink-700 dark:text-pink-300 text-sm font-medium transition-colors">
                            Email Marketing
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/klaviyo-dashboard" className="no-underline">
                          <div className="px-3 py-2 hover:bg-pink-500/10 rounded-md text-pink-700 dark:text-pink-300 text-sm font-medium transition-colors">
                            Klaviyo Integration
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/mailchimp-dashboard" className="no-underline">
                          <div className="px-3 py-2 hover:bg-pink-500/10 rounded-md text-pink-700 dark:text-pink-300 text-sm font-medium transition-colors">
                            Mailchimp
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/social-media" className="no-underline">
                          <div className="px-3 py-2 hover:bg-pink-500/10 rounded-md text-pink-700 dark:text-pink-300 text-sm font-medium transition-colors">
                            Social Media
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/content-calendar" className="no-underline">
                          <div className="px-3 py-2 hover:bg-pink-500/10 rounded-md text-pink-700 dark:text-pink-300 text-sm font-medium transition-colors">
                            Content Calendar
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/agency-killer" className="no-underline">
                          <div className="px-3 py-2 hover:bg-pink-500/10 rounded-md text-pink-700 dark:text-pink-300 text-sm font-medium transition-colors">
                            Agency Killer
                          </div>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                  
                  {/* SEO & Analytics - Expanded */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 transition-all group-hover:scale-110">
                        <BarChart className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-emerald-700 dark:text-emerald-300">SEO & Analytics</h3>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Performance & Tracking</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-11 mt-3 border-l-2 border-emerald-200 dark:border-emerald-800">
                      <SheetClose asChild>
                        <Link to="/seo-management" className="no-underline">
                          <div className="px-3 py-2 hover:bg-emerald-500/10 rounded-md text-emerald-700 dark:text-emerald-300 text-sm font-medium transition-colors">
                            SEO Dashboard
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/keyword-tracking" className="no-underline">
                          <div className="px-3 py-2 hover:bg-emerald-500/10 rounded-md text-emerald-700 dark:text-emerald-300 text-sm font-medium transition-colors">
                            Keyword Tracking
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/site-audits" className="no-underline">
                          <div className="px-3 py-2 hover:bg-emerald-500/10 rounded-md text-emerald-700 dark:text-emerald-300 text-sm font-medium transition-colors">
                            Site Audits
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/analytics-dashboard" className="no-underline">
                          <div className="px-3 py-2 hover:bg-emerald-500/10 rounded-md text-emerald-700 dark:text-emerald-300 text-sm font-medium transition-colors">
                            Analytics Dashboard
                          </div>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                  
                  {/* Sales & E-commerce - Expanded */}
                  <div className="bg-gradient-to-br from-green-500/10 to-green-500/20 border border-green-200 dark:border-green-900/50 rounded-lg p-3 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center bg-green-500/20 text-green-600 dark:text-green-300 transition-all group-hover:scale-110">
                        <LineChart className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-green-700 dark:text-green-300">Sales & E-commerce</h3>
                        <p className="text-xs text-green-600/70 dark:text-green-400/70">Deals & Platforms</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-11 mt-3 border-l-2 border-green-200 dark:border-green-800">
                      <SheetClose asChild>
                        <Link to="/sales-dashboard" className="no-underline">
                          <div className="px-3 py-2 hover:bg-green-500/10 rounded-md text-green-700 dark:text-green-300 text-sm font-medium transition-colors">
                            Sales Dashboard
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/omni-channel-sales" className="no-underline">
                          <div className="px-3 py-2 hover:bg-green-500/10 rounded-md text-green-700 dark:text-green-300 text-sm font-medium transition-colors">
                            Omni-Channel Sales
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/shopify-dashboard" className="no-underline">
                          <div className="px-3 py-2 hover:bg-green-500/10 rounded-md text-green-700 dark:text-green-300 text-sm font-medium transition-colors">
                            Shopify
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/woocommerce-dashboard" className="no-underline">
                          <div className="px-3 py-2 hover:bg-green-500/10 rounded-md text-green-700 dark:text-green-300 text-sm font-medium transition-colors">
                            WooCommerce
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/etsy-dashboard" className="no-underline">
                          <div className="px-3 py-2 hover:bg-green-500/10 rounded-md text-green-700 dark:text-green-300 text-sm font-medium transition-colors">
                            Etsy
                          </div>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                  
                  {/* Academy & Training - Expanded */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center bg-amber-500/20 text-amber-600 dark:text-amber-300 transition-all group-hover:scale-110">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-amber-700 dark:text-amber-300">Academy & Training</h3>
                        <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Courses & Resources</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-11 mt-3 border-l-2 border-amber-200 dark:border-amber-800">
                      <SheetClose asChild>
                        <Link to="/academy" className="no-underline">
                          <div className="px-3 py-2 hover:bg-amber-500/10 rounded-md text-amber-700 dark:text-amber-300 text-sm font-medium transition-colors">
                            Academy Dashboard
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/courses" className="no-underline">
                          <div className="px-3 py-2 hover:bg-amber-500/10 rounded-md text-amber-700 dark:text-amber-300 text-sm font-medium transition-colors">
                            Courses
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/tutorials" className="no-underline">
                          <div className="px-3 py-2 hover:bg-amber-500/10 rounded-md text-amber-700 dark:text-amber-300 text-sm font-medium transition-colors">
                            Tutorials
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/resources" className="no-underline">
                          <div className="px-3 py-2 hover:bg-amber-500/10 rounded-md text-amber-700 dark:text-amber-300 text-sm font-medium transition-colors">
                            Resources Library
                          </div>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                  
                  {/* Integrations & Tools */}
                  <div className="bg-gradient-to-br from-violet-500/10 to-violet-500/20 border border-violet-200 dark:border-violet-900/50 rounded-lg p-3 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center bg-violet-500/20 text-violet-600 dark:text-violet-300 transition-all group-hover:scale-110">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-violet-700 dark:text-violet-300">Tools & Integrations</h3>
                        <p className="text-xs text-violet-600/70 dark:text-violet-400/70">Apps & Platforms</p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-11 mt-3 border-l-2 border-violet-200 dark:border-violet-800">
                      <SheetClose asChild>
                        <Link to="/tools-integration" className="no-underline">
                          <div className="px-3 py-2 hover:bg-violet-500/10 rounded-md text-violet-700 dark:text-violet-300 text-sm font-medium transition-colors">
                            Tool Dashboard
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/integrations" className="no-underline">
                          <div className="px-3 py-2 hover:bg-violet-500/10 rounded-md text-violet-700 dark:text-violet-300 text-sm font-medium transition-colors">
                            Integrations
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/automation" className="no-underline">
                          <div className="px-3 py-2 hover:bg-violet-500/10 rounded-md text-violet-700 dark:text-violet-300 text-sm font-medium transition-colors">
                            Automation
                          </div>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/api-keys" className="no-underline">
                          <div className="px-3 py-2 hover:bg-violet-500/10 rounded-md text-violet-700 dark:text-violet-300 text-sm font-medium transition-colors">
                            API Keys
                          </div>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                  
                  {/* Partner & Investor Portal */}
                  <SheetClose asChild>
                    <Link to="/partner-portal" className="no-underline">
                      <div className="bg-gradient-to-br from-slate-500/10 to-slate-500/20 border border-slate-200 dark:border-slate-900/50 rounded-lg p-3 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-slate-500/20 text-slate-600 dark:text-slate-300 transition-all group-hover:scale-110">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-slate-700 dark:text-slate-300">Partner/Investor Portal</h3>
                            <p className="text-xs text-slate-600/70 dark:text-slate-400/70">Dashboard & Controls</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SheetClose>
                  
                  {/* Agency Killer */}
                  <SheetClose asChild>
                    <Link to="/agency-killer" className="no-underline">
                      <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-3 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 transition-all group-hover:scale-110">
                            <Grid2x2 className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-medium text-emerald-700 dark:text-emerald-300">Agency Killer</h3>
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Replace Agency Services</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SheetClose>
                </div>
              </div>
              
              {/* Settings Link */}
              <SheetClose asChild>
                <Link to="/settings" className="no-underline block">
                  <div className="bg-primary/10 rounded-lg p-3 text-center mt-2">
                    <Settings className="h-5 w-5 text-primary inline-block mr-2" />
                    <span className="font-medium">Settings & Preferences</span>
                  </div>
                </Link>
              </SheetClose>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">Close Menu</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Using our improved WorldClassHeader */}
        <WorldClassHeader onMobileMenuToggle={handleMobileMenuToggle} />
        
        <main className="flex-1 pt-20">
          {children}
        </main>
        
        <WorldClassFooter />
      </div>
      
      {/* ARIA AI Assistant */}
      <Aria />
    </div>
  );
}