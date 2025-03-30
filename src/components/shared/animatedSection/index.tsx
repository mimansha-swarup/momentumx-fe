// import React, { useEffect, useRef, useState } from "react";
// import { cn } from "@/lib/utils";

// interface AnimatedSectionProps {
//   children: React.ReactNode;
//   className?: string;
//   delay?: number;
//   animation?:
//     | "fade-in"
//     | "fade-right"
//     | "fade-left"
//     | "scale-up"
//     | "scale-down";
// }

// const AnimatedSection = ({
//   children,
//   className,
//   delay = 0,
//   animation = "fade-in",
// }: AnimatedSectionProps) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const sectionRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setTimeout(() => {
//               setIsVisible(true);
//             }, delay);
//             if (sectionRef.current) {
//               observer.unobserve(sectionRef.current);
//             }
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, [delay]);

//   return (
//     <div
//       ref={sectionRef}
//       className={cn(
//         "opacity-0",
//         isVisible && `fade-in 0.5s ease-out forwards`,
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// };

// export default AnimatedSection;
