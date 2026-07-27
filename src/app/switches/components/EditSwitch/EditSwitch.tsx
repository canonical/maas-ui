import type { ReactElement } from "react";

import {
  Notification as NotificationBanner,
  Select,
  Spinner,
} from "@canonical/react-components";
import * as Yup from "yup";

import { useAvailableSelections } from "@/app/api/query/images";
import { useGetSwitch, useUpdateSwitch } from "@/app/api/query/switches";
import type { SwitchUpdateRequest, UpdateSwitchError } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";

type EditSwitchProps = {
  id: number;
};

const EditSwitchSchema = Yup.object().shape({
  image: Yup.string().required("Image is required"),
});

const EditSwitch = ({ id }: EditSwitchProps): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const switchData = useGetSwitch({ path: { switch_id: id } });
  const eTag = switchData.data?.headers?.get("ETag");
  const updateSwitch = useUpdateSwitch();
  const availableImages = useAvailableSelections();

  const imageOptions = [
    { label: "Select image", value: "", disabled: true },
    ...(availableImages.data?.items ?? []).map((image) => ({
      label: image.title,
      value: `${image.os}/${image.release}`,
    })),
  ];

  return (
    <>
      {(switchData.isPending || availableImages.isPending) && (
        <Spinner text="Loading..." />
      )}
      {switchData.isError && (
        <NotificationBanner severity="negative">
          {switchData.error.message}
        </NotificationBanner>
      )}
      {switchData.isSuccess &&
        switchData.data &&
        !availableImages.isPending && (
          <FormikForm<SwitchUpdateRequest, UpdateSwitchError>
            aria-label="Edit switch"
            errors={updateSwitch.error}
            initialValues={{
              image: switchData.data.target_image ?? "",
            }}
            onCancel={closeSidePanel}
            onSubmit={(values) => {
              updateSwitch.mutate({
                headers: { ETag: eTag },
                body: { image: values.image },
                path: { switch_id: id },
              });
            }}
            onSuccess={() => {
              closeSidePanel();
            }}
            saved={updateSwitch.isSuccess}
            saving={updateSwitch.isPending}
            submitLabel="Save switch"
            validationSchema={EditSwitchSchema}
          >
            {/* TODO: Wire up name, mac_address, enable_ztp, ztp_script, dhcp_option_code, second_mac_address fields when the API supports them. */}
            <FormikField
              component={Select}
              label="* Image"
              name="image"
              options={imageOptions}
            />
          </FormikForm>
        )}
    </>
  );
};

export default EditSwitch;
