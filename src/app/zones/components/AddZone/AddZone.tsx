import type { ReactElement } from "react";

import { Textarea } from "@canonical/react-components";
import * as Yup from "yup";

import { useCreateZone } from "@/app/api/query/zones";
import type { CreateZoneError, ZoneRequest } from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type AddZoneProps = {
  closeForm: () => void;
};

const ZoneSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  description: Yup.string(),
});

const AddZone = ({ closeForm }: AddZoneProps): ReactElement => {
  const createZone = useCreateZone();

  return (
    <FormikForm<ZoneRequest, CreateZoneError>
      aria-label="Add AZ"
      errors={createZone.error}
      initialValues={{
        description: "",
        name: "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        createZone.mutate({
          body: { name: values.name, description: values.description },
        });
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={createZone.isSuccess}
      saving={createZone.isPending}
      submitLabel="Save AZ"
      validationSchema={ZoneSchema}
    >
      <FormikField
        label="Name"
        name="name"
        placeholder="Name"
        required
        type="text"
      />
      <FormikField
        component={Textarea}
        label="Description"
        name="description"
      />
    </FormikForm>
  );
};

export default AddZone;
