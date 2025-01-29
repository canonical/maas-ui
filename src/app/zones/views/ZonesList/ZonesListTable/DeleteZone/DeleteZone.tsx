import React from "react";

import { useDeleteZone } from "@/app/api/query/zones";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type DeleteZoneProps = {
  closeForm: () => void;
  id: number;
};

const DeleteZone: React.FC<DeleteZoneProps> = ({ closeForm, id }) => {
  const deleteZone = useDeleteZone();

  return (
    <ModelActionForm
      aria-label="Confirm AZ deletion"
      initialValues={{}}
      message="Are you sure you want to delete this AZ?"
      modelType="zone"
      onCancel={closeForm}
      onSubmit={() => {
        deleteZone.mutate({ path: { zone_id: id } });
      }}
      onSuccess={closeForm}
      saved={deleteZone.isSuccess}
      saving={deleteZone.isPending}
    />
  );
};

export default DeleteZone;
