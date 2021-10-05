import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NameColumn from "./NameColumn";

import kvmURLs from "app/kvm/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NameColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory();
  });

  it("can display a link to Virsh pod's details page", () => {
    const state = { ...initialState };
    state.pod.items = [
      podFactory({ id: 1, name: "pod-1", type: PodType.VIRSH }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <NameColumn id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Link").text()).toBe("pod-1");
    expect(wrapper.find("Link").props().to).toBe(
      kvmURLs.virsh.details.index({ id: 1 })
    );
  });

  it("can display a link to a LXD pod's details page", () => {
    const state = { ...initialState };
    state.pod.items = [podFactory({ id: 1, name: "pod-1", type: PodType.LXD })];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <NameColumn id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Link").text()).toBe("pod-1");
    expect(wrapper.find("Link").props().to).toBe(
      kvmURLs.lxd.single.index({ id: 1 })
    );
  });

  it("shows the project name for LXD pods", () => {
    const state = { ...initialState };
    state.pod.items = [
      podFactory({
        id: 1,
        name: "pod-1",
        power_parameters: powerParametersFactory({
          project: "group-project",
        }),
        type: PodType.LXD,
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <NameColumn id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='power-address']").exists()).toBe(false);
    expect(wrapper.find("[data-test='project']").text()).toBe("group-project");
  });

  it("show's the power address for virsh pods", () => {
    const state = { ...initialState };
    state.pod.items = [
      podFactory({
        id: 1,
        name: "pod-1",
        power_parameters: powerParametersFactory({
          power_address: "172.0.0.1",
        }),
        type: PodType.VIRSH,
      }),
    ];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <NameColumn id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='project']").exists()).toBe(false);
    expect(wrapper.find("[data-test='power-address']").text()).toBe(
      "172.0.0.1"
    );
  });
});
