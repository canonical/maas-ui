import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk } from "@/app/store/types/node";
import { formatType } from "@/app/store/utils";

type Props = {
  readonly close: () => void;
  readonly systemId: Machine["system_id"];
  readonly disk: Disk;
};

const DeleteDisk = ({ systemId, disk, close }: Props): ReactElement => {
  const dispatch = useDispatch();
  const diskType = formatType(disk, true);
  return (
    <ModelActionForm
      aria-label="Delete disk"
      initialValues={{}}
      message={<>Are you sure you want to remove this {diskType}?</>}
      modelType={diskType}
      onCancel={close}
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
        close();
      }}
      submitAppearance="negative"
      submitLabel={`Remove ${diskType}`}
    />
  );
};

export default DeleteDisk;
