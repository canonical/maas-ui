import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import MachineActionButtonGroup, {
  actionGroups,
  Labels as ButtonGroupLabels,
} from "./MachineActionButtonGroup";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("MachineActionButtonGroup", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("renders each action button", () => {
    renderWithBrowserRouter(
      <MachineActionButtonGroup onActionClick={jest.fn()} systemId="abc123" />,
      { route: "/machine/abc123", state }
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(18);
    Object.values(ButtonGroupLabels).forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("renders the titles for each group", () => {
    renderWithBrowserRouter(
      <MachineActionButtonGroup onActionClick={jest.fn()} systemId="abc123" />,
      { route: "/machine/abc123", state }
    );

    actionGroups.forEach((group) => {
      expect(screen.getByText(group.title)).toBeInTheDocument();
    });
  });

  it("calls a provided function when an action button is clicked", async () => {
    const actionFunction = jest.fn();
    renderWithBrowserRouter(
      <MachineActionButtonGroup
        onActionClick={actionFunction}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Commission" }));

    expect(actionFunction).toHaveBeenCalled();
  });

  it(`dispatches an action to check a machine's power state when the "Check" button is pressed`, async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <MachineActionButtonGroup onActionClick={jest.fn()} systemId="abc123" />,
      { route: "/machine/abc123", store }
    );

    await userEvent.click(screen.getByRole("button", { name: "Check" }));

    expect(
      store.getActions().some((action) => action.type === "machine/checkPower")
    ).toBe(true);
  });
});
