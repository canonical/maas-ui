import SectionHeader from "app/base/components/SectionHeader";
import type { Space } from "app/store/space/types";

type Props = {
  space: Space;
};

const SpaceDetailsHeader = ({ space }: Props): JSX.Element => {
  return <SectionHeader title={space.name} />;
};

export default SpaceDetailsHeader;
