import * as React from 'react';
import { cn } from '@/lib/utils';

interface SimpleAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SimpleAvatar({ src, fallback, size = 'md', className, ...props }: SimpleAvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-600',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={fallback}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="font-medium">{fallback}</span>
      )}
    </div>
  );
} 