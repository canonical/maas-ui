import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import StatusColumn from "./StatusColumn";

import { PowerState } from "app/store/machine/types";
import { NodeStatusCode } from "app/store/types/node";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NameColumn", () => {
  it("shows a spinner if the machine is still loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("shows a spinner if the VM is in a transient state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            status_code: NodeStatusCode.COMMISSIONING,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner[data-test='status-icon']").exists()).toBe(
      true
    );
  });

  it("shows a power icon if nthe VM is not in a transient state", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [
          machineFactory({
            power_state: PowerState.OFF,
            status_code: NodeStatusCode.READY,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(
      wrapper
        .find("[data-test='status-icon']")
        .prop("className")
        ?.includes("power-off")
    ).toBe(true);
  });

  it("can show a VM's OS info", () => {
    const state = rootStateFactory({
      general: generalStateFactory({
        osInfo: osInfoStateFactory({
          data: osInfoFactory({
            releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
          }),
        }),
      }),
      machine: machineStateFactory({
        items: [
          machineFactory({
            distro_series: "focal",
            osystem: "ubuntu",
            status_code: NodeStatusCode.DEPLOYED,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("DoubleRow").prop("secondary")).toBe(
      "Ubuntu 20.04 LTS"
    );
  });
});
