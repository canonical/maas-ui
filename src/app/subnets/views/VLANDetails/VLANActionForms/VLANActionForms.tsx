import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import type { Subnet, SubnetMeta } from "@/app/store/subnet/types";
import type { VLAN, VLANMeta } from "@/app/store/vlan/types";
import ReservedRangeDeleteForm from "@/app/subnets/components/ReservedRangeDeleteForm";
import ReservedRangeForm from "@/app/subnets/components/ReservedRangeForm";
import VLANDeleteForm from "@/app/subnets/views/VLANDetails/VLANDeleteForm";
import type { VLANActionType } from "@/app/subnets/views/VLANDetails/constants";
import { VLANActionTypes } from "@/app/subnets/views/VLANDetails/constants";

const actionForms = {
  [VLANActionTypes.DeleteVLAN]: VLANDeleteForm,
  [VLANActionTypes.ReserveRange]: ReservedRangeForm,
  [VLANActionTypes.DeleteReservedRange]: ReservedRangeDeleteForm,
};

export type VLANActionFormProps = {
  subnetId?: Subnet[SubnetMeta.PK];
  vlanId: VLAN[VLANMeta.PK];
  activeForm: VLANActionType;
  setSidePanelContent: SetSidePanelContent;
};

const VLANActionForms = ({
  activeForm,
  setSidePanelContent,
  subnetId,
  vlanId,
}: VLANActionFormProps) => {
  const ActionForm = actionForms[activeForm];

  if (!ActionForm) {
    return null;
  }

  return (
    <ActionForm
      setSidePanelContent={setSidePanelContent}
      subnetId={subnetId}
      vlanId={vlanId}
    />
  );
};

export default VLANActionForms;
