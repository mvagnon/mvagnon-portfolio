import Link from "next/link";
import { describe, expect, test } from "bun:test";

import { IconButton } from "@/components/ui/icon-button";

describe("IconButton", () => {
  test("renders a non-submit button by default", () => {
    const element = IconButton({
      "aria-label": "Fermer",
      children: null,
    });

    expect(element.type).toBe("button");
    expect(element.props.type).toBe("button");
  });

  test("renders a Next link when href is provided", () => {
    const element = IconButton({
      href: "/",
      "aria-label": "Retour a l'accueil",
      children: null,
    });

    expect(element.type).toBe(Link);
    expect(element.props.href).toBe("/");
  });
});
