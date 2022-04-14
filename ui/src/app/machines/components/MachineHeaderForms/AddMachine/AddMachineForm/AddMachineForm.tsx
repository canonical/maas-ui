import { useEffect, useState } from "react";

import { Link, Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddMachineFormFields from "../AddMachineFormFields";
import type { AddMachineValues } from "../types";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useAddMessage } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
import { MAC_ADDRESS_REGEX } from "app/base/validation";
import { actions as domainActions } from "app/store/domain";
import domainSelectors from "app/store/domain/selectors";
import { actions as generalActions } from "app/store/general";
import { PowerTypeNames } from "app/store/general/constants";
import {
  architectures as architecturesSelectors,
  defaultMinHweKernel as defaultMinHweKernelSelectors,
  hweKernels as hweKernelsSelectors,
  powerTypes as powerTypesSelectors,
} from "app/store/general/selectors";
import type { PowerType } from "app/store/general/types";
import {
  formatPowerParameters,
  generatePowerParametersSchema,
  useInitialPowerParameters,
} from "app/store/general/utils";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { actions as resourcePoolActions } from "app/store/resourcepool";
import resourcePoolSelectors from "app/store/resourcepool/selectors";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

export const AddMachineForm = ({ clearHeaderContent }: Props): JSX.Element => {
  const dispatch = useDispatch();
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

  const [powerType, setPowerType] = useState<PowerType | null>(null);
  const [secondarySubmit, setSecondarySubmit] = useState(false);
  const [savingMachine, setSavingMachine] = useState<string | null>(null);

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

  useAddMessage(
    machineSaved,
    machineActions.cleanup,
    `${savingMachine} added successfully.`,
    () => setSavingMachine(null)
  );

  const initialPowerParameters = useInitialPowerParameters();
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
        is: (power_type: PowerType["name"]) =>
          power_type !== PowerTypeNames.IPMI,
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
        <Strip data-testid="loading" shallow>
          <Spinner text="Loading" />
        </Strip>
      ) : (
        <Formik
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
          onSubmit={(values) => {
            const params = {
              architecture: values.architecture,
              domain: { name: values.domain },
              extra_macs: values.extra_macs.filter(Boolean),
              hostname: values.hostname,
              min_hwe_kernel: values.min_hwe_kernel,
              pool: { name: values.pool },
              power_parameters: formatPowerParameters(
                powerType,
                values.power_parameters
              ),
              power_type: values.power_type as PowerType["name"],
              pxe_mac: values.pxe_mac,
              zone: { name: values.zone },
            };
            dispatch(machineActions.create(params));
            setSavingMachine(values.hostname || "Machine");
          }}
          validationSchema={AddMachineSchema}
        >
          <FormikFormContent<AddMachineValues>
            buttonsHelp={
              <p>
                <Link
                  href="https://maas.io/docs/add-machines"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Help with adding machines
                </Link>
              </p>
            }
            cleanup={machineActions.cleanup}
            errors={machineErrors}
            onCancel={clearHeaderContent}
            onSaveAnalytics={{
              action: secondarySubmit ? "Save and add another" : "Save",
              category: "Machine",
              label: "Add machine form",
            }}
            onSuccess={() => {
              if (!secondarySubmit) {
                clearHeaderContent();
              }
              setSecondarySubmit(false);
            }}
            onValuesChanged={(values) => {
              const powerType = powerTypes.find(
                (type) => type.name === values.power_type
              );
              if (powerType) {
                setPowerType(powerType);
              }
            }}
            resetOnSave
            saving={machineSaving}
            saved={machineSaved}
            secondarySubmit={(_, { submitForm }) => {
              setSecondarySubmit(true);
              submitForm();
            }}
            secondarySubmitLabel="Save and add another"
            submitLabel="Save machine"
          >
            <AddMachineFormFields saved={machineSaved} />
          </FormikFormContent>
        </Formik>
      )}
    </>
  );
};

export default AddMachineForm;
