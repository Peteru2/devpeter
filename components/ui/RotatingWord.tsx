"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Cycles through a few words inside a headline. Screen readers get the full
 * list as plain text, and visitors who prefer reduced motion see the first word only.
 */
export function RotatingWord({
  words,
  interval = 2600,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [reduce, words.length, interval]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className={`inline-block ${className}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            className="inline-block"
            initial={{ opacity: 0, y: "0.3em" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-0.3em" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
