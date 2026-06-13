import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  CalendarCheck,
  ClipboardList,
  CalendarRange,
  Heart,
  Mail,
  Globe,
  CreditCard,
  BookOpen,
  MessageSquare,
  Check,
  ArrowRight,
  Sparkles,
  Menu,
  ShieldCheck,
  Smartphone,
  Languages,
} from "lucide-react";
import heroImg from "@/assets/elimu-hero.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Users, title: "Student Management", desc: "Profiles, admissions, history, health & documents in one timeline." },
  { icon: GraduationCap, title: "Teacher Management", desc: "Departments, subjects, payroll status, performance & attendance." },
  { icon: CalendarCheck, title: "Attendance", desc: "Manual, QR, NFC, biometric-ready, offline-first mobile check-in." },
  { icon: ClipboardList, title: "Results & Reports", desc: "Report cards, transcripts, rankings — PDF export & email delivery." },
  { icon: CalendarRange, title: "Timetable", desc: "Classes, streams, semesters, programs — all scheduled cleanly." },
  { icon: Heart, title: "Parent Portal", desc: "Track attendance, pay fees, message teachers, monitor progress." },
  { icon: Mail, title: "Student Email", desc: "name@school.elimu.africa or your own domain. Bulk provisioning." },
  { icon: Globe, title: "School Website", desc: "A free, mobile-optimized site for every school — no coding." },
  { icon: CreditCard, title: "School Payments", desc: "Cards, mobile money, bank, wallets, installments — receipts auto." },
  { icon: BookOpen, title: "Learning Tools", desc: "Course units, assignments, gradebooks, university-grade workflows." },
  { icon: MessageSquare, title: "Communication Hub", desc: "Announcements, SMS, email, push — class, parent & emergency groups." },
  { icon: Sparkles, title: "SEKANI AI", desc: "Insights, dropout risk, performance & communication drafting." },
];

const institutions = [
  "Nursery", "Primary", "Secondary", "College", "Polytechnic",
  "University", "Training Institute", "Religious School", "Government", "Private",
];

const steps = [
  { n: "01", t: "Choose institution type", d: "Nursery, Primary, Secondary, University or Training Center." },
  { n: "02", t: "Add school information", d: "Name, country, size and your academic calendar." },
  { n: "03", t: "Pick your domain", d: "Free school.elimu.africa subdomain or bring your own." },
  { n: "04", t: "Provision emails & go live", d: "Bulk-create student & teacher accounts in minutes." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground" style={{ backgroundImage: "var(--gradient-hero)" }}>
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-bold tracking-tight">RALD ELIMU</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Education OS</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#onboarding" className="text-muted-foreground transition-colors hover:text-foreground">Onboarding</a>
            <a href="#email" className="text-muted-foreground transition-colors hover:text-foreground">Email</a>
            <a href="#university" className="text-muted-foreground transition-colors hover:text-foreground">University</a>
            <a href="#languages" className="text-muted-foreground transition-colors hover:text-foreground">Languages</a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm"><Link to="/auth/sign-in">Sign in</Link></Button>
            <Button asChild variant="hero" size="sm"><Link to="/onboarding">Start Free</Link></Button>
          </div>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border md:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, var(--primary) 0, transparent 40%), radial-gradient(circle at 80% 60%, var(--royal) 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pb-24 lg:pt-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              African-first. Mobile-first. Free at the core.
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Run Your School{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
                For Free.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              The complete African school operating system — student email, payments, attendance,
              results, communication and administration. From 50 to 500,000+ students.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/onboarding">Start Free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl"><Link to="/dashboard">View demo</Link></Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Institution-grade</span>
              <span className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4 text-primary" />Offline-ready</span>
              <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4 text-primary" />African languages</span>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-4 -z-10 rounded-[2rem] opacity-30 blur-2xl"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            />
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)]">
              <img
                src={heroImg}
                alt="African students learning with tablets in a bright classroom"
                width={1920}
                height={1080}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:block">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Today's attendance</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">96.4%</span>
                <span className="text-xs font-medium text-primary">+2.1%</span>
              </div>
            </div>
            <div className="absolute -right-3 -top-3 hidden rounded-2xl bg-gold p-4 text-gold-foreground shadow-[var(--shadow-soft)] sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-widest">Fees collected</div>
              <div className="mt-1 text-lg font-bold">KES 4.2M</div>
            </div>
          </div>
        </div>

        <div className="border-y border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 text-sm">
              <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Built for
              </span>
              {institutions.map((i) => (
                <span key={i} className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-foreground/80">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-primary">One platform</div>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Everything your school needs to run.</h2>
          <p className="mt-3 text-muted-foreground">
            From admissions to graduation — ELIMU unifies the tools African schools rely on,
            without the cost.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="onboarding" className="border-y border-border bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">Onboarding</div>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Your school live in minutes.</h2>
              <p className="mt-3 text-muted-foreground">
                A guided flow built for principals and admins — no IT team required.
              </p>
              <div className="mt-6 rounded-2xl border border-border bg-card p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your domain</div>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="rounded-lg bg-secondary px-3 py-2"><span className="text-primary">greenfield</span>.elimu.africa</div>
                  <div className="rounded-lg bg-secondary px-3 py-2"><span className="text-royal">lagoshigh</span>.elimu.africa</div>
                  <div className="rounded-lg bg-secondary px-3 py-2 text-muted-foreground">or use myschool.edu.ng</div>
                </div>
              </div>
            </div>
            <ol className="space-y-4">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-bold text-primary-foreground" style={{ backgroundImage: "var(--gradient-hero)" }}>
                    {s.n}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold">{s.t}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="email" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">RALD Mail</div>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Email for every student and teacher.</h2>
            <p className="mt-3 text-muted-foreground">
              Bulk provisioning, alumni retention, password reset, email groups — under your subdomain
              or your own school domain.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Automatic provisioning from your student list",
                "CSV bulk upload for teachers and classes",
                "Email groups by class, stream, faculty",
                "Alumni mailboxes that follow graduates",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span>Mailboxes</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-foreground">1,284</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { n: "John Otieno", e: "john@greenfield.elimu.africa", r: "Student · Form 3" },
                { n: "Mary Achieng", e: "mary@greenfield.elimu.africa", r: "Student · Form 1" },
                { n: "Mr. Mwangi", e: "principal@greenfield.elimu.africa", r: "Principal" },
                { n: "Ms. Adaeze", e: "adaeze@myschool.edu.ng", r: "Teacher · Mathematics" },
              ].map((m) => (
                <div key={m.e} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-primary">
                    {m.n.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{m.n}</div>
                    <div className="truncate text-xs text-muted-foreground">{m.e}</div>
                  </div>
                  <div className="hidden shrink-0 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground sm:block">
                    {m.r}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="university" className="relative overflow-hidden py-20 text-primary-foreground" style={{ backgroundImage: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-widest text-gold">University Mode</div>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Built for higher education too.</h2>
            <p className="mt-3 text-primary-foreground/80">
              Faculties, departments, programs, course registration, CGPA, transcripts,
              research and graduation workflows.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Faculties & Departments", "Course Registration", "CGPA & Transcripts", "Graduation Workflows"].map((t) => (
              <div key={t} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="text-sm font-semibold">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="languages" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">RALD Voice</div>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Speaks the languages of Africa.</h2>
            <p className="mt-3 text-muted-foreground">
              Voice-first interaction for students, parents, teachers and administrators —
              with growing support across the continent.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["English", "Swahili", "Yoruba", "Hausa", "Igbo", "Amharic", "French", "Arabic", "+ more"].map((l) => (
                <span key={l} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">SEKANI AI</div>
            <div className="mt-2 text-lg font-semibold">"Show me students at risk this term."</div>
            <div className="mt-4 space-y-2">
              {[
                { n: "Form 2 — 7 students", c: "Attendance dropped 18%" },
                { n: "Form 4 — 3 students", c: "Math scores trending down" },
                { n: "Form 1 — 2 students", c: "Missed 3 fee installments" },
              ].map((r) => (
                <div key={r.n} className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5 text-sm">
                  <span className="font-medium">{r.n}</span>
                  <span className="text-muted-foreground">{r.c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center sm:p-14">
          <div className="absolute inset-0 -z-10 opacity-10" style={{ backgroundImage: "var(--gradient-hero)" }} />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            Education infrastructure should be free for every African school.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join the schools, colleges and universities building on RALD ELIMU.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl"><Link to="/onboarding">Start Free <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" size="xl"><Link to="/dashboard">View demo</Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg text-primary-foreground" style={{ backgroundImage: "var(--gradient-hero)" }}>
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">RALD ELIMU</span>
            <span>· Education OS for Africa</span>
          </div>
          <div>© {new Date().getFullYear()} RALD. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
