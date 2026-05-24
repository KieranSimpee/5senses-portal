import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import EmailSummaryWidget from "@/components/dashboard/EmailSummaryWidget";
import {
  FolderKanban, Receipt, FileText, Calendar,
  AlertCircle, CheckCircle2, ArrowRight, Sparkles,
  Building2, TrendingUp, Bell, ChevronRight, Clock } from
"lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isTomorrow, isPast, parseISO, differenceInDays } from "date-fns";

const statusColors = {
  planning: "bg-blue-100 text-blue-700",
  in_progress: "bg-primary/10 text-primary",
  on_hold: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500"
};

const HUB_SECTIONS = [
{ label: "5Senses Beauty", icon: "💄", desc: "Company docs, legal & HR", link: "/documents", color: "from-pink-500/10 to-rose-500/5 border-pink-200", bgImage: "https://media.base44.com/images/public/69edd16e877d6e4391ad74bd/f2471911b_BrandLogo1.png" },
{ label: "Simplex-ity", icon: "✨", desc: "Brand assets & IP", link: "/documents", color: "from-primary/10 to-purple-500/5 border-primary/20", bgImage: "https://media.base44.com/images/public/69edd16e877d6e4391ad74bd/5b19c5b2c_Simplex-ityTradeMarkHKCN.png" },
{ label: "Finance", icon: "💰", desc: "Expenses & invoices", link: "/expenses", color: "from-green-500/10 to-emerald-500/5 border-green-200" },
{ label: "Marketing", icon: "📢", desc: "Campaigns & assets", link: "/documents", color: "from-orange-500/10 to-amber-500/5 border-orange-200" },
{ label: "Agreements", icon: "🤝", desc: "Contracts & legal docs", link: "/documents", color: "from-blue-500/10 to-indigo-500/5 border-blue-200" },
{ label: "Calendar", icon: "📅", desc: "Events & reminders", link: "/calendar", color: "from-teal-500/10 to-cyan-500/5 border-teal-200" }];


export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
    base44.entities.Project.list("-updated_date", 10),
    base44.entities.Task.list("-due_date", 20),
    base44.entities.Expense.list("-date", 50),
    base44.entities.CalendarEvent.list("start_date", 20)]
    ).then(([p, t, e, ev]) => {
      setProjects(p);
      setTasks(t);
      setExpenses(e);
      setEvents(ev.filter((ev) => ev.start_date && !isPast(parseISO(ev.start_date))));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const activeProjects = projects.filter((p) => p.status === "in_progress").length;
  const overdueTasks = tasks.filter((t) => t.due_date && isPast(parseISO(t.due_date)) && t.status !== "done").length;
  const upcomingEvents = events.slice(0, 5);
  const urgentReminders = events.filter((ev) => {
    const days = differenceInDays(parseISO(ev.start_date), new Date());
    return days <= 30;
  }).slice(0, 4);

  const getHour = new Date().getHours();
  const greeting = getHour < 12 ? "Good morning" : getHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">

      {/* Hero Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 via-purple-500/5 to-background border border-primary/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative">
        {/* Brand Logos */}
        <div className="flex items-center gap-6 mb-5 flex-wrap">
          <img
              src="https://media.base44.com/images/public/69edd16e877d6e4391ad74bd/82337963a_image.png"
              alt="Simplex-ity & 5Senses logos"
              className="h-12 md:h-16 object-contain" />
            
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-montserrat font-bold text-primary tracking-widest uppercase">Command Hub</span>
        </div>
        <h1 className="font-exo text-3xl md:text-4xl font-bold text-foreground mb-1">{greeting}, Kieran 👋</h1>
        <p className="text-muted-foreground font-montserrat text-sm">
          {format(new Date(), "EEEE, MMMM d, yyyy")} · Simplex-ity by 5 Senses
        </p>

          {/* Quick Stats inline */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 bg-background/70 rounded-xl px-4 py-2 border border-border">
              <FolderKanban className="w-4 h-4 text-primary" />
              <span className="font-exo font-bold text-foreground">{loading ? "—" : activeProjects}</span>
              <span className="text-xs text-muted-foreground font-montserrat">Active Projects</span>
            </div>
            <div className="flex items-center gap-2 bg-background/70 rounded-xl px-4 py-2 border border-border">
              <Receipt className="w-4 h-4 text-green-600" />
              <span className="font-exo font-bold text-foreground">{loading ? "—" : `HKD ${totalSpent.toLocaleString()}`}</span>
              <span className="text-xs text-muted-foreground font-montserrat">Total Expenses</span>
            </div>
            {overdueTasks > 0 &&
            <div className="flex items-center gap-2 bg-red-50 rounded-xl px-4 py-2 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="font-exo font-bold text-red-600">{overdueTasks}</span>
                <span className="text-xs text-red-500 font-montserrat">Overdue</span>
              </div>
            }
            <div className="flex items-center gap-2 bg-background/70 rounded-xl px-4 py-2 border border-border">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="font-exo font-bold text-foreground">{loading ? "—" : upcomingEvents.length}</span>
              <span className="text-xs text-muted-foreground font-montserrat">Upcoming Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Sections */}
      <div>
        <h2 className="font-exo text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Hub Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {HUB_SECTIONS.map((s) =>
          <Link key={s.label} to={s.link}>
              <div
              className={`rounded-xl border bg-gradient-to-br ${s.color} p-3 hover:shadow-md transition-all cursor-pointer group h-full relative overflow-hidden flex flex-col justify-between gap-1`}>
              
                <div className="relative z-10 flex-1 flex items-center justify-center">
                  {s.bgImage ?
                <img src={s.bgImage} alt={s.label} className="w-full max-h-14 object-contain opacity-90" /> :

                <div className="text-2xl hidden">{s.icon}</div>
                }
                </div>
                <div className="relative z-10 mt-1">
                  <div className="font-exo font-semibold text-xs text-foreground group-hover:text-primary transition-colors leading-tight">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground font-montserrat leading-tight">{s.desc}</div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-exo text-base flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-primary" /> Recent Projects
                </CardTitle>
                <Link to="/projects" className="text-xs text-primary font-montserrat flex items-center gap-1 hover:underline">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ?
              <div className="text-sm text-muted-foreground font-montserrat py-4 text-center">Loading...</div> :
              projects.length === 0 ?
              <div className="text-sm text-muted-foreground font-montserrat py-4 text-center">
                  No projects yet. <Link to="/projects" className="text-primary underline">Add one</Link>
                </div> :

              projects.slice(0, 5).map((p) =>
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-montserrat font-medium text-sm text-foreground truncate">{p.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${statusColors[p.status] || ""}`}>
                          {p.status?.replace("_", " ")}
                        </span>
                        {p.due_date &&
                    <span className="text-[11px] text-muted-foreground">Due {format(parseISO(p.due_date), "MMM d")}</span>
                    }
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
              )
              }
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          {urgentReminders.length > 0 &&
          <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="font-exo text-base flex items-center gap-2 text-orange-700">
                  <Bell className="w-4 h-4" /> Upcoming Reminders (next 30 days)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {urgentReminders.map((ev) => {
                const date = parseISO(ev.start_date);
                const days = differenceInDays(date, new Date());
                return (
                  <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-orange-100">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-orange-600 leading-none">{format(date, "MMM").toUpperCase()}</span>
                        <span className="text-sm font-exo font-bold text-orange-600">{format(date, "d")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-montserrat font-medium text-sm text-foreground truncate">{ev.title}</div>
                        <div className="text-[11px] text-orange-500 font-montserrat mt-0.5">
                          {days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `In ${days} days`}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold font-montserrat capitalize">
                        {ev.event_type}
                      </span>
                    </div>);

              })}
              </CardContent>
            </Card>
          }
        </div>

        {/* Calendar Sidebar */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-exo text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Upcoming Events
                </CardTitle>
                <Link to="/calendar" className="text-xs text-primary font-montserrat flex items-center gap-1 hover:underline">
                  Calendar <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ?
              <div className="text-sm text-muted-foreground font-montserrat">Loading...</div> :
              upcomingEvents.length === 0 ?
              <div className="text-sm text-muted-foreground font-montserrat py-4 text-center">No upcoming events</div> :

              upcomingEvents.map((ev) => {
                const date = parseISO(ev.start_date);
                const label = isToday(date) ? "Today" : isTomorrow(date) ? "Tomorrow" : format(date, "MMM d, yyyy");
                return (
                  <div key={ev.id} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary leading-none">{format(date, "MMM").toUpperCase()}</span>
                        <span className="text-sm font-exo font-bold text-primary">{format(date, "d")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-montserrat font-medium text-sm text-foreground line-clamp-2">{ev.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
                      </div>
                    </div>);

              })
              }
            </CardContent>
          </Card>

          <EmailSummaryWidget />

          {/* Tasks due soon */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-exo text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Tasks Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ?
              <div className="text-sm text-muted-foreground font-montserrat">Loading...</div> :
              tasks.filter((t) => t.due_date && t.status !== "done").slice(0, 4).length === 0 ?
              <div className="text-sm text-muted-foreground font-montserrat py-2 text-center">All clear!</div> :

              tasks.filter((t) => t.due_date && t.status !== "done").slice(0, 4).map((t) => {
                const due = parseISO(t.due_date);
                const overdue = isPast(due);
                return (
                  <div key={t.id} className={`flex items-center gap-2 p-2 rounded-lg ${overdue ? "bg-red-50 border border-red-100" : "bg-secondary/50"}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${overdue ? "text-red-400" : "text-primary"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-montserrat text-xs font-medium text-foreground truncate">{t.title}</div>
                        <div className={`text-[10px] ${overdue ? "text-red-500" : "text-muted-foreground"}`}>
                          {overdue ? "Overdue · " : "Due · "}{format(due, "MMM d")}
                        </div>
                      </div>
                    </div>);

              })
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}