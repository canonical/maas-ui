import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import VMsColumn from "./VMsColumn";

import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VMsColumn", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            composed_machines_count: 10,
            owners_count: 5,
          }),
        ],
      }),
    });
  });

  it("displays the pod's VM count", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-machines-count']").text()).toBe("10");
  });

  it("shows the pod version for LXD pods", () => {
    state.pod.items = [
      podFactory({ id: 1, type: PodType.LXD, version: "1.2.3" }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <VMsColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-version']").text()).toBe("1.2.3");
  });
});
