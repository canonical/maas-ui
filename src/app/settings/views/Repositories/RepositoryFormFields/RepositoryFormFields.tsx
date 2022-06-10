import { Col, List, Row, Textarea } from "@canonical/react-components";
import type { FormikProps } from "formik";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { RepositoryFormValues } from "../RepositoryForm/types";

import FormikField from "app/base/components/FormikField";
import {
  componentsToDisable as componentsToDisableSelectors,
  knownArchitectures as knownArchitecturesSelectors,
  pocketsToDisable as pocketsToDisableSelectors,
} from "app/store/general/selectors";

type Props = {
  type: "ppa" | "repository";
};

const generateCheckboxGroup = (
  key: keyof RepositoryFormValues,
  fields: string[],
  setFieldTouched: FormikProps<RepositoryFormValues>["setFieldTouched"],
  setFieldValue: FormikProps<RepositoryFormValues>["setFieldValue"],
  values: string[]
) => {
  const checkboxes = fields.map((field) => (
    <FormikField
      wrapperClassName="u-no-margin--bottom"
      key={field}
      label={field}
      type="checkbox"
      name={key}
      value={field}
      checked={values.includes(field)}
      onChange={() => {
        let newFields = [];
        if (values.includes(field)) {
          newFields = values.filter((oldField) => oldField !== field);
        } else {
          // Conserve original order of fields
          const temp = [...values, field];
          newFields = fields.filter((oldField) => temp.includes(oldField));
        }
        setFieldValue(key, newFields);
        setFieldTouched(key, true);
      }}
    />
  ));

  return <List items={checkboxes} className="is-split--small" />;
};

const RepositoryFormFields = ({ type }: Props): JSX.Element => {
  const { setFieldTouched, setFieldValue, values } =
    useFormikContext<RepositoryFormValues>();
  const componentsToDisable = useSelector(componentsToDisableSelectors.get);
  const knownArchitectures = useSelector(knownArchitecturesSelectors.get);
  const pocketsToDisable = useSelector(pocketsToDisableSelectors.get);

  return (
    <Row>
      <Col size={4}>
        <FormikField
          label="Name"
          type="text"
          name="name"
          disabled={values.default}
          required
        />
        <FormikField label="URL" type="text" name="url" required />
        <List
          items={[
            <FormikField
              wrapperClassName="u-no-margin--bottom"
              label="Enable repository"
              type="checkbox"
              name="enabled"
              checked={values.enabled}
              disabled={values.default}
            />,
            <FormikField
              wrapperClassName="u-no-margin--bottom"
              label="Enable sources"
              type="checkbox"
              name="disable_sources"
              checked={!values.disable_sources}
              onChange={() => {
                setFieldValue("disable_sources", !values.disable_sources);
              }}
            />,
          ]}
          className="is-split--small u-hide--medium u-hide--large"
        />
        <FormikField
          label="Key"
          component={Textarea}
          name="key"
          style={{ height: "10rem", maxWidth: "100%" }}
        />
        {type === "repository" && !values.default && (
          <>
            <FormikField
              label="Distributions"
              type="text"
              name="distributions"
            />
            <FormikField label="Components" type="text" name="components" />
          </>
        )}
      </Col>
      <Col size={3} emptyLarge={6}>
        <List
          items={[
            <FormikField
              wrapperClassName="u-no-margin--bottom"
              label="Enable repository"
              type="checkbox"
              name="enabled"
              checked={values.enabled}
              disabled={values.default}
            />,
            <FormikField
              wrapperClassName="u-no-margin--bottom"
              label="Enable sources"
              type="checkbox"
              name="disable_sources"
              checked={!values.disable_sources}
              onChange={() => {
                setFieldValue("disable_sources", !values.disable_sources);
              }}
            />,
          ]}
          className="is-split--small u-hide--small"
        />
        <p className="u-no-margin--bottom">Architectures</p>
        {generateCheckboxGroup(
          "arches",
          knownArchitectures,
          setFieldTouched,
          setFieldValue,
          values["arches"]
        )}
        {values.default && (
          <>
            <p className="u-no-margin--bottom">Disabled pockets</p>
            {generateCheckboxGroup(
              "disabled_pockets",
              pocketsToDisable,
              setFieldTouched,
              setFieldValue,
              values["disabled_pockets"]
            )}
            <p className="u-no-margin--bottom">Disabled components</p>
            {generateCheckboxGroup(
              "disabled_components",
              componentsToDisable,
              setFieldTouched,
              setFieldValue,
              values["disabled_components"]
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

export default RepositoryFormFields;
