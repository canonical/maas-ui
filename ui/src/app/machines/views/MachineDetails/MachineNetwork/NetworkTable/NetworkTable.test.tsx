import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NetworkTable from "./NetworkTable";

import type { RootState } from "app/store/root/types";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("NetworkTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
      }),
    });
  });
  it("displays a spinner when loading", () => {
    state.machine.items = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a table when loading", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <NetworkTable systemId="abc123" />
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });
});
