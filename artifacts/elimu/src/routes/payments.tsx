import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard, StatCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Building2, Wallet, Plus, Download } from "lucide-react";

export const Route = createFileRoute("/payments")({
  component: Payments,
});

const txns = [
  { name: "Mary Otieno", item: "Term 2 fees · John Otieno", amt: "KES 32,000", method: "M-PESA", time: "12m ago" },
  { name: "Ibrahim Yusuf", item: "Transport · Amina Yusuf", amt: "KES 8,500", method: "Card", time: "32m ago" },
  { name: "Lucy Kamau", item: "Hostel · Brian Kamau", amt: "KES 18,000", method: "Bank", time: "1h ago" },
  { name: "Joseph Wairimu", item: "Examination · Esther W.", amt: "KES 2,500", method: "M-PESA", time: "2h ago" },
  { name: "Emeka Okafor", item: "Admission · Chinwe O.", amt: "KES 12,000", method: "Wallet", time: "4h ago" },
];

function Payments() {
  return (
    <DashboardShell
      title="Payments · RALD PAY"
      subtitle="Fees, transport, hostel, exams & events"
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>
          <Button variant="hero" size="sm"><Plus className="h-4 w-4" /> New invoice</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Collected (month)" value="KES 4.2M" trend="78% of target" icon={Wallet} tint="gold" />
        <StatCard label="Outstanding" value="KES 1.1M" icon={CreditCard} />
        <StatCard label="Successful txns" value="612" trend="+18 today" icon={Smartphone} />
        <StatCard label="Installments" value="142 active" icon={Building2} tint="royal" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <PageCard title="Recent transactions">
          <ul className="divide-y divide-border">
            {txns.map((t) => (
              <li key={t.name + t.time} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
                  {t.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.item}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-bold">{t.amt}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.method} · {t.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </PageCard>
        <PageCard title="Accepted methods">
          <ul className="space-y-2 text-sm">
            {["Cards (Visa, Mastercard)", "Mobile Money (M-PESA, Airtel, MoMo)", "Bank Transfer", "Wallets", "Installments"].map((m) => (
              <li key={m} className="rounded-lg bg-secondary px-3 py-2">{m}</li>
            ))}
          </ul>
        </PageCard>
      </div>
    </DashboardShell>
  );
}
