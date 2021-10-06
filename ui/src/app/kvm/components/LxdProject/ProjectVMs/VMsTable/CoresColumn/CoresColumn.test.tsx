import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CoresColumn from "./CoresColumn";

import {
  pod as podFactory,
  podResources as podResourcesFactory,
  podState as podStateFactory,
  podVM as podVMFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("CoresColumn", () => {
  it("can show the pinned cores of a VM", () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        vms: [
          podVMFactory({
            pinned_cores: [0, 1, 2, 4],
            system_id: "abc123",
            unpinned_cores: 0,
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
        <CoresColumn machineId="abc123" podId={1} />
      </Provider>
    );

    expect(wrapper.find("DoubleRow").prop("primary")).toBe("0-2, 4");
    expect(wrapper.find("DoubleRow").prop("secondary")).toBe("pinned");
  });

  it("can show the unpinned cores of a VM", () => {
    const pod = podFactory({
      id: 1,
      resources: podResourcesFactory({
        vms: [
          podVMFactory({
            pinned_cores: [],
            system_id: "abc123",
            unpinned_cores: 4,
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
        <CoresColumn machineId="abc123" podId={1} />
      </Provider>
    );

    expect(wrapper.find("DoubleRow").prop("primary")).toBe("Any 4");
    expect(wrapper.find("DoubleRow").prop("secondary")).toBe("");
  });
});
