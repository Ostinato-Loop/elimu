import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Users, UserCog, CalendarCheck, CreditCard, Mail, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <DashboardShell
      title="School Dashboard"
      subtitle="Greenfield Academy · Term 2"
      actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Quick add</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value="1,284" trend="+34 this term" icon={Users} />
        <StatCard label="Teachers" value="87" trend="3 onboarding" icon={UserCog} tint="royal" />
        <StatCard label="Attendance" value="96.4%" trend="+2.1% vs last week" icon={CalendarCheck} />
        <StatCard label="Fees Collected" value="KES 4.2M" trend="78% of term target" icon={CreditCard} tint="gold" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PageCard title="Recent activity">
            <ul className="divide-y divide-border">
              {[
                { who: "Ms. Adaeze", what: "posted end-of-term results for Form 3 Math", when: "12m ago" },
                { who: "Bursar", what: "received KES 84,000 in fees from 12 parents", when: "1h ago" },
                { who: "System", what: "provisioned 23 new student mailboxes", when: "3h ago" },
                { who: "Principal", what: "sent announcement to all parents", when: "5h ago" },
                { who: "Mr. Otieno", what: "marked attendance for Form 2B (42/42)", when: "yesterday" },
              ].map((r, i) => (
                <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <span className="font-semibold">{r.who}</span>{" "}
                    <span className="text-muted-foreground">{r.what}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{r.when}</span>
                </li>
              ))}
            </ul>
          </PageCard>
        </div>

        <div className="space-y-4">
          <PageCard title="System health">
            <ul className="space-y-3 text-sm">
              {[
                { l: "RALD Mail", s: "Operational" },
                { l: "RALD Pay", s: "Operational" },
                { l: "School Website", s: "Operational" },
                { l: "SEKANI AI", s: "Operational" },
              ].map((s) => (
                <li key={s.l} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{s.l}</span>
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary" /> {s.s}
                  </span>
                </li>
              ))}
            </ul>
          </PageCard>
          <PageCard title="Email usage">
            <div className="text-sm text-muted-foreground">Mailboxes</div>
            <div className="mt-1 text-2xl font-bold">1,371 <span className="text-base font-medium text-muted-foreground">/ 5,000</span></div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[27%]" style={{ backgroundImage: "var(--gradient-hero)" }} />
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full"><Mail className="h-4 w-4" /> Manage mailboxes</Button>
          </PageCard>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="Announcements" action={<Button variant="ghost" size="sm">New</Button>}>
          <ul className="space-y-3 text-sm">
            {[
              { t: "Mid-term break schedule", d: "Posted to all parents · 421 views" },
              { t: "Sports day rescheduled to Saturday", d: "Posted to Form 1–4 · 198 views" },
              { t: "Fee reminder — installment 2", d: "SMS + Email · 612 recipients" },
            ].map((a) => (
              <li key={a.t} className="rounded-xl bg-secondary px-4 py-3">
                <div className="font-semibold">{a.t}</div>
                <div className="text-xs text-muted-foreground">{a.d}</div>
              </li>
            ))}
          </ul>
        </PageCard>
        <PageCard title="Upcoming">
          <ul className="space-y-3 text-sm">
            {[
              { d: "Mon 12", t: "Form 4 Mock Exams begin" },
              { d: "Wed 14", t: "Parents-Teacher meeting (Lower Primary)" },
              { d: "Fri 16", t: "Inter-house athletics" },
              { d: "Mon 19", t: "Term break starts" },
            ].map((e) => (
              <li key={e.t} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <div className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {e.d}
                </div>
                <div className="truncate">{e.t}</div>
              </li>
            ))}
          </ul>
        </PageCard>
      </div>
    </DashboardShell>
  );
}
