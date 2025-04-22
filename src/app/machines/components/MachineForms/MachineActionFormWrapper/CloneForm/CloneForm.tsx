import { useEffect, useState } from "react";

import { ExternalLink } from "@canonical/maas-react-components";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import CloneFormFields from "./CloneFormFields";
import CloneResults from "./CloneResults";

import ActionForm from "@/app/base/components/ActionForm";
import type { SetSearchFilter } from "@/app/base/types";
import type { MachineActionFormProps } from "@/app/machines/types";
import { machineActions } from "@/app/store/machine";
import type { Machine, MachineDetails } from "@/app/store/machine/types";
import { useSelectedMachinesActionsDispatch } from "@/app/store/machine/utils/hooks";
import { NodeActions } from "@/app/store/types/node";

type Props = {
  setSearchFilter?: SetSearchFilter;
} & MachineActionFormProps;

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
  .test(
    "networkOrStorage",
    "Neither network nor storage selected",
    (values, context) => {
      if (!(values.interfaces || values.storage)) {
        return context.createError({
          message: "Either networking or storage must be selected.",
          path: "hidden", // we don't surface the error at a particular field
        });
      }
      return true;
    }
  )
  .defined();

export const CloneForm = ({
  clearSidePanelContent,
  searchFilter,
  selectedMachines,
  selectedCount,
  processingCount,
  setSearchFilter,
  viewingDetails,
}: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const {
    dispatch: dispatchForSelectedMachines,
    actionErrors,
    ...actionProps
  } = useSelectedMachinesActionsDispatch({ selectedMachines, searchFilter });
  const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);

  // Run cleanup function here rather than in the ActionForm otherwise errors
  // get cleared before the results are shown.
  useEffect(() => {
    return () => {
      dispatch(machineActions.cleanup());
    };
  }, [dispatch]);

  return showResults || actionErrors ? (
    <CloneResults
      closeForm={clearSidePanelContent}
      selectedCount={selectedCount}
      setSearchFilter={setSearchFilter}
      sourceMachine={selectedMachine}
      viewingDetails={viewingDetails}
    />
  ) : (
    <ActionForm<CloneFormValues>
      actionName={NodeActions.CLONE}
      buttonsHelp={
        <p>
          The clone function allows you to apply storage and/or network
          interface configuration from the source machine to selected
          destination machines.{" "}
          <ExternalLink to="https://discourse.maas.io/t/cloning-ui/4855">
            Find out more
          </ExternalLink>
        </p>
      }
      initialValues={{
        interfaces: false,
        source: "",
        storage: false,
      }}
      modelName="machine"
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Clone",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        if (selectedMachines) {
          dispatchForSelectedMachines(machineActions.clone, {
            interfaces: values.interfaces,
            storage: values.storage,
            system_id: values.source,
          });
        }
      }}
      onSuccess={() => setShowResults(true)}
      processingCount={processingCount}
      selectedCount={selectedCount}
      validationSchema={CloneFormSchema}
      {...actionProps}
    >
      <CloneFormFields
        selectedMachine={selectedMachine}
        setSelectedMachine={setSelectedMachine}
      />
    </ActionForm>
  );
};

export default CloneForm;
