import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Megaphone, Mail, MessageSquare, Bell, Send } from "lucide-react";

export const Route = createFileRoute("/communication")({
  component: Communication,
});

function Communication() {
  return (
    <DashboardShell
      title="Communication Hub"
      subtitle="Announcements, SMS, email & push — powered by RALD Notify & RALD Mail"
      actions={<Button variant="hero" size="sm"><Send className="h-4 w-4" /> New broadcast</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <PageCard title="Compose announcement">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <select className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                <option>Audience: All parents</option>
                <option>All teachers</option>
                <option>Form 1 only</option>
                <option>Form 4 only</option>
                <option>Boarders</option>
              </select>
              <select className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                <option>Channels: SMS + Email + Push</option>
                <option>SMS only</option>
                <option>Email only</option>
                <option>Push only</option>
              </select>
            </div>
            <input placeholder="Subject" className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" />
            <textarea rows={6} placeholder="Type your announcement…" className="w-full rounded-xl border border-border bg-background p-3 text-sm" />
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Reaches ~1,042 parents</div>
              <Button variant="hero" size="sm">Send now</Button>
            </div>
          </div>
        </PageCard>

        <PageCard title="Channels">
          <ul className="space-y-2 text-sm">
            {[
              { i: Megaphone, l: "Announcements", c: "421 this term" },
              { i: MessageSquare, l: "SMS", c: "2,841 sent" },
              { i: Mail, l: "Email", c: "5,210 sent" },
              { i: Bell, l: "Push notifications", c: "12,098 sent" },
            ].map((c) => (
              <li key={c.l} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                <span className="inline-flex items-center gap-2"><c.i className="h-4 w-4 text-primary" /> {c.l}</span>
                <span className="text-xs text-muted-foreground">{c.c}</span>
              </li>
            ))}
          </ul>
        </PageCard>
      </div>
    </DashboardShell>
  );
}
