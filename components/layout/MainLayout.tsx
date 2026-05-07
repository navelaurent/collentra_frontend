"use client";

import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar";
import { MobileNavigation } from "./MobileNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
