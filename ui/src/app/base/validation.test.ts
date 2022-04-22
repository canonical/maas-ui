import { hostnamePattern } from "./validation";

describe("hostname validation", () => {
  const regex = new RegExp(hostnamePattern);

  it("handles valid strings", () => {
    expect(regex.test("valid-name")).toBe(true);
  });

  it("handles invalid characters", () => {
    expect(regex.test("valid_name")).toBe(false);
  });

  it("is invalid if it starts with a dash", () => {
    expect(regex.test("-invalidname")).toBe(false);
  });

  it("is invalid if it ends with a dash", () => {
    expect(regex.test("invalidname-")).toBe(false);
  });
});
