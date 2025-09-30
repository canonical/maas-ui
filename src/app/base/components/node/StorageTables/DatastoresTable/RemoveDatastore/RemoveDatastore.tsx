import type { ReactElement } from "react";

import { useDispatch } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { machineActions } from "@/app/store/machine";
import type { Machine } from "@/app/store/machine/types";
import type { Disk } from "@/app/store/types/node";

type Props = {
  systemId: Machine["system_id"];
  diskId: Disk["id"];
};

const RemoveDatastore = ({ systemId, diskId }: Props): ReactElement => {
  const { setSidePanelContent } = useSidePanel();
  const dispatch = useDispatch();

  const closeForm = () => {
    setSidePanelContent(null);
  };

  return (
    <ModelActionForm
      aria-label="Remove datastore"
      initialValues={{}}
      message={
        <>
          Are you sure you want to remove this datastore? ESXi requires at least
          one VMFS datastore to deploy.
        </>
      }
      modelType="datastore"
      onCancel={closeForm}
      onSaveAnalytics={{
        action: "Delete datastore",
        category: "Machine storage",
        label: "Remove datastore",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.deleteDisk({
            blockId: diskId,
            systemId: systemId,
          })
        );
      }}
      onSuccess={closeForm}
      submitAppearance="negative"
      submitLabel="Remove"
    />
  );
};

export default RemoveDatastore;
