import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StatusCard from "./StatusCard";

import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StatusCard", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          data: osInfoFactory(),
        }),
      }),
      machine: machineStateFactory({
        items: [],
      }),
    });
  });

  it("renders a locked machine", () => {
    const machine = machineDetailsFactory();
    machine.status = NodeStatus.TESTING;
    machine.locked = true;
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='locked']").exists()).toEqual(true);
  });

  it("renders os info", () => {
    const machine = machineDetailsFactory();
    machine.osystem = "ubuntu";
    machine.distro_series = "focal";
    machine.show_os_info = true;
    state.general.osInfo.data = osInfoFactory({
      releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
    });
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='os-info']").text()).toEqual(
      'Ubuntu 20.04 LTS "Focal Fossa"'
    );
  });

  it("renders a failed test warning", () => {
    const machine = machineDetailsFactory();
    machine.testing_status.status = 3;

    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <StatusCard machine={machine} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='failed-test-warning']").text()).toEqual(
      "Warning: Some tests failed, use with caution."
    );
  });
});
