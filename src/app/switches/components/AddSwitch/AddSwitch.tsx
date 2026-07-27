import { Select, Spinner } from "@canonical/react-components";
import * as Yup from "yup";

import { useAvailableSelections } from "@/app/api/query/images";
import { useCreateSwitch } from "@/app/api/query/switches";
import type { CreateSwitchError, SwitchRequest } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { MAC_ADDRESS_REGEX } from "@/app/base/validation";

const AddSwitchSchema = Yup.object().shape({
  mac_address: Yup.string()
    .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    .required("MAC address is required"),
  image: Yup.string().required("Image is required"),
});

const AddSwitch = () => {
  const { closeSidePanel } = useSidePanel();
  const createSwitch = useCreateSwitch();
  const availableImages = useAvailableSelections();

  const imageOptions = [
    { label: "Select image", value: "", disabled: true },
    ...(availableImages.data?.items ?? []).map((image) => ({
      label: image.title,
      value: `${image.os}/${image.release}`,
    })),
  ];

  if (availableImages.isPending) {
    return <Spinner text="Loading..." />;
  }

  return (
    <FormikForm<SwitchRequest, CreateSwitchError>
      aria-label="Add switch"
      errors={createSwitch.error}
      initialValues={{
        mac_address: "",
        image: "",
      }}
      onCancel={closeSidePanel}
      onSubmit={(values) => {
        createSwitch.mutate({
          body: {
            mac_address: values.mac_address,
            image: values.image,
          },
        });
      }}
      onSuccess={() => {
        closeSidePanel();
      }}
      resetOnSave
      saved={createSwitch.isSuccess}
      saving={createSwitch.isPending}
      submitLabel="Save switch"
      validationSchema={AddSwitchSchema}
    >
      <FormikField
        label="* MAC address"
        name="mac_address"
        placeholder="aa:bb:cc:dd:ee:ff"
        type="text"
      />
      <FormikField
        component={Select}
        label="* Image"
        name="image"
        options={imageOptions}
      />
      {/* TODO: Implement Enable ZTP, ZTP script, DHCP option code and second MAC address fields when the API supports them. */}
    </FormikForm>
  );
};

export default AddSwitch;
