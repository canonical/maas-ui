import type { ReactNode } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { useDispatch, useSelector } from "react-redux";

import type { NodeActionFormProps } from "../types";

import ActionForm from "@/app/base/components/ActionForm";
import { useModal } from "@/app/base/modal-context";
import type { EmptyObject } from "@/app/base/types";
import type { controllerActions } from "@/app/store/controller";
import type { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import { FilterMachines } from "@/app/store/machine/utils";
import {
  useMachineSelectedCount,
  useSelectedMachinesActionsDispatch,
} from "@/app/store/machine/utils/hooks";
import type { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import { capitaliseFirst, kebabToCamelCase } from "@/app/utils";

export type FieldlessFormProps<E = null> = NodeActionFormProps<E> & {
  actions: typeof controllerActions | typeof machineActions;
  action: NodeActions;
  buttonsHelpClassName?: string;
  buttonsHelp?: ReactNode;
  cleanup: NonNullable<NodeActionFormProps<E>["cleanup"]>;
  description?: ReactNode;
};

export const FieldlessForm = <E,>({
  action,
  actions,
  buttonsHelp,
  buttonsHelpClassName,
  cleanup,
  description,
  errors,
  modelName,
  nodes,
  processingCount,
  viewingDetails,
}: FieldlessFormProps<E>): React.ReactElement => {
  const dispatch = useDispatch();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const searchFilter = FilterMachines.filtersToString(currentFilters);
  const selectedMachines = useSelector(machineSelectors.selected);
  const { selectedCount } = useMachineSelectedCount(
    FilterMachines.parseFetchFilters(searchFilter)
  );
  const { dispatch: dispatchForSelectedMachines, ...actionProps } =
    useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });

  const { closeSidePanel, isOpen: isSidePanelOpen } = useSidePanel();
  const { closeModal } = useModal();
  const closeForm = isSidePanelOpen ? closeSidePanel : closeModal;

  return (
    <ActionForm<EmptyObject, E>
      actionName={action}
      allowUnchanged
      buttonsHelp={buttonsHelp}
      buttonsHelpClassName={buttonsHelpClassName}
      cleanup={cleanup}
      errors={errors}
      initialValues={{}}
      modelName={modelName}
      onCancel={closeForm}
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
          if (selectedMachines) {
            dispatchForSelectedMachines(actionFunction);
          } else {
            nodes?.forEach((node) => {
              dispatch(actionFunction({ system_id: node.system_id }));
            });
          }
        }
      }}
      onSuccess={closeForm}
      processingCount={processingCount}
      selectedCount={nodes ? nodes.length : (selectedCount ?? 0)}
      {...actionProps}
    >
      {description}
    </ActionForm>
  );
};

export default FieldlessForm;
