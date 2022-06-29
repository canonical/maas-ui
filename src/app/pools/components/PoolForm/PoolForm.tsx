import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom-v5-compat";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import urls from "app/base/urls";
import { actions as poolActions } from "app/store/resourcepool";
import poolSelectors from "app/store/resourcepool/selectors";
import type { ResourcePool } from "app/store/resourcepool/types";

type Props = {
  pool?: ResourcePool | null;
};

type PoolFormValues = {
  description: ResourcePool["description"];
  name: ResourcePool["name"];
};

const PoolSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  description: Yup.string(),
});

export const PoolForm = ({ pool }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = useSelector(poolSelectors.saved);
  const saving = useSelector(poolSelectors.saving);
  const errors = useSelector(poolSelectors.errors);
  const [savingPool, setSaving] = useState<ResourcePool["name"] | null>();

  useAddMessage(
    saved,
    poolActions.cleanup,
    `${savingPool} ${pool ? "updated" : "added"} successfully.`,
    () => setSaving(null)
  );

  let initialValues: PoolFormValues;
  let title: string;
  if (pool) {
    title = "Edit pool";
    initialValues = {
      name: pool.name,
      description: pool.description,
    };
  } else {
    title = "Add pool";
    initialValues = {
      name: "",
      description: "",
    };
  }

  useWindowTitle(title);

  return (
    <FormCard sidebar={false} title={title}>
      <FormikForm
        cleanup={poolActions.cleanup}
        errors={errors}
        initialValues={initialValues}
        onCancel={() => navigate({ pathname: urls.pools.index })}
        onSaveAnalytics={{
          action: "Saved",
          category: "Resource pool",
          label: "Add pool form",
        }}
        onSubmit={(values) => {
          dispatch(poolActions.cleanup());
          if (pool) {
            dispatch(
              poolActions.update({
                ...values,
                id: pool.id,
              })
            );
          } else {
            dispatch(poolActions.create(values));
          }
          setSaving(values.name);
        }}
        saved={saved}
        savedRedirect={urls.pools.index}
        saving={saving}
        submitLabel="Save pool"
        validationSchema={PoolSchema}
      >
        <FormikField label="Name (required)" name="name" type="text" />
        <FormikField label="Description" name="description" type="text" />
      </FormikForm>
    </FormCard>
  );
};

export default PoolForm;
