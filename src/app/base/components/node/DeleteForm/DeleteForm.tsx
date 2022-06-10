import { useEffect } from "react";

import { useNavigate } from "react-router-dom-v5-compat";

import NodeActionConfirmationText from "../../NodeActionConfirmationText";
import type { NodeActionFormProps } from "../types";

import ActionForm from "app/base/components/ActionForm";
import { useProcessing } from "app/base/hooks";
import type { EmptyObject } from "app/base/types";
import { NodeActions } from "app/store/types/node";
import { capitaliseFirst } from "app/utils";

type Props<E = null> = NodeActionFormProps<E> & {
  onSubmit: () => void;
  redirectURL: string;
};

export const DeleteForm = <E,>({
  cleanup,
  clearHeaderContent,
  errors,
  modelName,
  nodes,
  onSubmit,
  processingCount,
  redirectURL,
  viewingDetails,
}: Props<E>): JSX.Element => {
  const navigate = useNavigate();
  const deleteComplete = useProcessing({
    hasErrors: !!errors,
    processingCount,
  });

  useEffect(() => {
    if (deleteComplete && viewingDetails) {
      navigate(redirectURL, { replace: true });
    }
  }, [navigate, deleteComplete, redirectURL, viewingDetails]);

  return (
    <ActionForm<EmptyObject, E>
      actionName={NodeActions.DELETE}
      allowUnchanged
      cleanup={cleanup}
      errors={errors}
      initialValues={{}}
      modelName={modelName}
      onCancel={clearHeaderContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `${capitaliseFirst(modelName)} ${
          viewingDetails ? "details" : "list"
        } action form`,
        label: "Delete",
      }}
      onSubmit={() => onSubmit()}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={nodes.length}
      submitAppearance="negative"
    >
      <NodeActionConfirmationText
        nodes={nodes}
        action={NodeActions.DELETE}
        modelName={modelName}
      />
    </ActionForm>
  );
};

export default DeleteForm;
