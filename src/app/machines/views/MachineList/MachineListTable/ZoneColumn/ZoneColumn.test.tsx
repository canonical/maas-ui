import configureStore from "redux-mock-store";

import { ZoneColumn } from "./ZoneColumn";

import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ZoneColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({
            system_id: "abc123",
            zone: { name: "zone-north", id: 0 },
            spaces: ["management"],
            actions: [NodeActions.SET_ZONE],
          }),
        ],
      }),
      zone: factory.zoneState({
        items: [
          factory.zone({
            id: 0,
            name: "default",
          }),
          factory.zone({
            id: 1,
            name: "Backup",
          }),
        ],
      }),
    });
  });

  it("displays the zone name", () => {
    state.machine.items[0].zone.name = "zone-one";

    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getByTestId("zone")).toHaveTextContent("zone-one");
  });

  it("displays single space name", () => {
    state.machine.items[0].spaces = ["space1"];

    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getByTestId("spaces")).toHaveTextContent("space1");
  });

  it("displays spaces count for multiple spaces", () => {
    state.machine.items[0].spaces = ["space1", "space2"];

    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );
    expect(screen.getByTestId("spaces")).toHaveTextContent("2 spaces");
  });

  it("displays a sorted Tooltip for multiple spaces", async () => {
    state.machine.items[0].spaces = ["space2", "space1", "space3"];

    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    await userEvent.hover(screen.getByTestId("spaces"));
    await vi.waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent(
        /space1 space2 space3/i
      );
    });
  });

  it("displays a message if the machine cannot have its zone changed", async () => {
    state.machine.items[0].actions = [];

    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );
    await userEvent.click(screen.getByRole("button", { name: "Change AZ:" }));

    expect(
      screen.getByRole("button", { name: "Cannot change zone of this machine" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("can change zones", async () => {
    const store = mockStore(state);

    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );
    await userEvent.click(screen.getByRole("button", { name: "Change AZ:" }));
    await userEvent.click(screen.getByTestId("change-zone-link"));

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
    renderWithBrowserRouter(
      <ZoneColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );
    await userEvent.click(screen.getByRole("button", { name: "Change AZ:" }));
    await userEvent.click(screen.getByTestId("change-zone-link"));
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    renderWithBrowserRouter(<ZoneColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });
    expect(
      screen.queryByRole("button", { name: "Change AZ:" })
    ).not.toBeInTheDocument();
  });
});
