import { useState, useEffect } from "react";
import { Brand, Influencer, Campaign, RevenueRecord, CalendarEvent } from "@/api/entities";

const BRAND_COLOR = "#7C3AED";

function KPICard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "22px 24px",
      boxShadow: "0 2px 12px rgba(124,58,237,0.07)",
      borderTop: `4px solid ${color || BRAND_COLOR}`
    }}>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#1a0533" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color || BRAND_COLOR, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ setPage }) {
  const [brands, setBrands] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      Brand.list(),
      Influencer.list(),
      Campaign.list(),
      RevenueRecord.list("-date"),
      CalendarEvent.list("due_date")
    ]).then(([b, i, c, r, e]) => {
      setBrands(b); setInfluencers(i); setCampaigns(c); setRevenue(r); setEvents(e);
      setLoading(false);
    });
  }, []);

  const totalRevenue = revenue.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === "Active").length;
  const activeInfluencers = influencers.filter(i => i.status === "Active").length;
  const avgReliability = influencers.length > 0
    ? Math.round(influencers.reduce((s, i) => s + (i.reliability_score || 0), 0) / influencers.length)
    : 0;
  const atRisk = influencers.filter(i => (i.reliability_score || 0) < 75).length;

  const upcomingEvents = events
    .filter(e => e.status === "Scheduled" && e.due_date >= new Date().toISOString().split("T")[0])
    .slice(0, 5);

  const recentRevenue = revenue.slice(0, 5);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: BRAND_COLOR, fontSize: 16 }}>
      Loading dashboard...
    </div>
  );

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a0533" }}>✨ Platform Overview</h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
          {new Date().toLocaleDateString("en-HK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <KPICard icon="🏢" label="Total Brands" value={brands.length} sub={`${brands.filter(b => b.status === "Active").length} Active`} color="#7C3AED" />
        <KPICard icon="⭐" label="Influencers" value={activeInfluencers} sub={atRisk > 0 ? `⚠️ ${atRisk} at risk` : "All healthy"} color="#a855f7" />
        <KPICard icon="🚀" label="Active Campaigns" value={activeCampaigns} sub={`${campaigns.length} Total`} color="#6d28d9" />
        <KPICard icon="💰" label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="All time" color="#059669" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Influencer Health */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a0533" }}>⭐ Influencer Reliability</h3>
            <button onClick={() => setPage("influencers")} style={{ background: "none", border: "none", color: BRAND_COLOR, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: avgReliability >= 75 ? "#e8f5e9" : "#fce8e8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: avgReliability >= 75 ? "#2e7d32" : "#c62828" }}>{avgReliability}%</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Platform Average</div>
              <div style={{ fontSize: 12, color: avgReliability >= 75 ? "#2e7d32" : "#c62828", fontWeight: 600, marginTop: 2 }}>
                {avgReliability >= 90 ? "🟢 Excellent" : avgReliability >= 75 ? "🟡 Good" : "🔴 Needs Attention"}
              </div>
            </div>
          </div>
          {influencers.slice(0, 5).map(inf => (
            <div key={inf.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533" }}>{inf.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{inf.tier} · {inf.platform}</div>
              </div>
              <div style={{ width: 80, height: 6, background: "#f0f0f0", borderRadius: 4 }}>
                <div style={{ width: `${inf.reliability_score || 0}%`, height: "100%", borderRadius: 4, background: (inf.reliability_score || 0) >= 75 ? "#7C3AED" : "#ef4444" }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: (inf.reliability_score || 0) >= 75 ? "#7C3AED" : "#ef4444", minWidth: 36, textAlign: "right" }}>
                {inf.reliability_score || 0}%
              </div>
            </div>
          ))}
          {influencers.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>No influencers yet</div>}
        </div>

        {/* Upcoming Calendar */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a0533" }}>📅 Upcoming Deadlines</h3>
            <button onClick={() => setPage("calendar")} style={{ background: "none", border: "none", color: BRAND_COLOR, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          {upcomingEvents.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>No upcoming events</div>}
          {upcomingEvents.map(ev => (
            <div key={ev.id} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: 20 }}>
                {ev.type === "Live Stream" ? "🎥" : ev.type === "Blog Post" ? "✍️" : ev.type === "AI Certification" ? "🤖" : "📌"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533" }}>{ev.title}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {ev.influencer_name && `${ev.influencer_name} · `}{ev.due_date}
                </div>
              </div>
              <span style={{
                padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                background: "#ede9fe", color: BRAND_COLOR
              }}>{ev.type}</span>
            </div>
          ))}
        </div>

        {/* Recent Revenue */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a0533" }}>💰 Recent Revenue</h3>
            <button onClick={() => setPage("revenue")} style={{ background: "none", border: "none", color: BRAND_COLOR, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          {recentRevenue.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>No revenue recorded yet</div>}
          {recentRevenue.map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533" }}>{r.brand_name || r.campaign_title}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{r.type} · {r.date}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#059669" }}>+${parseFloat(r.amount || 0).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Active Campaigns */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a0533" }}>🚀 Active Campaigns</h3>
            <button onClick={() => setPage("campaigns")} style={{ background: "none", border: "none", color: BRAND_COLOR, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          {campaigns.filter(c => c.status === "Active").length === 0 && <div style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>No active campaigns</div>}
          {campaigns.filter(c => c.status === "Active").slice(0, 4).map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a0533" }}>{c.title}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.brand_name} · {c.phase}</div>
              </div>
              <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: "#ede9fe", color: BRAND_COLOR }}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
