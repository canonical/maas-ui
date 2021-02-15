import { useCallback, useEffect, useState } from "react";

import { Button, Col, Row, Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import MachineFormFields from "./MachineFormFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { MachineDetails } from "app/store/machine/types";
import { useCanEdit } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";

export type MachineFormValues = {
  architecture: MachineDetails["architecture"];
  description: MachineDetails["description"];
  minHweKernel: MachineDetails["min_hwe_kernel"];
  pool: MachineDetails["pool"]["name"];
  tags: MachineDetails["tags"];
  zone: MachineDetails["zone"]["name"];
};

type Props = { systemId: MachineDetails["system_id"] };

const MachineFormSchema = Yup.object().shape({
  architecture: Yup.string().required("Architecture is required"),
  description: Yup.string(),
  minHweKernel: Yup.string(),
  pool: Yup.string().required("Resource pool is required"),
  tags: Yup.array().of(Yup.string()),
  zone: Yup.string().required("Zone is required"),
});

const MachineForm = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const errors = useSelector(machineSelectors.errors);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const [editing, setEditing] = useState(false);
  const canEdit = useCanEdit(machine, true);
  const previousSaving = usePrevious(saving);

  // Close the form if saving was successfully completed.
  useEffect(() => {
    if (saved && !saving && previousSaving) {
      setEditing(false);
    }
  }, [previousSaving, saved, saving]);

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  if (machine && "min_hwe_kernel" in machine) {
    return (
      <>
        <Row>
          <Col small="4" medium="4" size="6">
            <h4>Machine configuration</h4>
          </Col>
          <Col small="4" medium="2" size="6" className="u-align--right">
            {canEdit && !editing && (
              <Button
                appearance="neutral"
                className="u-no-margin--bottom"
                data-test="edit-machine-config"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}
          </Col>
        </Row>
        <FormikForm
          buttons={FormCardButtons}
          cleanup={cleanup}
          editable={editing}
          errors={editing ? errors : undefined}
          initialValues={{
            architecture: machine.architecture || "",
            description: machine.description || "",
            minHweKernel: machine.min_hwe_kernel || "",
            pool: machine.pool?.name || "",
            tags: machine.tags || [],
            zone: machine.zone?.name || "",
          }}
          onSaveAnalytics={{
            action: "Configure machine",
            category: "Machine details",
            label: "Save changes",
          }}
          onCancel={() => setEditing(false)}
          onSubmit={(values: MachineFormValues) => {
            const params = {
              architecture: values.architecture,
              description: values.description,
              extra_macs: machine.extra_macs,
              pxe_mac: machine.pxe_mac,
              min_hwe_kernel: values.minHweKernel,
              pool: { name: values.pool },
              system_id: machine.system_id,
              tags: values.tags,
              zone: { name: values.zone },
            };
            dispatch(machineActions.update(params));
          }}
          resetOnSave
          saved={saved}
          saving={saving}
          submitLabel="Save changes"
          validationSchema={MachineFormSchema}
        >
          <MachineFormFields editing={editing} />
        </FormikForm>
      </>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineForm;
