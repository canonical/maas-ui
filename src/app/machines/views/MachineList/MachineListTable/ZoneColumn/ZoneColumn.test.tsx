import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { ZoneColumn } from "./ZoneColumn";

import DoubleRow from "app/base/components/DoubleRow";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ZoneColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            zone: { name: "zone-north", id: 0 },
            spaces: ["management"],
            actions: [NodeActions.SET_ZONE],
          }),
        ],
      }),
      zone: zoneStateFactory({
        items: [
          zoneFactory({
            id: 0,
            name: "default",
          }),
          zoneFactory({
            id: 1,
            name: "Backup",
          }),
        ],
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
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
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="zone"]').text()).toEqual("zone-one");
  });

  it("displays single space name", () => {
    state.machine.items[0].spaces = ["space1"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="spaces"]').text()).toEqual("space1");
  });

  it("displays spaces count for multiple spaces", () => {
    state.machine.items[0].spaces = ["space1", "space2"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-testid="spaces"]').text()).toEqual("2 spaces");
  });

  it("displays a sorted Tooltip for multiple spaces", () => {
    state.machine.items[0].spaces = ["space2", "space1", "space3"];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
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
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const items = wrapper.find(DoubleRow).prop("menuLinks");
    expect(items?.length).toBe(1);
    expect(items && items[0]).toStrictEqual({
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
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    // Open the menu.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    act(() => {
      wrapper.find("[data-testid='change-zone-link']").at(0).simulate("click");
    });
    expect(
      store.getActions().find((action) => action.type === "machine/setZone")
    ).toEqual({
      type: "machine/setZone",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: NodeActions.SET_ZONE,
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
          <CompatRouter>
            <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(false);
    // Open the menu.
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    act(() => {
      wrapper.find("[data-testid='change-zone-link']").at(0).simulate("click");
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
          <CompatRouter>
            <ZoneColumn systemId="abc123" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("TableMenu").exists()).toBe(false);
  });
});
