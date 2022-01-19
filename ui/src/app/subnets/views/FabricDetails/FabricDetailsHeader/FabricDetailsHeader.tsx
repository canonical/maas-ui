import SectionHeader from "app/base/components/SectionHeader";
import type { Fabric } from "app/store/fabric/types";

type Props = {
  fabric: Fabric;
};

const FabricDetailsHeader = ({ fabric }: Props): JSX.Element => {
  return <SectionHeader title={fabric.name} />;
};

export default FabricDetailsHeader;
