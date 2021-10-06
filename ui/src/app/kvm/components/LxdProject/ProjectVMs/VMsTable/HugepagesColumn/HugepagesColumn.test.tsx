import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import HugepagesColumn from "./HugepagesColumn";

import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVM as podVMFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("HugepagesColumn", () => {
  it("can show if a VM is backed by hugepages", () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        vms: [
          podVMFactory({
            hugepages_backed: true,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const state = rootStateFactory({
      pod: podStateFactory({ items: [pod] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <HugepagesColumn machineId="abc123" podId={1} />
      </Provider>
    );

    expect(wrapper.text()).toBe("Enabled");
  });

  it("can show if a VM is not backed by hugepages", () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        vms: [
          podVMFactory({
            hugepages_backed: false,
            system_id: "abc123",
          }),
        ],
      }),
    });
    const state = rootStateFactory({
      pod: podStateFactory({ items: [pod] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <HugepagesColumn machineId="abc123" podId={1} />
      </Provider>
    );

    expect(wrapper.text()).toBe("");
  });
});
