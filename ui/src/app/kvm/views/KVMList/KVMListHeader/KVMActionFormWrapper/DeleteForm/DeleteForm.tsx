import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
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
  const selectedCount = `${selectedPodIDs.length} KVM${
    selectedPodIDs.length === 1 ? "" : "s"
  }`;
  const errors = formatErrors(podErrors);

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
        setSelectedAction("");
      }}
      submitAppearance="negative"
      submitLabel={`Delete ${selectedCount}`}
    />
  );
};

export default DeleteForm;
