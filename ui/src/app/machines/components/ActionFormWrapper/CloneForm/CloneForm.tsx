import { useSelector } from "react-redux";
import * as Yup from "yup";

import CloneFormFields from "./CloneFormFields";

import ActionForm from "app/base/components/ActionForm";
import type { ClearSelectedAction } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  actionDisabled?: boolean;
  clearSelectedAction: ClearSelectedAction;
};

export type CloneFormValues = {
  interfaces: boolean;
  source: Machine["system_id"];
  storage: boolean;
};

const CloneFormSchema = Yup.object()
  .shape({
    interfaces: Yup.boolean(),
    source: Yup.string().required("Source machine must be selected."),
    storage: Yup.boolean(),
  })
  .defined();

export const CloneForm = ({
  actionDisabled,
  clearSelectedAction,
}: Props): JSX.Element => {
  const machines = useSelector(machineSelectors.all);
  const selectedMachineIDs = useSelector(machineSelectors.selectedIDs);

  return (
    <ActionForm<CloneFormValues>
      actionDisabled={actionDisabled}
      actionName={NodeActions.CLONE}
      cleanup={machineActions.cleanup}
      clearSelectedAction={clearSelectedAction}
      initialValues={{
        interfaces: false,
        source: "",
        storage: false,
      }}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${
          selectedMachineIDs.length ? "list" : "details"
        } action form`,
        label: "Clone",
      }}
      onSubmit={() => void null}
      selectedCount={selectedMachineIDs.length || 1}
      submitDisabled
      validationSchema={CloneFormSchema}
    >
      <CloneFormFields machines={machines} />
    </ActionForm>
  );
};

export default CloneForm;
