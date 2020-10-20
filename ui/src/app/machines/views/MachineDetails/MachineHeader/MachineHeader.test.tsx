import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import MachineHeader from "./MachineHeader";
import type { RootState } from "app/store/root/types";

const mockStore = configureStore();

describe("MachineHeader", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MachineHeader")).toMatchSnapshot();
  });
});
