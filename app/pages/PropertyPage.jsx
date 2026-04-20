import { useState } from "react";

const LISTINGS = [
  {
    id: "3815403", name: "Apartment", price_hkd: 11000, price_str: "HK$11,000",
    address: "Causeway Bay, HK Island", district: "Causeway Bay",
    size_sf: "200", floor: "Low Floor", beds: "1", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604182216272724839_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3815403",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3814996", name: "Mido Apartment", price_hkd: 8500, price_str: "HK$8,500",
    address: "332 Kings Road, North Point", district: "North Point",
    size_sf: "N/A", floor: "High Floor", beds: "N/A", baths: "N/A",
    images: ["https://i1.28hse.com/2026/04/202604181720015331297_large.jpg"],
    agency: "See listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3814996",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3815470", name: "Tung Fat Building", price_hkd: 9200, price_str: "HK$9,200",
    address: "49 Kam Ping Street, North Point", district: "North Point",
    size_sf: "180", floor: "Low Floor", beds: "1", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604190123132035085_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3815470",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3815533", name: "Parker's Court", price_hkd: 16800, price_str: "HK$16,800",
    address: "64 Fort Street, North Point", district: "North Point",
    size_sf: "342", floor: "High Floor", beds: "2", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604191107277842733_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3815533",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3815011", name: "Parker's Court", price_hkd: 16800, price_str: "HK$16,800",
    address: "64 Fort Street, North Point", district: "North Point",
    size_sf: "342", floor: "High Floor", beds: "2", baths: "1",
    images: ["https://i1.28hse.com/2026/04/20260418172556269482_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3815011",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3814980", name: "Yen Dack Building", price_hkd: 20200, price_str: "HK$20,200",
    address: "103 Chun Yeung Street, North Point", district: "North Point",
    size_sf: "612", floor: "High Floor", beds: "3", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604181713586259601_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3814980",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3815039", name: "Roca Centre", price_hkd: 23800, price_str: "HK$23,800",
    address: "18 Shu Kuk Street, North Point", district: "North Point",
    size_sf: "537", floor: "Mid Floor", beds: "3", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604191212102071734_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3815039",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3814374", name: "Novum East", price_hkd: 15000, price_str: "HK$15,000",
    address: "Quarry Bay, HK Island", district: "Quarry Bay",
    size_sf: "216", floor: "High Floor", beds: "1", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604201048038336329_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3814374",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3816474", name: "Novum East", price_hkd: 17000, price_str: "HK$17,000",
    address: "Quarry Bay, HK Island", district: "Quarry Bay",
    size_sf: "293", floor: "Low Floor", beds: "1", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604201112472412007_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3816474",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3814452", name: "Novum East", price_hkd: 17000, price_str: "HK$17,000",
    address: "138 Third Street, Quarry Bay", district: "Quarry Bay",
    size_sf: "293", floor: "Low Floor", beds: "1", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604181153085395893_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3814452",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3814627", name: "Finnie", price_hkd: 22000, price_str: "HK$22,000",
    address: "9 Finnie Street, Quarry Bay", district: "Quarry Bay",
    size_sf: "364", floor: "Mid Floor", beds: "2", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604181356475806316_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3814627",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3814612", name: "Kam Ho Mansion", price_hkd: 13500, price_str: "HK$13,500",
    address: "163 Hollywood Road, Sheung Wan", district: "Sheung Wan",
    size_sf: "203", floor: "High Floor", beds: "2", baths: "N/A",
    images: ["https://i1.28hse.com/2026/04/202604181346323405433_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3814612",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3816316", name: "Apartment", price_hkd: 9900, price_str: "HK$9,900",
    address: "Tin Hau, HK Island", district: "Tin Hau",
    size_sf: "170", floor: "", beds: "1", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604192100418767705_large.jpg"],
    agency: "Agency Listing", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3816316",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
  {
    id: "3816338", name: "Man Hee Mansion", price_hkd: 21000, price_str: "HK$21,000",
    address: "54 Johnston Road, Wan Chai", district: "Wan Chai",
    size_sf: "503", floor: "High Floor", beds: "2", baths: "1",
    images: ["https://i1.28hse.com/2026/04/202604192126422234019_large.jpg"],
    agency: "Gold House Property Agency", phone: "Via 28Hse",
    source_url: "https://www.28hse.com/en/rent/apartment/property-3816338",
    updated: "20 Apr 2026", source: "28Hse.com"
  },
];

const DISTRICT_COLORS = {
  "Quarry Bay":   "#2980B9",
  "North Point":  "#8E44AD",
  "Wan Chai":     "#27AE60",
  "Causeway Bay": "#E67E22",
  "Tin Hau":      "#E74C3C",
  "Sheung Wan":   "#16A085",
  "Mid-Levels":   "#D35400",
  "Happy Valley": "#2C3E50",
};

const DISTRICT_ICONS = {
  "Quarry Bay":   "🔵",
  "North Point":  "🟣",
  "Wan Chai":     "🟢",
  "Causeway Bay": "🟠",
  "Tin Hau":      "🔴",
  "Sheung Wan":   "🩵",
};

function StatBadge({ label, value, color }) {
  return (
    <div style={{
      background: color + "18", border: `1px solid ${color}40`,
      borderRadius: 10, padding: "10px 18px", textAlign: "center", minWidth: 90
    }}>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ListingCard({ listing, rank }) {
  const dc = DISTRICT_COLORS[listing.district] || "#4B2D7F";
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: `1.5px solid ${dc}30`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 190, background: "#f0eaf8", overflow: "hidden" }}>
        {!imgError && listing.images?.[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.name}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 40 }}>
            🏠
          </div>
        )}
        {/* Rank badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: dc, color: "#fff", fontWeight: 700,
          fontSize: 12, borderRadius: 20, padding: "3px 10px"
        }}>#{rank}</div>
        {/* Carpark badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "#27AE60", color: "#fff", fontWeight: 700,
          fontSize: 11, borderRadius: 20, padding: "3px 10px"
        }}>🚗 Carpark ✓</div>
        {/* Price overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
          padding: "18px 12px 10px", color: "#fff"
        }}>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{listing.price_str}<span style={{ fontSize: 13, fontWeight: 400 }}>/mo</span></div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>{listing.name}</div>
        <div style={{ fontSize: 12, color: "#888" }}>📍 {listing.address}</div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "4px 0" }}>
          {listing.beds !== "N/A" && (
            <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "#6b46c1" }}>
              🛏 {listing.beds} Bed
            </span>
          )}
          {listing.baths !== "N/A" && (
            <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "#6b46c1" }}>
              🚿 {listing.baths} Bath
            </span>
          )}
          {listing.size_sf !== "N/A" && (
            <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "#6b46c1" }}>
              📐 {listing.size_sf} ft²
            </span>
          )}
          {listing.floor && (
            <span style={{ background: "#f0eaf8", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "#6b46c1" }}>
              🏢 {listing.floor}
            </span>
          )}
        </div>

        {/* Agent */}
        <div style={{ fontSize: 11, color: "#777" }}>🏢 {listing.agency}</div>
        <div style={{ fontSize: 11, color: "#777" }}>📞 {listing.phone}</div>

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#bbb" }}>📅 {listing.updated} · {listing.source}</span>
          <a
            href={listing.source_url}
            target="_blank"
            rel="noreferrer"
            style={{
              background: dc, color: "#fff", borderRadius: 8,
              padding: "5px 12px", fontSize: 11, fontWeight: 600,
              textDecoration: "none"
            }}
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PropertyPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [sortBy, setSortBy] = useState("price_asc");
  const [search, setSearch] = useState("");

  // Group by district
  const allDistricts = ["All", ...Object.keys(
    LISTINGS.reduce((acc, l) => { acc[l.district] = true; return acc; }, {})
  )];

  const filtered = LISTINGS
    .filter(l => selectedDistrict === "All" || l.district === selectedDistrict)
    .filter(l => search === "" ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase()) ||
      l.district.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price_hkd - b.price_hkd;
      if (sortBy === "price_desc") return b.price_hkd - a.price_hkd;
      if (sortBy === "size") return (parseInt(b.size_sf) || 0) - (parseInt(a.size_sf) || 0);
      return 0;
    });

  // Group by district for display
  const grouped = {};
  filtered.forEach(l => {
    if (!grouped[l.district]) grouped[l.district] = [];
    grouped[l.district].push(l);
  });

  let globalRank = 0;

  return (
    <div style={{ padding: "28px 32px", background: "#f4f6fb", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #4B2D7F 0%, #7B4FBF 100%)",
        borderRadius: 16, padding: "24px 28px", marginBottom: 24, color: "#fff"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>🏠 HK Island Property Search</div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6 }}>
              Below HK$49,000/mo · Carpark Included · Live data from 28Hse · Squarefoot · OKAY
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.75 }}>
            <div>Last updated</div>
            <div style={{ fontWeight: 700 }}>20 Apr 2026</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <StatBadge label="Listings" value={LISTINGS.length} color="#fff" />
          <StatBadge label="Districts" value={allDistricts.length - 1} color="#fff" />
          <StatBadge label="Max Budget" value="$49K" color="#fff" />
          <StatBadge label="Carpark" value="100%" color="#27AE60" />
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: "#fff", borderRadius: 12, padding: "16px 20px",
        marginBottom: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
      }}>
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search building, street, area..."
          style={{
            flex: 1, minWidth: 200, padding: "9px 14px", border: "1.5px solid #e0d6f5",
            borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit"
          }}
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: "9px 14px", border: "1.5px solid #e0d6f5",
            borderRadius: 8, fontSize: 13, background: "#fff", cursor: "pointer", fontFamily: "inherit"
          }}
        >
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="size">Size: Largest First</option>
        </select>

        {/* District filter chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {allDistricts.map(d => {
            const dc = DISTRICT_COLORS[d] || "#4B2D7F";
            const active = selectedDistrict === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${active ? dc : "#ddd"}`,
                  background: active ? dc : "#fff",
                  color: active ? "#fff" : "#555",
                  cursor: "pointer", transition: "all 0.15s"
                }}
              >
                {DISTRICT_ICONS[d] || "📍"} {d}
                {d !== "All" && (
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>
                    ({LISTINGS.filter(l => l.district === d).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 16, fontSize: 13, color: "#888" }}>
        Showing <b style={{ color: "#4B2D7F" }}>{filtered.length}</b> listings
        {selectedDistrict !== "All" && <span> in <b>{selectedDistrict}</b></span>}
        {search && <span> matching "<b>{search}</b>"</span>}
      </div>

      {/* Grouped listings */}
      {Object.entries(grouped).map(([district, props]) => {
        const dc = DISTRICT_COLORS[district] || "#4B2D7F";
        return (
          <div key={district} style={{ marginBottom: 32 }}>
            {/* District header */}
            <div style={{
              background: dc, borderRadius: "12px 12px 0 0",
              padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                {DISTRICT_ICONS[district] || "📍"} {district}
              </div>
              <div style={{
                background: "rgba(255,255,255,0.25)", color: "#fff",
                borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600
              }}>
                {props.length} listing{props.length > 1 ? "s" : ""}
              </div>
            </div>

            {/* Cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16, padding: 16,
              background: "#fff",
              borderRadius: "0 0 12px 12px",
              border: `1px solid ${dc}30`,
              borderTop: "none"
            }}>
              {props.map(listing => {
                globalRank++;
                return <ListingCard key={listing.id} listing={listing} rank={globalRank} />;
              })}
            </div>
          </div>
        );
      })}

      {/* No results */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px", color: "#aaa"
        }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <div style={{ fontSize: 18, marginTop: 12 }}>No listings match your search</div>
          <button onClick={() => { setSearch(""); setSelectedDistrict("All"); }}
            style={{
              marginTop: 16, padding: "10px 24px", background: "#4B2D7F",
              color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14
            }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 24, padding: "16px 20px", background: "#fff",
        borderRadius: 12, textAlign: "center", fontSize: 11, color: "#aaa",
        border: "1px solid #f0eaf8"
      }}>
        📡 Data sourced live from 28Hse.com · Squarefoot · OKAY.com · Centaline · Midland Realty
        &nbsp;·&nbsp; HK Island Only &nbsp;·&nbsp; Below HK$49,000 &nbsp;·&nbsp; ✅ Carpark Confirmed
        &nbsp;·&nbsp; Powered by <b style={{ color: "#4B2D7F" }}>Simpee</b> for SIMPLEX-ITY
      </div>
    </div>
  );
}
