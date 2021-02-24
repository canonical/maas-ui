import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";

import ActionForm from "app/base/components/ActionForm";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

type Props = {
  setSelectedAction: (action: string | null) => void;
};

const DeleteForm = ({ setSelectedAction }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const activePod = useSelector(podSelectors.active);
  const errors = useSelector(podSelectors.errors);
  const deleting = useSelector(podSelectors.deleting);
  const cleanup = useCallback(() => podActions.cleanup(), []);

  if (activePod) {
    return (
      <ActionForm
        actionName="delete"
        cleanup={cleanup}
        clearSelectedAction={() => setSelectedAction(null)}
        errors={errors}
        modelName="KVM"
        onSaveAnalytics={{
          action: "Submit",
          category: "KVM details action form",
          label: "Delete",
        }}
        onSubmit={() => {
          dispatch(podActions.delete(activePod.id));
        }}
        processingCount={deleting.length}
        selectedCount={deleting.length}
        submitAppearance="negative"
      />
    );
  }
  return null;
};

export default DeleteForm;
