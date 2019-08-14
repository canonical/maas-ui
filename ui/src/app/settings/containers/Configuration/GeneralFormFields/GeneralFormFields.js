import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const GeneralFormFields = ({ formikProps }) => {
  const { values } = formikProps;

  return (
    <>
      <FormikField
        label="MAAS name"
        type="text"
        fieldKey="maas_name"
        required={true}
        formikProps={formikProps}
      />
      <FormikField
        label="Enable Google Analytics in MAAS UI to shape improvements in user experience"
        type="checkbox"
        fieldKey="enable_analytics"
        checked={values.enable_analytics}
        formikProps={formikProps}
      />
    </>
  );
};

GeneralFormFields.propTypes = extendFormikShape({
  maas_name: PropTypes.string,
  enable_analytics: PropTypes.bool
});

export default GeneralFormFields;
