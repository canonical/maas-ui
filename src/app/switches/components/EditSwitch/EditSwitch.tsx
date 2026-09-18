import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import {
  Notification as NotificationBanner,
  Select,
  Spinner,
} from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import { useSelections } from "@/app/api/query/images";
import { useGetSwitch, useUpdateSwitch } from "@/app/api/query/switches";
import type { SwitchUpdateRequest, UpdateSwitchError } from "@/app/apiclient";
import { getSwitchQueryKey } from "@/app/apiclient/@tanstack/react-query.gen";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { getSwitchErrorMessage } from "@/app/switches/utils";

type EditSwitchProps = {
  id: number;
};

const SwitchSchema = Yup.object().shape({
  name: Yup.string(),
  image: Yup.string(),
});

const EditSwitch = ({ id }: EditSwitchProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const queryClient = useQueryClient();
  const switchDetails = useGetSwitch({ path: { switch_id: id } });
  // TODO: Replace with an endpoint that only returns switch-compatible images when API is ready
  const availableImages = useSelections();

  const eTag = switchDetails.data?.headers?.get("ETag");
  const updateSwitch = useUpdateSwitch();

  const imageOptions = [
    { label: "Select an image", value: "", disabled: true },
    ...(availableImages.data?.items ?? []).map((image, index) => ({
      key: `${image.title}-${index}`,
      label: `${image.os}/${image.release} - ${image.title} (${image.architecture})`,
      value: `${image.os}/${image.release}/${image.architecture}`,
    })),
  ];

  return (
    <>
      {switchDetails.isPending && <Spinner text="Loading..." />}
      {switchDetails.isError && (
        <NotificationBanner severity="negative">
          {switchDetails.error.message}
        </NotificationBanner>
      )}
      {switchDetails.isSuccess && switchDetails.data && (
        <FormikForm<SwitchUpdateRequest, UpdateSwitchError>
          aria-label="Edit switch"
          errors={getSwitchErrorMessage(updateSwitch.error)}
          initialValues={{
            name: switchDetails.data.name ?? "",
            image: switchDetails.data.target_image ?? "",
          }}
          onCancel={closeSidePanel}
          onSubmit={(values) => {
            updateSwitch.mutate({
              headers: {
                ETag: eTag,
              },
              body: {
                name: values.name,
                image: values.image,
              },
              path: { switch_id: id },
            });
          }}
          onSuccess={() => {
            return queryClient
              .invalidateQueries({
                queryKey: getSwitchQueryKey({
                  path: { switch_id: id },
                }),
              })
              .then(closeSidePanel);
          }}
          saved={updateSwitch.isSuccess}
          saving={updateSwitch.isPending}
          submitLabel="Save switch"
          validationSchema={SwitchSchema}
        >
          <FormikField label="Name" name="name" type="text" />
          <FormikField
            component={Select}
            label="Image"
            name="image"
            options={imageOptions}
          />
        </FormikForm>
      )}
    </>
  );
};

export default EditSwitch;
