import { Link, useRouterState } from "@tanstack/react-router";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCog,
  School,
  CalendarCheck,
  ClipboardList,
  CalendarRange,
  Heart,
  MessageSquare,
  CreditCard,
  Mail,
  Globe,
  Sparkles,
  Building2,
  Settings,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/teachers", label: "Teachers", icon: UserCog },
  { to: "/classes", label: "Classes", icon: School },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/results", label: "Results", icon: ClipboardList },
  { to: "/timetable", label: "Timetable", icon: CalendarRange },
  { to: "/parents", label: "Parent Portal", icon: Heart },
  { to: "/communication", label: "Communication", icon: MessageSquare },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/mail", label: "RALD Mail", icon: Mail },
  { to: "/website", label: "School Website", icon: Globe },
  { to: "/university", label: "University Mode", icon: Building2 },
  { to: "/ai", label: "SEKANI AI", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <Link to="/dashboard" className="flex items-center gap-2 border-b border-border px-5 py-4">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-sm font-bold tracking-tight">RALD ELIMU</div>
            <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
              greenfield.elimu.africa
            </div>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Workspace
          </div>
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                      (active
                        ? "bg-secondary font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")
                    }
                  >
                    <Icon className={"h-4 w-4 shrink-0 " + (active ? "text-primary" : "")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-primary">
              JM
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-semibold">J. Mwangi</div>
              <div className="truncate text-xs text-muted-foreground">Principal</div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Link to="/dashboard" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground lg:hidden" style={{ backgroundImage: "var(--gradient-hero)" }}>
                <GraduationCap className="h-5 w-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
                {subtitle && (
                  <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search…"
                  className="h-10 w-64 rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </button>
              {actions}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <nav className="sticky bottom-0 z-30 border-t border-border bg-card lg:hidden">
          <div className="grid grid-cols-5">
            {nav.slice(0, 5).map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    "flex flex-col items-center gap-1 py-2 text-[10px] font-medium " +
                    (active ? "text-primary" : "text-muted-foreground")
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  tint = "primary",
}: {
  label: string;
  value: string;
  trend?: string;
  icon: typeof Users;
  tint?: "primary" | "royal" | "gold";
}) {
  const tintCls =
    tint === "royal" ? "bg-royal/10 text-royal" : tint === "gold" ? "bg-gold/20 text-gold-foreground" : "bg-primary/10 text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className={"grid h-9 w-9 place-items-center rounded-xl " + tintCls}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      {trend && <div className="mt-1 text-xs font-medium text-primary">{trend}</div>}
    </div>
  );
}

export function PageCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-4">
        <h2 className="truncate text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
        {action}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
