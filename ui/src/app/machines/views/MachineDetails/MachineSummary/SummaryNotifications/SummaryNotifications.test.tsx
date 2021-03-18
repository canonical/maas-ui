import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SummaryNotifications from "./SummaryNotifications";

import { PowerState } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  architecturesState as architecturesStateFactory,
  generalState as generalStateFactory,
  machine as machineFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SummaryNotifications", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        architectures: architecturesStateFactory({
          data: ["amd64"],
          loaded: true,
        }),
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({
            architecture: "amd64",
            events: [machineEventFactory()],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("handles no notifications", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(false);
  });

  it("can display a power error", () => {
    state.machine.items = [
      machineFactory({
        architecture: "amd64",
        events: [
          machineEventFactory({
            description: "machine timed out",
          }),
        ],
        power_state: PowerState.ERROR,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("Script - machine timed out")
        )
        .exists()
    ).toBe(true);
  });

  it("can display a rack connection error", () => {
    state.general.powerTypes.data = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("no rack controller is currently connected")
        )
        .exists()
    ).toBe(true);
  });

  it("can display an architecture error", () => {
    state.machine.items[0].architecture = "";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n
              .text()
              .includes("This machine currently has an invalid architecture")
        )
        .exists()
    ).toBe(true);
  });

  it("can display a boot images error", () => {
    state.general.architectures = architecturesStateFactory({
      data: [],
      loaded: true,
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("No boot images have been imported")
        )
        .exists()
    ).toBe(true);
  });

  it("can display a hardware error", () => {
    state.machine.items[0].cpu_count = 0;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <SummaryNotifications id="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper
        .findWhere(
          (n) =>
            n.name() === "Notification" &&
            n.text().includes("Commission this machine to get CPU")
        )
        .exists()
    ).toBe(true);
  });
});
