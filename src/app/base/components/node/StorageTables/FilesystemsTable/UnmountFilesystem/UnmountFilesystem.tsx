import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { actions as machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk, Partition } from "@/app/store/types/node";
import { isDisk, isMounted } from "@/app/store/utils";

type Props = {
  close: () => void;
  systemId: Machine["system_id"];
  storageDevice: Disk | Partition;
};

const UnmountFilesystem = ({ close, systemId, storageDevice }: Props) => {
  const dispatch = useDispatch();
  const deviceIsDisk = isDisk(storageDevice);
  const storageFs = storageDevice.filesystem;
  const isDiskFsUnmount = deviceIsDisk && isMounted(storageFs);

  return (
    <ModelActionForm
      aria-label="Unmount filesystem"
      initialValues={{}}
      message={<>Are you sure you want to unmount this filesystem?</>}
      modelType="filesystem"
      onCancel={close}
      onSaveAnalytics={{
        action: `Unmount ${isDiskFsUnmount ? "disk" : "partition"} filesystem`,
        category: "Machine storage",
        label: "Unmount",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        if (isDiskFsUnmount) {
          dispatch(
            machineActions.updateFilesystem({
              blockId: storageDevice.id,
              mountOptions: "",
              mountPoint: "",
              systemId,
            })
          );
        } else {
          dispatch(
            machineActions.updateFilesystem({
              mountOptions: "",
              mountPoint: "",
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

export default UnmountFilesystem;
