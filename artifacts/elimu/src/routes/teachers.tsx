import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/teachers")({
  component: Teachers,
});

const teachers = [
  { name: "Adaeze Nwosu", dept: "Mathematics", classes: 5, status: "Active", email: "adaeze@greenfield.elimu.africa", phone: "+254 711 020 304" },
  { name: "James Mwangi", dept: "Sciences", classes: 4, status: "Active", email: "james@greenfield.elimu.africa", phone: "+254 722 113 992" },
  { name: "Fatima Hassan", dept: "Languages", classes: 6, status: "Active", email: "fatima@greenfield.elimu.africa", phone: "+254 700 555 188" },
  { name: "Peter Otieno", dept: "Physical Education", classes: 8, status: "On Leave", email: "peter@greenfield.elimu.africa", phone: "+254 733 909 122" },
  { name: "Grace Wambui", dept: "Humanities", classes: 5, status: "Active", email: "grace@greenfield.elimu.africa", phone: "+254 707 442 318" },
  { name: "Tunde Bello", dept: "ICT", classes: 3, status: "Active", email: "tunde@greenfield.elimu.africa", phone: "+254 712 882 410" },
];

function Teachers() {
  return (
    <DashboardShell
      title="Teachers"
      subtitle="87 staff across 9 departments"
      actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Add teacher</Button>}
    >
      <PageCard title="Staff directory">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t) => (
            <article key={t.email} className="rounded-2xl border border-border bg-background p-4">
              <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-primary-foreground" style={{ backgroundImage: "var(--gradient-hero)" }}>
                  {t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.dept}</div>
                </div>
                <span className={"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold " + (t.status === "Active" ? "bg-primary/10 text-primary" : "bg-gold/30 text-gold-foreground")}>{t.status}</span>
              </header>
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{t.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 shrink-0" /> {t.phone}</div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">Classes</span>
                <span className="font-semibold">{t.classes}</span>
              </div>
            </article>
          ))}
        </div>
      </PageCard>
    </DashboardShell>
  );
}
