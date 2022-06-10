import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDClusterHostSettings from "./LXDClusterHostSettings";

import KVMConfigurationCard from "app/kvm/components/KVMConfigurationCard";
import type { RootState } from "app/store/root/types";
import {
  podDetails as podDetailsFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterHostSettings", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [podDetailsFactory({ id: 1, name: "pod1" })],
        loaded: true,
      }),
    });
  });

  it("displays a spinner if data is loading", () => {
    state.pod.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <LXDClusterHostSettings clusterId={2} hostId={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("has a disabled zone field", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <LXDClusterHostSettings clusterId={2} hostId={1} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(KVMConfigurationCard).prop("zoneDisabled")).toBe(true);
  });
});
