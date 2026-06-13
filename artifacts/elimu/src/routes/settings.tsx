import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <DashboardShell title="Settings" subtitle="Institution, billing, integrations and security">
      <div className="grid gap-4 lg:grid-cols-2">
        <PageCard title="Institution">
          <div className="space-y-3 text-sm">
            <Row k="School name" v="Greenfield Academy" />
            <Row k="Type" v="Secondary" />
            <Row k="Country" v="Kenya" />
            <Row k="Academic calendar" v="3 Terms (Jan – Dec)" />
            <Row k="Subdomain" v="greenfield.elimu.africa" />
            <Row k="Custom domain" v="greenfield.sc.ke (verifying)" />
          </div>
          <Button variant="outline" size="sm" className="mt-4">Edit institution</Button>
        </PageCard>

        <PageCard title="Plan">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">ELIMU Free</div>
            <div className="mt-1 text-2xl font-bold">$0 <span className="text-sm font-medium text-muted-foreground">forever</span></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Core platform free for every African school. Optional add-ons available for SMS bundles and premium AI.
            </p>
          </div>
        </PageCard>

        <PageCard title="Roles & permissions">
          <ul className="space-y-2 text-sm">
            {[
              { r: "Principal", c: 1 },
              { r: "Administrator", c: 4 },
              { r: "Teacher", c: 87 },
              { r: "Bursar", c: 2 },
              { r: "Parent", c: 1042 },
              { r: "Student", c: 1284 },
            ].map((r) => (
              <li key={r.r} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <span>{r.r}</span>
                <span className="text-xs text-muted-foreground">{r.c} users</span>
              </li>
            ))}
          </ul>
        </PageCard>

        <PageCard title="Security">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between"><span>Two-factor authentication</span><span className="text-primary">Enabled</span></li>
            <li className="flex items-center justify-between"><span>Single sign-on (SSO)</span><span className="text-muted-foreground">Available</span></li>
            <li className="flex items-center justify-between"><span>Session timeout</span><span className="text-muted-foreground">30 min</span></li>
            <li className="flex items-center justify-between"><span>Audit logs</span><span className="text-primary">On</span></li>
          </ul>
        </PageCard>
      </div>
    </DashboardShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
