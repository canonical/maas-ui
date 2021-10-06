import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import StorageResources from "./StorageResources";

import {
  pod as podFactory,
  podState as podStateFactory,
  podStoragePool as storagePoolFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StorageResources", () => {
  it("shows storage pools as meters if there are two or less pools", () => {
    const storagePools = [storagePoolFactory(), storagePoolFactory()];
    const pod = podFactory({
      id: 1,
      storage_pools: storagePools,
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

    expect(wrapper.find("StorageMeters").exists()).toBe(true);
    expect(wrapper.find("StorageCards").exists()).toBe(false);
  });

  it("shows storage pools as cards if there are three or more pools", () => {
    const storagePools = [
      storagePoolFactory(),
      storagePoolFactory(),
      storagePoolFactory(),
    ];
    const pod = podFactory({
      id: 1,
      storage_pools: storagePools,
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

    expect(wrapper.find("StorageCards").exists()).toBe(true);
    expect(wrapper.find("StorageMeters").exists()).toBe(false);
  });
});
