import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, Receipt, FileText, Lock, 
  Calendar, Building2, Grid3X3, Mail, Menu, X, ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Expenses", icon: Receipt, path: "/expenses" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Vault", icon: Lock, path: "/vault", adminOnly: true },
  { label: "Tools & Apps", icon: Grid3X3, path: "/tools" },
  { label: "Inbox", icon: Mail, path: "/inbox" },
  { label: "Email Scanner", icon: Sparkles, path: "/email-scan" },
  { label: "Office Info", icon: Building2, path: "/office" },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-border z-40 flex flex-col transition-transform duration-300",
        "lg:translate-x-0 lg:static lg:z-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-exo font-semibold text-sm text-foreground tracking-wide">SIMPLEX-ITY</div>
              <div className="text-[10px] text-muted-foreground font-montserrat">Command Hub</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-montserrat font-medium transition-all group",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="flex-1">{item.label}</span>
                {item.adminOnly && (
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">ADMIN</span>
                )}
                {active && <ChevronRight className="w-3 h-3 text-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-[11px] text-muted-foreground font-montserrat text-center">
            Simplex-ity © 2026
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-border bg-white sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md hover:bg-secondary">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-exo font-semibold text-sm text-foreground">SIMPLEX-ITY</div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}