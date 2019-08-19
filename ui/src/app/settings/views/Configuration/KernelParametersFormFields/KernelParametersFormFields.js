import PropTypes from "prop-types";
import React from "react";

import { extendFormikShape } from "app/settings/proptypes";
import FormikField from "app/base/components/FormikField";

const KernelParametersFormFields = ({ formikProps }) => {
  return (
    <>
      <FormikField
        label="Boot parameters to pass to the kernel by default"
        type="text"
        fieldKey="kernel_opts"
        formikProps={formikProps}
      />
    </>
  );
};

KernelParametersFormFields.propTypes = extendFormikShape({
  kernel_opts: PropTypes.string
});

export default KernelParametersFormFields;
