import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
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
        loaded: true,
        items: [machineFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("includes a tab for instances if machine has any", () => {
    state.machine.items[0] = machineDetailsFactory({
      devices: [machineDeviceFactory()],
      system_id: "abc123",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <Route
            exact
            path="/machine/:id"
            component={() => (
              <MachineHeader
                selectedAction={null}
                setSelectedAction={jest.fn()}
              />
            )}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find(".p-tabs__item").at(1).text()).toBe("Instances");
  });
});
