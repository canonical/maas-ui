import { render, screen } from "@testing-library/react";

import TagChip from "./TagChip";

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
  render(<TagChip machineCount={10} tag={tags[0]} tagIdsAndCounts={tagMap} />);
  // These tests can't select by role and name because the text is inside an
  // inner span which React Testing Library doesn't support and we can't
  // currently apply additional aria labels to the button until react-components
  // is updated with:
  // https://github.com/canonical-web-and-design/react-components/pull/727
  expect(screen.getByText("chip1 (2/10)")).toBeInTheDocument();
});
