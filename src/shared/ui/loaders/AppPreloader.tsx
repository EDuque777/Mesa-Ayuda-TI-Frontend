// "use client";

// import { AnimatePresence, motion } from "motion/react";
// import { useEffect, useState } from "react";
// import { EabjLoader } from "@/shared/ui/loaders/EabjLoader";

// type AppPreloaderProps = {
//   duration?: number;
// };

// export function AppPreloader({ duration = 3000 }: AppPreloaderProps) {
//   const [showIntro, setShowIntro] = useState(true);

//   useEffect(() => {
//     const timeoutId = window.setTimeout(() => {
//       setShowIntro(false);
//     }, duration);

//     return () => {
//       window.clearTimeout(timeoutId);
//     };
//   }, [duration]);

//   return (
//     <AnimatePresence>
//       {showIntro && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{
//             duration: 0.6,
//             ease: "easeInOut",
//           }}
//           className="fixed inset-0 z-9999 flex items-center justify-center bg-white"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.92, y: 12 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.96, y: -8 }}
//             transition={{
//               duration: 0.5,
//               ease: "easeOut",
//             }}
//             className="flex flex-col items-center gap-5"
//           >
//             <EabjLoader />
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }


// "use client";

// import { AnimatePresence, motion } from "motion/react";
// import { useEffect, useMemo, useState } from "react";
// import { usePathname, useSearchParams } from "next/navigation";
// import { EabjLoader } from "@/shared/ui/loaders/EabjLoader";

// type AppPreloaderProps = {
//   minDuration: number;
// };

// export function AppPreloader({ minDuration }: AppPreloaderProps) {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const routeKey = useMemo(() => {
//     return `${pathname}?${searchParams.toString()}`;
//   }, [pathname, searchParams]);

//   return <RoutePreloader key={routeKey} minDuration={minDuration} />;
// }

// function RoutePreloader({ minDuration }: Required<AppPreloaderProps>) {
//   const [showIntro, setShowIntro] = useState(true);

//   useEffect(() => {
//     let timeoutId: ReturnType<typeof setTimeout>;

//     const startedAt = Date.now();

//     const hideWhenReady = async () => {
//       if (document.readyState !== "complete") {
//         await new Promise<void>((resolve) => {
//           window.addEventListener("load", () => resolve(), { once: true });
//         });
//       }

//       if ("fonts" in document) {
//         await document.fonts.ready;
//       }

//       const images = Array.from(document.images);

//       await Promise.allSettled(
//         images.map((img) => {
//           if (img.complete) return Promise.resolve();

//           return new Promise<void>((resolve) => {
//             img.addEventListener("load", () => resolve(), { once: true });
//             img.addEventListener("error", () => resolve(), { once: true });
//           });
//         }),
//       );

//       const elapsed = Date.now() - startedAt;
//       const remaining = Math.max(minDuration - elapsed, 0);

//       timeoutId = setTimeout(() => {
//         setShowIntro(false);
//       }, remaining);
//     };

//     hideWhenReady();

//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [minDuration]);

//   return (
//     <AnimatePresence>
//       {showIntro && (
//         <motion.div
//           initial={{ opacity: 1 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{
//             duration: 0.6,
//             ease: "easeInOut",
//           }}
//           className="fixed inset-0 z-9999 flex items-center justify-center bg-white"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.92, y: 12 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.96, y: -8 }}
//             transition={{
//               duration: 0.5,
//               ease: "easeOut",
//             }}
//             className="flex flex-col items-center gap-5"
//           >
//             <EabjLoader />
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }



"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EabjLoader } from "@/shared/ui/loaders/EabjLoader";

type AppPreloaderProps = {
  minDuration: number;
};

export function AppPreloader({ minDuration }: AppPreloaderProps) {
  const pathname = usePathname();

  return <RoutePreloader key={pathname} minDuration={minDuration} />;
}

function RoutePreloader({ minDuration }: Required<AppPreloaderProps>) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const startedAt = Date.now();

    const hideWhenReady = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
      }

      if ("fonts" in document) {
        await document.fonts.ready;
      }

      const images = Array.from(document.images);

      await Promise.allSettled(
        images.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          });
        }),
      );

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(minDuration - elapsed, 0);

      timeoutId = setTimeout(() => {
        setShowIntro(false);
      }, remaining);
    };

    hideWhenReady();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [minDuration]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="flex flex-col items-center gap-5"
          >
            <EabjLoader />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}