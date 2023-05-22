import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { ZoneColumn } from "./ZoneColumn";

import { NodeActions } from "app/store/types/node";
import {
  rootState as rootStateFactory,
  zoneState as zoneStateFactory,
  machineState as machineStateFactory,
  machine as machineFactory,
  zone as zoneFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore();

describe("ZoneColumn", () => {
  let state;
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
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(
      screen.getByRole("columnheader", { name: "Zone" })
    ).toBeInTheDocument();
  });

  it("displays the zone name", () => {
    state.machine.items[0].zone.name = "zone-one";
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("zone")).toHaveTextContent("zone-one");
  });

  it("displays single space name", () => {
    state.machine.items[0].spaces = ["space1"];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("spaces")).toHaveTextContent("space1");
  });

  it("displays spaces count for multiple spaces", () => {
    state.machine.items[0].spaces = ["space1", "space2"];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByTestId("spaces")).toHaveTextContent("2 spaces");
  });

  it("displays a sorted Tooltip for multiple spaces", () => {
    state.machine.items[0].spaces = ["space2", "space1", "space3"];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
    userEvent.hover(screen.getByTestId("spaces"));
    expect(screen.queryByText("space1")).toBeInTheDocument();
    expect(screen.queryByText("space2")).toBeInTheDocument();
    expect(screen.queryByText("space3")).toBeInTheDocument();
  });

  it("displays a message if the machine cannot have its zone changed", () => {
    state.machine.items[0].actions = [];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    const items = screen.getAllByRole("menuitem");
    expect(items[0]).toBeDisabled();
  });

  it("can change zones", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    userEvent.click(screen.getByRole("button", { name: "More" }));
    userEvent.click(screen.getByTestId("change-zone-link"));
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

  it("shows a spinner when changing zones", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    userEvent.click(screen.getByRole("button", { name: "More" }));
    userEvent.click(screen.getByTestId("change-zone-link"));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(<ZoneColumn systemId="abc123" />, {
      route: "/machines",
      store,
    });
    expect(screen.queryByText("More")).not.toBeInTheDocument();
  });
});
