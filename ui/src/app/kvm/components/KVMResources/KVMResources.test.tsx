import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMResources from "./KVMResources";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMResources", () => {
  it("shows a spinner if pods have not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <KVMResources id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("shows an overall resources card and project name if viewing a LXD pod", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            power_parameters: powerParametersFactory({
              project: "blair-witch",
            }),
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <KVMResources id={1} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("OverallResourcesCard").exists()).toBe(true);
    expect(wrapper.find("[data-test='resources-title']").text()).toBe(
      "blair-witch"
    );
  });

  it("does not show overall resources card or project name if viewing a non-LXD pod", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            type: PodType.VIRSH,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <KVMResources id={1} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("OverallResourcesCard").exists()).toBe(false);
    expect(wrapper.find("[data-test='resources-title']").text()).toBe("");
  });
});
