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

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { divider: true, label: "PLATFORM" },
  { id: "brands", label: "Brands", icon: "🏢" },
  { id: "influencers", label: "Influencers", icon: "⭐" },
  { id: "campaigns", label: "Campaigns", icon: "🚀" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "revenue", label: "Revenue", icon: "💰" },
  { divider: true, label: "BUILD" },
  { id: "criticalpath", label: "Critical Path", icon: "🗺️" },
  { id: "build", label: "Build Tracker", icon: "🏗️" },
  { id: "documents", label: "Documents", icon: "📁" },
  { divider: true, label: "ADMIN" },
  { id: "vault", label: "Vault", icon: "🔐" },
];

const BRAND_DARK = "#1a0533";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", background: "#f5f3ff" }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: BRAND_DARK, display: "flex", flexDirection: "column", padding: "0 0 24px", boxShadow: "3px 0 16px rgba(124,58,237,0.15)", overflowY: "auto" }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7C3AED, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✨</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>SIMPLEX-ITY</div>
              <div style={{ color: "#a78bfa", fontSize: 10, marginTop: 1 }}>Control Tower</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ marginTop: 12, flex: 1 }}>
          {NAV.map((item, idx) => {
            if (item.divider) return (
              <div key={idx} style={{ padding: "10px 20px 4px", fontSize: 9, fontWeight: 700, color: "#4c3f6e", textTransform: "uppercase", letterSpacing: 1.2 }}>{item.label}</div>
            );
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 20px", border: "none", cursor: "pointer",
                background: page === item.id ? "rgba(124,58,237,0.25)" : "transparent",
                color: page === item.id ? "#c4b5fd" : "#94a3b8",
                fontSize: 13, fontWeight: page === item.id ? 600 : 400,
                borderLeft: page === item.id ? "3px solid #7C3AED" : "3px solid transparent",
                transition: "all 0.15s", textAlign: "left"
              }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div style={{ color: "#64748b", fontSize: 10 }}>Logged in as</div>
          <div style={{ color: "#a78bfa", fontSize: 11, fontWeight: 600, marginTop: 1 }}>Kieran · Admin</div>
          <div style={{ color: "#4c3f6e", fontSize: 9, marginTop: 4 }}>simplex-ity.com</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {page === "dashboard"    && <Dashboard setPage={setPage} />}
        {page === "brands"       && <BrandsPage />}
        {page === "influencers"  && <InfluencersPage />}
        {page === "campaigns"    && <CampaignsPage />}
        {page === "calendar"     && <CalendarPage />}
        {page === "revenue"      && <RevenuePage />}
        {page === "criticalpath" && <CriticalPathPage />}
        {page === "build"        && <BuildTrackerPage />}
        {page === "documents"    && <DocumentsPage />}
        {page === "vault"        && <VaultPage />}
      </div>
    </div>
  );
}
