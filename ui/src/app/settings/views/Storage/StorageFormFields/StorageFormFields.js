import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import configSelectors from "app/store/config/selectors";
import FormikField from "app/base/components/FormikField";

const StorageFormFields = () => {
  const { values } = useFormikContext();
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
        name="default_storage_layout"
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
        help="Forces users to always erase disks when releasing."
        name="enable_disk_erasing_on_release"
      />
      <FormikField
        label="Use secure erase by default when erasing disks"
        type="checkbox"
        help="Will only be used on devices that support secure erase. Other devices will fall back to full wipe or quick erase depending on the selected options."
        name="disk_erase_with_secure_erase"
      />
      <FormikField
        label="Use quick erase by default when erasing disks"
        type="checkbox"
        help="This is not a secure erase; it wipes only the beginning and end of each disk."
        name="disk_erase_with_quick_erase"
      />
    </>
  );
};

export default StorageFormFields;
