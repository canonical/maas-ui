import type { ReactElement } from "react";

import { useClearNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import type { DiscoveryResponse } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";

type Props = {
  discovery: DiscoveryResponse;
  onClose: () => void;
};

const DiscoveryDeleteForm = ({ discovery, onClose }: Props): ReactElement => {
  const clearDiscovery = useClearNetworkDiscoveries();

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
        clearDiscovery.mutate({
          query: { ip: discovery.ip, mac: discovery.mac_address },
        });
      }}
      onSuccess={onClose}
      saved={clearDiscovery.isSuccess}
      saving={clearDiscovery.isPending}
    />
  );
};

export default DiscoveryDeleteForm;
