import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
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

  const kernelParams = useSelector(configSelectors.kernelParams);

  return (
    <Formik
      initialValues={{
        kernel_opts: kernelParams || "",
      }}
      onSubmit={(values) => {
        dispatch(updateConfig(values));
      }}
      validationSchema={KernelParametersSchema}
    >
      <FormikFormContent<KernelParametersValues>
        buttonsAlign="left"
        buttonsBordered={false}
        onSaveAnalytics={{
          action: "Saved",
          category: "Configuration settings",
          label: "Kernel parameters form",
        }}
        resetOnSave
        saving={saving}
        saved={saved}
      >
        <FormikField
          label="Global boot parameters always passed to the kernel"
          type="text"
          name="kernel_opts"
        />
      </FormikFormContent>
    </Formik>
  );
};

export default KernelParametersForm;
