import { render, screen } from "@testing-library/react";

import TagList from "./TagList";

import { tag as tagFactory } from "testing/factories";

const tags = [
  tagFactory({ name: "chip1", id: 1 }),
  tagFactory({ name: "chip2", id: 2 }),
];

const tagMap = new Map([
  [1, 2],
  [2, 1],
]);

it("displays chips with counts", () => {
  render(
    <TagList
      description=""
      machineCount={10}
      tags={tags}
      tagIdsAndCounts={tagMap}
    />
  );
  // These tests can't select by role and name because the text is inside an
  // inner span which React Testing Library doesn't support and we can't
  // currently apply additional aria labels to the button until react-components
  // is updated with:
  // https://github.com/canonical-web-and-design/react-components/pull/727
  expect(screen.getByText("chip1 (2/10)")).toBeInTheDocument();
  expect(screen.getByText("chip2 (1/10)")).toBeInTheDocument();
});

it("handles clicking on a chip", () => {
  const chipOnClick = jest.fn();
  render(
    <TagList
      chipOnClick={chipOnClick}
      description=""
      machineCount={10}
      tags={tags}
      tagIdsAndCounts={tagMap}
    />
  );
  screen.getByText("chip1 (2/10)").click();
  expect(chipOnClick).toHaveBeenCalled();
});

it("handles dismissing a chip", () => {
  const chipOnDismiss = jest.fn();
  render(
    <TagList
      chipOnDismiss={chipOnDismiss}
      description=""
      machineCount={10}
      tags={tags}
      tagIdsAndCounts={tagMap}
    />
  );
  screen.getAllByRole("button", { name: "Dismiss" })[0].click();
  expect(chipOnDismiss).toHaveBeenCalled();
});

it("can set the appearance of the chip", () => {
  render(
    <TagList
      chipAppearance="caution"
      description=""
      machineCount={10}
      tags={tags}
      tagIdsAndCounts={tagMap}
    />
  );
  expect(
    screen.getAllByRole("button")[0]?.className.includes("p-chip--caution")
  ).toBe(true);
});

it("can display a description", () => {
  render(
    <TagList
      description="hot chips!"
      machineCount={10}
      tags={tags}
      tagIdsAndCounts={tagMap}
    />
  );
  expect(screen.getByText("hot chips!")).toBeInTheDocument();
});
