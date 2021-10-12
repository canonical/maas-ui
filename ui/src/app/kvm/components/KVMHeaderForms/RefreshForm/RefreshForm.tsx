import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import ActionForm from "app/base/components/ActionForm";
import type { ClearHeaderContent, EmptyObject } from "app/base/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
  hostId: Pod["id"];
};

const RefreshForm = ({
  clearHeaderContent,
  hostId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const errors = useSelector(podSelectors.errors);
  const refreshing = useSelector(podSelectors.refreshing);
  const cleanup = useCallback(() => podActions.cleanup(), []);

  if (pod) {
    return (
      <ActionForm<EmptyObject>
        actionName="refresh"
        cleanup={cleanup}
        clearHeaderContent={clearHeaderContent}
        errors={errors}
        initialValues={{}}
        modelName="KVM"
        onSaveAnalytics={{
          action: "Submit",
          category: "KVM details action form",
          label: "Refresh",
        }}
        onSubmit={() => {
          dispatch(podActions.refresh(pod.id));
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
