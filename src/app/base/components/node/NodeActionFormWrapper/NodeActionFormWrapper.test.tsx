import { mount } from "enzyme";

import NodeActionFormWrapper from "./NodeActionFormWrapper";

import type { Node } from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import { machine as machineFactory } from "testing/factories";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";

describe("NodeActionFormWrapper", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children if all selected nodes can perform selected action", () => {
    const nodes = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.ABORT] }),
      machineFactory({ system_id: "def456", actions: [NodeActions.ABORT] }),
    ];
    const wrapper = mount(
      <NodeActionFormWrapper
        action={NodeActions.ABORT}
        clearSidePanelContent={jest.fn()}
        nodeType="node"
        nodes={nodes}
        onUpdateSelected={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      >
        <span data-testid="children">Children</span>
      </NodeActionFormWrapper>
    );

    expect(wrapper.find("[data-testid='children']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='node-action-warning']").exists()).toBe(
      false
    );
  });

  it("displays a warning if not all selected nodes can perform selected action", () => {
    const nodes = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.ABORT] }),
      machineFactory({ system_id: "def456", actions: [] }),
    ];
    const wrapper = mount(
      <NodeActionFormWrapper
        action={NodeActions.ABORT}
        clearSidePanelContent={jest.fn()}
        nodeType="node"
        nodes={nodes}
        onUpdateSelected={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      >
        <span data-testid="children">Children</span>
      </NodeActionFormWrapper>
    );

    expect(wrapper.find("[data-testid='node-action-warning']").exists()).toBe(
      true
    );
    expect(wrapper.find("[data-testid='children']").exists()).toBe(false);
  });

  it(`does not display a warning when action has started even if not all
      selected nodes can perform selected action`, async () => {
    // Mock that action has started.
    mockFormikFormSaved();
    const nodes = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.ABORT] }),
      machineFactory({ system_id: "def456", actions: [] }),
    ];
    const wrapper = mount(
      <NodeActionFormWrapper
        action={NodeActions.ABORT}
        clearSidePanelContent={jest.fn()}
        nodeType="node"
        nodes={nodes}
        onUpdateSelected={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      >
        <span data-testid="children">Children</span>
      </NodeActionFormWrapper>
    );

    expect(wrapper.find("[data-testid='children']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='node-action-warning']").exists()).toBe(
      false
    );
  });

  it("can run a function on actionable nodes if warning is shown", () => {
    const onUpdateSelected = jest.fn();
    const nodes = [
      machineFactory({ system_id: "abc123", actions: [NodeActions.ABORT] }),
      machineFactory({ system_id: "def456", actions: [] }),
    ];
    const wrapper = mount(
      <NodeActionFormWrapper
        action={NodeActions.ABORT}
        clearSidePanelContent={jest.fn()}
        nodeType="node"
        nodes={nodes}
        onUpdateSelected={onUpdateSelected}
        processingCount={0}
        viewingDetails={false}
      >
        Children
      </NodeActionFormWrapper>
    );

    wrapper.find("button[data-testid='on-update-selected']").simulate("click");

    expect(onUpdateSelected).toHaveBeenCalledWith(["abc123"]);
  });

  it("clears header content if no nodes are provided", () => {
    const clearSidePanelContent = jest.fn();
    const Proxy = ({ nodes }: { nodes: Node[] }) => (
      <NodeActionFormWrapper
        action={NodeActions.ABORT}
        clearSidePanelContent={clearSidePanelContent}
        nodeType="node"
        nodes={nodes}
        onUpdateSelected={jest.fn()}
        processingCount={0}
        viewingDetails={false}
      >
        Children
      </NodeActionFormWrapper>
    );
    // Mount with one node selected.
    const wrapper = mount(<Proxy nodes={[machineFactory()]} />);

    expect(clearSidePanelContent).not.toHaveBeenCalled();

    // Update with no nodes selected - clear header content should be called.
    wrapper.setProps({ nodes: [] });
    wrapper.update();

    expect(clearSidePanelContent).toHaveBeenCalled();
  });
});
