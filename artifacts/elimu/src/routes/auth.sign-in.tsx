import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignIn,
});

function SignIn() {
  const returnTo = typeof window !== "undefined"
    ? encodeURIComponent(
        new URLSearchParams(window.location.search).get("returnTo") ?? "/dashboard"
      )
    : encodeURIComponent("/dashboard");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div
        className="relative hidden overflow-hidden lg:block"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold tracking-widest">RALD ELIMU</span>
          </Link>
          <div className="absolute bottom-12 left-12 right-12">
            <h2 className="text-4xl font-bold leading-tight">
              The education operating system for Africa.
            </h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              Manage your school — students, teachers, results, payments and more — from one
              unified workspace.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <div
              className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold tracking-widest">RALD ELIMU</span>
          </Link>

          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your school workspace with your RALD ID.
          </p>

          <a
            href={`/api/login?returnTo=${returnTo}`}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            Continue with RALD ID
            <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
            Secure single sign-on via RALD Identity
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
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
