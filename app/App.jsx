import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import BrandsPage from "./pages/BrandsPage";
import InfluencersPage from "./pages/InfluencersPage";
import CampaignsPage from "./pages/CampaignsPage";
import CalendarPage from "./pages/CalendarPage";
import RevenuePage from "./pages/RevenuePage";
import BuildTrackerPage from "./pages/BuildTrackerPage";
import DocumentsPage from "./pages/DocumentsPage";
import CriticalPathPage from "./pages/CriticalPathPage";
import VaultPage from "./pages/VaultPage";
import CompliancePage from "./pages/CompliancePage";
import ExpensesPage from "./pages/ExpensesPage";
import NotesPage from "./pages/NotesPage";
import InvoicePage from "./pages/InvoicePage";

// SIMPLEX-ITY Brand Guidelines
const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
  darkBg: "#0f0d1a",
  sidebarBg: "#13102a",
  sidebarBorder: "rgba(140,130,252,0.12)",
  navActive: "rgba(140,130,252,0.18)",
  navActiveBorder: "#8c82fc",
  navText: "#8885a0",
  navActiveText: "#bab4fd",
};

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { divider: true, label: "OPERATIONS" },
  { id: "compliance", label: "Compliance", icon: "✓" },
  { id: "expenses", label: "Finance", icon: "◈" },
  { id: "invoices", label: "Invoices", icon: "🧾" },
  { id: "documents", label: "Documents", icon: "◧" },
  { id: "vault", label: "Vault", icon: "⬡" },
  { id: "notes", label: "Notes", icon: "✎" },
  { divider: true, label: "PLATFORM" },
  { id: "brands", label: "Brands", icon: "◉" },
  { id: "influencers", label: "Influencers", icon: "★" },
  { id: "campaigns", label: "Campaigns", icon: "◈" },
  { id: "calendar", label: "Calendar", icon: "⬡" },
  { id: "revenue", label: "Revenue", icon: "◈" },
  { divider: true, label: "BUILD" },
  { id: "criticalpath", label: "Critical Path", icon: "→" },
  { id: "build", label: "Build Tracker", icon: "◧" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "'Montserrat', 'Inter', sans-serif",
      background: BRAND.lavenderWash,
      overflow: "hidden"
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 240 : 0,
        minWidth: sidebarOpen ? 240 : 0,
        background: BRAND.sidebarBg,
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 24px rgba(94,80,251,0.12)",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.2s, min-width 0.2s",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: "28px 20px 22px",
          borderBottom: `1px solid ${BRAND.sidebarBorder}`,
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${BRAND.accentViolet}, ${BRAND.primaryLilac})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0,
              letterSpacing: -1
            }}>5S</div>
            <div>
              <div style={{
                color: BRAND.white,
                fontFamily: "'Exo 2', 'Montserrat', sans-serif",
                fontWeight: 800, fontSize: 13, letterSpacing: 1.5,
                textTransform: "uppercase"
              }}>SIMPLEX-ITY</div>
              <div style={{ color: BRAND.softLilac, fontSize: 10, marginTop: 2, fontWeight: 500 }}>
                5S Portal
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ marginTop: 8, flex: 1, padding: "0 8px" }}>
          {NAV.map((item, idx) => {
            if (item.divider) return (
              <div key={idx} style={{
                padding: "14px 12px 4px",
                fontSize: 9, fontWeight: 700,
                color: "rgba(140,130,252,0.4)",
                textTransform: "uppercase", letterSpacing: 1.5
              }}>{item.label}</div>
            );
            const isActive = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "9px 12px",
                border: "none", cursor: "pointer",
                background: isActive ? BRAND.navActive : "transparent",
                color: isActive ? BRAND.navActiveText : BRAND.navText,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? `3px solid ${BRAND.navActiveBorder}` : "3px solid transparent",
                borderRadius: isActive ? "0 8px 8px 0" : "0 8px 8px 0",
                transition: "all 0.15s", textAlign: "left",
                marginBottom: 1,
              }}>
                <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.6, width: 18, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "14px 20px",
          borderTop: `1px solid ${BRAND.sidebarBorder}`,
          flexShrink: 0
        }}>
          <div style={{ color: "rgba(140,130,252,0.4)", fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>Signed in as</div>
          <div style={{ color: BRAND.softLilac, fontSize: 12, fontWeight: 600, marginTop: 3 }}>Kieran · Admin</div>
          <div style={{ color: "rgba(140,130,252,0.35)", fontSize: 9, marginTop: 2 }}>5SENSESBEAUTY LIMITED</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{
          height: 52, background: BRAND.white,
          borderBottom: `1px solid ${BRAND.neutralGrey}`,
          display: "flex", alignItems: "center",
          padding: "0 24px", gap: 16, flexShrink: 0,
          boxShadow: "0 1px 4px rgba(140,130,252,0.06)"
        }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: BRAND.primaryLilac, fontSize: 18, padding: "4px 6px",
            borderRadius: 6, lineHeight: 1
          }}>☰</button>
          <div style={{ color: BRAND.bodyText, fontSize: 13, fontWeight: 600, flex: 1 }}>
            {NAV.find(n => n.id === page)?.label || "Dashboard"}
          </div>
          <div style={{
            fontSize: 11, color: BRAND.softLilac,
            background: BRAND.lavenderWash,
            padding: "4px 10px", borderRadius: 20, fontWeight: 500
          }}>
            5S Portal · SIMPLEX-ITY
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {page === "dashboard"    && <Dashboard setPage={setPage} />}
          {page === "compliance"   && <CompliancePage />}
          {page === "expenses"     && <ExpensesPage />}
          {page === "invoices"     && <InvoicePage />}
          {page === "documents"    && <DocumentsPage />}
          {page === "vault"        && <VaultPage />}
          {page === "notes"        && <NotesPage />}
          {page === "brands"       && <BrandsPage />}
          {page === "influencers"  && <InfluencersPage />}
          {page === "campaigns"    && <CampaignsPage />}
          {page === "calendar"     && <CalendarPage />}
          {page === "revenue"      && <RevenuePage />}
          {page === "criticalpath" && <CriticalPathPage />}
          {page === "build"        && <BuildTrackerPage />}
        </div>
      </div>
    </div>
  );
}
