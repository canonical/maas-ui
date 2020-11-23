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
  const activePod = useSelector(podSelectors.active);
  const errors = useSelector(podSelectors.errors);
  const selectedKVMIDs = useSelector(podSelectors.selectedKVMs).map(
    (kvm) => kvm.id
  );
  const refreshing = useSelector(podSelectors.refreshing);
  const refreshingSelected = useSelector(podSelectors.refreshingSelected);
  const kvmsToRefresh = id ? [Number(id)] : selectedKVMIDs;
  const cleanup = useCallback(() => podActions.cleanup(), []);

  return (
    <ActionForm
      actionName="refresh"
      cleanup={cleanup}
      clearSelectedAction={() => setSelectedAction(null)}
      errors={errors}
      modelName="KVM"
      onSaveAnalytics={{
        action: "Submit",
        category: `KVM ${activePod ? "details" : "list"} action form`,
        label: "Refresh",
      }}
      onSubmit={() => {
        kvmsToRefresh.forEach((podID) => {
          dispatch(podActions.refresh(podID));
        });
      }}
      processingCount={id ? refreshing.length : refreshingSelected.length}
      selectedCount={kvmsToRefresh.length}
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
