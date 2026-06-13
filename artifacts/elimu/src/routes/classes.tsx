import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

export const Route = createFileRoute("/classes")({
  component: Classes,
});

const groups = [
  {
    title: "Lower Primary",
    items: [
      { name: "Grade 1", streams: 3, count: 96 },
      { name: "Grade 2", streams: 3, count: 102 },
      { name: "Grade 3", streams: 3, count: 110 },
    ],
  },
  {
    title: "Upper Primary",
    items: [
      { name: "Grade 4", streams: 3, count: 118 },
      { name: "Grade 5", streams: 3, count: 121 },
      { name: "Grade 6", streams: 3, count: 117 },
    ],
  },
  {
    title: "Secondary",
    items: [
      { name: "Form 1", streams: 3, count: 142 },
      { name: "Form 2", streams: 3, count: 138 },
      { name: "Form 3", streams: 3, count: 130 },
      { name: "Form 4", streams: 3, count: 110 },
    ],
  },
];

function Classes() {
  return (
    <DashboardShell
      title="Classes & Programs"
      subtitle="Streams, departments, faculties and semesters"
      actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Create class</Button>}
    >
      <div className="space-y-6">
        {groups.map((g) => (
          <PageCard key={g.title} title={g.title}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {g.items.map((c) => (
                <div key={c.name} className="rounded-2xl border border-border bg-background p-4">
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.streams} streams</div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{c.count}</span>
                    <span className="text-muted-foreground">students</span>
                  </div>
                </div>
              ))}
            </div>
          </PageCard>
        ))}
      </div>
    </DashboardShell>
  );
}
