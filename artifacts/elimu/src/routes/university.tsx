import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, FileText, BookOpenCheck } from "lucide-react";

export const Route = createFileRoute("/university")({
  component: University,
});

function University() {
  return (
    <DashboardShell title="University Mode" subtitle="Faculties, programs, CGPA & research" actions={<Button variant="hero" size="sm">Enable for institution</Button>}>
      <div className="grid gap-4 lg:grid-cols-2">
        <PageCard title="Faculties">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { f: "Faculty of Science", d: "12 departments · 6,420 students" },
              { f: "Faculty of Arts", d: "9 departments · 4,118 students" },
              { f: "Business School", d: "5 departments · 2,994 students" },
              { f: "Faculty of Engineering", d: "8 departments · 3,712 students" },
            ].map((f) => (
              <li key={f.f} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /><span className="font-semibold">{f.f}</span></div>
                <div className="mt-1 text-xs text-muted-foreground">{f.d}</div>
              </li>
            ))}
          </ul>
        </PageCard>

        <PageCard title="University features">
          <ul className="grid gap-3 sm:grid-cols-2 text-sm">
            {[
              { i: GraduationCap, l: "Course Registration" },
              { i: FileText, l: "Transcript Generation" },
              { i: BookOpenCheck, l: "CGPA & Grading" },
              { i: Building2, l: "Faculty Portals" },
              { i: GraduationCap, l: "Graduation Workflows" },
              { i: BookOpenCheck, l: "Research Management" },
            ].map((f) => (
              <li key={f.l} className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2">
                <f.i className="h-4 w-4 text-primary" /> {f.l}
              </li>
            ))}
          </ul>
        </PageCard>
      </div>
    </DashboardShell>
  );
}
