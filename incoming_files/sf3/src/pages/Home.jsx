import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, Bell, Pin, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isPast, differenceInDays } from "date-fns";

const BRAND_PURPLE = "#8c82fc";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.CalendarEvent.list().catch(() => []),
      base44.entities.ComplianceItem.list().catch(() => []),
    ]).then(([evts, comp]) => {
      setEvents(evts);
      setCompliance(comp);
      setLoading(false);
    });
  }, []);

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startPad = startOfMonth(currentMonth).getDay();

  const getEventsForDay = (day) => {
    return events.filter(e => {
      const d = e.start_date || e.due_date;
      if (!d) return false;
      return format(parseISO(d.split("T")[0]), "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    });
  };

  const getComplianceForDay = (day) => {
    return compliance.filter(c => {
      if (!c.due_date) return false;
      return format(parseISO(c.due_date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    });
  };

  const overdue = compliance.filter(c => c.status !== "Completed" && c.due_date && isPast(parseISO(c.due_date)));
  const dueSoon = compliance.filter(c => c.status !== "Completed" && c.due_date && !isPast(parseISO(c.due_date)) && differenceInDays(parseISO(c.due_date), new Date()) <= 30);

  const sampleNotices = [
    { id: 1, title: "BR Renewal Due Jul 14", type: "urgent", content: "Both 5SENSESBEAUTY and SIMPLEX-ITY branch BRs expire 14 Jul 2026. Contact Carrie at Reap Business." },
    { id: 2, title: "FundFluent Month 3 Payment Due", type: "info", content: "HKD 35,000 due end of May 2026. Confirm with Wilson before payment." },
    { id: 3, title: "Nikita (Banuba) Meeting TBC", type: "info", content: "Meeting window: Wed 27 May or Thu 28 May afternoon GMT+2. Wilson to be introduced." },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>Good day, Kieran 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5" style={{fontFamily:'Montserrat, sans-serif'}}>{format(new Date(), "EEEE, d MMMM yyyy")} · 5SENSESBEAUTY LIMITED / SIMPLEX-ITY</p>
        </div>
      </div>

      {/* Alert strip */}
      {(overdue.length > 0 || dueSoon.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {overdue.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-bold text-red-700" style={{fontFamily:'Montserrat, sans-serif'}}>{overdue.length} Overdue compliance items</span>
            </div>
          )}
          {dueSoon.length > 0 && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-700" style={{fontFamily:'Montserrat, sans-serif'}}>{dueSoon.length} due within 30 days</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8e6fe] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-base text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>{format(currentMonth, "MMMM yyyy")}</h2>
            <div className="flex gap-1">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-[#e8e6fe]"><ChevronLeft className="w-4 h-4 text-[#5e50fb]"/></button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-[#e8e6fe]"><ChevronRight className="w-4 h-4 text-[#5e50fb]"/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-400 pb-2" style={{fontFamily:'Montserrat, sans-serif'}}>{d}</div>
            ))}
            {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const dayComp = getComplianceForDay(day);
              const hasItems = dayEvents.length > 0 || dayComp.length > 0;
              const today = isToday(day);
              return (
                <div key={day.toString()} className={`relative rounded-lg p-1.5 min-h-[40px] text-center transition-all ${today ? "bg-[#8c82fc] text-white" : hasItems ? "bg-[#e8e6fe]" : "hover:bg-[#f5f4ff]"}`}>
                  <span className={`text-xs font-bold ${today ? "text-white" : "text-[#1a1a1f]"}`} style={{fontFamily:'Montserrat, sans-serif'}}>{format(day, "d")}</span>
                  {(dayComp.length > 0) && <div className="w-1.5 h-1.5 bg-red-400 rounded-full mx-auto mt-0.5" />}
                  {(dayEvents.length > 0) && <div className="w-1.5 h-1.5 bg-[#5e50fb] rounded-full mx-auto mt-0.5" />}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-[10px]" style={{fontFamily:'Montserrat, sans-serif'}}>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full inline-block"/>Compliance deadline</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#5e50fb] rounded-full inline-block"/>Event</span>
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white rounded-2xl border border-[#e8e6fe] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Pin className="w-4 h-4 text-[#8c82fc]" />
            <h2 className="font-extrabold text-base text-[#1a1a1f]" style={{fontFamily:'Exo 2, sans-serif'}}>Notice Board</h2>
          </div>
          <div className="space-y-3">
            {sampleNotices.map(n => (
              <div key={n.id} className={`rounded-xl p-3 border ${n.type === "urgent" ? "bg-red-50 border-red-200" : "bg-[#e8e6fe]/50 border-[#bab4fd]"}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  {n.type === "urgent" ? <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" /> : <Bell className="w-3 h-3 text-[#8c82fc] flex-shrink-0" />}
                  <span className="text-xs font-bold text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{n.title}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed" style={{fontFamily:'Montserrat, sans-serif'}}>{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="bg-white rounded-2xl border border-[#e8e6fe] p-5 shadow-sm">
        <h2 className="font-extrabold text-base text-[#1a1a1f] mb-4" style={{fontFamily:'Exo 2, sans-serif'}}>Upcoming Deadlines</h2>
        {loading ? <p className="text-sm text-gray-400">Loading...</p> : (
          <div className="divide-y divide-[#e8e6fe]">
            {[...overdue, ...dueSoon].slice(0, 8).map(c => {
              const days = c.due_date ? differenceInDays(parseISO(c.due_date), new Date()) : null;
              const isOvd = days !== null && days < 0;
              return (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1f]" style={{fontFamily:'Montserrat, sans-serif'}}>{c.title}</p>
                    <p className="text-xs text-gray-400" style={{fontFamily:'Montserrat, sans-serif'}}>{c.category} · {c.due_date ? format(parseISO(c.due_date), "d MMM yyyy") : "No date"}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isOvd ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`} style={{fontFamily:'Montserrat, sans-serif'}}>
                    {isOvd ? `${Math.abs(days)}d overdue` : `${days}d left`}
                  </span>
                </div>
              );
            })}
            {overdue.length === 0 && dueSoon.length === 0 && <p className="text-sm text-gray-400 py-3" style={{fontFamily:'Montserrat, sans-serif'}}>All clear — no urgent deadlines 🎉</p>}
          </div>
        )}
      </div>
    </div>
  );
}
