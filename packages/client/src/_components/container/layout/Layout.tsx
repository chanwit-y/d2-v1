'use client'
import React, { useState } from 'react';
import TopNavigation from '@/_components/container/layout/TopNavigation';
import AppSidebar from '@/_components/container/layout/AppSidebar';
import PageTransition from '@/_components/container/layout/PageTransition';
import { Toaster } from 'sonner';
// import { Toaster } from '@/_components/common/toaster';

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
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        <Toaster richColors  />
        {/* <Toaster /> */}
      </div>
    </div>
  );
};

export default Layout;
