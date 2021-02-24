import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import ActionForm from "app/base/components/ActionForm";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

type Props = {
  setSelectedAction: (action: string | null) => void;
};

const RefreshForm = ({ setSelectedAction }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const activePod = useSelector(podSelectors.active);
  const errors = useSelector(podSelectors.errors);
  const refreshing = useSelector(podSelectors.refreshing);
  const cleanup = useCallback(() => podActions.cleanup(), []);

  if (activePod) {
    return (
      <ActionForm
        actionName="refresh"
        cleanup={cleanup}
        clearSelectedAction={() => setSelectedAction(null)}
        errors={errors}
        modelName="KVM"
        onSaveAnalytics={{
          action: "Submit",
          category: "KVM details action form",
          label: "Refresh",
        }}
        onSubmit={() => {
          dispatch(podActions.refresh(activePod.id));
        }}
        processingCount={refreshing.length}
        selectedCount={refreshing.length}
      >
        <p>
          Refreshing KVMs will cause MAAS to recalculate usage metrics, update
          information about storage pools, and commission any machines present
          in the KVMs that are not yet known to MAAS.
        </p>
      </ActionForm>
    );
  }
  return null;
};

export default RefreshForm;
