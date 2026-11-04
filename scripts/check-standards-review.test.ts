import { execSync, spawnSync } from "child_process";
import * as fs from "fs";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("child_process", () => {
  const mocks = { execSync: vi.fn(), spawnSync: vi.fn() };
  return { ...mocks, default: mocks };
});
vi.mock("fs", () => {
  const mocks = {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
  return { ...mocks, default: mocks };
});

describe("weekly standards review", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("PR_NUMBER", "");
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.mocked(execSync).mockReturnValue(Buffer.from("src/example.tsx\n"));
    vi.mocked(spawnSync).mockReturnValue({
      pid: 1,
      output: ["", "", ""],
      stdout: "",
      stderr: "",
      status: 0,
      signal: null,
    });
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue("Example content");
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not write a report when there are no violations", async () => {
    await import("./check-standards-review");

    await vi.waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "No violations found. No PR needed."
      );
    });
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("writes static findings when the checker exits with status 1", async () => {
    vi.mocked(spawnSync).mockReturnValue({
      pid: 1,
      output: ["", "", ""],
      stdout:
        "FAIL src/example.tsx\n  src/example.tsx:12:1 — Use FormikForm\n  → docs/standards/forms.md\n",
      stderr: "",
      status: 1,
      signal: null,
    });

    await import("./check-standards-review");

    await vi.waitFor(() => {
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        ".github/standards-review-findings.md",
        expect.stringContaining("- `src/example.tsx` line 12 — Use FormikForm"),
        "utf-8"
      );
    });
  });

  it("uses the supported model and writes semantic findings", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                { text: "VIOLATIONS: 1\nsrc/example.tsx:3 — Use GenericTable" },
              ],
            },
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetch);

    await import("./check-standards-review");

    await vi.waitFor(() => {
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        ".github/standards-review-findings.md",
        expect.stringContaining("- `src/example.tsx` — Use GenericTable"),
        "utf-8"
      );
    });
    expect(fetch).toHaveBeenCalledTimes(6);
    expect(fetch).toHaveBeenCalledWith(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=test-key",
      expect.objectContaining({ method: "POST" })
    );
  });
});
