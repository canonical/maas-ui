import SectionHeader from "app/base/components/SectionHeader";
import type { Subnet } from "app/store/subnet/types";

type Props = {
  subnet: Subnet;
};

const SubnetDetailsHeader = ({ subnet }: Props): JSX.Element => {
  return <SectionHeader title={subnet.name} />;
};

export default SubnetDetailsHeader;
