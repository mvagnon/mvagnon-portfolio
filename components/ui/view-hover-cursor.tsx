"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { MotionValue, Variants } from "motion/react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

type ViewHoverCursorProps = {
  active: boolean;
  label?: string;
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
  className?: string;
  circleClassName?: string;
  labelClassName?: string;
};

const cursorAnimation: Variants = {
  closed: {
    scale: 0,
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as const },
    x: "-50%",
    y: "-50%",
  },
  enter: {
    scale: 1,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as const },
    x: "-50%",
    y: "-50%",
  },
  initial: {
    scale: 0,
    x: "-50%",
    y: "-50%",
  },
};

export function ViewHoverCursor({
  active,
  label = "View",
  pointerX,
  pointerY,
  className,
  circleClassName,
  labelClassName,
}: ViewHoverCursorProps) {
  const localPointerX = useMotionValue(0);
  const localPointerY = useMotionValue(0);
  const sourceX = pointerX ?? localPointerX;
  const sourceY = pointerY ?? localPointerY;
  const circleX = useSpring(sourceX, { damping: 30, stiffness: 190 });
  const circleY = useSpring(sourceY, { damping: 30, stiffness: 190 });
  const labelX = useSpring(sourceX, { damping: 30, stiffness: 205 });
  const labelY = useSpring(sourceY, { damping: 30, stiffness: 205 });

  useEffect(() => {
    if (pointerX && pointerY) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      localPointerX.set(event.clientX);
      localPointerY.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [localPointerX, localPointerY, pointerX, pointerY]);

  const baseClassName =
    "pointer-events-none fixed left-0 top-0 z-40 hidden size-20 items-center justify-center rounded-full text-sm font-light lg:flex";

  return (
    <>
      <motion.div
        animate={active ? "enter" : "closed"}
        aria-hidden="true"
        className={cn(
          baseClassName,
          "bg-primary text-primary-foreground",
          className,
          circleClassName,
        )}
        initial="initial"
        style={{ left: circleX, top: circleY }}
        variants={cursorAnimation}
      />

      <motion.div
        animate={active ? "enter" : "closed"}
        aria-hidden="true"
        className={cn(
          baseClassName,
          "bg-transparent text-primary-foreground",
          className,
          labelClassName,
        )}
        initial="initial"
        style={{ left: labelX, top: labelY }}
        variants={cursorAnimation}
      >
        {label}
      </motion.div>
    </>
  );
}
