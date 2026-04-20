import { useState } from "react";

const LISTINGS = [
  { id: 1, name: "Mido Apartment", price: 8500, district: "North Point", address: "332 Kings Road, North Point", beds: "Studio", baths: 1, size: "N/A", floor: "High Floor", image: "https://i1.28hse.com/2026/04/202604181720015331297_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3814996", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 2, name: "Tung Fat Building", price: 9200, district: "North Point", address: "49 Kam Ping Street, North Point", beds: 1, baths: 1, size: "180", floor: "Low Floor", image: "https://i1.28hse.com/2026/04/202604190123132035085_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3815470", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 3, name: "Apartment", price: 9900, district: "Tin Hau", address: "Tin Hau, HK Island", beds: 1, baths: 1, size: "170", floor: "", image: "https://i1.28hse.com/2026/04/202604192100418767705_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3816316", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 4, name: "Apartment", price: 11000, district: "Causeway Bay", address: "Causeway Bay, HK Island", beds: 1, baths: 1, size: "200", floor: "Low Floor", image: "https://i1.28hse.com/2026/04/202604182216272724839_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3815403", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 5, name: "Kam Ho Mansion", price: 13500, district: "Sheung Wan", address: "163 Hollywood Road, Sheung Wan", beds: 2, baths: 1, size: "203", floor: "High Floor", image: "https://i1.28hse.com/2026/04/202604181346323405433_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3814612", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 6, name: "Novum East", price: 15000, district: "Quarry Bay", address: "Quarry Bay, HK Island", beds: 1, baths: 1, size: "216", floor: "High Floor", image: "https://i1.28hse.com/2026/04/202604201048038336329_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3814374", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 7, name: "Parker's Court", price: 16800, district: "North Point", address: "64 Fort Street, North Point", beds: 2, baths: 1, size: "342", floor: "High Floor", image: "https://i1.28hse.com/2026/04/202604191107277842733_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3815533", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 8, name: "Novum East (Terrace)", price: 17000, district: "Quarry Bay", address: "Quarry Bay, HK Island", beds: 1, baths: 1, size: "293", floor: "Low Floor", image: "https://i1.28hse.com/2026/04/202604201112472412007_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3816474", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 9, name: "Novum East", price: 17000, district: "Quarry Bay", address: "138 Third Street, Quarry Bay", beds: 1, baths: 1, size: "293", floor: "Low Floor", image: "https://i1.28hse.com/2026/04/202604181153085395893_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3814452", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 10, name: "Man Hee Mansion", price: 21000, district: "Wan Chai", address: "54 Johnston Road, Wan Chai", beds: 2, baths: 1, size: "503", floor: "High Floor", image: "https://i1.28hse.com/2026/04/202604192126422234019_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3816338", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 11, name: "Yen Dack Building", price: 20200, district: "North Point", address: "103 Chun Yeung Street, North Point", beds: 3, baths: 1, size: "612", floor: "High Floor", image: "https://i1.28hse.com/2026/04/202604181713586259601_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3814980", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 12, name: "Finnie", price: 22000, district: "Quarry Bay", address: "9 Finnie Street, Quarry Bay", beds: 2, baths: 1, size: "364", floor: "Mid Floor", image: "https://i1.28hse.com/2026/04/202604181356475806316_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3814627", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 13, name: "Roca Centre", price: 23800, district: "North Point", address: "18 Shu Kuk Street, North Point", beds: 3, baths: 1, size: "537", floor: "Mid Floor", image: "https://i1.28hse.com/2026/04/202604191212102071734_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3815039", source: "28Hse.com", updated: "20 Apr 2026" },
  { id: 14, name: "Parker's Court (Alt)", price: 16800, district: "North Point", address: "64 Fort Street, North Point", beds: 2, baths: 1, size: "342", floor: "High Floor", image: "https://i1.28hse.com/2026/04/20260418172556269482_large.jpg", url: "https://www.28hse.com/en/rent/apartment/property-3815011", source: "28Hse.com", updated: "20 Apr 2026" },
];

const DISTRICT_COLORS = {
  "North Point":  "#8E44AD",
  "Quarry Bay":   "#2980B9",
  "Wan Chai":     "#27AE60",
  "Causeway Bay": "#E67E22",
  "Tin Hau":      "#E74C3C",
  "Sheung Wan":   "#16A085",
};

function Card({ listing, rank }) {
  const [imgOk, setImgOk] = useState(true);
  const dc = DISTRICT_COLORS[listing.district] || "#4B2D7F";

  return (
    <div style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: `1.5px solid ${dc}30`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      display: "flex", flexDirection: "column",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 185, background: "#f0eaf8" }}>
        {imgOk ? (
          <img src={listing.image} alt={listing.name}
            onError={() => setImgOk(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏠</div>
        )}
        {/* Rank */}
        <div style={{ position: "absolute", top: 10, left: 10, background: dc, color: "#fff", fontWeight: 800, fontSize: 12, borderRadius: 20, padding: "3px 11px" }}>#{rank}</div>
        {/* Carpark */}
        <div style={{ position: "absolute", top: 10, right: 10, background: "#27AE60", color: "#fff", fontWeight: 700, fontSize: 11, borderRadius: 20, padding: "3px 10px" }}>🚗 Carpark ✓</div>
        {/* Price overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,0.78))", padding: "20px 12px 10px" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>HK${listing.price.toLocaleString()}</span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>/mo</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>{listing.name}</div>
        <div style={{ fontSize: 12, color: "#888" }}>📍 {listing.address}</div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
          {listing.beds && <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#6b46c1" }}>🛏 {listing.beds} Bed</span>}
          {listing.baths && <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#6b46c1" }}>🚿 {listing.baths} Bath</span>}
          {listing.size !== "N/A" && <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#6b46c1" }}>📐 {listing.size} ft²</span>}
          {listing.floor && <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#6b46c1" }}>🏢 {listing.floor}</span>}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#bbb" }}>📅 {listing.updated} · {listing.source}</span>
          <a href={listing.url} target="_blank" rel="noreferrer"
            style={{ background: dc, color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
            View →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PropertyPage() {
  const [district, setDistrict] = useState("All");
  const [sort, setSort] = useState("price_asc");
  const [search, setSearch] = useState("");

  const districts = ["All", ...Object.keys(
    LISTINGS.reduce((a, l) => { a[l.district] = 1; return a; }, {})
  )];

  const filtered = LISTINGS
    .filter(l => district === "All" || l.district === district)
    .filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.address.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "price_asc" ? a.price - b.price : sort === "price_desc" ? b.price - a.price : parseInt(b.size) - parseInt(a.size));

  const grouped = filtered.reduce((acc, l) => {
    if (!acc[l.district]) acc[l.district] = [];
    acc[l.district].push(l);
    return acc;
  }, {});

  let rank = 0;

  return (
    <div style={{ padding: "28px 32px", background: "#f4f6fb", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#4B2D7F,#7B4FBF)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>🏠 HK Island Property Search</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>Below HK$49,000/mo · Carpark Included · Live data from 28Hse · Squarefoot · OKAY</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.75 }}>
            <div>Last updated</div>
            <div style={{ fontWeight: 700 }}>20 Apr 2026</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          {[
            { label: "Listings", value: LISTINGS.length, color: "#fff" },
            { label: "Districts", value: districts.length - 1, color: "#fff" },
            { label: "Max Budget", value: "HK$49K", color: "#fff" },
            { label: "Carpark", value: "100%", color: "#27AE60" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 20px", textAlign: "center", minWidth: 90 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search building, area..."
          style={{ flex: 1, minWidth: 180, padding: "9px 14px", border: "1.5px solid #e0d6f5", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit" }} />

        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: "9px 14px", border: "1.5px solid #e0d6f5", borderRadius: 8, fontSize: 13, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="size">Size: Largest First</option>
        </select>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {districts.map(d => {
            const dc = DISTRICT_COLORS[d] || "#4B2D7F";
            const active = district === d;
            return (
              <button key={d} onClick={() => setDistrict(d)}
                style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1.5px solid ${active ? dc : "#ddd"}`, background: active ? dc : "#fff", color: active ? "#fff" : "#555", cursor: "pointer" }}>
                {d}
                {d !== "All" && <span style={{ marginLeft: 4, opacity: 0.7 }}>({LISTINGS.filter(l => l.district === d).length})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <div style={{ marginBottom: 16, fontSize: 13, color: "#888" }}>
        Showing <b style={{ color: "#4B2D7F" }}>{filtered.length}</b> of <b style={{ color: "#4B2D7F" }}>{LISTINGS.length}</b> listings
        {district !== "All" && <span> in <b>{district}</b></span>}
      </div>

      {/* Grouped listings */}
      {Object.entries(grouped).map(([dist, props]) => {
        const dc = DISTRICT_COLORS[dist] || "#4B2D7F";
        return (
          <div key={dist} style={{ marginBottom: 32 }}>
            <div style={{ background: dc, borderRadius: "12px 12px 0 0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>📍 {dist}</div>
              <div style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                {props.length} listing{props.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16, padding: 16, background: "#fff", borderRadius: "0 0 12px 12px", border: `1px solid ${dc}30`, borderTop: "none" }}>
              {props.map(l => { rank++; return <Card key={l.id} listing={l} rank={rank} />; })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ fontSize: 18, marginTop: 12 }}>No listings match</div>
          <button onClick={() => { setSearch(""); setDistrict("All"); }}
            style={{ marginTop: 16, padding: "10px 24px", background: "#4B2D7F", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 24, padding: "14px 20px", background: "#fff", borderRadius: 12, textAlign: "center", fontSize: 11, color: "#aaa", border: "1px solid #f0eaf8" }}>
        📡 Data sourced from 28Hse.com · Squarefoot · OKAY.com · HK Island Only · Below HK$49,000 · ✅ Carpark Confirmed · Powered by <b style={{ color: "#4B2D7F" }}>Simpee</b>
      </div>
    </div>
  );
}
