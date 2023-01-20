import userEvent from "@testing-library/user-event";

import NodeActionMenuGroup, { Labels } from "./NodeActionMenuGroup";

import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";
import { machine as machineFactory } from "testing/factories";
import { render, screen, within } from "testing/utils";

describe("NodeActionMenuGroup", () => {
  const openMenu = async (name: string) => {
    await userEvent.click(screen.getByRole("button", { name: name }));
  };

  const getSubMenu = (name: string) => screen.getByLabelText(`${name} submenu`);

  const getActionButton = (submenu: HTMLElement, name: NodeActions) =>
    within(submenu).getByRole("button", {
      name: RegExp(getNodeActionTitle(name)),
    });

  const queryActionButton = (submenu: HTMLElement, name: NodeActions) =>
    within(submenu).queryByRole("button", {
      name: RegExp(getNodeActionTitle(name)),
    });

  const getActionCount = (submenu: HTMLElement, action: NodeActions) =>
    within(submenu).getByTestId(`action-count-${action}`);

  it("renders", () => {
    render(
      <NodeActionMenuGroup hasSelection={false} onActionClick={jest.fn()} />
    );

    Object.values(Labels).forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("only shows actions that can be performed by the nodes", async () => {
    const nodes = [
      machineFactory({ actions: [NodeActions.DELETE] }),
      machineFactory({ actions: [NodeActions.SET_ZONE] }),
    ];
    render(
      <NodeActionMenuGroup
        filterActions
        hasSelection
        nodes={nodes}
        onActionClick={jest.fn()}
        showCount
      />
    );

    expect(
      screen.getByRole("button", { name: Labels.Categorise })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: Labels.Delete })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: Labels.Actions })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: Labels.Lock })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: Labels.PowerCycle })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: Labels.Troubleshoot })
    ).not.toBeInTheDocument();

    await openMenu(Labels.Categorise);
    const categoriseMenu = getSubMenu(Labels.Categorise);

    expect(
      getActionButton(categoriseMenu, NodeActions.SET_ZONE)
    ).toBeInTheDocument();
    expect(
      queryActionButton(categoriseMenu, NodeActions.SET_POOL)
    ).not.toBeInTheDocument();
    expect(
      queryActionButton(categoriseMenu, NodeActions.TAG)
    ).not.toBeInTheDocument();
  });

  it(`can be made to always show lifecycle actions, disabling the actions that
      cannot be performed`, async () => {
    const nodes = [machineFactory({ actions: [NodeActions.DEPLOY] })];
    render(
      <NodeActionMenuGroup
        alwaysShowLifecycle
        hasSelection
        nodes={nodes}
        onActionClick={jest.fn()}
        showCount
      />
    );

    await openMenu(Labels.Actions);
    const actionsMenu = getSubMenu(Labels.Actions);

    expect(
      getActionButton(actionsMenu, NodeActions.DEPLOY)
    ).toBeInTheDocument();
    expect(
      queryActionButton(actionsMenu, NodeActions.DEPLOY)
    ).not.toBeDisabled();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeInTheDocument();
    expect(getActionButton(actionsMenu, NodeActions.RELEASE)).toBeDisabled();
  });

  it(`disables the actions that cannot be performed when nodes are provided`, async () => {
    const nodes = [machineFactory({ actions: [NodeActions.DEPLOY] })];
    render(
      <NodeActionMenuGroup
        alwaysShowLifecycle
        hasSelection
        nodes={nodes}
        onActionClick={jest.fn()}
        showCount={false}
      />
    );

    await openMenu(Labels.Actions);
    const actionsMenu = getSubMenu(Labels.Actions);

    expect(
      getActionButton(actionsMenu, NodeActions.DEPLOY)
    ).toBeInTheDocument();
    expect(
      queryActionButton(actionsMenu, NodeActions.DEPLOY)
    ).not.toBeDisabled();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeInTheDocument();
    expect(getActionButton(actionsMenu, NodeActions.RELEASE)).toBeDisabled();
  });

  it("shows all actions that can be performed when nodes are not provided", async () => {
    render(<NodeActionMenuGroup hasSelection onActionClick={jest.fn()} />);

    expect(
      screen.getByRole("button", { name: Labels.Delete })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: Labels.Delete })
    ).not.toBeDisabled();

    await openMenu(Labels.Categorise);
    const categoriseMenu = getSubMenu(Labels.Categorise);

    expect(
      getActionButton(categoriseMenu, NodeActions.SET_ZONE)
    ).toBeInTheDocument();
    expect(
      queryActionButton(categoriseMenu, NodeActions.SET_ZONE)
    ).not.toBeDisabled();

    await openMenu(Labels.Troubleshoot);
    const troubleshootMenu = getSubMenu(Labels.Troubleshoot);

    expect(
      getActionButton(troubleshootMenu, NodeActions.TEST)
    ).toBeInTheDocument();
    expect(
      queryActionButton(troubleshootMenu, NodeActions.TEST)
    ).not.toBeDisabled();
  });

  it("correctly calculates number of nodes that can perform each action", async () => {
    const nodes = [
      machineFactory({
        actions: [
          NodeActions.COMMISSION,
          NodeActions.RELEASE,
          NodeActions.DEPLOY,
        ],
      }),
      machineFactory({
        actions: [NodeActions.COMMISSION, NodeActions.RELEASE],
      }),
      machineFactory({
        actions: [NodeActions.COMMISSION],
      }),
    ];
    render(
      <NodeActionMenuGroup
        hasSelection
        nodes={nodes}
        onActionClick={jest.fn()}
        showCount
      />
    );

    await openMenu(Labels.Actions);
    const actionsMenu = getSubMenu(Labels.Actions);

    expect(
      within(getActionCount(actionsMenu, NodeActions.COMMISSION)).getByText("3")
    ).toBeInTheDocument();
    expect(
      within(getActionCount(actionsMenu, NodeActions.RELEASE)).getByText("2")
    ).toBeInTheDocument();
    expect(
      within(getActionCount(actionsMenu, NodeActions.DEPLOY)).getByText("1")
    ).toBeInTheDocument();
  });

  it("fires onActionClick function on action button click", async () => {
    const nodes = [
      machineFactory({
        actions: [NodeActions.DEPLOY],
      }),
    ];
    const onActionClick = jest.fn();
    render(
      <NodeActionMenuGroup
        hasSelection
        nodes={nodes}
        onActionClick={onActionClick}
        showCount
      />
    );

    await openMenu(Labels.Actions);
    const actionsMenu = getSubMenu(Labels.Actions);
    await userEvent.click(getActionButton(actionsMenu, NodeActions.DEPLOY));

    expect(onActionClick).toHaveBeenCalledWith(NodeActions.DEPLOY);
  });

  it("can exclude actions from being shown", async () => {
    const nodes = [
      machineFactory({
        actions: [NodeActions.DEPLOY, NodeActions.DELETE],
      }),
    ];
    render(
      <NodeActionMenuGroup
        excludeActions={[NodeActions.DELETE]}
        hasSelection
        nodes={nodes}
        onActionClick={jest.fn()}
        showCount
      />
    );

    await openMenu(Labels.Actions);
    const actionMenu = getSubMenu(Labels.Actions);

    expect(getActionButton(actionMenu, NodeActions.DEPLOY)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: RegExp(NodeActions.DELETE) })
    ).not.toBeInTheDocument();
  });

  it("can change the display text of the nodes in the disabled tooltip", async () => {
    render(
      <NodeActionMenuGroup
        hasSelection={false}
        nodeDisplay="foobar"
        nodes={[]}
        onActionClick={jest.fn()}
        showCount
      />
    );

    expect(
      screen.getByRole("tooltip", {
        name: "Select foobars below to perform an action.",
      })
    ).toBeInTheDocument();
  });

  it("can change the position of the disabled tooltip", async () => {
    render(
      <NodeActionMenuGroup
        disabledTooltipPosition="top-left"
        hasSelection={false}
        nodes={[]}
        onActionClick={jest.fn()}
        showCount
      />
    );

    expect(screen.getByTestId("tooltip-portal")).toHaveClass(
      "p-tooltip--top-left"
    );
  });

  it("can override action titles", async () => {
    const nodes = [
      machineFactory({
        actions: [NodeActions.TAG],
      }),
    ];
    render(
      <NodeActionMenuGroup
        getTitle={() => "Overridden"}
        hasSelection
        nodes={nodes}
        onActionClick={jest.fn()}
        showCount
      />
    );
    await openMenu(Labels.Categorise);
    expect(
      within(screen.getByTestId("action-link-tag")).getByText(/Overridden/)
    ).toBeInTheDocument();
  });
});
