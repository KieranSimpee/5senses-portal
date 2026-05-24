import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ExternalLink, FileText, Upload, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const TOOLS_5SENSES = [
  { name:"Microsoft 365", desc:"Email, Teams, SharePoint", url:"https://office.com", icon:"📧" },
  { name:"Google Workspace", desc:"Docs, Drive", url:"https://workspace.google.com", icon:"📁" },
  { name:"GlowFinder AI", desc:"Product database & backend", url:"https://app.base44.com/apps/68de61f48718b4d679503028", icon:"🔍" },
  { name:"Shopify", desc:"5sensesbeauty.com store", url:"https://admin.shopify.com", icon:"🛒" },
];

const TOOLS_SIMPLEX = [
  { name:"Canva Pro", desc:"Brand design & social", url:"https://canva.com", icon:"🎨" },
  { name:"Looka", desc:"Logo & brand kit", url:"https://looka.com", icon:"✏️" },
  { name:"TINT / Banuba", desc:"AR try-on integration", url:"https://www.banuba.com/famous-web-ar", icon:"🪄" },
  { name:"FundFluent / FluentLab", desc:"Platform dev staging", url:"https://simplex-ity.fluentlab.co", icon:"🔧" },
  { name:"Synthesia", desc:"AI video creation", url:"https://synthesia.io", icon:"🎬" },
  { name:"Face++", desc:"AI face recognition", url:"https://face-plus-plus.com", icon:"👁️" },
  { name:"GoDaddy", desc:"Domain management", url:"https://godaddy.com", icon:"🌐" },
  { name:"Base44 / Simpee", desc:"Company portal & AI agent", url:"https://app.base44.com", icon:"🤖" },
];

const BRAND_COLORS = [
  { name:"Primary Lilac", hex:"#8c82fc" },
  { name:"Accent Violet", hex:"#5e50fb" },
  { name:"Soft Lilac", hex:"#bab4fd" },
  { name:"Lavender Wash", hex:"#e8e6fe" },
  { name:"White Canvas", hex:"#ffffff" },
  { name:"Neutral Grey", hex:"#e6e6e6" },
  { name:"Body Text", hex:"#1a1a1f" },
];

export default function Brand() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Document.list().catch(() => []).then(d => { setDocs(d); setLoading(false); });
  }, []);

  const brandDocs = docs.filter(d => ["Brand Deck","Influencer Deck","Core Values","Design Asset","Contract"].includes(d.category));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>Brand</h1>
        <p className="text-sm text-gray-500 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>Brand assets · Tools · Design system</p>
      </div>

      <Tabs defaultValue="simplex">
        <TabsList className="bg-[#e8e6fe]">
          <TabsTrigger value="simplex" style={{fontFamily:'Montserrat, sans-serif'}}>🟣 SIMPLEX-ITY</TabsTrigger>
          <TabsTrigger value="5senses" style={{fontFamily:'Montserrat, sans-serif'}}>✨ 5SENSESBEAUTY</TabsTrigger>
          <TabsTrigger value="assets" style={{fontFamily:'Montserrat, sans-serif'}}>📁 Assets</TabsTrigger>
        </TabsList>

        {/* SIMPLEX-ITY */}
        <TabsContent value="simplex" className="mt-4 space-y-6">
          {/* Brand Identity */}
          <Card className="border-[#e8e6fe]">
            <CardContent className="p-5">
              <h3 className="font-extrabold text-[#5e50fb] mb-4" style={{fontFamily:'Exo 2, sans-serif'}}>Brand Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3" style={{fontFamily:'Montserrat, sans-serif'}}>Colors</p>
                  <div className="space-y-2">
                    {BRAND_COLORS.map(c => (
                      <div key={c.hex} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0" style={{backgroundColor:c.hex}} />
                        <div>
                          <p className="text-xs font-bold text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{c.name}</p>
                          <p className="text-[10px] font-mono text-gray-400">{c.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" style={{fontFamily:'Montserrat, sans-serif'}}>Typography</p>
                    <p className="text-sm text-[#1a1a1f] mb-1" style={{fontFamily:'Exo 2, sans-serif'}}>Exo 2 — Headlines</p>
                    <p className="text-sm text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>Montserrat — Body</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" style={{fontFamily:'Montserrat, sans-serif'}}>Brand Names</p>
                    <p className="text-sm font-bold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>SIMPLEX-ITY</p>
                    <p className="text-sm text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>至簡 (Chinese)</p>
                    <p className="text-xs text-[#8c82fc] mt-1 font-semibold" style={{fontFamily:'Montserrat, sans-serif'}}>Simplify to Amplify</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2" style={{fontFamily:'Montserrat, sans-serif'}}>Trademark</p>
                    <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>HK Filing: 307280596</p>
                    <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>Madrid deadline: 17 Nov 2026</p>
                    <p className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>Classes: 9, 35, 38, 42</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-red-700" style={{fontFamily:'Montserrat, sans-serif'}}>⚠️ PROHIBITED</p>
                    <p className="text-xs text-red-500 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>"ONE STOP ASIAN BEAUTY" — do not use in any materials</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Tools */}
          <div>
            <h3 className="font-extrabold text-[#1a1a1f] mb-3" style={{fontFamily:'Exo 2, sans-serif'}}>Brand Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TOOLS_SIMPLEX.map(t => (
                <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#e8e6fe] hover:border-[#8c82fc] hover:shadow-sm transition-all group">
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1f] group-hover:text-[#5e50fb]" style={{fontFamily:'Montserrat, sans-serif'}}>{t.name}</p>
                    <p className="text-[11px] text-gray-400 truncate" style={{fontFamily:'Montserrat, sans-serif'}}>{t.desc}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8c82fc]" />
                </a>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* 5SENSESBEAUTY */}
        <TabsContent value="5senses" className="mt-4 space-y-6">
          <Card className="border-[#e8e6fe]">
            <CardContent className="p-5">
              <h3 className="font-extrabold text-[#5e50fb] mb-4" style={{fontFamily:'Exo 2, sans-serif'}}>5SENSESBEAUTY LIMITED</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  {k:"Legal Entity", v:"5SENSESBEAUTY LIMITED"},
                  {k:"Branch", v:"SIMPLEX-ITY"},
                  {k:"BR (Main)", v:"78459506-000-07-25-9 · Expires 14 Jul 2026"},
                  {k:"BR (Branch)", v:"78459506-001-07-25-A · Expires 14 Jul 2026"},
                  {k:"Address", v:"Rm 1608, 16/F APEC Plaza, 49 Hoi Yuen Rd, KLN"},
                  {k:"Nature", v:"Marketing Service"},
                ].map(i => (
                  <div key={i.k} className="flex gap-3">
                    <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>{i.k}</span>
                    <span className="text-xs font-semibold text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{i.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div>
            <h3 className="font-extrabold text-[#1a1a1f] mb-3" style={{fontFamily:'Exo 2, sans-serif'}}>5Senses Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TOOLS_5SENSES.map(t => (
                <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#e8e6fe] hover:border-[#8c82fc] hover:shadow-sm transition-all group">
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1f] group-hover:text-[#5e50fb]" style={{fontFamily:'Montserrat, sans-serif'}}>{t.name}</p>
                    <p className="text-[11px] text-gray-400 truncate" style={{fontFamily:'Montserrat, sans-serif'}}>{t.desc}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8c82fc]" />
                </a>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Assets */}
        <TabsContent value="assets" className="mt-4">
          {loading ? <p className="text-gray-400 text-sm">Loading...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {brandDocs.map(d => (
                <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#e8e6fe] hover:border-[#8c82fc] hover:shadow-sm transition-all group">
                  <FileText className="w-8 h-8 text-[#8c82fc] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1f] group-hover:text-[#5e50fb] truncate" style={{fontFamily:'Montserrat, sans-serif'}}>{d.title}</p>
                    <Badge className="mt-1 bg-[#e8e6fe] text-[#5e50fb] border-0 text-[10px]">{d.category}</Badge>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#8c82fc]" />
                </a>
              ))}
              {brandDocs.length === 0 && <p className="text-gray-400 text-sm col-span-2 py-6 text-center">No brand documents yet. Upload them in Documents.</p>}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
