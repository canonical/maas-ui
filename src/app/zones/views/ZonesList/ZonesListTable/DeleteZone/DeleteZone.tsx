import React from "react";

import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import type { RootState } from "@/app/store/root/types";
import { zoneActions } from "@/app/store/zone";
import { ZONE_ACTIONS } from "@/app/store/zone/constants";
import zoneSelectors from "@/app/store/zone/selectors";

type DeleteZoneProps = {
  closeForm: () => void;
  id: number;
};

const DeleteZone: React.FC<DeleteZoneProps> = ({ closeForm, id }) => {
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state: RootState) =>
    zoneSelectors.getModelActionStatus(state, ZONE_ACTIONS.delete, id)
  );

  return (
    <ModelActionForm
      aria-label="Confirm AZ deletion"
      initialValues={{}}
      message="Are you sure you want to delete this AZ?"
      modelType="zone"
      onCancel={closeForm}
      onSubmit={() => {
        dispatch(zoneActions.delete({ id }));
      }}
      onSuccess={() => {
        dispatch(zoneActions.cleanup([ZONE_ACTIONS.delete]));
        closeForm();
      }}
      saved={deleteStatus === "success"}
      saving={deleteStatus === "loading"}
    />
  );
};

export default DeleteZone;
