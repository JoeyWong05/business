import React from 'react';

interface IconProps {
  className?: string;
}

const CloudSync: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
      <path d="M14 13.3c-.3-.1-.5-.1-.8-.2A7 7 0 0 0 5 12a5 5 0 0 0-4 8" />
      <path d="m16 19 2 2 4-4" />
      <path d="M19 11.9a7.3 7.3 0 0 0-4.3-5.9h-.2c-.6 0-1.2.3-1.6.8a3 3 0 0 1-4.5.5 2 2 0 0 0-1.4-.4 7.2 7.2 0 0 0-5.2 8 5 5 0 0 1 9.4 2.8H13" />
    </svg>
  );
};

export default CloudSync;