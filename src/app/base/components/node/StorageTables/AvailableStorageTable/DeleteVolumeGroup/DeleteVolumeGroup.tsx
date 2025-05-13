import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk } from "@/app/store/types/node";

type Props = {
  close: () => void;
  systemId: Machine["system_id"];
  diskId: Disk["id"];
};

const DeleteVolumeGroup = ({
  systemId,
  diskId,
  close,
}: Props): ReactElement => {
  const dispatch = useDispatch();
  return (
    <ModelActionForm
      aria-label="Delete volume group"
      initialValues={{}}
      message={<>Are you sure you want to remove this volume group?</>}
      modelType="volume group"
      onCancel={close}
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
        close();
      }}
      submitAppearance="negative"
      submitLabel="Remove volume group"
    />
  );
};

export default DeleteVolumeGroup;
