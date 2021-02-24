import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KVMList from "./KVMList";

import { PodType } from "app/store/pod/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("KVMList", () => {
  it("correctly fetches the necessary data", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["pod/fetch", "resourcepool/fetch", "zone/fetch"];
    const actualActions = store.getActions();
    expect(
      expectedActions.every((expectedAction) =>
        actualActions.some((action) => action.type === expectedAction)
      )
    ).toBe(true);
  });

  it("shows a LXD table if there are any LXD pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.LXD })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='lxd-table']").exists()).toBe(true);
  });

  it("shows a virsh table if there are any virsh pods", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ type: PodType.VIRSH })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <KVMList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='virsh-table']").exists()).toBe(true);
  });
});
