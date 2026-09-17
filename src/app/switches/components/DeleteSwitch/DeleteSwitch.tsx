import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";

import { useDeleteSwitch, useGetSwitch } from "@/app/api/query/switches";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { getSwitchErrorMessage } from "@/app/switches/utils";

type DeleteSwitchProps = {
  id: number;
};

const DeleteSwitch = ({ id }: DeleteSwitchProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const switchDetails = useGetSwitch({ path: { switch_id: id } });

  const eTag = switchDetails.data?.headers?.get("ETag");
  const deleteSwitch = useDeleteSwitch();

  return (
    <>
      {switchDetails.isPending && <Spinner text="Loading..." />}
      {switchDetails.isError && (
        <NotificationBanner severity="negative">
          {switchDetails.error.message}
        </NotificationBanner>
      )}
      {switchDetails.isSuccess && switchDetails.data && (
        <ModelActionForm
          aria-label="Confirm switch deletion"
          errors={getSwitchErrorMessage(deleteSwitch.error)}
          initialValues={{}}
          modelType="switch"
          onCancel={closeSidePanel}
          onSubmit={() => {
            deleteSwitch.mutate({
              headers: { ETag: eTag },
              path: { switch_id: id },
            });
          }}
          onSuccess={closeSidePanel}
          saved={deleteSwitch.isSuccess}
          saving={deleteSwitch.isPending}
        />
      )}
    </>
  );
};

export default DeleteSwitch;
