import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

type KernelParametersValues = {
  kernel_opts: string;
};

export enum Labels {
  FormLabel = "Configuration - Kernel parameters",
  GlobalBootParams = "Global boot parameters always passed to the kernel",
}

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

  const kernelParams = useSelector(configSelectors.kernelParams);

  return (
    <FormikForm<KernelParametersValues>
      aria-label={Labels.FormLabel}
      buttonsAlign="left"
      buttonsBordered={false}
      initialValues={{
        kernel_opts: kernelParams || "",
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Configuration settings",
        label: "Kernel parameters form",
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      saved={saved}
      saving={saving}
      validationSchema={KernelParametersSchema}
    >
      <FormikField
        label={Labels.GlobalBootParams}
        name="kernel_opts"
        type="text"
      />
    </FormikForm>
  );
};

export default KernelParametersForm;
