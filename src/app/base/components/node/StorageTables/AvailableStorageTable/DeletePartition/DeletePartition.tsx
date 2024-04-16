import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Partition } from "@/app/store/types/node";

type Props = {
  close: () => void;
  systemId: Machine["system_id"];
  partitionId: Partition["id"];
};

const DeletePartition = ({ systemId, partitionId, close }: Props) => {
  const dispatch = useDispatch();
  return (
    <ModelActionForm
      aria-label="Delete partition"
      initialValues={{}}
      message={<>Are you sure you want to remove this partition?</>}
      modelType="partition"
      onCancel={close}
      onSaveAnalytics={{
        action: `Delete partition`,
        category: "Machine storage",
        label: `Remove partition`,
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.deletePartition({
            partitionId,
            systemId: systemId,
          })
        );
        close();
      }}
      submitAppearance="negative"
      submitLabel="Remove partition"
    />
  );
};

export default DeletePartition;
