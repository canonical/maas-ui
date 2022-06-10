import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { ControllerStatus } from "./ControllerStatus";

import type { RootState } from "app/store/root/types";
import { ServiceStatus } from "app/store/service/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
  service as serviceFactory,
  serviceState as serviceStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ControllerStatus", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        items: [
          controllerFactory({
            system_id: "abc123",
            service_ids: [1, 2],
          }),
        ],
      }),
    });
  });

  it("handles a dead controller", () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.DEAD,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.DEAD,
        }),
      ],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ControllerStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Icon").prop("name")).toEqual("power-error");
    expect(wrapper.find("Tooltip").prop("message")).toEqual("2 dead");
  });

  it("handles a degraded controller", () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.DEGRADED,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.DEGRADED,
        }),
      ],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ControllerStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Icon").prop("name")).toEqual("warning");
    expect(wrapper.find("Tooltip").prop("message")).toEqual("2 degraded");
  });

  it("handles a running controller", () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.RUNNING,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.RUNNING,
        }),
      ],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ControllerStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Icon").prop("name")).toEqual("success");
    expect(wrapper.find("Tooltip").prop("message")).toEqual("2 running");
  });

  it("handles a powered off controller", () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.OFF,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.OFF,
        }),
      ],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ControllerStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Icon").prop("name")).toEqual("power-off");
    expect(wrapper.find("Tooltip").prop("message")).toEqual("2 off");
  });

  it("handles a controller with unknown status", () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: ServiceStatus.UNKNOWN,
        }),
        serviceFactory({
          id: 2,
          status: ServiceStatus.UNKNOWN,
        }),
      ],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <ControllerStatus systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Icon").prop("name")).toEqual("power-unknown");
    expect(wrapper.find("Tooltip").exists()).toBe(false);
  });
});
