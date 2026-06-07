import { SignUpCard } from "../components/SignUpCard";
import { AuthBackendStatus } from "../components/AuthBackendStatus";
import { GlowCard } from "@/shared/ui/glowCard/GlowCard";

export function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-1 md:p-10">
      <AuthBackendStatus />
      <section className="relative z-10 w-full md:w-137.5">
        <GlowCard glowColor="21, 93, 252">
          <SignUpCard />
        </GlowCard>
      </section>
    </main>
  );
}
