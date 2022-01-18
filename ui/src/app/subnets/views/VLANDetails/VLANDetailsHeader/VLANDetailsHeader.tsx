import SectionHeader from "app/base/components/SectionHeader";
import type { VLAN } from "app/store/vlan/types";

type Props = {
  vlan: VLAN;
};

const VLANDetailsHeader = ({ vlan }: Props): JSX.Element => {
  return <SectionHeader title={vlan.name} />;
};

export default VLANDetailsHeader;
