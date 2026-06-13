import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignIn,
});

function SignIn() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block" style={{ backgroundImage: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold tracking-widest">RALD ELIMU</span>
          </Link>
          <div className="absolute bottom-12 left-12 right-12">
            <h2 className="text-4xl font-bold leading-tight">The education operating system for Africa.</h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Sign in to manage your school — students, teachers, results, payments and more.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground" style={{ backgroundImage: "var(--gradient-hero)" }}>
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold tracking-widest">RALD ELIMU</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your school workspace</p>

          <form className="mt-8 space-y-4">
            <Field icon={Mail} type="email" placeholder="name@school.elimu.africa" label="Email" />
            <Field icon={Lock} type="password" placeholder="••••••••" label="Password" />
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-border" /> Remember me
              </label>
              <a href="#" className="font-medium text-primary hover:underline">Forgot?</a>
            </div>
            <Button asChild variant="hero" size="lg" className="w-full">
              <Link to="/dashboard">Sign in <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New school?{" "}
            <Link to="/onboarding" className="font-semibold text-primary hover:underline">
              Start onboarding
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...rest }: { icon: typeof Mail; label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          {...rest}
          className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
