import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, AlertTriangle, TrendingDown, Languages } from "lucide-react";

export const Route = createFileRoute("/ai")({
  component: AI,
});

function AI() {
  return (
    <DashboardShell title="SEKANI AI" subtitle="Insights & assistant for educators">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <PageCard title="Ask SEKANI">
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Today's question</div>
            <div className="mt-1 text-lg font-semibold">"Which Form 2 students are at risk of dropout this term?"</div>

            <div className="mt-5 space-y-3 text-sm">
              {[
                { i: AlertTriangle, t: "7 students flagged in Form 2", d: "Attendance dropped >15% in last 4 weeks" },
                { i: TrendingDown, t: "3 students in Form 4", d: "Math & Physics scores down 22% vs term 1" },
                { i: AlertTriangle, t: "2 students in Form 1", d: "Missed 3 fee installments + low engagement" },
              ].map((r) => (
                <div key={r.t} className="flex gap-3 rounded-xl bg-secondary p-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-card text-primary"><r.i className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <div className="font-semibold">{r.t}</div>
                    <div className="text-xs text-muted-foreground">{r.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-background p-2">
              <Sparkles className="ml-2 h-4 w-4 text-primary" />
              <input placeholder="Ask anything about your school…" className="h-10 flex-1 bg-transparent px-2 text-sm outline-none" />
              <Button variant="hero" size="sm"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard title="Capabilities">
            <ul className="space-y-2 text-sm">
              {[
                "Academic assistant",
                "Performance insights",
                "Dropout risk detection",
                "Teacher workload analysis",
                "School health reports",
                "Attendance predictions",
                "Parent communication drafting",
              ].map((c) => (
                <li key={c} className="rounded-lg bg-secondary px-3 py-2">{c}</li>
              ))}
            </ul>
          </PageCard>
          <PageCard title="RALD Voice">
            <div className="flex items-center gap-3 text-sm">
              <Languages className="h-4 w-4 text-primary" />
              English · Swahili · Yoruba · Hausa · Igbo · Amharic · French · Arabic
            </div>
          </PageCard>
        </div>
      </div>
    </DashboardShell>
  );
}
