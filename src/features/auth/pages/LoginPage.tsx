import { LoginCard } from "../components/LoginCard";
import { AuthBackendStatus } from "../components/AuthBackendStatus";
import { ColorBends } from "@/shared/ui/backgrounds/ColorBends";
import { GlowCard } from "@/shared/ui/glowCard/GlowCard";

export function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-1 md:p-10">
      <AuthBackendStatus />
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#155dfc", "#155dfc", "#155dfc"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>

      <section className="relative z-10 w-full md:w-137.5">
        <GlowCard glowColor="21, 93, 252">
          <LoginCard />
        </GlowCard>
      </section>
    </main>
  );
}
