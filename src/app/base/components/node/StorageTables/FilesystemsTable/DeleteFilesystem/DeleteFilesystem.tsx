import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk, Partition } from "@/app/store/types/node";
import { isDisk, isMounted } from "@/app/store/utils";

type Props = {
  close: () => void;
  systemId: Machine["system_id"];
  storageDevice: Disk | Partition;
};

const DeleteFilesystem = ({
  close,
  systemId,
  storageDevice,
}: Props): ReactElement => {
  const dispatch = useDispatch();
  const deviceIsDisk = isDisk(storageDevice);
  const storageFs = storageDevice.filesystem;
  const isDiskFsDelete = deviceIsDisk && isMounted(storageFs);

  return (
    <ModelActionForm
      aria-label="Delete filesystem"
      initialValues={{}}
      message={<>Are you sure you want to remove this filesystem?</>}
      modelType="filesystem"
      onCancel={close}
      onSaveAnalytics={{
        action: `Delete ${isDiskFsDelete ? "disk" : "partition"} filesystem`,
        category: "Machine storage",
        label: "Remove",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        if (isDiskFsDelete) {
          dispatch(
            machineActions.deleteFilesystem({
              blockDeviceId: storageDevice.id,
              filesystemId: storageFs.id,
              systemId,
            })
          );
        } else {
          dispatch(
            machineActions.deletePartition({
              partitionId: storageDevice.id,
              systemId,
            })
          );
        }
        close();
      }}
      submitAppearance="negative"
      submitLabel="Remove"
    />
  );
};

export default DeleteFilesystem;
