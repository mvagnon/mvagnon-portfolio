import { describe, expect, test } from "bun:test";

import nextConfig from "@/next.config";

describe("next config", () => {
  test("allows the Keystatic local origin in development", () => {
    expect(nextConfig.allowedDevOrigins).toContain("127.0.0.1");
  });
});
