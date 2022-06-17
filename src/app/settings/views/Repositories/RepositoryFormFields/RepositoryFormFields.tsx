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
      checked={values.includes(field)}
      key={field}
      label={field}
      name={key}
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
      type="checkbox"
      value={field}
      wrapperClassName="u-no-margin--bottom"
    />
  ));

  return <List className="is-split--small" items={checkboxes} />;
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
          disabled={values.default}
          label="Name"
          name="name"
          required
          type="text"
        />
        <FormikField label="URL" name="url" required type="text" />
        <List
          className="is-split--small u-hide--medium u-hide--large"
          items={[
            <FormikField
              checked={values.enabled}
              disabled={values.default}
              label="Enable repository"
              name="enabled"
              type="checkbox"
              wrapperClassName="u-no-margin--bottom"
            />,
            <FormikField
              checked={!values.disable_sources}
              label="Enable sources"
              name="disable_sources"
              onChange={() => {
                setFieldValue("disable_sources", !values.disable_sources);
              }}
              type="checkbox"
              wrapperClassName="u-no-margin--bottom"
            />,
          ]}
        />
        <FormikField
          component={Textarea}
          label="Key"
          name="key"
          style={{ height: "10rem", maxWidth: "100%" }}
        />
        {type === "repository" && !values.default && (
          <>
            <FormikField
              label="Distributions"
              name="distributions"
              type="text"
            />
            <FormikField label="Components" name="components" type="text" />
          </>
        )}
      </Col>
      <Col emptyLarge={6} size={3}>
        <List
          className="is-split--small u-hide--small"
          items={[
            <FormikField
              checked={values.enabled}
              disabled={values.default}
              label="Enable repository"
              name="enabled"
              type="checkbox"
              wrapperClassName="u-no-margin--bottom"
            />,
            <FormikField
              checked={!values.disable_sources}
              label="Enable sources"
              name="disable_sources"
              onChange={() => {
                setFieldValue("disable_sources", !values.disable_sources);
              }}
              type="checkbox"
              wrapperClassName="u-no-margin--bottom"
            />,
          ]}
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
