import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Filesystem } from "@/app/store/types/node";

type Props = {
  close: () => void;
  mountPoint: Filesystem["mount_point"];
  systemId: Machine["system_id"];
};

const DeleteSpecialFilesystem = ({ close, systemId, mountPoint }: Props) => {
  const dispatch = useDispatch();

  return (
    <ModelActionForm
      aria-label="Delete special filesystem"
      initialValues={{}}
      message={<>Are you sure you want to remove this special filesystem?</>}
      modelType="special filesystem"
      onCancel={close}
      onSaveAnalytics={{
        action: "Unmount special filesystem",
        category: "Machine storage",
        label: "Remove",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.unmountSpecial({
            mountPoint,
            systemId,
          })
        );
        close();
      }}
      submitAppearance="negative"
      submitLabel="Remove"
    />
  );
};

export default DeleteSpecialFilesystem;
