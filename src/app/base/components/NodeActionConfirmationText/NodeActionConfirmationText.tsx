import type { NodeActions } from "@/app/store/types/node";
import { getNodeActionLabel } from "@/app/store/utils";

const NodeActionConfirmationText = ({
  selectedCount,
  action,
  modelName,
}: {
  selectedCount: number;
  action: NodeActions;
  modelName: string;
}): React.ReactElement => (
  <>
    <p>
      Are you sure you want to{" "}
      {getNodeActionLabel(
        selectedCount > 1
          ? `${selectedCount} ${modelName}s`
          : `this ${modelName}`,
        action,
        false
      ).toLowerCase()}
      ?
    </p>
  </>
);

export default NodeActionConfirmationText;
