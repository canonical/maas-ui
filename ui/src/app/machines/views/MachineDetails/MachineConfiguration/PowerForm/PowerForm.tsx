import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Col,
  Row,
  Spinner,
  usePrevious,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import PowerFormFields from "./PowerFormFields";

import FormikForm from "app/base/components/FormikForm";
import { useCanEdit } from "app/base/hooks";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { PowerType } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  getPowerTypeFromName,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import {
  getMachineFieldScopes,
  isMachineDetails,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import type { PowerParameters as PowerParametersType } from "app/store/types/node";

export type PowerFormValues = {
  powerType: Machine["power_type"];
  powerParameters: PowerParametersType;
};

export enum Labels {
  Edit = "Edit",
}

type Props = { systemId: Machine["system_id"] };

const PowerForm = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const errors = useSelector(machineSelectors.errors);
  const saved = useSelector(machineSelectors.saved);
  const saving = useSelector(machineSelectors.saving);
  const previousSaving = usePrevious(saving);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const powerTypesLoading = useSelector(powerTypesSelectors.loading);
  const cleanup = useCallback(() => machineActions.cleanup(), []);
  const [editing, setEditing] = useState(false);
  const canEdit = useCanEdit(machine, true);
  const [selectedPowerType, setSelectedPowerType] = useState<PowerType | null>(
    null
  );
  const isDetails = isMachineDetails(machine);
  const initialPowerParameters = useInitialPowerParameters(
    (isDetails && machine.power_parameters) || {}
  );

  // Close the form if saving was successfully completed.
  useEffect(() => {
    if (saved && !saving && previousSaving) {
      setEditing(false);
    }
  }, [previousSaving, saved, saving]);

  useEffect(() => {
    // We set the selected power type outside the scope of the form as its used
    // to generate the form's validation schema.
    if (machine?.power_type) {
      const powerType = getPowerTypeFromName(powerTypes, machine.power_type);
      setSelectedPowerType(powerType);
    }
  }, [machine?.power_type, powerTypes]);

  if (!isDetails || powerTypesLoading) {
    return <Spinner text="Loading..." />;
  }

  const fieldScopes = getMachineFieldScopes(machine);
  const powerParametersSchema = generatePowerParametersSchema(
    selectedPowerType,
    fieldScopes
  );
  const PowerFormSchema: SchemaOf<PowerFormValues> = Yup.object()
    .shape({
      powerParameters: Yup.object().shape(powerParametersSchema),
      powerType: Yup.string().required("Power type is required"),
    })
    .defined();

  return (
    <Row>
      <Col size={3}>
        <div className="u-flex--between u-flex--wrap">
          <h4>Power configuration</h4>
          {canEdit && !editing && (
            <Button
              className="u-no-margin--bottom u-hide--large"
              onClick={() => setEditing(true)}
            >
              {Labels.Edit}
            </Button>
          )}
        </div>
      </Col>
      <Col size={editing ? 9 : 6}>
        <FormikForm<PowerFormValues>
          allowAllEmpty
          allowUnchanged
          cleanup={cleanup}
          editable={editing}
          // Only show machine errors if form is in editing state.
          errors={editing ? errors : null}
          initialValues={{
            powerType: machine.power_type,
            powerParameters: initialPowerParameters,
          }}
          onSaveAnalytics={{
            action: "Configure power",
            category: "Machine details",
            label: "Save changes",
          }}
          onCancel={(_, { initialValues, resetForm }) => {
            const powerType = getPowerTypeFromName(
              powerTypes,
              machine.power_type
            );
            setSelectedPowerType(powerType);
            resetForm({ values: initialValues });
            setEditing(false);
            dispatch(machineActions.cleanup());
          }}
          onSubmit={(values) => {
            const params = {
              extra_macs: machine.extra_macs,
              power_parameters: formatPowerParameters(
                selectedPowerType,
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
            const powerType = getPowerTypeFromName(
              powerTypes,
              values.powerType
            );
            setSelectedPowerType(powerType);
          }}
          saved={saved}
          saving={saving}
          submitLabel="Save changes"
          validationSchema={PowerFormSchema}
        >
          <PowerFormFields editing={editing} machine={machine} />
        </FormikForm>
      </Col>
      {canEdit && !editing && (
        <Col className="u-align--right" size={3}>
          <Button
            className="u-no-margin--bottom u-hide--small u-hide--medium"
            onClick={() => setEditing(true)}
          >
            {Labels.Edit}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default PowerForm;
