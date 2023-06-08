import reduxToolkit from "@reduxjs/toolkit";
import configureStore from "redux-mock-store";

import MachineHeader from "./MachineHeader";

import { MachineHeaderViews } from "app/machines/constants";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { PowerState } from "app/store/types/enum";
import { NodeActions } from "app/store/types/node";
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
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("MachineHeader", () => {
  let state: RootState;
  beforeEach(() => {
    jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({ fqdn: "test-machine", system_id: "abc123" }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays a spinner when loading", () => {
    state.machine.items = [];

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    expect(
      screen.getByRole("heading", { name: /loading/i })
    ).toBeInTheDocument();
  });

  it("displays a spinner when loading the details version of the machine", () => {
    state.machine.items = [machineFactory({ system_id: "abc123" })];

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    expect(
      screen.getByRole("heading", { name: /loading/i })
    ).toBeInTheDocument();
  });

  it("displays machine name if an action is selected", () => {
    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={{ view: MachineHeaderViews.DEPLOY_MACHINE }}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    expect(
      screen.getByRole("heading", { name: "test-machine" })
    ).toBeInTheDocument();
  });

  it("displays an icon when locked", () => {
    state.machine.items[0].locked = true;

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    expect(screen.getByRole("button", { name: /locked/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /locked/i })).toHaveClass(
      "has-icon"
    );
  });

  it("displays power status", () => {
    state.machine.items[0].power_state = PowerState.ON;

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    expect(screen.getByText(/power on/i)).toBeInTheDocument();
  });

  it("displays power status when checking power", () => {
    state.machine.statuses["abc123"] = machineStatusFactory({
      checkingPower: true,
    });

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    expect(screen.getByText(/checking power/i)).toBeInTheDocument();
  });

  describe("power menu", () => {
    it("can dispatch the check power action", async () => {
      state.machine.items[0].actions = [];
      const store = mockStore(state);

      renderWithBrowserRouter(
        <MachineHeader
          setSidePanelContent={jest.fn()}
          sidePanelContent={null}
          systemId="abc123"
        />,
        { store, route: "/machine/abc123" }
      );

      await userEvent.click(
        screen.getByRole("button", { name: /take action:/i })
      );
      await userEvent.click(
        screen.getByRole("button", { name: /check power/i })
      );

      expect(
        store
          .getActions()
          .some((action) => action.type === "machine/checkPower")
      ).toBe(true);
    });
  });

  it("includes a tab for instances if machine has any", () => {
    state.machine.items[0] = machineDetailsFactory({
      devices: [machineDeviceFactory()],
      system_id: "abc123",
    });

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    expect(
      screen.getByRole("link", { name: /instances/i })
    ).toBeInTheDocument();
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
          }),
        ],
      }),
    });

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { state, route: "/machine/abc123" }
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: new RegExp(`${state.machine.items[0].hostname}.maas`),
      })
    );
    expect(
      screen.queryByTestId("section-header-subtitle")
    ).not.toBeInTheDocument();
  });

  it("shouldn't need confirmation before locking a machine", async () => {
    state.machine.items[0].actions = [NodeActions.LOCK];
    state.machine.items[0].permissions = ["edit", "delete"];
    const store = mockStore(state);

    renderWithBrowserRouter(
      <MachineHeader
        setSidePanelContent={jest.fn()}
        sidePanelContent={null}
        systemId="abc123"
      />,
      { store, route: "/machine/abc123" }
    );

    await userEvent.click(screen.getByRole("switch", { name: /lock/i }));

    expect(
      screen.queryByRole("complementary", {
        name: /lock/i,
      })
    ).not.toBeInTheDocument();
    const expectedAction = machineActions.lock(
      {
        filter: { id: [state.machine.items[0].system_id] },
      },
      "123456"
    );

    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
