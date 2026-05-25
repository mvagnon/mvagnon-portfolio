import Link, { type LinkProps } from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

type IconButtonSharedProps = {
  children: ReactNode;
  className?: string;
};

type IconButtonButtonProps = IconButtonSharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never;
    ref?: Ref<HTMLButtonElement>;
  };

type IconButtonLinkProps = IconButtonSharedProps &
  LinkProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href"
  > & {
    ref?: Ref<HTMLAnchorElement>;
  };

type IconButtonProps = IconButtonButtonProps | IconButtonLinkProps;

const iconButtonClassName =
  "flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-white hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:pointer-events-none disabled:opacity-35";

export function IconButton(props: IconButtonProps) {
  const className = cn(iconButtonClassName, props.className);

  if (props.href !== undefined) {
    const { children, ref, ...linkProps } = props;

    return (
      <Link ref={ref} {...linkProps} className={className}>
        {children}
      </Link>
    );
  }

  const { children, ref, type = "button", ...buttonProps } = props;

  return (
    <button ref={ref} {...buttonProps} type={type} className={className}>
      {children}
    </button>
  );
}
