import MachineActionMenuBar from "./MachineActionMenuBar";

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
  waitFor,
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

describe("MachineActionMenuBar entitlements check", () => {
  let state: RootState;

  const editPoolEntitlement = (poolId: number) =>
    factory.entitlement({
      entitlement: Entitlement.CAN_EDIT_MACHINES,
      resource_type: "pool",
      resource_id: poolId,
    });

  const deployPoolEntitlement = (poolId: number) =>
    factory.entitlement({
      entitlement: Entitlement.CAN_DEPLOY_MACHINES,
      resource_type: "pool",
      resource_id: poolId,
    });

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machine({
            system_id: "abc123",
            pool: factory.modelRef({ id: 2, name: "pool-2" }),
          }),
          factory.machine({
            system_id: "def456",
            pool: factory.modelRef({ id: 3, name: "pool-3" }),
          }),
        ],
        selected: { items: ["abc123"] },
      }),
    });
  });

  it("disables the Actions dropdown without a machine edit entitlement for the selected pool", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).toBeAriaDisabled();
    });
  });

  it("disables every dropdown and the Delete button without a machine edit entitlement for the selected pool", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).toBeAriaDisabled();
    });
    ["Power", "Troubleshoot", "Categorise", "Lock", "Delete"].forEach(
      (name) => {
        expect(screen.getByRole("button", { name })).toBeAriaDisabled();
      }
    );
  });

  it("enables the Actions dropdown with a machine edit entitlement for the selected pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(2)])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).not.toBeAriaDisabled();
    });
  });

  it("enables every dropdown and the Delete button with a machine edit entitlement for the selected pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(2)])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).not.toBeAriaDisabled();
    });
    ["Power", "Troubleshoot", "Categorise", "Lock", "Delete"].forEach(
      (name) => {
        expect(screen.getByRole("button", { name })).not.toBeAriaDisabled();
      }
    );
  });

  it("disables the Actions dropdown when the edit entitlement is for a different pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(999)])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).toBeAriaDisabled();
    });
  });

  it("disables the Actions dropdown unless the user can edit every selected pool", async () => {
    state.machine.selected = { items: ["abc123", "def456"] };
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(2)])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).toBeAriaDisabled();
    });
  });

  it("enables the Actions dropdown when the user can edit every selected pool", async () => {
    state.machine.selected = { items: ["abc123", "def456"] };
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        editPoolEntitlement(2),
        editPoolEntitlement(3),
      ])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).not.toBeAriaDisabled();
    });
  });

  it("disables the Deploy option without a deploy entitlement for the selected pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(2)])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    const actionsToggle = screen.getByRole("button", { name: "Actions" });
    await waitFor(() => {
      expect(actionsToggle).not.toBeAriaDisabled();
    });
    await userEvent.click(actionsToggle);

    const actionsMenu = screen.getByLabelText("Actions submenu");
    expect(
      within(actionsMenu).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.DEPLOY)),
      })
    ).toBeAriaDisabled();
  });

  it("enables the Deploy option with a deploy entitlement for the selected pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        editPoolEntitlement(2),
        deployPoolEntitlement(2),
      ])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    const actionsToggle = screen.getByRole("button", { name: "Actions" });
    await waitFor(() => {
      expect(actionsToggle).not.toBeAriaDisabled();
    });
    await userEvent.click(actionsToggle);

    const actionsMenu = screen.getByLabelText("Actions submenu");
    expect(
      within(actionsMenu).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.DEPLOY)),
      })
    ).not.toBeAriaDisabled();
  });

  it("falls back to the global edit entitlement for group selections", async () => {
    state.machine.selected = { groups: ["admin"], grouping: null };
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).toBeAriaDisabled();
    });
  });

  it("enables the Actions dropdown for group selections with a global edit entitlement", async () => {
    state.machine.selected = { groups: ["admin"], grouping: null };
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        factory.entitlement({
          entitlement: Entitlement.CAN_EDIT_MACHINES,
          resource_type: "maas",
          resource_id: 0,
        }),
      ])
    );
    renderWithProviders(<MachineActionMenuBar isViewingDetails={false} />, {
      state,
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).not.toBeAriaDisabled();
    });
  });
});

describe("MachineActionMenuBar details view entitlements gating", () => {
  let state: RootState;

  const editPoolEntitlement = (poolId: number) =>
    factory.entitlement({
      entitlement: Entitlement.CAN_EDIT_MACHINES,
      resource_type: "pool",
      resource_id: poolId,
    });

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        items: [
          factory.machine({
            system_id: "abc123",
            pool: factory.modelRef({ id: 2, name: "pool-2" }),
            actions: Object.values(NodeActions).filter(
              (action) => action !== NodeActions.IMPORT_IMAGES
            ),
          }),
        ],
      }),
    });
  });

  it("disables every dropdown and the Delete button without an edit entitlement for the viewed machine's pool", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).toBeAriaDisabled();
    });
    ["Power", "Troubleshoot", "Categorise", "Delete"].forEach((name) => {
      expect(screen.getByRole("button", { name })).toBeAriaDisabled();
    });
  });

  it("enables every dropdown and the Delete button with an edit entitlement for the viewed machine's pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(2)])
    );
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).not.toBeAriaDisabled();
    });
    ["Power", "Troubleshoot", "Categorise", "Delete"].forEach((name) => {
      expect(screen.getByRole("button", { name })).not.toBeAriaDisabled();
    });
  });

  it("disables every dropdown when the edit entitlement is for a different pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(999)])
    );
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Actions" })
      ).toBeAriaDisabled();
    });
  });

  it("disables the Deploy option without a deploy entitlement for the viewed machine's pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([editPoolEntitlement(2)])
    );
    renderWithProviders(
      <MachineActionMenuBar isViewingDetails systemId="abc123" />,
      { state }
    );

    const actionsToggle = screen.getByRole("button", { name: "Actions" });
    await waitFor(() => {
      expect(actionsToggle).not.toBeAriaDisabled();
    });
    await userEvent.click(actionsToggle);

    const actionsMenu = screen.getByLabelText("Actions submenu");
    expect(
      within(actionsMenu).getByRole("menuitem", {
        name: RegExp(getNodeActionTitle(NodeActions.DEPLOY)),
      })
    ).toBeAriaDisabled();
  });
});
