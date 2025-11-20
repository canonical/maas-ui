import React from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";

import { useDeleteZone, useGetZone } from "@/app/api/query/zones";
import { getZoneQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type DeleteZoneProps = {
  id: number;
};

const DeleteZone: React.FC<DeleteZoneProps> = ({ id }) => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const zone = useGetZone({ path: { zone_id: id } });
  const eTag = zone.data?.headers?.get("ETag");
  const deleteZone = useDeleteZone();

  return (
    <>
      {zone.isPending && <Spinner text="Loading..." />}
      {zone.isError && (
        <Notification severity="negative">{zone.error.message}</Notification>
      )}
      {zone.isSuccess && zone.data && (
        <ModelActionForm
          aria-label="Confirm AZ deletion"
          errors={deleteZone.error}
          initialValues={{}}
          message="Are you sure you want to delete this AZ?"
          modelType="zone"
          onCancel={closeSidePanel}
          onSubmit={() => {
            deleteZone.mutate({
              headers: { ETag: eTag },
              path: { zone_id: id },
            });
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
      )}
    </>
  );
};

export default DeleteZone;
