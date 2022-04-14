import { useCallback, useEffect } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import BootArchitecturesTable from "./BootArchitecturesTable";

import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as generalActions } from "app/store/general";
import { knownBootArchitectures as knownBootArchitecturesSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";

export type FormValues = {
  disabled_boot_architectures: Subnet["disabled_boot_architectures"];
};

const Schema = Yup.object().shape({
  disabled_boot_architectures: Yup.array().of(Yup.string()),
});

export const EditBootArchitectures = ({
  id,
  setActiveForm,
}: Omit<SubnetActionProps, "activeForm">): JSX.Element | null => {
  const dispatch = useDispatch();
  const architecturesLoading = useSelector(
    knownBootArchitecturesSelectors.loading
  );
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const errors = useSelector(subnetSelectors.errors);
  const saved = useSelector(subnetSelectors.saved);
  const saving = useSelector(subnetSelectors.saving);
  const cleanup = useCallback(() => subnetActions.cleanup(), []);

  useEffect(() => {
    dispatch(generalActions.fetchKnownBootArchitectures());
  }, [dispatch]);

  if (!subnet || architecturesLoading) {
    return (
      <Strip data-testid="loading-data" shallow>
        <Spinner text="Loading..." />
      </Strip>
    );
  }

  const closeForm = () => setActiveForm(null);
  return (
    <Formik
      initialValues={{
        disabled_boot_architectures: subnet.disabled_boot_architectures,
      }}
      onSubmit={(values) => {
        dispatch(cleanup());
        dispatch(
          subnetActions.update({
            disabled_boot_architectures:
              values.disabled_boot_architectures.join(", "),
            id: subnet.id,
          })
        );
      }}
      validationSchema={Schema}
    >
      <FormikFormContent<FormValues>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        onSaveAnalytics={{
          action: "Edit boot architectures",
          category: "Subnet details",
          label: "Edit boot architectures",
        }}
        onSuccess={closeForm}
        saved={saved}
        saving={saving}
        submitLabel="Save"
      >
        <BootArchitecturesTable />
      </FormikFormContent>
    </Formik>
  );
};

export default EditBootArchitectures;
