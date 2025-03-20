import * as Yup from "yup";

import { useCreatePool, useUpdatePool } from "@/app/api/query/pools";
import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import urls from "@/app/base/urls";
import { resourcePoolActions } from "@/app/store/resourcepool";
import type { ResourcePool } from "@/app/store/resourcepool/types";

type Props = {
  pool?: ResourcePool | null;
  onClose?: () => void;
};

type PoolFormValues = {
  description: ResourcePool["description"];
  name: ResourcePool["name"];
};

export enum Labels {
  AddPoolTitle = "Add pool",
  EditPoolTitle = "Edit pool",
  SubmitLabel = "Save pool",
  PoolName = "Name (required)",
  PoolDescription = "Description",
}

const PoolSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  description: Yup.string(),
});

export const PoolForm = ({
  pool,
  onClose,
  ...props
}: Props): React.ReactElement => {
  const createPool = useCreatePool();
  const updatePool = useUpdatePool();

  let initialValues: PoolFormValues;
  let title: string;
  if (pool) {
    title = Labels.EditPoolTitle;
    initialValues = {
      name: pool.name,
      description: pool.description,
    };
  } else {
    title = Labels.AddPoolTitle;
    initialValues = {
      name: "",
      description: "",
    };
  }

  return (
    <FormikForm
      aria-label={title}
      cleanup={resourcePoolActions.cleanup}
      errors={updatePool.error || createPool.error}
      initialValues={initialValues}
      onCancel={onClose}
      onSaveAnalytics={{
        action: "Saved",
        category: "Resource pool",
        label: "Add pool form",
      }}
      onSubmit={(values) => {
        if (pool) {
          updatePool.mutate({
            body: {
              name: values.name,
              description: values.description,
            },
            path: { resource_pool_id: pool.id },
          });
        } else {
          createPool.mutate({
            body: {
              name: values.name,
              description: values.description,
            },
          });
        }
      }}
      saved={updatePool.isSuccess || createPool.isSuccess}
      savedRedirect={urls.pools.index}
      saving={updatePool.isPending || createPool.isPending}
      submitLabel={Labels.SubmitLabel}
      validationSchema={PoolSchema}
      {...props}
    >
      <FormikField label={Labels.PoolName} name="name" type="text" />
      <FormikField
        label={Labels.PoolDescription}
        name="description"
        type="text"
      />
    </FormikForm>
  );
};

export default PoolForm;
