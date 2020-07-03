import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import ActionForm from "app/base/components/ActionForm";

type Props = {
  setSelectedAction: (action: string) => void;
};

const DeleteForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(podSelectors.errors);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const deletingSelected = useSelector(podSelectors.deletingSelected);

  return (
    <ActionForm
      actionName="delete"
      cleanup={podActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null)}
      errors={errors}
      modelName="KVM"
      onSubmit={() => {
        selectedPodIDs.forEach((podID) => {
          dispatch(podActions.delete(podID));
        });
      }}
      processingCount={deletingSelected.length}
      selectedCount={selectedPodIDs.length}
      submitAppearance="negative"
    />
  );
};

export default DeleteForm;
