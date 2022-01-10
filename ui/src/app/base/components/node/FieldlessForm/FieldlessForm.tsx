import { useDispatch } from "react-redux";

import type { NodeActionFormProps } from "../types";

import ActionForm from "app/base/components/ActionForm";
import type { EmptyObject } from "app/base/types";
import type { actions as controllerActions } from "app/store/controller";
import type { actions as machineActions } from "app/store/machine";
import type { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";
import { capitaliseFirst, kebabToCamelCase } from "app/utils";

type Props<E = null> = NodeActionFormProps<E> & {
  actions: typeof machineActions | typeof controllerActions;
  action: NodeActions;
  cleanup: NonNullable<NodeActionFormProps<E>["cleanup"]>;
};

export const FieldlessForm = <E,>({
  action,
  actions,
  cleanup,
  clearHeaderContent,
  errors,
  modelName,
  nodes,
  processingCount,
  viewingDetails,
}: Props<E>): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <ActionForm<EmptyObject, E>
      actionName={action}
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
        label: getNodeActionTitle(action),
      }}
      onSubmit={() => {
        dispatch(cleanup());
        const actionMethod = kebabToCamelCase(action);
        nodes.forEach((node) => {
          // Find the method for the function.
          const [, actionFunction] =
            Object.entries(actions).find(([key]) => key === actionMethod) || [];
          if (actionFunction) {
            dispatch(actionFunction(node.system_id));
          }
        });
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={nodes.length}
    />
  );
};

export default FieldlessForm;
