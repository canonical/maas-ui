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
    <SegmentToggle onSelect={jest.fn()} options={options} selected="Green" />
  );
  expect(screen.getByRole("button", { name: "Red" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Green" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Blue" })).toBeInTheDocument();
});

it("highlights the active option", () => {
  render(
    <SegmentToggle onSelect={jest.fn()} options={options} selected="Green" />
  );
  expect(screen.getByRole("button", { name: "Green" })).toHaveClass(
    "is-active"
  );
});

it("calls the callback when clicking a button", () => {
  const onSelect = jest.fn();
  render(
    <SegmentToggle onSelect={onSelect} options={options} selected="Green" />
  );
  screen.getByRole("button", { name: "Blue" }).click();
  expect(onSelect).toHaveBeenCalledWith("blue");
});
