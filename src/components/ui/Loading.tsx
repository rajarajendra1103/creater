
import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  message = 'Processing', 
  className = '' 
}) => {
  const dotSize = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2.5 h-2.5',
    large: 'w-3 h-3'
  };

  const containerSize = {
    small: 'space-x-1.5',
    medium: 'space-x-2',
    large: 'space-x-3'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`flex items-center ${containerSize[size]}`}>
        <div className={`loading-dot ${dotSize[size]} bg-primary rounded-full`}></div>
        <div className={`loading-dot ${dotSize[size]} bg-primary rounded-full`}></div>
        <div className={`loading-dot ${dotSize[size]} bg-primary rounded-full`}></div>
      </div>
      {message && (
        <p className="mt-3 text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;
