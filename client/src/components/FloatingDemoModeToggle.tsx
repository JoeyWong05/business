import React from 'react';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/hooks/use-demo-mode';
import { Beaker, X } from 'lucide-react';

interface FloatingDemoModeToggleProps {
  className?: string;
}

export function FloatingDemoModeToggle({ className = '' }: FloatingDemoModeToggleProps) {
  const { demoMode, toggleDemoMode } = useDemoMode();
  
  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 p-2 rounded-full shadow-lg bg-background border border-border transition-all transform ${className}`}
    >
      <Button
        variant={demoMode ? "default" : "outline"}
        size="sm"
        className="rounded-full flex items-center gap-2 px-4" 
        onClick={toggleDemoMode}
      >
        <Beaker className="h-4 w-4" />
        <span>{demoMode ? 'Exit Demo Mode' : 'Enter Demo Mode'}</span>
      </Button>
    </div>
  );
}

// Also export as default for backward compatibility
export default FloatingDemoModeToggle;