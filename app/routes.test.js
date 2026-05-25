import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

const appDir = join(process.cwd(), "app");

describe("project routes", () => {
  test("are mounted at the site root", () => {
    expect(existsSync(join(appDir, "page.tsx"))).toBe(true);
    expect(existsSync(join(appDir, "[id]", "page.tsx"))).toBe(true);
    expect(existsSync(join(appDir, "project", "page.tsx"))).toBe(false);
    expect(existsSync(join(appDir, "project", "[id]", "page.tsx"))).toBe(
      false,
    );
  });
});
