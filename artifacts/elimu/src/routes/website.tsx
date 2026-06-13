import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Plus } from "lucide-react";

export const Route = createFileRoute("/website")({
  component: Website,
});

function Website() {
  return (
    <DashboardShell
      title="School Website"
      subtitle="greenfield.elimu.africa · published"
      actions={
        <>
          <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4" /> Visit site</Button>
          <Button variant="hero" size="sm">Edit site</Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <PageCard title="Site preview">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2 text-xs font-mono text-muted-foreground">
              <Globe className="h-3.5 w-3.5" /> greenfield.elimu.africa
            </div>
            <div className="p-8 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Welcome</div>
              <h3 className="mt-3 text-2xl font-bold">Greenfield Academy</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Nurturing tomorrow's leaders through excellence in education, character and community since 1998.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Home", "About", "Admissions", "Results Portal", "Gallery", "News", "Contact", "Events", "Staff"].map((p) => (
                  <span key={p} className="rounded-full border border-border px-3 py-1 text-xs">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard title="Pages">
            <ul className="space-y-2 text-sm">
              {["Homepage", "About", "Admissions", "Results Portal", "Gallery", "News", "Contact", "Events", "Staff Directory"].map((p) => (
                <li key={p} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                  <span>{p}</span>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
                </li>
              ))}
            </ul>
            <Button variant="hero" size="sm" className="mt-4 w-full"><Plus className="h-4 w-4" /> New page</Button>
          </PageCard>
        </div>
      </div>
    </DashboardShell>
  );
}
