import type { Node, NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

const NodeActionConfirmationText = ({
  nodes,
  action,
}: {
  nodes: Node[];
  action: NodeActions;
}): JSX.Element => (
  <>
    <p>
      Are you sure you want to {getNodeActionTitle(action)}{" "}
      {nodes.length > 1 ? " the following?" : nodes[0].fqdn}?
    </p>
    {nodes.length > 1 ? (
      <p>{nodes.map((node) => `${node.fqdn}`).join(", ")}</p>
    ) : null}
  </>
);

export default NodeActionConfirmationText;
