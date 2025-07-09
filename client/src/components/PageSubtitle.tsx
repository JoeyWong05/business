import React from 'react';

interface PageSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

const PageSubtitle: React.FC<PageSubtitleProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-muted-foreground text-base mb-6 max-w-3xl ${className}`}>
      {children}
    </p>
  );
};

export default PageSubtitle;