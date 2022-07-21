import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

const ThirdPartyDriversSchema = Yup.object().shape({
  enable_third_party_drivers: Yup.boolean(),
});

export enum Labels {
  FormLabel = "Third-party drivers form",
}

const ThirdPartyDriversForm = (): JSX.Element => {
  const dispatch = useDispatch();
  const updateConfig = configActions.update;

  const saved = useSelector(configSelectors.saved);
  const saving = useSelector(configSelectors.saving);

  const thirdPartyDriversEnabled = useSelector(
    configSelectors.thirdPartyDriversEnabled
  );

  return (
    <FormikForm
      aria-label={Labels.FormLabel}
      buttonsAlign="left"
      buttonsBordered={false}
      initialValues={{
        enable_third_party_drivers: thirdPartyDriversEnabled,
      }}
      onSaveAnalytics={{
        action: "Saved",
        category: "Images settings",
        label: "Ubuntu form",
      }}
      onSubmit={(values, { resetForm }) => {
        dispatch(updateConfig(values));
        resetForm({ values });
      }}
      saved={saved}
      saving={saving}
      validationSchema={ThirdPartyDriversSchema}
    >
      <FormikField
        label="Enable the installation of proprietary drivers (i.e. HPVSA)"
        name="enable_third_party_drivers"
        type="checkbox"
      />
    </FormikForm>
  );
};

export default ThirdPartyDriversForm;
