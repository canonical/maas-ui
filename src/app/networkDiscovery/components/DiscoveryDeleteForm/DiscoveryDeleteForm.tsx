import type { ReactElement } from "react";

import { useClearNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import type { DiscoveryResponse } from "@/app/apiclient";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";

type Props = {
  discovery: DiscoveryResponse;
};

const DiscoveryDeleteForm = ({ discovery }: Props): ReactElement => {
  const { closeModal } = useModal();
  const clearDiscovery = useClearNetworkDiscoveries();

  return (
    <ModelActionForm
      aria-label="Delete discovery"
      errors={clearDiscovery.error}
      initialValues={{}}
      message={`Are you sure you want to delete discovery "${
        discovery.hostname || "Unknown"
      }"?`}
      modelType="discovery"
      onCancel={closeModal}
      onSubmit={() => {
        clearDiscovery.mutate({
          query: { ip: discovery.ip, mac: discovery.mac_address },
        });
      }}
      onSuccess={closeModal}
      saved={clearDiscovery.isSuccess}
      saving={clearDiscovery.isPending}
    />
  );
};

export default DiscoveryDeleteForm;
