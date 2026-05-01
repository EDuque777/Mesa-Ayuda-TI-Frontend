import { LoginCard } from "../components/LoginCard";
import { ColorBends } from "@/shared/ui/backgrounds/ColorBends";
import { GlowCard } from "@/shared/ui/glowCard/GlowCard";

export function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4">
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

      <section className="relative z-10 w-full md:w-[60%] lg:w-[30%]">
        <GlowCard glowColor="21, 93, 252">
          <LoginCard />
        </GlowCard>
      </section>
    </main>
  );
}
