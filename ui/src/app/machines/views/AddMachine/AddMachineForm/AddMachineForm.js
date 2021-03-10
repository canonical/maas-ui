import { Spinner } from "@canonical/react-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";

import AddMachineFormFields from "../AddMachineFormFields";
import { actions as machineActions } from "app/store/machine";
import { actions as generalActions } from "app/store/general";
import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import {
  architectures as architecturesSelectors,
  defaultMinHweKernel as defaultMinHweKernelSelectors,
  hweKernels as hweKernelsSelectors,
  powerTypes as powerTypesSelectors,
} from "app/store/general/selectors";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import machineSelectors from "app/store/machine/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

export const AddMachineForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const architectures = useSelector(architecturesSelectors.get);
  const architecturesLoaded = useSelector(architecturesSelectors.loaded);
  const defaultMinHweKernel = useSelector(defaultMinHweKernelSelectors.get);
  const defaultMinHweKernelLoaded = useSelector(
    defaultMinHweKernelSelectors.loaded
  );
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const hweKernelsLoaded = useSelector(hweKernelsSelectors.loaded);
  const machineSaved = useSelector(machineSelectors.saved);
  const machineSaving = useSelector(machineSelectors.saving);
  const machineErrors = useSelector(machineSelectors.errors);
  const powerTypes = useSelector(powerTypesSelectors.get);
  const powerTypesLoaded = useSelector(powerTypesSelectors.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const [powerType, setPowerType] = useState("");
  const [resetOnSave, setResetOnSave] = useState(false);
  const [savingMachine, setSavingMachine] = useState(false);

  // Fetch all data required for the form.
  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(generalActions.fetchArchitectures());
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchHweKernels());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  useEffect(() => {
    if (machineSaved && resetOnSave) {
      setResetOnSave(false);
    }
  }, [machineSaved, resetOnSave]);

  useWindowTitle("Add machine");

  useAddMessage(
    machineSaved,
    machineActions.cleanup,
    `${savingMachine} added successfully.`,
    () => setSavingMachine(false)
  );

  const initialPowerParameters = useInitialPowerParameters(powerTypes);
  const AddMachineSchema = Yup.object().shape({
    architecture: Yup.string().required("Architecture required"),
    domain: Yup.string().required("Domain required"),
    extra_macs: Yup.array().of(
      Yup.string().matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
    ),
    hostname: Yup.string(),
    min_hwe_kernel: Yup.string(),
    pool: Yup.string().required("Resource pool required"),
    power_parameters: Yup.object().shape(
      generatePowerParametersSchema(powerType)
    ),
    power_type: Yup.string().required("Power type required"),
    pxe_mac: Yup.string()
      .matches(MAC_ADDRESS_REGEX, "Invalid MAC address")
      .when("power_type", {
        is: (power_type) => power_type !== "ipmi",
        then: Yup.string().required("At least one MAC address required"),
      }),
    zone: Yup.string().required("Zone required"),
  });
  const allLoaded =
    architecturesLoaded &&
    defaultMinHweKernelLoaded &&
    domainsLoaded &&
    hweKernelsLoaded &&
    powerTypesLoaded &&
    resourcePoolsLoaded &&
    zonesLoaded;

  return (
    <>
      {!allLoaded ? (
        <Spinner text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add machine">
          <FormikForm
            buttons={FormCardButtons}
            buttonsHelpLabel="Help with adding machines"
            buttonsHelpLink="https://maas.io/docs/add-machines"
            cleanup={machineActions.cleanup}
            errors={machineErrors}
            initialValues={{
              architecture: (architectures.length && architectures[0]) || "",
              domain: (domains.length && domains[0].name) || "",
              extra_macs: [],
              hostname: "",
              min_hwe_kernel: defaultMinHweKernel || "",
              pool: (resourcePools.length && resourcePools[0].name) || "",
              power_parameters: initialPowerParameters,
              power_type: "",
              pxe_mac: "",
              zone: (zones.length && zones[0].name) || "",
            }}
            onCancel={() => history.push({ pathname: "/machines" })}
            onSaveAnalytics={{
              action: resetOnSave ? "Save and add another" : "Save",
              category: "Machine",
              label: "Add machine form",
            }}
            onSubmit={(values) => {
              const params = {
                architecture: values.architecture,
                domain: domains.find((domain) => domain.name === values.domain),
                extra_macs: values.extra_macs.filter(Boolean),
                hostname: values.hostname,
                min_hwe_kernel: values.min_hwe_kernel,
                pool: resourcePools.find((pool) => pool.name === values.pool),
                power_parameters: formatPowerParameters(
                  powerType,
                  values.power_parameters
                ),
                power_type: values.power_type,
                pxe_mac: values.pxe_mac,
                zone: zones.find((zone) => zone.name === values.zone),
              };
              dispatch(machineActions.create(params));
              setSavingMachine(values.hostname || "Machine");
            }}
            onValuesChanged={(values) => {
              const powerType = powerTypes.find(
                (type) => type.name === values.power_type
              );
              setPowerType(powerType);
            }}
            resetOnSave={resetOnSave}
            saving={machineSaving}
            saved={machineSaved}
            savedRedirect={resetOnSave ? undefined : "/machines"}
            secondarySubmit={() => setResetOnSave(true)}
            secondarySubmitLabel="Save and add another"
            submitLabel="Save machine"
            validationSchema={AddMachineSchema}
          >
            <AddMachineFormFields saved={machineSaved} />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddMachineForm;
