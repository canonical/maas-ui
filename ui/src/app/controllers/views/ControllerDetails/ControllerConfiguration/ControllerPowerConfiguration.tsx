import { useCallback, useEffect, useState } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import type { SchemaOf } from "yup";
import * as Yup from "yup";

import EditableSection from "app/base/components/EditableSection";
import FormikForm from "app/base/components/FormikForm";
import PowerTypeFields from "app/base/components/PowerTypeFields";
import NodePowerParameters from "app/base/components/node/NodePowerParameters";
import { useCanEdit, useWindowTitle } from "app/base/hooks";
import authSelectors from "app/store/auth/selectors";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import type {
  Controller,
  ControllerDetails,
  ControllerMeta,
} from "app/store/controller/types";
import { isControllerDetails } from "app/store/controller/utils";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { PowerType } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  getPowerTypeFromName,
  useInitialPowerParameters,
} from "app/store/general/utils";
import type { RootState } from "app/store/root/types";
import type { PowerParameters } from "app/store/types/node";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

export type PowerFormValues = {
  powerType: ControllerDetails["power_type"];
  powerParameters: PowerParameters;
};

export enum Label {
  Title = "Power configuration",
}

const ControllerPowerConfiguration = ({ systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  ) as ControllerDetails;
  useWindowTitle(`${`${controller?.hostname}` || "Controller"} configuration`);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const [selectedPowerType, setSelectedPowerType] = useState<PowerType | null>(
    null
  );
  const errors = useSelector(controllerSelectors.errors);
  const saved = useSelector(controllerSelectors.saved);
  const saving = useSelector(controllerSelectors.saving);
  const powerTypesLoading = useSelector(powerTypesSelectors.loading);
  const cleanup = useCallback(() => controllerActions.cleanup(), []);
  const canEdit = useCanEdit(controller);
  const isDetails = isControllerDetails(controller);
  const initialPowerParameters = useInitialPowerParameters(
    (isDetails && controller.power_parameters) || {}
  );
  const isAdmin = useSelector(authSelectors.isAdmin);

  const powerParametersSchema =
    generatePowerParametersSchema(selectedPowerType);

  const PowerFormSchema: SchemaOf<PowerFormValues> = Yup.object()
    .shape({
      powerParameters: Yup.object().shape(powerParametersSchema),
      powerType: Yup.string().required("Power type is required"),
    })
    .defined();

  useEffect(() => {
    // We set the selected power type outside the scope of the form as its used
    // to generate the form's validation schema.
    if (controller?.power_type) {
      const powerType = getPowerTypeFromName(powerTypes, controller.power_type);
      setSelectedPowerType(powerType);
    }
  }, [controller?.power_type, powerTypes]);

  if (!isDetails || powerTypesLoading) {
    return <Spinner text="Loading..." />;
  }

  return (
    <EditableSection
      canEdit={canEdit}
      hasSidebarTitle
      renderContent={(editing, setEditing) =>
        editing ? (
          <FormikForm
            aria-label={Label.Title}
            allowAllEmpty
            allowUnchanged
            cleanup={cleanup}
            editable={editing}
            errors={errors}
            initialValues={{
              powerType: controller.power_type,
              powerParameters: initialPowerParameters,
            }}
            onSaveAnalytics={{
              action: "Configure power",
              category: "Controller details",
              label: "Save changes",
            }}
            onCancel={() => setEditing(false)}
            onSubmit={(values) => {
              const params = {
                power_parameters: formatPowerParameters(
                  selectedPowerType,
                  values.powerParameters
                ),
                power_type: values.powerType,
                system_id: controller.system_id,
              };
              dispatch(controllerActions.update(params));
            }}
            onSuccess={() => setEditing(false)}
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
            {controller.power_bmc_node_count > 1 ? (
              <Notification severity="information">
                This power controller manages{" "}
                {controller?.power_bmc_node_count - 1}
                other {controller.power_bmc_node_count > 3 ? "nodes" : "node"}
                .Changing the IP address or outlet delay will affect all these
                nodes.
              </Notification>
            ) : null}
            <PowerTypeFields
              disableSelect={!isAdmin}
              powerParametersValueName="powerParameters"
              powerTypeValueName="powerType"
            />
          </FormikForm>
        ) : (
          <div data-testid="non-editable-controller-power-details">
            <NodePowerParameters node={controller} />
          </div>
        )
      }
      title={Label.Title}
    />
  );
};

export default ControllerPowerConfiguration;
