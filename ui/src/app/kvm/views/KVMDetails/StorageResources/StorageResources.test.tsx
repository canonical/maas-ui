import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import StorageResources from "./StorageResources";

import {
  pod as podFactory,
  podHint as podHintFactory,
  podState as podStateFactory,
  podStoragePool as storagePoolFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StorageResources", () => {
  it("renders", () => {
    const storagePools = [
      storagePoolFactory({ id: "a", total: 3, used: 1 }),
      storagePoolFactory({ id: "b", total: 5, used: 3 }),
    ];
    const pod = podFactory({
      default_storage_pool: storagePools[0].id,
      id: 1,
      storage_pools: storagePools,
      total: podHintFactory({ local_storage: 8 }),
      used: podHintFactory({ local_storage: 4 }),
    });
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [pod],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <StorageResources id={1} />
      </Provider>
    );

    expect(wrapper.find("StorageResources")).toMatchSnapshot();
  });
});
