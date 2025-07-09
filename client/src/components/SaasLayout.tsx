import React, { useState, useEffect } from "react";
import SaasHeader from "./SaasHeader";
import SaasSidebar from "./SaasSidebar";
import SaasFooter from "./SaasFooter";
import BreadcrumbNav from "./BreadcrumbNav";
import BackToHomeButton from "./BackToHomeButton";
import MobileNavigation from "./MobileNavigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Search, 
  LayoutDashboard, 
  Shield,
  CircleDollarSign,
  Workflow,
  Megaphone,
  LineChart,
  Users,
  Target,
  Building,
  Settings,
  HelpCircle,
  Lock
} from "lucide-react";

interface SaasLayoutProps {
  children: React.ReactNode;
}

export default function SaasLayout({ children }: SaasLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  // Check if swipe gesture is available (iOS Safari, mobile browsers)
  const supportsTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
  
  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    if (!isDesktop) {
      setSidebarExpanded(false);
    }
  }, [isDesktop]);
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <SaasSidebar 
        expanded={sidebarExpanded} 
        onToggle={toggleSidebar} 
      />
      
      {/* Mobile Sidebar with Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        {/* The trigger is invisible but needed to make the Sheet work */}
        <SheetTrigger className="hidden">Open Menu</SheetTrigger>
        
        <SheetContent side="left" className="p-0 w-[85vw] max-w-[320px]">
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center space-x-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                  <div className="h-5 w-5 text-white">DMPHQ</div>
                </div>
                <span className="font-bold text-xl tracking-tight">DMPHQ</span>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>
            
            {/* Search Box */}
            <div className="p-3 pb-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search navigation..."
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            
            {/* Enhanced Mobile Navigation */}
            <MobileNavigation onClose={() => setMobileMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out",
        isDesktop && sidebarExpanded ? "ml-60" : isDesktop ? "ml-14" : "ml-0"
      )}>
        {/* Header */}
        <SaasHeader onMobileMenuToggle={handleMobileMenuToggle} />
        
        {/* Main Content with appropriate padding for header */}
        <main className="flex-1 pt-16">
          <BreadcrumbNav />
          {children}
        </main>
        
        {/* Footer */}
        <SaasFooter />
        
        {/* Floating Back to Home Button - visible on mobile only */}
        <BackToHomeButton />
      </div>
    </div>
  );
}