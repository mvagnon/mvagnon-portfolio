import { describe, expect, test } from "bun:test";

import nextConfig from "@/next.config";

describe("next config", () => {
  test("allows the Keystatic local origin in development", () => {
    expect(nextConfig.allowedDevOrigins).toContain("127.0.0.1");
  });

  test("allows high-quality project image optimization", () => {
    expect(nextConfig.images?.qualities).toContain(100);
  });
});
