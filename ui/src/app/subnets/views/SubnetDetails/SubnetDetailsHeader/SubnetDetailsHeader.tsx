import SectionHeader from "app/base/components/SectionHeader";
import type { Subnet } from "app/store/subnet/types";
import { isSubnetDetails } from "app/store/subnet/utils";

type Props = {
  subnet: Subnet;
};

const SubnetDetailsHeader = ({ subnet }: Props): JSX.Element => {
  return (
    <SectionHeader
      subtitleLoading={!isSubnetDetails(subnet)}
      title={subnet.name}
    />
  );
};

export default SubnetDetailsHeader;
