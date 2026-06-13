import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/timetable")({
  component: Timetable,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = ["8:00", "9:00", "10:00", "11:30", "12:30", "14:00", "15:00"];
const subjects = ["Math", "English", "Biology", "Kiswahili", "Chemistry", "Physics", "History", "PE", "ICT", "Geography"];

function Timetable() {
  return (
    <DashboardShell
      title="Timetable"
      subtitle="Form 3 A · Term 2"
      actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> New slot</Button>}
    >
      <PageCard title="Weekly schedule">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2 text-xs">
              <div />
              {days.map((d) => (
                <div key={d} className="rounded-lg bg-secondary py-2 text-center font-semibold">{d}</div>
              ))}
              {periods.map((p, pi) => (
                <div key={p} className="contents">
                  <div className="flex items-center justify-end pr-2 text-muted-foreground">{p}</div>
                  {days.map((d, di) => {
                    const subj = subjects[(pi * 5 + di) % subjects.length];
                    return (
                      <div key={d + p} className="rounded-lg border border-border bg-background p-2">
                        <div className="text-[11px] font-semibold">{subj}</div>
                        <div className="text-[10px] text-muted-foreground">Rm {100 + ((pi + di) % 9)}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageCard>
    </DashboardShell>
  );
}
