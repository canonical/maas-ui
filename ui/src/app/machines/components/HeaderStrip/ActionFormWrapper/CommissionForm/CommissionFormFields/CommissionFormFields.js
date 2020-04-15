import { Col, Row } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";

export const CommissionFormFields = ({
  preselectedTesting,
  preselectedCommissioning,
  commissioningScripts,
  testingScripts,
}) => {
  const { handleChange, setFieldValue, values } = useFormikContext();

  return (
    <Row>
      <Col size="6">
        <FormikField
          label="Allow SSH access and prevent machine powering off"
          name="enableSSH"
          type="checkbox"
        />
        <FormikField
          label="Skip configuring supported BMC controllers with a MAAS generated username and password"
          name="skipBMCConfig"
          type="checkbox"
        />
        <FormikField
          label="Retain network configuration"
          name="skipNetworking"
          type="checkbox"
        />
        <FormikField
          component={TagSelector}
          disabled={
            values.commissioningScripts.length === commissioningScripts.length
          }
          initialSelected={preselectedCommissioning}
          label="Additional commissioning scripts"
          name="commissioningScripts"
          onTagsUpdate={(selectedScripts) =>
            setFieldValue("commissioningScripts", selectedScripts)
          }
          placeholder="Select commissioning scripts"
          required
          tags={commissioningScripts}
        />
        <FormikField
          component={TagSelector}
          disabled={values.testingScripts.length === testingScripts.length}
          initialSelected={preselectedTesting}
          label="Tests"
          name="tests"
          onTagsUpdate={(selectedScripts) =>
            setFieldValue("testingScripts", selectedScripts)
          }
          placeholder="Select testing scripts"
          required
          tags={testingScripts}
        />
      </Col>
      <Col size="6">
        <FormikField
          label="Retain storage configuration"
          name="skipStorage"
          type="checkbox"
        />
        <FormikField
          label="Update firmware"
          name="updateFirmware"
          type="checkbox"
        />
        <FormikField
          label="Configure HBA"
          name="configureHBA"
          type="checkbox"
        />
      </Col>
    </Row>
  );
};

export default CommissionFormFields;
