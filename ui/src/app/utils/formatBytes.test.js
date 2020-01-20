import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("correctly formats a value above the unit threshold", () => {
    expect(formatBytes(900, "KB")).toStrictEqual({ value: 900, unit: "KB" });
    expect(formatBytes(1100, "KB")).toStrictEqual({ value: 1.1, unit: "MB" });
  });

  it("correctly formats a value below the unit threshold", () => {
    expect(formatBytes(1, "MB")).toStrictEqual({ value: 1, unit: "MB" });
    expect(formatBytes(0.1, "MB")).toStrictEqual({ value: 100, unit: "KB" });
  });

  it("returns the value to the correct precision", () => {
    expect(formatBytes(1234, "B", 2)).toStrictEqual({ value: 1.2, unit: "KB" });
    expect(formatBytes(1234, "B", 4)).toStrictEqual({
      value: 1.234,
      unit: "KB"
    });
  });
});
