import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent, EmptyObject } from "app/base/types";
import { useMachineActionForm } from "app/machines/hooks";
import machineURLs from "app/machines/urls";
import { actions as machineActions } from "app/store/machine";
import type {
  Machine,
  MachineActions,
  MachineEventErrors,
} from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils/node";
import { kebabToCamelCase } from "app/utils";

// List of machine actions that do not require any extra parameters sent through
// the websocket apart from machine system id. All other actions will have
// their own form components.
const fieldlessActions = [
  NodeActions.ABORT,
  NodeActions.ACQUIRE,
  NodeActions.DELETE,
  NodeActions.EXIT_RESCUE_MODE,
  NodeActions.LOCK,
  NodeActions.MARK_BROKEN,
  NodeActions.MARK_FIXED,
  NodeActions.OFF,
  NodeActions.ON,
  NodeActions.RESCUE_MODE,
  NodeActions.UNLOCK,
];

type Props = {
  action: MachineActions;
  actionDisabled?: boolean;
  clearHeaderContent: ClearHeaderContent;
  machines: Machine[];
  viewingDetails: boolean;
};

export const FieldlessForm = ({
  action,
  actionDisabled,
  clearHeaderContent,
  machines,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { errors, processingCount } = useMachineActionForm(action);
  const isDeletingMachine =
    viewingDetails && action === NodeActions.DELETE && processingCount === 1;
  const previousIsDeletingMachine = usePrevious(isDeletingMachine, false);
  // Check if the machine cycled from deleting to not deleting and didn't
  // return an error.
  if (previousIsDeletingMachine && !isDeletingMachine && !errors) {
    // The machine was just deleted so redirect to the machine list.
    return <Redirect to={machineURLs.machines.index} />;
  }

  return (
    <ActionForm<EmptyObject, MachineEventErrors>
      actionDisabled={actionDisabled}
      actionName={action}
      allowUnchanged
      cleanup={machineActions.cleanup}
      clearHeaderContent={clearHeaderContent}
      errors={errors}
      initialValues={{}}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: getNodeActionTitle(action),
      }}
      onSubmit={() => {
        if (fieldlessActions.includes(action)) {
          const actionMethod = kebabToCamelCase(action);
          // Find the method for the function.
          const [, actionFunction] =
            Object.entries(machineActions).find(
              ([key]) => key === actionMethod
            ) || [];
          if (actionFunction) {
            machines.forEach((machine) => {
              dispatch(actionFunction(machine.system_id));
            });
          }
        }
      }}
      processingCount={processingCount}
      selectedCount={machines.length}
      submitAppearance={action === NodeActions.DELETE ? "negative" : "positive"}
    />
  );
};

export default FieldlessForm;
