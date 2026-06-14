import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import {
  GraduationCap,
  School,
  BookOpen,
  Building2,
  Users,
  FlaskConical,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const types = [
  { id: "nursery", label: "Nursery / Pre-primary", icon: Users },
  { id: "primary", label: "Primary School", icon: School },
  { id: "secondary", label: "Secondary School", icon: GraduationCap },
  { id: "college", label: "College / Polytechnic", icon: BookOpen },
  { id: "university", label: "University", icon: Building2 },
  { id: "training", label: "Training Institute", icon: FlaskConical },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity] = useState("");
  const [schoolSize, setSchoolSize] = useState("1 – 100");
  const [academicCalendar, setAcademicCalendar] = useState("3 Terms (Jan – Dec)");
  const [domainMode, setDomainMode] = useState<"sub" | "own">("sub");
  const [sub, setSub] = useState("");

  const total = 4;
  const pct = (step / total) * 100;

  async function handleLaunch() {
    if (!schoolName || !type || !country) {
      setError("School name, type, and country are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/schools", {
        name: schoolName,
        type,
        country,
        state: stateRegion || undefined,
        city: city || undefined,
      });
      navigate({ to: "/dashboard" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create school";
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground" style={{ backgroundImage: "var(--gradient-hero)" }}>
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold tracking-widest">RALD ELIMU</span>
          </Link>
          <div className="text-xs font-semibold text-muted-foreground">Step {step} of {total}</div>
        </div>
        <div className="h-1 w-full bg-secondary">
          <div className="h-full transition-all" style={{ width: pct + "%", backgroundImage: "var(--gradient-hero)" }} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {step === 1 && (
          <section>
            <h1 className="text-3xl font-bold">What kind of institution?</h1>
            <p className="mt-2 text-muted-foreground">We'll tailor ELIMU to your workflow.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {types.map((t) => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={
                      "flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all " +
                      (active
                        ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                        : "border-border bg-card hover:border-primary/30")
                    }
                  >
                    <div className={"grid h-11 w-11 place-items-center rounded-xl " + (active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold">{t.label}</div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold">Tell us about your school</h1>
              <p className="mt-2 text-muted-foreground">This sets up your workspace.</p>
            </div>
            <FieldInput label="School name" placeholder="Greenfield Academy" value={schoolName} onChange={setSchoolName} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput label="Country" placeholder="Kenya" value={country} onChange={setCountry} />
              <FieldInput label="State / Region" placeholder="Nairobi" value={stateRegion} onChange={setStateRegion} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldInput label="City" placeholder="Nairobi" value={city} onChange={setCity} />
              <FieldSelect label="School size" options={["1 – 100", "100 – 500", "500 – 2,000", "2,000 – 10,000", "10,000+"]} value={schoolSize} onChange={setSchoolSize} />
            </div>
            <FieldSelect label="Academic calendar" options={["3 Terms (Jan – Dec)", "2 Semesters (Sep – Jun)", "Trimester", "Custom"]} value={academicCalendar} onChange={setAcademicCalendar} />
          </section>
        )}

        {step === 3 && (
          <section className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold">Pick your domain</h1>
              <p className="mt-2 text-muted-foreground">Get a free subdomain or use your own.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setDomainMode("sub")}
                className={"rounded-2xl border p-5 text-left transition-all " + (domainMode === "sub" ? "border-primary bg-primary/5" : "border-border bg-card")}
              >
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Recommended</div>
                <div className="mt-1 font-semibold">Free ELIMU subdomain</div>
                <div className="mt-1 text-sm text-muted-foreground">school.elimu.africa — ready instantly.</div>
              </button>
              <button
                onClick={() => setDomainMode("own")}
                className={"rounded-2xl border p-5 text-left transition-all " + (domainMode === "own" ? "border-primary bg-primary/5" : "border-border bg-card")}
              >
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Advanced</div>
                <div className="mt-1 font-semibold">Use your own domain</div>
                <div className="mt-1 text-sm text-muted-foreground">e.g. myschool.edu.ng — DNS guided.</div>
              </button>
            </div>

            {domainMode === "sub" ? (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your subdomain</label>
                <div className="flex h-12 items-center overflow-hidden rounded-xl border border-border bg-card">
                  <input
                    value={sub}
                    onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder={schoolName ? schoolName.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") : "greenfield"}
                    className="h-full flex-1 bg-transparent px-3 text-sm outline-none"
                  />
                  <span className="select-none border-l border-border bg-secondary px-3 py-3 text-sm font-mono text-muted-foreground">
                    .elimu.africa
                  </span>
                </div>
                {sub && (
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-primary">
                    <Check className="h-4 w-4" /> {sub}.elimu.africa is available
                  </p>
                )}
              </div>
            ) : (
              <div>
                <FieldInput label="Your domain" placeholder="myschool.edu.ng" value="" onChange={() => {}} />
                <div className="mt-3 rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  We'll guide you through DNS records, SSL provisioning and ownership verification.
                </div>
              </div>
            )}
          </section>
        )}

        {step === 4 && (
          <section className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold">Provision emails & go live</h1>
              <p className="mt-2 text-muted-foreground">We'll create your starter accounts and you're ready.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">School</div>
              <div className="mt-2 text-lg font-bold">{schoolName || "Your School"}</div>
              <div className="mt-1 text-sm text-muted-foreground capitalize">{type?.replace("-", " ")} · {country}</div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Starter accounts</div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  "principal@" + (sub || schoolName.toLowerCase().replace(/\s+/g, "") || "school") + ".elimu.africa",
                  "admin@" + (sub || schoolName.toLowerCase().replace(/\s+/g, "") || "school") + ".elimu.africa",
                  "info@" + (sub || schoolName.toLowerCase().replace(/\s+/g, "") || "school") + ".elimu.africa",
                ].map((e) => (
                  <li key={e} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 font-mono">
                    <span className="truncate">{e}</span>
                    <span className="ml-3 shrink-0 text-xs text-primary">Ready</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-sm">
              <div className="font-semibold">Bulk upload students later</div>
              <p className="mt-1 text-muted-foreground">
                Use CSV upload from the admin dashboard to provision the rest of your students and teachers in one go.
              </p>
            </div>
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </section>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < total ? (
            <Button
              variant="hero"
              size="lg"
              disabled={step === 1 && !type}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="hero" size="lg" disabled={submitting} onClick={handleLaunch}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Launch school <ArrowRight className="h-4 w-4" /></>}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function FieldSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <select
        className="h-12 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
