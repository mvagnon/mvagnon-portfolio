import { describe, expect, test } from "bun:test";

import { ArrowTextLink } from "@/components/ui/arrow-text-link";

describe("ArrowTextLink", () => {
  test("renders an external link in a new tab", () => {
    const element = ArrowTextLink({
      href: "https://example.com",
      children: "Book a call",
    });

    expect(element.type).toBe("a");
    expect(element.props.href).toBe("https://example.com");
    expect(element.props.target).toBe("_blank");
    expect(element.props.rel).toBe("noopener noreferrer");
  });

  test("renders a label when used inside another link", () => {
    const element = ArrowTextLink({
      children: "View project",
    });

    expect(element.type).toBe("span");
  });
});
