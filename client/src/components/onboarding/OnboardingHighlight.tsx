import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingHighlightProps {
  selector: string;
  onClose: () => void;
}

// Component to create a highlight effect around specific elements during the onboarding process
const OnboardingHighlight = ({ selector, onClose }: OnboardingHighlightProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to update the position and size of the highlight
    const updateHighlightPosition = () => {
      const element = document.querySelector(selector);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Add padding to the highlight
        const padding = 8;
        
        setPosition({
          top: rect.top - padding + window.scrollY,
          left: rect.left - padding + window.scrollX,
          width: rect.width + (padding * 2),
          height: rect.height + (padding * 2)
        });
      }
    };

    // Update position initially
    updateHighlightPosition();
    
    // Add event listeners to update position on resize and scroll
    window.addEventListener('resize', updateHighlightPosition);
    window.addEventListener('scroll', updateHighlightPosition);
    
    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('resize', updateHighlightPosition);
      window.removeEventListener('scroll', updateHighlightPosition);
    };
  }, [selector]);

  // Function to handle clicks outside the highlighted area
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      onClose();
    }
  };

  // Set up CSS for the highlight overlay
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 50,
    pointerEvents: 'auto'
  };

  // Set up CSS for the cutout/highlight area
  const highlightStyle: React.CSSProperties = {
    position: 'absolute',
    top: position.top,
    left: position.left,
    width: position.width,
    height: position.height,
    borderRadius: '8px',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.3)',
    backgroundColor: 'transparent',
    zIndex: 51,
    pointerEvents: 'none',
    transition: 'all 0.3s ease'
  };

  // Set up CSS for the close button
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: position.top - 40,
    right: window.innerWidth - (position.left + position.width),
    zIndex: 52,
    pointerEvents: 'auto'
  };

  // If there's no element to highlight, don't render anything
  if (!position.width || !position.height) {
    return null;
  }

  return (
    <>
      {/* Overlay that darkens the rest of the page */}
      <div 
        ref={overlayRef}
        style={overlayStyle} 
        onClick={handleOutsideClick}
      />
      
      {/* Highlight cutout */}
      <div style={highlightStyle} />
      
      {/* Close button */}
      <div style={closeButtonStyle}>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full bg-background" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close Highlight</span>
        </Button>
      </div>
    </>
  );
};

export default OnboardingHighlight;