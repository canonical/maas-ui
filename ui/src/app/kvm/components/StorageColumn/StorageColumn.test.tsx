import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import StorageColumn from "./StorageColumn";

import {
  pod as podFactory,
  podResource as podResourceFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StorageColumn", () => {
  it("displays correct storage information", () => {
    const pod = podFactory({
      id: 1,
      name: "pod-1",
      resources: podResourcesFactory({
        storage: podResourceFactory({
          allocated_other: 30000000000,
          allocated_tracked: 70000000000,
          free: 900000000000,
        }),
      }),
    });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <StorageColumn
          defaultPoolID={pod.default_storage_pool}
          podId={1}
          storage={pod.resources.storage}
        />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "0.1 of 1 TB allocated"
    );
    expect(wrapper.find("Meter").props().max).toBe(1000000000000);
  });
});
