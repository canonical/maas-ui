import formatGigabits from "./formatGigabits";

describe("formatGigabits", () => {
  it("returns value with GiB suffix", () => {
    expect(formatGigabits(0)).toBe("0 GiB");
    expect(formatGigabits(10)).toBe("10 GiB");
    expect(formatGigabits(1024)).toBe("1024 GiB");
  });
});
