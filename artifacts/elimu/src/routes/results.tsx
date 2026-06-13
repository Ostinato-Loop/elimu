import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Download, FileText, Award, TrendingUp, Send } from "lucide-react";

export const Route = createFileRoute("/results")({
  component: Results,
});

const subjects = [
  { s: "Mathematics", avg: 72, top: "Brian Kamau (94)" },
  { s: "English", avg: 78, top: "Esther Wairimu (96)" },
  { s: "Kiswahili", avg: 81, top: "John Otieno (97)" },
  { s: "Biology", avg: 69, top: "Amina Yusuf (92)" },
  { s: "Chemistry", avg: 66, top: "Femi Adebayo (89)" },
  { s: "Physics", avg: 64, top: "Brian Kamau (91)" },
];

function Results() {
  return (
    <DashboardShell
      title="Results & Reports"
      subtitle="Form 3 · Term 2 · End-of-term"
      actions={
        <>
          <Button variant="outline" size="sm"><Send className="h-4 w-4" /> Email parents</Button>
          <Button variant="hero" size="sm"><Download className="h-4 w-4" /> Export PDFs</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { i: FileText, l: "Report cards generated", v: "423" },
          { i: Award, l: "Top performer", v: "Brian K. · 92%" },
          { i: TrendingUp, l: "Class average", v: "71.8%" },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><c.i className="h-4 w-4" /></div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.l}</div>
            </div>
            <div className="mt-3 text-2xl font-bold">{c.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <PageCard title="Subject performance">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <th className="py-3 pr-4">Subject</th>
                  <th className="py-3 pr-4">Class average</th>
                  <th className="py-3 pr-4">Top student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subjects.map((r) => (
                  <tr key={r.s}>
                    <td className="py-3 pr-4 font-semibold">{r.s}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full" style={{ width: r.avg + "%", backgroundImage: "var(--gradient-hero)" }} />
                        </div>
                        <span className="font-semibold">{r.avg}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{r.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>
      </div>
    </DashboardShell>
  );
}
