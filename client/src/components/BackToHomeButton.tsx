import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BackToHomeButton() {
  const [location] = useLocation();
  
  // Don't show on the homepage
  if (location === '/') {
    return null;
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Link href="/">
        <Button 
          size="lg" 
          className={cn(
            "rounded-full p-3 shadow-lg",
            "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Back to Home</span>
        </Button>
      </Link>
    </div>
  );
}