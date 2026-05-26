import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "bun:test";

import { FadeInImage } from "@/components/ui/fade-in-image";

describe("FadeInImage", () => {
  test("starts hidden and fades opacity over 0.5 seconds", () => {
    const html = renderToStaticMarkup(
      <FadeInImage
        src="/images/projects/example/cover.png"
        alt=""
        width={320}
        height={240}
        className="object-cover"
      />,
    );

    expect(html).toContain("object-cover");
    expect(html).toContain("opacity-0");
    expect(html).toContain("transition-opacity");
    expect(html).toContain("duration-500");
  });
});
