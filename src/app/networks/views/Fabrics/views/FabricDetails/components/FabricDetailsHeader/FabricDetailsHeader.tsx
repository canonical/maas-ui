import type { ReactElement } from "react";

import { Button } from "@canonical/react-components";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useHasEntitlements } from "@/app/base/hooks";
import { useModal } from "@/app/base/modal-context";
import { DeleteFabric } from "@/app/networks/views/Fabrics/components";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import type { Fabric } from "@/app/store/fabric/types";

type FabricDetailsHeaderProps = {
  fabric: Fabric | null;
};

const FabricDetailsHeader = ({
  fabric,
}: FabricDetailsHeaderProps): ReactElement => {
  const { openModal } = useModal();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

  return (
    <SectionHeader
      buttons={
        canEdit
          ? [
              <Button
                appearance="neutral"
                onClick={() => {
                  openModal({
                    component: DeleteFabric,
                    title: "Delete fabric",
                    props: { id: fabric?.id },
                  });
                }}
              >
                Delete fabric
              </Button>,
            ]
          : null
      }
      loading={!fabric}
      title={fabric?.name}
    />
  );
};

export default FabricDetailsHeader;
