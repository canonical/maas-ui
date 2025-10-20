import type { ReactElement } from "react";

import { useDeleteRack } from "@/app/api/query/racks";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type DeleteRackProps = {
  id: number;
};
const DeleteRack = ({ id }: DeleteRackProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const deleteRack = useDeleteRack();
  return (
    <ModelActionForm
      aria-label="Confirm rack deletion"
      errors={deleteRack.error}
      initialValues={{}}
      modelType="rack"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteRack.mutate({ path: { rack_id: id } });
      }}
      onSuccess={() => {
        closeSidePanel();
      }}
      saved={deleteRack.isSuccess}
      saving={deleteRack.isPending}
    />
  );
};

export default DeleteRack;
