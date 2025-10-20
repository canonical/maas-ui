import type { ReactElement } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import { useGetRack, useUpdateRack } from "@/app/api/query/racks";
import type { RackRequest, UpdateRackError } from "@/app/apiclient";
import { listRacksQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context-new";

type EditRackProps = {
  id: number;
};

const RackSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
});

const EditRack = ({ id }: EditRackProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const rack = useGetRack({ path: { rack_id: id } });

  const editRack = useUpdateRack();

  return (
    <>
      {rack.isPending && <Spinner text="Loading..." />}
      {rack.isError && (
        <Notification data-testid="no-such-rack-error" severity="negative">
          {rack.error.message}
        </Notification>
      )}
      {rack.isSuccess && rack.data && (
        <FormikForm<RackRequest, UpdateRackError>
          aria-label="Edit rack"
          errors={editRack.error}
          initialValues={{
            name: rack.data.name,
          }}
          onCancel={closeSidePanel}
          onSubmit={(values) => {
            editRack.mutate({
              body: {
                name: values.name,
              },
              path: { rack_id: id },
            });
          }}
          onSuccess={() => {
            return queryClient
              .invalidateQueries({
                queryKey: listRacksQueryKey({}),
              })
              .then(closeSidePanel);
          }}
          saved={editRack.isSuccess}
          saving={editRack.isPending}
          submitLabel="Save rack"
          validationSchema={RackSchema}
        >
          <FormikField label="* Name" name="name" type="text" />
        </FormikForm>
      )}
    </>
  );
};

export default EditRack;
