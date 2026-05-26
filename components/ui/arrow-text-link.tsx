import { ArrowUpRight } from "lucide-react";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ArrowTextLinkSharedProps = {
  children: ReactNode;
  className?: string;
};

type ArrowTextLinkAnchorProps = ArrowTextLinkSharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ArrowTextLinkLabelProps = ArrowTextLinkSharedProps &
  HTMLAttributes<HTMLSpanElement> & {
    href?: never;
  };

type ArrowTextLinkProps = ArrowTextLinkAnchorProps | ArrowTextLinkLabelProps;

const arrowTextLinkClassName =
  "inline-flex shrink-0 items-center gap-2 rounded-sm text-sm font-light text-zinc-600 transition sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/60";

export function ArrowTextLink(props: ArrowTextLinkProps) {
  const className = cn(arrowTextLinkClassName, props.className);

  if (props.href !== undefined) {
    const {
      children,
      rel = "noopener noreferrer",
      target = "_blank",
      ...anchorProps
    } = props;

    return (
      <a {...anchorProps} className={className} rel={rel} target={target}>
        <ArrowTextLinkContent>{children}</ArrowTextLinkContent>
      </a>
    );
  }

  const { children, ...spanProps } = props;

  return (
    <span {...spanProps} className={className}>
      <ArrowTextLinkContent>{children}</ArrowTextLinkContent>
    </span>
  );
}

function ArrowTextLinkContent({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </>
  );
}
