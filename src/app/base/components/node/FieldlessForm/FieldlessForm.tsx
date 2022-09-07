import { useDispatch } from "react-redux";

import type { NodeActionFormProps } from "../types";

import ActionForm from "app/base/components/ActionForm";
import type { EmptyObject } from "app/base/types";
import type { actions as controllerActions } from "app/store/controller";
import type { actions as machineActions } from "app/store/machine";
import { selectedToFilters } from "app/store/machine/utils";
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
  selected,
  selectedCount,
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
        // Find the method for the function.
        const [, actionFunction] =
          Object.entries(actions).find(([key]) => key === actionMethod) || [];
        if (actionFunction) {
          if (nodes) {
            nodes.forEach((node) => {
              dispatch(actionFunction({ system_id: node.system_id }));
            });
          }
        } else if (selected) {
          const filter = selectedToFilters(selected);
          if (filter) {
            dispatch(actionFunction({ filter }));
          }
        }
      }}
      onSuccess={clearHeaderContent}
      processingCount={processingCount}
      selectedCount={selectedCount}
    />
  );
};

export default FieldlessForm;
