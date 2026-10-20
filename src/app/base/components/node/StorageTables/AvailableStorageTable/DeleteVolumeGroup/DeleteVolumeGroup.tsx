import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk } from "@/app/store/types/node";

type DeleteVolumeGroupProps = {
  systemId: Machine["system_id"];
  diskId: Disk["id"];
};

const DeleteVolumeGroup = ({
  systemId,
  diskId,
}: DeleteVolumeGroupProps): ReactElement => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  return (
    <ModelActionForm
      aria-label="Delete volume group"
      initialValues={{}}
      message={<>Are you sure you want to remove this volume group?</>}
      modelType="volume group"
      onCancel={closeModal}
      onSaveAnalytics={{
        action: "Delete volume group",
        category: "Machine storage",
        label: "Remove volume group",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.deleteVolumeGroup({
            volumeGroupId: diskId,
            systemId: systemId,
          })
        );
        closeModal();
      }}
      submitAppearance="negative"
      submitLabel="Remove volume group"
    />
  );
};

export default DeleteVolumeGroup;
