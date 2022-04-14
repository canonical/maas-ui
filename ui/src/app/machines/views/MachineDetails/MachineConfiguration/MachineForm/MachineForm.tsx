import { useCallback } from "react";

import { Spinner } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import MachineFormFields from "./MachineFormFields";

import Definition from "app/base/components/Definition";
import EditableSection from "app/base/components/EditableSection";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useCanEdit } from "app/base/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

export type MachineFormValues = {
  architecture: MachineDetails["architecture"];
  description: MachineDetails["description"];
  minHweKernel: MachineDetails["min_hwe_kernel"];
  pool: MachineDetails["pool"]["name"];
  zone: MachineDetails["zone"]["name"];
};

type Props = { systemId: MachineDetails["system_id"] };

const MachineFormSchema: SchemaOf<MachineFormValues> = Yup.object()
  .shape({
    architecture: Yup.string().required("Architecture is required"),
    description: Yup.string(),
    minHweKernel: Yup.string(),
    pool: Yup.string().required("Resource pool is required"),
    zone: Yup.string().required("Zone is required"),
  })
  .defined();

const MachineForm = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const errors = useSelector(machineSelectors.errors);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const canEdit = useCanEdit(machine, true);

  if (!isMachineDetails(machine)) {
    return <Spinner text="Loading..." />;
  }

  return (
    <EditableSection
      canEdit={canEdit}
      className="u-no-padding--top"
      hasSidebarTitle
      renderContent={(editing, setEditing) =>
        editing ? (
          <Formik
            initialValues={{
              architecture: machine.architecture || "",
              description: machine.description || "",
              minHweKernel: machine.min_hwe_kernel || "",
              pool: machine.pool?.name || "",
              zone: machine.zone?.name || "",
            }}
            onSubmit={(values) => {
              const params = {
                architecture: values.architecture,
                description: values.description,
                extra_macs: machine.extra_macs,
                pxe_mac: machine.pxe_mac,
                min_hwe_kernel: values.minHweKernel,
                pool: { name: values.pool },
                system_id: machine.system_id,
                zone: { name: values.zone },
              };
              dispatch(machineActions.update(params));
            }}
            validationSchema={MachineFormSchema}
          >
            <FormikFormContent<MachineFormValues>
              cleanup={cleanup}
              errors={errors}
              onSaveAnalytics={{
                action: "Configure machine",
                category: "Machine details",
                label: "Save changes",
              }}
              onCancel={() => setEditing(false)}
              onSuccess={() => setEditing(false)}
              saved={saved}
              saving={saving}
              submitLabel="Save changes"
            >
              <MachineFormFields />
            </FormikFormContent>
          </Formik>
        ) : (
          <div data-testid="machine-details">
            <Definition
              label="Architecture"
              description={machine.architecture}
            />
            <Definition
              label="Minimum kernel"
              description={machine.min_hwe_kernel}
            />
            <Definition label="Zone" description={machine.zone.name} />
            <Definition label="Resource pool" description={machine.pool.name} />
            <Definition label="Note" description={machine.description} />
          </div>
        )
      }
      title="Machine configuration"
    />
  );
};

export default MachineForm;
