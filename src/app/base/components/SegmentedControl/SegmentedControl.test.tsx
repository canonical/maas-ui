import { render, screen } from "@testing-library/react";

import SegmentedControl from "./SegmentedControl";

const options = [
  {
    title: "Red",
    value: "#FF0000",
  },
  {
    title: "Green",
    value: "#00FF00",
  },
  {
    title: "Blue",
    value: "#0000FF",
  },
];

it("renders a segment for each option", () => {
  render(
    <SegmentedControl
      onSelect={jest.fn()}
      options={options}
      selected="#00FF00"
    />
  );
  expect(screen.getByRole("tab", { name: "Red" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Green" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Blue" })).toBeInTheDocument();
});

it("selects the active option", () => {
  render(
    <SegmentedControl
      onSelect={jest.fn()}
      options={options}
      selected="#00FF00"
    />
  );
  expect(screen.getByRole("tab", { name: "Green" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

it("calls the callback when clicking a button", () => {
  const onSelect = jest.fn();
  render(
    <SegmentedControl
      onSelect={onSelect}
      options={options}
      selected="#00FF00"
    />
  );
  screen.getByRole("tab", { name: "Blue" }).click();
  expect(onSelect).toHaveBeenCalledWith("#0000FF");
});
