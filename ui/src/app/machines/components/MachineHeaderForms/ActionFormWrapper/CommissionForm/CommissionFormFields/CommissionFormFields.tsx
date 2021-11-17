import type { ChangeEvent } from "react";

import { Col, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { CommissionFormValues, FormattedScript } from "../types";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Tag } from "app/base/components/TagSelector/TagSelector";
import { getObjectString } from "app/store/script/utils";

type Props = {
  preselectedTesting: FormattedScript[];
  preselectedCommissioning: FormattedScript[];
  commissioningScripts: FormattedScript[];
  testingScripts: FormattedScript[];
};

export const CommissionFormFields = ({
  preselectedTesting,
  preselectedCommissioning,
  commissioningScripts,
  testingScripts,
}: Props): JSX.Element => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<CommissionFormValues>();
  const urlScriptsSelected = values.testingScripts.filter((script) =>
    Object.keys(script.parameters).some((key) => key === "url")
  );

  return (
    <Row>
      <Col size={6}>
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
          data-testid="commissioning-scripts-selector"
          disabled={
            values.commissioningScripts.length === commissioningScripts.length
          }
          initialSelected={preselectedCommissioning}
          label="Commissioning scripts"
          name="commissioningScripts"
          onTagsUpdate={(selectedScripts: Tag[]) => {
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
          data-testid="testing-scripts-selector"
          disabled={values.testingScripts.length === testingScripts.length}
          initialSelected={preselectedTesting}
          label="Testing scripts"
          name="tests"
          onTagsUpdate={(selectedScripts: Tag[]) => {
            setFieldValue("testingScripts", selectedScripts);
          }}
          placeholder="Select additional scripts"
          required
          tags={testingScripts}
        />
        {urlScriptsSelected.map((script) => (
          <FormikField
            data-testid="url-script-input"
            help={getObjectString(script.parameters.url, "description")}
            key={script.name}
            label={
              <span>
                URL(s) to use for <strong>{script.name}</strong> script
              </span>
            }
            name={`scriptInputs[${script.name}].url`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
              setFieldValue(`scriptInputs[${script.name}].url`, e.target.value);
            }}
            type="text"
          />
        ))}
      </Col>
      <Col size={6}>
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
