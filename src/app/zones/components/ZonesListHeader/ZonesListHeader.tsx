import type { ReactElement } from "react";

import { MainToolbar, useSidePanel } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";

import ZonesListTitle from "./ZonesListTitle";

import { useZoneCount } from "@/app/api/query/zones";
import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import { useHasEntitlements } from "@/app/base/hooks";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { AddZone } from "@/app/zones/components";

const ZonesListHeader = (): ReactElement => {
  const { openSidePanel } = useSidePanel();
  const zonesCount = useZoneCount();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

  return (
    <MainToolbar>
      <MainToolbar.Title>
        <ZonesListTitle />
      </MainToolbar.Title>
      {zonesCount.isSuccess ? (
        <ModelListSubtitle available={zonesCount.data} modelName="AZ" />
      ) : (
        <Spinner text="Loading..." />
      )}
      <MainToolbar.Controls>
        <Button
          data-testid="add-zone"
          disabled={!canEdit}
          key="add-zone"
          onClick={() => {
            openSidePanel({ component: AddZone, title: "Add AZ" });
          }}
        >
          Add AZ
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default ZonesListHeader;
