import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { actions as machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk } from "@/app/store/types/node";

type Props = {
  close: () => void;
  systemId: Machine["system_id"];
  diskId: Disk["id"];
};

const CreateCacheSet = ({ systemId, diskId, close }: Props) => {
  const dispatch = useDispatch();
  return (
    <ModelActionForm
      aria-label="Create cache set"
      initialValues={{}}
      message={<>Are you sure you want to create a cache set?</>}
      modelType="cache set"
      onCancel={close}
      onSaveAnalytics={{
        action: "Create cache set from disk",
        category: "Machine storage",
        label: "Create cache set",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.createCacheSet({
            blockId: diskId,
            systemId: systemId,
          })
        );
        close();
      }}
      submitAppearance="positive"
      submitLabel="Create cache set"
    />
  );
};

export default CreateCacheSet;
