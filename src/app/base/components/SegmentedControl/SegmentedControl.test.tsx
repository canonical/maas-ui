import SegmentedControl from "./SegmentedControl";

import { render, screen, userEvent } from "testing/utils";

const options = [
  {
    label: "Red",
    value: "#FF0000",
  },
  {
    label: "Green",
    value: "#00FF00",
  },
  {
    label: "Blue",
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

it("calls the callback when clicking a button", async () => {
  const onSelect = jest.fn();
  render(
    <SegmentedControl
      onSelect={onSelect}
      options={options}
      selected="#00FF00"
    />
  );
  await userEvent.click(screen.getByRole("tab", { name: "Blue" }));
  expect(onSelect).toHaveBeenCalledWith("#0000FF");
});
