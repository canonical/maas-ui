import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMsColumn from "./VMsColumn";

import { PodType } from "app/store/pod/types";
import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVmCount as podVmCountFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMsColumn", () => {
  it("displays the pod's tracked VMs", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            resources: podResourcesFactory({
              vm_count: podVmCountFactory({ tracked: 10 }),
            }),
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-machines-count']").text()).toBe("10");
  });

  it("shows the pod version for LXD pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1, type: PodType.LXD, version: "1.2.3" })],
      }),
    });

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-version']").text()).toBe("1.2.3");
  });
});
