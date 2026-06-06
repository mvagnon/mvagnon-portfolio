"use client";

import { ViewTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const transitionClassNames = {
  "nav-forward": "page-forward",
  "nav-back": "page-back",
} as const;

type RouteTransitionDefaults = {
  enter: "page-forward" | "page-back" | "none";
  exit: "page-forward" | "page-back" | "none";
};

export function RouteViewTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const defaults = getRouteTransitionDefaults(pathname);

  return (
    <ViewTransition
      enter={{
        ...transitionClassNames,
        default: defaults.enter,
      }}
      exit={{
        ...transitionClassNames,
        default: defaults.exit,
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

function getRouteTransitionDefaults(pathname: string): RouteTransitionDefaults {
  if (pathname === "/") {
    return {
      enter: "page-back",
      exit: "page-forward",
    };
  }

  if (isRootProjectPath(pathname)) {
    return {
      enter: "page-forward",
      exit: "page-back",
    };
  }

  return {
    enter: "none",
    exit: "none",
  };
}

function isRootProjectPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.length === 1 && segments[0] !== "keystatic";
}
