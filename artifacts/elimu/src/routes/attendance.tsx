import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard, StatCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { QrCode, Fingerprint, Smartphone, CheckCircle2, XCircle, Clock, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/attendance")({
  component: Attendance,
});

const today = [
  { class: "Form 1 A", present: 41, absent: 1, late: 0, teacher: "Ms. Adaeze" },
  { class: "Form 1 B", present: 39, absent: 3, late: 1, teacher: "Mr. Mwangi" },
  { class: "Form 2 A", present: 42, absent: 0, late: 0, teacher: "Ms. Fatima" },
  { class: "Form 2 B", present: 38, absent: 2, late: 2, teacher: "Mr. Otieno" },
  { class: "Form 3 A", present: 40, absent: 2, late: 0, teacher: "Ms. Grace" },
  { class: "Form 3 B", present: 36, absent: 5, late: 1, teacher: "Mr. Tunde" },
];

function Attendance() {
  return (
    <DashboardShell
      title="Attendance"
      subtitle="Live attendance across all classes"
      actions={<Button variant="hero" size="sm"><QrCode className="h-4 w-4" /> Start check-in</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today" value="96.4%" trend="+2.1% vs yesterday" icon={CheckCircle2} />
        <StatCard label="Present" value="1,238" icon={CheckCircle2} />
        <StatCard label="Absent" value="32" icon={XCircle} tint="gold" />
        <StatCard label="Late" value="14" icon={Clock} tint="royal" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <PageCard title="Class roll · today">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <th className="py-3 pr-4">Class</th>
                  <th className="py-3 pr-4">Teacher</th>
                  <th className="py-3 pr-4">Present</th>
                  <th className="py-3 pr-4">Absent</th>
                  <th className="py-3 pr-4">Late</th>
                  <th className="py-3 pr-4">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {today.map((c) => {
                  const total = c.present + c.absent + c.late;
                  const rate = Math.round((c.present / total) * 100);
                  return (
                    <tr key={c.class}>
                      <td className="py-3 pr-4 font-semibold">{c.class}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{c.teacher}</td>
                      <td className="py-3 pr-4 text-primary">{c.present}</td>
                      <td className="py-3 pr-4">{c.absent}</td>
                      <td className="py-3 pr-4">{c.late}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full" style={{ width: rate + "%", backgroundImage: "var(--gradient-hero)" }} />
                          </div>
                          <span className="text-xs font-semibold">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </PageCard>

        <div className="space-y-4">
          <PageCard title="Check-in modes">
            <ul className="space-y-2 text-sm">
              {[
                { i: CheckCircle2, l: "Manual roll-call" },
                { i: QrCode, l: "QR code scan" },
                { i: Smartphone, l: "Mobile check-in" },
                { i: Fingerprint, l: "Biometric (ready)" },
                { i: CalendarCheck, l: "Offline mode" },
              ].map((m) => (
                <li key={m.l} className="flex items-center gap-3 rounded-lg bg-secondary px-3 py-2">
                  <m.i className="h-4 w-4 text-primary" />
                  <span>{m.l}</span>
                </li>
              ))}
            </ul>
          </PageCard>
        </div>
      </div>
    </DashboardShell>
  );
}
