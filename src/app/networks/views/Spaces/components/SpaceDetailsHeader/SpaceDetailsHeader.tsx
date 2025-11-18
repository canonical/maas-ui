import type { ReactElement } from "react";

import { Button } from "@canonical/react-components";

import SectionHeader from "@/app/base/components/SectionHeader";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { Space } from "@/app/store/space/types";
import { DeleteSpace } from "@/app/subnets/views/Spaces/components";

type SpaceDetailsHeaderProps = {
  space: Space | null;
};

const SpaceDetailsHeader = ({
  space,
}: SpaceDetailsHeaderProps): ReactElement => {
  const { openSidePanel, isOpen } = useSidePanel();
  return (
    <SectionHeader
      buttons={[
        <Button
          disabled={isOpen || !space}
          onClick={() => {
            openSidePanel({
              component: DeleteSpace,
              title: "Delete space",
              props: { space: space! },
            });
          }}
        >
          Delete space
        </Button>,
      ]}
      loading={!space}
      title={space?.name}
    />
  );
};

export default SpaceDetailsHeader;
