import { LoginForm } from "./LoginForm";
import SplitText from "@/shared/ui/animateText/SplitText";
import TextType from "@/shared/ui/animateText/TextType";
import GradientText from "@/shared/ui/animateText/GradientText";
import Image from "next/image";
import logoMesaAyuda from "../../../../public/img/logoMesaAyuda.png";

export function LoginCard() {
  return (
    <div className="rounded-[20px] text-black bg-white p-10 shadow-2xl w-full flex flex-col justify-center items-center gap-7.5">
      <div className="w-[180px]">
        <Image
          src={logoMesaAyuda}
          alt="logo"
          width={500}
          height={380}
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="flex flex-col w-full">
        <SplitText
          text="Acceso al Portal"
          className="text-[35px] md:text-[40px] font-bold text-center leading-tight"
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
          className="text-center leading-snug text-gray-500 font-semibold"
        />
      </div>
      <LoginForm />
      <GradientText
        colors={["#000000", "#155dfc", "#000000"]}
        animationSpeed={8}
        showBorder={false}
        className="custom-class font-semibold text-center"
      >
        ¿Olvidaste tu contraseña?
      </GradientText>
    </div>
  );
}
