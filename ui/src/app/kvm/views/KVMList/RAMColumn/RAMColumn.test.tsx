import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import RAMColumn from "./RAMColumn";

import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podMemoryResource as podMemoryResourceFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RAMColumn", () => {
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

  it("can display correct memory information without overcommit", () => {
    pod.memory_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_other: 1,
          allocated_tracked: 2,
          free: 3,
        }),
        hugepages: podResourceFactory({
          allocated_other: 4,
          allocated_tracked: 5,
          free: 6,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <RAMColumn id={pod.id} />
      </Provider>
    );
    // Allocated tracked = 2 + 5 = 7
    // Total = (1 + 2 + 3) + (4 + 5 + 6) = 6 + 15 = 21
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "7 of 21B allocated"
    );
    expect(wrapper.find("Meter").prop("max")).toBe(21);
  });

  it("can display correct memory information with overcommit", () => {
    pod.memory_over_commit_ratio = 2;
    pod.resources = podResourcesFactory({
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_other: 1,
          allocated_tracked: 2,
          free: 3,
        }),
        hugepages: podResourceFactory({
          allocated_other: 4,
          allocated_tracked: 5,
          free: 6,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <RAMColumn id={1} />
      </Provider>
    );
    // Allocated tracked = 2 + 5 = 7
    // Hugepages do not take overcommit into account, so
    // Total = ((1 + 2 + 3) * 2) + (4 + 5 + 6) = 12 + 15 = 27
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "7 of 27B allocated"
    );
    expect(wrapper.find("Meter").prop("max")).toBe(27);
  });

  it("can display when memory has been overcommitted", () => {
    pod.memory_over_commit_ratio = 1;
    pod.resources = podResourcesFactory({
      memory: podMemoryResourceFactory({
        general: podResourceFactory({
          allocated_other: 0,
          allocated_tracked: 2,
          free: -1,
        }),
        hugepages: podResourceFactory({
          allocated_other: 0,
          allocated_tracked: 5,
          free: -1,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <RAMColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='meter-overflow']").exists()).toBe(true);
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "7 of 5B allocated"
    );
    expect(wrapper.find("Meter").prop("max")).toBe(5);
  });
});
