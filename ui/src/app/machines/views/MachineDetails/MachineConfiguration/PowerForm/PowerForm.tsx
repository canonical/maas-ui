import { useCallback, useEffect, useState } from "react";

import { Button, Col, Row, Spinner } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import PowerFormFields from "./PowerFormFields";

import FormikForm from "app/base/components/FormikForm";
import { useCanEdit } from "app/base/hooks";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { PowerType } from "app/store/general/types";
import { PowerFieldScope } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, PowerParameters } from "app/store/machine/types";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

export type PowerFormValues = {
  powerType: Machine["power_type"];
  powerParameters: PowerParameters;
};

type Props = { systemId: Machine["system_id"] };

const PowerForm = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const errors = useSelector(machineSelectors.errors);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const [editing, setEditing] = useState(false);
  const canEdit = useCanEdit(machine, true);
  const previousSaving = usePrevious(saving);
  const [powerType, setPowerType] = useState<PowerType>();
  const setPowerTypeFromName = (name: string) => {
    const powerType = powerTypes.find((type) => type.name === name);
    setPowerType(powerType);
  };

  // Close the form if saving was successfully completed.
  useEffect(() => {
    if (saved && !saving && previousSaving) {
      setEditing(false);
    }
  }, [previousSaving, saved, saving]);

  const machineInPod = Boolean(machine?.pod);
  const fieldScopes = machineInPod
    ? [PowerFieldScope.NODE]
    : [PowerFieldScope.BMC, PowerFieldScope.NODE];
  const initialPowerParameters = useInitialPowerParameters(
    (isMachineDetails(machine) && machine.power_parameters) || {}
  );
  const powerParametersSchema = generatePowerParametersSchema(
    powerType,
    fieldScopes
  );
  const PowerFormSchema: SchemaOf<PowerFormValues> = Yup.object()
    .shape({
      powerParameters: Yup.object().shape(powerParametersSchema),
      powerType: Yup.string().required("Power type is required"),
    })
    .defined();

  if (isMachineDetails(machine) && powerTypesLoaded) {
    return (
      <>
        <Row>
          <Col small={4} medium={4} size={6}>
            <h4>Power configuration</h4>
          </Col>
          <Col small={4} medium={2} size={6} className="u-align--right">
            {canEdit && !editing && (
              <Button
                appearance="neutral"
                className="u-no-margin--bottom"
                data-testid="edit-power-config"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}
          </Col>
        </Row>
        <FormikForm<PowerFormValues>
          allowAllEmpty
          allowUnchanged
          cleanup={cleanup}
          editable={editing}
          // Only show machine errors if form is in editing state.
          errors={editing ? errors : null}
          initialValues={{
            powerType: powerType?.name || machine.power_type,
            powerParameters: initialPowerParameters,
          }}
          onSaveAnalytics={{
            action: "Configure power",
            category: "Machine details",
            label: "Save changes",
          }}
          onCancel={(_, { initialValues, resetForm }) => {
            setPowerTypeFromName(machine.power_type);
            resetForm({ values: initialValues });
            setEditing(false);
            dispatch(machineActions.cleanup());
          }}
          onSubmit={(values) => {
            const params = {
              extra_macs: machine.extra_macs,
              power_parameters: formatPowerParameters(
                powerType || null,
                values.powerParameters,
                fieldScopes
              ),
              power_type: values.powerType,
              pxe_mac: machine.pxe_mac,
              system_id: machine.system_id,
            };
            dispatch(machineActions.update(params));
          }}
          onValuesChanged={(values) => {
            setPowerTypeFromName(values.powerType);
          }}
          saved={saved}
          saving={saving}
          submitLabel="Save changes"
          validationSchema={PowerFormSchema}
        >
          <PowerFormFields editing={editing} machine={machine} />
        </FormikForm>
      </>
    );
  }
  return <Spinner text="Loading..." />;
};

export default PowerForm;
