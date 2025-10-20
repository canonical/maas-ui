import type { ReactElement } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useDeleteRack } from "@/app/api/query/racks";
import { getRackQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type DeleteRackProps = {
  id: number;
};
const DeleteRack = ({ id }: DeleteRackProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
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
        return queryClient
          .invalidateQueries({
            queryKey: getRackQueryKey({
              path: { rack_id: id },
            }),
          })
          .then(closeSidePanel);
      }}
      saved={deleteRack.isSuccess}
      saving={deleteRack.isPending}
    />
  );
};

export default DeleteRack;
