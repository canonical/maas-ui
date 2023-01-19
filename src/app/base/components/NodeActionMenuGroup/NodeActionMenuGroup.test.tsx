import userEvent from "@testing-library/user-event";

import NodeActionMenuGroup, { Labels } from "./NodeActionMenuGroup";

// import { NodeActions } from "app/store/types/node";
// import { getNodeActionTitle } from "app/store/utils";
// import { machine as machineFactory } from "testing/factories";
import { render, screen, within } from "testing/utils";

describe("NodeActionMenuGroup", () => {
  const openMenu = async (name: string) => {
    await userEvent.click(screen.getByRole("button", { name: name }));
  };

  it("exists", () => {
    render(
      <NodeActionMenuGroup hasSelection={false} onActionClick={jest.fn()} />
    );
  });
});
