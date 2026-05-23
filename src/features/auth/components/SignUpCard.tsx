import Image from "next/image";
import Link from "next/link";
import logoMesaAyuda from "../../../../public/img/logoMesaAyuda.png";
import GradientText from "@/shared/ui/animateText/GradientText";
import SplitText from "@/shared/ui/animateText/SplitText";
import TextType from "@/shared/ui/animateText/TextType";
import { SignUpForm } from "./SignUpForm";

export function SignUpCard() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-7.5 rounded-[20px] bg-white p-10 text-black shadow-2xl">
      <div className="w-40">
        <Image
          src={logoMesaAyuda}
          alt="Logo Mesa de Ayuda"
          width={500}
          height={380}
          loading="eager"
          fetchPriority="high"
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="flex w-full flex-col">
        <SplitText
          text="Registro"
          className="text-center text-[35px] font-bold leading-tight md:text-[40px]"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <TextType
          text={[
            "Soporte TI eficiente para mantener tu operación activa",
            "Tickets organizados, respuestas rápidas y mejor seguimiento",
            "Impulsamos la productividad con atención técnica confiable",
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
          variableSpeed={{ min: 60, max: 120 }}
          cursorBlinkDuration={0.5}
          className="text-center font-semibold leading-snug text-gray-500"
        />
      </div>
      <SignUpForm />
      <GradientText
        colors={["#000000", "#155dfc", "#000000"]}
        animationSpeed={8}
        showBorder={false}
        className="custom-class text-center font-semibold leading-snug"
      >
        <Link href="/">¿Ya tienes una cuenta? Inicia sesión</Link>
      </GradientText>
    </div>
  );
}
