import NodeActionMenu, { Label } from "./NodeActionMenu";

import { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, within } from "@/testing/utils";

describe("NodeActionMenu", () => {
  const openMenu = async () =>
    await userEvent.click(
      screen.getByRole("button", { name: Label.TakeAction })
    );

  const getActionButton = (action: NodeActions) =>
    screen.getByRole("button", {
      name: new RegExp(getNodeActionTitle(action)),
    });

  const queryActionButton = (action: NodeActions) =>
    screen.queryByRole("button", {
      name: new RegExp(getNodeActionTitle(action)),
    });

  const getActionCount = (action: NodeActions) =>
    screen.getByTestId(`action-count-${action}`);

  it("is disabled if no nodes are selected", async () => {
    render(
      <NodeActionMenu
        hasSelection={false}
        nodes={[]}
        onActionClick={vi.fn()}
        showCount
      />
    );

    expect(
      screen.getByRole("button", { name: Label.TakeAction })
    ).toBeDisabled();
  });

  it("is enabled if nodes are selected", async () => {
    const nodes = [factory.machine()];
    render(
      <NodeActionMenu
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount
      />
    );

    expect(
      screen.getByRole("button", { name: Label.TakeAction })
    ).not.toBeDisabled();
  });

  it("can only shows actions that can be performed by the nodes", async () => {
    const nodes = [
      factory.machine({ actions: [NodeActions.DELETE] }),
      factory.machine({ actions: [NodeActions.SET_ZONE] }),
    ];
    render(
      <NodeActionMenu
        filterActions
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount
      />
    );

    await openMenu();

    expect(getActionButton(NodeActions.DELETE)).toBeInTheDocument();
    expect(getActionButton(NodeActions.SET_ZONE)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.TEST)).not.toBeInTheDocument();
  });

  it(`can be made to always show lifecycle actions, disabling the actions that
      cannot be performed`, async () => {
    const nodes = [factory.machine({ actions: [NodeActions.DEPLOY] })];
    render(
      <NodeActionMenu
        alwaysShowLifecycle
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount
      />
    );

    await openMenu();

    expect(getActionButton(NodeActions.DEPLOY)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.DEPLOY)).not.toBeDisabled();
    expect(getActionButton(NodeActions.RELEASE)).toBeInTheDocument();
    expect(getActionButton(NodeActions.RELEASE)).toBeDisabled();
  });

  it(`disables the actions that cannot be performed when nodes are provided`, async () => {
    const nodes = [factory.machine({ actions: [NodeActions.DEPLOY] })];
    render(
      <NodeActionMenu
        alwaysShowLifecycle
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount={false}
      />
    );

    await openMenu();

    expect(getActionButton(NodeActions.DEPLOY)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.DEPLOY)).not.toBeDisabled();
    expect(getActionButton(NodeActions.RELEASE)).toBeInTheDocument();
    expect(getActionButton(NodeActions.RELEASE)).toBeDisabled();
  });

  it("shows all actions that can be performed when nodes are not provided", async () => {
    render(<NodeActionMenu hasSelection onActionClick={vi.fn()} />);
    await openMenu();
    expect(getActionButton(NodeActions.DELETE)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.DELETE)).not.toBeDisabled();
    expect(getActionButton(NodeActions.SET_ZONE)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.SET_ZONE)).not.toBeDisabled();
    expect(getActionButton(NodeActions.TEST)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.TEST)).not.toBeDisabled();
  });

  it("correctly calculates number of nodes that can perform each action", async () => {
    const nodes = [
      factory.machine({
        actions: [
          NodeActions.COMMISSION,
          NodeActions.RELEASE,
          NodeActions.DEPLOY,
        ],
      }),
      factory.machine({
        actions: [NodeActions.COMMISSION, NodeActions.RELEASE],
      }),
      factory.machine({
        actions: [NodeActions.COMMISSION],
      }),
    ];
    render(
      <NodeActionMenu
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount
      />
    );

    await openMenu();

    expect(
      within(getActionCount(NodeActions.COMMISSION)).getByText("3")
    ).toBeInTheDocument();
    expect(
      within(getActionCount(NodeActions.RELEASE)).getByText("2")
    ).toBeInTheDocument();
    expect(
      within(getActionCount(NodeActions.DEPLOY)).getByText("1")
    ).toBeInTheDocument();
  });

  it("fires onActionClick function on action button click", async () => {
    const nodes = [
      factory.machine({
        actions: [NodeActions.DEPLOY],
      }),
    ];
    const onActionClick = vi.fn();
    render(
      <NodeActionMenu
        hasSelection
        nodes={nodes}
        onActionClick={onActionClick}
        showCount
      />
    );

    await openMenu();
    await userEvent.click(getActionButton(NodeActions.DEPLOY));

    expect(onActionClick).toHaveBeenCalledWith(NodeActions.DEPLOY);
  });

  it("can exclude actions from being shown", async () => {
    const nodes = [
      factory.machine({
        actions: [NodeActions.DEPLOY, NodeActions.DELETE],
      }),
    ];
    render(
      <NodeActionMenu
        excludeActions={[NodeActions.DELETE]}
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount
      />
    );

    await openMenu();

    expect(getActionButton(NodeActions.DEPLOY)).toBeInTheDocument();
    expect(queryActionButton(NodeActions.DELETE)).not.toBeInTheDocument();
  });

  it("can change the display text of the nodes in the disabled tooltip", async () => {
    render(
      <NodeActionMenu
        hasSelection={false}
        nodeDisplay="foobar"
        nodes={[]}
        onActionClick={vi.fn()}
        showCount
      />
    );

    await userEvent.click(screen.getByRole("button"));
    expect(
      screen.getByRole("tooltip", {
        name: "Select foobars below to perform an action.",
      })
    ).toBeInTheDocument();
  });

  it("can change the appearance of the menu toggle", async () => {
    render(
      <NodeActionMenu
        hasSelection
        nodes={[]}
        onActionClick={vi.fn()}
        showCount
        toggleAppearance="negative"
      />
    );

    expect(screen.getByRole("button", { name: Label.TakeAction })).toHaveClass(
      "p-button--negative"
    );
  });

  it("can override action titles", async () => {
    const nodes = [
      factory.machine({
        actions: [NodeActions.TAG],
      }),
    ];
    render(
      <NodeActionMenu
        getTitle={() => "Overridden"}
        hasSelection
        nodes={nodes}
        onActionClick={vi.fn()}
        showCount
      />
    );
    await openMenu();
    expect(
      within(screen.getByTestId("action-link-tag")).getByText(/Overridden/)
    ).toBeInTheDocument();
  });
});
