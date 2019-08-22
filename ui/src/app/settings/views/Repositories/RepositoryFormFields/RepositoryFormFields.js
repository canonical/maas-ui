import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import "./RepositoryFormFields.scss";
import { extendFormikShape } from "app/settings/proptypes";
import { useFormikErrors } from "app/base/hooks";
import general from "app/settings/selectors/general";
import repositories from "app/settings/selectors/repositories";
import Col from "app/base/components/Col";
import FormikField from "app/base/components/FormikField";
import List from "app/base/components/List";
import Row from "app/base/components/Row";
import Textarea from "app/base/components/Textarea";

const generateCheckboxGroup = (key, fields, formikProps) => {
  const { setFieldTouched, setFieldValue, values } = formikProps;

  const checkboxes = fields.map(field => (
    <FormikField
      wrapperClassName="u-no-margin--bottom"
      key={field}
      label={field}
      type="checkbox"
      fieldKey={key}
      value={field}
      checked={values[key].includes(field)}
      formikProps={formikProps}
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
  const componentsToDisable = useSelector(general.componentsToDisable.get);
  const knownArchitectures = useSelector(general.knownArchitectures.get);
  const pocketsToDisable = useSelector(general.pocketsToDisable.get);
  const errors = useSelector(repositories.errors);

  useFormikErrors(errors, formikProps);

  return (
    <Row>
      <Col size={4}>
        <FormikField
          label="Name"
          type="text"
          fieldKey="name"
          formikProps={formikProps}
          disabled={values.default}
          required
        />
        <FormikField
          label="URL"
          type="text"
          fieldKey="url"
          formikProps={formikProps}
          disabled={values.default}
          required
        />
        <List
          items={[
            <FormikField
              wrapperClassName="u-no-margin--bottom"
              label="Enable repository"
              type="checkbox"
              fieldKey="enabled"
              checked={values.enabled}
              formikProps={formikProps}
            />,
            <FormikField
              wrapperClassName="u-no-margin--bottom"
              label="Enable sources"
              type="checkbox"
              fieldKey="disable_sources"
              checked={!values.disable_sources}
              formikProps={formikProps}
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
          fieldKey="key"
          formikProps={formikProps}
          style={{ height: "10rem", maxWidth: "100%" }}
        />
        {type === "repository" && (
          <>
            <FormikField
              label="Distributions"
              type="text"
              fieldKey="distributions"
              formikProps={formikProps}
            />
            <FormikField
              label="Components"
              type="text"
              fieldKey="components"
              formikProps={formikProps}
            />
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
              fieldKey="enabled"
              checked={values.enabled}
              formikProps={formikProps}
            />,
            <FormikField
              wrapperClassName="u-no-margin--bottom"
              label="Enable sources"
              type="checkbox"
              fieldKey="disable_sources"
              checked={!values.disable_sources}
              formikProps={formikProps}
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
