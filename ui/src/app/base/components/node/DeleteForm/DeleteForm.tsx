import { Redirect } from "react-router-dom";

import MachineActionConfirmationText from "../../NodeActionConfirmationText";
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
  const deleteComplete = useProcessing({
    hasErrors: !!errors,
    processingCount,
  });
  if (deleteComplete && viewingDetails) {
    return <Redirect data-testid="delete-redirect" to={redirectURL} />;
  }

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
      <MachineActionConfirmationText
        nodes={nodes}
        action={NodeActions.DELETE}
      />
    </ActionForm>
  );
};

export default DeleteForm;
