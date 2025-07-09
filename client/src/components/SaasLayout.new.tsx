import React, { useState, useEffect } from "react";
import SaasHeader from "./SaasHeader";
import SaasSidebar from "./SaasSidebar";
import SaasFooter from "./SaasFooter";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface SaasLayoutProps {
  children: React.ReactNode;
}

export default function SaasLayout({ children }: SaasLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    if (!isDesktop) {
      setSidebarExpanded(false);
    }
  }, [isDesktop]);
  
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - only shown on desktop */}
      {isDesktop && (
        <SaasSidebar 
          expanded={sidebarExpanded} 
          onToggle={toggleSidebar} 
        />
      )}
      
      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out",
        isDesktop && sidebarExpanded ? "ml-60" : isDesktop ? "ml-14" : "ml-0"
      )}>
        {/* Desktop Header - only shown on desktop */}
        {isDesktop && <SaasHeader />}
        
        {/* Main Content with appropriate padding for mobile */}
        <main className={cn(
          "flex-1",
          isDesktop ? "pt-16" : "pt-0" // Only add padding-top on desktop due to header
        )}>
          {children}
        </main>
        
        {/* Footer */}
        <SaasFooter />
      </div>
    </div>
  );
}