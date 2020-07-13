import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import { ZoneColumn } from "./ZoneColumn";

const mockStore = configureStore();

describe("ZoneColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
            zone: { name: "zone-north", id: 0 },
            spaces: ["management"],
            actions: ["set-zone"],
          },
        ],
      },
      zone: {
        loaded: true,
        items: [
          {
            id: 0,
            name: "default",
          },
          {
            id: 1,
            name: "Backup",
          },
        ],
      },
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("ZoneColumn")).toMatchSnapshot();
  });

  it("displays the zone name", () => {
    state.machine.items[0].zone.name = "zone-one";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="zone"]').text()).toEqual("zone-one");
  });

  it("displays single space name", () => {
    state.machine.items[0].spaces = ["space1"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="spaces"]').text()).toEqual("space1");
  });

  it("displays spaces count for multiple spaces", () => {
    state.machine.items[0].spaces = ["space1", "space2"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="spaces"]').text()).toEqual("2 spaces");
  });

  it("displays a sorted Tooltip for multiple spaces", () => {
    state.machine.items[0].spaces = ["space2", "space1", "space3"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Tooltip").prop("message")).toEqual(
      "space1\nspace2\nspace3"
    );
  });

  it("displays a message if the machine cannot have its zone changed", () => {
    state.machine.items[0].actions = [];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    const items = wrapper.find("DoubleRow").prop("menuLinks");
    expect(items.length).toBe(1);
    expect(items[0]).toStrictEqual({
      children: "Cannot change zone of this machine",
      disabled: true,
    });
  });

  it("can change zones", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    act(() => {
      wrapper.find("DoubleRow").prop("menuLinks")[0].onClick();
    });
    expect(
      store.getActions().find((action) => action.type === "SET_MACHINE_ZONE")
    ).toEqual({
      type: "SET_MACHINE_ZONE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "set-zone",
          extra: {
            zone_id: 1,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("shows a spinner when changing zones", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(false);
    act(() => {
      wrapper.find("DoubleRow").prop("menuLinks")[0].onClick();
    });
    wrapper.update();
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ZoneColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableMenu").exists()).toBe(false);
  });
});
