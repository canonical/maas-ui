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
});
