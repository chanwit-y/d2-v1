'use client'
import React, { useState } from 'react';
import TopNavigation from '@/_components/container/layout/TopNavigation';
import AppSidebar from '@/_components/container/layout/AppSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col w-full">
      <TopNavigation onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
