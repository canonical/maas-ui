import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
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

const mockStore = configureStore();

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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <NetworkActionRow
            extraActions={[
              {
                disabled: [[false]],
                label: "Edit",
                state: ExpandedState.EDIT,
              },
            ]}
            expanded={null}
            setExpanded={jest.fn()}
            node={state.machine.items[0]}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Button[data-testid='edit']").exists()).toBe(true);
  });

  describe("add physical", () => {
    it("sets the state to show the form when clicking the button", () => {
      const store = mockStore(state);
      const setExpanded = jest.fn();
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActionRow
              expanded={null}
              setExpanded={setExpanded}
              node={state.machine.items[0]}
            />
          </MemoryRouter>
        </Provider>
      );
      wrapper.find("Button[data-testid='addPhysical']").simulate("click");
      expect(setExpanded).toHaveBeenCalledWith({
        content: ExpandedState.ADD_PHYSICAL,
      });
    });

    it("disables the button when networking is disabled", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActionRow
              expanded={null}
              setExpanded={jest.fn()}
              node={state.machine.items[0]}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addPhysical']").prop("disabled")
      ).toBe(true);
      expect(
        wrapper.find("Tooltip[data-testid='addPhysical-tooltip']").exists()
      ).toBe(true);
    });

    it("disables the button when the form is expanded", () => {
      state.machine.items[0].status = NodeStatus.DEPLOYED;
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <NetworkActionRow
              expanded={{ content: ExpandedState.ADD_PHYSICAL }}
              setExpanded={jest.fn()}
              node={state.machine.items[0]}
            />
          </MemoryRouter>
        </Provider>
      );
      expect(
        wrapper.find("Button[data-testid='addPhysical']").prop("disabled")
      ).toBe(true);
    });
  });
});
