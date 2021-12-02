import { useEffect, useState } from "react";

import { Link } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import CloneFormFields from "./CloneFormFields";
import CloneResults from "./CloneResults";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent, SetSearchFilter } from "app/base/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineDetails } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  actionDisabled?: boolean;
  clearHeaderContent: ClearHeaderContent;
  machines: Machine[];
  setSearchFilter?: SetSearchFilter;
  viewingDetails: boolean;
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
  actionDisabled,
  clearHeaderContent,
  machines,
  setSearchFilter,
  viewingDetails,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [selectedMachine, setSelectedMachine] = useState<MachineDetails | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);
  const processingCount = useSelector(machineSelectors.cloning).length;
  const destinations = machines.map(({ system_id }) => system_id);

  // Run cleanup function here rather than in the ActionForm otherwise errors
  // get cleared before the results are shown.
  useEffect(() => {
    return () => {
      dispatch(machineActions.cleanup());
    };
  }, [dispatch]);

  return showResults ? (
    <CloneResults
      closeForm={clearHeaderContent}
      destinations={destinations}
      setSearchFilter={setSearchFilter}
      sourceMachine={selectedMachine}
      viewingDetails={viewingDetails}
    />
  ) : (
    <ActionForm<CloneFormValues>
      actionDisabled={actionDisabled}
      actionName={NodeActions.CLONE}
      buttonsBordered
      buttonsHelp={
        <p>
          The clone function allows you to apply storage and/or network
          interface configuration from the source machine to selected
          destination machines.{" "}
          <Link
            external
            href="https://discourse.maas.io/t/cloning-ui/4855"
            rel="noopener noreferrer"
            target="_blank"
          >
            Find out more
          </Link>
        </p>
      }
      clearHeaderContent={clearHeaderContent}
      initialValues={{
        interfaces: false,
        source: "",
        storage: false,
      }}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${viewingDetails ? "details" : "list"} action form`,
        label: "Clone",
      }}
      onSubmit={(values) => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.clone({
            destinations,
            interfaces: values.interfaces,
            storage: values.storage,
            system_id: values.source,
          })
        );
      }}
      onSuccess={() => setShowResults(true)}
      processingCount={processingCount}
      selectedCount={destinations.length}
      validationSchema={CloneFormSchema}
    >
      <CloneFormFields
        selectedMachine={selectedMachine}
        setSelectedMachine={setSelectedMachine}
      />
    </ActionForm>
  );
};

export default CloneForm;
