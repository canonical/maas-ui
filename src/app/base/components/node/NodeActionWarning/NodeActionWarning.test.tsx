import NodeActionWarning from "./NodeActionWarning";

import { NodeActions } from "app/store/types/node";
import { render, screen } from "testing/utils";

it("displays a warning for selectedCount of 0", () => {
  render(
    <NodeActionWarning
      action={NodeActions.ABORT}
      nodeType="machine"
      onUpdateSelected={jest.fn()}
      selectedCount={0}
    />
  );
  expect(
    screen.getByText(/No machines have been selected/)
  ).toBeInTheDocument();
});

it("displays a warning for an action with a selected count", () => {
  render(
    <NodeActionWarning
      action={NodeActions.COMMISSION}
      nodeType="node"
      onUpdateSelected={jest.fn()}
      selectedCount={2}
    />
  );
  expect(
    screen.getByText(/2 nodes cannot be commissioned/)
  ).toBeInTheDocument();
});
