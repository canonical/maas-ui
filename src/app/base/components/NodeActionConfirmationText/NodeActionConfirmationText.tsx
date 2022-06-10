import type { Node, NodeActions } from "app/store/types/node";
import { getNodeActionLabel } from "app/store/utils";

const NodeActionConfirmationText = ({
  nodes,
  action,
  modelName,
}: {
  nodes: Node[];
  action: NodeActions;
  modelName: string;
}): JSX.Element => (
  <>
    <p>
      Are you sure you want to{" "}
      {getNodeActionLabel(
        nodes.length > 1 ? `${nodes.length} ${modelName}s` : nodes[0].fqdn,
        action,
        false
      ).toLowerCase()}
      ?
    </p>
  </>
);

export default NodeActionConfirmationText;
