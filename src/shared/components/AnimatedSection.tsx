import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const getTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-50px)';
      case 'right': return 'translateX(50px)';
      case 'up': return 'translateY(50px)';
      case 'down': return 'translateY(-50px)';
      default: return 'translateY(50px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: isInView ? 'none' : getTransform(),
        opacity: isInView ? 1 : 0,
        transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};