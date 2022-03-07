import { render, screen } from "@testing-library/react";

import SegmentToggle from "./SegmentToggle";

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
    <SegmentToggle onSelect={jest.fn()} options={options} selected="#00FF00" />
  );
  expect(screen.getByRole("radio", { name: "Red" })).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Green" })).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Blue" })).toBeInTheDocument();
});

it("selects the active option", () => {
  render(
    <SegmentToggle onSelect={jest.fn()} options={options} selected="#00FF00" />
  );
  expect(screen.getByRole("radio", { name: "Green" })).toHaveAttribute(
    "aria-checked",
    "true"
  );
});

it("calls the callback when clicking a button", () => {
  const onSelect = jest.fn();
  render(
    <SegmentToggle onSelect={onSelect} options={options} selected="#00FF00" />
  );
  screen.getByRole("radio", { name: "Blue" }).click();
  expect(onSelect).toHaveBeenCalledWith("#0000FF");
});
