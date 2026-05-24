import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay, parseISO, addMonths, subMonths } from "date-fns";

const eventTypeColors = {
  meeting: "bg-blue-500",
  deadline: "bg-red-500",
  reminder: "bg-yellow-500",
  launch: "bg-purple-500",
  payment: "bg-green-500",
  renewal: "bg-orange-500",
  other: "bg-gray-400",
};

const empty = { title: "", description: "", event_type: "meeting", start_date: "", end_date: "", all_day: false, location: "", notes: "", whatsapp_reminder: false, reminder_minutes: 30 };

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const e = await base44.entities.CalendarEvent.list("start_date");
    setEvents(e);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    await base44.entities.CalendarEvent.create(form);
    setSaving(false);
    setShowForm(false);
    setForm(empty);
    load();
  };

  const remove = async (id) => {
    await base44.entities.CalendarEvent.delete(id);
    load();
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day) => events.filter(e => e.start_date && isSameDay(parseISO(e.start_date), day));

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const openAddForDay = (day) => {
    setForm({ ...empty, start_date: format(day, "yyyy-MM-dd") + "T09:00", end_date: format(day, "yyyy-MM-dd") + "T10:00" });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-exo text-2xl font-semibold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground font-montserrat mt-0.5">Company schedule, deadlines & reminders</p>
        </div>
        <Button onClick={() => { setForm(empty); setShowForm(true); }} className="bg-primary hover:bg-primary/90 font-montserrat">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="border-border">
            <CardContent className="p-4">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-secondary">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="font-exo font-semibold text-base text-foreground">{format(currentMonth, "MMMM yyyy")}</h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-secondary">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground font-montserrat py-2">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {days.map(day => {
                  const dayEvts = getEventsForDay(day);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  const inMonth = isSameMonth(day, currentMonth);
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => setSelectedDay(isSameDay(day, selectedDay) ? null : day)}
                      onDoubleClick={() => openAddForDay(day)}
                      className={`bg-white min-h-[80px] p-1.5 cursor-pointer transition-colors hover:bg-secondary/50 ${isSelected ? "bg-primary/5 ring-1 ring-primary" : ""} ${!inMonth ? "opacity-40" : ""}`}
                    >
                      <div className={`text-xs font-montserrat font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday(day) ? "bg-primary text-white" : "text-foreground"}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvts.slice(0, 2).map(e => (
                          <div key={e.id} className={`text-[10px] text-white px-1 py-0.5 rounded truncate font-montserrat ${eventTypeColors[e.event_type] || "bg-gray-400"}`}>
                            {e.title}
                          </div>
                        ))}
                        {dayEvts.length > 2 && <div className="text-[10px] text-muted-foreground font-montserrat">+{dayEvts.length - 2} more</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-muted-foreground font-montserrat mt-2 text-center">Click a day to see events · Double-click to add event</p>
            </CardContent>
          </Card>
        </div>

        {/* Day events panel */}
        <div>
          <Card className="border-border">
            <CardContent className="p-4">
              <h3 className="font-exo font-semibold text-sm text-foreground mb-3">
                {selectedDay ? format(selectedDay, "EEEE, MMM d") : "Select a day"}
              </h3>
              {!selectedDay ? (
                <p className="text-xs text-muted-foreground font-montserrat">Click a date on the calendar to view events.</p>
              ) : dayEvents.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-montserrat">No events for this day.</p>
                  <Button size="sm" variant="outline" onClick={() => openAddForDay(selectedDay)} className="w-full text-xs font-montserrat border-dashed">
                    <Plus className="w-3 h-3 mr-1" /> Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayEvents.map(e => (
                    <div key={e.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${eventTypeColors[e.event_type] || "bg-gray-400"}`} />
                          <span className="font-montserrat font-semibold text-sm text-foreground">{e.title}</span>
                        </div>
                        <button onClick={() => remove(e.id)} className="p-0.5 rounded hover:bg-red-50 flex-shrink-0"><Trash2 className="w-3 h-3 text-red-400" /></button>
                      </div>
                      {!e.all_day && e.start_date && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-montserrat mt-1">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(e.start_date), "h:mm a")}
                          {e.end_date && " - " + format(parseISO(e.end_date), "h:mm a")}
                        </div>
                      )}
                      {e.location && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-montserrat mt-1">
                          <MapPin className="w-3 h-3" /> {e.location}
                        </div>
                      )}
                      {e.description && <p className="text-[11px] text-muted-foreground font-montserrat mt-1">{e.description}</p>}
                      {e.whatsapp_reminder && <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-montserrat font-semibold mt-1 inline-block">WhatsApp Reminder</span>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg font-montserrat">
          <DialogHeader><DialogTitle className="font-exo">Add Event</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold mb-1">Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Type</Label>
                <Select value={form.event_type} onValueChange={v => setForm({ ...form, event_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(eventTypeColors).map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="allday" checked={form.all_day} onChange={e => setForm({ ...form, all_day: e.target.checked })} className="accent-primary" />
                <label htmlFor="allday" className="text-sm font-montserrat">All day</label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold mb-1">Start</Label>
                <Input type={form.all_day ? "date" : "datetime-local"} value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1">End</Label>
                <Input type={form.all_day ? "date" : "datetime-local"} value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Location</Label>
              <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. APEC Plaza, Kwun Tong" />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="wareminder" checked={form.whatsapp_reminder} onChange={e => setForm({ ...form, whatsapp_reminder: e.target.checked })} className="accent-primary" />
              <label htmlFor="wareminder" className="text-sm font-montserrat">Enable WhatsApp Reminder (via Simpee Super Agent)</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.title || !form.start_date || saving} className="bg-primary hover:bg-primary/90">{saving ? "Saving..." : "Save Event"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}