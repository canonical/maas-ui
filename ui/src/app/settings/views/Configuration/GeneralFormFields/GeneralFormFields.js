import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const GeneralFormFields = ({ formikProps }) => {
  return (
    <>
      <FormikField
        label="MAAS name"
        type="text"
        name="maas_name"
        required={true}
      />
      <FormikField
        label="Enable Google Analytics in MAAS UI to shape improvements in user experience"
        type="checkbox"
        name="enable_analytics"
      />
    </>
  );
};

GeneralFormFields.propTypes = extendFormikShape({
  maas_name: PropTypes.string,
  enable_analytics: PropTypes.bool
});

export default GeneralFormFields;
