import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DashboardShell, StatCard, PageCard } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Users, UserCog, CalendarCheck, CreditCard, Mail, Plus, Loader2 } from "lucide-react";
import { api } from "@/lib/api/client";

type UserRecord = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
};

type SchoolSummary = {
  id: string;
  name: string;
  type: string;
  country: string;
  city: string | null;
};

type DashboardData = {
  schoolId: string;
  school: SchoolSummary;
  stats: {
    totalStudents: number;
    totalStaff: number;
    totalClasses: number;
    totalParents: number;
    attendanceRateToday: number | null;
    outstandingFees: number;
    recentPayments: number;
  };
  recentAnnouncements: Array<{
    id: string;
    title: string;
    body: string | null;
    publishedAt: string | null;
  }>;
  attendanceByClass: Array<{
    classId: string;
    className: string;
    attendanceRate: number;
    date: string;
  }>;
  recentPaymentsList: Array<{
    id: string;
    amountPaid: number;
    status: string;
    createdAt: string;
  }>;
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `KES ${(n / 1_000).toFixed(0)}K`;
  return `KES ${n.toLocaleString()}`;
}

function Dashboard() {
  const navigate = useNavigate();

  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => api.get<{ user: UserRecord | null }>("/auth/user"),
    retry: false,
  });

  const { data: schoolsData, isLoading: schoolsLoading } = useQuery({
    queryKey: ["my-schools"],
    queryFn: () => api.get<{ schools: SchoolSummary[] }>("/my/schools"),
    enabled: !!authData?.user,
  });

  const school = schoolsData?.schools?.[0];

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ["dashboard", school?.id],
    queryFn: () => api.get<DashboardData>(`/schools/${school!.id}/dashboard`),
    enabled: !!school?.id,
  });

  useEffect(() => {
    if (!authLoading && authData?.user === null) {
      window.location.href = "/api/login?returnTo=/dashboard";
    }
  }, [authLoading, authData]);

  useEffect(() => {
    if (!schoolsLoading && schoolsData?.schools?.length === 0) {
      navigate({ to: "/onboarding" });
    }
  }, [schoolsLoading, schoolsData, navigate]);

  const isLoading = authLoading || (!!authData?.user && schoolsLoading) || (!!school && dashLoading);

  if (isLoading || (!authData?.user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = dashData?.stats;
  const schoolName = school?.name ?? "Your School";
  const schoolCity = school?.city ?? school?.country ?? "";

  return (
    <DashboardShell
      title="School Dashboard"
      subtitle={`${schoolName}${schoolCity ? " · " + schoolCity : ""}`}
      actions={<Button variant="hero" size="sm"><Plus className="h-4 w-4" /> Quick add</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Students"
          value={stats ? stats.totalStudents.toLocaleString() : "—"}
          trend={`${stats?.totalClasses ?? 0} classes`}
          icon={Users}
        />
        <StatCard
          label="Teachers"
          value={stats ? stats.totalStaff.toString() : "—"}
          trend="Active staff"
          icon={UserCog}
          tint="royal"
        />
        <StatCard
          label="Attendance"
          value={stats?.attendanceRateToday != null ? `${stats.attendanceRateToday}%` : "—"}
          trend="Today"
          icon={CalendarCheck}
        />
        <StatCard
          label="Outstanding Fees"
          value={stats ? fmtCurrency(stats.outstandingFees) : "—"}
          trend={`${stats?.recentPayments ?? 0} recent payments`}
          icon={CreditCard}
          tint="gold"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PageCard title="Recent announcements">
            {dashData?.recentAnnouncements && dashData.recentAnnouncements.length > 0 ? (
              <ul className="divide-y divide-border">
                {dashData.recentAnnouncements.map((a) => (
                  <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm">
                    <div className="min-w-0">
                      <span className="font-semibold">{a.title}</span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No announcements yet.</p>
            )}
          </PageCard>
        </div>

        <div className="space-y-4">
          <PageCard title="Attendance by class">
            {dashData?.attendanceByClass && dashData.attendanceByClass.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {dashData.attendanceByClass.slice(0, 5).map((c) => (
                  <li key={c.classId} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{c.className}</span>
                    <span className="font-semibold text-primary">{c.attendanceRate}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">No attendance today.</p>
            )}
          </PageCard>
          <PageCard title="Email usage">
            <div className="text-sm text-muted-foreground">Mailboxes</div>
            <div className="mt-1 text-2xl font-bold">
              {stats?.totalStudents ?? 0}{" "}
              <span className="text-base font-medium text-muted-foreground">/ 5,000</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full"
                style={{
                  width: `${Math.min(100, ((stats?.totalStudents ?? 0) / 5000) * 100)}%`,
                  backgroundImage: "var(--gradient-hero)",
                }}
              />
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              <Mail className="h-4 w-4" /> Manage mailboxes
            </Button>
          </PageCard>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="Fee payments" action={<Button variant="ghost" size="sm">View all</Button>}>
          {dashData?.recentPaymentsList && dashData.recentPaymentsList.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {dashData.recentPaymentsList.map((p) => (
                <li key={p.id} className="rounded-xl bg-secondary px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{fmtCurrency(p.amountPaid)}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs capitalize text-muted-foreground">{p.status}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No payment records yet.</p>
          )}
        </PageCard>

        <PageCard title="Class overview">
          {dashData?.attendanceByClass && dashData.attendanceByClass.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {dashData.attendanceByClass.slice(0, 4).map((c) => (
                <li key={c.classId} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <div className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {c.attendanceRate}%
                  </div>
                  <div className="truncate">{c.className}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No classes set up yet.</p>
          )}
        </PageCard>
      </div>
    </DashboardShell>
  );
}
