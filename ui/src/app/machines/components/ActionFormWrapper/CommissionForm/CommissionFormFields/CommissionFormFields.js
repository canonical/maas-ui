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
  const urlScriptsSelected = values.testingScripts.filter((script) =>
    Object.keys(script.parameters).some((key) => key === "url")
  );

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
          data-test="commissioning-scripts-selector"
          disabled={
            values.commissioningScripts.length === commissioningScripts.length
          }
          initialSelected={preselectedCommissioning}
          initialValues={preselectedCommissioning}
          label="Commissioning scripts"
          name="commissioningScripts"
          onTagsUpdate={(selectedScripts) => {
            setFieldValue("commissioningScripts", selectedScripts);
          }}
          placeholder="Select additional scripts"
          required
          tags={commissioningScripts}
          disabledTags={commissioningScripts.filter(
            (script) => script.default === true
          )}
        />
        <FormikField
          component={TagSelector}
          data-test="testing-scripts-selector"
          disabled={values.testingScripts.length === testingScripts.length}
          initialSelected={preselectedTesting}
          label="Testing scripts"
          name="tests"
          onTagsUpdate={(selectedScripts) => {
            setFieldValue("testingScripts", selectedScripts);
          }}
          placeholder="Select additional scripts"
          required
          tags={testingScripts}
        />
        {urlScriptsSelected.map((script) => (
          <FormikField
            data-test="url-script-input"
            help={script.parameters.url.description}
            key={script.name}
            label={
              <span>
                URL(s) to use for <strong>{script.name}</strong> script
              </span>
            }
            name={`scriptInputs[${script.name}].url`}
            onChange={(e) => {
              handleChange(e);
              setFieldValue(`scriptInputs[${script.name}].url`, e.target.value);
            }}
            type="text"
          />
        ))}
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
