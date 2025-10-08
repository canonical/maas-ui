import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk } from "@/app/store/types/node";

type Props = {
  close: () => void;
  systemId: Machine["system_id"];
  disk: Disk;
};

const DeleteCacheSet = ({ systemId, disk, close }: Props) => {
  const dispatch = useDispatch();
  return (
    <ModelActionForm
      aria-label="Delete cache set"
      initialValues={{}}
      message={<>Are you sure you want to remove this cache set?</>}
      modelType={"cache set"}
      onCancel={close}
      onSaveAnalytics={{
        action: "Delete cache set",
        category: "Machine storage",
        label: "Remove cache set",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.deleteCacheSet({
            cacheSetId: disk.id,
            systemId: systemId,
          })
        );
        close();
      }}
      submitAppearance="negative"
      submitLabel={"Remove cache set"}
    />
  );
};

export default DeleteCacheSet;
