import { useState, useEffect } from "react";
import { PropertyListing } from "@/api/entities";

const DISTRICT_COLORS = {
  "North Point":   "#8E44AD", "Quarry Bay":    "#2980B9",
  "Wan Chai":      "#27AE60", "Causeway Bay":  "#E67E22",
  "Tin Hau":       "#E74C3C", "Sheung Wan":    "#16A085",
  "Mid-Levels":    "#8B4513", "Happy Valley":  "#2C3E50",
  "Sai Wan Ho":    "#1ABC9C", "Sai Ying Pun":  "#D35400",
  "Central":       "#C0392B", "Admiralty":     "#7F8C8D",
  "Kennedy Town":  "#27AE60", "Aberdeen":      "#2980B9",
  "Fortress Hill": "#8E44AD", "Braemar Hill":  "#16A085",
  "Shau Kei Wan":  "#E67E22", "Ap Lei Chau":   "#E74C3C",
  "Pok Fu Lam":    "#1ABC9C", "Tai Koo":       "#8B4513",
};

function Card({ listing, rank }) {
  const [imgOk, setImgOk] = useState(true);
  const dc = DISTRICT_COLORS[listing.district] || "#4B2D7F";
  const imgSrc = listing.image_url
    ? listing.image_url.replace("_thumb.", "_large.")
    : "";

  return (
    <div style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: `1.5px solid ${dc}25`,
      boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
      display: "flex", flexDirection: "column",
      transition: "transform 0.15s, box-shadow 0.15s",
      cursor: "pointer",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)"; }}
      onClick={() => window.open(listing.source_url, "_blank")}
    >
      <div style={{ position: "relative", height: 175, background: "#f0eaf8", overflow: "hidden" }}>
        {imgOk && imgSrc ? (
          <img src={imgSrc} alt={listing.name} onError={() => setImgOk(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🏠</div>
        )}
        <div style={{ position: "absolute", top: 9, left: 9, background: dc, color: "#fff", fontWeight: 800, fontSize: 11, borderRadius: 20, padding: "2px 10px" }}>#{rank}</div>
        {listing.carpark && (
          <div style={{ position: "absolute", top: 9, right: 9, background: "#27AE60", color: "#fff", fontWeight: 700, fontSize: 10, borderRadius: 20, padding: "2px 9px" }}>🚗 CP</div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,0.75))", padding: "18px 12px 8px" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 19 }}>HK${(listing.price_hkd || 0).toLocaleString()}</span>
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>/mo</span>
        </div>
      </div>

      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e", lineHeight: 1.35 }}>{listing.name?.substring(0, 60)}{listing.name?.length > 60 ? "…" : ""}</div>
        <div style={{ fontSize: 11, color: "#888" }}>📍 {listing.address?.substring(0, 55)}</div>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
          {listing.beds && listing.beds !== "N/A" && <span style={{ background: "#f0eaf8", borderRadius: 5, padding: "2px 7px", fontSize: 10, color: "#6b46c1" }}>🛏 {listing.beds}</span>}
          {listing.baths && listing.baths !== "N/A" && <span style={{ background: "#f0eaf8", borderRadius: 5, padding: "2px 7px", fontSize: 10, color: "#6b46c1" }}>🚿 {listing.baths}</span>}
          {listing.size_sf && listing.size_sf !== "N/A" && <span style={{ background: "#f0eaf8", borderRadius: 5, padding: "2px 7px", fontSize: 10, color: "#6b46c1" }}>📐 {listing.size_sf}ft²</span>}
          {listing.floor && <span style={{ background: "#f0eaf8", borderRadius: 5, padding: "2px 7px", fontSize: 10, color: "#6b46c1" }}>🏢 {listing.floor}</span>}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#bbb" }}>{listing.source} · {listing.fetched_date}</span>
          <span style={{ background: dc, color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 700 }}>View →</span>
        </div>
      </div>
    </div>
  );
}

export default function PropertyPage() {
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState("tier1"); // tier1 = ≤49K+carpark, tier2 = ≤40K no carpark filter
  const [district, setDistrict] = useState("All");
  const [sort, setSort] = useState("price_asc");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(49000);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await PropertyListing.list();
        setAllListings(data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // When tier changes, reset price filter
  useEffect(() => {
    setMaxPrice(tier === "tier1" ? 49000 : 40000);
    setDistrict("All");
  }, [tier]);

  const filtered = allListings
    .filter(l => {
      if (tier === "tier1") return (l.price_hkd || 0) <= 49000 && l.carpark === true;
      if (tier === "tier2") return (l.price_hkd || 0) <= 40000; // no carpark requirement
      return true;
    })
    .filter(l => district === "All" || l.district === district)
    .filter(l => !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.address?.toLowerCase().includes(search.toLowerCase()) || l.district?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price_asc") return (a.price_hkd || 0) - (b.price_hkd || 0);
      if (sort === "price_desc") return (b.price_hkd || 0) - (a.price_hkd || 0);
      return 0;
    });

  const districts = ["All", ...Object.keys(
    filtered.reduce((acc, l) => { if (l.district) acc[l.district] = 1; return acc; }, {})
  ).sort()];

  const grouped = filtered.reduce((acc, l) => {
    const d = l.district || "Other";
    if (!acc[d]) acc[d] = [];
    acc[d].push(l);
    return acc;
  }, {});

  let rank = 0;
  const tier1Count = allListings.filter(l => (l.price_hkd || 0) <= 49000 && l.carpark).length;
  const tier2Count = allListings.filter(l => (l.price_hkd || 0) <= 40000).length;

  return (
    <div style={{ padding: "24px 28px", background: "#f4f6fb", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#4B2D7F,#7B4FBF)", borderRadius: 16, padding: "22px 26px", marginBottom: 20, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>🏠 HK Island Property Search</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Live data from 28Hse.com · Updated daily</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", fontSize: 11, opacity: 0.9 }}>
            📅 {new Date().toLocaleDateString("en-HK", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>

        {/* Tier Toggle */}
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <button onClick={() => setTier("tier1")} style={{
            padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", border: "none",
            background: tier === "tier1" ? "#fff" : "rgba(255,255,255,0.2)",
            color: tier === "tier1" ? "#4B2D7F" : "#fff",
            boxShadow: tier === "tier1" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
          }}>
            🚗 Tier 1 — Under HK$49K with Carpark
            <span style={{ marginLeft: 8, background: tier === "tier1" ? "#4B2D7F" : "rgba(255,255,255,0.3)", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>
              {tier1Count}
            </span>
          </button>
          <button onClick={() => setTier("tier2")} style={{
            padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", border: "none",
            background: tier === "tier2" ? "#fff" : "rgba(255,255,255,0.2)",
            color: tier === "tier2" ? "#4B2D7F" : "#fff",
            boxShadow: tier === "tier2" ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
          }}>
            🏠 Tier 2 — Under HK$40K No Carpark Req.
            <span style={{ marginLeft: 8, background: tier === "tier2" ? "#4B2D7F" : "rgba(255,255,255,0.3)", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>
              {tier2Count}
            </span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search building, area..."
          style={{ flex: 1, minWidth: 160, padding: "8px 12px", border: "1.5px solid #e0d6f5", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: "8px 12px", border: "1.5px solid #e0d6f5", borderRadius: 8, fontSize: 13, background: "#fff", cursor: "pointer" }}>
          <option value="price_asc">Price ↑ Low → High</option>
          <option value="price_desc">Price ↓ High → Low</option>
        </select>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {districts.map(d => {
            const dc = DISTRICT_COLORS[d] || "#4B2D7F";
            const active = district === d;
            const count = d === "All" ? filtered.length : filtered.filter(l => l.district === d).length;
            return (
              <button key={d} onClick={() => setDistrict(d)} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${active ? dc : "#ddd"}`,
                background: active ? dc : "#fff",
                color: active ? "#fff" : "#555",
              }}>
                {d} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Count bar */}
      <div style={{ marginBottom: 14, fontSize: 13, color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
        Showing <b style={{ color: "#4B2D7F" }}>{filtered.length}</b> listings
        {tier === "tier1" && <span style={{ background: "#27AE60", color: "#fff", borderRadius: 20, padding: "1px 10px", fontSize: 11, fontWeight: 600 }}>🚗 Carpark Included</span>}
        {tier === "tier2" && <span style={{ background: "#E67E22", color: "#fff", borderRadius: 20, padding: "1px 10px", fontSize: 11, fontWeight: 600 }}>🏠 No Carpark Req.</span>}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
          <div style={{ fontSize: 36 }}>⏳</div>
          <div style={{ marginTop: 12 }}>Loading listings from database...</div>
        </div>
      )}

      {!loading && Object.entries(grouped).map(([dist, props]) => {
        const dc = DISTRICT_COLORS[dist] || "#4B2D7F";
        return (
          <div key={dist} style={{ marginBottom: 28 }}>
            <div style={{ background: dc, borderRadius: "12px 12px 0 0", padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>📍 {dist}</div>
              <div style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 20, padding: "2px 12px", fontSize: 11, fontWeight: 600 }}>
                {props.length} listing{props.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14,
              padding: 14, background: "#fff", borderRadius: "0 0 12px 12px",
              border: `1px solid ${dc}25`, borderTop: "none"
            }}>
              {props.map(l => { rank++; return <Card key={l.id} listing={l} rank={rank} />; })}
            </div>
          </div>
        );
      })}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ marginTop: 12, fontSize: 16 }}>No listings match your filters</div>
          <button onClick={() => { setSearch(""); setDistrict("All"); }}
            style={{ marginTop: 16, padding: "10px 24px", background: "#4B2D7F", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Clear Filters
          </button>
        </div>
      )}

      <div style={{ marginTop: 20, padding: "12px 18px", background: "#fff", borderRadius: 12, textAlign: "center", fontSize: 10, color: "#bbb", border: "1px solid #f0eaf8" }}>
        📡 Data from 28Hse.com · HK Island Only · Refreshed daily by Simpee
      </div>
    </div>
  );
}
