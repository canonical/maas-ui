import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useDeleteZone } from "@/app/api/query/zones";
import { getZoneQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeleteZoneProps = {
  id: number;
  closeForm: () => void;
};

const DeleteZone: React.FC<DeleteZoneProps> = ({ closeForm, id }) => {
  const queryClient = useQueryClient();
  const deleteZone = useDeleteZone();

  return (
    <ModelActionForm
      aria-label="Confirm AZ deletion"
      errors={deleteZone.error}
      initialValues={{}}
      message="Are you sure you want to delete this AZ?"
      modelType="zone"
      onCancel={closeForm}
      onSubmit={() => {
        deleteZone.mutate({ path: { zone_id: id } });
      }}
      onSuccess={() => {
        void queryClient
          .invalidateQueries({
            queryKey: getZoneQueryKey({
              path: { zone_id: id },
            }),
          })
          .then(closeForm);
      }}
      saved={deleteZone.isSuccess}
      saving={deleteZone.isPending}
    />
  );
};

export default DeleteZone;
