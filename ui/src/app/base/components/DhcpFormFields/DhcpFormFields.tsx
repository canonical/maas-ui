import {
  Spinner,
  Notification,
  Select,
  Textarea,
} from "@canonical/react-components";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import type { DHCPFormValues } from "app/base/components/DhcpForm/types";
import FormikField from "app/base/components/FormikField";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller } from "app/store/controller/types";
import deviceSelectors from "app/store/device/selectors";
import type { Device } from "app/store/device/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";

type Option = { label: string; value: string };

type ModelType = Subnet | Controller | Machine | Device;

type Props = {
  editing: boolean;
};

const generateOptions = (
  type: DHCPFormValues["type"],
  models: ModelType[] | null
): Option[] | null =>
  !!models
    ? [
        {
          value: "",
          label: `Choose ${type}`,
        },
      ].concat(
        models.map((model) => ({
          value:
            type === "subnet"
              ? model.id.toString()
              : ("system_id" in model && model.system_id) || "",
          label:
            type === "subnet"
              ? ("name" in model && model.name) || ""
              : ("fqdn" in model && model.fqdn) || "",
        }))
      )
    : null;

export const DhcpFormFields = ({ editing }: Props): JSX.Element => {
  const formikProps = useFormikContext<DHCPFormValues>();
  const subnets = useSelector(subnetSelectors.all);
  const controllers = useSelector(controllerSelectors.all);
  const devices = useSelector(deviceSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const subnetLoading = useSelector(subnetSelectors.loading);
  const subnetLoaded = useSelector(subnetSelectors.loaded);
  const controllerLoading = useSelector(controllerSelectors.loading);
  const controllerLoaded = useSelector(controllerSelectors.loaded);
  const deviceLoading = useSelector(deviceSelectors.loading);
  const deviceLoaded = useSelector(deviceSelectors.loaded);
  const machineLoading = useSelector(machineSelectors.loading);
  const machineLoaded = useSelector(machineSelectors.loaded);
  const isLoading =
    subnetLoading || controllerLoading || deviceLoading || machineLoading;
  const hasLoaded =
    subnetLoaded && controllerLoaded && deviceLoaded && machineLoaded;
  const { enabled, type } = formikProps.values;
  let models: ModelType[] | null;
  switch (type) {
    case "subnet":
      models = subnets;
      break;
    case "controller":
      models = controllers;
      break;
    case "machine":
      models = machines;
      break;
    case "device":
      models = devices;
      break;
    default:
      models = null;
  }

  return (
    <>
      {editing && !enabled && (
        <Notification type="caution" status="Warning:">
          This snippet is disabled and will not be used by MAAS.
        </Notification>
      )}
      <FormikField
        name="name"
        label="Snippet name"
        required={true}
        type="text"
      />
      <FormikField name="enabled" label="Enabled" type="checkbox" />
      <FormikField
        component={Textarea}
        name="description"
        label="Description"
      />
      <FormikField
        component={Select}
        name="type"
        label="Type"
        onChange={(e: React.FormEvent) => {
          formikProps.handleChange(e);
          formikProps.setFieldValue("entity", "");
          formikProps.setFieldTouched("entity", false, false);
        }}
        options={[
          { value: "", label: "Global" },
          { value: "subnet", label: "Subnet" },
          { value: "controller", label: "Controller" },
          { value: "machine", label: "Machine" },
          { value: "device", label: "Device" },
        ]}
      />
      {type &&
        (isLoading || !hasLoaded ? (
          <Spinner text="loading..." />
        ) : (
          <FormikField
            component={Select}
            name="entity"
            label="Applies to"
            options={generateOptions(type, models)}
          />
        ))}
      <FormikField
        component={Textarea}
        name="value"
        grow
        label="DHCP snippet"
        placeholder="Custom DHCP snippet"
        required
      />
    </>
  );
};

DhcpFormFields.propTypes = {
  editing: PropTypes.bool,
};

export default DhcpFormFields;
