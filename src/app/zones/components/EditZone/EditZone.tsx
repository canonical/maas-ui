import type { ReactElement } from "react";

import { Notification, Spinner, Textarea } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";

import { useGetZone, useUpdateZone } from "@/app/api/query/zones";
import type { UpdateZoneError, ZoneRequest } from "@/app/apiclient";
import { getZoneQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type EditZoneProps = {
  id: number;
};

const EditZone = ({ id }: EditZoneProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const zone = useGetZone({ path: { zone_id: id } });

  const editZone = useUpdateZone();

  return (
    <>
      {zone.isPending && <Spinner text="Loading..." />}
      {zone.isError && (
        <Notification data-testid="no-such-zone-error" severity="negative">
          {zone.error.message}
        </Notification>
      )}
      {zone.isSuccess && zone.data && (
        <FormikForm<ZoneRequest, UpdateZoneError>
          aria-label="Edit AZ"
          errors={editZone.error}
          initialValues={{
            description: zone.data.description,
            name: zone.data.name,
          }}
          onCancel={closeSidePanel}
          onSubmit={(values) => {
            editZone.mutate({
              body: { name: values.name, description: values.description },
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
          saved={editZone.isSuccess}
          saving={editZone.isPending}
          submitLabel="Save AZ"
        >
          <FormikField
            label="Name"
            name="name"
            placeholder="Name"
            type="text"
          />
          <FormikField
            component={Textarea}
            label="Description"
            name="description"
          />
        </FormikForm>
      )}
    </>
  );
};

export default EditZone;
