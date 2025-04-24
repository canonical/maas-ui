import { useCallback } from "react";

import { Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import BootArchitecturesTable from "./BootArchitecturesTable";

import FormikForm from "@/app/base/components/FormikForm";
import { useFetchActions } from "@/app/base/hooks";
import { generalActions } from "@/app/store/general";
import { knownBootArchitectures as knownBootArchitecturesSelectors } from "@/app/store/general/selectors";
import type { RootState } from "@/app/store/root/types";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet } from "@/app/store/subnet/types";
import type { SubnetActionProps } from "@/app/subnets/views/SubnetDetails/types";

export type FormValues = {
  disabled_boot_architectures: Subnet["disabled_boot_architectures"];
};

const Schema = Yup.object().shape({
  disabled_boot_architectures: Yup.array().of(Yup.string()),
});

export const EditBootArchitectures = ({
  subnetId,
  setSidePanelContent,
}: Omit<SubnetActionProps, "activeForm">): React.ReactElement | null => {
  const dispatch = useDispatch();
  const architecturesLoading = useSelector(
    knownBootArchitecturesSelectors.loading
  );
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, subnetId)
  );
  const errors = useSelector(subnetSelectors.errors);
  const saved = useSelector(subnetSelectors.saved);
  const saving = useSelector(subnetSelectors.saving);
  const cleanup = useCallback(() => subnetActions.cleanup(), []);

  useFetchActions([generalActions.fetchKnownBootArchitectures]);

  if (!subnet || architecturesLoading) {
    return (
      <Strip data-testid="loading-data" shallow>
        <Spinner text="Loading..." />
      </Strip>
    );
  }

  const closeForm = () => {
    setSidePanelContent(null);
  };
  return (
    <FormikForm<FormValues>
      cleanup={cleanup}
      errors={errors}
      initialValues={{
        disabled_boot_architectures: subnet.disabled_boot_architectures,
      }}
      onCancel={closeForm}
      onSaveAnalytics={{
        action: "Edit boot architectures",
        category: "Subnet details",
        label: "Edit boot architectures",
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
      onSuccess={closeForm}
      saved={saved}
      saving={saving}
      submitLabel="Save"
      validationSchema={Schema}
    >
      <BootArchitecturesTable />
    </FormikForm>
  );
};

export default EditBootArchitectures;
