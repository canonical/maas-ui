import type { ReactNode } from "react";

import { Button } from "@canonical/react-components";

import { useMachineActionMenus, useMachineActions } from "./hooks";

import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockModal,
  mockSidePanel,
  renderHookWithProviders,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

const { mockOpen: mockOpenSidePanel } = await mockSidePanel();
const { mockOpen: mockOpenModal } = await mockModal();

describe("useMachineActionMenus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // TODO: Remove when DPU feature flag is removed https://warthogs.atlassian.net/browse/MAASENG-4186
  it("includes 'Power cycle' when the DPU feature flag is enabled", () => {
    vi.stubEnv("VITE_APP_DPU_PROVISIONING", "true");
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(false)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.POWER_CYCLE)
    ).toBe(true);
  });

  // TODO: Remove when DPU feature flag is removed https://warthogs.atlassian.net/browse/MAASENG-4186
  it("excludes 'Power cycle' when the DPU feature flag is disabled", () => {
    vi.stubEnv("VITE_APP_DPU_PROVISIONING", "false");
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(false)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.POWER_CYCLE)
    ).toBe(false);
  });

  it("includes 'Check power' if viewing details and a system ID is provided", () => {
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(true, "abc123")
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.CHECK_POWER)
    ).toBe(true);
  });

  it("excludes 'Check power' if viewing details and a system ID is not provided", () => {
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(true, undefined)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.CHECK_POWER)
    ).toBe(false);
  });

  it("excludes 'Check power' if not viewing details", () => {
    const { result } = renderHookWithProviders(() =>
      useMachineActionMenus(false)
    );

    expect(
      result.current
        .find((group) => group.name === "power")
        ?.items.some((item) => item.action === NodeActions.CHECK_POWER)
    ).toBe(false);
  });
});

describe("useMachineActions", () => {
  let state: RootState;

  const RowActions = ({
    actions,
    noneMessage,
    renderLabel,
  }: {
    actions: NodeActions[];
    noneMessage?: string;
    renderLabel?: (action: NodeActions, label: string) => ReactNode;
  }) => {
    const links = useMachineActions(
      "abc123",
      actions,
      noneMessage,
      renderLabel
    );
    return (
      <>
        {links.map((link, i) => (
          <Button key={i} {...link} />
        ))}
      </>
    );
  };

  const poolEntitlement = (entitlement: Entitlement, poolId: number) =>
    factory.entitlement({
      entitlement,
      resource_type: "pool",
      resource_id: poolId,
    });

  const waitForEnabled = async (name: string) => {
    await waitFor(() => {
      expect(screen.getByRole("button", { name })).not.toBeAriaDisabled();
    });
  };

  beforeEach(() => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        poolEntitlement(Entitlement.CAN_EDIT_MACHINES, 2),
      ])
    );
    state = factory.rootState({
      machine: factory.machineState({
        loaded: true,
        items: [
          factory.machine({
            system_id: "abc123",
            pool: factory.modelRef({ id: 2, name: "pool-2" }),
            actions: [],
          }),
        ],
        selected: null,
      }),
    });
  });

  it.each([
    [NodeActions.ABORT, "Abort", "modal"],
    [NodeActions.ACQUIRE, "Allocate", "modal"],
    [NodeActions.COMMISSION, "Commission", "sidePanel"],
    [NodeActions.DEPLOY, "Deploy", "sidePanel"],
    [NodeActions.EXIT_RESCUE_MODE, "Exit rescue mode", "modal"],
    [NodeActions.LOCK, "Lock", "modal"],
    [NodeActions.MARK_BROKEN, "Mark broken", "sidePanel"],
    [NodeActions.MARK_FIXED, "Mark fixed", "modal"],
    [
      NodeActions.OVERRIDE_FAILED_TESTING,
      "Override failed testing",
      "sidePanel",
    ],
    [NodeActions.RELEASE, "Release", "sidePanel"],
    [NodeActions.RESCUE_MODE, "Enter rescue mode", "modal"],
    [NodeActions.TEST, "Test", "sidePanel"],
    [NodeActions.UNLOCK, "Unlock", "modal"],
    [NodeActions.ON, "Power on", "modal"],
    [NodeActions.OFF, "Power off", "modal"],
  ] as const)(
    "selects only this machine and opens the %s form (%s)",
    async (action, title, opener) => {
      state.machine.items[0].actions = [action];
      state.machine.selected = { items: ["other-machine"] };
      const { store } = renderWithProviders(<RowActions actions={[action]} />, {
        state,
      });
      await waitForEnabled(`${title}...`);

      await userEvent.click(
        screen.getByRole("button", { name: `${title}...` })
      );

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: "machine/setSelected",
          payload: { items: ["abc123"] },
        })
      );
      const [expectedOpen, otherOpen] =
        opener === "modal"
          ? [mockOpenModal, mockOpenSidePanel]
          : [mockOpenSidePanel, mockOpenModal];
      expect(expectedOpen).toHaveBeenCalledWith(
        expect.objectContaining({ title })
      );
      expect(otherOpen).not.toHaveBeenCalled();
    }
  );

  it("does not dispatch the action itself when clicked", async () => {
    state.machine.items[0].actions = [NodeActions.ACQUIRE];
    const { store } = renderWithProviders(
      <RowActions actions={[NodeActions.ACQUIRE]} />,
      { state }
    );
    await waitForEnabled("Allocate...");

    await userEvent.click(screen.getByRole("button", { name: "Allocate..." }));

    expect(store.getActions().map(({ type }) => type)).not.toContain(
      "machine/acquire"
    );
  });

  it("describes the action for a single machine even when others were selected", async () => {
    state.machine.items[0].actions = [NodeActions.ACQUIRE];
    state.machine.selected = { items: ["abc123", "def456", "ghi789"] };
    renderWithProviders(<RowActions actions={[NodeActions.ACQUIRE]} />, {
      state,
    });
    await waitForEnabled("Allocate...");

    await userEvent.click(screen.getByRole("button", { name: "Allocate..." }));

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          description: expect.stringContaining("this machine"),
        }),
      })
    );
  });

  it("only shows actions the machine can perform, in the order given", () => {
    state.machine.items[0].actions = [
      NodeActions.RELEASE,
      NodeActions.DEPLOY,
      NodeActions.COMMISSION,
    ];
    renderWithProviders(
      <RowActions
        actions={[
          NodeActions.DEPLOY,
          NodeActions.ACQUIRE,
          NodeActions.COMMISSION,
        ]}
      />,
      { state }
    );

    expect(
      screen.getAllByRole("button").map((button) => button.textContent)
    ).toStrictEqual(["Deploy...", "Commission..."]);
  });

  it("offers soft power off when the machine can be powered off", () => {
    state.machine.items[0].actions = [NodeActions.OFF];
    renderWithProviders(<RowActions actions={[NodeActions.SOFT_OFF]} />, {
      state,
    });

    expect(
      screen.getByRole("button", { name: "Soft power off..." })
    ).toBeInTheDocument();
  });

  it("does not offer soft power off when the machine cannot be powered off", () => {
    state.machine.items[0].actions = [NodeActions.ON];
    renderWithProviders(<RowActions actions={[NodeActions.SOFT_OFF]} />, {
      state,
    });

    expect(
      screen.queryByRole("button", { name: "Soft power off..." })
    ).not.toBeInTheDocument();
  });

  it("opens the power off modal for soft power off", async () => {
    state.machine.items[0].actions = [NodeActions.OFF];
    renderWithProviders(<RowActions actions={[NodeActions.SOFT_OFF]} />, {
      state,
    });
    await waitForEnabled("Soft power off...");

    await userEvent.click(
      screen.getByRole("button", { name: "Soft power off..." })
    );

    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Soft power off" })
    );
  });

  it("shows a disabled message when there are no actions", () => {
    renderWithProviders(
      <RowActions actions={[NodeActions.DEPLOY]} noneMessage="Nothing to do" />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "Nothing to do" })
    ).toBeAriaDisabled();
  });

  it("renders nothing when there are no actions and no message", () => {
    renderWithProviders(<RowActions actions={[NodeActions.DEPLOY]} />, {
      state,
    });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("can render custom labels", () => {
    state.machine.items[0].actions = [NodeActions.DEPLOY];
    const renderLabel = vi.fn(
      (action: NodeActions, label: string) => `${action}: ${label}`
    );
    renderWithProviders(
      <RowActions actions={[NodeActions.DEPLOY]} renderLabel={renderLabel} />,
      { state }
    );

    expect(renderLabel).toHaveBeenCalledWith(NodeActions.DEPLOY, "Deploy...");
    expect(
      screen.getByRole("button", { name: "deploy: Deploy..." })
    ).toBeInTheDocument();
  });

  it("disables actions with an edit entitlement for a different pool only", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        poolEntitlement(Entitlement.CAN_EDIT_MACHINES, 999),
        // Enables Deploy, signalling that entitlements have loaded.
        poolEntitlement(Entitlement.CAN_DEPLOY_MACHINES, 2),
      ])
    );
    state.machine.items[0].actions = [NodeActions.RELEASE, NodeActions.DEPLOY];
    renderWithProviders(
      <RowActions actions={[NodeActions.RELEASE, NodeActions.DEPLOY]} />,
      { state }
    );

    await waitForEnabled("Deploy...");
    expect(
      screen.getByRole("button", { name: "Release..." })
    ).toBeAriaDisabled();
  });

  it("disables all actions without any entitlements", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    state.machine.items[0].actions = [NodeActions.RELEASE, NodeActions.DEPLOY];
    renderWithProviders(
      <RowActions actions={[NodeActions.RELEASE, NodeActions.DEPLOY]} />,
      { state }
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Release..." })
      ).toBeAriaDisabled();
    });
    expect(
      screen.getByRole("button", { name: "Deploy..." })
    ).toBeAriaDisabled();
  });

  it("allows only deploy with a deploy entitlement for the machine's pool", async () => {
    mockServer.use(
      authResolvers.getMeEntitlements.handler([
        poolEntitlement(Entitlement.CAN_DEPLOY_MACHINES, 2),
      ])
    );
    state.machine.items[0].actions = [NodeActions.RELEASE, NodeActions.DEPLOY];
    renderWithProviders(
      <RowActions actions={[NodeActions.RELEASE, NodeActions.DEPLOY]} />,
      { state }
    );

    await waitForEnabled("Deploy...");
    expect(
      screen.getByRole("button", { name: "Release..." })
    ).toBeAriaDisabled();
  });
});
