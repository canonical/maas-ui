import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { pod as podActions } from "app/base/actions";
import { pod as podSelectors } from "app/base/selectors";
import ActionForm from "app/base/components/ActionForm";

type Props = {
  setSelectedAction: (action: string | null) => void;
};

const DeleteForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const errors = useSelector(podSelectors.errors);
  const selectedPodIDs = useSelector(podSelectors.selectedIDs);
  const deletingSelected = useSelector(podSelectors.deletingSelected);
  const podsToDelete = id ? [Number(id)] : selectedPodIDs;

  return (
    <ActionForm
      actionName="delete"
      cleanup={podActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null)}
      errors={errors}
      modelName="KVM"
      onSubmit={() => {
        podsToDelete.forEach((podID) => {
          dispatch(podActions.delete(podID));
        });
      }}
      processingCount={deletingSelected.length}
      selectedCount={podsToDelete.length}
      submitAppearance="negative"
    />
  );
};

export default DeleteForm;
