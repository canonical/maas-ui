import type { ReactElement } from "react";

import SectionHeader from "@/app/base/components/SectionHeader";

type Props = {
  controls?: ReactElement;
};

const NetworksHeader = ({ controls }: Props) => {
  return (
    <SectionHeader
      renderButtons={() => controls ?? null}
      tabLinks={[
        { label: "Subnets" },
        { label: "VLANs" },
        { label: "Spaces" },
        { label: "Fabrics" },
      ]}
      title="Networks"
    />
  );
};

export default NetworksHeader;
