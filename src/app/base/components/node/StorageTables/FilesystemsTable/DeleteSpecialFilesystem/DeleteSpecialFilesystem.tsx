import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Filesystem } from "@/app/store/types/node";

type DeleteSpecialFilesystemProps = {
  mountPoint: Filesystem["mount_point"];
  systemId: Machine["system_id"];
};

const DeleteSpecialFilesystem = ({
  systemId,
  mountPoint,
}: DeleteSpecialFilesystemProps): ReactElement => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  return (
    <ModelActionForm
      aria-label="Delete special filesystem"
      initialValues={{}}
      message={<>Are you sure you want to remove this special filesystem?</>}
      modelType="special filesystem"
      onCancel={closeModal}
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
        closeModal();
      }}
      submitAppearance="negative"
      submitLabel="Remove"
    />
  );
};

export default DeleteSpecialFilesystem;
