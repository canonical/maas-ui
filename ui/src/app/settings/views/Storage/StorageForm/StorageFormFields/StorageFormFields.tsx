import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { StorageFormValues } from "../types";

import FormikField from "app/base/components/FormikField";
import configSelectors from "app/store/config/selectors";
import { isVMWareLayout } from "app/store/machine/utils";
import { StorageLayout } from "app/store/types/enum";

const StorageFormFields = (): JSX.Element => {
  const { values } = useFormikContext<StorageFormValues>();
  const storageLayoutOptions =
    useSelector(configSelectors.storageLayoutOptions) || [];

  return (
    <>
      <FormikField
        label="Default storage layout"
        component={Select}
        options={storageLayoutOptions}
        help="Storage layout that is applied to a node when it is commissioned."
        name="default_storage_layout"
      />
      {values.default_storage_layout === StorageLayout.BLANK && (
        <p className="p-form-validation__message">
          <i className="p-icon--warning" />
          <strong className="u-nudge-right--x-small">Caution:</strong> You will
          not be able to deploy machines with this storage layout. Manual
          configuration is required.
        </p>
      )}
      {isVMWareLayout(values.default_storage_layout) && (
        <p className="p-form-validation__message">
          <i className="p-icon--warning" />
          <strong className="u-nudge-right--x-small">Caution:</strong> This
          storage layout only allows for the deployment of{" "}
          <strong>VMware (ESXi)</strong> images.
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
