import type { ReactElement } from "react";

import { useSidePanel } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions, useHasEntitlements } from "@/app/base/hooks";
import { DeleteVLAN } from "@/app/networks/views/VLANs/components";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { fabricActions } from "@/app/store/fabric";
import fabricSelectors from "@/app/store/fabric/selectors";
import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import type { VLAN } from "@/app/store/vlan/types";
import { VlanVid } from "@/app/store/vlan/types";
import { isVLANDetails } from "@/app/store/vlan/utils";

type Props = {
  vlan: VLAN | null;
};

const generateTitle = (
  vlan?: VLAN | null,
  fabric?: Fabric | null
): string | null => {
  if (!vlan || !fabric) {
    return null;
  }
  let title: string;
  if (vlan.name) {
    title = vlan.name;
  } else if (vlan.vid === VlanVid.UNTAGGED) {
    title = "Default VLAN";
  } else {
    title = `VLAN ${vlan.vid}`;
  }
  return `${title} in ${fabric.name}`;
};

const VLANDetailsHeader = ({ vlan }: Props): ReactElement => {
  const { openSidePanel } = useSidePanel();

  const fabricId = vlan?.fabric;
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, fabricId)
  );
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

  useFetchActions([fabricActions.fetch]);

  const buttons = [];
  if (canEdit) {
    buttons.push(
      <Button
        data-testid="delete-vlan"
        key="delete-vlan"
        onClick={() => {
          openSidePanel({
            component: DeleteVLAN,
            title: "Delete VLAN",
            props: {
              id: vlan!.id,
            },
          });
        }}
      >
        Delete VLAN
      </Button>
    );
  }

  return (
    <SectionHeader
      buttons={buttons}
      loading={!vlan}
      subtitleLoading={!isVLANDetails(vlan)}
      title={generateTitle(vlan, fabric)}
    />
  );
};

export default VLANDetailsHeader;
