import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import { PowerColumn } from "./PowerColumn";

import { PowerTypeNames } from "app/store/general/constants";
import { PowerState } from "app/store/types/enum";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("PowerColumn", () => {
  let state;

  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
            power_state: PowerState.ON,
            power_type: PowerTypeNames.VIRSH,
          }),
        ],
      }),
    });
  });

  it("renders correctly", () => {
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("displays the correct power state", () => {
    state.machine.items[0].power_state = PowerState.OFF;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(screen.getByTestId("power_state")).toHaveTextContent("off");
  });

  it("displays the correct power type", () => {
    state.machine.items[0].power_type = "manual";
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(screen.getByTestId("power_type")).toHaveTextContent("manual");
  });

  it("can show a menu item to turn a machine on", () => {
    state.machine.items[0].actions = [NodeActions.ON];
    state.machine.items[0].power_state = PowerState.OFF;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(
      screen.getByLabelText("power_menu_toggle_button")
    ).toBeInTheDocument();
    screen.getByLabelText("power_menu_toggle_button").click();

    expect(screen.getByText("Turn on")).toBeInTheDocument();
  });

  it("can show a menu item to turn a machine off", () => {
    state.machine.items[0].actions = [NodeActions.OFF];
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(
      screen.getByLabelText("power_menu_toggle_button")
    ).toBeInTheDocument();
    screen.getByLabelText("power_menu_toggle_button").click();

    expect(screen.getByText("Turn off")).toBeInTheDocument();
  });

  it("can show a menu item to check power", () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(
      screen.getByLabelText("power_menu_toggle_button")
    ).toBeInTheDocument();
    screen.getByLabelText("power_menu_toggle_button").click();

    expect(screen.getByText("Check power")).toBeInTheDocument();
  });

  it("can show a message when there are no menu items", () => {
    state.machine.items[0].power_state = PowerState.UNKNOWN;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(
      screen.getByLabelText("power_menu_toggle_button")
    ).toBeInTheDocument();
    screen.getByLabelText("power_menu_toggle_button").click();

    expect(screen.getByText("No power actions available")).toBeInTheDocument();
  });

  it("does not render table menu if onToggleMenu not provided", () => {
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <PowerColumn systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(
      screen.queryByLabelText("power_menu_toggle_button")
    ).not.toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("shows a status tooltip if machine power is in error state", () => {
    state.machine.items[0].power_state = PowerState.ERROR;
    state.machine.items[0].status_message = "It's not working";
    const store = mockStore(state);
    renderWithBrowserRouter(
      <PowerColumn onToggleMenu={jest.fn()} systemId="abc123" />,
      { route: "/machines", store }
    );

    expect(screen.getByLabelText("power_status_tooltip")).toHaveAttribute(
      "data-tooltip",
      "It's not working"
    );
  });
});
