import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Partition } from "@/app/store/types/node";

type Props = {
  readonly close: () => void;
  readonly systemId: Machine["system_id"];
  readonly partitionId: Partition["id"];
};

const DeletePartition = ({
  systemId,
  partitionId,
  close,
}: Props): ReactElement => {
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
