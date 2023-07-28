import { PowerColumn } from "./PowerColumn";

import { PowerTypeNames } from "app/store/general/constants";
import type { RootState } from "app/store/root/types";
import { PowerState } from "app/store/types/enum";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

describe("PowerColumn", () => {
  let state: RootState;
  let machine;
  beforeEach(() => {
    machine = machineFactory();
    machine.system_id = "abc123";
    machine.power_state = PowerState.ON;
    machine.power_type = PowerTypeNames.VIRSH;

    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [machine],
      }),
    });
  });

  it("displays the correct power state", () => {
    state.machine.items[0].power_state = PowerState.OFF;

    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    expect(screen.getByTestId("power_state")).toHaveTextContent("off");
  });

  it("displays the correct power type", () => {
    state.machine.items[0].power_type = "manual";

    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    expect(screen.getByTestId("power_type")).toHaveTextContent("manual");
  });

  it("can show a menu item to turn a machine on", async () => {
    state.machine.items[0].actions = [NodeActions.ON];
    state.machine.items[0].power_state = PowerState.OFF;

    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );
    // Open the menu so the elements get rendered.
    await userEvent.click(screen.getByRole("button", { name: "Take action:" }));

    expect(screen.getByText("Turn on")).toBeInTheDocument();
  });

  it("can show a menu item to turn a machine off", async () => {
    state.machine.items[0].actions = [NodeActions.OFF];

    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    // Open the menu so the elements get rendered.
    await userEvent.click(screen.getByRole("button", { name: "Take action:" }));

    expect(screen.getByText("Turn off")).toBeInTheDocument();
  });

  it("can show a menu item to check power", async () => {
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    // Open the menu so the elements get rendered.
    await userEvent.click(screen.getByRole("button", { name: "Take action:" }));

    expect(screen.getByText("Check power")).toBeInTheDocument();
  });

  it("can show a message when there are no menu items", async () => {
    state.machine.items[0].power_state = PowerState.UNKNOWN;

    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    // Open the menu so the elements get rendered.
    await userEvent.click(screen.getByRole("button", { name: "Take action:" }));

    expect(screen.getByText("No power actions available")).toBeInTheDocument();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    renderWithBrowserRouter(<PowerColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });

    expect(
      screen.queryByRole("button", { name: "Take action:" })
    ).not.toBeInTheDocument();
  });

  it("shows a status tooltip if machine power is in error state", () => {
    state.machine.items[0].power_state = PowerState.ERROR;
    state.machine.items[0].status_message = "It's not working";

    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    expect(screen.getByRole("tooltip")).toHaveTextContent("It's not working");
  });
});
