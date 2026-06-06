import type { ReactNode } from "react";

import { RouteViewTransition } from "@/components/ui/route-view-transition";

export default function Template({ children }: { children: ReactNode }) {
  return <RouteViewTransition>{children}</RouteViewTransition>;
}
