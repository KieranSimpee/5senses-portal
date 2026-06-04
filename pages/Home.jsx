import { useState } from "react";
import CompliancePage from "./CompliancePage";
import ExpensesPage from "./ExpensesPage";
import ProjectsPage from "./ProjectsPage";
import NotesPage from "./NotesPage";
import DocumentsPage from "./DocumentsPage";
import FamilyChatPage from "./FamilyChatPage";

const NAV_ITEMS = [
  { id: "family",     label: "AI Family",  icon: "🌱" },
  { id: "compliance", label: "Compliance", icon: "🛡️" },
  { id: "expenses",   label: "Expenses",   icon: "💰" },
  { id: "projects",   label: "Projects",   icon: "📁" },
  { id: "notes",      label: "Notes",      icon: "📝" },
  { id: "documents",  label: "Documents",  icon: "🔒" },
];

const BRAND = {
  purple: "#8b7fd4",
  purpleLight: "#b8aee8",
  purplePale: "#f0edfb",
  purpleDark: "#5a4fa8",
  sidebar: "#2d2847",
  sidebarActive: "#3d3660",
  sidebarBorder: "#3d3660",
  text: "#2d2847",
  textMuted: "#9b93c9",
  bg: "#f7f5ff",
  familyActive: "rgba(29,142,233,0.25)",
  familyBorder: "#1D8EE9",
  familyText: "#7dd3fc",
};

function Logo() {
  return (
    <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${BRAND.sidebarBorder}` }}>
      <svg width="36" height="40" viewBox="0 0 60 70" fill="none" style={{ display: "block", marginBottom: 10 }}>
        <circle cx="30" cy="26" r="22" stroke="#a89ee0" strokeWidth="2.5" fill="none"/>
        <line x1="30" y1="48" x2="30" y2="68" stroke="#a89ee0" strokeWidth="2.5"/>
        <line x1="30" y1="26" x2="30" y2="10" stroke="#a89ee0" strokeWidth="2.5"/>
        <line x1="30" y1="32" x2="18" y2="22" stroke="#a89ee0" strokeWidth="2.5"/>
        <line x1="30" y1="28" x2="42" y2="20" stroke="#a89ee0" strokeWidth="2.5"/>
      </svg>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.18em", fontFamily: "'Inter', sans-serif" }}>SIMPLEX-ITY</div>
      <div style={{ color: BRAND.textMuted, fontSize: 9, marginTop: 4, letterSpacing: "0.12em", textTransform: "uppercase" }}>One Stop Asian Beauty</div>
    </div>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState("family");

  const isFamily = (id) => id === "family";

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", background: BRAND.bg }}>
      {/* Sidebar */}
      <div style={{
        width: 230, background: BRAND.sidebar, display: "flex", flexDirection: "column",
        padding: "28px 0", boxShadow: "2px 0 12px rgba(45,40,71,0.18)", flexShrink: 0
      }}>
        <Logo />
        <nav style={{ marginTop: 20, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "13px 22px", border: "none", cursor: "pointer",
                background: activePage === item.id
                  ? isFamily(item.id) ? BRAND.familyActive : BRAND.sidebarActive
                  : "transparent",
                color: activePage === item.id
                  ? isFamily(item.id) ? BRAND.familyText : "#fff"
                  : BRAND.textMuted,
                fontSize: 13, fontWeight: activePage === item.id ? 600 : 400,
                letterSpacing: "0.04em",
                borderLeft: activePage === item.id
                  ? `3px solid ${isFamily(item.id) ? BRAND.familyBorder : BRAND.purple}`
                  : "3px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {item.label}
              {item.id === "documents" && (
                <span style={{ marginLeft: "auto", fontSize: 9, background: BRAND.purple, color: "#fff", padding: "2px 6px", borderRadius: 6, letterSpacing: "0.05em" }}>VAULT</span>
              )}
              {item.id === "family" && (
                <span style={{ marginLeft: "auto", fontSize: 9, background: "#1D8EE9", color: "#fff", padding: "2px 6px", borderRadius: 6, letterSpacing: "0.05em" }}>NEW</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 22px", borderTop: `1px solid ${BRAND.sidebarBorder}` }}>
          <div style={{ color: BRAND.textMuted, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin</div>
          <div style={{ color: BRAND.purpleLight, fontSize: 12, marginTop: 3, fontWeight: 600 }}>Kieran · SIMPLEX-ITY</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {activePage === "family"     && <FamilyChatPage />}
        {activePage === "compliance" && <CompliancePage brand={BRAND} />}
        {activePage === "expenses"   && <ExpensesPage brand={BRAND} />}
        {activePage === "projects"   && <ProjectsPage brand={BRAND} />}
        {activePage === "notes"      && <NotesPage brand={BRAND} />}
        {activePage === "documents"  && <DocumentsPage brand={BRAND} />}
      </div>
    </div>
  );
}
