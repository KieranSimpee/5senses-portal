import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, DollarSign, Users, Palette, Settings, Menu, ChevronRight, Building2, FileText, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: LayoutDashboard, path: "/" },
  { label: "Admin", icon: Settings, path: "/admin" },
  { label: "Finance", icon: DollarSign, path: "/finance" },
  { label: "HR", icon: Users, path: "/hr" },
  { label: "Brand", icon: Palette, path: "/brand" },
  { label: "Compliance", icon: ShieldCheck, path: "/compliance" },
  { label: "Documents", icon: FileText, path: "/documents" },
  { label: "Vault", icon: Lock, path: "/vault" },
];

export default function Layout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f4ff] flex">
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={cn(
        "fixed left-0 top-0 h-full w-56 bg-white border-r border-[#e8e6fe] z-40 flex flex-col transition-transform duration-300 shadow-sm",
        "lg:translate-x-0 lg:static lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-[#e8e6fe]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8c82fc] flex items-center justify-center">
              <span className="font-extrabold text-white text-sm" style={{fontFamily:'Exo 2, sans-serif'}}>5S</span>
            </div>
            <div>
              <div className="font-extrabold text-[13px] text-[#1a1a1f] tracking-wider" style={{fontFamily:'Exo 2, sans-serif'}}>SIMPLEX-ITY</div>
              <div className="text-[10px] text-[#8c82fc] font-semibold" style={{fontFamily:'Montserrat, sans-serif'}}>5S Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all group",
                  active ? "bg-[#8c82fc] text-white shadow-sm" : "text-[#1a1a1f] hover:bg-[#e8e6fe] hover:text-[#5e50fb]"
                )}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1" style={{fontFamily:'Montserrat, sans-serif'}}>{item.label}</span>
                {active && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#e8e6fe]">
          <div className="text-[10px] font-bold text-[#8c82fc]" style={{fontFamily:'Montserrat, sans-serif'}}>5SENSESBEAUTY LIMITED</div>
          <div className="text-[9px] text-gray-400 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>© 2026 SIMPLEX-ITY</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-[#e8e6fe] sticky top-0 z-20 shadow-sm">
          <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-[#e8e6fe]">
            <Menu className="w-5 h-5 text-[#5e50fb]" />
          </button>
          <span className="font-extrabold text-sm text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>SIMPLEX-ITY · 5S Portal</span>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
