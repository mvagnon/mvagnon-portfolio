import { ViewTransition } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "page-forward",
        "nav-back": "page-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "page-forward",
        "nav-back": "page-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
