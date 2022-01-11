import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { ControllerStatus } from "./ControllerStatus";

import type { RootState } from "app/store/root/types";
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
          status: "dead",
        }),
        serviceFactory({
          id: 2,
          status: "dead",
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
    expect(wrapper.find("Icon").prop("title")).toEqual("2 dead");
  });

  it("handles a degraded controller", () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: "degraded",
        }),
        serviceFactory({
          id: 2,
          status: "degraded",
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
    expect(wrapper.find("Icon").prop("title")).toEqual("2 degraded");
  });

  it("handles a running controller", () => {
    state.service = serviceStateFactory({
      items: [
        serviceFactory({
          id: 1,
          status: "success",
        }),
        serviceFactory({
          id: 2,
          status: "success",
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
    expect(wrapper.find("Icon").prop("title")).toEqual("2 running");
  });
});
