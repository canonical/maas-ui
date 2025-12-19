import MachineActionMenu from "./MachineActionMenu";

import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen, userEvent } from "@/testing/utils";

describe("MachineActionMenu", () => {
  let state: RootState;

  const openMenu = async () => {
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  };

  const getActionButton = (action: NodeActions) =>
    screen.getByRole("button", {
      name: new RegExp(getNodeActionTitle(action)),
    });

  const queryActionButton = (action: NodeActions) =>
    screen.queryByRole("button", {
      name: new RegExp(getNodeActionTitle(action)),
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
      actions: [NodeActions.DELETE, NodeActions.SET_ZONE],
    });
    state.machine.items = [machine];
    renderWithProviders(
      <MachineActionMenu isViewingDetails systemId={machine.system_id} />,
      { state }
    );

    await openMenu();

    expect(getActionButton(NodeActions.DELETE)).toBeInTheDocument();
    expect(getActionButton(NodeActions.SET_ZONE)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.TEST)).not.toBeInTheDocument();
  });

  it("can show disabled actions, even if a machine cannot perform them", async () => {
    const machine = factory.machine({
      actions: [NodeActions.DEPLOY],
    });
    renderWithProviders(
      <MachineActionMenu
        disabledActions={[NodeActions.RELEASE]}
        systemId={machine.system_id}
      />,
      { state }
    );

    await openMenu();

    expect(getActionButton(NodeActions.DEPLOY)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.DEPLOY)).not.toBeAriaDisabled();
    expect(getActionButton(NodeActions.RELEASE)).toBeInTheDocument();
    expect(getActionButton(NodeActions.RELEASE)).toBeAriaDisabled();
  });

  it("disables actions even when a machine can peform them", async () => {
    const machine = factory.machine({
      actions: [NodeActions.DEPLOY],
    });
    renderWithProviders(
      <MachineActionMenu
        disabledActions={[NodeActions.DEPLOY]}
        isViewingDetails
        systemId={machine.system_id}
      />,
      { state }
    );

    await openMenu();

    expect(getActionButton(NodeActions.DEPLOY)).toBeInTheDocument();
    expect(getActionButton(NodeActions.DEPLOY)).toBeAriaDisabled();
  });

  it("shows all actions that can be performed when machines are not provided", async () => {
    renderWithProviders(<MachineActionMenu />, { state });
    await openMenu();
    expect(getActionButton(NodeActions.DELETE)).toBeInTheDocument();
    expect(getActionButton(NodeActions.SET_ZONE)).toBeInTheDocument();
    expect(getActionButton(NodeActions.TEST)).toBeInTheDocument();
  });

  it("shows 'Check power' only when viewing machine details and a system id is provided", async () => {
    renderWithProviders(
      <MachineActionMenu isViewingDetails systemId="abc123" />,
      { state }
    );
    await openMenu();

    expect(getActionButton(NodeActions.CHECK_POWER)).toBeInTheDocument();
  });

  it("can be disabled", () => {
    renderWithProviders(<MachineActionMenu disabled={true} />, { state });

    expect(screen.getByRole("button", { name: "Menu" })).toBeAriaDisabled();
  });

  it("can display a custom label", () => {
    renderWithProviders(
      <MachineActionMenu label="A fun label or something" />,
      { state }
    );

    expect(
      screen.getByRole("button", { name: "A fun label or something" })
    ).toBeInTheDocument();
  });

  it("can use different button appearances", () => {
    renderWithProviders(<MachineActionMenu appearance="positive" />, { state });

    expect(screen.getByRole("button", { name: "Menu" })).toHaveClass(
      "p-button--positive"
    );
  });
});
