"use client";

import { useState, type ReactNode } from "react";

import { Footer } from "./footer";
import { MainNavbar } from "./main-navbar";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type AppShellClientProps = {
  children: ReactNode;
  authArea: ReactNode;
};

export function AppShellClient({ children, authArea }: AppShellClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-slate-100">
      <Topbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        authArea={authArea}
      />
      <MainNavbar authArea={authArea} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
