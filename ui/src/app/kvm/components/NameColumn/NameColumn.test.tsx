import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
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
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can display a link to Virsh pod's details page", () => {
    const pod = podFactory({ id: 1, name: "pod-1", type: PodType.VIRSH });
    state.pod.items = [pod];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <NameColumn
              name={pod.name}
              secondary={pod.power_parameters.project}
              url={kvmURLs.virsh.details.index({ id: 1 })}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Link").text()).toBe("pod-1");
    expect(wrapper.find("Link").props().to).toBe(
      kvmURLs.virsh.details.index({ id: 1 })
    );
  });

  it("can display a link to a LXD pod's details page", () => {
    const pod = podFactory({ id: 1, name: "pod-1", type: PodType.LXD });
    state.pod.items = [pod];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <NameColumn
              name={pod.name}
              secondary={pod.power_parameters.project}
              url={kvmURLs.lxd.single.index({ id: 1 })}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Link").text()).toBe("pod-1");
    expect(wrapper.find("Link").props().to).toBe(
      kvmURLs.lxd.single.index({ id: 1 })
    );
  });

  it("can show a secondary row", () => {
    const pod = podFactory({
      id: 1,
      name: "pod-1",
      power_parameters: powerParametersFactory({
        project: "group-project",
      }),
      type: PodType.LXD,
    });
    state.pod.items = [pod];
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <CompatRouter>
            <NameColumn
              name={pod.name}
              secondary={pod.power_parameters.project}
              url={kvmURLs.virsh.details.index({ id: 1 })}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-testid='power-address']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='secondary']").text()).toBe(
      "group-project"
    );
  });
});
