import NodeActionMenuGroup, { Labels } from "./NodeActionMenuGroup";

import { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  within,
  renderWithProviders,
} from "@/testing/utils";

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
    renderWithProviders(
      <NodeActionMenuGroup hasSelection={false} onActionClick={vi.fn()} />
    );

    Object.values(Labels).forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("only shows actions that can be performed by the nodes", async () => {
    const nodes = [
      factory.machine({ actions: [NodeActions.DELETE], is_dpu: false }),
      factory.machine({ actions: [NodeActions.SET_ZONE], is_dpu: false }),
    ];
    renderWithProviders(
      <NodeActionMenuGroup
        filterActions
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
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
      screen.getByRole("button", { name: Labels.Power })
    ).toBeInTheDocument();
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
    const nodes = [
      factory.machine({ actions: [NodeActions.DEPLOY], is_dpu: false }),
    ];
    renderWithProviders(
      <NodeActionMenuGroup
        alwaysShowLifecycle
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
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
    ).not.toBeAriaDisabled();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeInTheDocument();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeAriaDisabled();
  });

  it(`disables the actions that cannot be performed when nodes are provided`, async () => {
    const nodes = [
      factory.machine({ actions: [NodeActions.DEPLOY], is_dpu: false }),
    ];
    renderWithProviders(
      <NodeActionMenuGroup
        alwaysShowLifecycle
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
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
    ).not.toBeAriaDisabled();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeInTheDocument();
    expect(
      getActionButton(actionsMenu, NodeActions.RELEASE)
    ).toBeAriaDisabled();
  });

  it("shows all actions that can be performed when nodes are not provided", async () => {
    renderWithProviders(
      <NodeActionMenuGroup hasSelection onActionClick={vi.fn()} />
    );

    expect(
      screen.getByRole("button", { name: Labels.Delete })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: Labels.Delete })
    ).not.toBeAriaDisabled();

    await openMenu(Labels.Categorise);
    const categoriseMenu = getSubMenu(Labels.Categorise);

    expect(
      getActionButton(categoriseMenu, NodeActions.SET_ZONE)
    ).toBeInTheDocument();
    expect(
      queryActionButton(categoriseMenu, NodeActions.SET_ZONE)
    ).not.toBeAriaDisabled();

    await openMenu(Labels.Troubleshoot);
    const troubleshootMenu = getSubMenu(Labels.Troubleshoot);

    expect(
      getActionButton(troubleshootMenu, NodeActions.TEST)
    ).toBeInTheDocument();
    expect(
      queryActionButton(troubleshootMenu, NodeActions.TEST)
    ).not.toBeAriaDisabled();
  });

  it("correctly calculates number of nodes that can perform each action", async () => {
    const nodes = [
      factory.machine({
        actions: [
          NodeActions.COMMISSION,
          NodeActions.RELEASE,
          NodeActions.DEPLOY,
        ],
        is_dpu: false,
      }),
      factory.machine({
        actions: [NodeActions.COMMISSION, NodeActions.RELEASE],
        is_dpu: false,
      }),
      factory.machine({
        actions: [NodeActions.COMMISSION],
        is_dpu: false,
      }),
    ];
    renderWithProviders(
      <NodeActionMenuGroup
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
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
      factory.machine({
        actions: [NodeActions.DEPLOY],
        is_dpu: false,
      }),
    ];
    const onActionClick = vi.fn();
    renderWithProviders(
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
      factory.machine({
        actions: [NodeActions.DEPLOY, NodeActions.DELETE],
        is_dpu: false,
      }),
    ];
    renderWithProviders(
      <NodeActionMenuGroup
        excludeActions={[NodeActions.DELETE]}
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
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
    renderWithProviders(
      <NodeActionMenuGroup
        hasSelection={false}
        nodeDisplay="foobar"
        nodes={[]}
        onActionClick={vi.fn()}
        showCount
      />
    );

    await openMenu(Labels.Actions);

    expect(
      screen.getByRole("tooltip", {
        name: "Select foobars below to perform an action.",
      })
    ).toBeInTheDocument();
  });

  it("can override action titles", async () => {
    const nodes = [
      factory.machine({
        actions: [NodeActions.TAG],
        is_dpu: false,
      }),
    ];
    renderWithProviders(
      <NodeActionMenuGroup
        getTitle={() => "Overridden"}
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount
      />
    );
    await openMenu(Labels.Categorise);
    expect(
      within(screen.getByTestId("action-link-tag")).getByText(/Overridden/)
    ).toBeInTheDocument();
  });
});
