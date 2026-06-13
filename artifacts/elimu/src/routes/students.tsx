import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Plus, Download, Search } from "lucide-react";

export const Route = createFileRoute("/students")({
  component: Students,
});

const students = [
  { adm: "GFA/2024/0431", name: "John Otieno", class: "Form 3 B", guardian: "Mary Otieno", email: "john@greenfield.elimu.africa", status: "Active" },
  { adm: "GFA/2024/0432", name: "Amina Yusuf", class: "Form 1 A", guardian: "Ibrahim Yusuf", email: "amina@greenfield.elimu.africa", status: "Active" },
  { adm: "GFA/2023/0218", name: "Brian Kamau", class: "Form 4 C", guardian: "Lucy Kamau", email: "brian@greenfield.elimu.africa", status: "Active" },
  { adm: "GFA/2024/0501", name: "Chinwe Okafor", class: "Form 2 A", guardian: "Emeka Okafor", email: "chinwe@greenfield.elimu.africa", status: "Pending" },
  { adm: "GFA/2022/0103", name: "David Mensah", class: "Form 4 B", guardian: "Akua Mensah", email: "david@greenfield.elimu.africa", status: "Active" },
  { adm: "GFA/2024/0445", name: "Esther Wairimu", class: "Form 1 C", guardian: "Joseph Wairimu", email: "esther@greenfield.elimu.africa", status: "Active" },
  { adm: "GFA/2023/0277", name: "Femi Adebayo", class: "Form 3 A", guardian: "Tunde Adebayo", email: "femi@greenfield.elimu.africa", status: "Alumni" },
];

const statusCls: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Pending: "bg-gold/20 text-gold-foreground",
  Alumni: "bg-secondary text-muted-foreground",
};

function Students() {
  return (
    <DashboardShell
      title="Students"
      subtitle="1,284 enrolled · 34 new this term"
      actions={
        <>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex"><Download className="h-4 w-4" /> Export</Button>
          <Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Add student</Button>
        </>
      }
    >
      <PageCard
        title="All students"
        action={
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search by name or admission no." className="h-9 w-72 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <th className="py-3 pr-4">Adm No.</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Class</th>
                <th className="hidden py-3 pr-4 sm:table-cell">Guardian</th>
                <th className="hidden py-3 pr-4 md:table-cell">Email</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <tr key={s.adm} className="hover:bg-secondary/40">
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{s.adm}</td>
                  <td className="py-3 pr-4 font-semibold">{s.name}</td>
                  <td className="py-3 pr-4">{s.class}</td>
                  <td className="hidden py-3 pr-4 text-muted-foreground sm:table-cell">{s.guardian}</td>
                  <td className="hidden py-3 pr-4 font-mono text-xs text-muted-foreground md:table-cell">{s.email}</td>
                  <td className="py-3 pr-4">
                    <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold " + (statusCls[s.status] ?? "bg-secondary")}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageCard>
    </DashboardShell>
  );
}
