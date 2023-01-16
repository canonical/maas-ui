import TagChip from "./TagChip";

import { tag as tagFactory } from "testing/factories";
import { render, screen } from "testing/utils";

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
  expect(
    screen.getByRole("button", { name: "chip1 (2/10)" })
  ).toBeInTheDocument();
});
