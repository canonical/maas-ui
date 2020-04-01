import {
  Col,
  Loader,
  Notification,
  Row,
  Select,
  Textarea,
} from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import {
  controller as controllerSelectors,
  device as deviceSelectors,
  machine as machineSelectors,
  subnet as subnetSelectors,
} from "app/base/selectors";
import FormikField from "app/base/components/FormikField";

const generateOptions = (type, models) =>
  [
    {
      value: "",
      label: `Choose ${type}`,
    },
  ].concat(
    models.map((model) => ({
      value: type === "subnet" ? model.id : model.system_id,
      label: type === "subnet" ? model.name : model.fqdn,
    }))
  );

export const DhcpFormFields = ({ editing }) => {
  const formikProps = useFormikContext();
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
  let models;
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
      <Row>
        <Col size="4">
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
        </Col>
        <Col size="4">
          <FormikField
            component={Select}
            name="type"
            label="Type"
            onChange={(e) => {
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
              <Loader text="loading..." />
            ) : (
              <FormikField
                component={Select}
                name="entity"
                label="Applies to"
                options={generateOptions(type, models)}
              />
            ))}
        </Col>
      </Row>
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
