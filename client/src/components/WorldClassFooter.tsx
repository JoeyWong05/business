import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle,
  MessageSquare,
  ArrowUp
} from "lucide-react";

export default function WorldClassFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 sm:px-6 py-4">
        <Separator className="mb-4" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 sm:mb-0">
            &copy; {currentYear} DMPHQ - Digital Merch Pros Headquarters. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="h-7 text-xs">
              <ArrowUp className="h-3 w-3 mr-1" />
              Back to top
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
              <Link href="/help">
                <HelpCircle className="h-3 w-3 mr-1" />
                Help
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
              <Link href="/advanced-ai">
                <MessageSquare className="h-3 w-3 mr-1" />
                AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}