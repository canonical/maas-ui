import type { ReactWrapper } from "enzyme";
import { mount } from "enzyme";

import NodeActionMenu from "./NodeActionMenu";

import { NodeActions } from "app/store/types/node";
import { machine as machineFactory } from "testing/factories";

describe("NodeActionMenu", () => {
  const openMenu = (wrapper: ReactWrapper) =>
    wrapper
      .find("[data-testid='take-action-dropdown'] button")
      .simulate("click");

  const getActionButton = (wrapper: ReactWrapper, action: NodeActions) =>
    wrapper.find(`button[data-testid='action-link-${action}']`);

  const getActionCount = (wrapper: ReactWrapper, action: NodeActions) =>
    wrapper.find(`[data-testid='action-count-${action}']`);

  it("is disabled if no nodes are provided", () => {
    const wrapper = mount(
      <NodeActionMenu nodes={[]} onActionClick={jest.fn()} />
    );

    expect(
      wrapper
        .find('[data-testid="take-action-dropdown"] button')
        .prop("disabled")
    ).toBe(true);
  });

  it("is enabled if at least one node is provided", () => {
    const nodes = [machineFactory()];
    const wrapper = mount(
      <NodeActionMenu nodes={nodes} onActionClick={jest.fn()} />
    );

    expect(
      wrapper
        .find('[data-testid="take-action-dropdown"] button')
        .prop("disabled")
    ).toBe(false);
  });

  it("only shows actions that can be performed by the nodes", () => {
    const nodes = [
      machineFactory({ actions: [NodeActions.DELETE] }),
      machineFactory({ actions: [NodeActions.SET_ZONE] }),
    ];
    const wrapper = mount(
      <NodeActionMenu nodes={nodes} onActionClick={jest.fn()} />
    );

    openMenu(wrapper);

    expect(getActionButton(wrapper, NodeActions.DELETE).exists()).toBe(true);
    expect(getActionButton(wrapper, NodeActions.SET_ZONE).exists()).toBe(true);
    expect(getActionButton(wrapper, NodeActions.TEST).exists()).toBe(false);
  });

  it(`can be made to always show lifecycle actions, disabling the actions that
      cannot be performed`, () => {
    const nodes = [machineFactory({ actions: [NodeActions.DEPLOY] })];
    const wrapper = mount(
      <NodeActionMenu
        alwaysShowLifecycle
        nodes={nodes}
        onActionClick={jest.fn()}
      />
    );

    openMenu(wrapper);

    expect(getActionButton(wrapper, NodeActions.DEPLOY).exists()).toBe(true);
    expect(getActionButton(wrapper, NodeActions.DEPLOY).prop("disabled")).toBe(
      false
    );
    expect(getActionButton(wrapper, NodeActions.RELEASE).exists()).toBe(true);
    expect(getActionButton(wrapper, NodeActions.RELEASE).prop("disabled")).toBe(
      true
    );
  });

  it("correctly calculates number of nodes that can perform each action", () => {
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
    const wrapper = mount(
      <NodeActionMenu nodes={nodes} onActionClick={jest.fn()} />
    );

    openMenu(wrapper);

    expect(getActionCount(wrapper, NodeActions.COMMISSION).text()).toBe("3");
    expect(getActionCount(wrapper, NodeActions.RELEASE).text()).toBe("2");
    expect(getActionCount(wrapper, NodeActions.DEPLOY).text()).toBe("1");
  });

  it("does not display count if only one node provided", () => {
    const nodes = [
      machineFactory({
        actions: [NodeActions.DEPLOY],
      }),
    ];
    const wrapper = mount(
      <NodeActionMenu nodes={nodes} onActionClick={jest.fn()} />
    );

    openMenu(wrapper);

    expect(getActionCount(wrapper, NodeActions.DEPLOY).exists()).toBe(false);
  });

  it("fires onActionClick function on action button click", () => {
    const nodes = [
      machineFactory({
        actions: [NodeActions.DEPLOY],
      }),
    ];
    const onActionClick = jest.fn();
    const wrapper = mount(
      <NodeActionMenu nodes={nodes} onActionClick={onActionClick} />
    );

    openMenu(wrapper);
    getActionButton(wrapper, NodeActions.DEPLOY).simulate("click");

    expect(onActionClick).toHaveBeenCalledWith(NodeActions.DEPLOY);
  });

  it("can exclude actions from being shown", () => {
    const nodes = [
      machineFactory({
        actions: [NodeActions.DEPLOY, NodeActions.DELETE],
      }),
    ];
    const wrapper = mount(
      <NodeActionMenu
        excludeActions={[NodeActions.DELETE]}
        nodes={nodes}
        onActionClick={jest.fn()}
      />
    );

    openMenu(wrapper);

    expect(getActionButton(wrapper, NodeActions.DEPLOY).exists()).toBe(true);
    expect(getActionButton(wrapper, NodeActions.DELETE).exists()).toBe(false);
  });

  it("can change the display text of the nodes in the disabled tooltip", () => {
    const wrapper = mount(
      <NodeActionMenu
        nodeDisplay="foobar"
        nodes={[]}
        onActionClick={jest.fn()}
      />
    );

    expect(wrapper.find("Tooltip").prop("message")).toBe(
      "Select foobars below to perform an action."
    );
  });

  it("can change the position of the disabled tooltip", () => {
    const wrapper = mount(
      <NodeActionMenu
        disabledTooltipPosition="top-left"
        nodes={[]}
        onActionClick={jest.fn()}
      />
    );

    expect(wrapper.find("Tooltip").prop("position")).toBe("top-left");
  });

  it("can change the position of the menu dropdown", () => {
    const wrapper = mount(
      <NodeActionMenu
        menuPosition="left"
        nodes={[]}
        onActionClick={jest.fn()}
      />
    );

    expect(wrapper.find("ContextualMenu").prop("position")).toBe("left");
  });

  it("can change the appearance of the menu toggle", () => {
    const wrapper = mount(
      <NodeActionMenu
        nodes={[]}
        onActionClick={jest.fn()}
        toggleAppearance="negative"
      />
    );

    expect(wrapper.find("ContextualMenu").prop("toggleAppearance")).toBe(
      "negative"
    );
  });
});
