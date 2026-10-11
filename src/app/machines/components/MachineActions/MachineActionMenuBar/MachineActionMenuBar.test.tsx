import MachineActionMenuBar from "./MachineActionMenuBar";

import RequireEntitlements from "@/app/base/components/RequireEntitlements";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import type { RootState } from "@/app/store/root/types";
import { NodeActions, NodeStatus } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  within,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("MachineActionMenuBar", () => {
  let state: RootState;

  const openMenu = async (name: string) => {
    await userEvent.click(screen.getByRole("button", { name: name }));
  };

  const getSubMenu = (name: string) => screen.getByLabelText(`${name} submenu`);

  const getActionButton = (submenu: HTMLElement, name: NodeActions) =>
    within(submenu).getByRole("menuitem", {
      name: RegExp(getNodeActionTitle(name)),
    });

  const queryActionButton = (submenu: HTMLElement, name: NodeActions) =>
    within(submenu).queryByRole("menuitem", {
      name: RegExp(getNodeActionTitle(name)),
    });

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        items: [factory.machine({ system_id: "abc123" })],
      }),
    });
  });

  it("only shows actions that a given machine can perform when provided a system id", async () => {
    const machine = factory.machine({
      actions: [NodeActions.COMMISSION, NodeActions.DEPLOY],
    });
    state.machine.items = [machine];
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId={machine.system_id} />,
      { state }
    );

    await openMenu("Actions");

    const actionsMenu = getSubMenu("Actions");

    expect(
      getActionButton(actionsMenu, NodeActions.COMMISSION)
    ).toBeInTheDocument();
    expect(
      getActionButton(actionsMenu, NodeActions.DEPLOY)
    ).toBeInTheDocument();
    expect(
      queryActionButton(actionsMenu, NodeActions.ACQUIRE)
    ).not.toBeInTheDocument();
  });

  it("can show disabled actions, even if a machine cannot perform them", async () => {
    const machine = factory.machine({
      actions: [NodeActions.DEPLOY],
    });
    renderWithProviders(
      <MachineActionMenuBar
        disabledActions={[NodeActions.RELEASE]}
        systemId={machine.system_id}
      />,
      { state }
    );

    await openMenu("Actions");

    const actionsMenu = getSubMenu("Actions");

    expect(
      getActionButton(actionsMenu, NodeActions.DEPLOY)
    ).toBeInTheDocument();
    expect(
      queryActionButton(actionsMenu, NodeActions.DEPLOY)
    ).not.toBeAriaDisabled();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeInTheDocument();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeAriaDisabled();
  });

  it("disables actions even when a machine can peform them", async () => {
    const machine = factory.machine({
      actions: [NodeActions.DEPLOY],
    });
    renderWithProviders(
      <MachineActionMenuBar
        disabledActions={[NodeActions.DEPLOY]}
        isViewingDetails
        systemId={machine.system_id}
      />,
      { state }
    );

    await openMenu("Actions");

    const actionsMenu = getSubMenu("Actions");

    expect(
      getActionButton(actionsMenu, NodeActions.DEPLOY)
    ).toBeInTheDocument();
    expect(getActionButton(actionsMenu, NodeActions.DEPLOY)).toBeAriaDisabled();
  });

  it("can exclude actions", async () => {
    renderWithProviders(
      <MachineActionMenuBar excludeActions={[NodeActions.DEPLOY]} />,
      { state }
    );

    await openMenu("Actions");

    const actionsMenu = getSubMenu("Actions");

    expect(
      queryActionButton(actionsMenu, NodeActions.DEPLOY)
    ).not.toBeInTheDocument();
  });

  it("shows all actions that can be performed when machines are not provided", async () => {
    renderWithProviders(<MachineActionMenuBar />, { state });

    await openMenu("Actions");

    const actionsMenu = getSubMenu("Actions");

    [
      NodeActions.ABORT,
      NodeActions.ACQUIRE,
      NodeActions.CLONE,
      NodeActions.COMMISSION,
      NodeActions.DEPLOY,
      NodeActions.RELEASE,
    ].forEach((action) => {
      expect(getActionButton(actionsMenu, action)).toBeInTheDocument();
    });
  });

  it("shows 'Check power' only when viewing machine details and a system id is provided", async () => {
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );
    await openMenu("Power");

    const powerMenu = getSubMenu("Power");

    expect(
      getActionButton(powerMenu, NodeActions.CHECK_POWER)
    ).toBeInTheDocument();
  });

  it("renders a button instead of a contextual menu for 'Delete'", () => {
    renderWithProviders(<MachineActionMenuBar />, { state });

    expect(screen.getByRole("button", { name: "Delete" })).not.toHaveClass(
      "p-contextual-menu__toggle"
    );
  });

  it("renders an icon for buttons that have one", () => {
    renderWithProviders(<MachineActionMenuBar />, { state });

    expect(
      screen.getByRole("button", { name: "Delete" }).firstElementChild
    ).toHaveClass("p-icon--delete");
  });

  it("renders a switch for locking instead of a contexual menu when viewing details and the machine can be locked", () => {
    const machine = factory.machine({
      system_id: "abc123",
      status: NodeStatus.DEPLOYED,
      actions: [NodeActions.LOCK],
    });
    state.machine.items = [machine];
    const { rerender } = renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    expect(screen.getByRole("switch", { name: "Lock" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Lock" })
    ).not.toBeInTheDocument();

    rerender(<MachineActionMenuBar />);

    expect(screen.getByRole("button", { name: "Lock" })).toBeInTheDocument();
    expect(
      screen.queryByRole("switch", { name: "Lock" })
    ).not.toBeInTheDocument();
  });

  it("renders a switch for locking instead of a contexual menu when viewing details and the machine can be unlocked", () => {
    const machine = factory.machine({
      system_id: "abc123",
      status: NodeStatus.DEPLOYED,
      actions: [NodeActions.LOCK],
    });
    state.machine.items = [machine];
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    expect(screen.getByRole("switch", { name: "Lock" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Lock" })
    ).not.toBeInTheDocument();
  });

  it("does not render a switch for locking when viewing details if the machine cannot be locked or unlocked", () => {
    const machine = factory.machine({
      system_id: "abc123",
      status: NodeStatus.DEPLOYED,
      actions: [],
    });
    state.machine.items = [machine];
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    expect(
      screen.queryByRole("switch", { name: "Lock" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Lock" })
    ).not.toBeInTheDocument();
  });
});

describe("MachineActionMenuBar list selection actions", () => {
  let state: RootState;

  beforeEach(() => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machine({
            system_id: "abc123",
            pool: factory.modelRef({ id: 2, name: "pool-2" }),
            actions: [NodeActions.RELEASE],
          }),
          factory.machine({
            system_id: "def456",
            pool: factory.modelRef({ id: 3, name: "pool-3" }),
            actions: [],
          }),
        ],
        selected: { items: ["abc123", "def456"] },
      }),
    });
  });

  it("enables an action when any selected machine allows it", async () => {
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));

    expect(
      within(screen.getByLabelText("Actions submenu")).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.RELEASE)),
      })
    ).not.toBeAriaDisabled();
  });

  it("enables lifecycle actions for a group selection without an edit entitlement", async () => {
    state.machine.selected = { groups: ["admin"], grouping: null };
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    ["Actions", "Power", "Lock"].forEach((name) => {
      expect(screen.getByRole("button", { name })).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(
      within(screen.getByLabelText("Actions submenu")).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.DEPLOY)),
      })
    ).not.toBeAriaDisabled();
  });

  it("disables admin actions for a group selection without an edit entitlement", async () => {
    state.machine.selected = { groups: ["admin"], grouping: null };
    // RequireEntitlements only renders its children once entitlements load.
    renderWithProviders(
      <RequireEntitlements entitlements={[]}>
        <MachineActionMenuBar isViewingDetails={false} />
      </RequireEntitlements>,
      { state }
    );

    expect(
      await screen.findByRole("button", { name: "Categorise" })
    ).toBeAriaDisabled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeAriaDisabled();
  });
});

describe("MachineActionMenuBar details view actions", () => {
  let state: RootState;

  beforeEach(() => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machine({
            system_id: "abc123",
            pool: factory.modelRef({ id: 2, name: "pool-2" }),
          }),
        ],
      }),
    });
  });

  it("enables the lifecycle actions the backend allows for a user without an edit entitlement", async () => {
    state.machine.items[0].actions = [
      NodeActions.RELEASE,
      NodeActions.ON,
      NodeActions.LOCK,
    ];
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(
      within(screen.getByLabelText("Actions submenu")).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.RELEASE)),
      })
    ).not.toBeAriaDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Power" }));
    expect(
      within(screen.getByLabelText("Power submenu")).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.ON)),
      })
    ).not.toBeAriaDisabled();
    expect(screen.getByRole("switch", { name: "Lock" })).toBeInTheDocument();
  });

  it("enables Deploy for a deploy-only user when the backend allows it", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_DEPLOY_MACHINES,
          resource_type: "pool",
          resource_id: 2,
        }),
      ])
    );
    state.machine.items[0].actions = [NodeActions.DEPLOY];
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));

    expect(
      within(screen.getByLabelText("Actions submenu")).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.DEPLOY)),
      })
    ).not.toBeAriaDisabled();
  });

  it("only allows unlocking a locked machine, even with an edit entitlement", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({ entitlement: Entitlement.CAN_EDIT_MACHINES }),
      ])
    );
    state.machine.items[0].locked = true;
    state.machine.items[0].actions = [NodeActions.UNLOCK];
    // RequireEntitlements only renders its children once entitlements load.
    renderWithProviders(
      <RequireEntitlements entitlements={[]}>
        <MachineActionMenuBar isViewingDetails systemId="abc123" />
      </RequireEntitlements>,
      { state }
    );

    expect(await screen.findByRole("switch", { name: "Lock" })).toBeChecked();
    ["Actions", "Troubleshoot", "Categorise", "Delete"].forEach((name) => {
      expect(screen.getByRole("button", { name })).toBeAriaDisabled();
    });
  });
});
