import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineHeader from "./MachineHeader";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineHeader", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays an icon when locked", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere((n) => n.name() === "Icon" && n.prop("name") === "locked")
        .exists()
    ).toBe(true);
  });

  it("displays power status", () => {
    state.machine.items[0].power_state = "on";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-icon--power-on").exists()).toBe(true);
    expect(wrapper.find("[data-test='machine-header-power']").text()).toBe(
      "Power on"
    );
  });

  it("displays power status when checking power", () => {
    state.machine.statuses["abc123"] = machineStatusFactory({
      checkingPower: true,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-icon--spinner").exists()).toBe(true);
    expect(wrapper.find("[data-test='machine-header-power']").text()).toBe(
      "Checking power"
    );
  });

  describe("power menu", () => {
    it("can dispatch the power on action", () => {
      state.machine.items[0].actions = [NodeActions.ON];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <Route
              exact
              path="/machine/:id"
              component={() => (
                <MachineHeader
                  selectedAction={null}
                  setSelectedAction={jest.fn()}
                />
              )}
            />
          </MemoryRouter>
        </Provider>
      );

      // Open the power menu dropdown
      wrapper.find("TableMenu Button").simulate("click");
      // Click the "Power on" link
      wrapper
        .find("TableMenu .p-contextual-menu__link")
        .at(0)
        .simulate("click");

      expect(
        store.getActions().some((action) => action.type === "machine/on")
      ).toBe(true);
    });

    it("can dispatch the power off action", () => {
      state.machine.items[0].actions = [NodeActions.OFF];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <Route
              exact
              path="/machine/:id"
              component={() => (
                <MachineHeader
                  selectedAction={null}
                  setSelectedAction={jest.fn()}
                />
              )}
            />
          </MemoryRouter>
        </Provider>
      );

      // Open the power menu dropdown
      wrapper.find("TableMenu Button").simulate("click");
      // Click the "Power off" link
      wrapper
        .find("TableMenu .p-contextual-menu__link")
        .at(0)
        .simulate("click");

      expect(
        store.getActions().some((action) => action.type === "machine/off")
      ).toBe(true);
    });

    it("can dispatch the check power action", () => {
      state.machine.items[0].actions = [];
      const store = mockStore(state);
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
          >
            <Route
              exact
              path="/machine/:id"
              component={() => (
                <MachineHeader
                  selectedAction={null}
                  setSelectedAction={jest.fn()}
                />
              )}
            />
          </MemoryRouter>
        </Provider>
      );

      // Open the power menu dropdown
      wrapper.find("TableMenu Button").simulate("click");
      // Click the "Check power" link
      wrapper
        .find("TableMenu .p-contextual-menu__link")
        .at(0)
        .simulate("click");

      expect(
        store
          .getActions()
          .some((action) => action.type === "machine/checkPower")
      ).toBe(true);
    });
  });

  it("includes a tab for instances if machine has any", () => {
    state.machine.items[0] = machineDetailsFactory({
      devices: [machineDeviceFactory()],
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-tabs__item").at(1).text()).toBe("Instances");
  });

  it("hides the subtitle when editing the name", () => {
    state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button.machine-name--editable").simulate("click");
    expect(wrapper.find("SectionHeader").prop("subtitle")).toBe(null);
  });
});
