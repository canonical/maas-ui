import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { actions as podActions } from "app/store/pod";
import { pod as podSelectors } from "app/base/selectors";
import { useProcessing } from "app/base/hooks";
import { formatErrors } from "app/utils";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";

type Props = {
  setSelectedAction: (action: string) => void;
};

const DeleteForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const podErrors = useSelector(podSelectors.errors);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const deletingSelected = useSelector(podSelectors.deletingSelected);
  const [processing, setProcessing] = useState(false);

  const selectedCount =
    selectedPodIDs.length === 1 ? "KVM" : `${selectedPodIDs.length} KVMs`;
  const errors = formatErrors(podErrors);

  useProcessing(
    deletingSelected.length,
    () => {
      setProcessing(false);
      setSelectedAction(null);
    },
    Object.keys(podErrors).length > 0,
    () => setProcessing(false)
  );

  return (
    <FormikForm
      buttons={FormCardButtons}
      buttonsBordered={false}
      errors={errors}
      cleanup={podActions.cleanup}
      initialValues={{}}
      onCancel={() => setSelectedAction("")}
      onSaveAnalytics={{
        action: "Delete",
        category: "Take action menu",
        label: "Delete selected KVMs",
      }}
      onSubmit={() => {
        selectedPodIDs.forEach((podID) => {
          dispatch(podActions.delete(podID));
        });
        setProcessing(true);
      }}
      saving={processing}
      savingLabel={
        selectedPodIDs.length === 1
          ? "Deleting KVM..."
          : `Deleting ${
              selectedPodIDs.length - deletingSelected.length
            } of ${selectedCount}...`
      }
      submitAppearance="negative"
      submitLabel={`Delete ${selectedCount}`}
    />
  );
};

export default DeleteForm;
