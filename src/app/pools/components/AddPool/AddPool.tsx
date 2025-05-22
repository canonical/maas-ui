import type { ReactElement } from "react";

import * as Yup from "yup";

import { useCreatePool } from "@/app/api/query/pools";
import type {
  CreateResourcePoolError,
  ResourcePoolRequest,
} from "@/app/apiclient";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";

type AddPoolProps = {
  closeForm: () => void;
};

const PoolSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  description: Yup.string(),
});

const AddPool = ({ closeForm }: AddPoolProps): ReactElement => {
  const createPool = useCreatePool();

  return (
    <FormikForm<ResourcePoolRequest, CreateResourcePoolError>
      aria-label="Add pool"
      errors={createPool.error}
      initialValues={{
        description: "",
        name: "",
      }}
      onCancel={closeForm}
      onSubmit={(values) => {
        createPool.mutate({
          body: {
            name: values.name,
            description: values.description,
          },
        });
      }}
      onSuccess={closeForm}
      resetOnSave={true}
      saved={createPool.isSuccess}
      saving={createPool.isPending}
      submitLabel="Save pool"
      validationSchema={PoolSchema}
    >
      <FormikField label="Name (required)" name="name" type="text" />
      <FormikField label="Description" name="description" type="text" />
    </FormikForm>
  );
};

export default AddPool;
