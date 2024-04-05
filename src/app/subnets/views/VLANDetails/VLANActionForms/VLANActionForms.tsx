import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import ReservedRangeDeleteForm from "@/app/subnets/components/ReservedRangeDeleteForm";
import ReservedRangeForm from "@/app/subnets/components/ReservedRangeForm";
import VLANDeleteForm from "@/app/subnets/views/VLANDetails/VLANDeleteForm";
import { VLANActionTypes } from "@/app/subnets/views/VLANDetails/constants";
import type { VLANActionType } from "@/app/subnets/views/VLANDetails/constants";

type VLANActionFormProps = {
  id: number;
  activeForm: VLANActionType;
  setSidePanelContent: SetSidePanelContent;
};

const VLANActionForms = ({
  id,
  activeForm,
  setSidePanelContent,
}: VLANActionFormProps) => {
  return activeForm === VLANActionTypes.DeleteVLAN ? (
    <VLANDeleteForm closeForm={() => setSidePanelContent(null)} id={id} />
  ) : activeForm === VLANActionTypes.ReserveRange ? (
    <ReservedRangeForm setActiveForm={setSidePanelContent} />
  ) : activeForm === VLANActionTypes.DeleteReservedRange ? (
    <ReservedRangeDeleteForm setActiveForm={setSidePanelContent} />
  ) : null;
};

export default VLANActionForms;
