
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps) => {
  return (
    <div className={`min-h-screen bg-safeguard-gradient ${className}`}>
      {children}
    </div>
  );
};

export default Layout;
