import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { Select } from "@canonical/react-components";
import * as Yup from "yup";

import { useSelections } from "@/app/api/query/images";
import { useCreateSwitch } from "@/app/api/query/switches";
import type { CreateSwitchError, SwitchRequest } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { MAC_ADDRESS_REGEX } from "@/app/base/validation";
import { getOsDisplayName } from "@/app/images/utils";
import { getSwitchErrorMessage } from "@/app/switches/utils";

const SwitchSchema = Yup.object().shape({
  mac_address: Yup.string()
    .required("MAC address is required")
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address"),
  name: Yup.string(),
  image: Yup.string(),
});

const AddSwitch = (): ReactElement => {
  const { closeSidePanel } = useSidePanel();
  const createSwitch = useCreateSwitch();
  // TODO: Replace with an endpoint that only returns switch-compatible images when API is ready
  const availableImages = useSelections();

  const imageOptions = [
    { label: "Select an image", value: "", disabled: true },
    ...(availableImages.data?.items ?? []).map((image, index) => ({
      key: `${image.title}-${index}`,
      label: `${getOsDisplayName(image.os)}/${image.release} - ${image.title} (${image.architecture})`,
      value: `${image.os}/${image.release}/${image.architecture}`,
    })),
  ];

  return (
    <FormikForm<SwitchRequest, CreateSwitchError>
      aria-label="Add switch"
      errors={getSwitchErrorMessage(createSwitch.error)}
      initialValues={{
        mac_address: "",
        name: "",
        image: "",
      }}
      onCancel={closeSidePanel}
      onSubmit={(values) => {
        createSwitch.mutate({
          body: {
            mac_address: values.mac_address,
            name: values.name,
            image: values.image,
          },
        });
      }}
      onSuccess={closeSidePanel}
      resetOnSave={true}
      saved={createSwitch.isSuccess}
      saving={createSwitch.isPending}
      submitLabel="Save switch"
      validationSchema={SwitchSchema}
    >
      <FormikField label="Name" name="name" type="text" />
      <FormikField
        label="MAC address"
        name="mac_address"
        required
        type="text"
      />
      <FormikField
        component={Select}
        label="Image"
        name="image"
        options={imageOptions}
      />
    </FormikForm>
  );
};

export default AddSwitch;
