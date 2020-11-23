import React, { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import ActionForm from "app/base/components/ActionForm";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

import type { RouteParams } from "app/base/types";

type Props = {
  setSelectedAction: (action: string | null) => void;
};

const RefreshForm = ({ setSelectedAction }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const errors = useSelector(podSelectors.errors);
  const selectedRSDIDs = useSelector(podSelectors.selectedRSDs).map(
    (rsd) => rsd.id
  );
  const refreshing = useSelector(podSelectors.refreshing);
  const refreshingSelected = useSelector(podSelectors.refreshingSelected);
  const rsdsToRefresh = id ? [Number(id)] : selectedRSDIDs;
  const cleanup = useCallback(() => podActions.cleanup(), []);

  return (
    <ActionForm
      actionName="refresh"
      cleanup={cleanup}
      clearSelectedAction={() => setSelectedAction(null)}
      errors={errors}
      modelName="RSD"
      onSubmit={() => {
        rsdsToRefresh.forEach((podID) => {
          dispatch(podActions.refresh(podID));
        });
      }}
      processingCount={id ? refreshing.length : refreshingSelected.length}
      selectedCount={rsdsToRefresh.length}
    >
      <p>
        Refreshing RSDs will cause MAAS to recalculate usage metrics, update
        information about storage pools, and commission any machines present in
        the RSDs that are not yet known to MAAS.
      </p>
    </ActionForm>
  );
};

export default RefreshForm;
