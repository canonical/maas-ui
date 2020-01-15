import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import FabricColumn from "./FabricColumn";

const mockStore = configureStore();

describe("FabricColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: []
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
            vlan: {
              id: 1,
              name: "Default VLAN",
              fabric_id: 0,
              fabric_name: "fabric-0"
            }
          }
        ]
      }
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("FabricColumn")).toMatchSnapshot();
  });

  it("displays the fabric name", () => {
    state.machine.items[0].vlan.fabric_name = "fabric-2";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="fabric"]').text()).toEqual("fabric-2");
  });

  it("displays '-' with no fabric present", () => {
    state.machine.items[0].vlan = {};
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="fabric"]').text()).toEqual("-");
  });

  it("displays VLAN name", () => {
    state.machine.items[0].vlan.name = "Wombat";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <FabricColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="vlan"]').text()).toEqual("Wombat");
  });
});
