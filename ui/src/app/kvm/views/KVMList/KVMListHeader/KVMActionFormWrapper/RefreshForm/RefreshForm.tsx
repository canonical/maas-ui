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

const RefreshForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const podErrors = useSelector(podSelectors.errors);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const selectedCount = `${selectedPodIDs.length} KVM${
    selectedPodIDs.length === 1 ? "" : "s"
  }`;
  const errors = formatErrors(podErrors);

  return (
    <>
      <p>
        Refreshing KVMs will cause MAAS to recalculate usage metrics, update
        information about storage pools, and commission any machines present in
        the KVMs that are not yet known to MAAS.
      </p>
      <FormikForm
        buttons={FormCardButtons}
        buttonsBordered={false}
        errors={errors}
        cleanup={podActions.cleanup}
        initialValues={{}}
        onCancel={() => setSelectedAction("")}
        onSaveAnalytics={{
          action: "Refresh",
          category: "Take action menu",
          label: "Refresh selected KVMs",
        }}
        onSubmit={() => {
          selectedPodIDs.forEach((podID) => {
            dispatch(podActions.refresh(podID));
          });
          setSelectedAction("");
        }}
        submitLabel={`Refresh ${selectedCount}`}
      />
    </>
  );
};

export default RefreshForm;
