import type { ReactElement } from "react";

import { useDeleteSwitch } from "@/app/api/query/switches";
import type { DeleteSwitchError } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type DeleteSwitchProps = {
  id: number;
};

const DeleteSwitch = ({ id }: DeleteSwitchProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const deleteSwitch = useDeleteSwitch();

  return (
    <ModelActionForm<object, DeleteSwitchError>
      aria-label="Confirm switch deletion"
      errors={deleteSwitch.error}
      initialValues={{}}
      modelType="switch"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteSwitch.mutate({ path: { switch_id: id } });
      }}
      onSuccess={() => {
        closeSidePanel();
      }}
      saved={deleteSwitch.isSuccess}
      saving={deleteSwitch.isPending}
      submitLabel="Delete switch"
    />
  );
};

export default DeleteSwitch;
