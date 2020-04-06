import { Col, Row } from "@canonical/react-components";
import React from "react";
import { useFormikContext } from "formik";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";

export const TestFormFields = ({ preselected, scripts }) => {
  const { handleChange, setFieldValue, values } = useFormikContext();
  const urlScriptsSelected = values.scripts.filter((script) =>
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
          component={TagSelector}
          disabled={values.scripts.length === scripts.length}
          initialSelected={preselected}
          label="Tests"
          name="tests"
          onTagsUpdate={(selectedScripts) =>
            setFieldValue("scripts", selectedScripts)
          }
          placeholder="Select scripts"
          required
          tags={scripts}
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
    </Row>
  );
};

export default TestFormFields;
