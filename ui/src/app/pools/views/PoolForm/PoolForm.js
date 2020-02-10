import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React, { useState } from "react";

import { resourcepool as poolActions } from "app/base/actions";
import { resourcepool as poolSelectors } from "app/base/selectors";
import { useAddMessage } from "app/base/hooks";
import { useWindowTitle } from "app/base/hooks";
import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import FormikField from "app/base/components/FormikField";
import FormCardButtons from "app/base/components/FormCardButtons";

const PoolSchema = Yup.object().shape({
  name: Yup.string().required("name is required"),
  description: Yup.string()
});

export const PoolForm = () => {
  const dispatch = useDispatch();
  const saved = useSelector(poolSelectors.saved);
  const saving = useSelector(poolSelectors.saving);
  const errors = useSelector(poolSelectors.errors);
  const [savingPool, setSaving] = useState();

  const title = "Add pool";

  useWindowTitle(title);

  useAddMessage(
    saved,
    poolActions.cleanup,
    `${savingPool} added successfully.`,
    setSaving
  );

  return (
    <FormCard sidebar={false} title={title}>
      <FormikForm
        buttons={FormCardButtons}
        errors={errors}
        cleanup={poolActions.cleanup}
        initialValues={{ name: "", description: "" }}
        submitLabel="Save pool"
        onSaveAnalytics={{
          action: "Saved",
          category: "Resource pool",
          label: "Add pool form"
        }}
        onSubmit={values => {
          dispatch(poolActions.create(values));
          setSaving(values.name);
        }}
        saving={saving}
        saved={saved}
        savedRedirect="/pools"
        validationSchema={PoolSchema}
      >
        <FormikField type="text" name="name" label="Name (required)" />
        <FormikField type="text" name="description" label="Description" />
      </FormikForm>
    </FormCard>
  );
};

export default PoolForm;
