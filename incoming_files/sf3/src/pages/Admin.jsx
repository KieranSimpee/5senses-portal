import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Eye, EyeOff, ExternalLink, Trash2, Edit, Upload, Building2, CreditCard, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const VAULT_CATS = ["Company Admin","Microsoft Licenses","Website & Hosting","Branding & Design","AI & Platform","Finance & Trading","Internal Tools","Other"];
const BANK_TYPES = ["Current","Savings","Multi-currency","Credit"];

const emptyVault = { service_name:"", category:"Company Admin", url:"", username:"", password:"", notes:"", is_admin_only:true };
const emptyBank = { bank_name:"", account_name:"", account_number:"", currency:"HKD", type:"Current", entity:"5SENSESBEAUTY LIMITED", balance:0, notes:"", is_admin_only:true };

export default function Admin() {
  const [vault, setVault] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVaultForm, setShowVaultForm] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [vaultForm, setVaultForm] = useState(emptyVault);
  const [bankForm, setBankForm] = useState(emptyBank);
  const [editingVault, setEditingVault] = useState(null);
  const [editingBank, setEditingBank] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [v, b] = await Promise.all([
      base44.entities.VaultItem.list().catch(() => []),
      base44.entities.BankAccount.list().catch(() => []),
    ]);
    setVault(v); setBanks(b); setLoading(false);
  };

  const saveVault = async () => {
    setSaving(true);
    if (editingVault) await base44.entities.VaultItem.update(editingVault.id, vaultForm);
    else await base44.entities.VaultItem.create(vaultForm);
    await load(); setShowVaultForm(false); setSaving(false);
  };

  const saveBank = async () => {
    setSaving(true);
    if (editingBank) await base44.entities.BankAccount.update(editingBank.id, bankForm);
    else await base44.entities.BankAccount.create(bankForm);
    await load(); setShowBankForm(false); setSaving(false);
  };

  const deleteVault = async (id) => { if (confirm("Delete?")) { await base44.entities.VaultItem.delete(id); await load(); }};
  const deleteBank = async (id) => { if (confirm("Delete?")) { await base44.entities.BankAccount.delete(id); await load(); }};

  const cats = [...new Set(vault.map(v => v.category))].sort();

  const F = ({ label, children }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide" style={{fontFamily:'Montserrat, sans-serif'}}>{label}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>Admin</h1>
        <p className="text-sm text-gray-500 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>Credentials vault · Bank accounts · Company info</p>
      </div>

      <Tabs defaultValue="vault">
        <TabsList className="bg-[#e8e6fe]">
          <TabsTrigger value="vault" style={{fontFamily:'Montserrat, sans-serif'}}>🔐 Credentials Vault</TabsTrigger>
          <TabsTrigger value="bank" style={{fontFamily:'Montserrat, sans-serif'}}>🏦 Bank Accounts</TabsTrigger>
          <TabsTrigger value="company" style={{fontFamily:'Montserrat, sans-serif'}}>🏢 Company Info</TabsTrigger>
        </TabsList>

        {/* VAULT TAB */}
        <TabsContent value="vault" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setEditingVault(null); setVaultForm(emptyVault); setShowVaultForm(true); }} className="bg-[#8c82fc] hover:bg-[#5e50fb] text-white gap-2 font-semibold" style={{fontFamily:'Montserrat, sans-serif'}}>
              <Plus className="w-4 h-4"/> Add Credential
            </Button>
          </div>
          {loading ? <p className="text-center text-gray-400 py-8">Loading...</p> : (
            <div className="space-y-6">
              {cats.map(cat => (
                <div key={cat}>
                  <h3 className="text-xs font-bold text-[#8c82fc] uppercase tracking-widest mb-2" style={{fontFamily:'Montserrat, sans-serif'}}>{cat}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vault.filter(v => v.category === cat).map(item => (
                      <Card key={item.id} className="border-[#e8e6fe] hover:border-[#bab4fd] transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="font-bold text-sm text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{item.service_name}</div>
                            <div className="flex gap-1">
                              {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-[#e8e6fe] rounded"><ExternalLink className="w-3.5 h-3.5 text-[#8c82fc]"/></a>}
                              <button onClick={() => { setEditingVault(item); setVaultForm({...item}); setShowVaultForm(true); }} className="p-1 hover:bg-[#e8e6fe] rounded"><Edit className="w-3.5 h-3.5 text-gray-400"/></button>
                              <button onClick={() => deleteVault(item.id)} className="p-1 hover:bg-red-100 rounded"><Trash2 className="w-3.5 h-3.5 text-red-400"/></button>
                            </div>
                          </div>
                          {item.username && <div className="text-xs text-gray-500 mb-1" style={{fontFamily:'Montserrat, sans-serif'}}>👤 {item.username}</div>}
                          {item.password && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono bg-[#f5f4ff] px-2 py-0.5 rounded flex-1 truncate">
                                {revealed[item.id] ? item.password : "••••••••••"}
                              </span>
                              <button onClick={() => setRevealed(r => ({...r, [item.id]: !r[item.id]}))} className="p-1 hover:bg-[#e8e6fe] rounded">
                                {revealed[item.id] ? <EyeOff className="w-3 h-3 text-gray-400"/> : <Eye className="w-3 h-3 text-gray-400"/>}
                              </button>
                              <button onClick={() => navigator.clipboard.writeText(item.password)} className="p-1 hover:bg-[#e8e6fe] rounded"><Copy className="w-3 h-3 text-gray-400"/></button>
                            </div>
                          )}
                          {item.notes && <p className="text-[11px] text-gray-400 mt-2 leading-relaxed" style={{fontFamily:'Montserrat, sans-serif'}}>{item.notes}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              {vault.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No credentials yet</p>}
            </div>
          )}
        </TabsContent>

        {/* BANK TAB */}
        <TabsContent value="bank" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setEditingBank(null); setBankForm(emptyBank); setShowBankForm(true); }} className="bg-[#8c82fc] hover:bg-[#5e50fb] text-white gap-2 font-semibold" style={{fontFamily:'Montserrat, sans-serif'}}>
              <Plus className="w-4 h-4"/> Add Bank Account
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map(b => (
              <Card key={b.id} className="border-[#e8e6fe]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>{b.bank_name}</div>
                      <div className="text-xs text-gray-500" style={{fontFamily:'Montserrat, sans-serif'}}>{b.account_name}</div>
                    </div>
                    <Badge className="bg-[#e8e6fe] text-[#5e50fb] border-0 text-xs font-bold">{b.currency}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 mb-1" style={{fontFamily:'Montserrat, sans-serif'}}>A/C: {b.account_number}</div>
                  <div className="text-xs text-gray-500 mb-3" style={{fontFamily:'Montserrat, sans-serif'}}>{b.entity} · {b.type}</div>
                  {b.notes && <p className="text-[11px] text-gray-400" style={{fontFamily:'Montserrat, sans-serif'}}>{b.notes}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setEditingBank(b); setBankForm({...b}); setShowBankForm(true); }} className="p-1.5 hover:bg-[#e8e6fe] rounded-lg"><Edit className="w-3.5 h-3.5 text-gray-400"/></button>
                    <button onClick={() => deleteBank(b.id)} className="p-1.5 hover:bg-red-100 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400"/></button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {banks.length === 0 && <p className="text-gray-400 text-sm py-4">No bank accounts added yet</p>}
          </div>
        </TabsContent>

        {/* COMPANY INFO TAB */}
        <TabsContent value="company" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label:"5SENSESBEAUTY LIMITED", items:[
                {k:"Type", v:"Private Limited Company"},
                {k:"BR Number", v:"78459506-000-07-25-9"},
                {k:"BR Expires", v:"14 Jul 2026 ⚠️"},
                {k:"Incorporation", v:"~2025"},
                {k:"Company Secretary", v:"Reap Business Limited"},
              ]},
              { label:"SIMPLEX-ITY (Branch)", items:[
                {k:"Branch Cert No", v:"78459506-001-07-25-A"},
                {k:"Branch Expires", v:"14 Jul 2026 ⚠️"},
                {k:"Nature", v:"Marketing Service"},
                {k:"Address", v:"Rm 1608, 16/F APEC Plaza, 49 Hoi Yuen Rd, KLN"},
                {k:"Commenced", v:"12 Jan 2026"},
              ]},
              { label:"Key Contacts", items:[
                {k:"Reap Business (Carrie)", v:"(852) 3166 1298"},
                {k:"FundFluent (Wilson)", v:"wilson.tai@fundfluent.io"},
                {k:"Banuba (Nikita)", v:"nikita.afanasjew@banuba.com"},
                {k:"Loreen (Internal)", v:"Loreen@5senses.global"},
                {k:"IPD Business Centre", v:"businesscentre@ipd.gov.hk"},
              ]},
              { label:"Payment Info", items:[
                {k:"HSBC Account", v:"4544-8741-4001"},
                {k:"HSBC FPS", v:"65438388"},
                {k:"Hang Seng (FundFluent)", v:"239 778269 883 / FPS 161690177"},
              ]},
            ].map(section => (
              <Card key={section.label} className="border-[#e8e6fe]">
                <CardContent className="p-5">
                  <h3 className="font-extrabold text-sm text-[#5e50fb] mb-3" style={{fontFamily:'Exo 2, sans-serif'}}>{section.label}</h3>
                  <div className="space-y-2">
                    {section.items.map(i => (
                      <div key={i.k} className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 w-36 flex-shrink-0" style={{fontFamily:'Montserrat, sans-serif'}}>{i.k}</span>
                        <span className="text-xs font-semibold text-[#1a1a1f] flex-1" style={{fontFamily:'Montserrat, sans-serif'}}>{i.v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Vault Form */}
      <Dialog open={showVaultForm} onOpenChange={setShowVaultForm}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle style={{fontFamily:'Exo 2, sans-serif'}}>{editingVault ? "Edit Credential" : "Add Credential"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <F label="Service Name"><Input value={vaultForm.service_name} onChange={e=>setVaultForm(f=>({...f,service_name:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Category">
              <Select value={vaultForm.category} onValueChange={v=>setVaultForm(f=>({...f,category:v}))}>
                <SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger>
                <SelectContent>{VAULT_CATS.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="URL"><Input value={vaultForm.url||""} onChange={e=>setVaultForm(f=>({...f,url:e.target.value}))} placeholder="https://" style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Username / Email"><Input value={vaultForm.username||""} onChange={e=>setVaultForm(f=>({...f,username:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Password"><Input type="text" value={vaultForm.password||""} onChange={e=>setVaultForm(f=>({...f,password:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Notes"><Input value={vaultForm.notes||""} onChange={e=>setVaultForm(f=>({...f,notes:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="flex gap-3 pt-2">
              <Button onClick={saveVault} disabled={saving} className="flex-1 bg-[#8c82fc] hover:bg-[#5e50fb]">{saving?"Saving...":editingVault?"Update":"Add"}</Button>
              <Button variant="outline" onClick={()=>setShowVaultForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bank Form */}
      <Dialog open={showBankForm} onOpenChange={setShowBankForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle style={{fontFamily:'Exo 2, sans-serif'}}>{editingBank ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <F label="Bank Name"><Input value={bankForm.bank_name} onChange={e=>setBankForm(f=>({...f,bank_name:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Account Name"><Input value={bankForm.account_name||""} onChange={e=>setBankForm(f=>({...f,account_name:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Account Number"><Input value={bankForm.account_number||""} onChange={e=>setBankForm(f=>({...f,account_number:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Currency"><Input value={bankForm.currency||"HKD"} onChange={e=>setBankForm(f=>({...f,currency:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
              <F label="Type">
                <Select value={bankForm.type||"Current"} onValueChange={v=>setBankForm(f=>({...f,type:v}))}>
                  <SelectTrigger style={{fontFamily:'Montserrat, sans-serif'}}><SelectValue/></SelectTrigger>
                  <SelectContent>{BANK_TYPES.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </F>
            </div>
            <F label="Entity"><Input value={bankForm.entity||""} onChange={e=>setBankForm(f=>({...f,entity:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <F label="Notes"><Input value={bankForm.notes||""} onChange={e=>setBankForm(f=>({...f,notes:e.target.value}))} style={{fontFamily:'Montserrat, sans-serif'}}/></F>
            <div className="flex gap-3 pt-2">
              <Button onClick={saveBank} disabled={saving} className="flex-1 bg-[#8c82fc] hover:bg-[#5e50fb]">{saving?"Saving...":editingBank?"Update":"Add"}</Button>
              <Button variant="outline" onClick={()=>setShowBankForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
