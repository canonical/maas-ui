import type { ReactElement } from "react";

import { MainToolbar, useSidePanel } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import { useNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import { useHasEntitlements } from "@/app/base/hooks";
import { ClearAllForm } from "@/app/networkDiscovery/components";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";

export enum Labels {
  ClearAll = "Clear all discoveries",
}

const NetworkDiscoveryHeader = (): ReactElement => {
  const { openSidePanel } = useSidePanel();
  const discoveries = useNetworkDiscoveries();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

  return (
    <MainToolbar>
      <MainToolbar.Title>Network discovery</MainToolbar.Title>
      <MainToolbar.Controls>
        <Button
          appearance="negative"
          data-testid="clear-all"
          disabled={!canEdit || discoveries.data?.total === 0}
          key="clear-all"
          onClick={() => {
            openSidePanel({
              component: ClearAllForm,
              title: "Clear all discoveries",
            });
          }}
        >
          {Labels.ClearAll}
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default NetworkDiscoveryHeader;
