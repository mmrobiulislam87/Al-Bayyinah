/** Framer Motion বান্ডিল — অ্যাপের নরম ডিজাইন ভাষার সাথে মিল রেখে */

export const stageContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
} as const;

export const fadeUpLetter = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 380, damping: 26 },
  },
} as const;

export const successPulse = {
  tap: {
    scale: [1, 1.035, 1],
    boxShadow: [
      "0 0 0 0 rgba(212,168,75,0.35)",
      "0 0 20px 4px rgba(45,212,191,0.25)",
      "0 0 0 0 rgba(212,168,75,0)",
    ],
    transition: { duration: 0.55 },
  },
} as const;
