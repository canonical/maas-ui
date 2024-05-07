/* eslint-disable testing-library/no-node-access */
import { render, screen, waitFor } from "@testing-library/react";

import PrefixedInput from "./PrefixedInput";

beforeAll(() => {
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    width: 100,
    height: 0,
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    toJSON: vi.fn(),
  }));
});

afterAll(() => {
  vi.restoreAllMocks();
});

it("renders without crashing", async () => {
  render(
    <PrefixedInput aria-label="Limited input" immutableText="Some text" />
  );

  expect(
    screen.getByRole("textbox", { name: "Limited input" })
  ).toBeInTheDocument();
});

it("displays the immutable text", async () => {
  render(
    <PrefixedInput aria-label="Limited input" immutableText="Some text" />
  );

  expect(screen.getByText("Some text")).toBeInTheDocument();
});

it("adjusts input padding", async () => {
  render(
    <PrefixedInput aria-label="Limited input" immutableText="Some text" />
  );
  const inputElement = screen.getByRole("textbox", { name: "Limited input" });

  await waitFor(() => expect(inputElement).toHaveStyle("padding-left: 100px"));
});
