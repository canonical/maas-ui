import type { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";

import type { DiscoveryResponse } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { discoveryActions } from "@/app/store/discovery";
import discoverySelectors from "@/app/store/discovery/selectors";

type Props = {
  discovery: DiscoveryResponse;
  onClose: () => void;
};

const DiscoveryDeleteForm = ({ discovery, onClose }: Props): ReactElement => {
  const dispatch = useDispatch();
  const saving = useSelector(discoverySelectors.saving);
  const saved = useSelector(discoverySelectors.saved);
  return (
    <ModelActionForm
      aria-label="Delete discovery"
      initialValues={{}}
      message={`Are you sure you want to delete discovery "${
        discovery.hostname || "Unknown"
      }"?`}
      modelType="discovery"
      onCancel={onClose}
      onSubmit={() => {
        dispatch(
          discoveryActions.delete({
            ip: discovery.ip!,
            mac: discovery.mac_address!,
          })
        );
      }}
      saved={saved}
      saving={saving}
    />
  );
};

export default DiscoveryDeleteForm;
