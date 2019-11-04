import { Col, List, Row, Textarea } from "@canonical/react-components";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import "./RepositoryFormFields.scss";
import { extendFormikShape } from "app/settings/proptypes";
import { useFormikErrors } from "app/base/hooks";
import {
  general as generalSelectors,
  packagerepository as repositorySelectors
} from "app/base/selectors";
import FormikField from "app/base/components/FormikField";

const generateCheckboxGroup = (key, fields, formikProps) => {
  const { setFieldTouched, setFieldValue, values } = formikProps;

  const checkboxes = fields.map(field => (
    <FormikField
      wrapperClassName="u-no-margin--bottom"
      key={field}
      label={field}
      type="checkbox"
      name={key}
      value={field}
      checked={values[key].includes(field)}
      onChange={() => {
        let newFields = [];
        if (values[key].includes(field)) {
          newFields = values[key].filter(oldField => oldField !== field);
        } else {
          // Conserve original order of fields
          const temp = [...values[key], field];
          newFields = fields.filter(oldField => temp.includes(oldField));
        }
        setFieldValue(key, newFields);
        setFieldTouched(key, true);
      }}
    />
  ));

  return <List items={checkboxes} className="is-split--small" />;
};

const RepositoryFormFields = ({ formikProps, type }) => {
  const { setFieldValue, values } = formikProps;
  const componentsToDisable = useSelector(
    generalSelectors.componentsToDisable.get
  );
  const knownArchitectures = useSelector(
    generalSelectors.knownArchitectures.get
  );
  const pocketsToDisable = useSelector(generalSelectors.pocketsToDisable.get);
  const errors = useSelector(repositorySelectors.errors);

  useFormikErrors(errors, formikProps);

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
        <FormikField
          label="URL"
          type="text"
          name="url"
          disabled={values.default}
          required
        />
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
            />
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
            />
          ]}
          className="is-split--small u-hide--small"
        />
        <label>Architectures</label>
        {generateCheckboxGroup("arches", knownArchitectures, formikProps)}
        {values.default && (
          <>
            <label>Disabled pockets</label>
            {generateCheckboxGroup(
              "disabled_pockets",
              pocketsToDisable,
              formikProps
            )}
            <label>Disabled components</label>
            {generateCheckboxGroup(
              "disabled_components",
              componentsToDisable,
              formikProps
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

RepositoryFormFields.propTypes = extendFormikShape({
  arches: PropTypes.arrayOf(PropTypes.string),
  components: PropTypes.string,
  default: PropTypes.bool,
  disable_sources: PropTypes.bool,
  disabled_components: PropTypes.arrayOf(PropTypes.string),
  disabled_pockets: PropTypes.arrayOf(PropTypes.string),
  distributions: PropTypes.string,
  enabled: PropTypes.bool,
  key: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string
});

export default RepositoryFormFields;
