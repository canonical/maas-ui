import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import ActionForm from "app/base/components/ActionForm";

type Props = {
  setSelectedAction: (action: string | null) => void;
};

const RefreshForm = ({ setSelectedAction }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const errors = useSelector(podSelectors.errors);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const refreshing = useSelector(podSelectors.refreshing);
  const refreshingSelected = useSelector(podSelectors.refreshingSelected);
  const podsToRefresh = id ? [Number(id)] : selectedPodIDs;

  return (
    <ActionForm
      actionName="refresh"
      cleanup={podActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null)}
      errors={errors}
      modelName="KVM"
      onSubmit={() => {
        podsToRefresh.forEach((podID) => {
          dispatch(podActions.refresh(podID));
        });
      }}
      processingCount={id ? refreshing.length : refreshingSelected.length}
      selectedCount={podsToRefresh.length}
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
