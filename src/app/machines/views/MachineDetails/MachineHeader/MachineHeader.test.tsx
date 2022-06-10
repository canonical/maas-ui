import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineHeader from "./MachineHeader";

import { MachineHeaderViews } from "app/machines/constants";
import type { RootState } from "app/store/root/types";
import { PowerState } from "app/store/types/enum";
import { NodeActions } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
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
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
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
          <CompatRouter>
            <MachineHeader
              headerContent={null}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a spinner when loading the details version of the machine", () => {
    state.machine.items = [machineFactory({ system_id: "abc123" })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineHeader
              headerContent={null}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays action title if an action is selected", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineHeader
              headerContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='section-header-title']").text()).toBe(
      "Deploy"
    );
  });

  it("displays an icon when locked", () => {
    state.machine.items[0].locked = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineHeader
              headerContent={null}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
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
    state.machine.items[0].power_state = PowerState.ON;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineHeader
              headerContent={null}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-icon--power-on").exists()).toBe(true);
    expect(wrapper.find("[data-testid='machine-header-power']").text()).toBe(
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
          <CompatRouter>
            <MachineHeader
              headerContent={null}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-icon--spinner").exists()).toBe(true);
    expect(wrapper.find("[data-testid='machine-header-power']").text()).toBe(
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
            <CompatRouter>
              <MachineHeader
                headerContent={null}
                setHeaderContent={jest.fn()}
                systemId="abc123"
              />
            </CompatRouter>
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
            <CompatRouter>
              <MachineHeader
                headerContent={null}
                setHeaderContent={jest.fn()}
                systemId="abc123"
              />
            </CompatRouter>
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
            <CompatRouter>
              <MachineHeader
                headerContent={null}
                setHeaderContent={jest.fn()}
                systemId="abc123"
              />
            </CompatRouter>
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
          <CompatRouter>
            <MachineHeader
              headerContent={null}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
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
          <CompatRouter>
            <MachineHeader
              headerContent={null}
              setHeaderContent={jest.fn()}
              systemId="abc123"
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("Button.node-name--editable").simulate("click");
    expect(wrapper.find("SectionHeader").prop("subtitle")).toBe(null);
  });
});
