import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LxdTable from "./LxdTable";

import { PodType } from "app/store/pod/constants";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LxdTable", () => {
  it("displays a spinner while loading", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        loading: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdTable />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner[data-test='loading-table']").exists()).toBe(
      true
    );
  });

  it("displays the table when loaded", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            type: PodType.LXD,
          }),
        ],
        loading: false,
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdTable />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("LxdKVMHostTable").exists()).toBe(true);
  });
});
