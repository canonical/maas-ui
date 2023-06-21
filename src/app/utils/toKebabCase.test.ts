import { toKebabCase } from "./toKebabCase";

it("correctly converts spaces and dashes to underscores", () => {
  expect(toKebabCase("my test string")).toEqual("my_test_string");
  expect(toKebabCase("my-test-string")).toEqual("my_test_string");
});

it("correctly converts capitalised string to kebab case string", () => {
  expect(toKebabCase("My long string")).toEqual("my_long_string");
});

it("correctly converts uppercase string to kebab case string", () => {
  expect(toKebabCase("MY LONG STRING")).toEqual("my_long_string");
});
