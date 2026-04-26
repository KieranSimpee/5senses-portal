import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import BrandsPage from "./pages/BrandsPage";
import InfluencersPage from "./pages/InfluencersPage";
import CampaignsPage from "./pages/CampaignsPage";
import CalendarPage from "./pages/CalendarPage";
import RevenuePage from "./pages/RevenuePage";
import BuildTrackerPage from "./pages/BuildTrackerPage";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "brands", label: "Brands", icon: "🏢" },
  { id: "influencers", label: "Influencers", icon: "⭐" },
  { id: "campaigns", label: "Campaigns", icon: "🚀" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "revenue", label: "Revenue", icon: "💰" },
  { id: "build", label: "Build Tracker", icon: "🏗️", divider: true },
];

const BRAND_DARK = "#1a0533";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", background: "#f5f3ff" }}>
      {/* Sidebar */}
      <div style={{
        width: 230, background: BRAND_DARK, display: "flex", flexDirection: "column",
        padding: "0 0 24px", boxShadow: "3px 0 16px rgba(124,58,237,0.15)"
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7C3AED, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✨</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>SIMPLEX-ITY</div>
              <div style={{ color: "#a78bfa", fontSize: 10, marginTop: 1 }}>Control Tower</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ marginTop: 16, flex: 1 }}>
          {NAV.map(item => (
            <div key={item.id}>
              {item.divider && <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />}
              <button onClick={() => setPage(item.id)} style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "11px 24px", border: "none", cursor: "pointer",
                background: page === item.id ? "rgba(124,58,237,0.25)" : "transparent",
                color: page === item.id ? "#c4b5fd" : "#94a3b8",
                fontSize: 13.5, fontWeight: page === item.id ? 600 : 400,
                borderLeft: page === item.id ? "3px solid #7C3AED" : "3px solid transparent",
                transition: "all 0.15s", textAlign: "left"
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </button>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "#64748b", fontSize: 11 }}>Logged in as</div>
          <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 600, marginTop: 2 }}>Kieran · Admin</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {page === "dashboard" && <Dashboard setPage={setPage} />}
        {page === "brands" && <BrandsPage />}
        {page === "influencers" && <InfluencersPage />}
        {page === "campaigns" && <CampaignsPage />}
        {page === "calendar" && <CalendarPage />}
        {page === "revenue" && <RevenuePage />}
        {page === "build" && <BuildTrackerPage />}
      </div>
    </div>
  );
}
