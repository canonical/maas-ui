import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";
import React from "react";

import * as hooks from "app/base/hooks";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import MachineStorage from "./MachineStorage";
import { act } from "react-dom/test-utils";

const mockStore = configureStore();

describe("MachineStorage", () => {
  it("displays a spinner if machine is loading", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineStorage />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("sends an analytics event when clicking on the MAAS docs footer link", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const mockSendAnalytics = jest.fn();
    const mockUseSendAnalytics = (hooks.useSendAnalytics = jest.fn(
      () => mockSendAnalytics
    ));
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machine/abc123/storage", key: "testKey" },
          ]}
        >
          <Route
            exact
            path="/machine/:id/storage"
            component={() => <MachineStorage />}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("[data-test='docs-footer-link']").simulate("click");
    });
    wrapper.update();

    expect(mockSendAnalytics).toHaveBeenCalled();
    expect(mockSendAnalytics.mock.calls[0]).toEqual([
      "Machine storage",
      "Click link to MAAS docs",
      "Windows",
    ]);

    mockUseSendAnalytics.mockRestore();
  });
});
