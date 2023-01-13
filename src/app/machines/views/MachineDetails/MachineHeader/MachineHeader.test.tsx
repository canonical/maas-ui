import userEvent from "@testing-library/user-event";

import MachineHeader from "./MachineHeader";

import { MachineHeaderViews } from "app/machines/constants";
import type { RootState } from "app/store/root/types";
import { PowerState } from "app/store/types/enum";
import {
  generalState as generalStateFactory,
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineDevice as machineDeviceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, within } from "testing/utils";

describe("MachineHeader", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [machineDetailsFactory({ system_id: "abc123" })],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it("displays a spinner when loading the details version of the machine", () => {
    state.machine.items = [machineFactory({ system_id: "abc123" })];
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it("displays action title if an action is selected", () => {
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );
    expect(screen.getByTestId("section-header-title")).toHaveTextContent(
      "Deploy"
    );
  });

  it("displays an icon when locked", () => {
    state.machine.items[0].locked = true;
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );
    expect(
      screen.getByRole("tooltip", {
        name: /This machine is locked. You have to unlock it to perform any actions./,
      })
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("section-header-subtitle")).getByRole("button")
        .childNodes[0]
    ).toHaveClass("p-icon--locked");
  });

  it("displays power status", () => {
    state.machine.items[0].power_state = PowerState.ON;
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );
    const powerStateMessage = within(
      screen.getByTestId("section-header-subtitle")
    ).getByText("Power on");

    expect(powerStateMessage).toBeInTheDocument();
    expect(powerStateMessage.childNodes[0]).toHaveClass("p-icon--power-on");
  });

  it("displays power status when checking power", () => {
    state.machine.statuses["abc123"] = machineStatusFactory({
      checkingPower: true,
    });
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );
    const powerStateMessage = within(
      screen.getByTestId("section-header-subtitle")
    ).getByText("Checking power");

    expect(powerStateMessage).toBeInTheDocument();
    expect(powerStateMessage.childNodes[0]).toHaveClass("p-icon--spinner");
  });

  it("includes a tab for instances if machine has any", () => {
    state.machine.items[0] = machineDetailsFactory({
      devices: [machineDeviceFactory()],
      system_id: "abc123",
    });
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );
    expect(screen.getByRole("link", { name: "Instances" })).toBeInTheDocument();
  });

  it("hides the subtitle when editing the name", async () => {
    state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
            fqdn: "a-lovely-name",
          }),
        ],
      }),
    });
    renderWithBrowserRouter(
      <MachineHeader
        headerContent={null}
        setHeaderContent={jest.fn()}
        systemId="abc123"
      />,
      { route: "/machine/abc123", state }
    );

    await userEvent.click(
      screen.getByRole("button", { name: "a-lovely-name" })
    );

    expect(
      screen.queryByTestId("section-header-subtitle")
    ).not.toBeInTheDocument();
  });
});
