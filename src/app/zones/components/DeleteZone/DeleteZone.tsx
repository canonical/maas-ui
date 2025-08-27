import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useDeleteZone } from "@/app/api/query/zones";
import { getZoneQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type DeleteZoneProps = {
  id: number;
};

const DeleteZone: React.FC<DeleteZoneProps> = ({ id }) => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const deleteZone = useDeleteZone();

  return (
    <ModelActionForm
      aria-label="Confirm AZ deletion"
      errors={deleteZone.error}
      initialValues={{}}
      message="Are you sure you want to delete this AZ?"
      modelType="zone"
      onCancel={closeSidePanel}
      onSubmit={() => {
        deleteZone.mutate({ path: { zone_id: id } });
      }}
      onSuccess={() => {
        return queryClient
          .invalidateQueries({
            queryKey: getZoneQueryKey({
              path: { zone_id: id },
            }),
          })
          .then(closeSidePanel);
      }}
      saved={deleteZone.isSuccess}
      saving={deleteZone.isPending}
    />
  );
};

export default DeleteZone;
