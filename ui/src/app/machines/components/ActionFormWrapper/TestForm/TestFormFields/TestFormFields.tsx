import * as React from "react";

import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { FormValues } from "../TestForm";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Script } from "app/store/script/types";

type ScriptsDisplay = Script & { displayName: string };
type Props = {
  preselected: ScriptsDisplay[];
  scripts: Script[];
};
export const TestFormFields = ({
  preselected,
  scripts,
}: Props): JSX.Element => {
  const {
    handleChange,
    setFieldValue,
    values,
  } = useFormikContext<FormValues>();
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
          onTagsUpdate={(selectedScripts: Script[]) =>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
