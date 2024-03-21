import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { VLANDetailsSidePanelViews } from "../constants";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import authSelectors from "@/app/store/auth/selectors";
import { fabricActions } from "@/app/store/fabric";
import fabricSelectors from "@/app/store/fabric/selectors";
import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import vlanSelectors from "@/app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "@/app/store/vlan/types";
import { VlanVid } from "@/app/store/vlan/types";
import { isVLANDetails } from "@/app/store/vlan/utils";

type Props = {
  id?: VLAN[VLANMeta.PK] | null;
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

const VLANDetailsHeader = ({ id }: Props): JSX.Element => {
  const { setSidePanelContent } = useSidePanel();

  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const fabricId = vlan?.fabric;
  const fabric = useSelector((state: RootState) =>
    fabricSelectors.getById(state, fabricId)
  );
  const isAdmin = useSelector(authSelectors.isAdmin);

  useFetchActions([fabricActions.fetch]);

  const buttons = [];
  if (isAdmin) {
    buttons.push(
      <Button
        data-testid="delete-vlan"
        key="delete-vlan"
        onClick={() =>
          setSidePanelContent({ view: VLANDetailsSidePanelViews.DELETE_VLAN })
        }
      >
        Delete VLAN
      </Button>
    );
  }

  return (
    <SectionHeader
      buttons={buttons}
      subtitleLoading={!isVLANDetails(vlan)}
      title={generateTitle(vlan, fabric)}
    />
  );
};

export default VLANDetailsHeader;
