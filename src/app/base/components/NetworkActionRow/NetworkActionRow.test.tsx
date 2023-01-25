import configureStore from "redux-mock-store";

import NetworkActionRow from "./NetworkActionRow";

import { ExpandedState } from "app/base/components/NodeNetworkTab/NodeNetworkTab";
import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("NetworkActionRow", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can include extra actions", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <NetworkActionRow
        expanded={null}
        extraActions={[
          {
            disabled: [[false]],
            label: "Edit",
            state: ExpandedState.EDIT,
          },
        ]}
        node={state.machine.items[0]}
        setExpanded={jest.fn()}
      />,
      { route: "/machine/abc123", store }
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  describe("add physical", () => {
    it("sets the state to show the form when clicking the button", async () => {
      const store = mockStore(state);
      const setExpanded = jest.fn();
      renderWithBrowserRouter(
        <NetworkActionRow
          expanded={null}
          node={state.machine.items[0]}
          setExpanded={setExpanded}
        />,
        { route: "/machine/abc123", store }
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Add interface" })
      );
      expect(setExpanded).toHaveBeenCalledWith({
        content: ExpandedState.ADD_PHYSICAL,
      });
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkActionRow
          expanded={null}
          node={state.machine.items[0]}
          setExpanded={jest.fn()}
        />,
        { route: "/machine/abc123", store }
      );
      expect(
        screen.getByRole("button", { name: "Add interface" })
      ).toBeDisabled();
      expect(
        screen.getByRole("tooltip", {
          name: "Network can't be modified for this machine.",
        })
      ).toBeInTheDocument();
    });

    it("disables the button when the form is expanded", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      renderWithBrowserRouter(
        <NetworkActionRow
          expanded={{ content: ExpandedState.ADD_PHYSICAL }}
          node={state.machine.items[0]}
          setExpanded={jest.fn()}
        />,
        { route: "/machine/abc123", store }
      );
      expect(
        screen.getByRole("button", { name: "Add interface" })
      ).toBeDisabled();
    });
  });
});
