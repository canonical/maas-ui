import type { ReactElement } from "react";

import { Notification, Spinner, Textarea } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";

import { useGetZone, useUpdateZone } from "@/app/api/query/zones";
import type { UpdateZoneError, ZoneRequest } from "@/app/apiclient";
import { getZoneQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type EditZoneProps = {
  id: number;
  closeForm: () => void;
};

const EditZone = ({ id, closeForm }: EditZoneProps): ReactElement => {
  const queryClient = useQueryClient();
  const zone = useGetZone({ path: { zone_id: id } });

  const editZone = useUpdateZone();

  return (
    <>
      {zone.isPending && <Spinner text="Loading..." />}
      {zone.isError && (
        <Notification data-testid="no-such-pool-error" severity="negative">
          AZ with id {id} does not exist.
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
          onCancel={closeForm}
          onSubmit={(values) => {
            editZone.mutate({
              body: { name: values.name, description: values.description },
              path: { zone_id: id },
            });
          }}
          onSuccess={() => {
            queryClient
              .invalidateQueries({
                queryKey: getZoneQueryKey({
                  path: { zone_id: id },
                }),
              })
              .then(closeForm);
          }}
          saved={editZone.isSuccess}
          saving={editZone.isPending}
          submitLabel="Update AZ"
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
