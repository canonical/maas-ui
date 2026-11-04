import { execSync } from "child_process";
import * as fs from "fs";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("child_process", () => {
  const mocks = { execSync: vi.fn() };
  return { ...mocks, default: mocks };
});
vi.mock("fs", () => {
  const mocks = {
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
    writeFileSync: vi.fn(),
    appendFileSync: vi.fn(),
  };
  return { ...mocks, default: mocks };
});

describe("docs maintenance", () => {
  let main: typeof import("./update-docs").main;
  const fetchMock = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>();

  beforeEach(async () => {
    vi.resetModules();
    vi.resetAllMocks();
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("GITHUB_OUTPUT", "/tmp/docs-maintenance-output");
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });
    vi.mocked(execSync).mockImplementation((command) =>
      Buffer.from(
        command === "git rev-parse HEAD"
          ? "head-sha"
          : "src/app/api/query/example.ts"
      )
    );
    vi.mocked(fs.readFileSync).mockReturnValue("Existing documentation");
    vi.mocked(fs.existsSync).mockReturnValue(true);
    ({ main } = await import("./update-docs"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("uses the supported model and writes the PR body before signalling updates", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: "CHANGES: yes\n---BEGIN DOC---\nUpdated documentation\n---END DOC---",
                  },
                ],
              },
            },
          ],
        })
      )
    );

    await main();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/models/gemini-3.8-flash:generateContent"),
      expect.objectContaining({ method: "POST" })
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "docs/standards/api-hooks.md",
      "Updated documentation",
      "utf-8"
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      ".github/docs-last-reviewed-sha",
      "head-sha\n",
      "utf-8"
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "/tmp/pr-body.md",
      expect.stringContaining("api-hooks.md"),
      "utf-8"
    );
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      "/tmp/docs-maintenance-output",
      "docs_updated=true\n"
    );
    expect(
      vi.mocked(fs.writeFileSync).mock.invocationCallOrder.at(-1)
    ).toBeLessThan(vi.mocked(fs.appendFileSync).mock.invocationCallOrder[0]);
  });

  it("does not signal updates when all reviewed docs are current", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: "CHANGES: no" }] } }],
        })
      )
    );

    await expect(main()).rejects.toThrow("process.exit");

    expect(process.exit).toHaveBeenCalledWith(0);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(fs.appendFileSync).not.toHaveBeenCalled();
  });

  it.each(["", "README.md"])(
    "does not signal updates when no affected source files changed (%s)",
    async (changedFiles) => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(changedFiles));

      await expect(main()).rejects.toThrow("process.exit");

      expect(process.exit).toHaveBeenCalledWith(0);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(fs.appendFileSync).not.toHaveBeenCalled();
    }
  );

  it("propagates API errors without advancing the sentinel or signalling updates", async () => {
    fetchMock.mockResolvedValue(
      new Response("Model not found", { status: 404 })
    );

    await expect(main()).rejects.toThrow(
      "api-hooks.md: Failed to call Gemini API: Gemini API error (404)"
    );

    expect(process.exit).not.toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(fs.appendFileSync).not.toHaveBeenCalled();
  });
});
