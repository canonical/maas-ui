import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk } from "@/app/store/types/node";
import { formatType } from "@/app/store/utils";

type DeleteDiskProps = {
  systemId: Machine["system_id"];
  disk: Disk;
};

const DeleteDisk = ({ systemId, disk }: DeleteDiskProps): ReactElement => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const diskType = formatType(disk, true);
  return (
    <ModelActionForm
      aria-label="Delete disk"
      initialValues={{}}
      message={<>Are you sure you want to remove this {diskType}?</>}
      modelType={diskType}
      onCancel={closeModal}
      onSaveAnalytics={{
        action: `Delete ${diskType}`,
        category: "Machine storage",
        label: `Remove ${diskType}`,
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.deleteDisk({
            blockId: disk.id,
            systemId: systemId,
          })
        );
        closeModal();
      }}
      submitAppearance="negative"
      submitLabel={`Remove ${diskType}`}
    />
  );
};

export default DeleteDisk;
