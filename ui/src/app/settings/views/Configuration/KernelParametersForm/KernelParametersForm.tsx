import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

type KernelParametersValues = {
  kernel_opts: string;
};

const KernelParametersSchema = Yup.object()
  .shape({
    kernel_opts: Yup.string(),
  })
  .defined();

const KernelParametersForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const kernelParams = useSelector(configSelectors.kernelParams) as string;

  return (
    <FormikForm<KernelParametersValues>
      initialValues={{
        kernel_opts: kernelParams,
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "Kernel parameters form",
      }}
      onSubmit={(values) => {
        dispatch(updateConfig(values));
      }}
      resetOnSave
      saving={saving}
      saved={saved}
      validationSchema={KernelParametersSchema}
    >
      <FormikField
        label="Global boot parameters always passed to the kernel"
        type="text"
        name="kernel_opts"
      />
    </FormikForm>
  );
};

export default KernelParametersForm;
