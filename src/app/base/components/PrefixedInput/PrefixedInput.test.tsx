/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";

import PrefixedInput from "./PrefixedInput";

const { getComputedStyle } = window;

beforeAll(() => {
  // getComputedStyle is not implemeneted in jsdom, so we need to do this.
  window.getComputedStyle = (elt) => getComputedStyle(elt);
});

afterAll(() => {
  // Reset to original implementation
  window.getComputedStyle = getComputedStyle;
});

it("renders without crashing", async () => {
  render(
    <PrefixedInput aria-label="Limited input" immutableText="Some text" />
  );

  expect(
    screen.getByRole("textbox", { name: "Limited input" })
  ).toBeInTheDocument();
});

it("sets the --immutable css variable to the provided immutable text", async () => {
  const { rerender } = render(
    <PrefixedInput aria-label="Limited input" immutableText="Some text" />
  );

  rerender(
    <PrefixedInput aria-label="Limited input" immutableText="Some text" />
  );

  // Direct node access is needed here to check the CSS variable
  expect(
    screen.getByRole("textbox", { name: "Limited input" }).parentElement
      ?.parentElement
  ).toHaveStyle(`--immutable: "Some text";`);
});
