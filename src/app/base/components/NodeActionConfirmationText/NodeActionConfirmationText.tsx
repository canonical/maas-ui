import type { NodeActions } from "@/app/store/types/node";
import { getNodeActionLabel } from "@/app/store/utils";

const NodeActionConfirmationText = ({
  selectedCount,
  action,
  modelName,
}: {
  readonly selectedCount: number;
  readonly action: NodeActions;
  readonly modelName: string;
}): React.ReactElement => (
  <>
    <p>
      Are you sure you want to{" "}
      {getNodeActionLabel(
        selectedCount > 1 ? `${selectedCount} ${modelName}s` : `a ${modelName}`,
        action,
        false
      ).toLowerCase()}
      ?
    </p>
  </>
);

export default NodeActionConfirmationText;
