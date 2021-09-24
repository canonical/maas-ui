import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMConfiguration from "../KVMConfiguration";

import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podFactory,
  podPowerParameters as powerParametersFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMConfigurationFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({ items: [], loaded: true }),
    });
  });

  it("correctly sets initial values for virsh pods", () => {
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
        power_address: "abc123",
        power_pass: "maxpower",
      }),
      type: PodType.VIRSH,
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <KVMConfiguration pod={pod} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input[name='type']").props().value).toBe("Virsh");
    expect(wrapper.find("Select[name='zone']").props().value).toEqual(pod.zone);
    expect(wrapper.find("Select[name='pool']").props().value).toEqual(pod.pool);
    expect(wrapper.find("TagSelector[name='tags']").props().value).toEqual(
      pod.tags
    );
    expect(wrapper.find("Input[name='power_address']").props().value).toBe(
      pod.power_parameters.power_address
    );
    expect(wrapper.find("Input[name='power_pass']").props().value).toBe(
      pod.power_parameters.power_pass
    );
    expect(
      wrapper.find("Slider[name='cpu_over_commit_ratio']").props().value
    ).toBe(pod.cpu_over_commit_ratio);
    expect(
      wrapper.find("Slider[name='memory_over_commit_ratio']").props().value
    ).toBe(pod.memory_over_commit_ratio);
  });

  it("correctly sets initial values for lxd pods", () => {
    const pod = podFactory({
      id: 1,
      power_parameters: powerParametersFactory({
        power_address: "abc123",
      }),
      type: PodType.LXD,
    });
    state.pod.items = [pod];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/edit", key: "testKey" }]}
        >
          <KVMConfiguration pod={pod} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Input[name='type']").props().value).toBe("LXD");
    expect(wrapper.find("Select[name='zone']").props().value).toEqual(pod.zone);
    expect(wrapper.find("Select[name='pool']").props().value).toEqual(pod.pool);
    expect(wrapper.find("TagSelector[name='tags']").props().value).toEqual(
      pod.tags
    );
    expect(wrapper.find("Input[name='power_address']").props().value).toBe(
      pod.power_parameters.power_address
    );
    expect(wrapper.find("Input[name='power_pass']").exists()).toBe(false);
    expect(
      wrapper.find("Slider[name='cpu_over_commit_ratio']").props().value
    ).toBe(pod.cpu_over_commit_ratio);
    expect(
      wrapper.find("Slider[name='memory_over_commit_ratio']").props().value
    ).toBe(pod.memory_over_commit_ratio);
  });
});
