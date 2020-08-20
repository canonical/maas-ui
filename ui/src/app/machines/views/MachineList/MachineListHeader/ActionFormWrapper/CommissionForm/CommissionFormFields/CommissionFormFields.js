import { Col, Row } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import { useEffect } from "react";
import { useState } from "react";

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

  useEffect(() => {
    setFieldValue("commissioningScripts", preselectedCommissioning);
    setFieldValue("testingScripts", preselectedTesting);
  }, [preselectedCommissioning, preselectedTesting, setFieldValue]);

  useEffect(() => {
    setDisabledScripts(
      commissioningScripts.filter((script) => script.default === true)
    );
  }, [commissioningScripts]);

  const [
    showCommissioningPlaceholder,
    setShowCommissioningPlaceholder,
  ] = useState(true);

  const [showTestingPlaceholder, setShowTestingPlaceholder] = useState(true);
  const [disabledScripts, setDisabledScripts] = useState([]);

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
          label="Commissioning scripts"
          name="commissioningScripts"
          onTagsUpdate={(selectedScripts) => {
            setFieldValue("commissioningScripts", selectedScripts);
            setShowCommissioningPlaceholder(
              selectedScripts.length !== commissioningScripts.length
            );
          }}
          placeholder={
            showCommissioningPlaceholder ? "Select additional scripts" : null
          }
          required
          tags={commissioningScripts}
          disabledTags={disabledScripts}
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
            setShowTestingPlaceholder(
              selectedScripts.length !== testingScripts.length
            );
          }}
          placeholder={
            showTestingPlaceholder ? "Select additional scripts" : null
          }
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
