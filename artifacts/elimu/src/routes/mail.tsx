import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Plus, Upload, KeyRound, Mail } from "lucide-react";

export const Route = createFileRoute("/mail")({
  component: MailAdmin,
});

const boxes = [
  { n: "John Otieno", e: "john@greenfield.elimu.africa", r: "Student · Form 3" },
  { n: "Mary Achieng", e: "mary@greenfield.elimu.africa", r: "Student · Form 1" },
  { n: "James Mwangi", e: "principal@greenfield.elimu.africa", r: "Principal" },
  { n: "Adaeze Nwosu", e: "adaeze@greenfield.elimu.africa", r: "Teacher · Mathematics" },
  { n: "Fatima Hassan", e: "fatima@greenfield.elimu.africa", r: "Teacher · Languages" },
  { n: "Bursar's Office", e: "bursar@greenfield.elimu.africa", r: "Department" },
];

function MailAdmin() {
  return (
    <DashboardShell
      title="RALD Mail"
      subtitle="Email for students, teachers, departments and alumni"
      actions={
        <>
          <Button variant="outline" size="sm"><Upload className="h-4 w-4" /> Bulk CSV</Button>
          <Button variant="hero" size="sm"><Plus className="h-4 w-4" /> New mailbox</Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <PageCard title="Mailboxes (1,371)">
          <ul className="divide-y divide-border">
            {boxes.map((m) => (
              <li key={m.e} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-primary">
                  {m.n.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{m.n}</div>
                  <div className="truncate text-xs text-muted-foreground">{m.e}</div>
                </div>
                <div className="hidden shrink-0 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground sm:block">
                  {m.r}
                </div>
              </li>
            ))}
          </ul>
        </PageCard>

        <div className="space-y-4">
          <PageCard title="Domains">
            <ul className="space-y-2 font-mono text-sm">
              <li className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <span>greenfield.elimu.africa</span>
                <span className="text-xs text-primary">Primary</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <span>greenfield.sc.ke</span>
                <span className="text-xs text-muted-foreground">Verifying</span>
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-3 w-full"><Plus className="h-4 w-4" /> Add domain</Button>
          </PageCard>
          <PageCard title="Quick actions">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2"><KeyRound className="h-4 w-4 text-primary" /> Reset password</li>
              <li className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2"><Mail className="h-4 w-4 text-primary" /> Create email group</li>
              <li className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2"><Upload className="h-4 w-4 text-primary" /> Provision class</li>
            </ul>
          </PageCard>
        </div>
      </div>
    </DashboardShell>
  );
}
