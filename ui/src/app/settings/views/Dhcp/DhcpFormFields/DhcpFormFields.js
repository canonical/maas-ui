import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import {
  controller as controllerSelectors,
  device as deviceSelectors,
  machine as machineSelectors
} from "app/base/selectors";
import { formikFormDisabled } from "app/settings/utils";
import { useFormikErrors } from "app/base/hooks";
import Col from "app/base/components/Col";
import Form from "app/base/components/Form";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import Loader from "app/base/components/Loader";
import Notification from "app/base/components/Notification";
import Row from "app/base/components/Row";
import Select from "app/base/components/Select";
import selectors from "app/settings/selectors";
import Textarea from "app/base/components/Textarea";

const generateOptions = (type, models) =>
  [
    {
      value: "",
      label: `Choose ${type}`
    }
  ].concat(
    models.map(model => ({
      value: type === "subnet" ? model.id : model.system_id,
      label: type === "subnet" ? model.name : model.fqdn
    }))
  );

export const DhcpFormFields = ({ editing, formikProps }) => {
  const saving = useSelector(selectors.dhcpsnippet.saving);
  const saved = useSelector(selectors.dhcpsnippet.saved);
  const errors = useSelector(selectors.dhcpsnippet.errors);
  const subnets = useSelector(selectors.subnet.all);
  const controllers = useSelector(controllerSelectors.all);
  const devices = useSelector(deviceSelectors.all);
  const machines = useSelector(machineSelectors.all);
  const subnetLoading = useSelector(selectors.subnet.loading);
  const subnetLoaded = useSelector(selectors.subnet.loaded);
  const controllerLoading = useSelector(controllerSelectors.loading);
  const controllerLoaded = useSelector(controllerSelectors.loaded);
  const deviceLoading = useSelector(deviceSelectors.loading);
  const deviceLoaded = useSelector(deviceSelectors.loaded);
  const machineLoading = useSelector(machineSelectors.loading);
  const machineLoaded = useSelector(machineSelectors.loaded);
  useFormikErrors(errors, formikProps);
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
      <Form onSubmit={formikProps.handleSubmit}>
        <Row>
          <Col size="4">
            <FormikField
              formikProps={formikProps}
              fieldKey="name"
              label="Snippet name"
              required={true}
              type="text"
            />
            <FormikField
              formikProps={formikProps}
              fieldKey="enabled"
              label="Enabled"
              type="checkbox"
            />
            <FormikField
              component={Textarea}
              formikProps={formikProps}
              fieldKey="description"
              label="Description"
            />
          </Col>
          <Col size="4">
            <FormikField
              component={Select}
              formikProps={formikProps}
              fieldKey="type"
              label="Type"
              onChange={e => {
                formikProps.handleChange(e);
                formikProps.setFieldValue("entity", "");
                formikProps.setFieldTouched("entity", false, false);
              }}
              options={[
                { value: "", label: "Global" },
                { value: "subnet", label: "Subnet" },
                { value: "controller", label: "Controller" },
                { value: "machine", label: "Machine" },
                { value: "device", label: "Device" }
              ]}
            />
            {type &&
              (isLoading || !hasLoaded ? (
                <Loader text="loading..." />
              ) : (
                <FormikField
                  component={Select}
                  formikProps={formikProps}
                  fieldKey="entity"
                  label="Applies to"
                  options={generateOptions(type, models)}
                />
              ))}
          </Col>
        </Row>
        <FormikField
          component={Textarea}
          formikProps={formikProps}
          fieldKey="value"
          grow
          label="DHCP snippet"
          placeholder="Custom DHCP snippet"
          required
        />
        <FormCardButtons
          actionDisabled={saving || formikFormDisabled(formikProps)}
          actionLabel="Save snippet"
          actionLoading={saving}
          actionSuccess={saved}
        />
      </Form>
    </>
  );
};

DhcpFormFields.propTypes = {
  editing: PropTypes.bool,
  formikProps: PropTypes.shape({
    errors: PropTypes.shape({
      description: PropTypes.string,
      enabled: PropTypes.string,
      entity: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string
    }).isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    touched: PropTypes.shape({
      description: PropTypes.bool,
      enabled: PropTypes.bool,
      entity: PropTypes.bool,
      name: PropTypes.bool,
      type: PropTypes.bool,
      value: PropTypes.bool
    }).isRequired,
    values: PropTypes.shape({
      description: PropTypes.string,
      enabled: PropTypes.bool,
      entity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      value: PropTypes.string.isRequired
    }).isRequired
  })
};

export default DhcpFormFields;
