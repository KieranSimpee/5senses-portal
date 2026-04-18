import { useState } from "react";
import CompliancePage from "./pages/CompliancePage";
import ExpensesPage from "./pages/ExpensesPage";
import ProjectsPage from "./pages/ProjectsPage";
import NotesPage from "./pages/NotesPage";

const NAV_ITEMS = [
  { id: "compliance", label: "Compliance", icon: "🛡️" },
  { id: "expenses", label: "Expenses", icon: "💰" },
  { id: "projects", label: "Projects", icon: "📁" },
  { id: "notes", label: "Notes", icon: "📝" },
];

export default function App() {
  const [activePage, setActivePage] = useState("compliance");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', sans-serif", background: "#f4f6fb" }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: "#1a1f2e", display: "flex", flexDirection: "column",
        padding: "24px 0", boxShadow: "2px 0 8px rgba(0,0,0,0.15)"
      }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #2d3448" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>SIMPLEX-ITY</div>
          <div style={{ color: "#7b8db0", fontSize: 12, marginTop: 4 }}>Company Tracker</div>
        </div>
        <nav style={{ marginTop: 16, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "12px 20px", border: "none", cursor: "pointer",
                background: activePage === item.id ? "#2d3448" : "transparent",
                color: activePage === item.id ? "#fff" : "#7b8db0",
                fontSize: 14, fontWeight: activePage === item.id ? 600 : 400,
                borderLeft: activePage === item.id ? "3px solid #4f8ef7" : "3px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #2d3448" }}>
          <div style={{ color: "#7b8db0", fontSize: 11 }}>Logged in as Admin</div>
          <div style={{ color: "#4f8ef7", fontSize: 12, marginTop: 2 }}>Kieran · SIMPLEX-ITY</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {activePage === "compliance" && <CompliancePage />}
        {activePage === "expenses" && <ExpensesPage />}
        {activePage === "projects" && <ProjectsPage />}
        {activePage === "notes" && <NotesPage />}
      </div>
    </div>
  );
}
