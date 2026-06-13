import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, CreditCard, BookOpen } from "lucide-react";

export const Route = createFileRoute("/parents")({
  component: Parents,
});

function Parents() {
  return (
    <DashboardShell title="Parent Portal" subtitle="Engagement, messaging and payments">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { i: Heart, l: "Active parents", v: "1,042" },
          { i: MessageSquare, l: "Messages this week", v: "318" },
          { i: CreditCard, l: "Fee payments (mo.)", v: "612" },
          { i: BookOpen, l: "Report downloads", v: "287" },
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="Recent parent messages">
          <ul className="divide-y divide-border">
            {[
              { p: "Mary Otieno", c: "Can John take his medication after lunch?", w: "12m" },
              { p: "Ibrahim Yusuf", c: "Confirming Amina will join the trip next Friday.", w: "1h" },
              { p: "Lucy Kamau", c: "Please share Brian's latest Math report.", w: "3h" },
              { p: "Joseph Wairimu", c: "Paid the Term 2 transport fee — see receipt.", w: "5h" },
            ].map((m) => (
              <li key={m.p} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{m.p}</div>
                  <div className="text-xs text-muted-foreground">{m.w}</div>
                </div>
                <div className="text-sm text-muted-foreground">{m.c}</div>
              </li>
            ))}
          </ul>
        </PageCard>
        <PageCard title="Parents can…">
          <ul className="grid grid-cols-2 gap-3 text-sm">
            {["Track attendance","View results","Receive notifications","Pay fees","Message teachers","Monitor progress","View timetables","Download reports"].map((f) => (
              <li key={f} className="rounded-lg bg-secondary px-3 py-2">{f}</li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-4 w-full">Open parent app preview</Button>
        </PageCard>
      </div>
    </DashboardShell>
  );
}
