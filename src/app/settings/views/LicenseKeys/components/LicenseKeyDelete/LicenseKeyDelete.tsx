import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { licenseKeysActions } from "@/app/store/licensekeys";
import licenseKeysSelectors from "@/app/store/licensekeys/selectors";
import type { LicenseKeys } from "@/app/store/licensekeys/types";

type Props = {
  licenseKey: LicenseKeys;
};

const LicenseKeyDelete = ({ licenseKey }: Props) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const errors = useSelector(licenseKeysSelectors.errors);
  const saved = useSelector(licenseKeysSelectors.saved);
  const saving = useSelector(licenseKeysSelectors.saving);

  return (
    <ModelActionForm
      aria-label="Confirm license key deletion"
      errors={errors}
      initialValues={{}}
      modelType="license key"
      onCancel={closeModal}
      onSubmit={() => {
        dispatch(licenseKeysActions.delete(licenseKey));
      }}
      onSuccess={closeModal}
      saved={saved}
      saving={saving}
    />
  );
};

export default LicenseKeyDelete;
