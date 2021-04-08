import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import LxdResources from "./LxdResources";

import * as hooks from "app/base/hooks";
import {
  config as configFactory,
  configState as configStateFactory,
  pod as podFactory,
  podNuma as podNumaFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("LxdResources", () => {
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
          <LxdResources id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("can view resources by NUMA node if pod includes data on at least one node", async () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({ numa: [podNumaFactory()] }),
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
            component={() => <LxdResources id={1} />}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("input[data-test='numa-switch']").exists()).toBe(true);
    expect(wrapper.find("ProjectResourcesCard").exists()).toBe(true);
    expect(wrapper.find("NumaResources").exists()).toBe(false);

    wrapper
      .find("input[data-test='numa-switch']")
      .simulate("change", { target: { checked: true } });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("ProjectResourcesCard").exists()).toBe(false);
    expect(wrapper.find("NumaResources").exists()).toBe(true);
  });

  it("can send an analytics event when toggling NUMA node view if analytics enabled", async () => {
    const state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: "enable_analytics",
            value: true,
          }),
        ],
      }),
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({ numa: [podNumaFactory()] }),
          }),
        ],
      }),
    });
    const useSendMock = jest.spyOn(hooks, "useSendAnalytics");
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm/1", key: "testKey" }]}>
          <Route
            exact
            path="/kvm/:id"
            component={() => <LxdResources id={1} />}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("input[data-test='numa-switch']")
      .simulate("change", { target: { checked: true } });
    await waitForComponentToPaint(wrapper);

    expect(useSendMock).toHaveBeenCalled();
    useSendMock.mockRestore();
  });
});
