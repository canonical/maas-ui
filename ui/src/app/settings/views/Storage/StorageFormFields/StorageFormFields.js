import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import { extendFormikShape } from "app/settings/proptypes";
import { config as configSelectors } from "app/settings/selectors";
import FormikField from "app/base/components/FormikField";
import Select from "app/base/components/Select";

const StorageFormFields = ({ formikProps }) => {
  const { values } = formikProps;
  const storageLayoutOptions = useSelector(
    configSelectors.storageLayoutOptions
  );

  return (
    <>
      <FormikField
        label="Default storage layout"
        component={Select}
        options={storageLayoutOptions}
        help="Storage layout that is applied to a node when it is commissioned."
        fieldKey="default_storage_layout"
        formikProps={formikProps}
      />
      {values.default_storage_layout === "blank" && (
        <p className="p-form-validation__message">
          <i className="p-icon--warning" />
          <strong className="p-icon__text">Caution:</strong> You will not be
          able to deploy machines with this storage layout. Manual configuration
          is required.
        </p>
      )}
      {values.default_storage_layout === "vmfs6" && (
        <p className="p-form-validation__message">
          <i className="p-icon--warning" />
          <strong className="p-icon__text">Caution:</strong> The VMFS6 storage
          layout only allows for the deployment of{" "}
          <strong>VMware (ESXi)</strong>.
        </p>
      )}
      <FormikField
        label="Erase nodes' disks prior to releasing"
        type="checkbox"
        checked={values.enable_disk_erasing_on_release}
        help="Forces users to always erase disks when releasing."
        fieldKey="enable_disk_erasing_on_release"
        formikProps={formikProps}
      />
      <FormikField
        label="Use secure erase by default when erasing disks"
        type="checkbox"
        checked={values.disk_erase_with_secure_erase}
        help="Will only be used on devices that support secure erase. Other devices will fall back to full wipe or quick erase depending on the selected options."
        fieldKey="disk_erase_with_secure_erase"
        formikProps={formikProps}
      />
      <FormikField
        label="Use quick erase by default when erasing disks"
        type="checkbox"
        checked={values.disk_erase_with_quick_erase}
        help="This is not a secure erase; it wipes only the beginning and end of each disk."
        fieldKey="disk_erase_with_quick_erase"
        formikProps={formikProps}
      />
    </>
  );
};

StorageFormFields.propTypes = extendFormikShape({
  default_storage_layout: PropTypes.string,
  disk_erase_with_quick_erase: PropTypes.bool,
  disk_erase_with_secure_erase: PropTypes.bool,
  enable_disk_erasing_on_release: PropTypes.bool
});

export default StorageFormFields;
