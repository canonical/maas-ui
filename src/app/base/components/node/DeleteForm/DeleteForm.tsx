import NodeActionConfirmationText from "../../NodeActionConfirmationText";
import type { NodeActionFormProps } from "../types";

import ActionForm from "app/base/components/ActionForm";
import type { EmptyObject } from "app/base/types";
import { NodeActions } from "app/store/types/node";
import { capitaliseFirst } from "app/utils";

type Props<E = null> = NodeActionFormProps<E> & {
  onSubmit: () => void;
  onAfterSuccess?: () => void;
  redirectURL: string;
};

export const DeleteForm = <E,>({
  cleanup,
  clearSidePanelContent,
  errors,
  modelName,
  nodes,
  onAfterSuccess,
  onSubmit,
  processingCount,
  selectedCount,
  redirectURL,
  viewingDetails,
  actionStatus,
}: Props<E>): JSX.Element => {
  return (
    <ActionForm<EmptyObject, E>
      actionName={NodeActions.DELETE}
      actionStatus={actionStatus}
      allowUnchanged
      cleanup={cleanup}
      errors={errors}
      initialValues={{}}
      modelName={modelName}
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `${capitaliseFirst(modelName)} ${
          viewingDetails ? "details" : "list"
        } action form`,
        label: "Delete",
      }}
      onSubmit={onSubmit}
      onSuccess={() => {
        clearSidePanelContent();
        onAfterSuccess?.();
      }}
      processingCount={processingCount}
      savedRedirect={viewingDetails ? redirectURL : undefined}
      selectedCount={nodes ? nodes.length : selectedCount ?? 0}
      submitAppearance="negative"
    >
      <NodeActionConfirmationText
        action={NodeActions.DELETE}
        modelName={modelName}
        selectedCount={nodes ? nodes.length : selectedCount ?? 0}
      />
    </ActionForm>
  );
};

export default DeleteForm;
