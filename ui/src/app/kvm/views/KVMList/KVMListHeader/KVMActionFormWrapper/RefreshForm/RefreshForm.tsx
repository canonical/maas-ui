import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import ActionForm from "app/base/components/ActionForm";

type Props = {
  setSelectedAction: (action: string) => void;
};

const RefreshForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(podSelectors.errors);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const refreshingSelected = useSelector(podSelectors.refreshingSelected);

  return (
    <ActionForm
      actionName="refresh"
      cleanup={podActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null)}
      errors={errors}
      modelName="KVM"
      onSubmit={() => {
        selectedPodIDs.forEach((podID) => {
          dispatch(podActions.refresh(podID));
        });
      }}
      processingCount={refreshingSelected.length}
      selectedCount={selectedPodIDs.length}
    >
      <p>
        Refreshing KVMs will cause MAAS to recalculate usage metrics, update
        information about storage pools, and commission any machines present in
        the KVMs that are not yet known to MAAS.
      </p>
    </ActionForm>
  );
};

export default RefreshForm;
