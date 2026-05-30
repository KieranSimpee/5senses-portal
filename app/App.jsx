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

// SIMPLEX-ITY Design System — extracted from simplex-ity.fluentlab.co
const BRAND = {
  primaryLilac: "#8c82fc",
  accentViolet: "#5e50fb",
  softLilac: "#bab4fd",
  lavenderWash: "#e8e6fe",
  white: "#ffffff",
  neutralGrey: "#e6e6e6",
  bodyText: "#1a1a1f",
  textSecondary: "#5a5870",
  textMuted: "#9896ad",
};

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { divider: true, label: "OPERATIONS" },
  { id: "compliance", label: "Compliance", icon: "✓" },
  { id: "expenses", label: "Finance", icon: "💰" },
  { id: "invoices", label: "Invoices", icon: "🧾" },
  { id: "documents", label: "Documents", icon: "📁" },
  { id: "vault", label: "Vault", icon: "🔐" },
  { id: "notes", label: "Notes", icon: "✎" },
  { divider: true, label: "PLATFORM" },
  { id: "brands", label: "Brands", icon: "◉" },
  { id: "influencers", label: "Influencers", icon: "★" },
  { id: "campaigns", label: "Campaigns", icon: "📣" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "revenue", label: "Revenue", icon: "📈" },
  { divider: true, label: "BUILD" },
  { id: "criticalpath", label: "Critical Path", icon: "→" },
  { id: "build", label: "Build Tracker", icon: "⚙" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentPage = NAV.find(n => n.id === page);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "'Montserrat', 'Calibri', system-ui, sans-serif",
      background: BRAND.lavenderWash,
      overflow: "hidden",
    }}>
      {/* ── SIDEBAR ── */}
      <div style={{
        width: sidebarOpen ? 232 : 0,
        minWidth: sidebarOpen ? 232 : 0,
        background: BRAND.white,
        borderRight: `1px solid ${BRAND.neutralGrey}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.22s cubic-bezier(.22,1,.36,1), min-width 0.22s cubic-bezier(.22,1,.36,1)",
        flexShrink: 0,
        boxShadow: "2px 0 12px rgba(140,130,252,0.07)",
      }}>
        {/* Logo */}
        <div style={{
          padding: "22px 20px 18px",
          borderBottom: `1px solid ${BRAND.neutralGrey}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: `linear-gradient(135deg, ${BRAND.accentViolet}, ${BRAND.primaryLilac})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0,
              letterSpacing: -0.5,
              boxShadow: `0 4px 12px rgba(94,80,251,0.3)`,
            }}>5S</div>
            <div>
              <div style={{
                color: BRAND.bodyText,
                fontFamily: "'Exo', 'Exo 2', 'Montserrat', sans-serif",
                fontWeight: 800, fontSize: 13, letterSpacing: 1.8,
                textTransform: "uppercase", lineHeight: 1.2,
              }}>SIMPLEX-ITY</div>
              <div style={{ color: BRAND.textMuted, fontSize: 10, marginTop: 1, fontWeight: 500, letterSpacing: 0.5 }}>
                5S Portal
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ marginTop: 8, flex: 1, padding: "0 10px" }}>
          {NAV.map((item, idx) => {
            if (item.divider) return (
              <div key={idx} style={{
                padding: "16px 10px 5px",
                fontSize: 9, fontWeight: 700,
                color: BRAND.textMuted,
                textTransform: "uppercase", letterSpacing: 1.8,
              }}>{item.label}</div>
            );
            const isActive = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                display: "flex", alignItems: "center", gap: 9,
                width: "100%", padding: "8px 12px",
                border: "none", cursor: "pointer",
                background: isActive ? BRAND.lavenderWash : "transparent",
                color: isActive ? BRAND.accentViolet : BRAND.textSecondary,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                borderRadius: 8,
                transition: "all 0.15s",
                textAlign: "left",
                marginBottom: 1,
                outline: "none",
              }}>
                <span style={{
                  fontSize: 13,
                  width: 20, textAlign: "center",
                  opacity: isActive ? 1 : 0.65,
                }}>{item.icon}</span>
                <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                {isActive && (
                  <span style={{
                    marginLeft: "auto",
                    width: 5, height: 5, borderRadius: "50%",
                    background: BRAND.accentViolet,
                    flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "14px 20px",
          borderTop: `1px solid ${BRAND.neutralGrey}`,
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 9,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: BRAND.lavenderWash,
              border: `2px solid ${BRAND.softLilac}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: BRAND.accentViolet,
              flexShrink: 0,
            }}>K</div>
            <div>
              <div style={{ color: BRAND.bodyText, fontSize: 12, fontWeight: 600 }}>Kieran Li</div>
              <div style={{ color: BRAND.textMuted, fontSize: 10, marginTop: 1 }}>Admin · 5SENSESBEAUTY</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          height: 54,
          background: BRAND.white,
          borderBottom: `1px solid ${BRAND.neutralGrey}`,
          display: "flex", alignItems: "center",
          padding: "0 24px", gap: 14, flexShrink: 0,
          boxShadow: "0 1px 4px rgba(140,130,252,0.06)",
        }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            background: "none", border: `1px solid ${BRAND.neutralGrey}`,
            cursor: "pointer", color: BRAND.textSecondary,
            fontSize: 15, padding: "5px 9px",
            borderRadius: 7, lineHeight: 1, transition: "all 0.15s",
          }}>☰</button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
            <span style={{ color: BRAND.textMuted, fontSize: 12 }}>5S Portal</span>
            <span style={{ color: BRAND.neutralGrey, fontSize: 12 }}>›</span>
            <span style={{
              color: BRAND.bodyText, fontSize: 13, fontWeight: 600,
              fontFamily: "'Exo', 'Exo 2', sans-serif",
            }}>
              {currentPage?.label || "Dashboard"}
            </span>
          </div>

          {/* Status pill */}
          <div style={{
            fontSize: 11, color: BRAND.accentViolet,
            background: BRAND.lavenderWash,
            border: `1px solid ${BRAND.softLilac}`,
            padding: "4px 12px", borderRadius: 20, fontWeight: 600,
            letterSpacing: 0.3,
          }}>
            SIMPLEX-ITY HQ
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
