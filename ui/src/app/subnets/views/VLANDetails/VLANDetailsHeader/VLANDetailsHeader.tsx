import SectionHeader from "app/base/components/SectionHeader";
import type { VLAN } from "app/store/vlan/types";
import { isVLANDetails } from "app/store/vlan/utils";

type Props = {
  vlan: VLAN;
};

const VLANDetailsHeader = ({ vlan }: Props): JSX.Element => {
  return (
    <SectionHeader subtitleLoading={!isVLANDetails(vlan)} title={vlan.name} />
  );
};

export default VLANDetailsHeader;
