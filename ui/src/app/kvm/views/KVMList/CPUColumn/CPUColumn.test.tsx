import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CPUColumn from "./CPUColumn";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CPUColumn", () => {
  let state: RootState;
  let pod: Pod;

  beforeEach(() => {
    pod = podFactory({
      id: 1,
      name: "pod-1",
    });
    state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
  });

  it("can display correct cpu core information without overcommit", () => {
    pod.cpu_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_other: 0,
        allocated_tracked: 4,
        free: 4,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CPUColumn id={pod.id} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "4 of 8 allocated"
    );
    expect(wrapper.find("Meter").prop("max")).toBe(8);
  });

  it("can display correct cpu core information with overcommit", () => {
    pod.cpu_over_commit_ratio = 2;
    pod.resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_other: 0,
        allocated_tracked: 4,
        free: 4,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CPUColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "4 of 16 allocated"
    );
    expect(wrapper.find("Meter").prop("max")).toBe(16);
  });

  it("can display when cpu has been overcommitted", () => {
    pod.cpu_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      cores: podResourceFactory({
        allocated_other: 0,
        allocated_tracked: 4,
        free: -1,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CPUColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='meter-overflow']").exists()).toBe(true);
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "4 of 3 allocated"
    );
    expect(wrapper.find("Meter").prop("max")).toBe(3);
  });
});
