import { formatErrors } from "./formatErrors";

describe("formatErrors", () => {
  it("does not format a single string", () => {
    const error = "Error message";
    expect(formatErrors(error)).toEqual("Error message");
  });

  it("correctly formats an array of error strings", () => {
    const error = ["Error 1.", "Error 2."];
    expect(formatErrors(error)).toEqual("Error 1. Error 2.");
  });

  it("correctly formats an error object", () => {
    const error = {
      name: "Too long.",
      date: "Too late.",
    };
    expect(formatErrors(error)).toEqual("name: Too long. date: Too late.");
  });

  it("correctly formats an error object containing arrays", () => {
    const error = {
      name: ["Too long.", "Too late."],
    };
    expect(formatErrors(error)).toEqual("name: Too long. Too late.");
  });

  it("can return the errors for a single key", () => {
    const error = {
      name: "Too long.",
      date: "Too late.",
    };
    expect(formatErrors(error, "name")).toEqual("Too long.");
  });

  it("correctly formats fetch TypeError", () => {
    const typeError = new TypeError("Failed to fetch");
    expect(formatErrors(typeError)).toEqual("Failed to fetch");
  });
});
